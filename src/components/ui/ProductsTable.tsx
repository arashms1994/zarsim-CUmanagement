import { Controller } from "react-hook-form";
import { calculateCuTicu } from "../../lib/calculateCuTicu";
import type { IProductsTableProps } from "../../types/type";
import { useMaterialData } from "../../hooks/useProductMaterial";
import { Spinner } from "./spinner";
import { Input } from "./input";

export default function ProductsTable({
  items,
  isLoading,
  control,
}: IProductsTableProps) {
  const { data: materials = [], isLoading: materialsLoading } =
    useMaterialData();
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

  if (items.length === 0) {
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
          {items.map((item, index) => {
            const meghdar = item.meghdarkolesefaresh
              ? parseFloat(item.meghdarkolesefaresh.toString())
              : 0;
            const tarh = item.tarhetolid || "";
            const vahed = "متر";

            const { cu, ticu } = calculateCuTicu(
              materials,
              meghdar,
              vahed,
              tarh
            );

            const itemId = item.ID || index;
            const fieldPrefix = `products.${itemId}`;

            // ساخت URL با فیلتر shomareradiffactor
            const buildReportUrl = () => {
              const baseUrl =
                "https://portal.zarsim.com/Lists/Subproductionplan/Control.aspx";
              const viewId = "7ABE9D36-A211-4E6A-B92E-E940005F2C3A";
              const filterValue =
                item.shomareradiffactor && item.shomareradiffactor.trim()
                  ? item.shomareradiffactor.trim()
                  : "";

              console.log("🔍 اطلاعات ردیف:", {
                itemId: itemId,
                shomareradiffactor: item.shomareradiffactor,
                filterValue: filterValue,
                fullItem: item,
              });

              const params = new URLSearchParams({
                View: `{${viewId}}`,
                FilterField1: "shomareradiffactor",
                FilterValue1: filterValue,
              });

              const finalUrl = `${baseUrl}?${params.toString()}`;
              console.log("🔗 URL ساخته شده:", finalUrl);
              console.log("📋 پارامترهای URL:", Object.fromEntries(params));

              return finalUrl;
            };

            const reportUrl = buildReportUrl();
            const productName = item.codemahsol || item.mahsoletolidi || "-";

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
                  {materialsLoading ? (
                    <span className="text-purple-500 text-sm flex justify-start items-center">
                      <Spinner className="size-8 text-purple-500" />
                      در حال محاسبه...
                    </span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-red-500">
                        <span className="font-medium">CU:</span>
                        {cu.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-500">
                        <span className="font-medium">TICU:</span>
                        {ticu.toFixed(2)}
                      </span>
                    </div>
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
