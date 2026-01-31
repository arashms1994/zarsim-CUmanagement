import { Input } from "../ui/input";
import { Controller } from "react-hook-form";
import type { IProductionActualAmountProps } from "../../types/type";

export default function ProductionActualAmount({
  control,
  setValue,
  materialConsumptionPerString,
}: IProductionActualAmountProps) {
  return (
    <div className="flex items-center justify-start gap-2">
      <label className="min-w-[150px] font-medium">
        متراژ تولیدی (متر):
      </label>
      <Controller
        name="actualAmountProduction"
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
                const meters = parseFloat(value);
                if (!isNaN(meters) && meters > 0) {
                  const weight = (
                    meters * materialConsumptionPerString
                  ).toFixed(2);
                  setValue("actualWeight", weight, {
                    shouldValidate: false,
                    shouldDirty: false,
                    shouldTouch: false,
                  });
                } else if (!value || value.trim() === "") {
                  setValue("actualWeight", "", {
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
