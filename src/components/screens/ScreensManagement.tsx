
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ScreenManagementDialog from "./ScreenManagementDialog";
import ScreensList from "./ScreensList";
import { ScreenConfig } from '@/types/screen';

interface ScreensManagementProps {
  terminalId: string;
  initialScreens?: ScreenConfig[];
}

const ScreensManagement: React.FC<ScreensManagementProps> = ({ terminalId, initialScreens = [] }) => {
  const [screens, setScreens] = useState<ScreenConfig[]>(initialScreens);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddScreen = (screen: ScreenConfig) => {
    setScreens((prev) => [...prev, screen]);
  };

  const handleDeleteScreen = (id: string) => {
    setScreens((prev) => prev.filter((screen) => screen.id !== id));
    toast({
      title: "Tela removida",
      description: "A tela foi removida com sucesso.",
    });
  };

  const handleEditScreen = (id: string) => {
    // Future functionality - for now just show a toast
    toast({
      title: "Em desenvolvimento",
      description: "A edição de telas será implementada em breve.",
    });
  };

  const handleSyncComplete = (id: string) => {
    // Update the screen status to active after successful sync
    setScreens((prev) => 
      prev.map((screen) => 
        screen.id === id 
          ? { ...screen, status: 'active' } 
          : screen
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Telas do Terminal</h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          size="sm"
          className="gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Tela
        </Button>
      </div>

      <ScreensList
        screens={screens}
        onDeleteScreen={handleDeleteScreen}
        onEditScreen={handleEditScreen}
        onSyncComplete={handleSyncComplete}
      />

      <ScreenManagementDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onScreenAdded={handleAddScreen}
      />
    </div>
  );
};

export default ScreensManagement;
