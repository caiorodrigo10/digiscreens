
import React from 'react';
import { Search, Filter, GridIcon, ListIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MediaType, MediaStatus } from '@/types/media';
import { TerminalCategory } from '@/types/terminal';

interface MediaFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: MediaType | 'all';
  setSelectedType: (type: MediaType | 'all') => void;
  selectedCategory: TerminalCategory | 'all';
  setSelectedCategory: (category: TerminalCategory | 'all') => void;
  selectedStatus: MediaStatus | 'all';
  setSelectedStatus: (status: MediaStatus | 'all') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar mídias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <GridIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select 
          value={selectedType} 
          onValueChange={(value) => setSelectedType(value as MediaType | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de mídia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="audio">Áudio</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="image">Imagem</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedCategory} 
          onValueChange={(value) => setSelectedCategory(value as TerminalCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="farmacia">Farmácia</SelectItem>
            <SelectItem value="supermercado">Supermercado</SelectItem>
            <SelectItem value="loja_roupas">Loja de Roupas</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="academia">Academia</SelectItem>
            {/* Add more categories as needed */}
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedStatus} 
          onValueChange={(value) => setSelectedStatus(value as MediaStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MediaFilters;
