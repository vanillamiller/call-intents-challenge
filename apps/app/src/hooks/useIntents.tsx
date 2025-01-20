import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/intent";
import { getCategoryIntents, getCategories } from "../client";
import { useCurrentCategoryStore } from "../store";

const useIntents = () => {

    const { currentCategoryId } = useCurrentCategoryStore();
    const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const { data: intents, isLoading: isLoadingIntents, isError: isErrorIntents } = useQuery({
        queryKey: ['intents', currentCategoryId],
        queryFn: () => getCategoryIntents(currentCategoryId)
    });
    
    return {
        categories,
        isLoadingCategories,
        isErrorCategories,
        intents,
        isLoadingIntents,
        isErrorIntents
    }
}

export default useIntents