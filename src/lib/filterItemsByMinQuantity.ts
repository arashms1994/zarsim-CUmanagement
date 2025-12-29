import type { ISubProductionPlanListItem } from "../types/type";

export function filterItemsByMinQuantity(
  items: ISubProductionPlanListItem[],
  minQuantity: number = 10
): ISubProductionPlanListItem[] {
  return items.filter((item) => {
    const meghdar = item.meghdarkolesefaresh
      ? parseFloat(item.meghdarkolesefaresh.toString())
      : 0;
    return meghdar >= minQuantity;
  });
}
