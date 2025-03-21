
import React, { useState } from 'react';
import { Media, getMediaTypeLabel } from '@/types/media';
import { Check, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface MediaSelectionListProps {
  availableMedias: Media[];
  selectedMediaIds: string[];
  onToggleMedia: (mediaId: string) => void;
}

const ITEMS_PER_PAGE = 8;

const MediaSelectionList: React.FC<MediaSelectionListProps> = ({
  availableMedias,
  selectedMediaIds,
  onToggleMedia
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter medias based on search term
  const filteredMedias = availableMedias.filter(media => 
    media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (media.description && media.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMedias.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedias = filteredMedias.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (availableMedias.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">
          Nenhuma mídia disponível. Adicione mídias primeiro.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b sticky top-0 bg-background z-10">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mídias..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {paginatedMedias.map((media) => {
            const isSelected = selectedMediaIds.includes(media.id);
            return (
              <div
                key={media.id}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                  isSelected && "bg-primary/10"
                )}
                onClick={() => onToggleMedia(media.id)}
              >
                <div className="flex-shrink-0 h-12 w-20 bg-muted rounded overflow-hidden relative">
                  <img
                    src={media.thumbnailUrl}
                    alt={media.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-tl">
                    {getMediaTypeLabel(media.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{media.name}</h4>
                  {media.description && (
                    <p className="text-xs text-muted-foreground truncate">{media.description}</p>
                  )}
                </div>
                <div className={cn(
                  "flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center",
                  isSelected ? "bg-primary border-primary" : "border-input"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="border-t p-2 bg-background sticky bottom-0">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePrevPage} 
                  className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              
              {/* Display pagination numbers adaptively */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                // Adjust page numbers based on current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                
                // Only render if page number is valid
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage}
                  className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MediaSelectionList;
