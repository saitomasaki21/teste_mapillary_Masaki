import React, { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';

export const MapillaryViewer = ({ accessToken, imageId, viewerRef }) => {
  const mapillaryContainerRef = useRef(null);

  useEffect(() => {
    if (!mapillaryContainerRef.current) return;

    viewerRef.current = new Viewer({
      accessToken,
      container: mapillaryContainerRef.current,
      imageId,
      component: {
        cover: true,     // Esconde elementos de sobreposição
        direction: false,
        sequence: false, // Remove a barra de sequência
        zoom: false,
        attribution: false // Remove a atribuição
      },
      renderMode: 'fill'
    });

    const resizeObserver = new ResizeObserver(() => {
      viewerRef.current.resize();
    });
    
    resizeObserver.observe(mapillaryContainerRef.current);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
      resizeObserver.disconnect();
    };
  }, [accessToken, imageId, viewerRef]);

  return (
    <div 
      ref={mapillaryContainerRef} 
      className="w-full h-full bg-gray-800" // Fundo neutro
    />
  );
};
