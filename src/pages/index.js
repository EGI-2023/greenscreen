import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { contractAddress, contractABI } from '@/constants/contract'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useWeb3ModalAccount()

  const [isRegistered, setIsRegistered] = useState(false)
  const [balance, setBalance] = useState(0)

  const formatAddress = (address) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const registerAsIndividual = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractABI, signer)
    const getRegistered = await contract.register();
    setIsRegistered(true)
  }

  const checkIfExists = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    console.log(address)
    const check = await contract.isRegistered(address)
    const balance = await contract.balanceOf(address)
    setIsRegistered(check)
    setBalance(Number(balance))
    console.log(check)
    console.log(Number(balance))

  }
  
  const renderButton = () => {
    if (isConnected) {
    if (isRegistered) {
      return (
        <div className="">
        <br />
        <p className='text-lg text-black'>Welcome back! Your current Red Carbon Credits are: {Number(balance)}</p>
        </div>
      )
    }
    else {
      return (
        <div>
          <br />
          <button onClick={() => registerAsIndividual()} className="btn btn-glass mr-4">Register as Individual</button>
          <button onClick={() => open()} className="btn btn-glass">Register as Enterprise</button>
        </div>
      )
    }
  }
  }


  useEffect(() => {
    if (isConnected) {
      checkIfExists()
    }
  }, [isConnected]);

  return (
    <div>
      <div className=" bg-gradient-to-r from-green-400 to-lime-300 via-emerald-400 min-h-screen">
      <div className="animate-bounce hover:scale-150 transition translate-y-12 translate-x-24 delay-700 duration-700">
          <Image 
            src="/head-earth.png"
            alt="Rotating Earth"
            width={400} 
            height={400} 
          />
        </div>
        <div className="hero-content text-center flex flex-row">
          <div className="max-w-md -mt-32">
            <h1 className=" text-7xl font-bold text-black">Green$creen</h1>
            <br />
            <p className="mb-5 bg-gradient-to-r from-cyan-400 to-cyan-500 via-blue-400 rounded-md border-2 border-stone-900 p-8 text-black text-justify shadow-lg">Green$creen combines IoT and blockchain to accurately track vehicle emissions, minting RED tokens as &apos;environmental debt&apos;. This groundbreaking approach promotes transparency and incentivizes emission reduction, reshaping carbon management.</p>
            <button onClick={() => open()} className="btn btn-glass">
              {isConnected ? formatAddress(address) : "Connect Wallet"}
            </button>
            {renderButton()}
            <Image 
            src="/red1600px.png"
            alt="Rotating Earth"
            width={400} 
            height={400} 
            className="mt-4"
          />

          </div>
        </div>
      </div>

    </div>
  )
}
