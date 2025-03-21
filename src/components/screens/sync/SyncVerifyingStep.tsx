
import React from 'react';

export const SyncVerifyingStep: React.FC = () => {
  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg">Verificando código...</p>
      </div>
    </div>
  );
};
