import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export const OldFullscreenMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/dark', 
      center: [-50, -14],
      zoom: 3.9
    });

    map.on('style.load', () => {
      map.setProjection({
        type: 'globe',
      });
    });

    map.on('load', async () => {
      try {
        const response = await fetch('http://localhost:5173/influencer-map/data/04_map_data.geojson');
        const originalData = await response.json();

        // Arrays para armazenar as novas features
        const spreadFeatures: any[] = [];
        const lineFeatures: any[] = [];

        // Algoritmo de Espiral para espalhar pontos sobrepostos
        originalData.features.forEach((feature: any, index: number) => {
          const coords = feature.geometry.coordinates;
          
          // Criamos um deslocamento em espiral baseado no índice
          // Isso garante que 100 nomes não fiquem um sobre o outro
          const angle = 0.5 * index;
          const radius = 0.0005 * index; // Ajuste este multiplicador para aumentar/diminuir o espalhamento
          
          const newLng = coords[0] + (radius * Math.cos(angle));
          const newLat = coords[1] + (radius * Math.sin(angle));

          // 1. Feature do Ponto e Label (na nova posição)
          spreadFeatures.push({
            ...feature,
            geometry: {
              type: 'Point',
              coordinates: [newLng, newLat]
            }
          });

          // 2. Feature da Linha (conectando original -> novo)
          lineFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [coords[0], coords[1]], // Origem exata (SP)
                [newLng, newLat]        // Onde o texto vai ficar
              ]
            }
          });
        });

        // Adiciona a fonte com as linhas
        map.addSource('lines-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: lineFeatures }
        });

        // Adiciona a fonte com os pontos espalhados
        map.addSource('influencers-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: spreadFeatures }
        });

        // CAMADA 1: Linhas Conectoras
        map.addLayer({
          id: 'linhas-conectoras',
          type: 'line',
          source: 'lines-source',
          paint: {
            'line-color': '#ff0000',
            'line-width': 1.5,
            'line-dasharray': [2, 2], // Linha tracejada
            'line-opacity': 0.4,
          }
        });

        // CAMADA 2: Ponto Vermelho (na nova posição)
        map.addLayer({
          id: 'pontos-origem',
          type: 'circle',
          source: 'influencers-source',
          paint: {
            'circle-radius': 3,
            'circle-color': '#e63946'
          }
        });

        // CAMADA 3: Labels (na nova posição)
        map.addLayer({
          id: 'labels-influenciadores',
          type: 'symbol',
          source: 'influencers-source',
          layout: {
            'text-field': ['get', 'title'],
            'text-size': 12,
            'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
            'text-radial-offset': 0.5,
            'text-allow-overlap': false,
            'text-padding': 10.0,
            'text-ignore-placement': false,
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 0.8
          }
        });

        // --- LÓGICA DE TOGGLE ---
        map.on('contextmenu', () => {
          const vis = map.getLayoutProperty('labels-influenciadores', 'visibility') === 'none' ? 'visible' : 'none';
          ['labels-influenciadores', 'pontos-origem', 'linhas-conectoras'].forEach(id => {
            map.setLayoutProperty(id, 'visibility', vis);
          });
        });
      } catch (err) {
        console.error("Erro ao processar spiderfier:", err);
      }

      map.addSource('influencers-source', {
        type: 'geojson',
        data: 'http://localhost:5173/influencer-map/data/04_map_data.geojson', 
      });

      map.addLayer({
        id: 'pontos-origem',
        type: 'circle',
        source: 'influencers-source',
        layout: { 'visibility': 'visible' },
        paint: {
          'circle-radius': 3,
          'circle-color': '#e63946',
          'circle-stroke-width':1,
          'circle-stroke-color': '#ffffff'
        }
      });
      
      map.addLayer({
        id: 'labels-influenciadores',
        type: 'symbol',
        source: 'influencers-source',
        layout: {
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 12,
          'text-variable-anchor': ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
          'text-radial-offset': 0.8,
          'text-ignore-placement': true,
          'text-justify': 'auto',
          'text-allow-overlap': false,
          'text-optional': true, 
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1.15
        }
      });

      map.on('contextmenu', () => {
        const visibility = map.getLayoutProperty('labels-influenciadores', 'visibility');
        const nextVisibility = (visibility === 'visible' || visibility === undefined) ? 'none' : 'visible';
        map.setLayoutProperty('labels-influenciadores', 'visibility', nextVisibility);
        map.setLayoutProperty('pontos-origem', 'visibility', nextVisibility); // muda visibilidade dos pontos
      });

      map.on('mouseenter', 'labels-influenciadores', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'labels-influenciadores', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    map.on('click', 'labels-influenciadores', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const url = feature.properties?.url;

        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'absolute', 
        top: 0, 
        left: 0,
        backgroundColor: '#222'
      }}
    />
  );
};