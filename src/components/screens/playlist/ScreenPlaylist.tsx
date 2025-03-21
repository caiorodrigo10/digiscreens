import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, Share2, FileUp, LayoutList, SlidersHorizontal, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Media } from '@/types/media';
import { mockMedias } from '../../../data/mockMedias';
import { v4 as uuidv4 } from 'uuid';
import PlaylistItem from './components/PlaylistItem';
import MediaSelector from './components/MediaSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the playlist item type
interface PlaylistItem {
  id: string;
  mediaId: string;
  order: number;
  duration?: number; // in seconds, custom duration if needed
}

// Create a type that combines the playlist item with the media data
interface PlaylistItemWithMedia extends PlaylistItem {
  media: Media;
}

interface ScreenPlaylistProps {
  screenId: string;
}

const ScreenPlaylist: React.FC<ScreenPlaylistProps> = ({ screenId }) => {
  const [playlist, setPlaylist] = useState<PlaylistItemWithMedia[]>([]);
  const [isAddMediaDialogOpen, setIsAddMediaDialogOpen] = useState(false);
  const [isReplicateDialogOpen, setIsReplicateDialogOpen] = useState(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');
  const { toast } = useToast();

  // Load mock playlist data
  useEffect(() => {
    // This would be replaced with an API call to get the actual playlist
    const mockPlaylist: PlaylistItemWithMedia[] = [
      {
        id: uuidv4(),
        mediaId: mockMedias[0].id,
        order: 0,
        media: mockMedias[0]
      },
      {
        id: uuidv4(),
        mediaId: mockMedias[1].id,
        order: 1,
        media: mockMedias[1]
      },
      {
        id: uuidv4(),
        mediaId: mockMedias[2].id,
        order: 2,
        media: mockMedias[2]
      },
      {
        id: uuidv4(),
        mediaId: mockMedias[3].id,
        order: 3,
        media: mockMedias[3]
      },
      {
        id: uuidv4(),
        mediaId: mockMedias[4].id,
        order: 4,
        media: mockMedias[4]
      },
      {
        id: uuidv4(),
        mediaId: mockMedias[5].id,
        order: 5,
        media: mockMedias[5]
      }
    ];
    
    setPlaylist(mockPlaylist);
  }, [screenId]);

  // Calculate total duration of the playlist
  const getTotalDuration = () => {
    const totalSeconds = playlist.reduce((total, item) => {
      const duration = item.duration || item.media.duration || 0;
      return total + duration;
    }, 0);
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}m ${seconds}s`;
  };

  // Handle adding media to playlist
  const handleAddMedia = () => {
    if (selectedMediaIds.length === 0) {
      toast({
        title: 'Nenhuma mídia selecionada',
        description: 'Selecione pelo menos uma mídia para adicionar à playlist.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new playlist items
    const newItems: PlaylistItemWithMedia[] = selectedMediaIds.map((mediaId, index) => {
      const media = mockMedias.find(m => m.id === mediaId);
      if (!media) {
        throw new Error(`Media with ID ${mediaId} not found`);
      }
      
      // Set default duration based on media type
      let duration = media.duration;
      if (media.type === 'image' && (!duration || duration < 5)) {
        duration = 10; // Default 10 seconds for images
      }
      
      return {
        id: uuidv4(),
        mediaId,
        order: playlist.length + index,
        duration,
        media
      };
    });
    
    // Add to playlist
    setPlaylist([...playlist, ...newItems]);
    
    // Reset selection and close dialog
    setSelectedMediaIds([]);
    setIsAddMediaDialogOpen(false);
    
    toast({
      title: 'Mídias adicionadas',
      description: `${newItems.length} mídia(s) adicionada(s) à playlist.`,
    });
  };

  // Handle removing media from playlist
  const handleRemoveMedia = (itemId: string) => {
    setPlaylist(playlist.filter(item => item.id !== itemId));
    
    toast({
      title: 'Mídia removida',
      description: 'A mídia foi removida da playlist.',
    });
  };
  
  // Handle replicating playlist to other screens
  const handleReplicatePlaylist = () => {
    // Aqui seria a lógica de replicação (apenas simulação no front)
    setIsReplicateDialogOpen(false);
    
    // Mostrar toast de sucesso após um pequeno delay para simular processamento
    setTimeout(() => {
      toast({
        title: "Playlist replicada com sucesso!",
        description: "A playlist foi replicada para todas as outras telas deste estabelecimento.",
      });
    }, 500);
  };

  // Handle moving media up in the playlist
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newPlaylist = [...playlist];
    const temp = newPlaylist[index];
    newPlaylist[index] = newPlaylist[index - 1];
    newPlaylist[index - 1] = temp;
    
    // Update order values
    newPlaylist.forEach((item, idx) => {
      item.order = idx;
    });
    
    setPlaylist(newPlaylist);
  };

  // Handle moving media down in the playlist
  const handleMoveDown = (index: number) => {
    if (index === playlist.length - 1) return;
    
    const newPlaylist = [...playlist];
    const temp = newPlaylist[index];
    newPlaylist[index] = newPlaylist[index + 1];
    newPlaylist[index + 1] = temp;
    
    // Update order values
    newPlaylist.forEach((item, idx) => {
      item.order = idx;
    });
    
    setPlaylist(newPlaylist);
  };
  
  // Handle duration change for a playlist item
  const handleDurationChange = (itemId: string, duration: number) => {
    const newPlaylist = playlist.map(item => {
      if (item.id === itemId) {
        return { ...item, duration };
      }
      return item;
    });
    
    setPlaylist(newPlaylist);
  };

  // Handle saving the playlist
  const handleSavePlaylist = () => {
    // This would be replaced with an API call to save the playlist
    toast({
      title: 'Playlist salva',
      description: 'A lista de reprodução foi salva com sucesso.',
    });
  };

  return (
    <Card className="shadow-sm w-full">
      <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Lista de reprodução</h3>
            <div className="text-sm text-muted-foreground bg-muted/40 px-2 py-1 rounded-full">
              {playlist.length} mídia{playlist.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'list' | 'grid')} className="mr-1 md:mr-2">
              <TabsList className="h-8">
                <TabsTrigger value="list" className="px-1 md:px-2 h-8">
                  <LayoutList className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="grid" className="px-1 md:px-2 h-8">
                  <SlidersHorizontal className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Dialog open={isAddMediaDialogOpen} onOpenChange={setIsAddMediaDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Incluir mídia
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Dialog open={isReplicateDialogOpen} onOpenChange={setIsReplicateDialogOpen}>
              <DialogTrigger asChild>
                <span className="hidden">Replicar Playlist</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Replicar Playlist</DialogTitle>
                  <DialogDescription>
                    Deseja replicar esta playlist para todas as outras telas deste estabelecimento?
                    Esta ação substituirá as playlists existentes nas outras telas.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsReplicateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleReplicatePlaylist}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddMediaDialogOpen} onOpenChange={setIsAddMediaDialogOpen}>
              <DialogTrigger asChild>
                <span className="hidden">Abrir dialog</span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Mídias à Playlist</DialogTitle>
                </DialogHeader>
                <MediaSelector 
                  medias={mockMedias}
                  selectedMediaIds={selectedMediaIds}
                  onSelectionChange={setSelectedMediaIds}
                  onCancel={() => setIsAddMediaDialogOpen(false)}
                  onConfirm={handleAddMedia}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Playlist Content */}
        <div className="rounded-md overflow-hidden">
          {playlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">Playlist vazia</h4>
              <p className="text-muted-foreground mb-6 max-w-md">
                Adicione mídias à playlist para que sejam exibidas na tela em sequência.
              </p>
              <Button 
                onClick={() => setIsAddMediaDialogOpen(true)}
                className="gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar mídia
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px] md:h-[500px]">
              <div className="divide-y px-1">
                {playlist.map((item, index) => (
                  <PlaylistItem 
                    key={item.id}
                    item={item}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === playlist.length - 1}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onRemove={handleRemoveMedia}
                    onDurationChange={handleDurationChange}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        {/* Playlist Footer */}
        {playlist.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 pt-2">
            <div className="flex items-center gap-2 bg-muted/30 px-2 md:px-3 py-1.5 rounded-md w-full md:w-auto">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">
                Duração total: <span className="text-primary">{getTotalDuration()}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
              <Dialog open={isReplicateDialogOpen} onOpenChange={setIsReplicateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 px-2 md:px-3">
                    <Copy className="h-4 w-4" />
                    <span className="hidden md:inline">Replicar</span>
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button variant="outline" size="sm" className="gap-1 px-2 md:px-3">
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline">Compartilhar</span>
              </Button>
              <Button size="sm" onClick={handleSavePlaylist} className="gap-1">
                Salvar playlist
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScreenPlaylist;
