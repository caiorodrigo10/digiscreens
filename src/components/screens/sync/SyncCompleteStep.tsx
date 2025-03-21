
import React from 'react';
import { Check } from "lucide-react";

export const SyncCompleteStep: React.FC = () => {
  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
          <Check className="h-12 w-12 text-green-600 dark:text-green-500" />
        </div>
        <h3 className="text-xl font-medium">Sincronização concluída!</h3>
        <p className="text-sm text-muted-foreground">
          A tela foi sincronizada com sucesso e está pronta para uso.
        </p>
      </div>
    </div>
  );
};
