import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Trash, ArrowUp, ArrowDown, Settings, Play, Pause } from 'lucide-react';
import { Media } from '@/types/media';

interface PlaylistItemProps {
  item: {
    id: string;
    mediaId: string;
    order: number;
    duration?: number;
    media: Media;
  };
  index: number;
  isLast: boolean;
  isFirst: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (id: string) => void;
  onDurationChange: (id: string, duration: number) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  item,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDurationChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [customDuration, setCustomDuration] = useState(item.duration || item.media.duration || 10);
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle custom duration change
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setCustomDuration(newDuration);
    onDurationChange(item.id, newDuration);
  };
  
  // Handle direct input of duration
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomDuration(value);
      onDurationChange(item.id, value);
    }
  };
  
  // Toggle play/pause for preview
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-muted/20 border-b last:border-b-0 relative group">
      {/* Order indicator */}
      <div className="flex items-center justify-center bg-muted rounded-full w-6 h-6 md:w-7 md:h-7 text-xs md:text-sm font-medium flex-shrink-0">
        {index + 1}
      </div>
      
      {/* Media thumbnail */}
      <div className="relative h-16 w-28 md:h-20 md:w-36 bg-muted rounded overflow-hidden flex-shrink-0">
        <img 
          src={item.media.thumbnailUrl} 
          alt={item.media.name} 
          className="h-full w-full object-cover"
        />
        
        {/* Play/pause button overlay */}
        {item.media.type === 'video' && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-0 m-auto h-6 w-6 md:h-8 md:w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={handleTogglePlay}
          >
            {isPlaying ? <Pause className="h-3 w-3 md:h-4 md:w-4" /> : <Play className="h-3 w-3 md:h-4 md:w-4" />}
          </Button>
        )}
      </div>
      
      {/* Media info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 md:gap-2">
          <p className="font-medium truncate text-xs md:text-sm">{item.media.name}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 md:mt-1">
          {item.media.type === 'video' || item.media.type === 'audio' 
            ? `${item.media.type === 'video' ? 'Vídeo' : 'Áudio'} • ${formatDuration(item.media.duration || 0)}`
            : item.media.type === 'image' 
              ? 'Imagem' 
              : item.media.type}
        </p>
        
        {/* Duration display */}
        <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 md:h-6 px-1 md:px-2 text-xs font-normal hover:bg-muted"
              >
                {formatDuration(customDuration)}
                <Settings className="h-2.5 w-2.5 md:h-3 md:w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Ajustar duração</h4>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[customDuration]}
                    min={1}
                    max={item.media.type === 'video' ? (item.media.duration || 180) : 60}
                    step={1}
                    onValueChange={handleDurationChange}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={customDuration}
                      onChange={handleInputChange}
                      className="w-16 h-8"
                      min={1}
                    />
                    <span className="text-sm">seg</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-0.5 md:gap-1">
        <div className="flex flex-col gap-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 md:h-7 md:w-7 rounded-full" 
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
          >
            <ArrowUp className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 md:h-7 md:w-7 rounded-full" 
            onClick={() => onMoveDown(index)}
            disabled={isLast}
          >
            <ArrowDown className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 md:h-8 md:w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 rounded-full" 
          onClick={() => onRemove(item.id)}
        >
          <Trash className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaylistItem;
