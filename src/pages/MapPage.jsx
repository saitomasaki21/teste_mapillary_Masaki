import React, { useEffect, useState, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapillary-js/dist/mapillary.css';
import { MapboxMap } from '../components/MapboxMap';
import { MapillaryViewer } from '../components/MapillaryViewer';

const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kbjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

const fetchImageCoordinates = async (imageId) => {
  const response = await fetch(
    `https://graph.mapillary.com/${imageId}?fields=geometry&access_token=${mapillaryAccessToken}`
  );
  const data = await response.json();
  return data.geometry.coordinates; // Retorna [longitude, latitude]
};

const MapPage = () => {
  const viewerRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [imageIds, setImageIds] = useState([
    'imageId1', // Substitua pelos IDs reais das imagens
    'imageId2',
    'imageId3',
  ]);

  useEffect(() => {
    const fetchCoordinatesForImages = async () => {
      const coordsPromises = imageIds.map(async (id) => {
        const coords = await fetchImageCoordinates(id);
        return { id, coords };
      });

      const imageCoordinates = await Promise.all(coordsPromises);
      setCoordinates(imageCoordinates);
    };

    fetchCoordinatesForImages();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, [imageIds]);

  return (
    <div className="flex h-screen">
      <MapillaryViewer
        accessToken={mapillaryAccessToken}
        imageId={imageIds[0]} // Exibe a primeira imagem inicialmente
        viewerRef={viewerRef}
      />
      <MapboxMap
        accessToken={mapboxAccessToken}
        coordinates={coordinates.map((img) => img.coords)} // Passa as coordenadas associadas
        imageIds={imageIds}
        viewerRef={viewerRef}
      />
    </div>
  );
};

export default MapPage;
