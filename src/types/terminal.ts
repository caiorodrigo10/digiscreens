
import { ScreenConfig } from '@/types/screen';

export type TerminalCategory = 
  | 'farmacia' 
  | 'loterica' 
  | 'padaria' 
  | 'loja_roupas' 
  | 'loja_pet' 
  | 'shopping' 
  | 'supermercado' 
  | 'hospital' 
  | 'posto_gasolina' 
  | 'academia' 
  | 'loja_moveis'
  | 'loja_material_construcao'
  | 'concessionaria'
  | 'hotel'
  | 'escola'
  | 'consultorio_odontologico'
  | 'lavanderia'
  | 'floricultura'
  | 'joalheria'
  | 'loja_brinquedos'
  | 'loja_informatica'
  | 'livraria'
  | 'loja_calcados'
  | 'loja_esportes'
  | 'loja_cosmeticos'
  | 'loja_acessorios'
  | 'loja_artigos_casa'
  | 'loja_produtos_naturais'
  | 'loja_instrumentos_musicais'
  | 'loja_decoracao'
  | 'loja_conveniencia'
  | 'papelaria'
  | 'agencia_viagens'
  | 'oficina_mecanica'
  | 'funeraria'
  | 'loja_artesanato'
  | 'loja_bebidas'
  | 'loja_eletronicos'
  | 'loja_produtos_limpeza'
  | 'loja_artigos_esportivos'
  | 'loja_produtos_bebes'
  | 'agencia_publicidade'
  | 'escritorio_contabilidade'
  | 'barbearia'
  | 'banco'
  | 'promotora_credito'
  | 'energia_solar'
  | 'engenharia'
  | 'consultoria'
  | 'otica'
  | 'clinica_medica'
  | 'hortifruti'
  | 'provedor_internet'
  | 'residencial'
  | 'outro';

export type ScreenType = 'tv_vertical' | 'tv_horizontal' | 'led';

export type TerminalStatus = 'online' | 'offline' | 'maintenance';

export type SocialClass = 'A' | 'B' | 'C' | 'D';

export type WeekDay = 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';

export interface Terminal {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  category: TerminalCategory;
  status: TerminalStatus;
  screens: {
    total: number;
    available: number;
    types: {
      type: ScreenType;
      count: number;
    }[];
  };
  imageUrl?: string;
  lastConnection?: string;
  isFavorite: boolean;
  // Location coordinates
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  // CEP (Postal code)
  cep?: string;
  // New fields
  addressDetails?: {
    street: string;
    number: string;
    complement?: string;
    zipCode: string;
  };
  phones?: {
    primary?: string;
    secondary?: string;
  };
  operatingHours?: {
    start: string;
    end: string;
    workDays: WeekDay[];
  };
  demographics?: {
    averageFootTraffic: number;
    socialClass: SocialClass[];
  };
  media?: {
    images: string[];
    videos?: string[];
  };
  // Added screens configuration
  screenConfigs?: ScreenConfig[];
}

export const getCategoryLabel = (category: TerminalCategory): string => {
  const categoryLabels: Record<TerminalCategory, string> = {
    farmacia: 'Farmácia',
    loterica: 'Lotérica',
    padaria: 'Padaria',
    loja_roupas: 'Loja de Roupas',
    loja_pet: 'Pet Shop',
    shopping: 'Shopping',
    supermercado: 'Supermercado',
    hospital: 'Hospital',
    posto_gasolina: 'Posto de Gasolina',
    academia: 'Academia',
    loja_moveis: 'Loja de Móveis',
    loja_material_construcao: 'Loja de Material de Construção',
    concessionaria: 'Concessionária de Veículos',
    hotel: 'Hotel',
    escola: 'Escola/Faculdade/Creche',
    consultorio_odontologico: 'Consultório Odontológico',
    lavanderia: 'Lavanderia',
    floricultura: 'Floricultura',
    joalheria: 'Joalheria',
    loja_brinquedos: 'Loja de Brinquedos',
    loja_informatica: 'Loja de Informática',
    livraria: 'Livraria',
    loja_calcados: 'Loja de Calçados',
    loja_esportes: 'Loja de Esportes',
    loja_cosmeticos: 'Loja de Cosméticos',
    loja_acessorios: 'Loja de Acessórios',
    loja_artigos_casa: 'Loja de Artigos para Casa',
    loja_produtos_naturais: 'Loja de Produtos Naturais',
    loja_instrumentos_musicais: 'Loja de Instrumentos Musicais',
    loja_decoracao: 'Loja de Decoração',
    loja_conveniencia: 'Loja de Conveniência',
    papelaria: 'Papelaria',
    agencia_viagens: 'Agência de Viagens',
    oficina_mecanica: 'Oficina Mecânica',
    funeraria: 'Funerária',
    loja_artesanato: 'Loja de Artesanato',
    loja_bebidas: 'Loja de Bebidas',
    loja_eletronicos: 'Eletrônica',
    loja_produtos_limpeza: 'Loja de Produtos de Limpeza',
    loja_artigos_esportivos: 'Loja de Artigos Esportivos',
    loja_produtos_bebes: 'Loja de Produtos para Bebês',
    agencia_publicidade: 'Agência de Publicidade',
    escritorio_contabilidade: 'Escritório de Contabilidade',
    barbearia: 'Barbearia',
    banco: 'Banco',
    promotora_credito: 'Promotora de Crédito',
    energia_solar: 'Energia Solar',
    engenharia: 'Engenharia',
    consultoria: 'Consultoria',
    otica: 'Ótica',
    clinica_medica: 'Clínica Médica',
    hortifruti: 'Hortifruti',
    provedor_internet: 'Provedor de internet',
    residencial: 'Residencial',
    outro: 'Outro'
  };
  
  return categoryLabels[category] || 'Outro';
};

export const getScreenTypeLabel = (type: ScreenType): string => {
  const screenLabels: Record<ScreenType, string> = {
    tv_vertical: 'TV Vertical',
    tv_horizontal: 'TV Horizontal',
    led: 'Painel LED'
  };
  
  return screenLabels[type] || type;
};

export const getWeekDayLabel = (day: WeekDay): string => {
  const dayLabels: Record<WeekDay, string> = {
    domingo: 'Domingo',
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado'
  };
  
  return dayLabels[day];
};

export const getSocialClassLabel = (socialClass: SocialClass): string => {
  return `Classe ${socialClass}`;
};

