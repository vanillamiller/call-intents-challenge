import { createWithEqualityFn as create } from 'zustand/traditional'

interface CurrentCategoryState {
    currentCategoryId?: number;
    setCurrentCategoryId: (categoryId: number) => void;
}

export const useCurrentCategoryStore = create<CurrentCategoryState>((set) => ({
    currentCategoryId: 0,
    setCurrentCategoryId: (categoryId: number) => set({ currentCategoryId: categoryId }),
}))
