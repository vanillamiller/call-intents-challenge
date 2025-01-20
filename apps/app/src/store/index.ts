import { createWithEqualityFn as create } from 'zustand/traditional'
import { Category } from '../types/intent';

interface CurrentCategoryState {
    currentCategory?: Category;
    setCurrentCategory: (category: Category) => void; // Fixed function name in interface
}

export const useCurrentCategoryStore = create<CurrentCategoryState>()((set) => ({
    currentCategory: undefined, // Match the interface
    setCurrentCategory: (category: Category) => set({ currentCategory: category }), // Simplified set
}))