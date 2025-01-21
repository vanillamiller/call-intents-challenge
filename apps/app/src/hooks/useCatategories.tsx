import { useQuery } from '@tanstack/react-query';
import { Category } from '../types/intent';
import { getCategoryIntents, getCategories } from '../client';
import { useCurrentCategoryStore } from '../store';

const useCategories = () => {
  const currentCategory = useCurrentCategoryStore(
    state => state.currentCategory,
    (prev, curr) => prev?.id === curr?.id
  );
  const setCurrentCategory = useCurrentCategoryStore(state => state.setCurrentCategory);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    data: intents,
    isLoading: isLoadingIntents,
    isError: isErrorIntents,
  } = useQuery({
    queryKey: ['intents', currentCategory?.id],
    queryFn: () => getCategoryIntents(currentCategory?.id),
    enabled: !!currentCategory,
  });

  return {
    categories,
    isLoadingCategories,
    isErrorCategories,
    intents,
    isLoadingIntents,
    isErrorIntents,
    setCurrentCategory,
    currentCategory
  };
};

export default useCategories;
