
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MediaType } from '@/types/media';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import AddMediaTypeSelector from './AddMediaTypeSelector';
import AddMediaForm from './AddMediaForm';
import { useToast } from '@/hooks/use-toast';

interface AddMediaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMediaAdded: () => void;
}

const AddMedia: React.FC<AddMediaProps> = ({ open, onOpenChange, onMediaAdded }) => {
  const [selectedType, setSelectedType] = useState<MediaType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when sheet closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedType(null);
    }
    onOpenChange(isOpen);
  };

  // Handle media type selection
  const handleTypeSelect = (type: MediaType) => {
    setSelectedType(type);
  };

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new media object
      const newMedia = {
        id: uuidv4(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };
      
      console.log('New media to be added:', newMedia);
      
      // Show success toast
      toast({
        title: "Mídia adicionada com sucesso",
        description: "A mídia foi adicionada e está pronta para exibição",
      });
      
      // Close the sheet and reset form
      handleOpenChange(false);
      
      // Refresh the media list
      onMediaAdded();
    } catch (error) {
      console.error('Error adding media:', error);
      toast({
        title: "Erro ao adicionar mídia",
        description: "Ocorreu um erro ao adicionar a mídia. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle>Adicionar Mídia</SheetTitle>
          <SheetDescription>
            Adicione uma nova mídia para exibição nos seus terminais
          </SheetDescription>
        </SheetHeader>
        
        {!selectedType ? (
          <AddMediaTypeSelector 
            selectedType={selectedType} 
            onTypeChange={handleTypeSelect} 
          />
        ) : (
          <AddMediaForm 
            mediaType={selectedType} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddMedia;
