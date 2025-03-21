
import React from 'react';
import PlaceholderPage from '@/components/shared/PlaceholderPage';
import { BarChart } from 'lucide-react';

const Relatorios = () => {
  return (
    <PlaceholderPage
      title="Relatórios"
      description="Visualize dados e estatísticas sobre a performance dos seus terminais"
      icon={<BarChart size={32} />}
    />
  );
};

export default Relatorios;
