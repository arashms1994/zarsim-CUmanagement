import { config } from "../api/config";
import { useQuery } from "@tanstack/react-query";
import { getSubProductionPlanByCart } from "../api/getData";

export const useSubProductionPlanByCart = (
  cartNumber: string | null | undefined
) => {
  const {
    data: planDetails = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sub-production-plan-by-cart", cartNumber],
    queryFn: () => getSubProductionPlanByCart(cartNumber!),
    enabled: !!cartNumber && cartNumber.trim().length > 0,
    staleTime: config.CACHE_STALE_TIME,
    refetchInterval: 10000,
  });

  return {
    planDetails,
    isLoading,
    error,
  };
};
