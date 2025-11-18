# ES-MAP

Interactive map application for visualizing Poland data with OpenLayers.

## Contents
1. [Installation](#installation)
    - [Using NPM](#using-npm)
    - [Using Docker](#using-docker)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Development Notes](#development-notes)
    - [Adding New Layers](#adding-new-layers)
    - [Custom Projections](#custom-projections)
    - [Styling Best Practices](#styling-best-practices)
    - [Performance Tips](#performance-tips)
    - [State Management](#state-management-1)
    - [Troubleshooting](#troubleshooting)
    - [Code Organization](#code-organization)
    - [Adding shadcn/ui Components](#adding-shadcnui-components)

## Installation

#### Using NPM

Clone repository:

```bash
git clone https://github.com/mixon00/es-map.git
```

Install dependencies:

```bash
npm install
```

Run development environment:

```bash
npm run dev
```

Build:

```bash
npm run build
```

#### Using Docker

Development:
```bash
docker-compose --profile dev up -d app-dev
```

Production:
```bash
docker-compose up -d
```

## Project Structure

```
src/
├── components/
│   ├── MapVew/
│   │   ├── MapView.tsx                    # Main map component
│   │   ├── createLiniesLayer.ts           # Roads layer
│   │   ├── createMaskLayer.ts             # Mask layer
│   │   ├── createVoivodeshipsLayer.ts     # Voivodeships layer
│   │   └── createVoivodeshipsStyle.ts     # Chart styling for voivodeships
│   ├── ui/                                # shadcn/ui components
│   ├── App.tsx                            # Root component
│   ├── LayerOptions.tsx                   # Layer visibility controls
│   ├── Loader.tsx                         # Loading spinner
│   └── Tooltip.tsx                        # Tooltip wrapper
├── stores/
│   └── options.store.ts                   # Zustand store
├── utils/
│   ├── mapHelpers.ts                      # Map utilities
│   └── projections.ts                     # Proj4 projection definitions (EPSG:2180)
├── lib/
│   └── utils.ts                           # Utility functions
├── global.css                             # Tailwind + shadcn styles
└── main.tsx                               # App entry point

public/
└── data/
    ├── poland.geojson                     # Poland borders
    ├── wojewodztwa.geojson                # Voivodeships with data
    └── linie.geojson                      # Roads data
```

## Tech Stack

### Core
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vite.dev/)**

### Map
- **[OpenLayers](https://openlayers.org/)** - Interactive maps library
- **[ol-ext](https://viglino.github.io/ol-ext/)** - Chart styles extension for OpenLayers
- **[proj4](https://proj4.org/)** - Coordinate system transformations (EPSG:2180 → EPSG:3857)

### UI & Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[lucide-react](https://lucide.dev/)** - Icon library

### State Management
- **[Zustand](https://zustand.docs.pmnd.rs/)** - Lightweight state management

### Development
- **[Docker](https://www.docker.com/)** & **[Docker Compose](https://docs.docker.com/compose/)** - Containerization
- **[ESLint](https://eslint.org/)** - Linting

## Development Notes

### Adding New Layers

1. **Create layer factory function** in `src/components/MapVew/`:

```typescript
// createMyLayer.ts
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

export function createMyLayer() {
  return new VectorLayer({
    source: new VectorSource({
      url: '/data/my-data.geojson',
      format: new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    }),
    zIndex: 1500,
  });
}
```

2. **Add to MapView.tsx**:

```typescript
const myLayer = useMemo(() => createMyLayer(), []);
// Add to layers array
```

3. **Place GeoJSON file** in `public/data/`

### Custom Projections

For non-standard coordinate systems (like EPSG:2180):

1. **Add projection definition** in `src/utils/projections.ts`:

```typescript
proj4.defs('EPSG:2180', '+proj=tmerc +lat_0=0 +lon_0=19...');
register(proj4);
```

2. **Transform in layer** on `featuresloadend`:

```typescript
source.on('featuresloadend', () => {
  features.forEach(f => f.getGeometry()?.transform('EPSG:2180', 'EPSG:3857'));
});
```

### Styling Best Practices

**❌ Don't create styles in style function:**

```typescript
style: (feature) => {
  return new Style({ /* created 1000s of times! */ });
}
```

**✅ Pre-create styles:**

```typescript
const styles = {
  default: new Style({ /* created once */ }),
};

style: (feature) => styles.default;
```

### Performance Tips

1. **Use VectorImageLayer** for many features (>1000):

```typescript
import VectorImageLayer from 'ol/layer/VectorImage';
```

2. **Memoize layers** to prevent recreation:

```typescript
const layer = useMemo(() => createLayer(), []);
```

3. **Use layer visibility** instead of recreating:

```typescript
layer.setVisible(false); // Fast
// vs recreating map (slow)
```

### State Management

**Adding new options:**

1. **Update store** (`src/stores/options.store.ts`):

```typescript
interface OptionsStore {
  showMyFeature: boolean;
  toggleMyFeature: () => void;
}
```

2. **Add toggle in LayerOptions.tsx**

3. **Use in MapView.tsx**:

```typescript
const showMyFeature = useOptions(state => state.showMyFeature);

useEffect(() => {
  myLayer.setVisible(showMyFeature);
}, [showMyFeature, myLayer]);
```

### Troubleshooting

**Lines not displaying:**
- Check if proj4 is installed and projection registered
- Verify GeoJSON coordinate system matches `dataProjection`
- Log feature extents to check if they're in correct location

**Performance issues:**
- Check if styles are pre-created (not in style function)
- Use VectorImageLayer for large datasets
- Implement zoom-based rendering
- Reduce `renderBuffer` value

**Map not loading:**
- Verify GeoJSON files exist in `public/data/`
- Check browser console for errors
- Ensure `#map` div has explicit height

### Code Organization

```
Layer Creation:
  createXxxLayer.ts    → Layer + source configuration
  createXxxStyle.ts    → Styling logic (if complex)

Utilities:
  mapHelpers.ts        → Reusable map functions
  projections.ts       → Proj4 definitions

Components:
  MapView.tsx          → Main map logic
  LayerOptions.tsx     → UI controls
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add button
```

Components go to `src/components/ui/` automatically.
