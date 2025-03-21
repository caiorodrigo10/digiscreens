
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Terminal } from '@/types/terminal';
import TerminalPopup from './TerminalPopup';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGlnaXNjcmVlbnMiLCJhIjoiY204ZzVhZHY2MGphZjJqcTZ4dGx6MGRqdiJ9.jcQZ7bZa3jM5FZ4pRTv3Pw';

interface TerminalMapProps {
  terminals: Terminal[];
  onToggleFavorite: (id: string) => void;
  searchCenter: [number, number] | null;
  searchRadius: number;
}

const TerminalMap: React.FC<TerminalMapProps> = ({ 
  terminals, 
  onToggleFavorite,
  searchCenter,
  searchRadius
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activePopup, setActivePopup] = useState<{
    terminal: Terminal;
    coordinates: [number, number];
  } | null>(null);

  // Status color mapping
  const statusColors: Record<string, string> = {
    online: '#10b981', // green
    offline: '#ef4444', // red
    maintenance: '#f59e0b', // amber
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-46.5763, -23.5329], // Default to Tatuapé, São Paulo
      zoom: 13,
    });

    // Add navigation control (zoom buttons)
    newMap.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add geolocate control
    newMap.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Save map instance
    map.current = newMap;

    // Add markers when map loads
    newMap.on('load', () => {
      // Add custom layers if needed
      newMap.addSource('terminals', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add cluster circles
      newMap.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'terminals',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      });

      // Add cluster count text
      newMap.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'terminals',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Add individual terminal points
      newMap.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'terminals',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Add terminal label
      newMap.addLayer({
        id: 'terminal-label',
        type: 'symbol',
        source: 'terminals',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 10,
          'text-offset': [0, 1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#333',
          'text-halo-color': '#fff',
          'text-halo-width': 1
        }
      });

      updateMarkers();
    });

    // Handle click on cluster
    newMap.on('click', 'clusters', (e) => {
      const features = newMap.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties?.cluster_id;
      
      if (clusterId) {
        const source = newMap.getSource('terminals');
        if (source && 'getClusterExpansionZoom' in source) {
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            if (e.lngLat && features[0].geometry.type === 'Point') {
              newMap.easeTo({
                center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
                zoom: zoom
              });
            }
          });
        }
      }
    });

    // Handle click on individual terminal
    newMap.on('click', 'unclustered-point', (e) => {
      if (e.features && e.features.length > 0) {
        const properties = e.features[0].properties;
        if (properties && properties.id) {
          const terminal = terminals.find(t => t.id === properties.id);
          if (terminal && e.lngLat) {
            setActivePopup({
              terminal,
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            });
          }
        }
      }
    });

    // Change cursor on hover
    newMap.on('mouseenter', 'clusters', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    
    newMap.on('mouseleave', 'clusters', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });
    
    newMap.on('mouseenter', 'unclustered-point', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    
    newMap.on('mouseleave', 'unclustered-point', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });

    return () => {
      newMap.remove();
    };
  }, []);

  // Update markers when terminals change
  useEffect(() => {
    updateMarkers();
  }, [terminals]);

  // Update map view when search center changes
  useEffect(() => {
    if (searchCenter && map.current) {
      // Fly to the search center
      map.current.flyTo({
        center: searchCenter,
        zoom: 13,
        speed: 1.2,
        curve: 1,
        easing(t) {
          return t;
        }
      });
      
      // Show search radius circle
      showSearchRadius();
    } else if (map.current) {
      // Remove radius circle if search is cleared
      if (map.current.getLayer('search-radius')) {
        map.current.removeLayer('search-radius');
      }
      if (map.current.getSource('radius-source')) {
        map.current.removeSource('radius-source');
      }
    }
  }, [searchCenter, searchRadius]);

  // Add some CSS to improve popup styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .terminal-mapbox-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .terminal-popup-content {
        max-width: 300px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const updateMarkers = () => {
    if (!map.current || !map.current.getSource('terminals')) return;
    
    // Convert terminals to GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: terminals.map(terminal => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            terminal.coordinates?.longitude || 0,
            terminal.coordinates?.latitude || 0
          ]
        },
        properties: {
          id: terminal.id,
          name: terminal.name,
          status: terminal.status,
          category: terminal.category,
          color: statusColors[terminal.status] || '#666',
          screens: terminal.screens.total,
          available: terminal.screens.available
        }
      }))
    };
    
    // Update source data
    const source = map.current.getSource('terminals');
    if (source && 'setData' in source) {
      source.setData(geojson as any);
    }
  };

  // Show search radius on map
  const showSearchRadius = () => {
    if (!map.current || !searchCenter) return;
    
    // Remove any existing radius circle
    if (map.current.getLayer('search-radius')) {
      map.current.removeLayer('search-radius');
    }
    if (map.current.getSource('radius-source')) {
      map.current.removeSource('radius-source');
    }
    
    // Add new radius circle
    map.current.addSource('radius-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: searchCenter
        }
      }
    });
    
    map.current.addLayer({
      id: 'search-radius',
      type: 'circle',
      source: 'radius-source',
      paint: {
        'circle-radius': {
          stops: [
            [0, 0],
            [10, searchRadius * 1000 / 0.075] // Convert km to pixels based on zoom level
          ],
          base: 2
        },
        'circle-color': 'rgba(66, 135, 245, 0.15)',
        'circle-stroke-color': 'rgba(66, 135, 245, 0.5)',
        'circle-stroke-width': 2
      }
    });
  };

  const handlePopupClose = () => {
    setActivePopup(null);
  };

  return (
    <div className="relative h-[calc(100vh-220px)] min-h-[400px] w-full rounded-md overflow-hidden">
      {/* Map container */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Terminal popup */}
      {activePopup && (
        <TerminalPopup
          terminal={activePopup.terminal}
          map={map.current}
          lngLat={activePopup.coordinates}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default TerminalMap;
