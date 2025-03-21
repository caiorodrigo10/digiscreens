
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddTerminalForm from '@/components/terminals/AddTerminalForm';
import TerminalDetails from '@/components/terminals/TerminalDetails';
import { Terminal } from '@/types/terminal';
import { mockTerminals } from '@/data/mockTerminals';
import MainNav from '@/components/navigation/MainNav';
import { v4 as uuidv4 } from 'uuid';

// Create a successful "fake" terminal with all fields for demonstration
const createSuccessfulTerminal = (): Terminal => {
  return {
    id: uuidv4(),
    name: "Farmácia São Paulo",
    address: "Av. Paulista, 1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    category: "farmacia",
    status: "online",
    screens: {
      total: 3,
      available: 1,
      types: [
        { type: "tv_vertical", count: 2 },
        { type: "tv_horizontal", count: 1 }
      ]
    },
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    lastConnection: new Date().toISOString(),
    isFavorite: false,
    addressDetails: {
      street: "Av. Paulista",
      number: "1000",
      complement: "Loja 01",
      zipCode: "01310-000",
    },
    phones: {
      primary: "(11) 9 9999-9999",
      secondary: "(11) 3333-3333",
    },
    operatingHours: {
      start: "08:00",
      end: "22:00",
      workDays: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
    },
    demographics: {
      averageFootTraffic: 1500,
      socialClass: ["A", "B"],
    },
    media: {
      images: [
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
      ],
      videos: [],
    },
  };
};

const TerminalPage = () => {
  const { id } = useParams<{ id: string }>();
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTerminal = async () => {
      setLoading(true);
      
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (id === 'novo') {
          // New terminal form - no need to fetch data
          setTerminal(null);
        } else if (id === 'success') {
          // Demo success terminal with all fields
          setTerminal(createSuccessfulTerminal());
        } else {
          // Fetch from mock data
          const foundTerminal = mockTerminals.find(t => t.id === id);
          setTerminal(foundTerminal || null);
        }
      } catch (error) {
        console.error('Error fetching terminal:', error);
        setTerminal(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTerminal();
  }, [id]);
  
  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : id === 'novo' ? (
          <AddTerminalForm />
        ) : terminal ? (
          <TerminalDetails terminal={terminal} />
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-2">Terminal não encontrado</h1>
            <p className="text-muted-foreground">O terminal solicitado não existe ou foi removido.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPage;
