
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Terminal {
  id: string;
  name: string;
  location: string;
  metrics: {
    exibicoes: number;
    uptime: number;
  };
  isFavorite: boolean;
  demographics?: {
    averageFootTraffic: number;
    socialClass: string[];
  };
  screens: {
    available: number;
    total: number;
  };
}

interface TopTerminalsProps {
  terminals: Terminal[];
  onToggleFavorite: (id: string) => void;
  className?: string;
}

const TopTerminals: React.FC<TopTerminalsProps> = ({ 
  terminals, 
  onToggleFavorite,
  className 
}) => {
  return (
    <Card className={cn("animate-fade-up", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Melhores Terminais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {terminals.map((terminal) => (
            <div 
              key={terminal.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-all-fast"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{terminal.name}</span>
                <span className="text-xs text-muted-foreground">{terminal.location}</span>
                <div className="flex items-center text-xs mt-0.5 space-x-3 text-muted-foreground">
                  <div className="flex items-center">
                    <Monitor className="h-3 w-3 mr-0.5" />
                    <span>{terminal.screens.available}/{terminal.screens.total}</span>
                  </div>
                  {terminal.demographics && (
                    <>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-0.5" />
                        <span>{terminal.demographics.averageFootTraffic}/mês</span>
                      </div>
                      <div>
                        Público: {terminal.demographics.socialClass.join(', ')}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{terminal.metrics.exibicoes}</div>
                  <div className="text-xs text-muted-foreground">Exibições</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onToggleFavorite(terminal.id)}
                >
                  <Heart 
                    className={cn(
                      "h-4 w-4", 
                      terminal.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )} 
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopTerminals;
