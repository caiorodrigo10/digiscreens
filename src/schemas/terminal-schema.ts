
import * as z from "zod";
import { SocialClass, TerminalCategory, WeekDay } from "@/types/terminal";

// Regex for Brazilian phone number validation
const phoneRegex = /^\(\d{2}\) \d \d{4}-\d{4}$/;
// Regex for Brazilian ZIP code validation - allow with or without hyphen
const cepRegex = /^\d{5}-?\d{3}$/;

export const terminalFormSchema = z.object({
  // Basic Information
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  category: z.string() as z.ZodType<TerminalCategory>,
  
  // Address
  address: z.object({
    street: z.string().min(3, { message: "Rua é obrigatória" }),
    number: z.string().min(1, { message: "Número é obrigatório" }),
    complement: z.string().optional(),
    zipCode: z.string().regex(cepRegex, { message: "CEP inválido (formato: 00000-000 ou 00000000)" }),
    neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
    state: z.string().length(2, { message: "Estado deve ter 2 caracteres (sigla)" }),
    city: z.string().min(2, { message: "Cidade é obrigatória" }),
  }),
  
  // Contact
  phones: z.object({
    primary: z.string().regex(phoneRegex, { message: "Telefone inválido (formato: (00) 0 0000-0000)" }),
    secondary: z.string().regex(phoneRegex, { message: "Telefone inválido (formato: (00) 0 0000-0000)" }).optional(),
  }),
  
  // Operating Hours
  operatingHours: z.object({
    start: z.string().min(1, { message: "Horário de abertura é obrigatório" }),
    end: z.string().min(1, { message: "Horário de fechamento é obrigatório" }),
    workDays: z.array(z.string() as z.ZodType<WeekDay>).min(1, { message: "Selecione pelo menos um dia da semana" }),
  }),
  
  // Demographics
  demographics: z.object({
    averageFootTraffic: z.coerce.number().min(1, { message: "Fluxo médio de pessoas é obrigatório" }),
    socialClass: z.array(z.string() as z.ZodType<SocialClass>).min(1, { message: "Selecione pelo menos uma classe social" }),
  }),
  
  // Media
  media: z.object({
    images: z.array(z.string()).min(1, { message: "Adicione pelo menos uma imagem" }),
    videos: z.array(z.string()).optional(),
  }),
});

export type TerminalFormValues = z.infer<typeof terminalFormSchema>;
