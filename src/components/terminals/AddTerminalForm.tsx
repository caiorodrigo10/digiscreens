
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { terminalFormSchema, TerminalFormValues } from '@/schemas/terminal-schema';
import { TerminalCategory, SocialClass, WeekDay, getCategoryLabel } from '@/types/terminal';
import { v4 as uuidv4 } from 'uuid';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  ImageIcon, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Mock function to simulate file upload (to be replaced with actual implementation)
const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate upload delay
    setTimeout(() => {
      // Create a object URL for the file (for demo purposes)
      const url = URL.createObjectURL(file);
      resolve(url);
    }, 500);
  });
};

const weekDays: WeekDay[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
const socialClasses: SocialClass[] = ['A', 'B', 'C', 'D'];

// Define all possible categories
const categories: TerminalCategory[] = [
  'farmacia', 'loterica', 'padaria', 'loja_roupas', 'loja_pet', 'shopping', 
  'supermercado', 'hospital', 'posto_gasolina', 'academia', 'loja_moveis',
  'loja_material_construcao', 'concessionaria', 'hotel', 'escola', 
  'consultorio_odontologico', 'lavanderia', 'floricultura', 'joalheria', 
  'loja_brinquedos', 'loja_informatica', 'livraria', 'loja_calcados', 
  'loja_esportes', 'loja_cosmeticos', 'loja_acessorios', 'loja_artigos_casa', 
  'loja_produtos_naturais', 'loja_instrumentos_musicais', 'loja_decoracao', 
  'loja_conveniencia', 'papelaria', 'agencia_viagens', 'oficina_mecanica', 
  'funeraria', 'loja_artesanato', 'loja_bebidas', 'loja_eletronicos', 
  'loja_produtos_limpeza', 'loja_artigos_esportivos', 'loja_produtos_bebes', 
  'agencia_publicidade', 'escritorio_contabilidade', 'barbearia', 'banco', 
  'promotora_credito', 'energia_solar', 'engenharia', 'consultoria', 'otica', 
  'clinica_medica', 'hortifruti', 'provedor_internet', 'residencial', 'outro'
];

const AddTerminalForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TerminalFormValues>({
    resolver: zodResolver(terminalFormSchema),
    defaultValues: {
      name: '',
      category: 'outro',
      address: {
        street: '',
        number: '',
        complement: '',
        zipCode: '',
        neighborhood: '',
        state: 'SP',
        city: 'São Paulo',
      },
      phones: {
        primary: '',
        secondary: '',
      },
      operatingHours: {
        start: '09:00',
        end: '17:00',
        workDays: [],
      },
      demographics: {
        averageFootTraffic: 1000,
        socialClass: [],
      },
      media: {
        images: [],
        videos: [],
      },
    },
  });
  
  const steps = [
    { id: 'basic', name: 'Informações Básicas', icon: <Building2 className="h-5 w-5" /> },
    { id: 'address', name: 'Endereço', icon: <MapPin className="h-5 w-5" /> },
    { id: 'contact', name: 'Contato e Funcionamento', icon: <Phone className="h-5 w-5" /> },
    { id: 'demographics', name: 'Demografia', icon: <Users className="h-5 w-5" /> },
    { id: 'media', name: 'Fotos e Vídeos', icon: <ImageIcon className="h-5 w-5" /> },
  ];
  
  const nextStep = async () => {
    // Basic validation for the current step before proceeding
    if (currentStep === 0) {
      const isValid = await form.trigger(['name', 'category']);
      if (!isValid) return;
    } else if (currentStep === 1) {
      const isValid = await form.trigger(['address.street', 'address.number', 'address.zipCode', 'address.neighborhood', 'address.state', 'address.city']);
      if (!isValid) return;
    } else if (currentStep === 2) {
      const isValid = await form.trigger(['phones.primary', 'operatingHours.start', 'operatingHours.end', 'operatingHours.workDays']);
      if (!isValid) return;
    } else if (currentStep === 3) {
      const isValid = await form.trigger(['demographics.averageFootTraffic', 'demographics.socialClass']);
      if (!isValid) return;
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...files]);
      
      const uploadPromises = files.map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      form.setValue('media.images', [
        ...form.getValues('media.images'),
        ...uploadedUrls
      ]);
    }
  };
  
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedVideos((prevVideos) => [...prevVideos, ...files]);
      
      const uploadPromises = files.map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      form.setValue('media.videos', [
        ...(form.getValues('media.videos') || []),
        ...uploadedUrls
      ]);
    }
  };
  
  const onSubmit = async (values: TerminalFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Normally you would send this data to an API
      console.log('Form submitted with values:', values);
      
      // For now, we'll just simulate success and navigate to a mock detail page
      const newTerminalId = uuidv4();
      
      toast({
        title: 'Terminal adicionado com sucesso!',
        description: `${values.name} foi adicionado ao sistema.`,
      });
      
      // Navigate to the terminal details page
      navigate(`/terminais/${newTerminalId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro ao adicionar terminal',
        description: 'Ocorreu um erro ao adicionar o terminal. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6 gap-2">
        <Button variant="ghost" onClick={() => navigate('/terminais')} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-1" />
        </Button>
        <h1 className="text-2xl font-bold">Adicionar Novo Terminal</h1>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                  index < currentStep ? 'bg-primary text-white' : 
                  index === currentStep ? 'border-2 border-primary' : 
                  'border border-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <div className="text-sm font-medium">✓</div>
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-xs hidden sm:block">{step.name}</span>
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-muted rounded-full mt-2 mb-6">
          <div 
            className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-6">
            <CardContent className="pt-6">
              {/* Step 1: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Informações Básicas</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Terminal</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Farmácia São João" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {getCategoryLabel(category)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Step 2: Address */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Endereço</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rua</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Av. Paulista" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address.number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 1000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address.complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Sala 101 (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 01310-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address.neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Bela Vista" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: São Paulo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Contact & Operating Hours */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Contato e Funcionamento</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phones.primary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone #1</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: (11) 9 9999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phones.secondary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone #2 (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: (11) 9 9999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Período de Funcionamento</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="operatingHours.start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Abertura</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="operatingHours.end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Fechamento</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="operatingHours.workDays"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Dias da Semana</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {weekDays.map((day) => (
                            <FormField
                              key={day}
                              control={form.control}
                              name="operatingHours.workDays"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={day}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, day])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== day
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {day === 'domingo' ? 'Domingo' : 
                                       day === 'segunda' ? 'Segunda' : 
                                       day === 'terca' ? 'Terça' : 
                                       day === 'quarta' ? 'Quarta' : 
                                       day === 'quinta' ? 'Quinta' : 
                                       day === 'sexta' ? 'Sexta' : 'Sábado'}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Step 4: Demographics */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Demografia</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="demographics.averageFootTraffic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fluxo Médio de Pessoas (diário)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="demographics.socialClass"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Classe Social</FormLabel>
                        </div>
                        <div className="flex flex-row flex-wrap gap-3">
                          {socialClasses.map((socialClass) => (
                            <FormField
                              key={socialClass}
                              control={form.control}
                              name="demographics.socialClass"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={socialClass}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(socialClass)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, socialClass])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== socialClass
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      Classe {socialClass}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Step 5: Media Upload */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Fotos e Vídeos</h2>
                  </div>
                  
                  <FormItem>
                    <FormLabel>Fotos do Estabelecimento</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <FormItem>
                    <FormLabel>Vídeos do Estabelecimento (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="video/*" 
                        multiple 
                        onChange={handleVideoChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  
                  {selectedVideos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                      {selectedVideos.map((video, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-md overflow-hidden">
                          <video
                            src={URL.createObjectURL(video)}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Voltar
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adicionando...' : 'Adicionar Terminal'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddTerminalForm;
