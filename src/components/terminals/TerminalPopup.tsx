
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { Terminal, getCategoryLabel } from '@/types/terminal';
import { Button } from '@/components/ui/button';

interface TerminalPopupProps {
  terminal: Terminal;
  map: mapboxgl.Map | null;
  lngLat: [number, number];
  onClose: () => void;
}

const TerminalPopup: React.FC<TerminalPopupProps> = ({ 
  terminal, 
  map, 
  lngLat, 
  onClose 
}) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    // Create container for React content
    const container = document.createElement('div');
    container.className = 'terminal-popup-container';
    containerRef.current = container;

    // Create React root
    const root = createRoot(container);
    rootRef.current = root;

    // Create and add popup to map
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '240px',
      anchor: 'bottom',
      offset: [0, -5],
      className: 'terminal-mapbox-popup'
    })
      .setLngLat(lngLat)
      .setDOMContent(container)
      .addTo(map);

    // Handle popup close event
    popup.on('close', () => {
      onClose();
    });

    popupRef.current = popup;

    // Render content
    renderPopupContent();

    return () => {
      // Clean up
      if (rootRef.current) {
        rootRef.current.unmount();
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, lngLat]);

  // Re-render when terminal data changes
  useEffect(() => {
    renderPopupContent();
  }, [terminal]);

  const renderPopupContent = () => {
    if (!rootRef.current || !containerRef.current) return;

    const PopupContent = (
      <div className="p-2 w-[240px] terminal-popup-content">
        <div className="text-center mb-2">
          <h3 className="font-semibold text-base">{terminal.name}</h3>
          <p className="text-xs text-muted-foreground">
            {getCategoryLabel(terminal.category)}
          </p>
        </div>

        <div className="text-xs text-center mb-2">
          <p>{terminal.address}</p>
          <p>{terminal.neighborhood}, {terminal.city}/{terminal.state}</p>
          {terminal.cep && <p>CEP: {terminal.cep}</p>}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Telas: {terminal.screens.available}/{terminal.screens.total}
          </div>
          <Button size="sm" variant="default" className="text-xs h-7 px-2" asChild>
            <a href={`/terminais/${terminal.id}`}>Detalhes</a>
          </Button>
        </div>
      </div>
    );

    rootRef.current.render(PopupContent);
  };

  return null; // Component doesn't render anything directly
};

export default TerminalPopup;
