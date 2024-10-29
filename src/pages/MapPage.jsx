import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapillary-js/dist/mapillary.css';
import { Viewer } from 'mapillary-js';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { coordinates, imageIds } from '../utils/mapData'; // Importando as listas

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
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
        imageId={imageIds[0]} // Primeiro ID da lista como imagem inicial
        viewerRef={viewerRef}
      />
      <MapboxMap
        accessToken={mapboxAccessToken}
        coordinates={coordinates} // Usando as coordenadas da lista
        imageIds={imageIds}       // Passando os IDs das imagens
        viewerRef={viewerRef}
      />
    </div>
  );
};

export default MapPage;
