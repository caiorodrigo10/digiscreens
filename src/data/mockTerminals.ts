
import { Terminal, TerminalCategory, TerminalStatus, ScreenType } from '@/types/terminal';
import { ScreenConfig } from '@/types/screen';

// Create mock screens for Farmácia São João
const farmaciaScreens: ScreenConfig[] = [
  {
    id: 'screen-1',
    type: 'tv_vertical',
    name: 'Tela Principal - Entrada',
    updateCycle: 15,
    audioEnabled: true,
    timezone: 'America/Sao_Paulo',
    footerEnabled: true,
    status: 'active'
  },
  {
    id: 'screen-2',
    type: 'tv_horizontal',
    name: 'Tela Secundária - Caixa',
    updateCycle: 30,
    audioEnabled: false,
    timezone: 'America/Sao_Paulo',
    footerEnabled: false,
    status: 'inactive' // Changed from active to inactive
  }
];

// Create mock screens for Drogaria Mais
const drogariaScreens: ScreenConfig[] = [
  {
    id: 'screen-3',
    type: 'tv_vertical',
    name: 'Tela Promocional',
    updateCycle: 10,
    audioEnabled: true,
    timezone: 'America/Sao_Paulo',
    footerEnabled: true,
    status: 'active'
  },
  {
    id: 'screen-4',
    type: 'tv_vertical',
    name: 'Tela de Ofertas',
    updateCycle: 20,
    audioEnabled: false,
    timezone: 'America/Sao_Paulo',
    footerEnabled: true,
    status: 'active'
  },
  {
    id: 'screen-5',
    type: 'tv_horizontal',
    name: 'Tela Informativa',
    updateCycle: 25,
    audioEnabled: true,
    timezone: 'America/Sao_Paulo',
    footerEnabled: false,
    status: 'active'
  }
];

// Create mock screens for Shopping Plaza
const shoppingScreens: ScreenConfig[] = [
  {
    id: 'screen-6',
    type: 'led',
    name: 'Painel Central',
    updateCycle: 5,
    audioEnabled: false,
    timezone: 'America/Sao_Paulo',
    footerEnabled: false,
    status: 'active'
  },
  {
    id: 'screen-7',
    type: 'tv_horizontal',
    name: 'Tela Praça de Alimentação',
    updateCycle: 15,
    audioEnabled: true,
    timezone: 'America/Sao_Paulo',
    footerEnabled: true,
    status: 'active'
  },
  {
    id: 'screen-8',
    type: 'tv_vertical',
    name: 'Tela Corredor Norte',
    updateCycle: 20,
    audioEnabled: false,
    timezone: 'America/Sao_Paulo',
    footerEnabled: true,
    status: 'active'
  },
  {
    id: 'screen-9',
    type: 'tv_vertical',
    name: 'Tela Corredor Sul',
    updateCycle: 20,
    audioEnabled: false,
    timezone: 'America/Sao_Paulo',
    footerEnabled: true,
    status: 'inactive'
  }
];

// Helper function to create terminal data
const createTerminal = (
  id: string,
  name: string,
  neighborhood: string = 'Tatuapé', // Set default neighborhood to Tatuapé
  city: string = 'São Paulo',
  state: string = 'SP',
  category: TerminalCategory,
  status: TerminalStatus = 'online',
  totalScreens: number = 1,
  availableScreens: number = 0,
  screenTypes: Array<{ type: ScreenType, count: number }> = [{ type: 'tv_vertical', count: 1 }],
  imageIndex: number = 0,
  isFavorite: boolean = false,
  latitude: number = -23.5329 + (Math.random() * 0.02 - 0.01), // Random coordinates around Tatuapé
  longitude: number = -46.5763 + (Math.random() * 0.02 - 0.01)
): Terminal => {
  // Category-specific image collections from Unsplash
  const categoryImages: Record<TerminalCategory, string[]> = {
    farmacia: [
      'photo-1617080353033-e584be05e127', // pharmacy interior with medications
      'photo-1587854692152-cbe660dbde88', // pharmacy counter
      'photo-1582719471384-894fbb16e074', // modern pharmacy shelves
      'photo-1604719312566-8912e9227c6a', // pharmacy display
      'photo-1587854692152-cbe660dbde88', // pharmacy counter
    ],
    loterica: [
      'photo-1607619056574-7b8d3ee536b2', // lottery tickets
      'photo-1569937756447-1d44f657dc69', // customer service counter
      'photo-1562564055-71e051d33c19', // cash counter
      'photo-1621252179027-94483031f0ca', // payment counter
      'photo-1621505624113-831aceaba108', // cash register
    ],
    padaria: [
      'photo-1555507036-ab1f4038808a', // bakery display
      'photo-1517433670267-08bbd4be890f', // bread shelves
      'photo-1609950547346-a4f431435b2b', // bakery interior
      'photo-1568254183919-78a4f43a2877', // pastry display
      'photo-1626094309830-abbb0c99da4a', // bakery counter
    ],
    loja_roupas: [
      'photo-1567401893414-76b7b1e5a7a5', // clothing store interior
      'photo-1567401893414-76b7b1e5a7a5', // clothing racks
      'photo-1611652022419-a9419f74343c', // fashion store
      'photo-1567401893414-76b7b1e5a7a5', // clothing store interior
      'photo-1611424555758-bd52429c98c5', // women's fashion store
    ],
    loja_pet: [
      'photo-1583337130417-3346a1be7dee', // pet store shelves
      'photo-1607425515308-d804035ecebe', // pet supplies
      'photo-1545529468-42764ef8c85f', // dog in pet shop
      'photo-1600369671236-e74521d4b6ad', // pet products
      'photo-1593545608643-1e4cf931fd56', // pet store aisle
    ],
    shopping: [
      'photo-1616486338812-3dadae4b4ace', // mall interior
      'photo-1624587357340-4c98e72c36a1', // shopping center
      'photo-1581339631863-f5e0a4dce5a4', // shopping gallery
      'photo-1470072646155-37771650d131', // mall atrium
      'photo-1610913806498-8e693483e68b', // shopping hall
    ],
    supermercado: [
      'photo-1534723452862-4c874018d66d', // supermarket aisle
      'photo-1562280963-8a5475740a10', // grocery produce
      'photo-1533900298318-6b8da08a523e', // market shelf
      'photo-1579113800032-c38bd7635818', // supermarket checkout
      'photo-1601600576337-c1d8a0d1373c', // grocery store
    ],
    hospital: [
      'photo-1579684385127-1ef15d508118', // hospital corridor
      'photo-1516549655450-e9e0a9d0e7bd', // hospital reception
      'photo-1538108149393-fbbd81895907', // medical facility
      'photo-1586773860418-d37222d8fce3', // hospital room
      'photo-1584432810601-6c7f27d2fb17', // healthcare space
    ],
    posto_gasolina: [
      'photo-1545558014-8692077e9b5c', // gas station
      'photo-1614542688828-e699bd8ea80e', // gas pumps
      'photo-1568096889942-6eedde686635', // fuel station at night
      'photo-1519465484065-c5048ae9eedb', // gas station pumps
      'photo-1612708308095-1b17cb1c93c5', // modern gas station
    ],
    academia: [
      'photo-1534438327276-14e5300c3a48', // gym interior
      'photo-1571902943202-507ec2618e8f', // fitness center
      'photo-1540497077202-7c8a3999166f', // workout area
      'photo-1517130038641-a774d04afb3c', // gym equipment
      'photo-1593079831268-3381b0db4a77', // fitness room
    ],
    // Default images for other categories
    loja_moveis: ['photo-1581631057848-e7ec6c4d3338', 'photo-1555041469-a586c61ea9bc'],
    loja_material_construcao: ['photo-1607472586893-edb57bdc0e39', 'photo-1581235720704-06d3acfcb36f'],
    concessionaria: ['photo-1549027032-e650a57b0ca2', 'photo-1565043666747-69f6646db940'],
    hotel: ['photo-1566073771259-6a8506099945', 'photo-1582719508461-905c673771fd'],
    escola: ['photo-1580582932707-520aed937b7b', 'photo-1503676260728-1c00da094a0b'],
    consultorio_odontologico: ['photo-1606811971618-4486d14f3f99', 'photo-1588776814546-daab30f310ce'],
    lavanderia: ['photo-1604335399105-a0c585fd81a1', 'photo-1596644462291-0e6f4b782630'],
    floricultura: ['photo-1558603668-6570496b8f18', 'photo-1563204996-8965f0c0ca9a'],
    joalheria: ['photo-1599707367072-cd6ada2bc375', 'photo-1588444837495-c6cfeb53f32d'],
    loja_brinquedos: ['photo-1566576912321-d58ddd7a6088', 'photo-1551172851-a9ad1a41e1d5'],
    loja_informatica: ['photo-1518770660439-4636190af475', 'photo-1531297484001-80022131f5a1'],
    livraria: ['photo-1526243741027-444d633d7365', 'photo-1481627834876-b7833e8f5570'],
    loja_calcados: ['photo-1575537302964-96cd47c06b1b', 'photo-1618354691792-d1d42acfd860'],
    loja_esportes: ['photo-1571902943202-507ec2618e8f', 'photo-1562183241-b937e95585b6'],
    loja_cosmeticos: ['photo-1556760544-74068565f05c', 'photo-1522335789203-aabd1fc54bc9'],
    loja_acessorios: ['photo-1524532787116-e70228437bbe', 'photo-1583394293214-28ded15ee548'],
    loja_artigos_casa: ['photo-1555041469-a586c61ea9bc', 'photo-1556228453-efd6c1ff04f6'],
    loja_produtos_naturais: ['photo-1488459716781-31db52582fe9', 'photo-1542838132-92c53300491e'],
    loja_instrumentos_musicais: ['photo-1564186763535-ebb21ef5277f', 'photo-1511192336575-5a79af67a629'],
    loja_decoracao: ['photo-1594026112284-02bb6f3352fe', 'photo-1531829039722-d3fb3e705a4b'],
    loja_conveniencia: ['photo-1604326531570-2689ea7ae287', 'photo-1601600576337-c1d8a0d1373c'],
    papelaria: ['photo-1576153435223-e3e1e9736633', 'photo-1603008166632-73ce2b67444d'],
    agencia_viagens: ['photo-1581553673739-c4906b5d0de1', 'photo-1497032628192-86f99bcd76bc'],
    oficina_mecanica: ['photo-1586611292717-f828b167408c', 'photo-1580983852224-a877846869b2'],
    funeraria: ['photo-1533007716222-4b465613a984', 'photo-1605123728388-e5d0fc6aa2ea'],
    loja_artesanato: ['photo-1516146544193-b54a65682f16', 'photo-1464998857633-50e59fbf2fe6'],
    loja_bebidas: ['photo-1527604030844-81520bd8c5d3', 'photo-1602711322050-3321e95a5f70'],
    loja_eletronicos: ['photo-1597740985671-2a8a3b80502e', 'photo-1550745165-9bc0b252726f'],
    loja_produtos_limpeza: ['photo-1610557892470-55d9e80c0bce', 'photo-1622446438395-8dbd9c93fe44'],
    loja_artigos_esportivos: ['photo-1522844990619-4951c40f7eda', 'photo-1531185038189-41815d481925'],
    loja_produtos_bebes: ['photo-1585435557343-3b092031a831', 'photo-1552884122-5b5b8eb63c9d'],
    agencia_publicidade: ['photo-1516321497487-e288fb19713f', 'photo-1553877522-43269d4ea984'],
    escritorio_contabilidade: ['photo-1553877522-43269d4ea984', 'photo-1520607162513-77705c0f0d4a'],
    barbearia: ['photo-1559599076-9c61d8e1b77c', 'photo-1621605815971-fbc98d665033'],
    banco: ['photo-1601597111158-2fceff292cdc', 'photo-1541354329998-f4d9a9f9297f'],
    promotora_credito: ['photo-1554224155-6726b3abb2f5', 'photo-1554224154-22dec7ec8818'],
    energia_solar: ['photo-1595437193398-f24279553f4f', 'photo-1509391366360-2e959784a276'],
    engenharia: ['photo-1581092160562-40aa08e78837', 'photo-1504917595217-d4dc5ebe6122'],
    consultoria: ['photo-1573496130407-57329f01f769', 'photo-1573496358961-3c82861ab8f4'],
    otica: ['photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371'],
    clinica_medica: ['photo-1631217873886-367980450ba6', 'photo-1519494026892-80bbd2d6fd0d'],
    hortifruti: ['photo-1573246123716-6b1782bfc499', 'photo-1579113800032-c38bd7635818'],
    provedor_internet: ['photo-1544197150-b99a580bb7a8', 'photo-1586772802720-12c04d4b05a2'],
    residencial: ['photo-1560448204-e02f11c3d0e2', 'photo-1512917774080-9991f1c4c750'],
    outro: ['photo-1606836576983-8b458e75221d', 'photo-1531150895110-22ba158742ad'],
  };

  // Get images for the specific category (or use default images if category not found)
  const images = categoryImages[category] || categoryImages.outro;
  
  // Select an image using the imageIndex (ensure it's within bounds)
  const imageUrl = `https://images.unsplash.com/${images[imageIndex % images.length]}?auto=format&fit=crop&w=800&q=80`;
  
  return {
    id,
    name,
    address: `Rua ${name.split(' ')[0]} ${Math.floor(Math.random() * 1000)}`,
    neighborhood,
    city,
    state,
    category,
    status,
    screens: {
      total: totalScreens,
      available: availableScreens,
      types: screenTypes
    },
    imageUrl,
    lastConnection: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
    isFavorite,
    coordinates: {
      latitude,
      longitude
    },
    cep: `0${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
  };
};

// Add a terminal with the specific CEP that was failing in the UI
const createDetailedTerminalWithExampleCEP = (): Terminal => {
  return {
    id: '15x',
    name: 'Terminal de Exemplo CEP',
    address: 'Rua Clóvis Bueno Galvão, 215',
    neighborhood: 'Ipiranga',
    city: 'São Paulo',
    state: 'SP',
    category: 'farmacia',
    status: 'online',
    screens: {
      total: 2,
      available: 0,
      types: [{ type: 'tv_vertical', count: 2 }]
    },
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80', // pharmacy interior
    lastConnection: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    isFavorite: true,
    coordinates: {
      latitude: -23.5894,
      longitude: -46.6038
    },
    cep: '04415080', // CEP without hyphen
    
    // Additional details
    addressDetails: {
      street: 'Rua Clóvis Bueno Galvão',
      number: '215',
      complement: '',
      zipCode: '04415080',
    },
    phones: {
      primary: '(11) 9 8765-4321',
      secondary: '(11) 3333-2222',
    },
    operatingHours: {
      start: '08:00',
      end: '22:00',
      workDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'],
    },
    demographics: {
      averageFootTraffic: 800,
      socialClass: ['A', 'B', 'C'],
    },
    media: {
      images: [
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580129518137-fc3142a31d8c?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
    },
  };
};

// Create a detailed terminal for Farmácia São João
const createDetailedFarmaciaTerminal = (): Terminal => {
  return {
    id: '1',
    name: 'Farmácia São João',
    address: 'Rua Farmácia 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    category: 'farmacia',
    status: 'online',
    screens: {
      total: 2,
      available: 0,
      types: [{ type: 'tv_vertical', count: 1 }, { type: 'tv_horizontal', count: 1 }]
    },
    imageUrl: 'https://images.unsplash.com/photo-1617080353033-e584be05e127?auto=format&fit=crop&w=800&q=80', // pharmacy interior
    lastConnection: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    isFavorite: true,
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    cep: '01310-000',
    
    // Additional details
    addressDetails: {
      street: 'Rua Farmácia',
      number: '123',
      complement: 'Loja 01',
      zipCode: '01310-000',
    },
    phones: {
      primary: '(11) 9 8765-4321',
      secondary: '(11) 3333-2222',
    },
    operatingHours: {
      start: '08:00',
      end: '22:00',
      workDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'],
    },
    demographics: {
      averageFootTraffic: 800,
      socialClass: ['A', 'B', 'C'],
    },
    media: {
      images: [
        'https://images.unsplash.com/photo-1617080353033-e584be05e127?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
    },
    // Add screens data for this terminal
    screenConfigs: farmaciaScreens,
  };
};

export const mockTerminals: Terminal[] = [
  {
    ...createDetailedFarmaciaTerminal(),
    screenConfigs: farmaciaScreens
  },
  {
    ...createTerminal('2', 'Drogaria Mais', 'Tatuapé', 'São Paulo', 'SP', 'farmacia', 'online', 3, 1, [{ type: 'tv_vertical', count: 2 }, { type: 'tv_horizontal', count: 1 }], 1),
    screenConfigs: drogariaScreens
  },
  createTerminal('3', 'Lotérica da Sorte', 'Tatuapé', 'São Paulo', 'SP', 'loterica', 'offline', 1, 0, [{ type: 'tv_vertical', count: 1 }], 0),
  createTerminal('4', 'Padaria Trigo de Ouro', 'Tatuapé', 'São Paulo', 'SP', 'padaria', 'online', 2, 1, [{ type: 'tv_horizontal', count: 2 }], 0, true),
  createTerminal('5', 'Fashion Style', 'Tatuapé', 'São Paulo', 'SP', 'loja_roupas', 'online', 4, 2, [{ type: 'tv_vertical', count: 2 }, { type: 'led', count: 2 }], 0),
  createTerminal('6', 'Pet House', 'Tatuapé', 'São Paulo', 'SP', 'loja_pet', 'maintenance', 1, 0, [{ type: 'tv_horizontal', count: 1 }], 0),
  createTerminal('7', 'Shopping Vila Nova', 'Tatuapé', 'São Paulo', 'SP', 'shopping', 'online', 10, 3, [{ type: 'led', count: 5 }, { type: 'tv_vertical', count: 3 }, { type: 'tv_horizontal', count: 2 }], 0),
  createTerminal('8', 'SuperMercado Econômico', 'Tatuapé', 'São Paulo', 'SP', 'supermercado', 'online', 5, 1, [{ type: 'tv_vertical', count: 3 }, { type: 'tv_horizontal', count: 2 }], 0),
  createTerminal('9', 'Hospital São Lucas', 'Tatuapé', 'São Paulo', 'SP', 'hospital', 'online', 8, 2, [{ type: 'tv_vertical', count: 4 }, { type: 'tv_horizontal', count: 4 }], 0),
  createTerminal('10', 'Posto Ipiranga', 'Tatuapé', 'São Paulo', 'SP', 'posto_gasolina', 'offline', 3, 1, [{ type: 'led', count: 3 }], 0),
  createTerminal('11', 'Academia Fitness', 'Tatuapé', 'São Paulo', 'SP', 'academia', 'online', 4, 0, [{ type: 'tv_vertical', count: 2 }, { type: 'tv_horizontal', count: 2 }], 0),
  createTerminal('12', 'Farmácia Popular', 'Tatuapé', 'São Paulo', 'SP', 'farmacia', 'online', 1, 0, [{ type: 'tv_vertical', count: 1 }], 2),
  createTerminal('13', 'Lotérica Pé Quente', 'Tatuapé', 'São Paulo', 'SP', 'loterica', 'maintenance', 2, 1, [{ type: 'tv_horizontal', count: 2 }], 1, true),
  createTerminal('14', 'Padaria Sabor do Trigo', 'Tatuapé', 'São Paulo', 'SP', 'padaria', 'online', 1, 0, [{ type: 'tv_vertical', count: 1 }], 1),
  createDetailedTerminalWithExampleCEP(), // Add the example terminal with the specific CEP
  createTerminal('16', 'Pet Shop Animal', 'Tatuapé', 'São Paulo', 'SP', 'loja_pet', 'offline', 1, 0, [{ type: 'tv_horizontal', count: 1 }], 1),
  createTerminal('17', 'Shopping Center Norte', 'Tatuapé', 'São Paulo', 'SP', 'shopping', 'online', 12, 4, [{ type: 'led', count: 6 }, { type: 'tv_vertical', count: 4 }, { type: 'tv_horizontal', count: 2 }], 1, true),
  createTerminal('18', 'Supermercado Extra', 'Tatuapé', 'São Paulo', 'SP', 'supermercado', 'online', 6, 2, [{ type: 'tv_vertical', count: 4 }, { type: 'tv_horizontal', count: 2 }], 1),
  createTerminal('19', 'Petz', 'Tatuapé', 'São Paulo', 'SP', 'loja_pet', 'online', 2, 0, [{ type: 'tv_vertical', count: 1 }, { type: 'tv_horizontal', count: 1 }], 2),
  createTerminal('20', 'Casas Bahia', 'Tatuapé', 'São Paulo', 'SP', 'loja_roupas', 'online', 5, 1, [{ type: 'tv_vertical', count: 3 }, { type: 'led', count: 2 }], 1)
];

