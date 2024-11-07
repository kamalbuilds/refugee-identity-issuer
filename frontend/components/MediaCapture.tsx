'use client';

import { useState } from 'react';
import { numbersProtocol } from '@/services/numbersProtocol';
import { useSilk } from '@/contexts/SilkProvider';

export default function MediaCapture() {
  const { userAddress } = useSilk();
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setStatus] = useState<'idle' | 'capturing' | 'success' | 'error'>('idle');
  const [captureInfo, setCaptureInfo] = useState<{cid: string; registration: any} | null>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !userAddress) return;
    
    setIsCapturing(true);
    setStatus('capturing');
    const file = e.target.files[0];

    try {
      const result = await numbersProtocol.captureMedia(file, {
        refugeeId: userAddress,
        location: 'Current Location', // Could be obtained from geolocation
        description: 'Refugee documentation media',
        category: file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO'
      });

      setCaptureInfo(result);
      setStatus('success');
    } catch (error) {
      console.error('Media capture failed:', error);
      setStatus('error');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Secure Media Capture</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          onChange={handleCapture}
          accept="image/*,video/*"
          className="hidden"
          id="media-capture"
          disabled={isCapturing}
        />
        <label
          htmlFor="media-capture"
          className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500"
        >
          {isCapturing ? 'Processing...' : 'Capture Media'}
        </label>

        {captureStatus === 'success' && captureInfo && (
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-green-700">Media captured and verified successfully!</p>
            <p className="text-sm text-gray-600 mt-2">
              Content ID: {captureInfo.cid}
            </p>
          </div>
        )}

        {captureStatus === 'error' && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            Capture failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}