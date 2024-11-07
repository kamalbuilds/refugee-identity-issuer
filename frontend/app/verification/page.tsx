'use client';

import { useState } from 'react';
import BiometricVerification from '@/components/BiometricVerification';
import DocumentUpload from '@/components/DocumentUpload';
import { RefugeeProfile } from '../types';

export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<RefugeeProfile>>({});

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Document Upload' },
    { id: 3, title: 'Biometric Verification' },
    { id: 4, title: 'Review & Submit' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map(s => (
            <div 
              key={s.id}
              className={`flex items-center ${
                step === s.id ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === s.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}>
                {s.id}
              </div>
              <span className="ml-2">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <PersonalInformationForm
            onNext={(data) => {
              setProfile(prev => ({ ...prev, ...data }));
              setStep(2);
            }}
          />
        )}
        
        {step === 2 && (
          <DocumentUpload />
        )}
        
        {step === 3 && (
          <BiometricVerification />
        )}
        
        {step === 4 && (
          <ReviewSubmit profile={profile} />
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        
        {step < 4 && (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}