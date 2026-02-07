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
      <label className={compact ? "min-w-[100px] font-medium" : "min-w-[150px] font-medium"}>
        {compact ? "وزن ضایعات (کیلوگرم):" : "وزن ضایعات (کیلوگرم):"}
      </label>
      <Input
        value={value ?? ""}
        type="string"
        placeholder="وزن (کیلوگرم)..."
        className={compact ? "w-full" : "w-[250px]"}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
