import { useQuery } from "@tanstack/react-query";
import { getDarkhastMavadListByPlan } from "../api/getData";
import { config } from "../api/config";

export const usePlanDetails = (planItem: string) => {
  const {
    data: planDetails = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["darkhast-mavad-plan", planItem],
    queryFn: () => getDarkhastMavadListByPlan(planItem),
    enabled: !!planItem && planItem.trim().length > 0,
    staleTime: config.CACHE_STALE_TIME,
  });

  return {
    planDetails,
    isLoading,
    error,
  };
};
