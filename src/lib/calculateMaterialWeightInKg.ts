import type {
  IProductMaterialPerStage,
  ISubProductionPlanListItem,
} from "../types/type";

export function calculateMaterialWeightInKg(
  material: IProductMaterialPerStage,
  item: ISubProductionPlanListItem
): number {
  const meghdar = item.meghdarkolesefaresh
    ? parseFloat(item.meghdarkolesefaresh.toString())
    : 0;

  return (material.vahed * meghdar) / 1000;
}
