import { Input } from "../ui/input";

export interface IReelsAmountProps {
  value: string;
  materialConsumptionPerString: number | null;
  disabled?: boolean;
  onWeightAndAmountChange: (weight: string, amount: string) => void;
  onReelChange: (field: "weight" | "amount", value: string) => void;
}

export default function ReelsAmount({
  value,
  materialConsumptionPerString,
  disabled = false,
  onWeightAndAmountChange,
  onReelChange,
}: IReelsAmountProps) {
  return (
    <div className="flex items-center justify-start gap-2">
      <label className="min-w-[100px] font-medium">متراژ(متر):</label>
      <Input
        value={value}
        disabled={disabled}
        placeholder="متراژ (متر)..."
        type="text"
        inputMode="decimal"
        className="w-full"
        onChange={(e) => {
          const val = e.target.value;
          if (
            materialConsumptionPerString != null &&
            materialConsumptionPerString > 0
          ) {
            const meters = parseFloat(val);
            if (!isNaN(meters) && meters > 0) {
              const kgRaw = meters * materialConsumptionPerString;
              const weight = parseFloat(kgRaw.toFixed(6)).toFixed(2);
              onWeightAndAmountChange(weight, val);
            } else if (val === "") {
              onWeightAndAmountChange("", "");
            } else {
              onReelChange("amount", val);
            }
          } else {
            onReelChange("amount", val);
          }
        }}
      />
    </div>
  );
}
