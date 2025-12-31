import type { IPrintTajmiListItem } from "../types/type";

export function extractUniqueColors(
  planDetails: IPrintTajmiListItem[],
  selectedStage?: string
): string[] {
  if (!planDetails || planDetails.length === 0) return [];
  if (!selectedStage) return [];

  const colors = planDetails
    .filter((item) => item.marhale === selectedStage)
    .map((item) => item.rang)
    .filter((c): c is string => !!c && c.trim().length > 0);

  return Array.from(new Set(colors));
}

