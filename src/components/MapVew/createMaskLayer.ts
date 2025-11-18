import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Style, Fill } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import { MultiPolygon, Polygon } from 'ol/geom';
import { buffer as extentBuffer } from 'ol/extent';

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
        
        // Get Poland's extent and add ~500km buffer
        const polandExtent = polandGeometry.getExtent();
        const bufferedExtent = extentBuffer(polandExtent, 100000); // 500km in meters

        // Create outer rectangle
        const outerRing = [
          [bufferedExtent[0], bufferedExtent[1]], // bottom-left
          [bufferedExtent[2], bufferedExtent[1]], // bottom-right
          [bufferedExtent[2], bufferedExtent[3]], // top-right
          [bufferedExtent[0], bufferedExtent[3]], // top-left
          [bufferedExtent[0], bufferedExtent[1]], // close
        ];

        // Get Poland coordinates as inner ring (hole)
        const polandCoords = multiPolygon.getCoordinates()[0]; // First polygon
        const innerRing = polandCoords[0]; // First ring of the polygon

        // Create polygon with hole: outer ring + inner ring (Poland as hole)
        const maskPolygon = new Polygon([outerRing, innerRing]);

        // Replace the source with the mask feature
        source.clear();
        source.addFeature(
          new Feature({
            geometry: maskPolygon,
          })
        );
      }
    }
  });

  return new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
      }),
    }),
    zIndex: 1000,
    updateWhileAnimating: false,
    updateWhileInteracting: false,
    renderBuffer: 500,
    declutter: false,
  });
}