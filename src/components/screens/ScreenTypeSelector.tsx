
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Monitor, Smartphone, Tv } from "lucide-react";
import { ScreenType, getScreenTypeLabel } from '@/types/screen';

interface ScreenTypeSelectorProps {
  value: ScreenType;
  onChange: (value: ScreenType) => void;
}

const ScreenTypeSelector: React.FC<ScreenTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as ScreenType)}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <Label
        htmlFor="tv_horizontal"
        className="cursor-pointer"
      >
        <Card className={`h-full transition-all ${value === 'tv_horizontal' ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Tv className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <RadioGroupItem
                value="tv_horizontal"
                id="tv_horizontal"
                className="sr-only"
              />
              <p className="font-medium">TV Horizontal</p>
              <p className="text-sm text-muted-foreground">
                Tela em formato paisagem, ideal para conteúdos horizontais
              </p>
            </div>
          </CardContent>
        </Card>
      </Label>

      <Label
        htmlFor="tv_vertical"
        className="cursor-pointer"
      >
        <Card className={`h-full transition-all ${value === 'tv_vertical' ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <RadioGroupItem
                value="tv_vertical"
                id="tv_vertical"
                className="sr-only"
              />
              <p className="font-medium">TV Vertical</p>
              <p className="text-sm text-muted-foreground">
                Tela em formato retrato, ótima para conteúdos verticais
              </p>
            </div>
          </CardContent>
        </Card>
      </Label>

      <Label
        htmlFor="led"
        className="cursor-pointer"
      >
        <Card className={`h-full transition-all ${value === 'led' ? 'border-primary ring-2 ring-primary/20' : ''}`}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Monitor className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <RadioGroupItem
                value="led"
                id="led"
                className="sr-only"
              />
              <p className="font-medium">Painel LED</p>
              <p className="text-sm text-muted-foreground">
                Painel eletrônico para mensagens e informações visuais
              </p>
            </div>
          </CardContent>
        </Card>
      </Label>
    </RadioGroup>
  );
};

export default ScreenTypeSelector;
