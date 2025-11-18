import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { createVoivodeshipsStyle } from './createVoivodeshipsStyle';

export function createVoivodeshipsLayer() {
  const layer = new VectorLayer({
    source: new VectorSource({
      url: '/data/wojewodztwa.geojson',
      format: new GeoJSON(),
    }),
    style: createVoivodeshipsStyle,
  });

  const source = layer.getSource();
  if (source) {
    source.on('featuresloadend', () => {
      const features = source.getFeatures();
      features.forEach((feature) => {
        feature.getGeometry()?.transform('EPSG:4326', 'EPSG:3857');
      });
    });
  }

  return layer;
}