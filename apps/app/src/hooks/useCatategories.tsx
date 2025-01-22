import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/intent";
import { getCategoryIntents, getCategories } from "../client";
import { useCurrentCategoryStore } from "../store";
import { useMemo } from "react";

const useCategories = () => {
  const currentCategoryId = useCurrentCategoryStore(
    state => state.currentCategoryId,
    (prev, curr) => prev === curr
  );
  const setCurrentCategoryId = useCurrentCategoryStore(state => state.setCurrentCategoryId);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const orderedCategories = useMemo(() => {
    const ordered = categories?.sort((a, b) => b.intentCount - a.intentCount) ?? [];
    setCurrentCategoryId(ordered[0]?.id);
    return ordered;
  }, [categories]);

  const {
    data: intents,
    isLoading: isLoadingIntents,
    isError: isErrorIntents,
  } = useQuery({
    queryKey: ["intents", currentCategoryId],
    queryFn: () => getCategoryIntents(currentCategoryId),
    enabled: !!currentCategoryId,
  });

  return {
    orderedCategories,
    isLoadingCategories,
    isErrorCategories,
    intents,
    isLoadingIntents,
    isErrorIntents,
    setCurrentCategoryId,
    currentCategoryId,
  };
};

export default useCategories;
