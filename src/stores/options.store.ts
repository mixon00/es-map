import { create } from 'zustand';

export interface OptionsStore {
  showLines: boolean;
  showCharts: boolean;
  toggleLines: () => void;
  toggleCharts: () => void;
}

export const useOptions = create<OptionsStore>((set) => ({
  showLines: true,
  showCharts: true,
  toggleLines: () => set((state) => ({ showLines: !state.showLines })),
  toggleCharts: () => set((state) => ({ showCharts: !state.showCharts })),
}));
