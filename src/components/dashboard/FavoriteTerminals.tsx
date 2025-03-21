
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Tv, Users, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Terminal {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  metrics: {
    exibicoes: number;
    uptime: number;
  };
  demographics?: {
    averageFootTraffic: number;
    socialClass: string[];
  };
  screens: {
    available: number;
    total: number;
  };
}

interface FavoriteTerminalsProps {
  terminals: Terminal[];
  onRemoveFavorite: (id: string) => void;
  className?: string;
}

const FavoriteTerminals: React.FC<FavoriteTerminalsProps> = ({ 
  terminals, 
  onRemoveFavorite,
  className 
}) => {
  if (terminals.length === 0) {
    return (
      <Card className={cn("animate-fade-up", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Terminais Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Heart className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
          <p className="text-sm text-muted-foreground max-w-[220px]">
            Marque terminais como favoritos para monitorá-los rapidamente
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("animate-fade-up", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Terminais Favoritos
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 pt-2">
        {terminals.map((terminal) => (
          <div 
            key={terminal.id} 
            className="terminal-card animate-scale-in p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <Tv className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">{terminal.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div 
                  className={cn(
                    "status-pulse",
                    terminal.status === 'online' ? "text-green-500" : "text-red-500"
                  )}
                />
                <span className="text-xs">
                  {terminal.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mb-4">
              {terminal.location}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2.5 bg-secondary rounded">
                <div className="font-medium">{terminal.metrics.exibicoes}</div>
                <div className="text-xs text-muted-foreground">Exibições</div>
              </div>
              <div className="text-center p-2.5 bg-secondary rounded">
                <div className="font-medium">{terminal.metrics.uptime}%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
            
            {/* Add new info row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2.5 bg-secondary rounded">
                <div className="font-medium flex items-center justify-center">
                  <Monitor className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{terminal.screens.available}/{terminal.screens.total}</span>
                </div>
                <div className="text-xs text-muted-foreground">Espaços disponíveis</div>
              </div>
              {terminal.demographics && (
                <div className="text-center p-2.5 bg-secondary rounded">
                  <div className="font-medium flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>{terminal.demographics.averageFootTraffic}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Visitantes/mês</div>
                </div>
              )}
            </div>
            
            {/* Show social class if available */}
            {terminal.demographics?.socialClass && terminal.demographics.socialClass.length > 0 && (
              <div className="flex items-center justify-center text-xs bg-secondary/50 rounded py-1.5 px-2 mb-3">
                <span className="text-muted-foreground mr-1">Público: </span>
                <span className="font-medium">{terminal.demographics.socialClass.join(', ')}</span>
              </div>
            )}
            
            <button 
              onClick={() => onRemoveFavorite(terminal.id)}
              className="mt-2 w-full text-xs py-1.5 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-all-fast"
            >
              <Heart className="h-3 w-3 mr-1.5 fill-red-500" />
              Remover dos favoritos
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FavoriteTerminals;
