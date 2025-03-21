
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Terminal, getCategoryLabel, getWeekDayLabel, getSocialClassLabel } from '@/types/terminal';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Edit, 
  Star, 
  Trash, 
  CircleDot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ScreensManagement from '@/components/screens/ScreensManagement';

interface TerminalDetailsProps {
  terminal: Terminal;
}

const TerminalDetails: React.FC<TerminalDetailsProps> = ({ terminal }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleEdit = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A edição de terminais será implementada em breve.',
    });
  };
  
  const handleDelete = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A exclusão de terminais será implementada em breve.',
    });
  };
  
  const handleToggleFavorite = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'Adicionar aos favoritos será implementado em breve.',
    });
  };
  
  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center mb-6 gap-2">
        <Button variant="ghost" onClick={() => navigate('/terminais')} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-1" />
        </Button>
        <div className="text-sm text-muted-foreground">
          <span>Terminais</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground">{terminal.name}</span>
        </div>
      </div>
      
      {/* Terminal Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{terminal.name}</h1>
            <Badge variant={terminal.status === 'online' ? 'success' : terminal.status === 'maintenance' ? 'warning' : 'destructive'}>
              {terminal.status === 'online' ? 'Online' : terminal.status === 'maintenance' ? 'Em manutenção' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{getCategoryLabel(terminal.category)}</Badge>
            {terminal.operatingHours && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {terminal.operatingHours.start} - {terminal.operatingHours.end}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
            <Star className={`h-4 w-4 mr-1 ${terminal.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {terminal.isFavorite ? 'Favorito' : 'Favoritar'}
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
      
      {/* Terminal Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left column - Images */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-md">
              {terminal.media && terminal.media.images && terminal.media.images.length > 0 ? (
                <img 
                  src={terminal.media.images[0]} 
                  alt={terminal.name} 
                  className="w-full h-auto aspect-video object-cover"
                />
              ) : terminal.imageUrl ? (
                <img 
                  src={terminal.imageUrl} 
                  alt={terminal.name} 
                  className="w-full h-auto aspect-video object-cover"
                />
              ) : (
                <div className="w-full h-auto aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Sem imagem</span>
                </div>
              )}
              
              {/* Thumbnails if there are multiple images */}
              {terminal.media && terminal.media.images && terminal.media.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2">
                  {terminal.media.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img 
                        src={image} 
                        alt={`${terminal.name} ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Screen summary */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Telas</h3>
              <p className="text-sm">
                Total: <span className="font-medium">{terminal.screens.total}</span>
              </p>
              <p className="text-sm">
                Disponíveis: <span className="font-medium">{terminal.screens.available}</span>
              </p>
              
              <Separator className="my-3" />
              
              <h4 className="text-sm font-medium mb-2">Tipos de Tela</h4>
              <div className="space-y-2">
                {terminal.screens.types.map((screen, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <CircleDot className="h-3 w-3 text-primary" />
                      {screen.type === 'tv_vertical' ? 'TV Vertical' : 
                       screen.type === 'tv_horizontal' ? 'TV Horizontal' : 'Painel LED'}
                    </span>
                    <span className="font-medium">{screen.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="info">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="info" className="flex-1">Informações</TabsTrigger>
                  <TabsTrigger value="hours" className="flex-1">Funcionamento</TabsTrigger>
                  <TabsTrigger value="demographics" className="flex-1">Demografia</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Endereço</h3>
                    <p className="text-base flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span>
                        {terminal.addressDetails ? (
                          <>
                            {terminal.addressDetails.street}, {terminal.addressDetails.number}
                            {terminal.addressDetails.complement && `, ${terminal.addressDetails.complement}`}
                            <br />
                            {terminal.neighborhood}, {terminal.city} - {terminal.state}
                            <br />
                            CEP: {terminal.addressDetails.zipCode}
                          </>
                        ) : (
                          <>
                            {terminal.address}
                            <br />
                            {terminal.neighborhood}, {terminal.city} - {terminal.state}
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Contato</h3>
                    {terminal.phones ? (
                      <div className="space-y-2">
                        {terminal.phones.primary && (
                          <p className="text-base flex items-center gap-2">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            {terminal.phones.primary}
                          </p>
                        )}
                        {terminal.phones.secondary && (
                          <p className="text-base flex items-center gap-2">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            {terminal.phones.secondary}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhum contato cadastrado</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Última Conexão</h3>
                    <p className="text-base">
                      {terminal.lastConnection ? new Date(terminal.lastConnection).toLocaleString('pt-BR') : 'Não disponível'}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="hours" className="space-y-4">
                  {terminal.operatingHours ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Horário de Funcionamento</h3>
                        <p className="text-base flex items-center gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          {terminal.operatingHours.start} - {terminal.operatingHours.end}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Dias de Funcionamento</h3>
                        <div className="flex flex-wrap gap-2">
                          {terminal.operatingHours.workDays.map((day) => (
                            <Badge key={day} variant="outline">
                              {getWeekDayLabel(day)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">Informações de funcionamento não disponíveis</p>
                  )}
                </TabsContent>
                
                <TabsContent value="demographics" className="space-y-4">
                  {terminal.demographics ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Fluxo Médio de Pessoas</h3>
                        <p className="text-base flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          {terminal.demographics.averageFootTraffic} pessoas/dia
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Classe Social</h3>
                        <div className="flex flex-wrap gap-2">
                          {terminal.demographics.socialClass.map((socialClass) => (
                            <Badge key={socialClass} variant="outline">
                              {getSocialClassLabel(socialClass)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">Informações demográficas não disponíveis</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Screen Management - Full width */}
      <Card>
        <CardContent className="p-6">
          <ScreensManagement 
            terminalId={terminal.id} 
            initialScreens={terminal.screenConfigs || []}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TerminalDetails;
