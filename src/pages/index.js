import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { open } = useWeb3Modal()
  const { address, isConnected} = useWeb3ModalAccount()

  const formatAddress = (address) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};
  return (
    <div>
    <h1 className='text-lg'>hello</h1>
    <>
      <button onClick={() => open()} className='btn glass'>{isConnected ? formatAddress(address) : "Connect Wallet"}</button>
    </>
    </div>
  )
  }
