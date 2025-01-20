import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/intent";
import { getCategoryIntents, getCategories } from "../client";
import { useCurrentCategoryStore } from "../store";

const useIntents = () => {

    const currentCategoryId = useCurrentCategoryStore((state) => state.currentCategoryId);
    const setCurrentCategoryId = useCurrentCategoryStore((state) => state.setCurrentCategoryId);

    const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const { data: intents, isLoading: isLoadingIntents, isError: isErrorIntents } = useQuery({
        queryKey: ['intents', currentCategoryId],
        queryFn: () => getCategoryIntents(currentCategoryId),
        enabled: !!currentCategoryId
    });

    return {
        categories,
        isLoadingCategories,
        isErrorCategories,
        intents,
        isLoadingIntents,
        isErrorIntents,
        setCurrentCategoryId
    }
}

export default useIntents;