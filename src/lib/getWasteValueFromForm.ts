import { calculateWasteValues } from "./calculateWasteValues";
import type { ISubProductionPlanListItem } from "../types/type";

export function getWasteValueFromForm(
  control: any,
  itemPreInvoiceRowId: string,
  formValues: Record<string, any>,
  formValuesInternal: Record<string, any>,
  sortedFilteredItems: ISubProductionPlanListItem[],
  waste: string
): string {
  const wasteField = `${itemPreInvoiceRowId}.waste`;
  const wasteValuesForItem = waste
    ? calculateWasteValues(sortedFilteredItems, waste)
    : {};
  let wasteValue =
    formValues[wasteField] ||
    formValuesInternal[wasteField] ||
    wasteValuesForItem[wasteField] ||
    (control.watch ? control.watch(wasteField) : null) ||
    "0";

  const wasteNum = parseFloat(wasteValue);
  if (!isNaN(wasteNum) && wasteNum > 0) {
    if (wasteNum > 1000) {
      wasteValue = (wasteNum / 1000).toFixed(2);
    } else {
      wasteValue = wasteNum.toFixed(2);
    }
  } else {
    wasteValue = "0";
  }

  return wasteValue;
}
