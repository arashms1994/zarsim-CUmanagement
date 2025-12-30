import { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getProductMaterialPerStage } from "../../api/getData";
import type { IProductMaterialPerStage } from "../../types/type";
import { Input } from "./input";
import ReelSelector from "./ReelSelector";
import ProductsTable from "./ProductsTable";
import DeviceSelector from "./DeviceSelector";
import OperatorSelector from "./OperatorSelector";
import StopReasonSelector from "./StopReasonSelector";
import { Controller, useForm, useWatch } from "react-hook-form";
import type {
  IProductionPlanRowFormProps,
  IReelItem,
  IStopListItem,
} from "../../types/type";
import { useSubProductionPlanByNumbers } from "../../hooks/useSubProductionPlanByNumbers";
import { submitCUManagement, submitCUManagementRow } from "../../api/addData";
import { filterItemsByMinQuantity } from "../../lib/filterItemsByMinQuantity";
import { filterMaterialsByStage } from "../../lib/filterMaterialsByStage";
import { calculateMaterialWeightInKg } from "../../lib/calculateMaterialWeightInKg";
import { getActualProductionFromForm } from "../../lib/getActualProductionFromForm";
import { calculateProductionValues } from "../../lib/calculateProductionValues";
import { sortItemsByPriority } from "../../lib/sortItemsByPriority";

export default function ProductionPlanRowForm({
  planItem,
  control: externalControl,
  productionPlanNumber,
}: IProductionPlanRowFormProps) {
  const localForm = useForm();
  const control = externalControl || localForm.control;
  const setValue = externalControl?.setValue || localForm.setValue;
  const [operator, setOperator] = useState("");
  const [stopReason, setStopReason] = useState("");
  const [deviceName, setDeviceName] = useState(planItem.dasatghah || "");
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [entranceReels, setEntranceReels] = useState<IReelItem[]>([]);
  const [exitReels, setExitReels] = useState<IReelItem[]>([]);
  const [shiftData, setShiftData] = useState<{
    id: number | "";
    title: string;
    start: string;
    end: string;
  }>({
    id: "",
    title: "",
    start: "",
    end: "",
  });
  const [stopItem, setStopItem] = useState<IStopListItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planNumbers = useMemo(() => {
    if (
      planItem.shomaretahshode &&
      planItem.shomaretahshode.trim().length > 0
    ) {
      const numbers = planItem.shomaretahshode
        .split(",")
        .map((n: string) => n.trim())
        .filter((n: string) => n.length > 0);

      return numbers;
    }

    if (
      planItem.shomaretajshode &&
      planItem.shomaretajshode.trim().length > 0
    ) {
      const numbers = planItem.shomaretajshode
        .split(",")
        .map((n: string) => n.trim())
        .filter((n: string) => n.length > 0);

      return numbers;
    }

    return [];
  }, [planItem]);

  const { planItems, isLoading: planItemsLoading } =
    useSubProductionPlanByNumbers(planNumbers);

  // فیلتر کردن آیتم‌های زیر 10 متر
  const filteredPlanItems = useMemo(
    () => filterItemsByMinQuantity(planItems),
    [planItems]
  );

  // استخراج tarhetolid های منحصر به فرد برای دریافت مواد
  const uniqueTarhetolids = useMemo(() => {
    const tarhetolids = filteredPlanItems
      .map((item) => item.tarhetolid)
      .filter((t): t is string => !!t && t.trim().length > 0);
    return Array.from(new Set(tarhetolids));
  }, [filteredPlanItems]);

  // دریافت مواد برای هر tarhetolid
  const materialQueries = useQueries({
    queries: uniqueTarhetolids.map((tarhetolid) => ({
      queryKey: ["product-material-per-stage", tarhetolid],
      queryFn: () => getProductMaterialPerStage(tarhetolid),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })),
  });

  const allMaterials = useMemo(() => {
    return materialQueries
      .flatMap((query) => query.data || [])
      .filter((m): m is IProductMaterialPerStage => !!m);
  }, [materialQueries]);

  // مرتب‌سازی آیتم‌ها بر اساس اولویت
  const sortedFilteredItems = useMemo(
    () => sortItemsByPriority(filteredPlanItems),
    [filteredPlanItems]
  );

  const actualAmountProduction = useWatch({
    control,
    name: "actualAmountProduction",
  });

  // محاسبه productionValues برای استفاده در getActualProductionFromForm
  const productionValues = useMemo(() => {
    if (!control || !actualAmountProduction) {
      return {};
    }
    return calculateProductionValues(
      sortedFilteredItems,
      actualAmountProduction
    );
  }, [sortedFilteredItems, actualAmountProduction, control]);

  const waste = useWatch({
    control,
    name: "waste",
  });

  const actualWeight = useWatch({
    control,
    name: "actualWeight",
  });

  const description = useWatch({
    control,
    name: "description",
  });

  const stopTime = useWatch({
    control,
    name: "stopTime",
  });

  const productCode = useMemo(() => {
    if (filteredPlanItems.length === 0) return "";
    const tarhetolids = filteredPlanItems
      .map((item) => item.tarhetolid)
      .filter((t): t is string => !!t && t.trim().length > 0);
    // حذف مقادیر تکراری
    const uniqueTarhetolids = Array.from(new Set(tarhetolids));
    return uniqueTarhetolids.join("-");
  }, [filteredPlanItems]);

  const preInvoiceRow = useMemo(() => {
    if (filteredPlanItems.length === 0) return "";
    const radiffactors = filteredPlanItems
      .map((item) => item.shomareradiffactor)
      .filter((r): r is string => !!r && r.trim().length > 0);
    // حذف مقادیر تکراری
    const uniqueRadiffactors = Array.from(new Set(radiffactors));
    return uniqueRadiffactors.join("-");
  }, [filteredPlanItems]);

  const product = useMemo(() => {
    if (filteredPlanItems.length === 0) return planItem.codemahsol || "";
    const codemahsols = filteredPlanItems
      .map((item) => item.codemahsol)
      .filter((c): c is string => !!c && c.trim().length > 0);
    return codemahsols.length > 0
      ? codemahsols.join(", ")
      : planItem.codemahsol || "";
  }, [filteredPlanItems, planItem.codemahsol]);

  const entranceWeight = useMemo(() => {
    const totalWeight = entranceReels.reduce((sum, reel) => {
      const weight = parseFloat(reel.weight || "0");
      return sum + (isNaN(weight) ? 0 : weight);
    }, 0);
    return totalWeight.toFixed(2);
  }, [entranceReels]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData = {
        productionPlanNumber: productionPlanNumber || "",
        actualAmountProduction: actualAmountProduction || "",
        operator: operator || "",
        productionPlanAmount: String(planItem.barnamerizi || ""),
        preInvoiceRow: preInvoiceRow || "",
        stage: String(planItem.marhale || ""),
        device: deviceName || "",
        calculatedWeight: String(planItem.barnamerizi || ""),
        actualWeight: actualWeight || "",
        product: product || "",
        description: description || "",
        productCode: productCode || "",
        stopTitle: stopItem?.Title || stopReason || "",
        stopCode: stopItem?.Code || "",
        stopTime: stopTime || "",
        shiftTitle: shiftData.title || "",
        shiftStartedAt: shiftData.start || "",
        shiftEndedAt: shiftData.end || "",
        shiftId: shiftData.id || "",
        deviceId: deviceId ? String(deviceId) : "",
        entranceWeight: entranceWeight || "",
        waste: waste || "",
      };

      const result = await submitCUManagement(submitData);

      if (result.success) {
        // ارسال ردیف‌های جدول به CU_MANAGEMENT_ROW
        const rowPromises = filteredPlanItems.map(async (item) => {
          const itemPreInvoiceRowId = item.shomareradiffactor;
          if (!itemPreInvoiceRowId) return null;

          // دریافت مقادیر از form
          const actualProductionField = `${itemPreInvoiceRowId}.actualProduction`;
          const actualProductionValue = getActualProductionFromForm(
            control,
            actualProductionField,
            productionValues
          );
          const actualProduction = actualProductionValue || "0";

          const actualMaterialConsumptionField = `${itemPreInvoiceRowId}.actualMaterialConsumption`;
          // استفاده از getValues برای دریافت مقدار از form (بهترین روش برای submit)
          let actualMaterialConsumption = "0";
          if (control.getValues) {
            const formValues = control.getValues();
            actualMaterialConsumption =
              formValues[actualMaterialConsumptionField] || "0";
          } else if (control._formValues) {
            actualMaterialConsumption =
              control._formValues[actualMaterialConsumptionField] || "0";
          } else if (control.watch) {
            actualMaterialConsumption =
              control.watch(actualMaterialConsumptionField) || "0";
          }

          const wasteField = `${itemPreInvoiceRowId}.waste`;
          let wasteValue = "0";
          if (control.getValues) {
            const formValues = control.getValues();
            wasteValue = formValues[wasteField] || "0";
          } else if (control._formValues) {
            wasteValue = control._formValues[wasteField] || "0";
          } else if (control.watch) {
            wasteValue = control.watch(wasteField) || "0";
          }

          const stageMaterials = filterMaterialsByStage(allMaterials, item);
          const orderWeight = stageMaterials
            .reduce((sum, material) => {
              return sum + calculateMaterialWeightInKg(material, item);
            }, 0)
            .toFixed(2);

          const rowData = {
            Title: item.shomareradiffactor || "",
            customer: item.namemoshtari ? String(item.namemoshtari) : "",
            productionPlanItem: productionPlanNumber || "",
            actualAmount: actualProduction,
            orderAmount: String(item.meghdarkolesefaresh || "0"),
            orderWeight: orderWeight,
            actualWeight: actualMaterialConsumption,
            waste: wasteValue,
            product: item.codemahsol || "",
            productCode: item.tarhetolid || "",
            priority: item.Priority ? String(item.Priority) : "",
          };

          console.log("📋 Row Data:", {
            Title: rowData.Title,
            customer: rowData.customer,
            priority: rowData.priority,
            actualWeight: rowData.actualWeight,
            waste: rowData.waste,
            item: {
              namemoshtari: item.namemoshtari,
              Priority: item.Priority,
            },
          });

          return submitCUManagementRow(rowData);
        });

        const rowResults = await Promise.all(rowPromises);
        const failedRows = rowResults.filter((r) => r && !r.success).length;
        const successRows = rowResults.filter((r) => r && r.success).length;

        if (failedRows > 0) {
          alert(
            `ثبت اصلی موفق بود ✅\n${successRows} ردیف با موفقیت ثبت شد\n${failedRows} ردیف با خطا مواجه شد`
          );
        } else {
          alert(`ثبت با موفقیت انجام شد ✅\n${successRows} ردیف ثبت شد`);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(
        `خطا در ثبت اطلاعات: ${
          error instanceof Error ? error.message : "خطای نامشخص"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              مقدار مصرف موادبراساس BOM (کیلوگرم):
            </label>
            <span className="text-lg font-normal">{planItem.barnamerizi}</span>
          </div>

          <DeviceSelector
            value={deviceName}
            onChange={setDeviceName}
            marhale={planItem.marhale}
            onDeviceChange={(device) => {
              setDeviceName(device.title);
              setDeviceId(device.id);
            }}
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
                />
              )}
            />
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              ضایعات (کیلوگرم):
            </label>
            <Controller
              name="waste"
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
            <label className="min-w-[150px] font-medium">توضیحات:</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="string"
                  placeholder="توضیحات گزارش تولید..."
                  className="w-[250px]"
                />
              )}
            />
          </div>

          <OperatorSelector
            value={operator}
            onChange={setOperator}
            onShiftChange={setShiftData}
          />

          <StopReasonSelector
            stopReason={stopReason}
            onStopReasonChange={setStopReason}
            control={control}
            onStopItemChange={setStopItem}
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

        <div className="w-full space-y-2">
          <label className="font-medium text-lg">محصولات:</label>
          {planNumbers.length > 0 ? (
            <ProductsTable
              items={planItems}
              isLoading={planItemsLoading}
              control={control}
              actualAmountProduction={actualAmountProduction}
              waste={waste}
              setValue={setValue}
            />
          ) : (
            <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
              <label className="min-w-[150px] font-medium">محصول:</label>
              <span className="text-lg font-normal">{planItem.codemahsol}</span>
            </div>
          )}
        </div>

        <div
          onClick={handleSubmit}
          className={`px-3 py-2 cursor-pointer w-[150px] text-center mx-auto bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت اطلاعات"}
        </div>
      </form>
    </div>
  );
}
