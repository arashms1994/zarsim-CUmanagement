import { Input } from "../ui/input";
import { Controller } from "react-hook-form";
import type { IProductionActualWeightProps } from "../../types/type";

export default function ProductionActualWeight({
  control,
  setValue,
  materialConsumptionPerString,
}: IProductionActualWeightProps) {
  return (
    <div className="flex items-center justify-start gap-2">
      <label className="min-w-[150px] font-medium">
        وزن تولیدی (کیلوگرم):
      </label>
      <Controller
        name="actualWeight"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="string"
            placeholder="مثلاً 50"
            className="w-[250px]"
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
              if (
                setValue &&
                materialConsumptionPerString !== null &&
                materialConsumptionPerString > 0
              ) {
                const kg = parseFloat(value);
                if (!isNaN(kg) && kg > 0) {
                  const metersRaw = kg / materialConsumptionPerString;
                  const meters = Number.isInteger(metersRaw)
                    ? String(metersRaw)
                    : String(Math.ceil(metersRaw));
                  setValue("actualAmountProduction", meters, {
                    shouldValidate: false,
                    shouldDirty: false,
                    shouldTouch: false,
                  });
                } else if (!value || value.trim() === "") {
                  setValue("actualAmountProduction", "", {
                    shouldValidate: false,
                    shouldDirty: false,
                    shouldTouch: false,
                  });
                }
              }
            }}
          />
        )}
      />
    </div>
  );
}
