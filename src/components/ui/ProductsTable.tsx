import { useMemo, useEffect, useState } from "react";
import { Input } from "./input";
import { Spinner } from "./spinner";
import { Controller } from "react-hook-form";
import { useQueries } from "@tanstack/react-query";
import { buildReportUrl } from "../../lib/buildReportUrl";
import type { IProductsTableProps } from "../../types/type";
import { getProductMaterialPerStage } from "../../api/getData";
import type { IProductMaterialPerStage } from "../../types/type";
import { sortItemsByPriority } from "../../lib/sortItemsByPriority";
import { filterMaterialsByStage } from "../../lib/filterMaterialsByStage";
import { extractUniqueTarhetolids } from "../../lib/extractUniqueTarhetolids";
import { filterItemsByMinQuantity } from "../../lib/filterItemsByMinQuantity";
import { calculateProductionValues } from "../../lib/calculateProductionValues";
import { getActualProductionFromForm } from "../../lib/getActualProductionFromForm";
import { calculateMaterialWeightInKg } from "../../lib/calculateMaterialWeightInKg";
import { calculateActualMaterialConsumption } from "../../lib/calculateActualMaterialConsumption";

export default function ProductsTable({
  items,
  isLoading,
  control,
  actualAmountProduction,
  setValue,
}: IProductsTableProps) {
  const [materialConsumptionValues, setMaterialConsumptionValues] = useState<
    Record<string, string>
  >({});

  const filteredItems = useMemo(() => filterItemsByMinQuantity(items), [items]);

  const sortedItems = useMemo(
    () => sortItemsByPriority(filteredItems),
    [filteredItems]
  );

  const uniqueTarhetolids = useMemo(
    () => extractUniqueTarhetolids(filteredItems),
    [filteredItems]
  );

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

  const productionValues = useMemo(() => {
    if (!control || !actualAmountProduction) {
      return {};
    }

    return calculateProductionValues(sortedItems, actualAmountProduction);
  }, [sortedItems, actualAmountProduction, control]);

  useEffect(() => {
    if (setValue && Object.keys(productionValues).length > 0) {
      const timeoutId = setTimeout(() => {
        Object.entries(productionValues).forEach(([fieldName, value]) => {
          setValue(fieldName, value, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          });
        });
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [productionValues, setValue]);

  useEffect(() => {
    if (
      !setValue ||
      !control ||
      sortedItems.length === 0 ||
      allMaterials.length === 0
    ) {
      return;
    }

    const timeoutId = setTimeout(() => {
      sortedItems.forEach((item) => {
        const itemPreInvoiceRowId = item.shomareradiffactor;
        if (!itemPreInvoiceRowId) {
          return;
        }

        const actualProductionField = `${itemPreInvoiceRowId}.actualProduction`;
        const actualProductionValue = getActualProductionFromForm(
          control,
          actualProductionField,
          productionValues
        );
        const actualProduction = parseFloat(actualProductionValue);

        if (!isNaN(actualProduction) && actualProduction > 0) {
          const stageMaterials = filterMaterialsByStage(allMaterials, item);

          const consumption = calculateActualMaterialConsumption(
            stageMaterials,
            item,
            actualProduction
          );

          const consumptionValue = consumption.toFixed(2);
          const consumptionField = `${itemPreInvoiceRowId}.actualMaterialConsumption`;

          setMaterialConsumptionValues((prev) => ({
            ...prev,
            [consumptionField]: consumptionValue,
          }));

          setValue(consumptionField, consumptionValue, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [sortedItems, allMaterials, control, setValue, productionValues]);

  const isLoadingMaterials = materialQueries.some((query) => query.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e7677]"></div>
          <span className="text-sm text-gray-500">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (sortedItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
          <span className="text-yellow-700 text-sm">
            هیچ ردیف برنامه‌ریزی برای شماره‌های انتخابی یافت نشد
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[4px]">
      <table className="w-full border-collapse border border-[#1e7677] rounded-[4px]">
        <thead>
          <tr className="bg-[#1e7677] text-white">
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              اولویت
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              کد طرح
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              محصولات
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              مقدار سفارش
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              مقدار مواد مصرفی بر اساس BOM
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              تولید واقعی
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              مصرف واقعی مواد
            </th>
            <th className="border border-[#1e7677] px-4 py-2 text-right font-medium">
              ضایعات (کیلوگرم)
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => {
            const itemPreInvoiceRowId = item.shomareradiffactor;
            const reportUrl = buildReportUrl(item.shomareradiffactor);
            const productName = item.codemahsol || item.mahsoletolidi || "-";
            const stageMaterials = filterMaterialsByStage(allMaterials, item);

            return (
              <tr
                key={itemPreInvoiceRowId}
                className="bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {item.Priority && item.Priority.trim() ? item.Priority : "-"}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {item.tarhetolid || "-"}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {productName !== "-" ? (
                    <a
                      href={reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      onClick={() => {
                        console.log("🖱️ کلیک روی لینک:", {
                          productName,
                          reportUrl,
                          itemPreInvoiceRowId,
                        });
                      }}
                    >
                      {productName}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {item.meghdarkolesefaresh || "-"}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {isLoadingMaterials ? (
                    <span className="text-purple-500 text-sm flex justify-start items-center">
                      <Spinner className="size-8 text-purple-500" />
                      در حال محاسبه...
                    </span>
                  ) : stageMaterials.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {stageMaterials.map((material, idx) => {
                        const weightInKg = calculateMaterialWeightInKg(
                          material,
                          item
                        ).toFixed(2);
                        return (
                          <div
                            key={idx}
                            className="text-sm text-red-500 flex flex-row items-center gap-2"
                          >
                            <span>کیلوگرم {weightInKg}</span>
                            <span className="font-medium">
                              :{material.materialname}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-red-500 text-sm">-</span>
                  )}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {control && itemPreInvoiceRowId ? (
                    <Controller
                      name={`${itemPreInvoiceRowId}.actualProduction`}
                      control={control}
                      render={({ field }) => {
                        const valueFromProduction =
                          productionValues[
                            `${itemPreInvoiceRowId}.actualProduction`
                          ];
                        return (
                          <Input
                            {...field}
                            value={field.value || valueFromProduction || ""}
                            onChange={(e) => {
                              field.onChange(e);

                              if (setValue) {
                                const actualProduction = parseFloat(
                                  e.target.value
                                );
                                if (
                                  !isNaN(actualProduction) &&
                                  actualProduction > 0
                                ) {
                                  const stageMaterials = filterMaterialsByStage(
                                    allMaterials,
                                    item
                                  );
                                  const consumption =
                                    calculateActualMaterialConsumption(
                                      stageMaterials,
                                      item,
                                      actualProduction
                                    );

                                  const consumptionValue =
                                    consumption.toFixed(2);
                                  const consumptionField = `${itemPreInvoiceRowId}.actualMaterialConsumption`;

                                  setMaterialConsumptionValues((prev) => ({
                                    ...prev,
                                    [consumptionField]: consumptionValue,
                                  }));

                                  setValue(consumptionField, consumptionValue, {
                                    shouldValidate: false,
                                    shouldDirty: false,
                                    shouldTouch: false,
                                  });
                                }
                              }
                            }}
                            type="text"
                            className="w-24"
                          />
                        );
                      }}
                    />
                  ) : (
                    <Input type="text" className="w-24" disabled />
                  )}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {control ? (
                    <Controller
                      name={`${itemPreInvoiceRowId}.actualMaterialConsumption`}
                      control={control}
                      render={({ field }) => {
                        const valueFromState =
                          materialConsumptionValues[
                            `${itemPreInvoiceRowId}.actualMaterialConsumption`
                          ];
                        return (
                          <Input
                            {...field}
                            value={field.value || valueFromState || ""}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                            type="text"
                            className="w-24"
                          />
                        );
                      }}
                    />
                  ) : (
                    <Input type="text" className="w-24" disabled />
                  )}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {control ? (
                    <Controller
                      name={`${itemPreInvoiceRowId}.waste`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="text" className="w-24" />
                      )}
                    />
                  ) : (
                    <Input type="text" className="w-24" disabled />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
