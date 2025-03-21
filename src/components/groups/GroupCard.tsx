
import React from 'react';
import { Group } from '@/types/group';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Layers, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const updatedAtFormatted = formatDistanceToNow(new Date(group.updatedAt), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div 
        className={cn(
          "h-40 bg-gradient-to-b from-muted/80 to-muted flex items-center justify-center",
          group.coverImage ? "relative" : ""
        )}
      >
        {group.coverImage ? (
          <img 
            src={group.coverImage} 
            alt={group.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Layers className="h-16 w-16 text-muted-foreground/40" />
        )}
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="font-medium text-lg truncate">{group.name}</h3>
        {group.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {group.description}
          </p>
        )}
        <div className="mt-2 text-sm text-muted-foreground">
          <span>{group.mediaIds.length} mídias</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t justify-between items-center text-xs text-muted-foreground">
        <div>Atualizado {updatedAtFormatted}</div>
        <ChevronRight className="h-4 w-4" />
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
