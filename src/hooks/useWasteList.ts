import { useQuery } from "@tanstack/react-query";
import { getWasteList } from "../api/getData";
import { config } from "../api/config";

export const useWasteList = () => {
  const {
    data: wasteList = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["waste-list"],
    queryFn: getWasteList,
    staleTime: config.CACHE_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });

  return {
    wasteList,
    isLoading: isLoading || isFetching,
    error,
  };
};
