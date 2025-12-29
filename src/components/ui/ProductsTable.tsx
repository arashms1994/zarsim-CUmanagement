import { useMemo } from "react";
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
}: IProductsTableProps) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const meghdar = item.meghdarkolesefaresh
        ? parseFloat(item.meghdarkolesefaresh.toString())
        : 0;
      return meghdar >= 10;
    });
  }, [items]);

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

  if (filteredItems.length === 0) {
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
          {filteredItems.map((item, index) => {
            const itemId = item.ID || index;
            const fieldPrefix = `products.${itemId}`;

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

            const stageNumber =
              item.shomaremarhale && item.shomaremarhale.trim()
                ? parseFloat(item.shomaremarhale.trim())
                : null;

            const stageMaterials = allMaterials.filter((material) => {
              if (item.tarhetolid) {
                if (
                  !material.Title ||
                  !material.Title.includes(item.tarhetolid)
                ) {
                  return false;
                }
              }

              if (stageNumber === null || isNaN(stageNumber)) return false;

              const marhaleString = String(material.marhale).trim();
              if (!marhaleString) return false;

              if (marhaleString.includes(";")) {
                const marhaleNumbers = marhaleString
                  .split(";")
                  .map((m: string) => m.trim())
                  .filter((m: string) => m.length > 0)
                  .map((m: string) => parseFloat(m))
                  .filter((n: number) => !isNaN(n));

                return marhaleNumbers.includes(stageNumber);
              }

              const marhaleNumber = parseFloat(marhaleString);
              return !isNaN(marhaleNumber) && marhaleNumber === stageNumber;
            });

            return (
              <tr
                key={itemId}
                className="bg-gray-50 hover:bg-gray-100 transition-colors"
              >
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
                          itemId,
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
                  {control ? (
                    <Controller
                      name={`${fieldPrefix}.actualProduction`}
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
                      name={`${fieldPrefix}.actualMaterialConsumption`}
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
                      name={`${fieldPrefix}.waste`}
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
