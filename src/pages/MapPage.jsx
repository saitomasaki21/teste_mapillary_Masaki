import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';
import { imageIds } from '../utils/mapData';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const MapPage = () => {
  const viewerRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coordsArray = await Promise.all(imageIds.map(async (imageId) => {
        const url = `https://graph.mapillary.com/${imageId}?fields=computed_geometry&access_token=${mapillaryAccessToken}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.computed_geometry && data.computed_geometry.coordinates) {
            const [longitude, latitude] = data.computed_geometry.coordinates;
            return { imageId, latitude, longitude };
          } else {
            console.error(`Coordinates not available for image ID: ${imageId}`);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching data for image ID: ${imageId}`, error);
          return null;
        }
      }));

      // Filtrar valores nulos e atualizar o estado com as coordenadas válidas
      setCoordinates(coordsArray.filter(coord => coord !== null));
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
