import type {
  ISubProductionPlanListItem,
  IProductMaterialPerStage,
  ICUManagementRowListItem,
} from "../types/type";
import { filterMaterialsByStage } from "./filterMaterialsByStage";
import { calculateMaterialWeightInKg } from "./calculateMaterialWeightInKg";
import { getActualMaterialConsumptionFromForm } from "./getActualMaterialConsumptionFromForm";
import { getWasteValueFromForm } from "./getWasteValueFromForm";
import { getActualProductionFromForm } from "./getActualProductionFromForm";

export function prepareRowDataForSubmission(
  item: ISubProductionPlanListItem,
  control: any,
  formValues: Record<string, any>,
  formValuesInternal: Record<string, any>,
  allMaterials: IProductMaterialPerStage[],
  sortedFilteredItems: ISubProductionPlanListItem[],
  productionValues: Record<string, string>,
  waste: string,
  productionPlanNumber: string,
  selectedStage?: string
): ICUManagementRowListItem | null {
  const itemPreInvoiceRowId = item.shomareradiffactor;
  if (!itemPreInvoiceRowId) return null;

  const actualProductionField = `${itemPreInvoiceRowId}.actualProduction`;
  const actualProductionValue = getActualProductionFromForm(
    control,
    actualProductionField,
    productionValues
  );
  const actualProduction = actualProductionValue || "0";

  const actualMaterialConsumption = getActualMaterialConsumptionFromForm(
    control,
    itemPreInvoiceRowId,
    formValues,
    formValuesInternal,
    allMaterials,
    item,
    actualProduction
  );

  const wasteValue = getWasteValueFromForm(
    control,
    itemPreInvoiceRowId,
    formValues,
    formValuesInternal,
    sortedFilteredItems,
    waste
  );

  const stageMaterials = filterMaterialsByStage(allMaterials, item);
  const orderWeight = stageMaterials
    .reduce((sum, material) => {
      return sum + calculateMaterialWeightInKg(material, item);
    }, 0)
    .toFixed(2);

  const priorityValue =
    item.Priority && item.Priority.trim()
      ? String(item.Priority.trim())
      : "";

  const rowData: ICUManagementRowListItem = {
    Title: item.shomareradiffactor || "",
    customer: item.namemoshtari ? String(item.namemoshtari) : "",
    productionPlanItem: productionPlanNumber || "",
    actualAmount: actualProduction,
    orderAmount: String(item.meghdarkolesefaresh || "0"),
    orderWeight: orderWeight,
    actualWeight: String(actualMaterialConsumption),
    waste: String(wasteValue),
    product: item.codemahsol || "",
    productCode: item.tarhetolid || "",
    priority: priorityValue,
    level: selectedStage || "",
    levelNumber: item.shomaremarhale || "",
  };

  return rowData;
}

