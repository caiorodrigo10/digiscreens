import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Image, Video, FileAudio, Filter, Clock } from 'lucide-react';
import { Media } from '@/types/media';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MediaSelectorProps {
  medias: Media[];
  selectedMediaIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  medias,
  selectedMediaIds,
  onSelectionChange,
  onCancel,
  onConfirm
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Get unique categories from media items
  const categories = ['all', ...new Set(medias.map(media => media.category))];
  
  // Filter medias based on search term, type and category
  const filteredMedias = medias.filter(media => {
    const matchesSearch = media.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === 'all' || media.type === activeTab;
    const matchesCategory = categoryFilter === 'all' || media.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Toggle selection of a media item
  const toggleMediaSelection = (mediaId: string) => {
    if (selectedMediaIds.includes(mediaId)) {
      onSelectionChange(selectedMediaIds.filter(id => id !== mediaId));
    } else {
      onSelectionChange([...selectedMediaIds, mediaId]);
    }
  };
  
  // Select all visible media items
  const selectAllVisible = () => {
    const visibleIds = filteredMedias.map(media => media.id);
    onSelectionChange([...new Set([...selectedMediaIds, ...visibleIds])]);
  };
  
  // Clear all selections
  const clearSelection = () => {
    onSelectionChange([]);
  };
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mídias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Categoria" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Type tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 text-xs md:text-sm px-1 md:px-2">
              Todos
            </TabsTrigger>
            <TabsTrigger value="image" className="flex-1 flex items-center gap-0.5 md:gap-1 text-xs md:text-sm px-1 md:px-2">
              <Image className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Imagens</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex-1 flex items-center gap-0.5 md:gap-1 text-xs md:text-sm px-1 md:px-2">
              <Video className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex-1 flex items-center gap-0.5 md:gap-1 text-xs md:text-sm px-1 md:px-2">
              <FileAudio className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Áudios</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Selection controls */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
          <div className="flex flex-wrap gap-2 w-full xs:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAllVisible}
              disabled={filteredMedias.length === 0}
              className="text-xs md:text-sm px-2 md:px-3 h-8 w-full xs:w-auto"
            >
              Selecionar todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              disabled={selectedMediaIds.length === 0}
              className="text-xs md:text-sm px-2 md:px-3 h-8 w-full xs:w-auto"
            >
              Limpar seleção
            </Button>
          </div>
          
          <Badge variant="outline" className="bg-primary/10 w-full xs:w-auto text-center">
            {selectedMediaIds.length} selecionado(s)
          </Badge>
        </div>
      </div>
      
      {/* Media grid */}
      <ScrollArea className="h-[350px] md:h-[450px] border rounded-md p-2">
        {filteredMedias.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <p className="text-muted-foreground text-sm">
              Nenhuma mídia encontrada com os filtros atuais.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:gap-3 p-1">
            {filteredMedias.map((media) => (
              <div 
                key={media.id} 
                className={`
                  flex flex-col border rounded-md overflow-hidden cursor-pointer
                  ${selectedMediaIds.includes(media.id) ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}
                `}
                onClick={() => toggleMediaSelection(media.id)}
              >
                <div className="relative h-28 md:h-36 bg-muted">
                  <img 
                    src={media.thumbnailUrl} 
                    alt={media.name} 
                    className="h-full w-full object-cover"
                  />
                  
                  {/* Media type indicator */}
                  <div className="absolute top-1 md:top-2 left-1 md:left-2">
                    <Badge variant="outline" className="bg-black/60 text-white border-none text-xs px-1 py-0 h-5">
                      {media.type === 'image' && <Image className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />}
                      {media.type === 'video' && <Video className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />}
                      {media.type === 'audio' && <FileAudio className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />}
                      {media.type === 'image' ? 'Imagem' : 
                       media.type === 'video' ? 'Vídeo' : 
                       media.type === 'audio' ? 'Áudio' : media.type}
                    </Badge>
                  </div>
                  
                  {/* Duration badge for videos and audios */}
                  {(media.type === 'video' || media.type === 'audio') && media.duration && (
                    <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2">
                      <Badge variant="outline" className="bg-black/60 text-white border-none text-xs px-1 py-0 h-5">
                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        {formatDuration(media.duration)}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Checkbox for selection */}
                  <div className="absolute top-1 md:top-2 right-1 md:right-2">
                    <Checkbox
                      checked={selectedMediaIds.includes(media.id)}
                      className="h-4 w-4 md:h-5 md:w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={() => toggleMediaSelection(media.id)}
                    />
                  </div>
                </div>
                
                <div className="p-2 md:p-3 flex-1 flex flex-col min-h-[60px]">
                  <p className="font-medium line-clamp-2 text-xs md:text-sm">{media.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 md:mt-1">
                    {media.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Action buttons */}
      <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 mt-3 md:mt-4">
        <Button variant="outline" onClick={onCancel} className="w-full xs:w-auto">
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm}
          disabled={selectedMediaIds.length === 0}
          className="w-full xs:w-auto"
        >
          Adicionar ({selectedMediaIds.length})
        </Button>
      </div>
    </div>
  );
};

export default MediaSelector;
