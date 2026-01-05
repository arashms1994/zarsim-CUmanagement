/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { Input } from "./input";
import { Spinner } from "./spinner";
import ReelSelector from "./ReelSelector";
import ProductsTable from "./ProductsTable";
import OperatorSelector from "./OperatorSelector";
import { useQueries } from "@tanstack/react-query";
import { useProducts } from "../../hooks/useProducts";
import StopReasonSelector from "./StopReasonSelector";
import { getProductMaterialPerStage } from "../../api/getData";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { IProductMaterialPerStage } from "../../types/type";
import { sortItemsByPriority } from "../../lib/sortItemsByPriority";
import { filterMaterialsByStage } from "../../lib/filterMaterialsByStage";
import { filterItemsByMinQuantity } from "../../lib/filterItemsByMinQuantity";
import { submitCUManagement, submitCUManagementRow } from "../../api/addData";
import { calculateProductionValues } from "../../lib/calculateProductionValues";
import { prepareRowDataForSubmission } from "../../lib/prepareRowDataForSubmission";
import { useSubProductionPlanByNumbers } from "../../hooks/useSubProductionPlanByNumbers";
import type {
  IProductionPlanRowFormProps,
  IReelItem,
  IStopListItem,
} from "../../types/type";

export default function ProductionPlanRowForm({
  planItem,
  control: externalControl,
  productionPlanNumber,
  selectedStage,
}: IProductionPlanRowFormProps) {
  const localForm = useForm();
  const control = externalControl || localForm.control;
  const setValue = externalControl?.setValue || localForm.setValue;

  const [operator, setOperator] = useState("");
  const [stopReason, setStopReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exitReels, setExitReels] = useState<IReelItem[]>([]);
  const [entranceReels, setEntranceReels] = useState<IReelItem[]>([]);
  const [stopItem, setStopItem] = useState<IStopListItem | null>(null);
  const [ordersTotalWeight, setOrdersTotalWeight] = useState<string>("");
  const [ordersTotalAmount, setOrdersTotalAmount] = useState<string>("");
  const [materialConsumptionPerString, setMaterialConsumptionPerString] =
    useState<number | null>(null);
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

  const filteredPlanItems = useMemo(
    () => filterItemsByMinQuantity(planItems),
    [planItems]
  );

  const uniqueTarhetolids = useMemo(() => {
    const tarhetolids = filteredPlanItems
      .map((item) => item.tarhetolid)
      .filter((t): t is string => !!t && t.trim().length > 0);
    return Array.from(new Set(tarhetolids));
  }, [filteredPlanItems]);

  const { products, isLoading: isLoadingProducts } = useProducts();

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

  const isLoadingMaterials = materialQueries.some((query) => query.isLoading);

  useEffect(() => {
    console.log("🔍 بررسی محاسبه مصرف مواد:", {
      productsCount: products.length,
      uniqueTarhetolidsCount: uniqueTarhetolids.length,
      uniqueTarhetolids: uniqueTarhetolids,
      allMaterialsCount: allMaterials.length,
      filteredPlanItemsCount: filteredPlanItems.length,
    });

    if (
      products.length > 0 &&
      uniqueTarhetolids.length > 0 &&
      allMaterials.length > 0 &&
      filteredPlanItems.length > 0
    ) {
      for (const tarhetolid of uniqueTarhetolids) {
        const tarhetolidNumber = parseFloat(tarhetolid);
        console.log(
          `🔍 بررسی کد طرح: ${tarhetolid} (عدد: ${tarhetolidNumber})`
        );

        if (!isNaN(tarhetolidNumber)) {
          const matchedProduct = products.find(
            (product) => product.code === tarhetolidNumber
          );

          console.log(`🔍 محصول پیدا شده:`, matchedProduct);
          console.log(
            `🔍 تمام فیلدهای محصول:`,
            Object.keys(matchedProduct || {})
          );
          console.log(`🔍 String محصول (مقدار):`, matchedProduct?.String);
          console.log(`🔍 String محصول (نوع):`, typeof matchedProduct?.String);

          if (matchedProduct) {
            // بررسی String - ممکن است 0 باشد که falsy است
            const stringValue = matchedProduct.String;
            console.log(
              `🔍 String محصول (مقدار خام):`,
              stringValue,
              `نوع:`,
              typeof stringValue
            );

            if (stringValue !== null && stringValue !== undefined) {
              const stringCount =
                typeof stringValue === "number"
                  ? stringValue
                  : parseFloat(String(stringValue));
              console.log(`🔍 String تبدیل شده به عدد:`, stringCount);

              if (!isNaN(stringCount) && stringCount > 0) {
                const planItemForTarhetolid = filteredPlanItems.find(
                  (item) => item.tarhetolid === tarhetolid
                );

                console.log(`🔍 آیتم برنامه پیدا شده:`, planItemForTarhetolid);

                if (planItemForTarhetolid) {
                  const stageMaterials = filterMaterialsByStage(
                    allMaterials,
                    planItemForTarhetolid
                  );

                  console.log(
                    `🔍 مواد فیلتر شده:`,
                    stageMaterials.length,
                    stageMaterials
                  );

                  // محاسبه مجموع vahed تمام مواد (به گرم)
                  const totalVahed = stageMaterials.reduce(
                    (sum: number, material: IProductMaterialPerStage) => {
                      return sum + (material.vahed || 0);
                    },
                    0
                  );

                  console.log(`🔍 مجموع vahed (گرم):`, totalVahed);

                  if (totalVahed > 0 && stringCount > 0) {
                    // تقسیم vahed بر تعداد رشته و تبدیل به کیلوگرم (تقسیم بر 1000)
                    const result = totalVahed / stringCount / 1000;
                    setMaterialConsumptionPerString(result);
                    console.log(
                      `✅ کد طرح: ${tarhetolid}, تعداد رشته: ${stringCount}, مجموع vahed: ${totalVahed.toFixed(
                        2
                      )} گرم, مصرف مواد تقسیم بر رشته: ${result.toFixed(
                        4
                      )} کیلوگرم`
                    );
                  } else {
                    console.log(
                      `⚠️ vahed یا تعداد رشته صفر است - vahed: ${totalVahed}, تعداد رشته: ${stringCount}`
                    );
                    setMaterialConsumptionPerString(null);
                  }
                  break;
                } else {
                  console.log(
                    `⚠️ آیتم برنامه برای کد طرح ${tarhetolid} پیدا نشد`
                  );
                }
              } else {
                console.log(
                  `⚠️ String نامعتبر یا صفر - مقدار: ${stringValue}, تبدیل شده: ${stringCount}`
                );
              }
            } else {
              console.log(
                `⚠️ String برای محصول با code ${tarhetolidNumber} null یا undefined است - مقدار: ${stringValue}`
              );
            }
          } else {
            console.log(`⚠️ محصول با code ${tarhetolidNumber} پیدا نشد`);
          }
        } else {
          console.log(`⚠️ کد طرح ${tarhetolid} عدد معتبر نیست`);
        }
      }
    } else {
      console.log("⚠️ یکی از شرایط لازم برقرار نیست:", {
        products: products.length > 0,
        uniqueTarhetolids: uniqueTarhetolids.length > 0,
        allMaterials: allMaterials.length > 0,
        filteredPlanItems: filteredPlanItems.length > 0,
      });
    }
  }, [products, uniqueTarhetolids, allMaterials, filteredPlanItems]);

  const sortedFilteredItems = useMemo(
    () => sortItemsByPriority(filteredPlanItems),
    [filteredPlanItems]
  );

  const actualAmountProduction = useWatch({
    control,
    name: "actualAmountProduction",
  });

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
    const uniqueTarhetolids = Array.from(new Set(tarhetolids));
    return uniqueTarhetolids.join("-");
  }, [filteredPlanItems]);

  const preInvoiceRow = useMemo(() => {
    if (filteredPlanItems.length === 0) return "";
    const radiffactors = filteredPlanItems
      .map((item) => item.shomareradiffactor)
      .filter((r): r is string => !!r && r.trim().length > 0);
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
        device: planItem.dasatghah || "",
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
        deviceId: "",
        entranceWeight: entranceWeight || "",
        waste: waste || "",
        ordersTotalWeight: ordersTotalWeight || "",
        ordersTotalAmount: ordersTotalAmount || "",
      };

      const result = await submitCUManagement(submitData);

      if (result.success) {
        const formValues = control.getValues ? control.getValues() : {};
        const formValuesInternal = (control as any)._formValues || {};

        const rowPromises = filteredPlanItems.map(async (item) => {
          const rowData = prepareRowDataForSubmission(
            item,
            control,
            formValues,
            formValuesInternal,
            allMaterials,
            sortedFilteredItems,
            productionValues,
            waste || "",
            productionPlanNumber || "",
            selectedStage,
            planItem.dasatghah || ""
          );

          if (!rowData) return null;

          console.log("📋 Row Data:", {
            Title: rowData.Title,
            customer: rowData.customer,
            priority: rowData.priority,
            actualWeight: rowData.actualWeight,
            waste: rowData.waste,
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

        window.location.reload();
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
            {isLoadingMaterials ||
            isLoadingProducts ||
            materialConsumptionPerString === null ? (
              <span className="text-purple-500 text-sm flex justify-start items-center">
                <Spinner className="size-8 text-purple-500" />
                در حال محاسبه...
              </span>
            ) : (
              <span className="text-lg font-normal">
                {materialConsumptionPerString !== null && planItem.barnamerizi
                  ? (
                      materialConsumptionPerString *
                      parseFloat(planItem.barnamerizi.toString())
                    ).toFixed(2)
                  : "-"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">دستگاه:</label>
            <span className="text-lg font-normal">{planItem.dasatghah}</span>
          </div>

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
            productionPlanNumber={productionPlanNumber || ""}
            selectedStage={selectedStage || ""}
            device={planItem.dasatghah || ""}
            operator={operator || ""}
            preInvoiceRow={preInvoiceRow || ""}
          />

          <ReelSelector
            reels={exitReels}
            onReelsChange={setExitReels}
            label="قرقره‌های خروجی:"
            productionPlanNumber={productionPlanNumber || ""}
            selectedStage={selectedStage || ""}
            device={planItem.dasatghah || ""}
            operator={operator || ""}
            preInvoiceRow={preInvoiceRow || ""}
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
              onTotalsChange={(totals) => {
                setOrdersTotalWeight(totals.ordersTotalWeight);
                setOrdersTotalAmount(totals.ordersTotalAmount);
              }}
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
