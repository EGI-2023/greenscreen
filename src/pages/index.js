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
        <div>
        <br />
        <p className='text-lg'>Welcome back! Your current Red Carbon Credits are: {Number(balance)}</p>
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
      <div className="hero min-h-screen" style={{ backgroundImage: 'url(/bg.png)' }}>
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className=" text-5xl font-bold">Green$creen</h1>
            <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button onClick={() => open()} className="btn btn-glass">
              {isConnected ? formatAddress(address) : "Connect Wallet"}
            </button>
            {renderButton()}

          </div>
        </div>
      </div>

    </div>
  )
}
