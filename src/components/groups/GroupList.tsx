
import React from 'react';
import { Group } from '@/types/group';
import GroupCard from './GroupCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupListProps {
  groups: Group[];
  onAddGroup: () => void;
  onEditGroup: (group: Group) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onAddGroup, onEditGroup }) => {
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-muted-foreground mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M9.9 8.9h.1" />
            <path d="M14.9 8.9h.1" />
            <path d="M8 13h8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Nenhum grupo encontrado</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Você ainda não criou nenhum grupo. Grupos permitem organizar suas mídias para exibição intercalada.
        </p>
        <Button className="mt-4 gap-2" onClick={onAddGroup}>
          <Plus className="h-4 w-4" />
          Criar Grupo
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onClick={() => onEditGroup(group)} />
      ))}
    </div>
  );
};

export default GroupList;
