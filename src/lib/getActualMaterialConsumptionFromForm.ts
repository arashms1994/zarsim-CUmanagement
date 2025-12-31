/* eslint-disable @typescript-eslint/no-explicit-any */
import { filterMaterialsByStage } from "./filterMaterialsByStage";
import { calculateActualMaterialConsumption } from "./calculateActualMaterialConsumption";
import type {
  IProductMaterialPerStage,
  ISubProductionPlanListItem,
} from "../types/type";

export function getActualMaterialConsumptionFromForm(
  control: any,
  itemPreInvoiceRowId: string,
  formValues: Record<string, any>,
  formValuesInternal: Record<string, any>,
  allMaterials: IProductMaterialPerStage[],
  item: ISubProductionPlanListItem,
  actualProduction: string
): string {
  const actualMaterialConsumptionField = `${itemPreInvoiceRowId}.actualMaterialConsumption`;
  let actualMaterialConsumption =
    formValues[actualMaterialConsumptionField] ||
    formValuesInternal[actualMaterialConsumptionField] ||
    (control.watch ? control.watch(actualMaterialConsumptionField) : null) ||
    "0";

  if (
    actualMaterialConsumption === "0" ||
    !actualMaterialConsumption ||
    actualMaterialConsumption === ""
  ) {
    const actualProd = parseFloat(actualProduction);
    if (!isNaN(actualProd) && actualProd > 0) {
      const stageMaterials = filterMaterialsByStage(allMaterials, item);
      const consumption = calculateActualMaterialConsumption(
        stageMaterials,
        item,
        actualProd
      );
      actualMaterialConsumption = consumption.toFixed(2);
    }
  } else {
    const consumptionNum = parseFloat(actualMaterialConsumption);
    if (!isNaN(consumptionNum) && consumptionNum > 1000) {
      actualMaterialConsumption = (consumptionNum / 1000).toFixed(2);
    }
  }

  return actualMaterialConsumption;
}
