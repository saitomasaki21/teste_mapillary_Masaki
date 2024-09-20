import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createMarkerElement, addMarkersToMap, drawPathOnMap, updateFieldOfView } from '../utils/mapUtils';

export const MapboxMap = ({ accessToken, coordinates, imageIds, viewerRef }) => {
  const mapboxContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fovLayerRef = useRef(null);

  useEffect(() => {
    if (!mapboxContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates[0],
      zoom: 20,
    });

    mapRef.current = map;

    map.on('load', () => {
      addMarkersToMap(map, coordinates, imageIds, viewerRef);
      drawPathOnMap(map, coordinates);

      // Add a new layer for the field of view
      map.addSource('fov', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coordinates[0],
          },
        },
      });

      map.addLayer({
        id: 'fov',
        type: 'symbol',
        source: 'fov',
        layout: {
          'icon-image': 'triangle-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: {
          'icon-color': '#3FB1CE',
          'icon-opacity': 0.8,
        },
      });

      fovLayerRef.current = map.getSource('fov');
    });

    return () => map.remove();
  }, [accessToken, coordinates, imageIds, viewerRef]);

  useEffect(() => {
    if (viewerRef.current && mapRef.current && fovLayerRef.current) {
      const updateFOV = () => {
        const pov = viewerRef.current.getPointOfView();
        if (pov) {
          updateFieldOfView(mapRef.current, fovLayerRef.current, pov);
        }
      };

      viewerRef.current.on('position', updateFOV);

      return () => {
        viewerRef.current.off('position', updateFOV);
      };
    }
  }, [viewerRef]);

  return <div ref={mapboxContainerRef} className="w-1/2 h-full" />;
};
