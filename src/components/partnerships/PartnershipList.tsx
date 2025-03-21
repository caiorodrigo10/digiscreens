import React, { useState } from 'react';
import { Partnership, PartnershipStage } from '@/types/partnership';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpDown, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PartnershipListProps {
  partnerships: Partnership[];
  onUpdateStage: (partnershipId: string, newStage: PartnershipStage) => void;
}

const PartnershipList: React.FC<PartnershipListProps> = ({ 
  partnerships,
  onUpdateStage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Partnership>('companyName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Função para definir a cor do badge de categoria
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shopping':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'farmacia':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'supermercado':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Função para definir a cor do badge de estágio
  const getStageColor = (stage: PartnershipStage) => {
    switch (stage) {
      case PartnershipStage.ANALYSIS:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case PartnershipStage.VISIT:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case PartnershipStage.NEGOTIATION:
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case PartnershipStage.INSTALLATION:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case PartnershipStage.CLOSED:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Função para alternar a direção da ordenação
  const toggleSort = (field: keyof Partnership) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrar e ordenar parcerias
  const filteredAndSortedPartnerships = [...partnerships]
    .filter(partnership => 
      partnership.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partnership.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partnership.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partnership.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Ordenação especial para datas
      if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'stageUpdatedAt') {
        const aDate = a[sortField] as Date;
        const bDate = b[sortField] as Date;
        return sortDirection === 'asc' 
          ? aDate.getTime() - bDate.getTime() 
          : bDate.getTime() - aDate.getTime();
      }
      
      // Ordenação para campos de texto
      if (sortField === 'companyName' || sortField === 'contactName' || sortField === 'city' || sortField === 'state' || sortField === 'category') {
        const aValue = a[sortField] as string;
        const bValue = b[sortField] as string;
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Ordenação para campos numéricos
      if (sortField === 'potentialScreens') {
        const aValue = a[sortField] as number;
        const bValue = b[sortField] as number;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Ordenação para estágio (baseado na ordem da enumeração)
      if (sortField === 'stage') {
        const stageOrder = Object.values(PartnershipStage);
        const aIndex = stageOrder.indexOf(a.stage);
        const bIndex = stageOrder.indexOf(b.stage);
        return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
      }
      
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar parcerias..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('companyName')}
                >
                  Empresa
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[200px]">
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('contactName')}
                >
                  Contato
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('city')}
                >
                  Localização
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('potentialScreens')}
                >
                  <Monitor className="mr-1 h-3.5 w-3.5" />
                  Telas
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('category')}
                >
                  Categoria
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('stage')}
                >
                  Estágio
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent"
                  onClick={() => toggleSort('updatedAt')}
                >
                  Atualização
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPartnerships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma parceria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedPartnerships.map((partnership) => (
                <TableRow key={partnership.id}>
                  <TableCell className="font-medium min-w-[220px]">{partnership.companyName}</TableCell>
                  <TableCell className="min-w-[200px]">
                    <div>{partnership.contactName}</div>
                    <div className="text-xs text-muted-foreground">{partnership.contactPhone}</div>
                  </TableCell>
                  <TableCell>
                    {partnership.city}, {partnership.state}
                  </TableCell>
                  <TableCell className="text-center">{partnership.potentialScreens}</TableCell>
                  <TableCell>
                    <Badge className={cn(getCategoryColor(partnership.category))}>
                      {partnership.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={partnership.stage}
                      onValueChange={(value) => onUpdateStage(partnership.id, value as PartnershipStage)}
                    >
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue>
                          <Badge className={cn(getStageColor(partnership.stage))}>
                            {partnership.stage}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PartnershipStage).map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            <Badge className={cn(getStageColor(stage as PartnershipStage))}>
                              {stage}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(partnership.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PartnershipList;
