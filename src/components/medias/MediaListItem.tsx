
import React from 'react';
import { Media, getMediaTypeLabel, formatDuration, getMediaTypeBadgeColor } from '@/types/media';
import { getCategoryLabel } from '@/types/terminal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Monitor, Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaListItemProps {
  media: Media;
}

const MediaListItem: React.FC<MediaListItemProps> = ({ media }) => {
  const typeColor = getMediaTypeBadgeColor(media.type);
  
  return (
    <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center">
          {/* Thumbnail - Fixed width */}
          <div className="relative h-16 w-28 flex-shrink-0 bg-muted overflow-hidden rounded">
            <img 
              src={media.thumbnailUrl} 
              alt={media.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Title and Category - Fixed width */}
          <div className="ml-5 w-72 flex-shrink-0">
            <h3 className="font-semibold text-base line-clamp-1">{media.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {getCategoryLabel(media.category)}
            </p>
          </div>
          
          {/* Media Type Badge - Fixed width */}
          <div className="w-40 flex-shrink-0 flex items-center">
            <Badge className={cn(typeColor, "h-6 w-24 flex items-center justify-center px-3")}>{getMediaTypeLabel(media.type)}</Badge>
            
            {media.status === 'scheduled' && (
              <Badge variant="warning" className="ml-2 h-6 flex items-center gap-1 px-3">
                <Calendar className="h-3 w-3 mr-1" />
                Agendado
              </Badge>
            )}
            
            {media.status === 'inactive' && (
              <Badge variant="secondary" className="ml-2 h-6 flex items-center px-3">Inativo</Badge>
            )}
          </div>
          
          {/* Stats - Fixed width and consistent layout */}
          <div className="flex-grow flex items-center gap-8 text-sm text-muted-foreground justify-center">
            <div className="flex items-center gap-1 w-16 justify-end">
              <Monitor className="h-4 w-4" />
              <span>{media.terminals.length}</span>
            </div>
            
            <div className="flex items-center gap-1 w-16 justify-end">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(media.duration)}</span>
            </div>
            
            <div className="flex items-center gap-1 w-16 justify-end">
              <Eye className="h-4 w-4" />
              <span>{media.collectStats && media.views !== undefined ? media.views.toLocaleString('pt-BR') : '—'}</span>
            </div>
          </div>
          
          {/* Actions - Fixed position */}
          <div className="ml-4 w-10 flex-shrink-0">
            <button className="p-2 rounded-full hover:bg-muted">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaListItem;
