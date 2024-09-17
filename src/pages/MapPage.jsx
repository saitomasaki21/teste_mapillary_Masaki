import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

const MapPage = () => {
  const mapillaryContainerRef = useRef(null);
  const mapboxContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);

  const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
  const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

  const imageIds = [
    '564405889206577', '858619079095291', '6897855763634676', '675519324722242', '866453934972803',
    '1680533709090114', '291399706582584', '291399706582584', '936108151508171', '780569173997030',
    '876671320563744', '230996086536359', '324569450614861', '877737093809904', '695954539160725',
    '7527311407320062', '870613777929575', '1022081832400119', '903486144533483', '961090825346880',
    '318662640957977', '1537570700318502', '1369903320569507', '664519655751696', '1063849258294245',
    '6887695734650762', '941517530977698', '307327778886459', '360254566391481', '708168144280170',
    '1531000317665797', '2055332174834547', '7031077663682077', '333672646080889', '7308143179305175',
    '853149449881551', '5532332970224700', '1083288059782327', '5532332970224700', '357183816780246',
    '737315741828557', '702692014903291', '363515566241047', '689239093311973', '3731987453737181',
    '371255755344379', '691734116248246', '214167844438607'
  ];

  useEffect(() => {
    const fetchImageData = async () => {
      const fetchedCoordinates = await Promise.all(
        imageIds.map(async (id) => {
          const response = await fetch(`https://graph.mapillary.com/${id}?access_token=${mapillaryAccessToken}&fields=geometry`);
          const data = await response.json();
          return data.geometry.coordinates;
        })
      );
      setCoordinates(fetchedCoordinates);
    };

    fetchImageData();
  }, []);

  useEffect(() => {
    if (!mapillaryContainerRef.current || !mapboxContainerRef.current || coordinates.length === 0) return;

    viewerRef.current = new Viewer({
      accessToken: mapillaryAccessToken,
      container: mapillaryContainerRef.current,
      imageId: imageIds[0],
      component: {
        cover: false,
        direction: false,
        sequence: false,
        zoom: false,
      },
    });

    mapboxgl.accessToken = mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: mapboxContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates[0],
      zoom: 18,
    });

    map.on('load', () => {
      // Add markers for each coordinate
      coordinates.forEach((coord, index) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = '#3FB1CE';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coord)
          .addTo(map);

        // Create a popup but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        // Change the cursor to a pointer when the mouse is over the marker.
        el.addEventListener('mouseenter', () => {
          map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(coord)
            .setHTML(`Image ID: ${imageIds[index]}`)
            .addTo(map);
        });

        // Change it back to a pointer when it leaves.
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

      // Draw path on the map
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
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
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
      map.remove();
    };
  }, [coordinates]);

  return (
    <div className="flex h-screen">
      <div ref={mapillaryContainerRef} className="w-1/2 h-full" />
      <div ref={mapboxContainerRef} className="w-1/2 h-full" />
    </div>
  );
};

export default MapPage;
