"use client"

import '@/styles/globals.css'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = 'ceb53595786d0b547255c1fb23c958f7'

// 2. Set chains
const sepolia = {
  chainId: 80001,
  name: 'sepolia',
  currency: 'sepolia',
  explorerUrl: 'https://sepolia.etherscan.io/',
  rpcUrl: 'https://ethereum-sepolia.publicnode.com'
}

// 3. Create modal
const metadata = {
  name: 'Green$creen',
  description: 'My Website description',
  // url: 'https://mywebsite.com',
  // icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [sepolia],
  projectId,
    //...
    themeVariables: {
      '--w3m-color-mix': '#00BB7F',
      '--w3m-color-mix-strength': 40
    }
})

export function Web3ModalProvider({ children }) {
  return children;
}



export default function App({ Component, pageProps }) {
  return (
    <div >
    <Web3ModalProvider>
  <Component {...pageProps} />
  </Web3ModalProvider>
  </div>
  )
}
