import type {
  IProductMaterialPerStage,
  ISubProductionPlanListItem,
} from "../types/type";

/**
 * محاسبه وزن ماده به کیلوگرم برای مقدار سفارش
 * @param material - ماده مصرفی
 * @param item - آیتم برنامه تولید
 * @returns وزن ماده به کیلوگرم
 */
export function calculateMaterialWeightInKg(
  material: IProductMaterialPerStage,
  item: ISubProductionPlanListItem
): number {
  const meghdar = item.meghdarkolesefaresh
    ? parseFloat(item.meghdarkolesefaresh.toString())
    : 0;
  
  // محاسبه وزن ماده برای مقدار سفارش (به کیلوگرم)
  // vahed به گرم است، پس باید تقسیم بر 1000 کنیم
  return (material.vahed * meghdar) / 1000;
}

