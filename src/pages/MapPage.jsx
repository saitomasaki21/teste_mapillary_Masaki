import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { imageIds } from '../utils/mapData';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [imageData, setImageData] = useState([]);

  const fetchCoordinatesFromMapillary = async () => {
    try {
      const data = await Promise.all(
        imageIds.map(async (id) => {
          const response = await fetch(`https://graph.mapillary.com/${id}?access_token=${mapillaryAccessToken}&fields=id,geometry`);
          const image = await response.json();
          return {
            id: image.id,
            coordinates: image.geometry.coordinates,
            isCurrentImage: false,
          };
        })
      );

      setImageData(data); // Atualiza o estado com as coordenadas e IDs de imagens
    } catch (error) {
      console.error("Erro ao buscar coordenadas do Mapillary:", error);
    }
  };

  useEffect(() => {
    fetchCoordinatesFromMapillary(); // Carrega as coordenadas automaticamente
    
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
        imageId={imageIds[0]} // Inicia com o primeiro ID de imagem
        viewerRef={viewerRef}
      />
      <MapboxMap
        accessToken={mapboxAccessToken}
        imageData={imageData} // Passa os dados das imagens com coordenadas dinâmicas
        viewerRef={viewerRef}
      />
    </div>
  );
};

export default MapPage;
