
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Tv, Clock, Volume2, VolumeX, Globe, Footprints, Trash, Edit, RefreshCw } from "lucide-react";
import { ScreenConfig, ScreenType, getScreenTypeLabel } from '@/types/screen';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import SyncScreenDialog from './SyncScreenDialog';

interface ScreensListProps {
  screens: ScreenConfig[];
  onDeleteScreen: (id: string) => void;
  onEditScreen: (id: string) => void;
  onSyncComplete?: (id: string) => void;
}

const ScreenTypeIcon = ({ type }: { type: ScreenType }) => {
  switch (type) {
    case 'tv_horizontal':
      return <Tv className="h-5 w-5" />;
    case 'tv_vertical':
      return <Smartphone className="h-5 w-5" />;
    case 'led':
      return <Monitor className="h-5 w-5" />;
    default:
      return <Monitor className="h-5 w-5" />;
  }
};

const ScreensList: React.FC<ScreensListProps> = ({ screens, onDeleteScreen, onEditScreen, onSyncComplete }) => {
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<ScreenConfig | null>(null);
  const navigate = useNavigate();
  const { id: terminalId } = useParams<{ id: string }>();

  const handleOpenSyncDialog = (screen: ScreenConfig) => {
    setSelectedScreen(screen);
    setSyncDialogOpen(true);
  };

  const handleSyncComplete = () => {
    if (selectedScreen && onSyncComplete) {
      onSyncComplete(selectedScreen.id);
    }
  };

  if (screens.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Nenhuma tela configurada para este terminal.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {screens.map((screen) => (
        <Card key={screen.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-muted p-4 flex items-center justify-center sm:w-16">
                <ScreenTypeIcon type={screen.type} />
              </div>
              <div className="p-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 
                      className="font-medium cursor-pointer hover:text-primary hover:underline"
                      onClick={() => navigate(`/terminais/${terminalId}/screens/${screen.id}`)}
                    >
                      {screen.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{getScreenTypeLabel(screen.type)}</p>
                  </div>
                  <Badge variant={screen.status === 'active' ? 'default' : 'secondary'}>
                    {screen.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{screen.updateCycle} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {screen.audioEnabled ? 
                      <><Volume2 className="h-4 w-4 text-muted-foreground" /><span>Som ativado</span></> : 
                      <><VolumeX className="h-4 w-4 text-muted-foreground" /><span>Som desativado</span></>
                    }
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Fuso: {screen.timezone.split('/')[1].replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Footprints className="h-4 w-4 text-muted-foreground" />
                    <span>{screen.footerEnabled ? 'Rodapé ativado' : 'Rodapé desativado'}</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 p-4 bg-muted/10 justify-end">
                {screen.status === 'inactive' && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-500"
                    onClick={() => handleOpenSyncDialog(screen)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sincronizar</span>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => onEditScreen(screen.id)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover tela</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover a tela "{screen.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDeleteScreen(screen.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Sync Screen Dialog */}
      {selectedScreen && (
        <SyncScreenDialog
          open={syncDialogOpen}
          onOpenChange={setSyncDialogOpen}
          screenId={selectedScreen.id}
          screenName={selectedScreen.name}
          onSyncComplete={handleSyncComplete}
        />
      )}
    </div>
  );
};

export default ScreensList;
