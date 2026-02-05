'use client'

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { ABI, CONTRACT_ADDRESS } from "../constants"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function CoffeeForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  // The hook to write to the blockchain
  const { data: hash, mutate, isPending } = useWriteContract()

  const handleBuyCoffee = async () => {

    console.log('Buying coffee...')
    mutate({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'buyCoffee',
      args: [name, message],
      value: parseEther('0.001'), // Sending 0.001 ETH
    })
  }

  // Hook to track the transaction status
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md mx-auto">
      <ConnectButton />

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} className="border p-2 rounded text-black" />
      <input placeholder="Message" onChange={(e) => setMessage(e.target.value)} className="border p-2 rounded text-black" />

      <button
        disabled={isPending || isConfirming}
        onClick={handleBuyCoffee}
        className="bg-yellow-500 text-white p-2 rounded font-bold"
      >
        {isPending || isConfirming ? 'Processing...' : 'Buy Coffee for 0.001 ETH'}
      </button>

      {isSuccess && <p className="text-green-500">Coffee bought! Transaction: {hash}</p>}
    </div>
  )
}