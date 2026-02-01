import { Input } from "../ui/input";
import type { IReelsWeightProps } from "../../types/type";

export default function ReelsWeight({
  value,
  materialConsumptionPerString,
  disabled = false,
  onWeightAndAmountChange,
  onReelChange,
}: IReelsWeightProps) {
  return (
    <div className="flex items-center justify-start gap-2">
      <label className="min-w-[100px] font-medium">وزن(کیلوگرم):</label>
      <Input
        value={value}
        disabled={disabled}
        placeholder="وزن (کیلوگرم)..."
        type="text"
        inputMode="decimal"
        className="w-full"
        onChange={(e) => {
          const val = e.target.value;
          if (
            materialConsumptionPerString != null &&
            materialConsumptionPerString > 0
          ) {
            const kg = parseFloat(val);
            if (!isNaN(kg) && kg > 0) {
              const metersRaw = kg / materialConsumptionPerString;
              const amount = Number.isInteger(metersRaw)
                ? String(metersRaw)
                : String(Math.ceil(metersRaw));
              onWeightAndAmountChange(val, amount);
            } else if (val === "") {
              onWeightAndAmountChange("", "");
            } else {
              onReelChange("weight", val);
            }
          } else {
            onReelChange("weight", val);
          }
        }}
      />
    </div>
  );
}
