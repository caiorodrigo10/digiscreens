
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import { Search, FilterX, MapPin, AlertCircle } from 'lucide-react';
import { TerminalCategory, getCategoryLabel } from '@/types/terminal';
import { Slider } from '@/components/ui/slider';

interface TerminalFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (available: boolean) => void;
  onlyFavorites: boolean;
  setOnlyFavorites: (favorites: boolean) => void;
  resetFilters: () => void;
  // New props for location search
  locationSearch: string;
  setLocationSearch: (search: string) => void;
  searchRadius: number[];
  setSearchRadius: (radius: number[]) => void;
  onLocationSearch: () => void;
  clearLocationSearch: () => void;
  isSearching: boolean;
  searchError: string;
  hasActiveLocationSearch: boolean;
}

const TerminalFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  onlyAvailable,
  setOnlyAvailable,
  onlyFavorites,
  setOnlyFavorites,
  resetFilters,
  // Location search props
  locationSearch,
  setLocationSearch,
  searchRadius,
  setSearchRadius,
  onLocationSearch,
  clearLocationSearch,
  isSearching,
  searchError,
  hasActiveLocationSearch
}: TerminalFiltersProps) => {
  const categories: TerminalCategory[] = [
    'farmacia',
    'loterica',
    'padaria',
    'loja_roupas',
    'loja_pet',
    'shopping',
    'supermercado',
    'hospital',
    'posto_gasolina',
    'academia',
    'outro'
  ];

  // Add debounce for radius change search
  const [radiusTimeout, setRadiusTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleRadiusChange = (value: number[]) => {
    setSearchRadius(value);
    
    if (hasActiveLocationSearch) {
      // Clear previous timeout if exists
      if (radiusTimeout) {
        clearTimeout(radiusTimeout);
      }
      
      // Set new timeout to trigger search only after user stops moving the slider
      const timeout = setTimeout(() => {
        onLocationSearch();
      }, 500);
      
      setRadiusTimeout(timeout);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nome ou local..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[180px]">
          <Label htmlFor="status" className="mb-2 block">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Em manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto sm:min-w-[180px]">
          <Label htmlFor="category" className="mb-2 block">Categoria</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={resetFilters}
          className="ml-auto"
          title="Limpar filtros"
        >
          <FilterX size={16} />
        </Button>
      </div>
      
      {/* Location search section - New */}
      <div className="border-t pt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="cep-search" className="mb-1 text-sm">Buscar por CEP, endereço ou bairro</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cep-search"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                  }}
                  placeholder="CEP (00000-000) ou endereço"
                  className="pl-8"
                  onKeyDown={(e) => e.key === 'Enter' && onLocationSearch()}
                  disabled={isSearching}
                />
                {locationSearch && (
                  <button 
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={clearLocationSearch}
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
              {searchError && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {searchError}
                </div>
              )}
            </div>
            <Button 
              type="button" 
              onClick={onLocationSearch} 
              className="flex-shrink-0"
              disabled={isSearching}
              variant={hasActiveLocationSearch ? "secondary" : "default"}
            >
              {isSearching ? 'Buscando...' : 'Buscar Localização'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="radius-slider" className="text-xs min-w-20">Raio: {searchRadius[0]} km</Label>
            <Slider 
              id="radius-slider"
              value={searchRadius} 
              onValueChange={handleRadiusChange}
              max={10} 
              min={1}
              step={1}
              className="flex-1" 
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="available" 
            checked={onlyAvailable} 
            onCheckedChange={(checked) => setOnlyAvailable(checked === true)} 
          />
          <Label htmlFor="available" className="cursor-pointer">Apenas com espaços disponíveis</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="favorites" 
            checked={onlyFavorites} 
            onCheckedChange={(checked) => setOnlyFavorites(checked === true)} 
          />
          <Label htmlFor="favorites" className="cursor-pointer">Apenas favoritos</Label>
        </div>
        
        {hasActiveLocationSearch && (
          <div className="ml-auto text-xs text-muted-foreground">
            Buscando num raio de {searchRadius[0]}km
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalFilters;
