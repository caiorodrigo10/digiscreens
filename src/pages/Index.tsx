
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatusCard from '@/components/dashboard/StatusCard';
import TerminalStatusOverview from '@/components/dashboard/TerminalStatusOverview';
import MonthlyExhibitionsCard from '@/components/dashboard/MonthlyExhibitionsCard';
import TerminalHealthChart from '@/components/dashboard/TerminalHealthChart';
import TopTerminals from '@/components/dashboard/TopTerminals';
import FavoriteTerminals from '@/components/dashboard/FavoriteTerminals';
import { Monitor, Activity, Gauge, Tv } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import { Terminal } from '@/types/terminal';

// Dados simulados para a dashboard
const MOCK_HEALTH_DATA = [
  { day: 'Seg', uptime: 98, exibicoes: 120 },
  { day: 'Ter', uptime: 95, exibicoes: 132 },
  { day: 'Qua', uptime: 99, exibicoes: 145 },
  { day: 'Qui', uptime: 97, exibicoes: 130 },
  { day: 'Sex', uptime: 96, exibicoes: 142 },
  { day: 'Sáb', uptime: 94, exibicoes: 115 },
  { day: 'Dom', uptime: 92, exibicoes: 102 },
];

const MOCK_MONTHLY_DATA = [
  { name: 'Semana 1', atual: 4000, anterior: 3500 },
  { name: 'Semana 2', atual: 4200, anterior: 3800 },
  { name: 'Semana 3', atual: 5800, anterior: 4200 },
  { name: 'Semana 4', atual: 6000, anterior: 5000 },
];

const MOCK_TERMINALS: Terminal[] = [
  { 
    id: '1', 
    name: 'Shopping Center Norte', 
    location: 'São Paulo, SP',
    address: 'Av. Travessa Norte, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    category: 'shopping',
    status: 'online',
    screens: {
      total: 5,
      available: 4,
      types: [
        { type: 'tv_vertical', count: 3 },
        { type: 'tv_horizontal', count: 2 }
      ]
    },
    metrics: { exibicoes: 5420, uptime: 98 },
    isFavorite: false 
  },
  { 
    id: '2', 
    name: 'Aeroporto Congonhas', 
    location: 'São Paulo, SP',
    address: 'Av. Washington Luis, 456',
    neighborhood: 'Campo Belo',
    city: 'São Paulo',
    state: 'SP',
    category: 'outro',
    status: 'online',
    screens: {
      total: 8,
      available: 6,
      types: [
        { type: 'tv_horizontal', count: 8 }
      ]
    },
    metrics: { exibicoes: 4830, uptime: 95 },
    isFavorite: true 
  },
  { 
    id: '3', 
    name: 'Estação Sé', 
    location: 'São Paulo, SP',
    address: 'Praça da Sé, s/n',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    category: 'outro',
    status: 'offline',
    screens: {
      total: 4,
      available: 2,
      types: [
        { type: 'tv_vertical', count: 4 }
      ]
    },
    metrics: { exibicoes: 3720, uptime: 82 },
    isFavorite: false 
  },
  { 
    id: '4', 
    name: 'Shopping Barra', 
    location: 'Rio de Janeiro, RJ',
    address: 'Av. das Américas, 789',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    category: 'shopping',
    status: 'online',
    screens: {
      total: 7,
      available: 7,
      types: [
        { type: 'tv_vertical', count: 4 },
        { type: 'led', count: 3 }
      ]
    },
    metrics: { exibicoes: 4150, uptime: 94 },
    isFavorite: true 
  },
  { 
    id: '5', 
    name: 'Shopping BH', 
    location: 'Belo Horizonte, MG',
    address: 'Av. dos Andradas, 321',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG',
    category: 'shopping',
    status: 'online',
    screens: {
      total: 6,
      available: 5,
      types: [
        { type: 'tv_horizontal', count: 3 },
        { type: 'led', count: 3 }
      ]
    },
    metrics: { exibicoes: 3980, uptime: 97 },
    isFavorite: false 
  },
];

const Index = () => {
  // Estado para os terminais e seus favoritos
  const [terminals, setTerminals] = useState(MOCK_TERMINALS);
  
  // Função para alternar o status de favorito
  const handleToggleFavorite = (id: string) => {
    setTerminals(prevTerminals => 
      prevTerminals.map(terminal => 
        terminal.id === id 
          ? { ...terminal, isFavorite: !terminal.isFavorite } 
          : terminal
      )
    );
  };
  
  // Função para remover dos favoritos
  const handleRemoveFavorite = (id: string) => {
    handleToggleFavorite(id);
  };
  
  // Filtragem de terminais favoritos
  const favoriteTerminals = terminals.filter(terminal => terminal.isFavorite);
  
  // Contadores
  const totalTerminals = terminals.length;
  const onlineTerminals = terminals.filter(terminal => terminal.status === 'online').length;
  
  // Ordenar terminais por exibições (top performers)
  const topTerminals = [...terminals]
    .sort((a, b) => (b.metrics?.exibicoes || 0) - (a.metrics?.exibicoes || 0))
    .slice(0, 5);
    
  // Cálculo para exibições mensais
  const totalExhibitions = MOCK_MONTHLY_DATA.reduce((sum, week) => sum + week.atual, 0);
  const previousMonthExhibitions = MOCK_MONTHLY_DATA.reduce((sum, week) => sum + week.anterior, 0);
  const comparisonPercentage = Math.round(
    ((totalExhibitions - previousMonthExhibitions) / previousMonthExhibitions) * 100
  );
  
  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6">
          <header className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>
            <p className="text-muted-foreground mt-1">
              Monitoramento de telas digitais e terminais
            </p>
          </header>
          
          <div className="grid gap-8">
            {/* Status Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatusCard 
                title="Total de Telas" 
                value={totalTerminals}
                icon={<Monitor />} 
              />
              <StatusCard 
                title="Saúde do Sistema" 
                value="96%"
                description="Média de uptime nas últimas 24h"
                icon={<Activity />}
                trend={{ value: 2, isPositive: true }}
              />
              <TerminalStatusOverview 
                totalTerminals={totalTerminals}
                onlineTerminals={onlineTerminals}
                className="sm:col-span-2"
              />
            </div>
            
            {/* Main Content - Charts and Terminal Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Charts (2/3 width on large screens) */}
              <div className="lg:col-span-2 grid gap-6">
                <MonthlyExhibitionsCard 
                  data={MOCK_MONTHLY_DATA}
                  totalExhibitions={totalExhibitions}
                  comparisonPercentage={comparisonPercentage}
                />
                <TerminalHealthChart 
                  data={MOCK_HEALTH_DATA}
                />
              </div>
              
              {/* Right Column - Terminal Lists (1/3 width on large screens) */}
              <div className="space-y-6">
                <TopTerminals 
                  terminals={topTerminals}
                  onToggleFavorite={handleToggleFavorite}
                />
                <FavoriteTerminals 
                  terminals={favoriteTerminals}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
