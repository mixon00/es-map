import { MapView } from '@/components/MapVew/MapView';

function App() {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <h2 className="text-2xl font-bold text-center">ES Map</h2>
      <MapView />
    </div>
  );
}

export default App;
