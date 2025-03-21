
import React from 'react';
import PlaceholderPage from '@/components/shared/PlaceholderPage';
import { BadgeDollarSign } from 'lucide-react';

const Anunciantes = () => {
  return (
    <PlaceholderPage
      title="Anunciantes"
      description="Gerencie seus anunciantes e suas campanhas publicitárias"
      icon={<BadgeDollarSign size={32} />}
    />
  );
};

export default Anunciantes;
