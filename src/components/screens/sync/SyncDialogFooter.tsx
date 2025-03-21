
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

type StepType = 'code' | 'verifying' | 'complete';

interface SyncDialogFooterProps {
  step: StepType;
  syncCode: string;
  onCancel: () => void;
  onBack: () => void;
  onVerifyCode: () => void;
}

export const SyncDialogFooter: React.FC<SyncDialogFooterProps> = ({
  step,
  syncCode,
  onCancel,
  onBack,
  onVerifyCode
}) => {
  return (
    <DialogFooter className="flex-col sm:flex-row sm:justify-between">
      {step === 'code' && (
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onVerifyCode}>
            Continuar
          </Button>
        </>
      )}
      
      {step === 'complete' && (
        <Button onClick={onCancel}>
          Fechar
        </Button>
      )}
    </DialogFooter>
  );
};
