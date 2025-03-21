
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ExhibitionData {
  name: string;
  atual: number;
  anterior: number;
}

interface MonthlyExhibitionsCardProps {
  data: ExhibitionData[];
  totalExhibitions: number;
  comparisonPercentage: number;
  className?: string;
}

const MonthlyExhibitionsCard: React.FC<MonthlyExhibitionsCardProps> = ({
  data,
  totalExhibitions,
  comparisonPercentage,
  className
}) => {
  const isPositive = comparisonPercentage >= 0;
  
  return (
    <Card className={cn("animate-fade-up", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total de Exibições Mensais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col">
          <span className="stat-value">{totalExhibitions.toLocaleString()}</span>
          <div className={cn(
            "flex items-center text-xs",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span className="ml-1">{Math.abs(comparisonPercentage)}% em relação ao mês anterior</span>
          </div>
        </div>
        
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{ 
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  border: '1px solid hsl(var(--border))'
                }}
                itemStyle={{ fontSize: 12 }}
                labelStyle={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}
              />
              <Bar 
                dataKey="atual" 
                name="Mês Atual" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="anterior" 
                name="Mês Anterior" 
                fill="hsl(var(--secondary))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExhibitionsCard;
