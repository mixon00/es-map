import { MapView } from '@/components/MapVew/MapView';
import { Suspense } from 'react';
import { Loader } from './Loader';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <MapView />
    </Suspense>
  );
}

export default App;
