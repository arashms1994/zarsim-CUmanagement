import type { ISubProductionPlanListItem } from "../types/type";

export function extractUniqueTarhetolids(
  items: ISubProductionPlanListItem[]
): string[] {
  const tarhetolids = items
    .map((item) => item.tarhetolid)
    .filter((t): t is string => !!t && t.trim().length > 0);
  return Array.from(new Set(tarhetolids));
}
