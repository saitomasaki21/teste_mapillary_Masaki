import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

const MapPage = () => {
  const mapillaryContainerRef = useRef(null);
  const mapboxContainerRef = useRef(null);
  const viewerRef = useRef(null);

  const mapillaryAccessToken = 'MLY|9269492676456633|a6293e72d833fa0f80c33e4fb48d14f5';
  const mapboxAccessToken = 'pk.eyJ1IjoiYW5kcmVtZW5kb25jYSIsImEiOiJjbGxrMmRidjYyaGk4M21tZ2hhanFjMjVwIn0.4_fHgnbXRc1Hxg--Bs_kkg';

  const imageIds = [
    '564405889206577', '858619079095291', '6897855763634676', '675519324722242', '866453934972803',
    '1680533709090114', '291399706582584', '291399706582584', '936108151508171', '780569173997030',
    '876671320563744', '230996086536359', '324569450614861', '877737093809904', '695954539160725',
    '7527311407320062', '870613777929575', '1022081832400119', '903486144533483', '961090825346880',
    '318662640957977', '1537570700318502', '1369903320569507', '664519655751696', '1063849258294245',
    '6887695734650762', '941517530977698', '307327778886459'
  ];

  const coordinates = [
    [-49.2324409584695, -25.4508140632974],
    [-49.23244804, -25.45083001],
    [-49.232452292586, -25.4508374609243],
    [-49.2324689642478, -25.4508428103442],
    [-49.2324804534746, -25.4508374580959],
    [-49.2324912284956, -25.4508326225074],
    [-49.2325069224226, -25.4508268288333],
    [-49.2325165895772, -25.4508241525074],
    [-49.2325217217404, -25.450837223589],
    [-49.23250839, -25.45084454],
    [-49.23248425, -25.45085544],
    [-49.2324664895414, -25.4508580913704],
    [-49.2324648559882, -25.4508630171484],
    [-49.2324729504657, -25.4508816424816],
    [-49.2324808859095, -25.4509012229006],
    [-49.2324769103871, -25.4509081114296],
    [-49.2324927500725, -25.4509056104266],
    [-49.2324900186529, -25.4509223730579],
    [-49.2325040539036, -25.4509532683087],
    [-49.23252851, -25.45101165],
    [-49.23254058, -25.4510395],
    [-49.2325561088142, -25.4510665082839],
    [-49.2325674, -25.45109399],
    [-49.23258349, -25.45112669],
    [-49.2325919565233, -25.4511515423846],
    [-49.23260093, -25.45117513],
    [-49.23261434, -25.4511945],
    [-49.2326244695619, -25.4512157347939],
    [-49.23263311, -25.4512381],
    [-49.2326403092473, -25.4512574181766],
    [-49.23264921, -25.45127443],
    [-49.2326553152651, -25.4512874302122],
    [-49.23266396, -25.4513047],
    [-49.232669904449, -25.4513141075771],
    [-49.23267469, -25.45132529],
    [-49.2326919966418, -25.4513182759154],
    [-49.23268542, -25.45134103],
    [-49.2326961649801, -25.4513349492685],
    [-49.2326936639771, -25.4513532899569],
    [-49.23270285, -25.45136404],
    [-49.23267201, -25.4513713],
    [-49.2326882451374, -25.4513657949717],
    [-49.2326548984312, -25.4513774663188],
    [-49.23263177, -25.45138583],
    [-49.2326107140456, -25.4513933060042],
    [-49.23258886, -25.451404],
    [-49.23261166, -25.45146091]
  ];

  useEffect(() => {
    if (!mapillaryContainerRef.current || !mapboxContainerRef.current) return;

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
  }, []);

  return (
    <div className="flex h-screen">
      <div ref={mapillaryContainerRef} className="w-1/2 h-full" />
      <div ref={mapboxContainerRef} className="w-1/2 h-full" />
    </div>
  );
};

export default MapPage;
