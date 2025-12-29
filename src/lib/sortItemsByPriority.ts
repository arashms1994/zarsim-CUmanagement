import type { ISubProductionPlanListItem } from "../types/type";

export function sortItemsByPriority(
  items: ISubProductionPlanListItem[]
): ISubProductionPlanListItem[] {
  return [...items].sort((a, b) => {
    const priorityA =
      a.Priority && a.Priority.trim()
        ? parseFloat(a.Priority.trim())
        : Infinity;
    const priorityB =
      b.Priority && b.Priority.trim()
        ? parseFloat(b.Priority.trim())
        : Infinity;

    if (isNaN(priorityA) && isNaN(priorityB)) return 0;
    if (isNaN(priorityA)) return 1;
    if (isNaN(priorityB)) return -1;

    return priorityA - priorityB;
  });
}
