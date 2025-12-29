import { useQuery } from "@tanstack/react-query";
import { config } from "../api/config";
import { getSubProductionPlanByNumbers } from "../api/getData";

export const useSubProductionPlanByNumbers = (numbers: string[]) => {
  const sortedNumbers = numbers.length > 0 ? [...numbers].sort().join(",") : "";

  const {
    data: planItems = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["sub-production-plan-by-numbers", sortedNumbers],
    queryFn: () => {
      return getSubProductionPlanByNumbers(numbers);
    },
    enabled: numbers.length > 0,
    staleTime: config.CACHE_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });

  return {
    planItems,
    isLoading: isLoading || isFetching,
    error,
  };
};
