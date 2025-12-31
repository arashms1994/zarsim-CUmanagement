import type { IPrintTajmiListItem } from "../types/type";

export function extractUniqueStages(
  planDetails: IPrintTajmiListItem[]
): string[] {
  if (!planDetails || planDetails.length === 0) return [];
  
  const stages = planDetails
    .map((item) => item.marhale)
    .filter((s): s is string => !!s && s.trim().length > 0);

  return Array.from(new Set(stages));
}

