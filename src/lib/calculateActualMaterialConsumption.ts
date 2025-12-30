import type {
  IProductMaterialPerStage,
  ISubProductionPlanListItem,
} from "../types/type";

export function calculateActualMaterialConsumption(
  stageMaterials: IProductMaterialPerStage[],
  item: ISubProductionPlanListItem,
  actualProduction: number
): number {
  if (stageMaterials.length === 0 || actualProduction <= 0) {
    return 0;
  }

  const totalMaterialConsumption = stageMaterials.reduce((sum, material) => {
    const meghdar = item.meghdarkolesefaresh
      ? parseFloat(item.meghdarkolesefaresh.toString())
      : 0;

    const materialConsumption = (material.vahed * meghdar) / 1000;

    return sum + materialConsumption;
  }, 0);

  const meghdar = item.meghdarkolesefaresh
    ? parseFloat(item.meghdarkolesefaresh.toString())
    : 0;

  if (meghdar <= 0) {
    return 0;
  }

  const ratio = actualProduction / meghdar;

  return totalMaterialConsumption * ratio;
}
