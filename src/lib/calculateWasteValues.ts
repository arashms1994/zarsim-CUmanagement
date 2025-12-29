import type { ISubProductionPlanListItem } from "../types/type";

/**
 * محاسبه مقادیر waste (ضایعات) بر اساس اولویت
 * @param sortedItems - لیست آیتم‌های مرتب شده
 * @param waste - مقدار کل ضایعات
 * @returns یک object که کلید آن نام فیلد و مقدار آن مقدار waste است
 */
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

  // ابتدا همه را صفر می‌کنیم
  sortedItems.forEach((item) => {
    const itemPreInvoiceRowId = item.shomareradiffactor;
    if (itemPreInvoiceRowId) {
      values[`${itemPreInvoiceRowId}.waste`] = "0";
    }
  });

  if (itemsWithPriority.length === 0) {
    // اگر هیچ اولویتی وجود نداشت، به طور مساوی تقسیم می‌کنیم
    const equalValue = (totalWaste / sortedItems.length).toFixed(2);
    sortedItems.forEach((item) => {
      const itemPreInvoiceRowId = item.shomareradiffactor;
      if (itemPreInvoiceRowId) {
        values[`${itemPreInvoiceRowId}.waste`] = equalValue;
      }
    });
  } else {
    // تقسیم بر اساس اولویت
    let remainingWaste = totalWaste;
    const priorityGroups = new Map<number, ISubProductionPlanListItem[]>();

    // گروه‌بندی بر اساس اولویت
    itemsWithPriority.forEach((item) => {
      const priority = parseFloat(item.Priority.trim());
      if (!priorityGroups.has(priority)) {
        priorityGroups.set(priority, []);
      }
      priorityGroups.get(priority)!.push(item);
    });

    // مرتب‌سازی اولویت‌ها
    const sortedPriorities = Array.from(priorityGroups.keys()).sort(
      (a, b) => a - b
    );

    // تقسیم بر اساس اولویت
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

