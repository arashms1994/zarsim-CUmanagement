import type { ISubProductionPlanListItem } from "../../types/type";

interface ProductsTableProps {
  items: ISubProductionPlanListItem[];
  isLoading: boolean;
}

export default function ProductsTable({
  items,
  isLoading,
}: ProductsTableProps) {
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
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
