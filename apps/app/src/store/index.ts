import { createWithEqualityFn as create } from "zustand/traditional";

interface CurrentCategoryState {
  currentCategoryId?: number;
  setCurrentCategoryId: (id: number) => void;
}

export const useCurrentCategoryStore = create<CurrentCategoryState>()(set => ({
  currentCategoryId: undefined,
  setCurrentCategoryId: (id: number) => set({ currentCategoryId: id }),
}));
