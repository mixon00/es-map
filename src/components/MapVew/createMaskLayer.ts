import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Style, Fill } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import { MultiPolygon, Polygon } from 'ol/geom';
import { buffer as extentBuffer } from 'ol/extent';
import { OVERLAY_COLOR } from '@/utils/mapHelpers';

export function createMaskLayer() {
  const source = new VectorSource({
    url: '/data/poland.geojson',
    format: new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    }),
  });

  source.on('featuresloadend', () => {
    const features = source.getFeatures();
    if (features.length > 0) {
      const polandFeature = features[0];
      const polandGeometry = polandFeature.getGeometry();

      if (polandGeometry && polandGeometry.getType() === 'MultiPolygon') {
        const multiPolygon = polandGeometry as MultiPolygon;
        
        const polandExtent = polandGeometry.getExtent();
        const bufferedExtent = extentBuffer(polandExtent, 100000);

        const outerRing = [
          [bufferedExtent[0], bufferedExtent[1]],
          [bufferedExtent[2], bufferedExtent[1]],
          [bufferedExtent[2], bufferedExtent[3]],
          [bufferedExtent[0], bufferedExtent[3]],
          [bufferedExtent[0], bufferedExtent[1]],
        ];

        const polandCoords = multiPolygon.getCoordinates()[0];
        const innerRing = polandCoords[0];

        const maskPolygon = new Polygon([outerRing, innerRing]);

        source.clear();
        source.addFeature(
          new Feature({
            geometry: maskPolygon,
          })
        );
      }
    }
  });

  return new VectorImageLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: OVERLAY_COLOR,
      }),
    }),
    zIndex: 1000,
    renderBuffer: 500,
    declutter: false,
  });
}