import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainNav from '@/components/navigation/MainNav';
import PartnershipKanban from '@/components/partnerships/PartnershipKanban';
import PartnershipList from '@/components/partnerships/PartnershipList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import NewPartnershipForm from '@/components/partnerships/NewPartnershipForm';
import { Partnership, PartnershipStage } from '@/types/partnership';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Dados simulados para a pipeline de parcerias
const MOCK_PARTNERSHIPS: Partnership[] = [
  {
    id: '1',
    companyName: 'Shopping Morumbi',
    contactName: 'Carlos Silva',
    contactEmail: 'carlos.silva@morumbi.com',
    contactPhone: '(11) 98765-4321',
    address: 'Av. Roque Petroni Júnior, 1089',
    city: 'São Paulo',
    state: 'SP',
    category: 'shopping',
    potentialScreens: 8,
    stage: PartnershipStage.ANALYSIS,
    stageUpdatedAt: new Date('2025-03-15'),
    notes: 'Shopping interessado em telas digitais para área de alimentação',
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-15'),
    assignedTo: 'user1',
    tasks: [
      {
        id: 't1',
        partnershipId: '1',
        title: 'Agendar reunião inicial',
        description: 'Entrar em contato para agendar reunião de apresentação',
        dueDate: new Date('2025-03-25'),
        completed: false,
        createdAt: new Date('2025-03-15'),
        updatedAt: new Date('2025-03-15')
      }
    ]
  },
  {
    id: '2',
    companyName: 'Farmácia Saúde Total',
    contactName: 'Ana Oliveira',
    contactEmail: 'ana@saudetotal.com',
    contactPhone: '(11) 97654-3210',
    address: 'Rua Augusta, 1500',
    city: 'São Paulo',
    state: 'SP',
    category: 'farmacia',
    potentialScreens: 3,
    stage: PartnershipStage.VISIT,
    stageUpdatedAt: new Date('2025-03-10'),
    notes: 'Rede de farmácias com 5 unidades na capital',
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-03-10'),
    assignedTo: 'user2',
    tasks: [
      {
        id: 't2',
        partnershipId: '2',
        title: 'Visita técnica',
        description: 'Realizar visita para avaliar locais de instalação',
        dueDate: new Date('2025-03-20'),
        completed: false,
        createdAt: new Date('2025-03-10'),
        updatedAt: new Date('2025-03-10')
      }
    ]
  },
  {
    id: '3',
    companyName: 'Terminal Rodoviário Tietê',
    contactName: 'Roberto Mendes',
    contactEmail: 'roberto@socicam.com.br',
    contactPhone: '(11) 3855-7890',
    address: 'Av. Cruzeiro do Sul, 1800',
    city: 'São Paulo',
    state: 'SP',
    category: 'outro',
    potentialScreens: 12,
    stage: PartnershipStage.NEGOTIATION,
    stageUpdatedAt: new Date('2025-03-12'),
    notes: 'Alto fluxo de pessoas, interesse em telas verticais e horizontais',
    createdAt: new Date('2025-02-28'),
    updatedAt: new Date('2025-03-12'),
    assignedTo: 'user1',
    tasks: [
      {
        id: 't3',
        partnershipId: '3',
        title: 'Enviar proposta comercial',
        description: 'Preparar e enviar proposta detalhada',
        dueDate: new Date('2025-03-18'),
        completed: true,
        createdAt: new Date('2025-03-05'),
        updatedAt: new Date('2025-03-15')
      },
      {
        id: 't4',
        partnershipId: '3',
        title: 'Reunião de negociação',
        description: 'Discutir termos da proposta',
        dueDate: new Date('2025-03-22'),
        completed: false,
        createdAt: new Date('2025-03-15'),
        updatedAt: new Date('2025-03-15')
      }
    ]
  },
  {
    id: '4',
    companyName: 'Supermercado Bom Preço',
    contactName: 'Marcelo Santos',
    contactEmail: 'marcelo@bompreco.com',
    contactPhone: '(11) 99876-5432',
    address: 'Av. Paulista, 2200',
    city: 'São Paulo',
    state: 'SP',
    category: 'supermercado',
    potentialScreens: 5,
    stage: PartnershipStage.INSTALLATION,
    stageUpdatedAt: new Date('2025-03-18'),
    notes: 'Instalação em 2 unidades inicialmente, com possibilidade de expansão',
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-03-18'),
    assignedTo: 'user3',
    tasks: [
      {
        id: 't5',
        partnershipId: '4',
        title: 'Agendar instalação',
        description: 'Coordenar com equipe técnica a data de instalação',
        dueDate: new Date('2025-03-25'),
        completed: true,
        createdAt: new Date('2025-03-18'),
        updatedAt: new Date('2025-03-19')
      }
    ]
  },
  {
    id: '5',
    companyName: 'Academia Fitness Club',
    contactName: 'Patrícia Lima',
    contactEmail: 'patricia@fitnessclub.com',
    contactPhone: '(11) 98888-7777',
    address: 'Rua Vergueiro, 1500',
    city: 'São Paulo',
    state: 'SP',
    category: 'outro',
    potentialScreens: 4,
    stage: PartnershipStage.CLOSED,
    stageUpdatedAt: new Date('2025-03-05'),
    notes: 'Parceria fechada com contrato de 2 anos',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-03-05'),
    assignedTo: 'user2',
    tasks: []
  }
];

const Parcerias = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>(MOCK_PARTNERSHIPS);
  const [activeTab, setActiveTab] = useState<string>('kanban');
  const [isNewPartnershipDialogOpen, setIsNewPartnershipDialogOpen] = useState(false);

  // Função para adicionar nova parceria
  const handleAddPartnership = (newPartnership: Partnership) => {
    setPartnerships([...partnerships, newPartnership]);
    setIsNewPartnershipDialogOpen(false);
  };

  // Função para atualizar o estágio de uma parceria
  const handleUpdateStage = (partnershipId: string, newStage: PartnershipStage) => {
    setPartnerships(partnerships.map(partnership => 
      partnership.id === partnershipId 
        ? { 
            ...partnership, 
            stage: newStage, 
            stageUpdatedAt: new Date(),
            updatedAt: new Date()
          } 
        : partnership
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <MainNav />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        {/* Cabeçalho fixo separado do conteúdo principal */}
        <div className="fixed top-0 left-0 right-0 z-20 bg-[#f5f7fa] border-b ml-0 md:ml-64">
          <header className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pipeline de Parcerias</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie o processo de estabelecimento de novas parcerias
              </p>
            </div>
            
            {/* Abas no cabeçalho */}
            <div className="flex-1 flex justify-center items-center mx-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="h-full">
                  <TabsTrigger value="kanban" className="h-full">Kanban</TabsTrigger>
                  <TabsTrigger value="list" className="h-full">Lista</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          
          <Dialog open={isNewPartnershipDialogOpen} onOpenChange={setIsNewPartnershipDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Parceria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Parceria</DialogTitle>
              </DialogHeader>
              <NewPartnershipForm onSubmit={handleAddPartnership} />
            </DialogContent>
          </Dialog>
          </header>
        </div>
        
        {/* Espaçador para compensar o header fixo */}
        <div className="h-[100px] sm:h-[88px] mb-6"></div>
        
        {/* Conteúdo expandido */}
        <div className="flex-1 overflow-hidden mt-4">
          {/* Visualização Kanban - largura total */}
          {activeTab === 'kanban' && (
            <div className="kanban-container w-full">
              <PartnershipKanban 
                partnerships={partnerships}
                onUpdateStage={handleUpdateStage}
              />
            </div>
          )}
          
          {/* Visualização Lista - largura fixa */}
          {activeTab === 'list' && (
            <div className="list-container container max-w-7xl mx-auto px-4 sm:px-6">
              <PartnershipList 
                partnerships={partnerships}
                onUpdateStage={handleUpdateStage}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </DndProvider>
  );
};

export default Parcerias;
