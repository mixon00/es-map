import { Polygon, MultiPolygon, Point } from 'ol/geom';
import { getCenter } from 'ol/extent';
import type { FeatureLike } from 'ol/Feature';
import { fromLonLat } from 'ol/proj';

export const CHART_COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'];

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
