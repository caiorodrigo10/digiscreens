
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Monitor, MapPin, ImageIcon, Users } from 'lucide-react';
import { Terminal, getCategoryLabel } from '@/types/terminal';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TerminalCardProps {
  terminal: Terminal;
  onToggleFavorite: (id: string) => void;
  distance?: number; // New prop for distance from search location
}

const TerminalCard: React.FC<TerminalCardProps> = ({ terminal, onToggleFavorite, distance }) => {
  // Status color mapping
  const statusColors: Record<string, string> = {
    online: 'bg-green-100 text-green-800 border-green-200',
    offline: 'bg-red-100 text-red-800 border-red-200',
    maintenance: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  // Status label mapping
  const statusLabels: Record<string, string> = {
    online: 'Online',
    offline: 'Offline',
    maintenance: 'Em manutenção',
  };

  // Format the distance to show in km with 1 decimal place
  const formatDistance = (dist: number): string => {
    if (dist < 1) {
      // If less than 1km, show in meters
      return `${Math.round(dist * 1000)}m`;
    }
    return `${dist.toFixed(1)}km`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image Section */}
      <Link to={`/terminais/${terminal.id}`} className="block overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          {terminal.imageUrl ? (
            <img 
              src={terminal.imageUrl} 
              alt={terminal.name} 
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-50" />
            </div>
          )}
        </AspectRatio>
      </Link>
      
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <Link to={`/terminais/${terminal.id}`} className="hover:underline">
            <h3 className="font-semibold text-base line-clamp-1">{terminal.name}</h3>
          </Link>
          <p className="text-xs text-muted-foreground">
            {getCategoryLabel(terminal.category)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${terminal.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(terminal.id);
          }}
          title={terminal.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Star className={`h-5 w-5 ${terminal.isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </CardHeader>

      <CardContent className="p-4 pt-0 pb-4 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm mt-2">
            <Badge
              variant="outline"
              className={`${statusColors[terminal.status]} capitalize font-normal`}
            >
              {statusLabels[terminal.status]}
            </Badge>
            
            <div className="flex items-center text-sm">
              <Monitor className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>
                {terminal.screens.available}/{terminal.screens.total} espaços
              </span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div className="line-clamp-1">{terminal.address}</div>
            <div>{terminal.neighborhood}, {terminal.city}/{terminal.state}</div>
          </div>
          
          {/* Show demographics info if available */}
          {terminal.demographics && (
            <div className="text-xs mt-1 grid grid-cols-2 gap-2 bg-secondary/30 p-1.5 rounded">
              <div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="font-medium">{terminal.demographics.averageFootTraffic}</span>
                </div>
                <div className="text-xs text-muted-foreground">visitantes/mês</div>
              </div>
              <div>
                <div className="font-medium">
                  {terminal.demographics.socialClass.join(', ')}
                </div>
                <div className="text-xs text-muted-foreground">classes sociais</div>
              </div>
            </div>
          )}
          
          {/* Show distance if provided */}
          {distance !== undefined && (
            <div className="flex items-center mt-1 text-xs text-blue-700">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{formatDistance(distance)} da pesquisa</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TerminalCard;
