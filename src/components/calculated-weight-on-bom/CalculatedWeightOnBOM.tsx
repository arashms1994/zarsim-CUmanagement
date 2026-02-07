import { Spinner } from "../ui/spinner";
import type { ICalculatedWeightOnBOMProps } from "../../types/type";


export default function CalculatedWeightOnBOM({
  isLoadingMaterials,
  isLoadingProducts,
  materialConsumptionPerString,
  planAmount,
}: ICalculatedWeightOnBOMProps) {
  return (
    <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3">
      <label className="min-w-[150px] font-medium">
        مقدار مصرف موادبراساس BOM (کیلوگرم):
      </label>
      {isLoadingMaterials ||
        isLoadingProducts ||
        materialConsumptionPerString === null ? (
        <span className="text-purple-500 text-sm flex justify-start items-center">
          <Spinner className="size-8 text-purple-500" />
          در حال محاسبه...
        </span>
      ) : (
        <span className="text-lg font-normal">
          {materialConsumptionPerString !== null && planAmount
            ? (
              materialConsumptionPerString *
              parseFloat(planAmount.toString())
            ).toFixed(2)
            : "-"}
        </span>
      )}
    </div>
  );
}
