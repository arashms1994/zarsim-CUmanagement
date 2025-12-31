import { config } from "../api/config";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getData";

export const useProducts = () => {
  const {
    data: products = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return getProducts();
    },
    staleTime: config.CACHE_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });

  return {
    products,
    isLoading: isLoading || isFetching,
    error,
  };
};

