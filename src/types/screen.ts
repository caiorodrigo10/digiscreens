
import { z } from "zod";

export type ScreenType = 'tv_horizontal' | 'tv_vertical' | 'led';
export type ScreenStatus = 'active' | 'inactive';

export interface ScreenConfig {
  id: string;
  type: ScreenType;
  name: string;
  updateCycle: number; // in minutes
  audioEnabled: boolean;
  timezone: string;
  footerEnabled: boolean;
  status: ScreenStatus;
}

export const screenTypeSchema = z.enum(['tv_horizontal', 'tv_vertical', 'led']);

export const screenConfigSchema = z.object({
  type: screenTypeSchema,
  name: z.string().min(1, "Nome da tela é obrigatório"),
  updateCycle: z.number().min(1, "Ciclo de atualização deve ser de pelo menos 1 minuto"),
  audioEnabled: z.boolean(),
  timezone: z.string(),
  footerEnabled: z.boolean(),
});

export const getScreenTypeLabel = (type: ScreenType): string => {
  const typeLabels: Record<ScreenType, string> = {
    tv_horizontal: 'TV Horizontal',
    tv_vertical: 'TV Vertical',
    led: 'Painel LED'
  };
  
  return typeLabels[type];
};
