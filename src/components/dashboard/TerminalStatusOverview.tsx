
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TerminalStatusOverviewProps {
  totalTerminals: number;
  onlineTerminals: number;
  className?: string;
}

const TerminalStatusOverview: React.FC<TerminalStatusOverviewProps> = ({
  totalTerminals,
  onlineTerminals,
  className
}) => {
  const onlinePercentage = Math.round((onlineTerminals / totalTerminals) * 100) || 0;
  const offlineTerminals = totalTerminals - onlineTerminals;
  
  return (
    <Card className={cn("animate-fade-up", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Status das Telas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span>{onlinePercentage}% Online</span>
          </div>
          <Progress value={onlinePercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="status-pulse text-green-500" />
            <div>
              <p className="text-sm font-medium">{onlineTerminals}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="status-pulse text-red-500" />
            <div>
              <p className="text-sm font-medium">{offlineTerminals}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TerminalStatusOverview;
