let polandDataCache: Promise<number[][]> | null = null;

export function fetchPolandData() {
  if (!polandDataCache) {
    polandDataCache = fetch('/data/poland.geojson').then((res) => res.json());
  }
  return polandDataCache;
}