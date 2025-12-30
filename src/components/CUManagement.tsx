import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type { ICUManagementFormProps } from "../types/type";
import ProductionPlanRowForm from "./ui/ProductionPlanRowForm";
import { usePrintTajmiByCart } from "../hooks/usePrintTajmiByCart";
import { useSearchPrintTajmi } from "../hooks/useSearchPrintTajmi";

export default function CUManagement() {
  const { control, setValue, watch } = useForm<ICUManagementFormProps>();
  const selectedPlan = watch("productionPlanNumber");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | undefined>(
    undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );

  const {
    searchResults,
    isLoading: searchLoading,
    handleSearch,
  } = useSearchPrintTajmi();

  const { planDetails, isLoading: planLoading } =
    usePrintTajmiByCart(selectedPlan);

  const uniqueStages = useMemo(() => {
    if (!planDetails || planDetails.length === 0) return [];
    const stages = planDetails
      .map((item) => item.marhale)
      .filter((s): s is string => !!s && s.trim().length > 0);

    const uniq = Array.from(new Set(stages));

    return uniq;
  }, [planDetails]);

  const uniqueColors = useMemo(() => {
    if (!planDetails || planDetails.length === 0) return [];
    if (!selectedStage) return [];

    const colors = planDetails
      .filter((item) => item.marhale === selectedStage)
      .map((item) => item.rang)
      .filter((c): c is string => !!c && c.trim().length > 0);

    const uniq = Array.from(new Set(colors));

    return uniq;
  }, [planDetails, selectedStage]);

  const filteredPlanDetails = useMemo(() => {
    if (!planDetails || planDetails.length === 0) return [];
    if (!selectedStage) return [];

    let items = planDetails.filter((item) => item.marhale === selectedStage);

    if (uniqueColors.length > 0) {
      if (!selectedColor) return [];
      items = items.filter((item) => item.rang === selectedColor);
    }

    return items;
  }, [planDetails, selectedStage, selectedColor, uniqueColors.length]);

  const handleCartSelect = (cartNumber: string) => {
    setValue("productionPlanNumber", cartNumber);
    setShowSuggestions(false);
    setSelectedStage(undefined);
    setSelectedColor(undefined);
    setShowStageDropdown(false);
    setShowColorDropdown(false);
  };

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setSelectedColor(undefined);
    setShowStageDropdown(false);
    setShowColorDropdown(false);
  };

  return (
    <div className="space-y-4 flex flex-col w-full items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center relative gap-8">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          bgcolor="#1e7677"
          width="fit-content"
          paddingBlock={1}
          paddingInline={3}
          borderRadius={4}
        >
          <span className="text-xl font-medium text-white">
            فرم ثبت مس مصرفی بر اساس شماره برنامه
          </span>
        </Stack>

        <div className="flex items-center justify-start gap-3">
          <label htmlFor="productionPlanNumber" className="min-w-[150px]">
            شماره برنامه را وارد کنید:
          </label>
          <div className="relative">
            <Controller
              name="productionPlanNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="شماره برنامه را وارد کنید..."
                  className="w-[250px]"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleSearch(e.target.value);
                    setShowSuggestions(e.target.value.length >= 2);
                  }}
                  onFocus={() => {
                    if (field.value && field.value.length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
              )}
            />

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e7677]"></div>
                    در حال جستجو...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((plan, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCartSelect(plan)}
                    >
                      {plan}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    شماره برنامه‌ای یافت نشد
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <div className="space-y-4">
          {planLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 bg-transparent border border-[#1e7677] rounded-lg px-6 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1e7677]"></div>
                <span className="text-[#1e7677] font-medium">
                  در حال بارگذاری جزئیات برنامه {selectedPlan}
                </span>
              </div>
            </div>
          ) : planDetails ? (
            <div className="w-full flex flex-col items-center justify-center gap-5 mt-1">
              <div className="flex items-center justify-start gap-3">
                <label htmlFor="stage-select" className="min-w-[150px]">
                  مرحله را انتخاب کنید:
                </label>
                {uniqueStages.length > 0 ? (
                  <div className="relative">
                    <div
                      onClick={() => setShowStageDropdown(!showStageDropdown)}
                      onBlur={() =>
                        setTimeout(() => setShowStageDropdown(false), 200)
                      }
                      tabIndex={0}
                      className="w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
                    >
                      <span className={selectedStage ? "" : "text-gray-500"}>
                        {selectedStage || "مرحله را انتخاب کنید..."}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          showStageDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {showStageDropdown && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {uniqueStages.map((stage, index) => (
                          <div
                            key={`${stage}-${index}`}
                            className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              selectedStage === stage
                                ? "bg-[#1e7677] text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleStageChange(stage)}
                          >
                            {stage}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-[250px] px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-md bg-gray-50">
                    هیچ مرحله‌ای یافت نشد
                  </div>
                )}
              </div>

              {uniqueColors.length > 0 && (
                <div className="flex items-center justify-start gap-3">
                  <label htmlFor="color-select" className="min-w-[150px]">
                    رنگ را انتخاب کنید:
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setShowColorDropdown(!showColorDropdown)}
                      onBlur={() =>
                        setTimeout(() => setShowColorDropdown(false), 200)
                      }
                      tabIndex={0}
                      className="w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
                    >
                      <span className={selectedColor ? "" : "text-gray-500"}>
                        {selectedColor || "رنگ را انتخاب کنید..."}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          showColorDropdown ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {showColorDropdown && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {uniqueColors.map((color, index) => (
                          <div
                            key={`${color}-${index}`}
                            className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              selectedColor === color
                                ? "bg-[#1e7677] text-white"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setSelectedColor(color);
                              setShowColorDropdown(false);
                            }}
                          >
                            {color}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedStage ? (
                filteredPlanDetails.length > 0 ? (
                  filteredPlanDetails.map((planItem, index) => (
                    <ProductionPlanRowForm
                      key={index}
                      index={index}
                      planItem={planItem}
                      control={control}
                      productionPlanNumber={selectedPlan}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-4">
                      <span className="text-yellow-700 font-medium">
                        هیچ ردیفی برای مرحله "{selectedStage}" یافت نشد
                      </span>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
                    <span className="text-blue-700 font-medium">
                      لطفاً مرحله را انتخاب کنید
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-6 py-4">
                <span className="text-yellow-700 font-medium">
                  هیچ ردیفی برای برنامه {selectedPlan} یافت نشد
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
