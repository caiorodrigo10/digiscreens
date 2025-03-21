
import { Media } from './media';

export interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  mediaIds: string[];
  createdAt: string;
  updatedAt: string;
  viewCount?: number; // Optional field for tracking views
}

export interface GroupWithMedia extends Omit<Group, 'mediaIds'> {
  medias: Media[];
}
