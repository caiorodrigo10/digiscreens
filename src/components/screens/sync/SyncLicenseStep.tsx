
import React from 'react';
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

interface SyncLicenseStepProps {
  licenseCode: string;
  generatedLicense: string;
  onLicenseChange: (value: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const SyncLicenseStep: React.FC<SyncLicenseStepProps> = ({
  licenseCode,
  generatedLicense,
  onLicenseChange,
  onProceed,
  onBack
}) => {
  const LICENSE_CODE_LENGTH = 5;
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <Key className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Preencher número de licença</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Digite o número de licença exibido no dispositivo para sincronizar playlist
          </p>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg w-full mt-2">
          <div className="text-3xl font-mono font-bold tracking-widest text-primary my-2">
            {generatedLicense}
          </div>
          <p className="text-xs text-muted-foreground">
            Use este código de licença para teste
          </p>
        </div>
        
        <div className="w-full mt-4">
          <p className="text-sm font-medium mb-2">Digite o código de licença:</p>
          <InputOTP 
            maxLength={LICENSE_CODE_LENGTH} 
            value={licenseCode} 
            onChange={onLicenseChange} 
            render={({ slots }) => (
              <InputOTPGroup className="gap-2 justify-center">
                {slots.map((slot, i) => (
                  <InputOTPSlot 
                    key={i}
                    index={i}
                    {...slot} 
                    className={cn("w-12 h-14 text-xl")}
                  />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
      </div>
    </div>
  );
};
