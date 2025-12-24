import { useQuery } from "@tanstack/react-query";
import { getProductMaterialCuTicu } from "../api/getData";
import type { IProductMaterialCuTicu } from "../types/type";

export function useMaterialData() {
  return useQuery<IProductMaterialCuTicu[]>({
    queryKey: ["product-material-cu-ticu"],
    queryFn: getProductMaterialCuTicu,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
