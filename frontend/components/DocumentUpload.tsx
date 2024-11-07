'use client';

import { useState } from 'react';
import { DocumentInfo } from '@/app/types';

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('/api/document-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setDocuments(prev => [...prev, data.document]);
      }
    } catch (error) {
      console.error('Document upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Document Upload</h2>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleDocumentUpload}
            accept="image/*,.pdf"
            className="hidden"
            id="document-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="document-upload"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map(doc => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ document }: { document: DocumentInfo }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{document.type}</span>
        <span className={`text-sm ${
          document.verificationStatus === 'verified' 
            ? 'text-green-500' 
            : document.verificationStatus === 'rejected'
            ? 'text-red-500'
            : 'text-yellow-500'
        }`}>
          {document.verificationStatus}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <p>Document #: {document.documentNumber}</p>
        <p>Issued: {new Date(document.issueDate).toLocaleDateString()}</p>
        {document.expiryDate && (
          <p>Expires: {new Date(document.expiryDate).toLocaleDateString()}</p>
        )}
        <p>Country: {document.issuingCountry}</p>
      </div>
    </div>
  );
}