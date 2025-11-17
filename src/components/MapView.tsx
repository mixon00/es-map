import { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

function MapView() {
  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([19.0, 52.0]),
        zoom: 6,
      }),
    });

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border">
      <div id="map" className="w-full h-full"></div>
    </div>
  );
}

export default MapView;
