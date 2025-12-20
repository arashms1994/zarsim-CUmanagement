import { useCallback, useEffect, useState } from "react";
import { config } from "../api/config";
import { getDevice } from "../api/getData";
import { useDebounce } from "./useDebounce";
import { useQuery } from "@tanstack/react-query";

export const useSearchDevice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearchTerm = useDebounce((term: string) => {
    setDebouncedSearchTerm(term);
  }, config.DEBOUNCE_DELAY);

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debouncedSetSearchTerm]);

  const {
    data: allDevices = [],
    isLoading: allLoading,
    error: allError,
  } = useQuery({
    queryKey: ["all-devices"],
    queryFn: getDevice,
    staleTime: config.CACHE_STALE_TIME,
  });

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-devices", debouncedSearchTerm],
    queryFn: () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 1)
        return allDevices;
      return allDevices.filter((device) =>
        device.Title.toLocaleLowerCase().includes(
          debouncedSearchTerm.toLocaleLowerCase()
        )
      );
    },
    enabled: true,
    staleTime: config.CACHE_STALE_TIME,
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchResults,
    allDevices,
    isLoading: searchLoading || allLoading,
    error: searchError || allError,
    handleSearch,
    clearSearch,
    searchTerm,
  };
};
