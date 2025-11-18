import { ChartColumnBig, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip } from '@/components/Tooltip';
import { useOptions } from '@/stores/options.store';

export const LayerOptions = () => {
  const showLines = useOptions((state) => state.showLines);
  const showCharts = useOptions((state) => state.showCharts);
  const toggleLines = useOptions((state) => state.toggleLines);
  const toggleCharts = useOptions((state) => state.toggleCharts);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-6">
      <ButtonGroup orientation="vertical" aria-label="Layer controls" className="h-fit shadow-2xl">
        <Tooltip content={showLines ? 'Ukryj Drogi' : 'Pokaż Drogi'}>
          <Button variant={showLines ? 'outline' : 'secondary'} size="icon" onClick={toggleLines}>
            <Route />
          </Button>
        </Tooltip>
        <Tooltip content={showCharts ? 'Ukryj Statystyki' : 'Pokaż Statystyki'}>
          <Button variant={showCharts ? 'outline' : 'secondary'} size="icon" onClick={toggleCharts}>
            <ChartColumnBig />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};
