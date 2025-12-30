import type { ISubProductionPlanListItem } from "../types/type";

export function calculateWasteValues(
  sortedItems: ISubProductionPlanListItem[],
  waste: string
): Record<string, string> {
  const totalWaste = parseFloat(waste);
  if (isNaN(totalWaste) || totalWaste <= 0) {
    return {};
  }

  if (sortedItems.length === 0) {
    return {};
  }

  const values: Record<string, string> = {};

  const itemsWithPriority = sortedItems.filter(
    (item) =>
      item.Priority &&
      item.Priority.trim() &&
      !isNaN(parseFloat(item.Priority.trim()))
  );

  sortedItems.forEach((item) => {
    const itemPreInvoiceRowId = item.shomareradiffactor;
    if (itemPreInvoiceRowId) {
      values[`${itemPreInvoiceRowId}.waste`] = "0";
    }
  });

  if (itemsWithPriority.length === 0) {
    const equalValue = (totalWaste / sortedItems.length).toFixed(2);
    sortedItems.forEach((item) => {
      const itemPreInvoiceRowId = item.shomareradiffactor;
      if (itemPreInvoiceRowId) {
        values[`${itemPreInvoiceRowId}.waste`] = equalValue;
      }
    });
  } else {
    let remainingWaste = totalWaste;
    const priorityGroups = new Map<number, ISubProductionPlanListItem[]>();

    itemsWithPriority.forEach((item) => {
      const priority = parseFloat(item.Priority.trim());
      if (!priorityGroups.has(priority)) {
        priorityGroups.set(priority, []);
      }
      priorityGroups.get(priority)!.push(item);
    });

    const sortedPriorities = Array.from(priorityGroups.keys()).sort(
      (a, b) => a - b
    );

    for (const priority of sortedPriorities) {
      const itemsInPriority = priorityGroups.get(priority)!;

      for (const item of itemsInPriority) {
        if (remainingWaste <= 0) {
          break;
        }

        const itemPreInvoiceRowId = item.shomareradiffactor;
        if (!itemPreInvoiceRowId) {
          continue;
        }

        const meghdar = item.meghdarkolesefaresh
          ? parseFloat(item.meghdarkolesefaresh.toString())
          : 0;

        const allocated = Math.min(meghdar, remainingWaste);

        if (allocated > 0) {
          values[`${itemPreInvoiceRowId}.waste`] = allocated.toFixed(2);
          remainingWaste -= allocated;
        }
      }

      if (remainingWaste <= 0) {
        break;
      }
    }
  }

  return values;
}
