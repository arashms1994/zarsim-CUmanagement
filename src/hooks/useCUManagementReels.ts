import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCUManagementReels } from "../api/getData";
import type { ICUManagementReelsListItem, IReelItem } from "../types/type";

function mapToReelItem(item: ICUManagementReelsListItem): IReelItem {
  return {
    reelId: item.ID ?? 0,
    reelTitle: item.reelNumber ?? "",
    weight: item.productWeight ?? "",
    amount: item.productAmount ?? "",
    wasteWeight: item.wasteWeight ?? "",
    wasteCategory: item.wasteCategory ?? "",
  };
}

export function useCUManagementReels(
  productionPlanNumber: string | undefined,
  selectedStage: string | undefined
) {
  const {
    data: reelsList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cu-management-reels", productionPlanNumber, selectedStage],
    queryFn: () =>
      getCUManagementReels(productionPlanNumber!, selectedStage!),
    enabled:
      !!productionPlanNumber?.trim() && !!selectedStage?.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { entranceReels, exitReels } = useMemo(() => {
    const entrance: IReelItem[] = [];
    const exit: IReelItem[] = [];
    const raw = reelsList as ICUManagementReelsListItem[];
    for (const item of raw) {
      const reel = mapToReelItem(item);
      const status = (item.status ?? "").toString().trim();
      if (status === "ورودی") {
        entrance.push(reel);
      } else if (status === "خروجی") {
        exit.push(reel);
      }
    }
    return { entranceReels: entrance, exitReels: exit };
  }, [reelsList]);

  return {
    entranceReels,
    exitReels,
    isLoading,
    error,
  };
}
