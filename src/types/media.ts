
import { TerminalCategory } from './terminal';

export type MediaType = 'video' | 'audio' | 'youtube' | 'pdf' | 'image';
export type MediaOrientation = 'horizontal' | 'vertical' | 'both';
export type MediaStatus = 'active' | 'inactive' | 'scheduled';

export interface Media {
  id: string;
  name: string;
  type: MediaType;
  category: TerminalCategory;
  orientation: MediaOrientation;
  fileUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  status: MediaStatus;
  duration?: number; // in seconds, for video and audio
  terminals: string[]; // Array of terminal IDs where this media is displayed
  collectStats: boolean;
  views?: number;
  author?: string;
  description?: string;
  // For YouTube videos
  youtubeId?: string;
  // For scheduled media
  scheduleStart?: string;
  scheduleEnd?: string;
}

export const getMediaTypeLabel = (type: MediaType): string => {
  const typeLabels: Record<MediaType, string> = {
    video: 'Vídeo',
    audio: 'Áudio',
    youtube: 'YouTube',
    pdf: 'PDF',
    image: 'Imagem'
  };
  
  return typeLabels[type];
};

export const getMediaTypeBadgeColor = (type: MediaType): string => {
  const typeColors: Record<MediaType, string> = {
    video: 'bg-blue-500',
    audio: 'bg-purple-500',
    youtube: 'bg-red-500',
    pdf: 'bg-orange-500',
    image: 'bg-green-500'
  };
  
  return typeColors[type];
};

export const getMediaStatusLabel = (status: MediaStatus): string => {
  const statusLabels: Record<MediaStatus, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    scheduled: 'Agendado'
  };
  
  return statusLabels[status];
};

export const getMediaOrientationLabel = (orientation: MediaOrientation): string => {
  const orientationLabels: Record<MediaOrientation, string> = {
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    both: 'Ambos'
  };
  
  return orientationLabels[orientation];
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '—';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
