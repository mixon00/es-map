import { Style, Fill, Stroke, Text } from 'ol/style';
import StyleChart from 'ol-ext/style/Chart';
import type { FeatureLike } from 'ol/Feature';
import { CHART_COLORS, DATA_KEYS, getFeatureCentroid } from '@/utils/mapHelpers';

const TEXT_OFFSETS = [-30, -10, 10, 30];

export function createVoivodeshipsStyle(feature: FeatureLike): Style[] {
  const properties = feature.getProperties();
  
  const data = DATA_KEYS.map(key => properties[key] || 0);

  const styles: Style[] = [
    // Polygon borders
    new Style({
      fill: new Fill({
        color: 'rgba(16, 103, 225, 0.1)',
      }),
      stroke: new Stroke({
        color: 'rgba(16, 103, 225, 0.5)',
        width: 2,
      }),
    }),
    // Chart at centroid
    new Style({
      geometry: getFeatureCentroid,
      image: new StyleChart({
        type: 'bar',
        radius: 30,
        data,
        colors: CHART_COLORS,
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
      }),
    }),
  ];

  // Add text labels for each data point
  DATA_KEYS.forEach((key, index) => {
    styles.push(
      new Style({
        geometry: getFeatureCentroid,
        text: new Text({
          text: String(properties[key] || 0),
          offsetX: TEXT_OFFSETS[index],
          offsetY: 40,
          font: '12px sans-serif',
          fill: new Fill({
            color: CHART_COLORS[index],
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      })
    );
  });

  return styles;
}