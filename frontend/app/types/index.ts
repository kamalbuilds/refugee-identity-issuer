export interface RefugeeProfile {
    id: string;
    email: string;
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    campId: string;
    registrationDate: string;
    biometricData: {
      fingerprint?: boolean;
      faceId?: boolean;
      irisScanned?: boolean;
    };
    documents: DocumentInfo[];
    verificationStatus: 'pending' | 'verified' | 'rejected';
    verificationHistory: VerificationEvent[];
  }
  
  export interface DocumentInfo {
    id: string;
    type: 'passport' | 'id_card' | 'birth_certificate' | 'unhcr_document' | 'other';
    documentNumber: string;
    issueDate: string;
    expiryDate?: string;
    issuingCountry: string;
    documentImage: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  }
  
  export interface VerificationEvent {
    timestamp: string;
    type: 'document_upload' | 'biometric_capture' | 'verification_status_change';
    status: 'success' | 'failure';
    details: string;
    verifiedBy?: string;
  }