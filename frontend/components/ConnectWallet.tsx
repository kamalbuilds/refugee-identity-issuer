'use client'

import { useSilk } from '@/contexts/SilkProvider'

export default function ConnectWallet() {
  const { connect } = useSilk()

  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">Connect Your Wallet</h2>
      <button
        onClick={connect}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Connect with Silk
      </button>
    </div>
  )
}