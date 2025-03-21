
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, Download } from "lucide-react";

interface SyncDownloadStepProps {
  onProceed: () => void;
}

export const SyncDownloadStep: React.FC<SyncDownloadStepProps> = ({ onProceed }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Smartphone className="h-16 w-16 text-primary" />
        <div>
          <h3 className="text-lg font-medium">1. Baixe o aplicativo DigiScreens</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Disponível na Google Play Store
          </p>
        </div>
        
        {/* Fake QR Code placeholder */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 my-4">
          <div className="bg-muted w-44 h-44 flex items-center justify-center text-muted-foreground">
            QR Code
          </div>
        </div>
        
        <Button onClick={onProceed} className="gap-2">
          <Download className="h-4 w-4" /> 
          Já baixei o aplicativo
        </Button>
      </div>
    </div>
  );
};
