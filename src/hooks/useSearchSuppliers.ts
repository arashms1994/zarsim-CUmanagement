import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../api/getData";
import { config } from "../api/config";
import { useDebounce } from "./useDebounce";

export const useSearchSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearchTerm = useDebounce((term: string) => {
    setDebouncedSearchTerm(term);
  }, config.DEBOUNCE_DELAY);

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debouncedSetSearchTerm]);

  const {
    data: allSuppliers = [],
    isLoading: allLoading,
    error: allError,
  } = useQuery({
    queryKey: ["all-suppliers"],
    queryFn: getSuppliers,
    staleTime: config.CACHE_STALE_TIME,
  });

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-suppliers", debouncedSearchTerm],
    queryFn: () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 1)
        return allSuppliers;
      return allSuppliers.filter((supplier) =>
        supplier.Supplier.toLowerCase().includes(
          debouncedSearchTerm.toLowerCase()
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
    isLoading: searchLoading || allLoading,
    error: searchError || allError,
    handleSearch,
    clearSearch,
    searchTerm,
  };
};
