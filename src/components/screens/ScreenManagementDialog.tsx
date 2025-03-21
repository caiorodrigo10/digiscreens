
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import ScreenTypeSelector from "./ScreenTypeSelector";
import ScreenConfigForm from "./ScreenConfigForm";
import { ScreenType, ScreenConfig } from '@/types/screen';

interface ScreenManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenAdded: (screen: ScreenConfig) => void;
}

const ScreenManagementDialog: React.FC<ScreenManagementDialogProps> = ({
  isOpen,
  onClose,
  onScreenAdded,
}) => {
  const [step, setStep] = useState<'select-type' | 'configure'>('select-type');
  const [selectedType, setSelectedType] = useState<ScreenType>('tv_horizontal');
  const { toast } = useToast();

  const handleTypeSelection = (type: ScreenType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    setStep('configure');
  };

  const handleBack = () => {
    setStep('select-type');
  };

  const handleSubmit = (values: Omit<ScreenConfig, 'id' | 'status'>) => {
    // Create a new screen configuration with a unique ID
    const newScreen: ScreenConfig = {
      ...values,
      id: uuidv4(),
      status: 'active',
    };

    // Add the new screen
    onScreenAdded(newScreen);

    // Show success toast
    toast({
      title: "Tela adicionada com sucesso",
      description: `${values.name} foi configurada e adicionada ao terminal.`,
    });

    // Reset and close the dialog
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('select-type');
    setSelectedType('tv_horizontal');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'select-type' ? 'Adicionar Nova Tela' : 'Configurar Tela'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select-type' ? (
          <>
            <div className="py-4">
              <h3 className="text-base font-medium mb-4">Selecione o tipo de tela:</h3>
              <ScreenTypeSelector value={selectedType} onChange={handleTypeSelection} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetAndClose}>
                Cancelar
              </Button>
              <Button onClick={handleContinue}>
                Continuar
              </Button>
            </div>
          </>
        ) : (
          <ScreenConfigForm
            type={selectedType}
            onSubmit={handleSubmit}
            onCancel={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScreenManagementDialog;
