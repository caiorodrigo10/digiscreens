
import React from 'react';
import { Star, Monitor, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, getCategoryLabel } from '@/types/terminal';
import { Link } from 'react-router-dom';

interface TerminalListProps {
  terminals: Terminal[];
  onToggleFavorite: (id: string) => void;
  searchCenter: [number, number] | null;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

const TerminalList: React.FC<TerminalListProps> = ({ 
  terminals, 
  onToggleFavorite,
  searchCenter,
  calculateDistance
}) => {
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

  // Calculate the distance between terminal and search center
  const getDistance = (terminal: Terminal): number | undefined => {
    if (!searchCenter || !terminal.coordinates) return undefined;
    
    return calculateDistance(
      searchCenter[1],
      searchCenter[0],
      terminal.coordinates.latitude,
      terminal.coordinates.longitude
    );
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
    <div className="space-y-3">
      {terminals.map((terminal) => {
        const distance = getDistance(terminal);
        
        return (
          <div
            key={terminal.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-md border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-base line-clamp-1">{terminal.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {getCategoryLabel(terminal.category)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${terminal.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                  onClick={() => onToggleFavorite(terminal.id)}
                  title={terminal.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star className={`h-5 w-5 ${terminal.isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-sm mt-1">
                <Badge
                  variant="outline"
                  className={`${statusColors[terminal.status]} capitalize font-normal`}
                >
                  {statusLabels[terminal.status]}
                </Badge>
                
                <div className="flex items-center text-sm">
                  <Monitor className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>
                    {terminal.screens.available}/{terminal.screens.total} telas disponíveis
                  </span>
                </div>
                
                {/* Show distance if available */}
                {distance !== undefined && (
                  <div className="flex items-center text-sm text-blue-700">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{formatDistance(distance)} da pesquisa</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                <div>{terminal.address}</div>
                <div>{terminal.neighborhood}, {terminal.city}/{terminal.state}</div>
              </div>
            </div>

            <div className="flex-shrink-0 mt-2 sm:mt-0">
              <Button asChild size="sm" variant="default">
                <Link to={`/terminais/${terminal.id}`}>Visualizar</Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TerminalList;
