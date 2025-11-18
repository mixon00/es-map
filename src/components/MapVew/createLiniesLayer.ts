import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke } from 'ol/style';
import { ROAD_COLORS } from '@/utils/mapHelpers';

const styles = {
  glowna: new Style({
    stroke: new Stroke({ color: ROAD_COLORS[0], width: 3 }),
  }),
  lokalna: new Style({
    stroke: new Stroke({ color: ROAD_COLORS[1], width: 2 }),
  }),
  wewnetrzna: new Style({
    stroke: new Stroke({ color: ROAD_COLORS[2], width: 1 }),
  }),
};

export function createLiniesLayer() {
  const layer = new VectorImageLayer({
    source: new VectorSource({
      url: '/data/linie.geojson',
      format: new GeoJSON({
        dataProjection: 'EPSG:2180',
        featureProjection: 'EPSG:3857',
      }),
    }),
    style: (feature) => {
      const roadClass = feature.get('KLASADROGI') || '';

      if (roadClass.includes('główna')) return styles.glowna;
      if (roadClass.includes('lokalna')) return styles.lokalna;
      if (roadClass.includes('wewnętrzna')) return styles.wewnetrzna;
    },
    minZoom: 7,
    renderBuffer: 100,
    declutter: true,
    zIndex: 2500,
  });

  return layer;
}
