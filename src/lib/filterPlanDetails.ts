import type { IPrintTajmiListItem } from "../types/type";

export function filterPlanDetails(
  planDetails: IPrintTajmiListItem[],
  selectedStage?: string,
  selectedColor?: string,
  uniqueColors: string[] = []
): IPrintTajmiListItem[] {
  if (!planDetails || planDetails.length === 0) return [];
  if (!selectedStage) return [];

  let items = planDetails.filter((item) => item.marhale === selectedStage);

  if (uniqueColors.length > 0) {
    if (!selectedColor) return [];
    items = items.filter((item) => item.rang === selectedColor);
  }

  return items;
}

