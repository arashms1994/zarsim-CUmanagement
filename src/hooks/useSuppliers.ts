import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../api/getData";

export const useSuppliers = () => {
  const {
    data: suppliers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
    staleTime: 10 * 60 * 1000,
  });

  return {
    suppliers,
    isLoading,
    error,
  };
};
