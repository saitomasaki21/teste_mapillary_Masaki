import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { imageIds } from '../utils/mapData';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = [];
      for (const id of imageIds) {
        try {
          const response = await fetch(`https://a.mapillary.com/v3/images/${id}?client_id=YOUR_CLIENT_ID`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar a imagem com ID ${id}: ${response.statusText}`);
          }
          const data = await response.json();
          coords.push({
            latitude: data.lat,
            longitude: data.lon,
          });
        } catch (error) {
          console.error(error);
        }
      }
      setCoordinates(coords);
      setLoading(false); // Atualiza o estado de carregamento
    };

    fetchCoordinates();

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
      {loading ? ( // Verifica se está carregando
        <div>Carregando coordenadas...</div>
      ) : (
        <MapboxMap
          accessToken={mapboxAccessToken}
          coordinates={coordinates} // Passa as coordenadas carregadas
          imageIds={imageIds}
          viewerRef={viewerRef}
        />
      )}
    </div>
  );
};

export default MapPage;
