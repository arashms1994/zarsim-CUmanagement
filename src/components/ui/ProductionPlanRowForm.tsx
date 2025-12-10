import { useState } from "react";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { SkeletonSearchSuggestion } from "../ui/Skeleton";
import { getPersianDate } from "../../lib/getPersianDate";
import { useSearchPersonnel } from "../../hooks/useSearchPersonnel";
import type {
  IExitFormProps,
  IProductionPlanRowFormProps,
} from "../../types/type";

export default function ProductionPlanRowForm({
  index = 0,
  planItem,
  onSubmit: customOnSubmit,
}: IProductionPlanRowFormProps) {
  const { control, handleSubmit, setValue } = useForm<IExitFormProps>({
    defaultValues: {
      productionPlanNumber: planItem.shpmarebarname,
      materialCategories: planItem.dastemavadi,
      materialName: planItem.rizmavad,
      supplier: planItem.tamin,
      selectedMachine: planItem.dastghah,
      materialWeight: "",
      responsible: "",
      materialExitDate: getPersianDate(),
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPersonnelSuggestions, setShowPersonnelSuggestions] =
    useState(false);

  const {
    searchResults: personnelResults,
    isLoading: personnelLoading,
    handleSearch: handlePersonnelSearch,
  } = useSearchPersonnel();

  const onSubmit = async (data: IExitFormProps) => {
    try {
      setLoading(true);

      if (!customOnSubmit) {
        toast.error("تابع ارسال تعریف نشده است");
        return;
      }

      const result = await customOnSubmit(data, planItem, index);

      if (result.success) {
        toast.success(result.message);
        setValue("responsible", "");
        setValue("materialWeight", "");
        setValue("materialExitDate", getPersianDate());
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-5 gap-2 flex justify-between items-center flex-wrap rounded-[4px] border-2 shadow border-[#1e7677] relative">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="bg-[#1e7677] text-center px-3 py-2 rounded-lg">
          <span className="text-lg font-normal text-white">
            جزئیات ردیف {index + 1}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">دسته‌بندی مواد:</label>
            <span className="text-lg font-normal">{planItem.dastemavadi}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">نام مواد:</label>
            <span className="text-lg font-normal">{planItem.rizmavad}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">تأمین‌کننده:</label>
            <span className="text-lg font-normal">{planItem.tamin}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">دستگاه:</label>
            <span className="text-lg font-normal">{planItem.dastghah}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">تاریخ درخواست:</label>
            <span className="text-lg font-normal">{planItem.time}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">مرحله:</label>
            <span className="text-lg font-normal">{planItem.marhaleha}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              موجودی(کیلوگرم):
            </label>
            <span className="text-lg font-normal">
              {planItem.meghdardarkhast}
            </span>
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              تاریخ خروج مواد:
            </label>
            <Controller
              name="materialExitDate"
              control={control}
              render={({ field }) => (
                <Input {...field} className="w-[250px]" readOnly />
              )}
            />
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">
              وزن مواد (کیلوگرم):
            </label>
            <Controller
              name="materialWeight"
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
              شخص تحویل‌گیرنده:
            </label>
            <div className="relative">
              <Controller
                name="responsible"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="جستجو تحویل‌گیرنده..."
                    className="w-[250px]"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handlePersonnelSearch(e.target.value);
                      setShowPersonnelSuggestions(true);
                    }}
                    onFocus={() => {
                      setShowPersonnelSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowPersonnelSuggestions(false), 200);
                    }}
                  />
                )}
              />

              {showPersonnelSuggestions && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {personnelLoading ? (
                    <SkeletonSearchSuggestion count={3} />
                  ) : personnelResults.length > 0 ? (
                    personnelResults.map((personnel) => (
                      <div
                        key={personnel.ID}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setValue("responsible", personnel.Title);
                          setShowPersonnelSuggestions(false);
                        }}
                      >
                        {personnel.Title}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      تحویل‌گیرنده‌ای یافت نشد
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div
            onClick={!loading ? handleSubmit(onSubmit) : undefined}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1e7677] hover:bg-[#165556] text-white cursor-pointer"
            }`}
          >
            {loading ? "در حال ارسال..." : `ثبت ردیف ${index + 1}`}
          </div>
        </div>
      </form>
    </div>
  );
}
