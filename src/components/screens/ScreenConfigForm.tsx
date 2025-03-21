
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Volume2, VolumeX, Clock, Globe, FootprintsIcon } from "lucide-react";
import { z } from "zod";
import { ScreenType, screenConfigSchema, getScreenTypeLabel } from '@/types/screen';

// Timezones for Brazil
const BRAZIL_TIMEZONES = [
  { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
  { value: "America/Manaus", label: "Manaus (GMT-4)" },
  { value: "America/Belem", label: "Belém (GMT-3)" },
  { value: "America/Bahia", label: "Bahia (GMT-3)" },
  { value: "America/Fortaleza", label: "Fortaleza (GMT-3)" },
  { value: "America/Recife", label: "Recife (GMT-3)" },
  { value: "America/Rio_Branco", label: "Rio Branco (GMT-5)" },
];

type FormValues = z.infer<typeof screenConfigSchema>;

interface ScreenConfigFormProps {
  type: ScreenType;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

const ScreenConfigForm: React.FC<ScreenConfigFormProps> = ({ type, onSubmit, onCancel }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(screenConfigSchema),
    defaultValues: {
      type,
      name: "",
      updateCycle: 10,
      audioEnabled: false,
      timezone: "America/Sao_Paulo",
      footerEnabled: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <h3 className="text-lg font-medium">
              Configuração - {getScreenTypeLabel(type)}
            </h3>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Tela</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Tela Entrada Principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="updateCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Ciclo de Atualização (minutos)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="audioEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2">
                    {field.value ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    Som do Terminal
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value
                      ? "Conteúdos com áudio serão reproduzidos"
                      : "Conteúdos com áudio serão silenciados"}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Fuso Horário
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BRAZIL_TIMEZONES.map((timezone) => (
                      <SelectItem
                        key={timezone.value}
                        value={timezone.value}
                      >
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="footerEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2">
                    <FootprintsIcon className="h-4 w-4" />
                    Barra de Rodapé
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value
                      ? "Rodapé com informações será exibido"
                      : "Rodapé com informações será ocultado"}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Configuração</Button>
        </div>
      </form>
    </Form>
  );
};

export default ScreenConfigForm;
