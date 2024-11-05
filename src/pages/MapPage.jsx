import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [imageData, setImageData] = useState([]);

  // Função para carregar dados do Mapillary
  const fetchMapillaryData = async () => {
    try {
      const response = await fetch(`https://graph.mapillary.com/images?access_token=${mapillaryAccessToken}&fields=id,geometry`);
      const data = await response.json();
      
      // Formatar dados para incluir propriedades específicas para o Mapbox
      const formattedData = data.data.map(image => ({
        id: image.id,
        coordinates: image.geometry.coordinates,
        isCurrentImage: false,  // Isso pode ser atualizado conforme necessário
      }));
      
      setImageData(formattedData);
    } catch (error) {
      console.error("Erro ao carregar dados do Mapillary:", error);
    }
  };

  useEffect(() => {
    fetchMapillaryData();
    
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
        imageId={imageData[0]?.id}
        viewerRef={viewerRef}
      />
      <MapboxMap
        accessToken={mapboxAccessToken}
        coordinates={imageData.map(image => image.coordinates)}
        imageData={imageData}
        viewerRef={viewerRef}
      />
    </div>
  );
};

export default MapPage;
