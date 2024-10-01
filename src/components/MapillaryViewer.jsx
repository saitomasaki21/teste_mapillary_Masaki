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
        cover: false,
        direction: false,
        sequence: false,
        zoom: false,
      },
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, [accessToken, imageId, viewerRef]);

  return <div ref={mapillaryContainerRef} className="w-1/2 h-full" />;
};
