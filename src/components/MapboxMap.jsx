import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createMarkerElement, addMarkersToMap, drawPathOnMap, updateFieldOfView } from '../utils/mapUtils';

export const MapboxMap = ({ accessToken, coordinates, imageIds, viewerRef }) => {
  const mapboxContainerRef = useRef(null);
  const mapRef = useRef(null);
  const fovLayerRef = useRef(null);
  const markersRef = useRef([]);
  const [currentImageId, setCurrentImageId] = useState(null);

  useEffect(() => {
    if (!mapboxContainerRef.current) return;

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates[0],
      zoom: 20,
    });

    mapRef.current = map;

    map.on('load', () => {
      markersRef.current = addMarkersToMap(map, coordinates, imageIds, viewerRef, setCurrentImageId);
      drawPathOnMap(map, coordinates);

      const scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      });
      map.addControl(scale, 'bottom-left');

      class NorthArrowControl {
        onAdd(map) {
          this._map = map;
          this._container = document.createElement('div');
          this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
          this._container.innerHTML = `
            <div class="north-arrow">
              <div class="north-arrow-pointer"></div>
              <div class="north-arrow-n">N</div>
            </div>
          `;
          return this._container;
        }

        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        }
      }

      map.addControl(new NorthArrowControl(), 'top-right');

      map.addSource('fov', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coordinates[0],
          },
        },
      });

      map.addLayer({
        id: 'fov',
        type: 'symbol',
        source: 'fov',
        layout: {
          'icon-image': 'triangle-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: {
          'icon-color': '#3FB1CE',
          'icon-opacity': 0.8,
        },
      });

      fovLayerRef.current = map.getSource('fov');
    });

    return () => map.remove();
  }, [accessToken, coordinates, imageIds, viewerRef]);

  useEffect(() => {
    if (viewerRef.current && mapRef.current && fovLayerRef.current) {
      const updateFOV = () => {
        const pov = viewerRef.current.getPointOfView();
        if (pov) {
          updateFieldOfView(mapRef.current, fovLayerRef.current, pov);
          const currentNode = viewerRef.current.getActiveNode();
          if (currentNode) {
            setCurrentImageId(currentNode.id);
          }
        }
      };

      viewerRef.current.on('position', updateFOV);

      return () => {
        viewerRef.current.off('position', updateFOV);
      };
    }
  }, [viewerRef]);

  useEffect(() => {
    if (currentImageId && markersRef.current) {
      markersRef.current.forEach((marker, index) => {
        const el = marker.getElement();
        if (imageIds[index] === currentImageId) {
          el.style.backgroundColor = '#FF0000'; // Highlight color
        } else {
          el.style.backgroundColor = '#3FB1CE'; // Default color
        }
      });
    }
  }, [currentImageId, imageIds]);

  return <div ref={mapboxContainerRef} className="w-1/2 h-full" />;
};

Now, let's update the mapUtils.js file to modify the marker creation process:

<lov-write file_path="src/utils/mapUtils.js">
import mapboxgl from 'mapbox-gl';

export const createMarkerElement = () => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundColor = '#3FB1CE';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  return el;
};

export const addMarkersToMap = (map, coordinates, imageIds, viewerRef, setCurrentImageId) => {
  return coordinates.map((coord, index) => {
    const el = createMarkerElement();
    const marker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map);
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    el.addEventListener('mouseenter', () => {
      map.getCanvas().style.cursor = 'pointer';
      popup.setLngLat(coord)
           .setHTML(`Ordem: ${index + 1}<br>Image ID: ${imageIds[index]}`)
           .addTo(map);
    });

    el.addEventListener('mouseleave', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    el.addEventListener('click', () => {
      if (viewerRef.current && viewerRef.current.isNavigable) {
        viewerRef.current.moveTo(imageIds[index]).catch(console.error);
        setCurrentImageId(imageIds[index]);
      }
    });

    return marker;
  });
};

export const drawPathOnMap = (map, coordinates) => {
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates,
      },
    },
  });
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#888',
      'line-width': 8,
    },
  });
};

export const updateFieldOfView = (map, fovLayer, pov) => {
  if (pov && pov.lat && pov.lng) {
    fovLayer.setData({
      type: 'Feature',
      properties: {
        bearing: pov.bearing,
      },
      geometry: {
        type: 'Point',
        coordinates: [pov.lng, pov.lat],
      },
    });

    map.easeTo({
      center: [pov.lng, pov.lat],
      bearing: pov.bearing,
      pitch: pov.pitch,
    });
  }
};