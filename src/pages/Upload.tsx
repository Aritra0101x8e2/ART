import React from 'react';
import { Navigate } from 'react-router-dom';
import { UploadForm } from '../components/upload/UploadForm';
import { useAuth } from '../context/AuthContext';

export const Upload: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <UploadForm />
      </div>
    </div>
  );
};