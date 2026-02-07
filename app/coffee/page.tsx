'use client'

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { parseEther, formatEther } from "viem"
import { ABI, CONTRACT_ADDRESS } from "../constants"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function CoffeeForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  // The hook to write to the blockchain
  const { data: hash, mutate, isPending } = useWriteContract()

  const { data: memos, isLoading: isLoadingMemos, refetch: refetchMemos } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getMemos',
  })

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

      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Recent Memos</h2>

        {
          isLoadingMemos && <p>Loading memos...</p>
        }

        <div className="space-y-4">
          {
            memos?.map((memo: any, index: number) => (
              <div key={index} className="p-4 border rounded shadow-sm bg-gray-50">
                <p className="font-bold text-black">"{memo.message}"</p>
                <p className="text-sm text-gray-600">From: {memo.name} ({memo.from.slice(0, 6)}...{memo.from.slice(-4)})</p>
                <p className="text-xs text-gray-400">
                  {new Date(Number(memo.timestamp) * 1000).toLocaleString()}
                </p>
              </div>
            ))
          }
        </div>

        <button
          onClick={() => refetchMemos()}
          className="mt-4 text-blue-500 underline text-sm"
        >
          Refresh Memos
        </button>
      </div>
    </div>
  )
}