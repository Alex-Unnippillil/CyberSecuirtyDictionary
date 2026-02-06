'use client';

import React, { useState } from 'react';
import { MAX_UPLOAD_SIZE } from '../utils/limits';

const friendlySize = `${Math.round(MAX_UPLOAD_SIZE / (1024 * 1024))} MB`;

/**
 * Upload component with client-side size validation.
 * Shows a friendly error message if the file exceeds the server limit.
 */
const Upload: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_SIZE) {
      setError(`File is too large. Maximum size is ${friendlySize}.`);
      event.target.value = '';
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Upload failed.');
      }
    } catch (err) {
      setError('Upload failed.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Upload;
