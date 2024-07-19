import { create } from "zustand";

type useLocaStore = {
  position: {
    lat: number;
    lng: number;
  };
  setPosition: (position: { lat: number; lng: number }) => void;
};

export const useLocation = create<useLocaStore>()((set) => ({
  position: { lat: 37.5556236021213, lng: 126.992199507869 },
  setPosition: (position) => set({ position })
}));
