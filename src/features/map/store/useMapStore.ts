import { create } from 'zustand';
import { MapState } from '../types/mapType';

const useMapStore = create<MapState>((set) => ({
  center: [106.778419, -6.402905],
  zoom: 12,
  centroid: [0, 0],
  setMap: (map) => set({ map }),
  setCentroid: (centroid) => set({ centroid }),
}));

export default useMapStore;
