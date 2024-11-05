import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { initCoordinates, imageIds, getCoordinates } from '../utils/mapData';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const loadCoordinates = async () => {
      await initCoordinates(); // Chama a função para carregar as coordenadas
      const coords = getCoordinates(); // Obtém as coordenadas após a inicialização
      setCoordinates(coords); // Atualiza o estado com as coordenadas
    };

    loadCoordinates();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex h-screen">
      <MapillaryViewer
        accessToken={mapillaryAccessToken}
        imageId={imageIds[0]}
        viewerRef={viewerRef}
      />
      <MapboxMap
        accessToken={mapboxAccessToken}
        coordinates={coordinates}
        imageIds={imageIds}
        viewerRef={viewerRef}
      />
    </div>
  );
};

export default MapPage;
