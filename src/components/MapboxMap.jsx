import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { addMarkersToMap, drawPathOnMap, updateFieldOfView, updateMarkerStyle } from '../utils/mapUtils';

export const MapboxMap = ({ accessToken, mapillaryAccessToken, trails, viewerRef }) => {
  const mapboxContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fovLayerRef = useRef(null);
  const markersRef = useRef([]);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);
  const [trailsData, setTrailsData] = useState([]);

  // Busca as coordenadas dos IDs do Mapillary
  useEffect(() => {
    const fetchTrailsData = async () => {
      const fetchedTrails = await Promise.all(
        trails.map(async trail => {
          const coordinates = await Promise.all(
            trail.imageIds.map(async imageId => {
              const response = await fetch(
                `https://graph.mapillary.com/${imageId}?fields=geometry&access_token=${mapillaryAccessToken}`
              );
              const data = await response.json();
              return data.geometry.coordinates;
            })
          );
          return { ...trail, coordinates };
        })
      );
      setTrailsData(fetchedTrails);
    };

    fetchTrailsData();
  }, [trails, mapillaryAccessToken]);

  useEffect(() => {
    if (!mapboxContainerRef.current || trailsData.length === 0) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: trailsData[0].coordinates[0],
      zoom: 15,
      pitch: 45,
      bearing: -17.6
    });

    mapRef.current = map;

    map.on('load', () => {
      // Adiciona todos os marcadores
      const allCoordinates = trailsData.flatMap(t => t.coordinates);
      const allImageIds = trailsData.flatMap(t => t.imageIds);
      
      markersRef.current = addMarkersToMap(map, allCoordinates, allImageIds, viewerRef, setActiveMarkerIndex);

      // Desenha cada trilha
      trailsData.forEach((trail, index) => {
        drawPathOnMap(map, trail.coordinates, {
          lineColor: `hsl(${(index * 360) / trailsData.length}, 100%, 50%)`,
          lineWidth: 4,
          trailId: `trail-${index}`
        });
      });

      // Configuração do campo de visão
      map.addSource('fov', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: allCoordinates[0]
          }
        }
      });

      map.addLayer({
        id: 'fov',
        type: 'symbol',
        source: 'fov',
        layout: {
          'icon-image': 'triangle-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map'
        }
      });

      fovLayerRef.current = map.getSource('fov');
    });

    return () => map.remove();
  }, [trailsData, accessToken]);

  // Restante do código permanece igual...
  // [Manter os useEffect de atualização do FOV e marcadores ativos]

  return <div ref={mapboxContainerRef} className="w-1/2 h-full" />;
};
