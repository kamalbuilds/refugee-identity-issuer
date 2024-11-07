'use client';

import { useState, useEffect } from 'react';
import { useSilk } from '../contexts/SilkProvider';

export default function BiometricVerification() {
  const { silk, requestSBT } = useSilk();
  const [verificationStatus, setVerificationStatus] = useState<{
    fingerprint: boolean;
    faceId: boolean;
    irisScanned: boolean;
  }>({
    fingerprint: false,
    faceId: false,
    irisScanned: false,
  });

  const handleBiometricCapture = async (type: 'fingerprint' | 'faceId' | 'irisScanned') => {
    try {
      // Request biometric verification using Silk
      const result = await requestSBT('kyc');
      
      if (result) {
        setVerificationStatus(prev => ({
          ...prev,
          [type]: true
        }));

        // Store verification result
        await fetch('/api/biometric-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            verificationData: result,
          }),
        });
      }
    } catch (error) {
      console.error('Biometric verification failed:', error);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Biometric Verification</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BiometricCard
          title="Fingerprint"
          verified={verificationStatus.fingerprint}
          onCapture={() => handleBiometricCapture('fingerprint')}
        />
        <BiometricCard
          title="Face ID"
          verified={verificationStatus.faceId}
          onCapture={() => handleBiometricCapture('faceId')}
        />
        <BiometricCard
          title="Iris Scan"
          verified={verificationStatus.irisScanned}
          onCapture={() => handleBiometricCapture('irisScanned')}
        />
      </div>
    </div>
  );
}

function BiometricCard({ 
  title, 
  verified, 
  onCapture 
}: { 
  title: string; 
  verified: boolean; 
  onCapture: () => void;
}) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className={`text-sm ${verified ? 'text-green-500' : 'text-gray-500'}`}>
          {verified ? 'Verified' : 'Not Verified'}
        </span>
        <button
          onClick={onCapture}
          disabled={verified}
          className={`px-4 py-2 rounded ${
            verified 
              ? 'bg-gray-200 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {verified ? 'Completed' : 'Capture'}
        </button>
      </div>
    </div>
  );
}