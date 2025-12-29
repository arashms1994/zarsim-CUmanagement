import { useMemo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useQueries } from "@tanstack/react-query";
import type { IProductsTableProps } from "../../types/type";
import { getProductMaterialPerStage } from "../../api/getData";
import type { IProductMaterialPerStage } from "../../types/type";
import { Spinner } from "./spinner";
import { Input } from "./input";

export default function ProductsTable({
  items,
  isLoading,
  control,
  actualAmountProduction,
  setValue,
}: IProductsTableProps) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const meghdar = item.meghdarkolesefaresh
        ? parseFloat(item.meghdarkolesefaresh.toString())
        : 0;
      return meghdar >= 10;
    });
  }, [items]);

  // مرتب‌سازی بر اساس اولویت (از کوچک به بزرگ)
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const priorityA =
        a.Priority && a.Priority.trim()
          ? parseFloat(a.Priority.trim())
          : Infinity;
      const priorityB =
        b.Priority && b.Priority.trim()
          ? parseFloat(b.Priority.trim())
          : Infinity;

      // اگر اولویت معتبر نبود، به انتها می‌رود
      if (isNaN(priorityA) && isNaN(priorityB)) return 0;
      if (isNaN(priorityA)) return 1;
      if (isNaN(priorityB)) return -1;

      return priorityA - priorityB;
    });
  }, [filteredItems]);

  // محاسبه مقادیر actualProduction بر اساس اولویت
  const productionValues = useMemo(() => {
    if (!control || !actualAmountProduction) {
      return {};
    }

    const totalProduction = parseFloat(actualAmountProduction);
    if (isNaN(totalProduction) || totalProduction <= 0) {
      return {};
    }

    if (sortedItems.length === 0) {
      return {};
    }

    const values: Record<string, string> = {};

    // بررسی اینکه آیا همه آیتم‌ها اولویت دارند یا نه
    const itemsWithPriority = sortedItems.filter(
      (item) =>
        item.Priority &&
        item.Priority.trim() &&
        !isNaN(parseFloat(item.Priority.trim()))
    );

    // ابتدا همه را صفر می‌کنیم
    sortedItems.forEach((item) => {
      const itemPreInvoiceRowId = item.shomareradiffactor;
      if (itemPreInvoiceRowId) {
        values[`${itemPreInvoiceRowId}.actualProduction`] = "0";
      }
    });

    if (itemsWithPriority.length === 0) {
      // اگر هیچ اولویتی وجود نداشت، به طور مساوی تقسیم می‌کنیم
      const equalValue = (totalProduction / sortedItems.length).toFixed(2);
      sortedItems.forEach((item) => {
        const itemPreInvoiceRowId = item.shomareradiffactor;
        if (itemPreInvoiceRowId) {
          values[`${itemPreInvoiceRowId}.actualProduction`] = equalValue;
        }
      });
    } else {
      // تقسیم بر اساس اولویت
      let remainingProduction = totalProduction;
      const priorityGroups = new Map<number, typeof sortedItems>();

      // گروه‌بندی بر اساس اولویت
      itemsWithPriority.forEach((item) => {
        const priority = parseFloat(item.Priority.trim());
        if (!priorityGroups.has(priority)) {
          priorityGroups.set(priority, []);
        }
        priorityGroups.get(priority)!.push(item);
      });

      // مرتب‌سازی اولویت‌ها
      const sortedPriorities = Array.from(priorityGroups.keys()).sort(
        (a, b) => a - b
      );

      // تقسیم بر اساس اولویت
      for (const priority of sortedPriorities) {
        const itemsInPriority = priorityGroups.get(priority)!;

        for (const item of itemsInPriority) {
          if (remainingProduction <= 0) {
            break;
          }

          const itemPreInvoiceRowId = item.shomareradiffactor;
          if (!itemPreInvoiceRowId) {
            continue;
          }

          const meghdar = item.meghdarkolesefaresh
            ? parseFloat(item.meghdarkolesefaresh.toString())
            : 0;

          // مقدار قابل تخصیص برای این آیتم
          const allocated = Math.min(meghdar, remainingProduction);

          if (allocated > 0) {
            values[`${itemPreInvoiceRowId}.actualProduction`] =
              allocated.toFixed(2);
            remainingProduction -= allocated;
          }
        }

        if (remainingProduction <= 0) {
          break;
        }
      }
    }

    return values;
  }, [sortedItems, actualAmountProduction, control]);

  // تنظیم مقادیر در فرم
  useEffect(() => {
    if (setValue && Object.keys(productionValues).length > 0) {
      // استفاده از setTimeout برای اطمینان از اینکه Controller ها render شده‌اند
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

  const uniqueTarhetolids = useMemo(() => {
    const tarhetolids = filteredItems
      .map((item) => item.tarhetolid)
      .filter((t): t is string => !!t && t.trim().length > 0);
    return Array.from(new Set(tarhetolids));
  }, [filteredItems]);

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

            const buildReportUrl = () => {
              const baseUrl =
                "https://portal.zarsim.com/Lists/Subproductionplan/Control.aspx";
              const viewId = "7ABE9D36-A211-4E6A-B92E-E940005F2C3A";
              const filterValue =
                item.shomareradiffactor && item.shomareradiffactor.trim()
                  ? item.shomareradiffactor.trim()
                  : "";

              const params = new URLSearchParams({
                View: `{${viewId}}`,
                FilterField1: "shomareradiffactor",
                FilterValue1: filterValue,
              });

              return `${baseUrl}?${params.toString()}`;
            };

            const reportUrl = buildReportUrl();
            const productName = item.codemahsol || item.mahsoletolidi || "-";

            let maxStageNumber: number | null = null;
            if (item.shomaremarhale && item.shomaremarhale.trim()) {
              const stageString = item.shomaremarhale.trim();

              if (stageString.includes(";")) {
                const stageNumbers = stageString
                  .split(";")
                  .map((s: string) => s.trim())
                  .filter((s: string) => s.length > 0)
                  .map((s: string) => parseFloat(s))
                  .filter((n: number) => !isNaN(n));

                maxStageNumber =
                  stageNumbers.length > 0 ? Math.max(...stageNumbers) : null;
              } else {
                const stageNumber = parseFloat(stageString);
                maxStageNumber = !isNaN(stageNumber) ? stageNumber : null;
              }
            }

            const stageMaterials = allMaterials.filter((material) => {
              if (item.tarhetolid) {
                if (
                  !material.Title ||
                  !material.Title.includes(item.tarhetolid)
                ) {
                  return false;
                }
              }

              if (maxStageNumber === null || isNaN(maxStageNumber)) {
                return false;
              }

              const marhaleString = String(material.marhale).trim();
              if (!marhaleString) return false;

              let materialMarhale: number | null = null;

              if (marhaleString.includes(";")) {
                const marhaleNumbers = marhaleString
                  .split(";")
                  .map((m: string) => m.trim())
                  .filter((m: string) => m.length > 0)
                  .map((m: string) => parseFloat(m))
                  .filter((n: number) => !isNaN(n));

                materialMarhale =
                  marhaleNumbers.length > 0
                    ? Math.max(...marhaleNumbers)
                    : null;
              } else {
                const marhaleNumber = parseFloat(marhaleString);
                materialMarhale = !isNaN(marhaleNumber) ? marhaleNumber : null;
              }

              if (materialMarhale === null || isNaN(materialMarhale)) {
                return false;
              }

              return materialMarhale <= maxStageNumber;
            });

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
                        const meghdar = item.meghdarkolesefaresh
                          ? parseFloat(item.meghdarkolesefaresh.toString())
                          : 0;
                        const weightInKg = (
                          (material.vahed * meghdar) /
                          1000
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
                        // استفاده از مقدار از productionValues اگر موجود باشد
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
                      render={({ field }) => (
                        <Input {...field} type="text" className="w-24" />
                      )}
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
