import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar, BarChart3, TrendingUp, Users } from "lucide-react";

interface ScreenStatisticsProps {
  screenId: string;
}

// Mock data for screen statistics
const mockStatistics = {
  today: {
    views: 342,
    avgViewTime: 23, // seconds
    peakHour: '14:00',
    uniqueViewers: 278,
    completionRate: 87, // percentage
  },
  week: {
    views: 2156,
    avgViewTime: 26, // seconds
    peakDay: 'Quarta',
    uniqueViewers: 1845,
    completionRate: 82, // percentage
    dailyViews: [320, 410, 520, 480, 390, 280, 310], // Sun to Sat
  },
  month: {
    views: 8934,
    avgViewTime: 24, // seconds
    peakWeek: 'Segunda semana',
    uniqueViewers: 7120,
    completionRate: 79, // percentage
    weeklyViews: [1800, 2300, 2500, 2100], // 4 weeks
  }
};

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ScreenStatistics: React.FC<ScreenStatisticsProps> = ({ screenId }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Estatísticas de Exibição</h3>
        
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="today" className="flex-1">Hoje</TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Semana</TabsTrigger>
            <TabsTrigger value="month" className="flex-1">Mês</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Visualizações
                  </span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    Hoje
                  </Badge>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.today.views}</span>
                <span className="text-xs text-green-600 mt-1">+12% vs. ontem</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Tempo médio
                  </span>
                </div>
                <span className="text-2xl font-bold">{formatTime(mockStatistics.today.avgViewTime)}</span>
                <span className="text-xs text-green-600 mt-1">+3s vs. ontem</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Espectadores únicos
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.today.uniqueViewers}</span>
                <span className="text-xs text-green-600 mt-1">+8% vs. ontem</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Taxa de conclusão
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.today.completionRate}%</span>
                <span className="text-xs text-red-600 mt-1">-2% vs. ontem</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Horário de pico</span>
                <span className="text-sm">{mockStatistics.today.peakHour}</span>
              </div>
              <div className="h-32 bg-muted/20 rounded-md flex items-end p-2 gap-1">
                {Array.from({ length: 24 }).map((_, i) => {
                  // Generate a random height for each hour bar, with the peak hour being the tallest
                  const isPeakHour = mockStatistics.today.peakHour === `${i}:00`;
                  const height = isPeakHour ? 100 : Math.floor(30 + Math.random() * 50);
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 ${isPeakHour ? 'bg-primary' : 'bg-primary/40'} rounded-t`}
                      style={{ height: `${height}%` }}
                      title={`${i}:00 - ${i+1}:00`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:00</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="week">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Visualizações
                  </span>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                    Semana
                  </Badge>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.week.views}</span>
                <span className="text-xs text-green-600 mt-1">+8% vs. semana anterior</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Tempo médio
                  </span>
                </div>
                <span className="text-2xl font-bold">{formatTime(mockStatistics.week.avgViewTime)}</span>
                <span className="text-xs text-green-600 mt-1">+5s vs. semana anterior</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Dia de pico
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.week.peakDay}</span>
                <span className="text-xs text-muted-foreground mt-1">520 visualizações</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Taxa de conclusão
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.week.completionRate}%</span>
                <span className="text-xs text-green-600 mt-1">+3% vs. semana anterior</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Visualizações diárias</span>
              </div>
              <div className="h-40 bg-muted/20 rounded-md flex items-end p-4 gap-3">
                {mockStatistics.week.dailyViews.map((views, i) => {
                  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                  const isPeakDay = mockStatistics.week.peakDay === days[i];
                  // Calculate height percentage based on views
                  const maxViews = Math.max(...mockStatistics.week.dailyViews);
                  const height = (views / maxViews) * 100;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={`w-full ${isPeakDay ? 'bg-primary' : 'bg-primary/40'} rounded-t`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{days[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="month">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Visualizações
                  </span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    Mês
                  </Badge>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.month.views}</span>
                <span className="text-xs text-green-600 mt-1">+15% vs. mês anterior</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Espectadores únicos
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.month.uniqueViewers}</span>
                <span className="text-xs text-green-600 mt-1">+12% vs. mês anterior</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    Semana de pico
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.month.peakWeek}</span>
                <span className="text-xs text-muted-foreground mt-1">2500 visualizações</span>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-md flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Taxa de conclusão
                  </span>
                </div>
                <span className="text-2xl font-bold">{mockStatistics.month.completionRate}%</span>
                <span className="text-xs text-red-600 mt-1">-1% vs. mês anterior</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Visualizações semanais</span>
              </div>
              <div className="h-40 bg-muted/20 rounded-md flex items-end p-4 gap-4">
                {mockStatistics.month.weeklyViews.map((views, i) => {
                  const isPeakWeek = mockStatistics.month.peakWeek === `${['Primeira', 'Segunda', 'Terceira', 'Quarta'][i]} semana`;
                  // Calculate height percentage based on views
                  const maxViews = Math.max(...mockStatistics.month.weeklyViews);
                  const height = (views / maxViews) * 100;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={`w-full ${isPeakWeek ? 'bg-primary' : 'bg-primary/40'} rounded-t`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">Semana {i+1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScreenStatistics;
