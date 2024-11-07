'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { initSilk } from '@silk-wallet/silk-wallet-sdk'

interface SilkContextType {
  silk: any;
  connected: boolean;
  userAddress: string | null;
  connect: () => Promise<void>;
  requestSBT: (type: 'kyc' | 'phone') => Promise<string | null>;
}

const SilkContext = createContext<SilkContextType | undefined>(undefined)

export function SilkProvider({ children }: { children: React.ReactNode }) {
  const [silk, setSilk] = useState<any>(null)
  const [connected, setConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  useEffect(() => {
    const initializeSilk = async () => {
      const silkProvider = initSilk()
      setSilk(silkProvider)
    }
    initializeSilk()
  }, [])

  const connect = async () => {
    try {
      if (!silk) return
      await silk.login()
      const accounts = await silk.request({ method: 'eth_accounts' })
      setUserAddress(accounts[0])
      setConnected(true)
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  const requestSBT = async (type: 'kyc' | 'phone') => {
    try {
      if (!silk || !connected) return null
      return await silk.requestSBT(type)
    } catch (error) {
      console.error('SBT request error:', error)
      return null
    }
  }

  return (
    <SilkContext.Provider value={{ silk, connected, userAddress, connect, requestSBT }}>
      {children}
    </SilkContext.Provider>
  )
}

export const useSilk = () => {
  const context = useContext(SilkContext)
  if (context === undefined) {
    throw new Error('useSilk must be used within a SilkProvider')
  }
  return context
}