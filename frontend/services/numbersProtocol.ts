import { CaptureLib } from '@numbersprotocol/capture-lib';
import { Web3Storage } from 'web3.storage';

export class NumbersProtocolService {
  private captureLib: CaptureLib;
  private storage: Web3Storage;

  constructor() {
    this.captureLib = new CaptureLib({
      networkId: process.env.NEXT_PUBLIC_NUMBERS_NETWORK_ID,
      privateKey: process.env.NEXT_PUBLIC_NUMBERS_PRIVATE_KEY,
    });

    this.storage = new Web3Storage({ 
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN 
    });
  }

  async captureMedia(file: File, metadata: {
    refugeeId: string;
    location: string;
    description: string;
    category: string;
  }) {
    // Create a capture with metadata and signatures
    const capture = await this.captureLib.createCapture({
      asset: file,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        application: 'Refugee Identity Issuer',
        captureType: 'REFUGEE_DOCUMENTATION'
      }
    });

    // Sign the capture
    const signedCapture = await this.captureLib.sign(capture);

    // Store the capture on Web3.Storage
    const cid = await this.storage.put([
      new File([JSON.stringify(signedCapture)], 'capture.json')
    ]);

    // Register the capture on Numbers Protocol
    const registration = await this.captureLib.register({
      capture: signedCapture,
      cid,
      network: 'testnet' // or 'mainnet' for production
    });

    return {
      cid,
      registration
    };
  }

  async verifyCaptureAuthenticity(cid: string) {
    const capture = await this.captureLib.getCapture(cid);
    return this.captureLib.verify(capture);
  }
}

export const numbersProtocol = new NumbersProtocolService();