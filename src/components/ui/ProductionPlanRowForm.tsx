import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { IProductionPlanRowFormProps, IReelItem } from "../../types/type";
import { Input } from "./input";
import OperatorSelector from "./OperatorSelector";
import StopReasonSelector from "./StopReasonSelector";
import DeviceSelector from "./DeviceSelector";
import ReelSelector from "./ReelSelector";

export default function ProductionPlanRowForm({
  planItem,
  control: externalControl,
}: IProductionPlanRowFormProps) {
  const localForm = useForm();
  const control = externalControl || localForm.control;
  const [operator, setOperator] = useState("");
  const [stopReason, setStopReason] = useState("");
  const [deviceName, setDeviceName] = useState(planItem.dasatghah || "");
  const [entranceReels, setEntranceReels] = useState<IReelItem[]>([]);
  const [exitReels, setExitReels] = useState<IReelItem[]>([]);

  return (
    <div className="w-full p-5 gap-2 flex justify-between items-center flex-wrap rounded-[4px] border-2 shadow border-[#1e7677] relative">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="bg-[#1e7677] text-center px-3 py-2 rounded-lg">
          <span className="text-lg font-normal text-white">
            جزئیات کارت تولید
          </span>
        </div>
      </div>

      <form className="w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">مرحله:</label>
            <span className="text-lg font-normal">{planItem.marhale}</span>
          </div>

          <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              مقدار برنامه ریزی شده:
            </label>
            <span className="text-lg font-normal">{planItem.barnamerizi}</span>
          </div>

          <DeviceSelector
            value={deviceName}
            onChange={setDeviceName}
            marhale={planItem.marhale}
          />

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
                />
              )}
            />
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              وزن خروجی(کیلوگرم):
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
                />
              )}
            />
          </div>

          <OperatorSelector value={operator} onChange={setOperator} />

          <StopReasonSelector
            stopReason={stopReason}
            onStopReasonChange={setStopReason}
            control={control}
          />
        </div>

        <div className="w-full space-y-4">
          <ReelSelector
            reels={entranceReels}
            onReelsChange={setEntranceReels}
            label="قرقره‌های ورودی:"
          />

          <ReelSelector
            reels={exitReels}
            onReelsChange={setExitReels}
            label="قرقره‌های خروجی:"
          />
        </div>

        <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
          <label className="min-w-[150px] font-medium">محصول:</label>
          <span className="text-lg font-normal">{planItem.codemahsol}</span>
        </div>
      </form>
    </div>
  );
}
