import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Star, Trash, Clock, Volume2, VolumeX, Globe, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MainNav from '@/components/navigation/MainNav';
import { mockTerminals } from '@/data/mockTerminals';
import { ScreenConfig, getScreenTypeLabel } from '@/types/screen';
import { Terminal } from '@/types/terminal';
import ScreenPlaylist from '../components/screens/playlist/ScreenPlaylist';
import ScreenStatistics from '@/components/screens/statistics/ScreenStatistics';

const Screen = () => {
  const { terminalId, screenId } = useParams<{ terminalId: string; screenId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [screen, setScreen] = useState<ScreenConfig | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find terminal
        const foundTerminal = mockTerminals.find(t => t.id === terminalId);
        
        if (!foundTerminal) {
          toast({
            title: 'Terminal não encontrado',
            description: 'O terminal solicitado não existe ou foi removido.',
            variant: 'destructive',
          });
          navigate('/terminais');
          return;
        }
        
        setTerminal(foundTerminal);
        
        // Find screen in terminal
        const foundScreen = foundTerminal.screenConfigs?.find(s => s.id === screenId);
        
        if (!foundScreen) {
          toast({
            title: 'Tela não encontrada',
            description: 'A tela solicitada não existe ou foi removida.',
            variant: 'destructive',
          });
          navigate(`/terminais/${terminalId}`);
          return;
        }
        
        setScreen(foundScreen);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Ocorreu um erro ao carregar os dados da tela.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [terminalId, screenId, navigate, toast]);

  const handleEdit = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A edição de telas será implementada em breve.',
    });
  };
  
  const handleDelete = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A exclusão de telas será implementada em breve.',
    });
  };
  
  const handleToggleFavorite = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'Adicionar aos favoritos será implementado em breve.',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <MainNav />
        <div className="flex-1 ml-0 md:ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!terminal || !screen) {
    return (
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <MainNav />
        <div className="flex-1 ml-0 md:ml-64">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-2">Tela não encontrada</h1>
            <p className="text-muted-foreground">A tela solicitada não existe ou foi removida.</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate(`/terminais/${terminalId}`)}
            >
              Voltar para o terminal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container max-w-[1400px] mx-auto p-4 sm:p-6">
          {/* Header with breadcrumb */}
          <div className="flex items-center mb-6 gap-2">
            <Button variant="ghost" onClick={() => navigate(`/terminais/${terminal.id}`)} className="p-0 h-auto">
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button>
            <div className="text-sm text-muted-foreground">
              <span>Terminais</span>
              <span className="mx-2">/</span>
              <span className="cursor-pointer hover:underline" onClick={() => navigate(`/terminais/${terminal.id}`)}>
                {terminal.name}
              </span>
              <span className="mx-2">/</span>
              <span className="font-medium text-foreground">{screen.name}</span>
            </div>
          </div>
          
          {/* Screen Header */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{screen.name}</h1>
                <Badge variant={screen.status === 'active' ? 'success' : 'destructive'}>
                  {screen.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{getScreenTypeLabel(screen.type)}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {screen.updateCycle} min
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
                <Star className="h-4 w-4 mr-1" />
                Favoritar
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
          </div>
          
          {/* Screen Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Left column - Details */}
            <div className="lg:col-span-1">
              <Card className="w-full">
                <CardContent className="p-4 md:p-6 w-full">
                  <h3 className="text-lg font-semibold mb-4">Detalhes da Tela</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo</span>
                      <span className="font-medium">{getScreenTypeLabel(screen.type)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ciclo de atualização</span>
                      <span className="font-medium">
                        {screen.updateCycle} minutos
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Áudio</span>
                      <span className="font-medium flex items-center gap-1">
                        {screen.audioEnabled ? (
                          <>
                            <Volume2 className="h-4 w-4" />
                            Ativado
                          </>
                        ) : (
                          <>
                            <VolumeX className="h-4 w-4" />
                            Desativado
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fuso horário</span>
                      <span className="font-medium flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {screen.timezone.split('/')[1].replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rodapé</span>
                      <span className="font-medium flex items-center gap-1">
                        <Footprints className="h-4 w-4" />
                        {screen.footerEnabled ? 'Ativado' : 'Desativado'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Statistics Card */}
              <div className="mt-4">
                <ScreenStatistics screenId={screen.id} />
              </div>
            </div>
            
            {/* Right column - Playlist */}
            <div className="lg:col-span-2 w-full">
              <Card className="w-full max-w-none">
                <CardContent className="p-4 md:p-6 w-full">
                  <Tabs defaultValue="playlist">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="playlist" className="flex-1">Lista de Reprodução</TabsTrigger>
                      <TabsTrigger value="notes" className="flex-1">Anotações</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="playlist">
                      <ScreenPlaylist screenId={screen.id} />
                    </TabsContent>
                    
                    <TabsContent value="notes">
                      <div className="border rounded-md p-4 min-h-[400px]">
                        <textarea 
                          className="w-full h-full min-h-[300px] bg-transparent resize-none focus:outline-none" 
                          placeholder="Adicione anotações sobre esta tela..."
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen;
