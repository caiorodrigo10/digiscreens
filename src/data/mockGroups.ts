
import { Group } from '@/types/group';

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Promoções de Verão',
    description: 'Conjunto de mídia para as promoções da estação',
    coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80',
    mediaIds: ['media-1', 'media-3', 'media-5'],
    createdAt: '2023-11-10T10:30:00Z',
    updatedAt: '2023-11-15T14:45:00Z',
    viewCount: 1250
  },
  {
    id: 'group-2',
    name: 'Produtos Premium',
    description: 'Destaques da nossa linha premium',
    mediaIds: ['media-2', 'media-4'],
    createdAt: '2023-10-05T09:15:00Z',
    updatedAt: '2023-10-20T11:30:00Z',
    viewCount: 890
  },
  {
    id: 'group-3',
    name: 'Novidades da Semana',
    description: 'Lançamentos e produtos recém-chegados',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    mediaIds: ['media-6', 'media-7', 'media-8'],
    createdAt: '2023-11-01T16:20:00Z',
    updatedAt: '2023-11-07T10:15:00Z',
    viewCount: 1520
  }
];

export const getGroupWithMedias = (group: Group, allMedias: any[]) => {
  const groupMedias = allMedias.filter(media => group.mediaIds.includes(media.id));
  return {
    ...group,
    medias: groupMedias
  };
};
