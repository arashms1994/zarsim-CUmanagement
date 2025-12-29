import { extractMaxStageNumber } from "./extractMaxStageNumber";
import type {
  IProductMaterialPerStage,
  ISubProductionPlanListItem,
} from "../types/type";

function extractMaterialMarhale(marhale: number | string): number | null {
  const marhaleString = String(marhale).trim();
  if (!marhaleString) return null;

  if (marhaleString.includes(";")) {
    const marhaleNumbers = marhaleString
      .split(";")
      .map((m: string) => m.trim())
      .filter((m: string) => m.length > 0)
      .map((m: string) => parseFloat(m))
      .filter((n: number) => !isNaN(n));

    return marhaleNumbers.length > 0 ? Math.max(...marhaleNumbers) : null;
  } else {
    const marhaleNumber = parseFloat(marhaleString);
    return !isNaN(marhaleNumber) ? marhaleNumber : null;
  }
}

export function filterMaterialsByStage(
  allMaterials: IProductMaterialPerStage[],
  item: ISubProductionPlanListItem
): IProductMaterialPerStage[] {
  const maxStageNumber = extractMaxStageNumber(item.shomaremarhale);

  return allMaterials.filter((material) => {
    if (item.tarhetolid) {
      if (!material.Title || !material.Title.includes(item.tarhetolid)) {
        return false;
      }
    }

    if (maxStageNumber === null || isNaN(maxStageNumber)) {
      return false;
    }

    const materialMarhale = extractMaterialMarhale(material.marhale);

    if (materialMarhale === null || isNaN(materialMarhale)) {
      return false;
    }

    return materialMarhale <= maxStageNumber;
  });
}
