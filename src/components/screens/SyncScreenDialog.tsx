
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { SyncCodeStep } from './sync/SyncCodeStep';
import { SyncVerifyingStep } from './sync/SyncVerifyingStep';
import { SyncCompleteStep } from './sync/SyncCompleteStep';
import { SyncDialogFooter } from './sync/SyncDialogFooter';

interface SyncScreenDialogProps {
  open: boolean;
  screenId: string;
  screenName: string;
  onOpenChange: (open: boolean) => void;
  onSyncComplete?: () => void;
}

const SYNC_CODE_LENGTH = 5;

const SyncScreenDialog: React.FC<SyncScreenDialogProps> = ({
  open,
  screenId,
  screenName,
  onOpenChange,
  onSyncComplete,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'code' | 'verifying' | 'complete'>('code');
  const [syncCode, setSyncCode] = useState<string>('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [generatedCode] = useState(() => {
    // Generate a random 5-digit code
    return Math.floor(10000 + Math.random() * 90000).toString();
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep('code');
      setSyncCode('');
      setCountdown(300);
    }
  }, [open]);

  // Countdown timer for code expiration
  useEffect(() => {
    if (step !== 'code' || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown]);

  // Format countdown as mm:ss
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startSyncProcess = () => {
    setStep('verifying');
    
    // Simulate API call delay
    setTimeout(() => {
      setStep('complete');
      if (onSyncComplete) onSyncComplete();
      toast({
        title: "Sincronização concluída",
        description: "A tela foi sincronizada com sucesso.",
      });
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'code':
        return (
          <SyncCodeStep 
            syncCode={syncCode}
            generatedCode={generatedCode}
            countdownFormatted={formatCountdown()}
            onSyncCodeChange={setSyncCode}
            onProceed={startSyncProcess}
            onBack={() => {}}
          />
        );
      
      case 'verifying':
        return <SyncVerifyingStep />;
      
      case 'complete':
        return <SyncCompleteStep />;
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sincronizar Tela</DialogTitle>
          <DialogDescription>
            {screenName} - ID: {screenId}
          </DialogDescription>
        </DialogHeader>

        {renderStep()}

        <SyncDialogFooter 
          step={step}
          syncCode={syncCode}
          onCancel={() => onOpenChange(false)}
          onBack={() => {}}
          onVerifyCode={startSyncProcess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SyncScreenDialog;
