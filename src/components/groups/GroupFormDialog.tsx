
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Group } from '@/types/group';
import { Media } from '@/types/media';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Check, Image, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MediaSelectionList from './MediaSelectionList';

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: Group) => void;
  group?: Group;
  availableMedias: Media[];
}

const GroupFormDialog: React.FC<GroupFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  group, 
  availableMedias 
}) => {
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>(group?.mediaIds || []);
  const [coverImage, setCoverImage] = useState<string | undefined>(group?.coverImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
    }
  });

  const handleMediaToggle = (mediaId: string) => {
    setSelectedMediaIds(prev => {
      if (prev.includes(mediaId)) {
        return prev.filter(id => id !== mediaId);
      } else {
        return [...prev, mediaId];
      }
    });
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a server here
    // For now, we'll just use a local URL
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
  };

  const onSubmit = async (data: any) => {
    if (selectedMediaIds.length === 0) {
      toast({
        title: "Selecione pelo menos uma mídia",
        description: "Seu grupo precisa conter pelo menos uma mídia",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newGroup: Group = {
        id: group?.id || uuidv4(),
        name: data.name,
        description: data.description,
        coverImage,
        mediaIds: selectedMediaIds,
        createdAt: group?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      onSave(newGroup);
      onOpenChange(false);
      
      toast({
        title: group ? "Grupo atualizado" : "Grupo criado",
        description: group 
          ? "As alterações foram salvas com sucesso" 
          : "Seu novo grupo foi criado com sucesso",
      });
    } catch (error) {
      console.error('Error saving group:', error);
      toast({
        title: "Erro ao salvar grupo",
        description: "Ocorreu um erro ao salvar o grupo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{group ? 'Editar Grupo' : 'Criar Grupo'}</DialogTitle>
          <DialogDescription>
            {group 
              ? 'Edite as informações e mídias deste grupo' 
              : 'Crie um novo grupo para organizar suas mídias'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="info" className="w-full flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="medias">Mídias</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 mt-4 overflow-y-auto flex-1 p-1">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo*</Label>
                <Input 
                  id="name" 
                  {...register("name", { required: "Nome é obrigatório" })}
                  placeholder="Ex: Promoções de Verão" 
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  {...register("description")}
                  placeholder="Descreva o propósito deste grupo..." 
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagem de Capa (opcional)</Label>
                <div className="flex items-center gap-4">
                  <div className="h-32 w-32 border-2 border-dashed rounded-md flex items-center justify-center bg-muted/50 overflow-hidden">
                    {coverImage ? (
                      <div className="relative h-full w-full">
                        <img 
                          src={coverImage} 
                          alt="Cover" 
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => setCoverImage(undefined)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Image className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="coverImage" className="cursor-pointer">
                      <div className="flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-muted transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Selecionar imagem</span>
                      </div>
                      <input
                        id="coverImage"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recomendado: 800x600px ou maior
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="medias" className="flex-1 flex flex-col overflow-hidden">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <Label>Selecione as Mídias</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedMediaIds.length} selecionadas
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  As mídias selecionadas serão exibidas intercaladamente durante a reprodução.
                </p>
              </div>
              
              <div className="flex-1 overflow-hidden border rounded-md">
                <MediaSelectionList 
                  availableMedias={availableMedias}
                  selectedMediaIds={selectedMediaIds}
                  onToggleMedia={handleMediaToggle}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-4" />
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : group ? 'Salvar Alterações' : 'Criar Grupo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupFormDialog;
