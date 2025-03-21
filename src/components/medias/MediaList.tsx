
import React from 'react';
import { Media } from '@/types/media';
import MediaCard from './MediaCard';
import MediaListItem from './MediaListItem';

interface MediaListProps {
  medias: Media[];
  viewMode: 'grid' | 'list';
}

const MediaList: React.FC<MediaListProps> = ({ medias, viewMode }) => {
  if (medias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-muted-foreground mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.53 20.47a.75.75 0 0 1-1.06 0l-9-9a.75.75 0 0 1 0-1.06l9-9a.75.75 0 0 1 1.06 1.06l-8.47 8.47 8.47 8.47a.75.75 0 0 1 0 1.06z"/>
            <path d="M3.53 11.47a.75.75 0 0 1 0-1.06l9-9a.75.75 0 0 1 1.06 1.06l-8.47 8.47 8.47 8.47a.75.75 0 1 1-1.06 1.06l-9-9z"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium">Nenhuma mídia encontrada</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Nenhuma mídia corresponde aos filtros selecionados. Tente ajustar seus filtros ou adicionar uma nova mídia.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {medias.map((media) => (
          <MediaListItem key={media.id} media={media} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {medias.map((media) => (
        <MediaCard key={media.id} media={media} />
      ))}
    </div>
  );
};

export default MediaList;
