'use client'

import { useState } from 'react'
import { useSilk } from '@/contexts/SilkProvider'

export default function VerificationForm() {
  const { requestSBT, userAddress } = useSilk()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [verificationData, setVerificationData] = useState({
    name: '',
    location: '',
    refugeeId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      // Request KYC SBT
      const sbtResult = await requestSBT('kyc')
      
      if (sbtResult) {
        // Verify refugee status with the API
        const response = await fetch('/api/verify-refugee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: userAddress,
            ...verificationData,
          }),
        })

        if (response.ok) {
          setStatus('success')
        } else {
          throw new Error('Verification failed')
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={verificationData.name}
          onChange={(e) => setVerificationData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Location
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={verificationData.location}
          onChange={(e) => setVerificationData(prev => ({ ...prev, location: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Refugee ID (if available)
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={verificationData.refugeeId}
          onChange={(e) => setVerificationData(prev => ({ ...prev, refugeeId: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
      >
        {status === 'loading' ? 'Verifying...' : 'Verify Identity'}
      </button>

      {status === 'success' && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          Verification successful! Your identity has been verified and recorded on-chain.
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          Verification failed. Please try again or contact support.
        </div>
      )}
    </form>
  )
}