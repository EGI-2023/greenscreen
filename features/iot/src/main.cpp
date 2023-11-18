#include <Arduino.h>
#include <SHT1x-ESP.h>
#include <MQ135.h>
#include <vector>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define SHT10_DATA_PIN  21
#define SHT10_CLOCK_PIN 22
#define MQ135_ANALOG_PIN 34

// Define LED Pins
#define GREEN_LED_PIN 25
#define YELLOW_LED_PIN 26
#define RED_LED_PIN 23

// Define Pin for Start/Stop Button
#define BUTTON_PIN 32

// Define hypothetical exhaust flow rate in m³/s
#define EXHAUST_FLOW_RATE 0.05

SHT1x sht10(SHT10_DATA_PIN, SHT10_CLOCK_PIN);
MQ135 mq135_sensor(MQ135_ANALOG_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Variables for Measurement Control
bool isMeasuring = false;
unsigned long startTime = 0;
unsigned long stopTime = 0;

// Structure to store CO2 readings
struct CO2Reading {
  float concentration;
  unsigned long timestamp;
};

std::vector<CO2Reading> co2Readings;
void calculateAndDisplayResults();
void measureCO2();
float calculateCO2Emissions(float co2_ppm, float flow_rate_m3s);


void setup() {
  Serial.begin(115200);
  Serial.println("CO2 Emissions Measurement System");

  //Wire begin for LCD
  Wire.begin(19, 18);

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  delay(100);

  // Initialize LED Pins
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(YELLOW_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  digitalWrite(BUTTON_PIN, LOW);

  // Initialize Button Pin
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("CO2 Emissions");
  lcd.setCursor(0, 1);
  lcd.print("System Ready");
  delay(2000);
}

void loop() {
  // Check if the button is pressed
  if (digitalRead(BUTTON_PIN) == LOW) {
    if (isMeasuring) {
      // Stop measuring
      stopTime = millis();
      isMeasuring = false;
      calculateAndDisplayResults();
    } else {
      // Start measuring
      startTime = millis();
      isMeasuring = true;
      //Displaying message
      lcd.clear();
      lcd.print("Measuring scaled");
      lcd.setCursor(0, 1);
      lcd.print("Press to stop");
    }
    delay(500); // Debounce delay
  }

  if (isMeasuring) {
    // Continuously measure CO2 levels and calculate emissions
    measureCO2();
  }
}

void measureCO2() {
  CO2Reading reading;
  reading.concentration = mq135_sensor.getCorrectedPPM(sht10.readTemperatureC(), sht10.readHumidity());
  reading.timestamp = millis();
  co2Readings.push_back(reading);

  // Control LEDs based on CO2 concentration
  if (reading.concentration < 1000) {
    digitalWrite(GREEN_LED_PIN, HIGH);
    digitalWrite(YELLOW_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, LOW);
  } else if (reading.concentration >= 1000 && reading.concentration < 2000) {
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(YELLOW_LED_PIN, HIGH);
    digitalWrite(RED_LED_PIN, LOW);
  } else {
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(YELLOW_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, HIGH);
  }

  // Optional: Real-time display or logging of current reading
  Serial.print("CO2 Concentration: ");
  Serial.print(reading.concentration);
  Serial.println(" ppm");
}

void calculateAndDisplayResults() {
  float totalEmissions = 0;
  for (size_t i = 1; i < co2Readings.size(); i++) {
    float timeIntervalHours = (co2Readings[i].timestamp - co2Readings[i - 1].timestamp) / 3600000.0; // Convert milliseconds to hours
    float emission = calculateCO2Emissions(co2Readings[i].concentration, EXHAUST_FLOW_RATE) * timeIntervalHours;
    totalEmissions += emission;
  }

  // Display results
  Serial.print("Total Emissions: ");
  Serial.print(totalEmissions);
  Serial.println(" tonnes");
  lcd.clear();
  lcd.print("Total Emissions:");
  lcd.setCursor(0, 1);
  lcd.print(totalEmissions);
  lcd.print(" tonnes");
  co2Readings.clear();

  // Clear readings for next measurement
  co2Readings.clear();
}

float calculateCO2Emissions(float co2_ppm, float flow_rate_m3s) {
    float mass_fraction = co2_ppm / 1000000.0;
    float density_of_exhaust = 1.204; // Approximate density of exhaust gas (kg/m³)
    float mass_of_CO2_per_second = flow_rate_m3s * density_of_exhaust * mass_fraction;
    float mass_of_CO2_per_hour_in_tonnes = mass_of_CO2_per_second * 3600 * 0.001;
    // Convert to tonnes per hour and return result scaled by 100000 for demonstration purposes
    return mass_of_CO2_per_hour_in_tonnes * 100000;
}