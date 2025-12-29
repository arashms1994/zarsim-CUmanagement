import { useQuery } from "@tanstack/react-query";
import { getProductMaterialPerStage } from "../api/getData";
import type { IProductMaterialPerStage } from "../types/type";

export function useMaterialPerStageData(tarhetolid?: string) {
  return useQuery<IProductMaterialPerStage[]>({
    queryKey: ["product-material-per-stage", tarhetolid],
    queryFn: () => getProductMaterialPerStage(tarhetolid),
    enabled: !!tarhetolid,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
