import { Style, Fill, Stroke, Text } from 'ol/style';
import StyleChart from 'ol-ext/style/Chart';
import type { FeatureLike } from 'ol/Feature';
import { CHART_COLORS, DATA_KEYS, getFeatureCentroid, STROKE_COLOR, VOIVODESHIPS_COLORS } from '@/utils/mapHelpers';

const TEXT_OFFSETS = [-30, -10, 10, 30];

export function createVoivodeshipsStyle(feature: FeatureLike): Style[] {
  const properties = feature.getProperties();
  
  const data = DATA_KEYS.map(key => properties[key] || 0);

  const styles: Style[] = [
    new Style({
      fill: new Fill({
        color: VOIVODESHIPS_COLORS[0],
      }),
      stroke: new Stroke({
        color: VOIVODESHIPS_COLORS[1],
        width: 2,
      }),
    }),

    new Style({
      geometry: getFeatureCentroid,
      image: new StyleChart({
        type: 'bar',
        radius: 30,
        data,
        colors: CHART_COLORS,
        stroke: new Stroke({
          color: STROKE_COLOR,
          width: 2,
        }),
      }),
    }),
  ];

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
            color: STROKE_COLOR,
            width: 2,
          }),
        }),
      })
    );
  });

  return styles;
}