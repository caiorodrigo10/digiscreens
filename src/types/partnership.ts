// Enumeração dos estágios da pipeline
export enum PartnershipStage {
  ANALYSIS = "Em análise",
  VISIT = "Visitar Local",
  NEGOTIATION = "Em negociação",
  INSTALLATION = "Instalação",
  CLOSED = "Parceria fechada"
}

// Modelo de Tarefa relacionada à parceria
export interface PartnershipTask {
  id: string;
  partnershipId: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Modelo de Parceria
export interface Partnership {
  id: string;
  companyName: string;         // Nome da empresa parceira
  contactName: string;         // Nome do contato principal
  contactEmail: string;        // Email do contato
  contactPhone: string;        // Telefone do contato
  address: string;             // Endereço do estabelecimento
  city: string;                // Cidade
  state: string;               // Estado
  category: string;            // Categoria do estabelecimento (Shopping, Farmácia, etc.)
  potentialScreens: number;    // Número potencial de telas
  stage: PartnershipStage;     // Estágio atual na pipeline
  stageUpdatedAt: Date;        // Data da última atualização de estágio
  notes: string;               // Observações gerais
  createdAt: Date;             // Data de criação
  updatedAt: Date;             // Data da última atualização
  assignedTo: string;          // ID do usuário responsável
  tasks: PartnershipTask[];    // Tarefas relacionadas
}
