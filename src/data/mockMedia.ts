
import { Media } from "@/types/media";
import { v4 as uuidv4 } from "uuid";

export const mockMedia: Media[] = [
  {
    id: uuidv4(),
    name: "Promoção de Verão",
    type: "video",
    category: "farmacia",
    orientation: "horizontal",
    fileUrl: "https://example.com/videos/promocao-verao.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400",
    createdAt: "2023-11-10T14:30:00.000Z",
    updatedAt: "2023-11-10T14:30:00.000Z",
    status: "active",
    duration: 45,
    terminals: ["terminal-1", "terminal-2", "terminal-3"],
    collectStats: true,
    views: 2345,
    description: "Vídeo promocional destacando produtos com desconto para o verão"
  },
  {
    id: uuidv4(),
    name: "Ofertas da Semana",
    type: "image",
    category: "supermercado",
    orientation: "vertical",
    fileUrl: "https://example.com/images/ofertas-semana.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1601598851547-4302969d0614?q=80&w=400",
    createdAt: "2023-11-12T10:15:00.000Z",
    updatedAt: "2023-11-12T10:15:00.000Z",
    status: "active",
    terminals: ["terminal-4", "terminal-5"],
    collectStats: true,
    views: 1892
  },
  {
    id: uuidv4(),
    name: "Tutorial Maquiagem",
    type: "youtube",
    category: "loja_cosmeticos",
    orientation: "both",
    fileUrl: "https://www.youtube.com/watch?v=sample",
    thumbnailUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400",
    createdAt: "2023-11-05T09:45:00.000Z",
    updatedAt: "2023-11-05T09:45:00.000Z",
    status: "active",
    duration: 360,
    terminals: ["terminal-6", "terminal-7", "terminal-8", "terminal-9"],
    collectStats: true,
    views: 5421,
    youtubeId: "sample-id"
  },
  {
    id: uuidv4(),
    name: "Catálogo Primavera",
    type: "pdf",
    category: "loja_roupas",
    orientation: "both",
    fileUrl: "https://example.com/documents/catalogo-primavera.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=400",
    createdAt: "2023-10-28T11:20:00.000Z",
    updatedAt: "2023-10-28T11:20:00.000Z",
    status: "active",
    terminals: ["terminal-10", "terminal-11"],
    collectStats: false
  },
  {
    id: uuidv4(),
    name: "Jingle da Loja",
    type: "audio",
    category: "loja_instrumentos_musicais",
    orientation: "both",
    fileUrl: "https://example.com/audio/jingle-loja.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400",
    createdAt: "2023-11-08T16:10:00.000Z",
    updatedAt: "2023-11-08T16:10:00.000Z",
    status: "active",
    duration: 28,
    terminals: ["terminal-12"],
    collectStats: true,
    views: 843
  },
  {
    id: uuidv4(),
    name: "Ofertas Black Friday",
    type: "video",
    category: "loja_eletronicos",
    orientation: "horizontal",
    fileUrl: "https://example.com/videos/blackfriday.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=400",
    createdAt: "2023-11-15T13:25:00.000Z",
    updatedAt: "2023-11-15T13:25:00.000Z",
    status: "scheduled",
    duration: 60,
    terminals: ["terminal-13", "terminal-14", "terminal-15", "terminal-16"],
    collectStats: true,
    views: 0,
    scheduleStart: "2023-11-20T00:00:00.000Z",
    scheduleEnd: "2023-11-27T23:59:59.000Z"
  },
  {
    id: uuidv4(),
    name: "Dicas de Treinamento",
    type: "youtube",
    category: "academia",
    orientation: "vertical",
    fileUrl: "https://www.youtube.com/watch?v=training-sample",
    thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400",
    createdAt: "2023-11-02T08:40:00.000Z",
    updatedAt: "2023-11-02T08:40:00.000Z",
    status: "active",
    duration: 420,
    terminals: ["terminal-17", "terminal-18"],
    collectStats: true,
    views: 3127,
    youtubeId: "training-sample-id"
  },
  {
    id: uuidv4(),
    name: "Receitas Saudáveis",
    type: "pdf",
    category: "hortifruti",
    orientation: "both",
    fileUrl: "https://example.com/documents/receitas-saudaveis.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=400",
    createdAt: "2023-10-25T15:50:00.000Z",
    updatedAt: "2023-10-25T15:50:00.000Z",
    status: "active",
    terminals: ["terminal-19", "terminal-20", "terminal-21"],
    collectStats: false
  },
  {
    id: uuidv4(),
    name: "Tour Virtual",
    type: "video",
    category: "hotel",
    orientation: "both",
    fileUrl: "https://example.com/videos/tour-virtual.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=400",
    createdAt: "2023-11-18T12:35:00.000Z",
    updatedAt: "2023-11-18T12:35:00.000Z",
    status: "active",
    duration: 180,
    terminals: ["terminal-22", "terminal-23"],
    collectStats: true,
    views: 1576
  },
  {
    id: uuidv4(),
    name: "Promoção Fim de Ano",
    type: "image",
    category: "shopping",
    orientation: "horizontal",
    fileUrl: "https://example.com/images/promocao-fim-ano.jpg",
    thumbnailUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=400",
    createdAt: "2023-11-20T09:30:00.000Z",
    updatedAt: "2023-11-20T09:30:00.000Z",
    status: "inactive",
    terminals: ["terminal-24", "terminal-25", "terminal-26"],
    collectStats: true,
    views: 2983
  }
];
