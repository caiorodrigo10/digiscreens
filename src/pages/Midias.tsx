
import React, { useState, useMemo } from 'react';
import { Film, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockMedia } from '@/data/mockMedia';
import { Media, MediaType, MediaStatus } from '@/types/media';
import { TerminalCategory } from '@/types/terminal';
import MediaFilters from '@/components/medias/MediaFilters';
import MediaList from '@/components/medias/MediaList';
import MainNav from '@/components/navigation/MainNav';
import AddMedia from '@/components/medias/AddMedia';

const Midias = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TerminalCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addMediaOpen, setAddMediaOpen] = useState(false);
  const [mediaList, setMediaList] = useState<Media[]>(mockMedia);
  
  const filteredMedia = useMemo(() => {
    return mediaList.filter((media) => {
      // Text search
      const matchesSearch = searchQuery === '' || 
        media.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (media.description && media.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Type filter
      const matchesType = selectedType === 'all' || media.type === selectedType;
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || media.category === selectedCategory;
      
      // Status filter
      const matchesStatus = selectedStatus === 'all' || media.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedCategory, selectedStatus, mediaList]);

  // Handle media added event
  const handleMediaAdded = () => {
    // In a real app, this would fetch the updated media list from API
    console.log('Media added, would refresh list from API');
  };

  return (
    <div className="flex min-h-screen bg-app">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Film size={32} className="text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Mídias</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie o conteúdo que será exibido nos seus terminais
                </p>
              </div>
            </div>
            
            <Button className="gap-2" onClick={() => setAddMediaOpen(true)}>
              <Plus className="h-4 w-4" />
              Adicionar Mídia
            </Button>
          </div>
          
          <MediaFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <MediaList medias={filteredMedia} viewMode={viewMode} />
          
          <AddMedia 
            open={addMediaOpen} 
            onOpenChange={setAddMediaOpen} 
            onMediaAdded={handleMediaAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default Midias;
