import { useEffect, useMemo } from 'react';
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transformExtent } from 'ol/proj';
import { createMaskLayer } from './createMaskLayer';
import { createVoivodeshipsLayer } from './createVoivodeshipsLayer';
import { createLiniesLayer } from './createLiniesLayer';
import { LayerOptions } from '@/components/LayerOptions';
import { useOptions } from '@/stores/options.store';

export const MapView = () => {
  const showLines = useOptions((state) => state.showLines);
  const showCharts = useOptions((state) => state.showCharts);

  const polandBounds = useMemo(() => [14.0, 49.0, 24.0, 55.0], []);
  const extent = useMemo(
    () => transformExtent(polandBounds, 'EPSG:4326', 'EPSG:3857'),
    [polandBounds]
  );

  const maskLayer = useMemo(() => createMaskLayer(), []);
  const voivodeshipsLayer = useMemo(() => createVoivodeshipsLayer(), []);
  const liniesLayer = useMemo(() => createLiniesLayer(), []);

  useEffect(() => {
    voivodeshipsLayer.setVisible(showCharts);
  }, [showCharts, voivodeshipsLayer]);

  useEffect(() => {
    liniesLayer.setVisible(showLines);
  }, [showLines, liniesLayer]);

  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        voivodeshipsLayer,
        maskLayer,
        liniesLayer,
      ],
      view: new View({
        center: fromLonLat([19.0, 52.0]),
        zoom: 1,
        extent: extent,
        constrainOnlyCenter: false,
        smoothExtentConstraint: true,
      }),
    });

    return () => {
      map.dispose();
    };
  }, [extent, maskLayer, voivodeshipsLayer, liniesLayer]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border">
      <div id="map" className="w-full h-full"></div>
      <LayerOptions />
    </div>
  );
};
