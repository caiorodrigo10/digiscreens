
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatusCard = ({ title, value, description, icon, className, trend }: StatusCardProps) => {
  return (
    <Card className={cn("overflow-hidden animate-fade-up", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground w-4 h-4">{icon}</div>}
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-2 text-xs">{description}</CardDescription>
        )}
        {trend && (
          <div className={cn(
            "flex items-center mt-2 text-xs",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span className="ml-1">{trend.value}% em relação ao mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
