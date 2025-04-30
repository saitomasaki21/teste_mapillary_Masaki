import React, { useEffect, useRef, useState } from 'react';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { trails } from '../utils/mapData'; // Alterado para trails

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [selectedTrail, setSelectedTrail] = useState(trails[0]); // Estado para trilha selecionada
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Container Mapillary - 50% da largura */}
      <div className="w-1/2 h-full border-r-2 border-gray-200">
        <MapillaryViewer
          accessToken={mapillaryAccessToken}
          imageId={selectedTrail.imageIds[currentImageIndex]}
          viewerRef={viewerRef}
        />
      </div>

      {/* Container Mapbox - 50% da largura */}
      <div className="w-1/2 h-full">
        <MapboxMap
          accessToken={mapboxAccessToken}
          trails={trails}
          selectedTrail={selectedTrail}
          onTrailSelect={(trail) => {
            setSelectedTrail(trail);
            setCurrentImageIndex(0);
          }}
          viewerRef={viewerRef}
        />
      </div>
    </div>
  );
};

export default MapPage;
