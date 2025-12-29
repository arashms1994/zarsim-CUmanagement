import type {
  IProductMaterialPerStage,
  ISubProductionPlanListItem,
} from "../types/type";

/**
 * محاسبه مصرف واقعی مواد بر اساس مواد مصرفی و مقدار تولید واقعی
 * @param stageMaterials - لیست مواد مصرفی برای این محصول
 * @param item - آیتم برنامه تولید
 * @param actualProduction - مقدار تولید واقعی
 * @returns مصرف واقعی مواد به کیلوگرم
 */
export function calculateActualMaterialConsumption(
  stageMaterials: IProductMaterialPerStage[],
  item: ISubProductionPlanListItem,
  actualProduction: number
): number {
  if (stageMaterials.length === 0 || actualProduction <= 0) {
    return 0;
  }

  // محاسبه مجموع مواد مصرفی برای مقدار سفارش (meghdarkolesefaresh)
  const totalMaterialConsumption = stageMaterials.reduce((sum, material) => {
    const meghdar = item.meghdarkolesefaresh
      ? parseFloat(item.meghdarkolesefaresh.toString())
      : 0;
    
    // محاسبه مصرف ماده برای مقدار سفارش (به کیلوگرم)
    const materialConsumption = (material.vahed * meghdar) / 1000;
    
    return sum + materialConsumption;
  }, 0);

  // ضرب در نسبت تولید واقعی به مقدار سفارش
  const meghdar = item.meghdarkolesefaresh
    ? parseFloat(item.meghdarkolesefaresh.toString())
    : 0;

  if (meghdar <= 0) {
    return 0;
  }

  // محاسبه نسبت تولید واقعی به مقدار سفارش
  const ratio = actualProduction / meghdar;

  // مصرف واقعی = مجموع مواد مصرفی * نسبت
  return totalMaterialConsumption * ratio;
}

