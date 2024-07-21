import { create } from "zustand";

type Position = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string | null;
  isLoading: boolean;
};

type UseLocationStore = {
  position: Position;
  setPosition: (position: Partial<Position>) => void;
};

export const locationStore = create<UseLocationStore>((set) => ({
  position: { 
    center: { lat: 37.5556236021213, lng: 126.992199507869 }, 
    errMsg: null, 
    isLoading: true 
  },
  setPosition: (newPosition) => set((state) => ({ 
    position: { ...state.position, ...newPosition } 
  }))
}));