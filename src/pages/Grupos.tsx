
import React, { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainNav from '@/components/navigation/MainNav';
import { useToast } from '@/hooks/use-toast';
import { Group } from '@/types/group';
import { mockGroups } from '@/data/mockGroups';
import { mockMedia } from '@/data/mockMedia';
import GroupList from '@/components/groups/GroupList';
import GroupFormDialog from '@/components/groups/GroupFormDialog';

const Grupos = () => {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleAddGroup = () => {
    setSelectedGroup(undefined);
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsFormOpen(true);
  };

  const handleSaveGroup = (group: Group) => {
    setGroups(prev => {
      const existingIndex = prev.findIndex(g => g.id === group.id);
      if (existingIndex !== -1) {
        // Update existing group
        const newGroups = [...prev];
        newGroups[existingIndex] = group;
        return newGroups;
      } else {
        // Add new group
        return [...prev, group];
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-app">
      <MainNav />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Layers size={32} className="text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Grupos</h1>
                <p className="text-sm text-muted-foreground">
                  Organize suas mídias em grupos para exibição intercalada
                </p>
              </div>
            </div>
            
            <Button className="gap-2" onClick={handleAddGroup}>
              <Plus className="h-4 w-4" />
              Criar Grupo
            </Button>
          </div>
          
          <GroupList 
            groups={groups} 
            onAddGroup={handleAddGroup} 
            onEditGroup={handleEditGroup} 
          />
          
          <GroupFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSave={handleSaveGroup}
            group={selectedGroup}
            availableMedias={mockMedia}
          />
        </div>
      </div>
    </div>
  );
};

export default Grupos;
