import { Polygon, MultiPolygon, Point } from 'ol/geom';
import { getCenter } from 'ol/extent';
import type { FeatureLike } from 'ol/Feature';
import { fromLonLat } from 'ol/proj';

export const CHART_COLORS = [
  'rgba(31, 119, 180, 1)',
  'rgba(255, 127, 14, 1)',
  'rgba(44, 160, 44, 1)',
  'rgba(214, 39, 40, 1)',
];

export const ROAD_COLORS = [
  'rgba(255, 255, 0, 1)',
  'rgba(255, 136, 0, 1)',
  'rgba(136, 136, 136, 1)',
];

export const OVERLAY_COLOR = 'rgba(255, 255, 255, 1)';

export const STROKE_COLOR = 'rgba(255, 255, 255, 1)';

export const VOIVODESHIPS_COLORS = ['rgba(16, 103, 225, 0.1)', 'rgba(16, 103, 225, 0.5)'];

export const DATA_KEYS = ['dane1', 'dane2', 'dane3', 'dane4'] as const;

export function getFeatureCentroid(feature: FeatureLike) {
  const geom = feature.getGeometry();
  if (geom instanceof Polygon) {
    return geom.getInteriorPoint();
  } else if (geom instanceof MultiPolygon) {
    const extent = geom.getExtent();
    const center = getCenter(extent);
    return new Point(center);
  }
  return undefined;
}

export function createMaskPolygon(polandCoordinates: number[][], extent: number[]) {
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
    .map(([lon, lat]) => {
      const [x, y] = fromLonLat([lon, lat]);
      return [x, y];
    })
    .reverse();

  return new Polygon([outerRing, polandRing]);
}
