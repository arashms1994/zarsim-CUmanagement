import { calculateCuTicu } from "../../lib/calculateCuTicu";
import type { IProductsTableProps } from "../../types/type";
import { useMaterialData } from "../../hooks/useProductMaterial";
import { Spinner } from "./spinner";

export default function ProductsTable({
  items,
  isLoading,
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-[#1e7677] rounded-lg">
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

            return (
              <tr
                key={item.ID || index}
                className="bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {item.tarhetolid || "-"}
                </td>
                <td className="border border-[#1e7677] px-4 py-2 text-right">
                  {item.codemahsol || item.mahsoletolidi || "-"}
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
                        <span className="font-medium">CU:</span>{cu.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-500">
                        <span className="font-medium">TICU:</span>
                        {ticu.toFixed(2)}
                      </span>
                    </div>
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
