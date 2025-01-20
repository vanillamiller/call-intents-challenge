import {create} from "zustand"

interface CurrentCategoryState {
    currentCategoryId: number
    setCurrentCategoryId: (categoryId: number) => void
}

export const useCurrentCategoryStore = create<CurrentCategoryState>((set) => ({
    currentCategoryId: 0,
    setCurrentCategoryId: (categoryId: number) => set({ currentCategoryId: categoryId }),
}))
