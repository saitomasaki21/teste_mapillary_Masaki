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

export const addMarkersToMap = (map, coordinates, imageIds, viewerRef) => {
  coordinates.forEach((coord, index) => {
    const el = createMarkerElement();
    const marker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map);
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    el.addEventListener('mouseenter', () => {
      map.getCanvas().style.cursor = 'pointer';
      popup.setLngLat(coord).setHTML(`Image ID: ${imageIds[index]}`).addTo(map);
    });

    el.addEventListener('mouseleave', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    el.addEventListener('click', () => {
      if (viewerRef.current && viewerRef.current.isNavigable) {
        viewerRef.current.moveTo(imageIds[index]).catch(console.error);
      }
    });
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