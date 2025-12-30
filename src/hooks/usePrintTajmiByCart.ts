import { config } from "../api/config";
import { getPrintTajmi } from "../api/getData";
import { useQuery } from "@tanstack/react-query";

export const usePrintTajmiByCart = (cartNumber: string | null | undefined) => {
  const {
    data: planDetails = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["print-tajmi-by-cart", cartNumber],
    queryFn: () => getPrintTajmi(cartNumber!),
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
