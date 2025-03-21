import React, { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Partnership, PartnershipStage } from '@/types/partnership';
import { Building, Calendar, MapPin, Monitor, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente de Card com funcionalidade de arrastar
const PartnershipCard = ({ 
  partnership, 
  index 
}: { 
  partnership: Partnership, 
  index: number 
}) => {
  // Função para definir a cor do badge de categoria
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Varejo':
        return 'bg-blue-100 text-blue-800';
      case 'Shopping':
        return 'bg-purple-100 text-purple-800';
      case 'Restaurante':
        return 'bg-orange-100 text-orange-800';
      case 'Farmácia':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy', { locale: ptBR });
  };

  return (
    <Draggable draggableId={partnership.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-4"
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.7 : 1
          }}
        >
          <Card 
            className={cn(
              "shadow-sm w-full transition-all duration-200",
              snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-md"
            )}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-medium">
                  {partnership.companyName}
                </CardTitle>
                <Badge className={cn("ml-2", getCategoryColor(partnership.category))}>
                  {partnership.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{partnership.contactName}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{partnership.contactPhone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{partnership.city}, {partnership.state}</span>
              </div>
              <div className="flex items-center text-sm">
                <Monitor className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{partnership.potentialScreens} telas potenciais</span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>Atualizado em {formatDate(partnership.stageUpdatedAt)}</span>
                </div>
                
                {partnership.tasks.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {partnership.tasks.length} tarefa{partnership.tasks.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

// Componente de coluna com funcionalidade de soltar
const StageColumn = ({ 
  stage, 
  partnerships, 
  droppableId 
}: { 
  stage: PartnershipStage, 
  partnerships: Partnership[], 
  droppableId: string 
}) => {
  return (
    <div className="flex flex-col h-full min-w-[320px] w-[320px] flex-shrink-0 mr-6">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between">
        <h3 className="font-medium">{stage}</h3>
        <Badge variant="outline" className="bg-muted">
          {partnerships.length || 0}
        </Badge>
      </div>
      
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 rounded-lg min-h-[200px] transition-colors duration-200",
              snapshot.isDraggingOver ? "bg-blue-50 border-2 border-dashed border-blue-200" : "bg-muted/20"
            )}
          >
            {partnerships.map((partnership, index) => (
              <PartnershipCard
                key={partnership.id}
                partnership={partnership}
                index={index}
              />
            ))}
            
            {partnerships.length === 0 && (
              <div className="border border-dashed rounded-lg p-4 flex items-center justify-center h-24 text-muted-foreground text-sm">
                Nenhuma parceria neste estágio
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface PartnershipKanbanProps {
  partnerships: Partnership[];
  onUpdateStage: (partnershipId: string, newStage: PartnershipStage) => void;
}

const PartnershipKanban = ({ partnerships, onUpdateStage }: PartnershipKanbanProps) => {
  // Agrupar parcerias por estágio
  const partnershipsByStage = useMemo(() => {
    const grouped: Record<PartnershipStage, Partnership[]> = Object.values(PartnershipStage).reduce((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {} as Record<PartnershipStage, Partnership[]>);

    partnerships.forEach(partnership => {
      grouped[partnership.stage].push(partnership);
    });

    return grouped;
  }, [partnerships]);

  // Handler para quando um card é movido entre colunas
  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Se não tiver destino ou se for o mesmo lugar, não faz nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Atualiza o estágio da parceria
    const newStage = destination.droppableId as PartnershipStage;
    onUpdateStage(draggableId, newStage);
  }, [onUpdateStage]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-6 px-6 -mx-6 min-h-[calc(100vh-200px)]">
        <div className="flex pb-4">
          {Object.values(PartnershipStage).map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              partnerships={partnershipsByStage[stage] || []}
              droppableId={stage}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default PartnershipKanban;
