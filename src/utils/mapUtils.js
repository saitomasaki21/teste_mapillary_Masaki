export const drawPathOnMap = (map, coordinates, options = {}) => {
  const sourceId = options.trailId ? `${options.trailId}-source` : 'path-source';
  const layerId = options.trailId ? `${options.trailId}-layer` : 'path-layer';

  if (map.getSource(sourceId)) {
    map.getSource(sourceId).setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates
      }
    });
  } else {
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': options.lineColor || '#ff0000',
        'line-width': options.lineWidth || 2
      }
    });
  }
};
