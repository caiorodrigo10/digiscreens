
import React from 'react';
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncCodeStepProps {
  syncCode: string;
  generatedCode: string;
  countdownFormatted: string;
  onSyncCodeChange: (value: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const SyncCodeStep: React.FC<SyncCodeStepProps> = ({
  syncCode,
  generatedCode,
  countdownFormatted,
  onSyncCodeChange,
  onProceed,
  onBack
}) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-muted/30 p-4 rounded-lg w-full">
          <h3 className="text-lg font-medium mb-1">Digite o código na TV</h3>
          <div className="text-3xl font-mono font-bold tracking-widest text-primary my-4">
            {generatedCode}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expira em {countdownFormatted}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Digite o código acima na TV para sincronizar a tela.
        </p>
      </div>
    </div>
  );
};
