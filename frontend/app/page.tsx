'use client'

import { useState } from 'react'
import { SilkProvider } from '@/contexts/SilkProvider'
import VerificationForm from '@/components/VerificationForm'
import ConnectWallet from '@/components/ConnectWallet'
import { useSilk } from '@/contexts/SilkProvider'

export default function Home() {
  return (
    <SilkProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Refugee Identity Verification
        </h1>
        <MainContent />
      </div>
    </SilkProvider>
  )
}

function MainContent() {
  const { connected } = useSilk()
  
  return (
    <div className="max-w-2xl mx-auto">
      {!connected ? (
        <ConnectWallet />
      ) : (
        <VerificationForm />
      )}
    </div>
  )
}