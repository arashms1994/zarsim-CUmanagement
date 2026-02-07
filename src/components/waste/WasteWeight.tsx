import { Input } from "../ui/input";
import { Controller } from "react-hook-form";
import type { IWasteWeightProps } from "../../types/type";


export default function WasteWeight({
  value,
  onChange,
  control,
  name = "wasteWeight",
  compact = false,
}: IWasteWeightProps) {
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              وزن ضایعات (کیلوگرم):
            </label>
            <Input
              {...field}
              type="string"
              placeholder="مثلاً 50"
              className="w-[250px]"
            />
          </div>
        )}
      />
    );
  }

  return (
    <div className="flex items-center justify-start gap-2">
      <label className={compact ? "min-w-[80px] font-medium text-sm" : "min-w-[150px] font-medium"}>
        {compact ? "وزن(kg):" : "وزن ضایعات (کیلوگرم):"}
      </label>
      <Input
        value={value ?? ""}
        type="string"
        placeholder="مثلاً 50"
        className="w-[250px]"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
