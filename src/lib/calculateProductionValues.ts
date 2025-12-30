import type { ISubProductionPlanListItem } from "../types/type";

export function calculateProductionValues(
  sortedItems: ISubProductionPlanListItem[],
  actualAmountProduction: string
): Record<string, string> {
  const totalProduction = parseFloat(actualAmountProduction);
  if (isNaN(totalProduction) || totalProduction <= 0) {
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
      values[`${itemPreInvoiceRowId}.actualProduction`] = "0";
    }
  });

  if (itemsWithPriority.length === 0) {
    const equalValue = (totalProduction / sortedItems.length).toFixed(2);
    sortedItems.forEach((item) => {
      const itemPreInvoiceRowId = item.shomareradiffactor;
      if (itemPreInvoiceRowId) {
        values[`${itemPreInvoiceRowId}.actualProduction`] = equalValue;
      }
    });
  } else {
    let remainingProduction = totalProduction;
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
        if (remainingProduction <= 0) {
          break;
        }

        const itemPreInvoiceRowId = item.shomareradiffactor;
        if (!itemPreInvoiceRowId) {
          continue;
        }

        const meghdar = item.meghdarkolesefaresh
          ? parseFloat(item.meghdarkolesefaresh.toString())
          : 0;

        const allocated = Math.min(meghdar, remainingProduction);

        if (allocated > 0) {
          values[`${itemPreInvoiceRowId}.actualProduction`] =
            allocated.toFixed(2);
          remainingProduction -= allocated;
        }
      }

      if (remainingProduction <= 0) {
        break;
      }
    }
  }

  return values;
}
