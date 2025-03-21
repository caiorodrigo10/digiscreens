
import React from 'react';
import { MediaType, getMediaTypeLabel } from '@/types/media';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Film, AudioLines, Youtube, FileText, Image } from 'lucide-react';

interface AddMediaTypeSelectorProps {
  selectedType: MediaType | null;
  onTypeChange: (type: MediaType) => void;
}

const mediaTypes: { type: MediaType; icon: React.ReactNode; description: string }[] = [
  { 
    type: 'video',
    icon: <Film className="h-6 w-6" />,
    description: 'Faça upload de vídeos para exibir nos terminais'
  },
  { 
    type: 'audio',
    icon: <AudioLines className="h-6 w-6" />,
    description: 'Arquivos de áudio para reprodução nos terminais'
  },
  { 
    type: 'youtube',
    icon: <Youtube className="h-6 w-6" />,
    description: 'Incorpore vídeos do YouTube nos seus terminais'
  },
  { 
    type: 'pdf',
    icon: <FileText className="h-6 w-6" />,
    description: 'Apresente documentos em PDF nos terminais'
  },
  { 
    type: 'image',
    icon: <Image className="h-6 w-6" />,
    description: 'Imagens estáticas para exibição nos terminais'
  },
];

const AddMediaTypeSelector: React.FC<AddMediaTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tipo de Mídia</h2>
        <p className="text-sm text-muted-foreground">
          Selecione o tipo de mídia que você deseja adicionar
        </p>
      </div>
      
      <RadioGroup
        value={selectedType || undefined}
        onValueChange={(value) => onTypeChange(value as MediaType)}
        className="grid grid-cols-1 gap-4"
      >
        {mediaTypes.map(({ type, icon, description }) => (
          <Label
            key={type}
            htmlFor={type}
            className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-muted transition-colors
              ${selectedType === type ? 'border-primary' : 'border-border'}`}
          >
            <RadioGroupItem value={type} id={type} className="sr-only" />
            <div className={`rounded-full p-2 ${selectedType === type ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {icon}
            </div>
            <div className="space-y-1 flex-1">
              <p className="font-medium leading-none">{getMediaTypeLabel(type)}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AddMediaTypeSelector;
