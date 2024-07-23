import { create } from "zustand";

export type Position = {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string | null;
  isLoading: boolean;
};

type UseLocationStore = {
  position: Position;
  address: string;
  setPosition: (position: Partial<Position>) => void;
  setAddress: (address: string) => void;
};

export const locationStore = create<UseLocationStore>((set) => ({
  position: {
    center: { lat: 37.5556236021213, lng: 126.992199507869 },
    errMsg: null,
    isLoading: true
  },
  setPosition: (newPosition) => {
    return set((state) => ({
      position: { ...state.position, ...newPosition }
    }));
  },
  address: "서울특별시 중구 삼일대로 231",
  setAddress: (address) => set({ address }),
}));
