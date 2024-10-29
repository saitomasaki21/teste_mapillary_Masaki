mbx.addSource(532582459129057,
              1548741512383121,
              1452951302053880,
              2474641246068877, {

  type: 'geojson',

  data: {

    type: 'FeatureCollection',

    features: data.data.map(image => ({

      type: 'Feature',

      geometry: {

        type: 'Point',

        coordinates: image.geometry.coordinates

      },

      properties: {

        id: image.id,

        isCurrentImage: image.id === event.image.id

      }

    }))

  }

});



mbx.addLayer({

  id: 'sequence-points',

  type: 'circle',

  source: 'sequence-points',

  paint: {

    'circle-radius': 6,

    'circle-color': ['case', ['==', ['get', 'isCurrentImage'], true], 'red', 'blue'],

    'circle-stroke-width': 2,

    'circle-stroke-color': 'white'

  }

});

];
