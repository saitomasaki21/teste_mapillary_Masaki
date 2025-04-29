import mapboxgl from 'mapbox-gl';

// Funções para manipulação de marcadores
export const createMarkerElement = (isActive = false) => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.transition = 'background-color 0.3s ease';
  updateMarkerStyle(el, isActive);
  return el;
};

export const updateMarkerStyle = (el, isActive) => {
  el.style.backgroundColor = isActive ? '#FF0000' : '#3FB1CE';
};

export const addMarkersToMap = (map, coordinates, imageIds, viewerRef, setActiveMarkerIndex) => {
  return coordinates.map((coord, index) => {
    const el = createMarkerElement(index === 0);
    const marker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map);

    el.addEventListener('click', () => {
      if (viewerRef.current && imageIds[index]) {
        viewerRef.current.moveTo(imageIds[index]).catch(console.error);
        setActiveMarkerIndex(index);
      }
    });

    return marker;
  });
};

// Funções para manipulação de trilhas
export const drawPathOnMap = (map, coordinates, options = {}) => {
  const {
    lineColor = '#888',
    lineWidth = 8,
    trailId = 'route',
    lineJoin = 'round',
    lineCap = 'round'
  } = options;

  const sourceId = `${trailId}-source`;
  const layerId = `${trailId}-layer`;

  // Remove a layer existente se já existir
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  map.addSource(sourceId, {
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
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-join': lineJoin,
      'line-cap': lineCap,
    },
    paint: {
      'line-color': lineColor,
      'line-width': lineWidth,
    },
  });

  return { sourceId, layerId };
};

export const drawMultiplePaths = (map, trails) => {
  trails.forEach((trail, index) => {
    const color = getColorForIndex(index);
    drawPathOnMap(map, trail.coordinates, {
      trailId: `trail-${index}`,
      lineColor: color,
      lineWidth: 6
    });
  });
};

const getColorForIndex = (index) => {
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000'
  ];
  return colors[index % colors.length];
};

// Funções para campo de visão
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
      pitch: pov.pitch || 0,
      duration: 500
    });
  }
};

// Função para buscar coordenadas do Mapillary
export const fetchCoordinatesFromMapillary = async (imageIds, accessToken) => {
  try {
    const coordinates = await Promise.all(
      imageIds.map(async (imageId) => {
        const response = await fetch(
          `https://graph.mapillary.com/${imageId}?fields=geometry&access_token=${accessToken}`
        );
        const data = await response.json();
        return data.geometry.coordinates;
      })
    );
    return coordinates;
  } catch (error) {
    console.error('Error fetching coordinates from Mapillary:', error);
    return [];
  }
};
