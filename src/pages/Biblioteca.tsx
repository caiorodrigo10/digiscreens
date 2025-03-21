
import React from 'react';
import PlaceholderPage from '@/components/shared/PlaceholderPage';
import { BookOpen } from 'lucide-react';

const Biblioteca = () => {
  return (
    <PlaceholderPage
      title="Biblioteca"
      description="Acesse e organize todo o conteúdo disponível para exibição"
      icon={<BookOpen size={32} />}
    />
  );
};

export default Biblioteca;
