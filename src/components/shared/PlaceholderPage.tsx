
import React from 'react';
import MainNav from '@/components/navigation/MainNav';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6">
          <header className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </header>
          
          <div className="bg-white rounded-lg shadow-sm border p-8 flex flex-col items-center justify-center gap-4 animate-fade-up">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              {icon}
            </div>
            <h2 className="text-2xl font-medium">Módulo {title}</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Esta página está em desenvolvimento. Em breve você poderá acessar todas as funcionalidades do módulo {title.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
