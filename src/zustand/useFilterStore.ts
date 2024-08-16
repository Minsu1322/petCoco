import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Filters = {
  gender: string | null;
  age: string | null;
  date_time: string | undefined;
  male_female: string | null;
  weight: string | null;
  regions: string | null;
  times: string | null;
  neutered: string | null;
};

type FilterStore = {
  filters: Filters;
  setFilters:  (filters: Filters | ((prevFilters: Filters) => Filters)) => void;
};

const initialFilters: Filters = {
  gender: null,
  age: null,
  date_time: undefined,
  male_female: null,
  weight: null,
  regions: null,
  times: null,
  neutered: null,
};

export const useFilterStore = create(persist<FilterStore>(
  (set) => ({
    filters: initialFilters,
    setFilters: (newFilters) => set((state) => ({
      filters: typeof newFilters === 'function' ? newFilters(state.filters) : newFilters
    })),
  }),
    {
      name: 'filter-storage',
    }
  )
);
