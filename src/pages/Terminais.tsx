
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Grid2X2, List, Plus, Monitor, Map } from 'lucide-react';
import TerminalCard from '@/components/terminals/TerminalCard';
import TerminalList from '@/components/terminals/TerminalList';
import TerminalMap from '@/components/terminals/TerminalMap';
import TerminalFilters from '@/components/terminals/TerminalFilters';
import { mockTerminals } from '@/data/mockTerminals';
import { Terminal } from '@/types/terminal';
import MainNav from '@/components/navigation/MainNav';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGlnaXNjcmVlbnMiLCJhIjoiY204ZzVhZHY2MGphZjJqcTZ4dGx6MGRqdiJ9.jcQZ7bZa3jM5FZ4pRTv3Pw';

const Terminais = () => {
  const [terminals, setTerminals] = useState<Terminal[]>(mockTerminals);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list' | 'map'>('grid');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(Math.ceil(terminals.length / itemsPerPage));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  
  const [locationSearch, setLocationSearch] = useState('');
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(null);
  const [searchRadius, setSearchRadius] = useState([3]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const [filteredTerminals, setFilteredTerminals] = useState<Terminal[]>(terminals);
  
  const formatCEP = (cep: string): string => {
    const digitsOnly = cep.replace(/\D/g, '');
    if (digitsOnly.length === 8) {
      return `${digitsOnly.substring(0, 5)}-${digitsOnly.substring(5, 8)}`;
    }
    return digitsOnly;
  };

  const normalizeCEP = (cep: string): string => {
    return cep.replace(/\D/g, '');
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const geocodeCEP = async (search: string): Promise<[number, number] | null> => {
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Check if search is a CEP (contains 8 digits)
      const isCEPSearch = /\d{5}-?\d{3}/.test(search) || /\d{8}/.test(search);
      const normalizedSearch = normalizeCEP(search);
      
      if (isCEPSearch && normalizedSearch.length === 8) {
        const matchingTerminal = terminals.find(t => normalizeCEP(t.cep || '') === normalizedSearch);
        
        if (matchingTerminal && matchingTerminal.coordinates) {
          return [matchingTerminal.coordinates.longitude, matchingTerminal.coordinates.latitude];
        }
        
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${normalizedSearch}.json?country=br&types=postcode&access_token=${mapboxgl.accessToken}`
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar CEP');
        }
        
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          const formattedCEP = formatCEP(normalizedSearch);
          
          const secondResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${formattedCEP}.json?country=br&types=postcode&access_token=${mapboxgl.accessToken}`
          );
          
          if (!secondResponse.ok) {
            throw new Error('Erro ao buscar CEP formatado');
          }
          
          const secondData = await secondResponse.json();
          
          if (!secondData.features || secondData.features.length === 0) {
            const partialCEP = normalizedSearch.substring(0, 5);
            
            const fallbackResponse = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${partialCEP}.json?country=br&access_token=${mapboxgl.accessToken}`
            );
            
            if (!fallbackResponse.ok) {
              throw new Error('Erro ao buscar CEP parcial');
            }
            
            const fallbackData = await fallbackResponse.json();
            
            if (!fallbackData.features || fallbackData.features.length === 0) {
              setSearchError('CEP não encontrado');
              return null;
            }
            
            const fallbackCoordinates = fallbackData.features[0].center;
            toast.info('CEP exato não encontrado. Mostrando aproximação da região.', {
              duration: 5000
            });
            return fallbackCoordinates as [number, number];
          }
          
          const secondCoordinates = secondData.features[0].center;
          return secondCoordinates as [number, number];
        }
        
        const coordinates = data.features[0].center;
        return coordinates as [number, number];
      } else {
        // This is a non-CEP search (address, neighborhood, etc.)
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(search)}.json?country=br&access_token=${mapboxgl.accessToken}`
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar endereço');
        }
        
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
          setSearchError('Endereço não encontrado');
          return null;
        }
        
        const coordinates = data.features[0].center;
        return coordinates as [number, number];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchError('Erro ao buscar localização');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!locationSearch.trim()) return;
    
    try {
      // Check if search is a CEP (contains 8 digits)
      const isCEPSearch = /\d{5}-?\d{3}/.test(locationSearch) || /\d{8}/.test(locationSearch);
      const coordinates = await geocodeCEP(locationSearch);
      
      if (coordinates) {
        setSearchCenter(coordinates);
        
        if (isCEPSearch) {
          const digitsOnly = locationSearch.replace(/\D/g, '');
          if (digitsOnly.length === 8) {
            const normalizedCEP = normalizeCEP(locationSearch);
            const matchingTerminal = terminals.find(t => normalizeCEP(t.cep || '') === normalizedCEP);
            
            if (matchingTerminal) {
              toast.success(`CEP ${formatCEP(digitsOnly)} localizado`);
            } else {
              // Only show the success toast without the "aproximada" message when we're not falling back
              // to a partial search
              toast.success(`Localização encontrada`);
            }
          } else {
            toast.success(`Localização encontrada: ${locationSearch}`);
          }
        } else {
          // Non-CEP search
          toast.success(`Localização encontrada: ${locationSearch}`);
        }
      } else {
        toast.error('Não foi possível localizar este endereço');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Erro na busca');
      toast.error('Erro ao realizar busca');
    }
  };

  const clearLocationSearch = () => {
    setLocationSearch('');
    setSearchCenter(null);
    setSearchError('');
  };

  useEffect(() => {
    let filtered = [...terminals];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        terminal => 
          terminal.name.toLowerCase().includes(query) || 
          terminal.neighborhood.toLowerCase().includes(query) ||
          terminal.city.toLowerCase().includes(query)
      );
    }
    
    if (searchCenter) {
      filtered = filtered.filter(terminal => {
        if (!terminal.coordinates) return false;
        
        const distance = calculateDistance(
          searchCenter[1], 
          searchCenter[0], 
          terminal.coordinates.latitude, 
          terminal.coordinates.longitude
        );
        
        return distance <= searchRadius[0];
      });
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(terminal => terminal.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(terminal => terminal.category === categoryFilter);
    }
    
    if (onlyAvailable) {
      filtered = filtered.filter(terminal => terminal.screens.available > 0);
    }
    
    if (onlyFavorites) {
      filtered = filtered.filter(terminal => terminal.isFavorite);
    }
    
    if (searchCenter) {
      filtered.sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        
        const distanceA = calculateDistance(
          searchCenter[1],
          searchCenter[0],
          a.coordinates.latitude,
          a.coordinates.longitude
        );
        
        const distanceB = calculateDistance(
          searchCenter[1],
          searchCenter[0],
          b.coordinates.latitude,
          b.coordinates.longitude
        );
        
        return distanceA - distanceB;
      });
    }
    
    setFilteredTerminals(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [terminals, searchQuery, statusFilter, categoryFilter, onlyAvailable, onlyFavorites, searchCenter, searchRadius]);
  
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTerminals.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const handleToggleFavorite = (id: string) => {
    setTerminals(prevTerminals => 
      prevTerminals.map(terminal => 
        terminal.id === id 
          ? { ...terminal, isFavorite: !terminal.isFavorite } 
          : terminal
      )
    );
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setOnlyAvailable(false);
    setOnlyFavorites(false);
    clearLocationSearch();
  };
  
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => setCurrentPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationLink className="cursor-default">...</PaginationLink>
          </PaginationItem>
        );
      }
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationLink className="cursor-default">...</PaginationLink>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="flex min-h-screen bg-app">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6">
          <header className="mb-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Monitor size={28} />
                  Terminais
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gerencie e monitore seus terminais em tempo real
                </p>
              </div>
              <Button className="sm:self-start" asChild>
                <Link to="/terminais/novo">
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Terminal
                </Link>
              </Button>
            </div>
          </header>

          <div className="space-y-4">
            <div className="bg-[#f5f7fa]">
              <TerminalFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                onlyAvailable={onlyAvailable}
                setOnlyAvailable={setOnlyAvailable}
                onlyFavorites={onlyFavorites}
                setOnlyFavorites={setOnlyFavorites}
                resetFilters={resetFilters}
                locationSearch={locationSearch}
                setLocationSearch={setLocationSearch}
                searchRadius={searchRadius}
                setSearchRadius={setSearchRadius}
                onLocationSearch={handleLocationSearch}
                clearLocationSearch={clearLocationSearch}
                isSearching={isSearching}
                searchError={searchError}
                hasActiveLocationSearch={searchCenter !== null}
              />
            </div>
            
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="text-sm text-muted-foreground">
                Mostrando <strong>{filteredTerminals.length}</strong> terminais
                {searchCenter && (
                  <> num raio de <strong>{searchRadius[0]}km</strong></>
                )}
              </div>
              <ToggleGroup 
                type="single" 
                value={displayMode} 
                onValueChange={(value) => value && setDisplayMode(value as 'grid' | 'list' | 'map')}
                className="flex-shrink-0"
              >
                <ToggleGroupItem value="grid" aria-label="Visualização em grade">
                  <Grid2X2 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="Visualização em lista">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="map" aria-label="Visualização em mapa">
                  <Map className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <Tabs defaultValue={displayMode} value={displayMode} onValueChange={(value) => setDisplayMode(value as 'grid' | 'list' | 'map')} className="animate-fade-up">
              <TabsContent value="grid" className="m-0">
                {filteredTerminals.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getCurrentPageItems().map((terminal) => (
                      <TerminalCard 
                        key={terminal.id} 
                        terminal={terminal} 
                        onToggleFavorite={handleToggleFavorite} 
                        distance={
                          searchCenter && terminal.coordinates 
                            ? calculateDistance(
                                searchCenter[1],
                                searchCenter[0],
                                terminal.coordinates.latitude,
                                terminal.coordinates.longitude
                              )
                            : undefined
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum terminal encontrado com os filtros atuais.</p>
                    <Button variant="outline" onClick={resetFilters} className="mt-4">
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list" className="m-0">
                {filteredTerminals.length > 0 ? (
                  <TerminalList 
                    terminals={getCurrentPageItems()} 
                    onToggleFavorite={handleToggleFavorite}
                    searchCenter={searchCenter}
                    calculateDistance={calculateDistance}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum terminal encontrado com os filtros atuais.</p>
                    <Button variant="outline" onClick={resetFilters} className="mt-4">
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="map" className="m-0">
                <TerminalMap 
                  terminals={filteredTerminals} 
                  onToggleFavorite={handleToggleFavorite}
                  searchCenter={searchCenter}
                  searchRadius={searchRadius[0]}
                />
              </TabsContent>
            </Tabs>
            
            {filteredTerminals.length > 0 && displayMode !== 'map' && (
              <Pagination className="mt-6">
                <PaginationContent className="flex-wrap">
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminais;
