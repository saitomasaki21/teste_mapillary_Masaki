import React, { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';

export const MapillaryViewer = ({ accessToken, imageId, viewerRef }) => {
  const mapillaryContainerRef = new mapboxgl.Map({
        container: 'map',
        zoom: 16.2,
        pitch: 75,
        bearing: -170,
        center: [-122.395, 37.792],
        style: 'mapbox://styles/mapbox/standard', // Use the Mapbox Standard style
        config: {
            // Initial configuration for the Mapbox Standard style set above. By default, its ID is `basemap`.
            basemap: {
                // Here, we're disabling all of the 3D layers such as landmarks, trees, and 3D extrusions.
                show3dObjects: false
            }
        }
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, [accessToken, imageId, viewerRef]);

  return <div ref={mapillaryContainerRef} className="w-1/2 h-full" />;
};
