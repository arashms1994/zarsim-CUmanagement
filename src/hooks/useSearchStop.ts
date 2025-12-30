import { useState, useCallback, useEffect } from "react";
import { config } from "../api/config";
import { useDebounce } from "./useDebounce";
import { getStopList } from "../api/getData";
import { addStopItem } from "../api/addData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSearchStop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const debouncedSetSearchTerm = useDebounce((term: string) => {
    setDebouncedSearchTerm(term);
  }, config.DEBOUNCE_DELAY);

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debouncedSetSearchTerm]);

  const {
    data: allStops = [],
    isLoading: allLoading,
    error: allError,
  } = useQuery({
    queryKey: ["all-stops"],
    queryFn: getStopList,
    staleTime: config.CACHE_STALE_TIME,
  });

  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ["search-stops", debouncedSearchTerm],
    queryFn: () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 1)
        return allStops;
      return allStops.filter(
        (stop) =>
          stop.Title.toLowerCase().includes(
            debouncedSearchTerm.toLowerCase()
          ) ||
          (stop.Code &&
            stop.Code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    },
    enabled: true,
    staleTime: config.CACHE_STALE_TIME,
  });

  const addMutation = useMutation({
    mutationFn: ({ title, code }: { title: string; code?: string }) =>
      addStopItem(title, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-stops"] });
    },
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleAdd = useCallback(
    async (title: string, code?: string) => {
      return await addMutation.mutateAsync({ title, code });
    },
    [addMutation]
  );

  return {
    searchResults,
    isLoading: searchLoading || allLoading,
    error: searchError || allError,
    handleSearch,
    clearSearch,
    searchTerm,
    handleAdd,
    isAdding: addMutation.isPending,
    addError: addMutation.error,
  };
};
