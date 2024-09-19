import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createMarkerElement, addMarkersToMap, drawPathOnMap } from '../utils/mapUtils';

export const MapboxMap = ({ accessToken, coordinates, imageIds, viewerRef }) => {
  const mapboxContainerRef = useRef(null);

  useEffect(() => {
    if (!mapboxContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates[0],
      zoom: 20, // Increased from 18 to 20
    });

    map.on('load', () => {
      addMarkersToMap(map, coordinates, imageIds, viewerRef);
      drawPathOnMap(map, coordinates);
    });

    return () => map.remove();
  }, [accessToken, coordinates, imageIds, viewerRef]);

  return <div ref={mapboxContainerRef} className="w-1/2 h-full" />;
};
