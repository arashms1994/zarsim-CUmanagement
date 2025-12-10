import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchDarkhastMavadPlans } from "../api/getData";
import { config } from "../api/config";
import { useDebounce } from "./useDebounce";

export const useSearchPlans = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearchTerm = useDebounce((term: string) => {
    setDebouncedSearchTerm(term);
  }, config.DEBOUNCE_DELAY);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      debouncedSetSearchTerm(searchTerm);
    } else {
      setDebouncedSearchTerm("");
    }
  }, [searchTerm, debouncedSetSearchTerm]);

  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search-plans", debouncedSearchTerm],
    queryFn: () => searchDarkhastMavadPlans(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2,
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
    isLoading,
    error,
    handleSearch,
    clearSearch,
    searchTerm,
  };
};
