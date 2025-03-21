
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MediaType, MediaOrientation, getMediaOrientationLabel } from '@/types/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { mockTerminals } from '@/data/mockTerminals';
import { useToast } from '@/hooks/use-toast';
import { Upload, Clock, Youtube } from 'lucide-react';
import { getCategoryLabel } from '@/types/terminal';

// Create a base schema that's common to all media types
const baseSchema = {
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  description: z.string().optional(),
  orientation: z.enum(['horizontal', 'vertical', 'both']),
  collectStats: z.boolean().default(true),
  terminals: z.array(z.string()).min(1, { message: 'Selecione pelo menos um terminal' }),
};

// Create schemas for specific media types
const videoSchema = z.object({
  ...baseSchema,
  mediaFile: z.instanceof(File).refine(file => file.size > 0, { message: 'O arquivo é obrigatório' }),
});

const audioSchema = z.object({
  ...baseSchema,
  mediaFile: z.instanceof(File).refine(file => file.size > 0, { message: 'O arquivo é obrigatório' }),
});

const imageSchema = z.object({
  ...baseSchema,
  mediaFile: z.instanceof(File).refine(file => file.size > 0, { message: 'O arquivo é obrigatório' }),
});

const pdfSchema = z.object({
  ...baseSchema,
  mediaFile: z.instanceof(File).refine(file => file.size > 0, { message: 'O arquivo é obrigatório' }),
});

const youtubeSchema = z.object({
  ...baseSchema,
  youtubeUrl: z.string().url({ message: 'URL inválida' }).includes('youtube', { message: 'Deve ser uma URL do YouTube' }),
});

// Create a type that represents all possible form shapes
type FormValues = z.infer<typeof videoSchema> | z.infer<typeof youtubeSchema>;

// Function to get the appropriate schema based on media type
const getFormSchema = (mediaType: MediaType) => {
  switch (mediaType) {
    case 'video': return videoSchema;
    case 'audio': return audioSchema;
    case 'image': return imageSchema;
    case 'pdf': return pdfSchema;
    case 'youtube': return youtubeSchema;
    default: return z.object(baseSchema);
  }
};

interface AddMediaFormProps {
  mediaType: MediaType;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const AddMediaForm: React.FC<AddMediaFormProps> = ({ 
  mediaType, 
  onSubmit, 
  isSubmitting 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Create the form with dynamic schema based on media type
  const formSchema = getFormSchema(mediaType);
  
  // Create form default values based on media type
  const getDefaultValues = () => {
    const baseDefaults = {
      name: '',
      category: '',
      description: '',
      orientation: 'both' as const,
      collectStats: true,
      terminals: [] as string[],
    };

    if (mediaType === 'youtube') {
      return {
        ...baseDefaults,
        youtubeUrl: '',
      };
    }

    return baseDefaults;
  };
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });
  
  // Filter terminals by category
  const categories = Array.from(new Set(mockTerminals.map(terminal => terminal.category)));
  
  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      form.setValue(
        mediaType === 'youtube' ? 'youtubeUrl' as never : 'mediaFile' as never, 
        selectedFile
      );
    }
  };

  // Handle form submission
  const handleSubmit = (data: FormValues) => {
    // Add file data to form data
    const submissionData = {
      ...data,
      type: mediaType,
      file: file,
    };
    
    onSubmit(submissionData);
  };

  // Type-specific form fields
  const renderTypeSpecificFields = () => {
    switch (mediaType) {
      case 'video':
      case 'audio':
      case 'pdf':
      case 'image':
        return (
          <div>
            <FormLabel>Arquivo {mediaType === 'video' ? 'de vídeo' : 
              mediaType === 'audio' ? 'de áudio' : 
              mediaType === 'pdf' ? 'PDF' : 'de imagem'}
            </FormLabel>
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">{file ? file.name : `Selecionar arquivo ${mediaType === 'video' ? '.mp4, .webm' : 
                  mediaType === 'audio' ? '.mp3, .wav' : 
                  mediaType === 'pdf' ? '.pdf' : '.jpg, .png, .webp'}`}
                </span>
                {file && <span className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>}
                <input 
                  id="file-upload" 
                  type="file" 
                  accept={mediaType === 'video' ? 'video/*' : 
                    mediaType === 'audio' ? 'audio/*' : 
                    mediaType === 'pdf' ? 'application/pdf' : 'image/*'} 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </Button>
              
              {file && mediaType === 'image' && (
                <div className="relative h-24 w-24 border rounded overflow-hidden">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
            {form.formState.errors.mediaFile && (
              <p className="text-sm font-medium text-destructive mt-2">
                {(form.formState.errors.mediaFile as any)?.message || 'Arquivo obrigatório'}
              </p>
            )}
          </div>
        );
      
      case 'youtube':
        return (
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do YouTube</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Youtube className="h-10 w-10 text-red-500" />
                    <Input 
                      placeholder="https://www.youtube.com/watch?v=" 
                      {...field} 
                      value={typeof field.value === 'string' ? field.value : ''}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Cole a URL completa do vídeo do YouTube que deseja incorporar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Informações Básicas</h2>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Mídia*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da mídia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(mockTerminals.reduce((acc, terminal) => {
                      acc[terminal.category] = getCategoryLabel(terminal.category);
                      return acc;
                    }, {} as Record<string, string>)).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva brevemente o conteúdo da mídia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="orientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orientação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma orientação" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(['horizontal', 'vertical', 'both'] as MediaOrientation[]).map((orientation) => (
                      <SelectItem key={orientation} value={orientation}>
                        {getMediaOrientationLabel(orientation)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(mediaType === 'video' || mediaType === 'audio') && (
            <div className="flex items-center gap-2 px-2 py-3 rounded-md bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">A duração será extraída automaticamente do arquivo</span>
            </div>
          )}
          
          <FormField
            control={form.control}
            name="collectStats"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Coletar estatísticas</FormLabel>
                  <FormDescription>
                    Colete dados de visualizações para análise posterior
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        {/* Type-specific fields */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dados da Mídia</h2>
          {renderTypeSpecificFields()}
        </div>
        
        {/* Terminal Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Terminais</h2>
          
          <FormField
            control={form.control}
            name="terminals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecione os terminais*</FormLabel>
                <FormDescription>
                  Escolha os terminais onde esta mídia será exibida
                </FormDescription>
                <div className="h-64 overflow-y-auto border rounded-md p-2 space-y-4 mt-2">
                  {categories.map((category) => {
                    const categoryTerminals = mockTerminals.filter(t => t.category === category);
                    return (
                      <div key={category} className="space-y-2">
                        <h3 className="font-medium text-sm">{getCategoryLabel(category)}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {categoryTerminals.map((terminal) => (
                            <div key={terminal.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={terminal.id}
                                value={terminal.id}
                                checked={field.value.includes(terminal.id)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const value = e.target.value;
                                  const newValue = checked
                                    ? [...field.value, value]
                                    : field.value.filter((v) => v !== value);
                                  field.onChange(newValue);
                                }}
                                className="rounded"
                              />
                              <label htmlFor={terminal.id} className="text-sm cursor-pointer">
                                {terminal.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Mídia'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddMediaForm;
