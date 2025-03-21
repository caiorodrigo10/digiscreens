
import React from 'react';
import { Media, getMediaTypeLabel, formatDuration, getMediaTypeBadgeColor } from '@/types/media';
import { getCategoryLabel } from '@/types/terminal';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Monitor, Calendar, Clock, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  media: Media;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const typeColor = getMediaTypeBadgeColor(media.type);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] group">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={media.thumbnailUrl} 
          alt={media.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className={cn(typeColor)}>{getMediaTypeLabel(media.type)}</Badge>
          {media.status === 'scheduled' && (
            <Badge variant="warning" className="ml-1">
              <Calendar className="h-3 w-3 mr-1" />
              Agendado
            </Badge>
          )}
          {media.status === 'inactive' && (
            <Badge variant="secondary" className="ml-1">Inativo</Badge>
          )}
        </div>
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm">
              <Eye className="h-5 w-5 text-white" />
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm">
              <FileType className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-1">{media.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {getCategoryLabel(media.category)}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Monitor className="h-3 w-3" />
          <span>{media.terminals.length} {media.terminals.length === 1 ? 'terminal' : 'terminais'}</span>
        </div>
        
        {media.duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(media.duration)}</span>
          </div>
        )}
        
        {media.collectStats && media.views !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{media.views.toLocaleString('pt-BR')}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MediaCard;
