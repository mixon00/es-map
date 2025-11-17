import { use, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';
import { Style, Fill } from 'ol/style';
import { fromLonLat, transformExtent } from 'ol/proj';
import { fetchPolandData } from '@/services/polandData';

export const MapView = () => {
  const polandCoordinates = use(fetchPolandData());

  useEffect(() => {
    const polandBounds = [14.0, 49.0, 24.0, 55.0];
    const extent = transformExtent(polandBounds, 'EPSG:4326', 'EPSG:3857');
    const overlayPadding = 500000;
    const expandedExtent = [
      extent[0] - overlayPadding,
      extent[1] - overlayPadding,
      extent[2] + overlayPadding,
      extent[3] + overlayPadding,
    ];

    const outerRing = [
      [expandedExtent[0], expandedExtent[1]],
      [expandedExtent[2], expandedExtent[1]],
      [expandedExtent[2], expandedExtent[3]],
      [expandedExtent[0], expandedExtent[3]],
      [expandedExtent[0], expandedExtent[1]],
    ];

    const polandRing = polandCoordinates
      .map((coord) => {
        const [lon, lat] = coord;
        const transformed = fromLonLat([lon, lat]);
        return [transformed[0], transformed[1]];
      })
      .reverse();

    const maskPolygon = new Polygon([outerRing, polandRing]);

    const maskLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: maskPolygon,
          }),
        ],
      }),
      style: new Style({
        fill: new Fill({
          color: 'white',
        }),
      }),
      zIndex: 1000,
      updateWhileAnimating: false,
      updateWhileInteracting: false,
      renderBuffer: 500,
      declutter: false,
    });

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        maskLayer,
      ],
      view: new View({
        center: fromLonLat([19.0, 52.0]),
        zoom: 6,
        extent: extent,
        constrainOnlyCenter: false,
        smoothExtentConstraint: true,
      }),
    });

    return () => {
      map.dispose();
    };
  }, [polandCoordinates]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border">
      <div id="map" className="w-full h-full"></div>
    </div>
  );
};
