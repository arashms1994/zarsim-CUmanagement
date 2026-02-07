import { Input } from "../ui/input";
import { Controller } from "react-hook-form";
import { WASTE_LIST } from "../../lib/constants";
import type { IWasteFormProps, IWasteProps } from "../../types/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";



function isFormProps(props: IWasteProps): props is IWasteFormProps {
  return "control" in props;
}

export default function Waste(props: IWasteProps) {
  if (isFormProps(props)) {
    const { control } = props;
    return (
      <div className="flex items-center justify-start gap-2 flex-wrap">
        <div className="flex items-center justify-start gap-2">
          <label className="min-w-[100px] font-medium text-sm">
            نوع ضایعات:
          </label>
          <Controller
            name="wasteType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="انتخاب نوع ضایعات..." />
                </SelectTrigger>
                <SelectContent>
                  {WASTE_LIST.map((item) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex items-center justify-start gap-2">
          <label className="min-w-[80px] font-medium text-sm">
            وزن ضایعات (kg):
          </label>
          <Controller
            name="wasteWeight"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="string"
                placeholder="مثلاً ۵۰"
                className="w-[150px]"
              />
            )}
          />
        </div>
      </div>
    );
  }

  const { wasteType, wasteWeight, onWasteChange } = props;
  return (
    <div className="flex items-center justify-start gap-2 flex-wrap">
      <div className="flex items-center justify-start gap-2">
        <label className="min-w-[80px] font-medium text-sm">
          نوع ضایعات:
        </label>
        <Select
          value={wasteType}
          onValueChange={(value) => onWasteChange(value, wasteWeight)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="انتخاب نوع ضایعات..." />
          </SelectTrigger>
          <SelectContent>
            {WASTE_LIST.map((item) => (
              <SelectItem key={item.id} value={item.value}>
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-start gap-2">
        <label className="min-w-[60px] font-medium text-sm">
          وزن (kg):
        </label>
        <Input
          value={wasteWeight}
          type="string"
          placeholder="وزن ضایعات..."
          className="w-[120px]"
          onChange={(e) => onWasteChange(wasteType, e.target.value)}
        />
      </div>
    </div>
  );
}
