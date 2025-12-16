import { useState } from "react";
import { useSearchPersonnel } from "../../hooks/useSearchPersonnel";
import { useSearchStop } from "../../hooks/useSearchStop";
import type { IProductionPlanRowFormProps } from "../../types/type";
import { Input } from "./input";
import { SkeletonSearchSuggestion } from "./Skeleton";
import { Controller, useForm } from "react-hook-form";

export default function ProductionPlanRowForm({
  planItem,
  control: externalControl,
}: IProductionPlanRowFormProps) {
  // Use external control if provided, otherwise create a local one
  const localForm = useForm();
  const control = externalControl || localForm.control;
  const [showPersonnelSuggestions, setShowPersonnelSuggestions] =
    useState(false);
  const [operator, setOperator] = useState("");
  const [showStopSuggestions, setShowStopSuggestions] = useState(false);
  const [stopReason, setStopReason] = useState("");

  const {
    searchResults: personnelResults,
    isLoading: personnelLoading,
    handleSearch: handlePersonnelSearch,
  } = useSearchPersonnel();

  const {
    searchResults: stopResults,
    isLoading: stopLoading,
    handleSearch: handleStopSearch,
    handleAdd: handleAddStop,
    isAdding: isAddingStop,
  } = useSearchStop();

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
          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">مرحله:</label>
            <span className="text-lg font-normal">{planItem.marhale}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">دستگاه:</label>
            <span className="text-lg font-normal">{planItem.dasatghah}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">محصول:</label>
            <span className="text-lg font-normal">{planItem.codemahsol}</span>
          </div>

          <div className="flex items-center justify-start gap-2 border border-[#1e7677] rounded-lg py-2 px-3">
            <label className="min-w-[150px] font-medium">
              مقدار برنامه ریزی شده:
            </label>
            <span className="text-lg font-normal">{planItem.barnamerizi}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">اپراتور دستگاه:</label>
            <div className="relative">
              <Input
                value={operator}
                placeholder="جستجو اپراتور..."
                className="w-[250px]"
                onChange={(e) => {
                  const value = e.target.value;
                  setOperator(value);
                  handlePersonnelSearch(value);
                  setShowPersonnelSuggestions(true);
                }}
                onFocus={() => {
                  if (operator.trim().length > 0) {
                    setShowPersonnelSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowPersonnelSuggestions(false), 200);
                }}
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
                          setOperator(personnel.Title);
                          setShowPersonnelSuggestions(false);
                        }}
                      >
                        {personnel.Title}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      اپراتوری یافت نشد
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">متراژ تولیدی:</label>
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
            <label className="min-w-[150px] font-medium">دلیل توقفات:</label>
            <div className="relative">
              <Input
                value={stopReason}
                placeholder="جستجو یا افزودن دلیل توقف..."
                className="w-[250px]"
                onChange={(e) => {
                  const value = e.target.value;
                  setStopReason(value);
                  handleStopSearch(value);
                  setShowStopSuggestions(true);
                }}
                onFocus={() => {
                  if (stopReason.trim().length > 0) {
                    setShowStopSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowStopSuggestions(false), 200);
                }}
              />

              {showStopSuggestions && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {stopLoading ? (
                    <SkeletonSearchSuggestion count={3} />
                  ) : stopResults.length > 0 ? (
                    <>
                      {stopResults.map((stop) => (
                        <div
                          key={stop.Id}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setStopReason(stop.Title);
                            setShowStopSuggestions(false);
                          }}
                        >
                          {stop.Title} {stop.Code && `(${stop.Code})`}
                        </div>
                      ))}
                      {stopReason.trim().length > 0 &&
                        !stopResults.some(
                          (s) =>
                            s.Title.toLowerCase() === stopReason.toLowerCase()
                        ) && (
                          <div
                            className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 cursor-pointer border-t border-gray-200 font-medium text-blue-700"
                            onClick={async () => {
                              const result = await handleAddStop(stopReason);
                              if (result.success && result.data) {
                                setStopReason(result.data.Title);
                                setShowStopSuggestions(false);
                              }
                            }}
                          >
                            {isAddingStop
                              ? "در حال افزودن..."
                              : `افزودن "${stopReason}"`}
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {stopReason.trim().length > 0 ? (
                        <div
                          className="cursor-pointer hover:bg-blue-50 p-2 rounded bg-blue-50 text-blue-700 font-medium"
                          onClick={async () => {
                            const result = await handleAddStop(stopReason);
                            if (result.success && result.data) {
                              setStopReason(result.data.Title);
                              setShowStopSuggestions(false);
                            }
                          }}
                        >
                          {isAddingStop
                            ? "در حال افزودن..."
                            : `افزودن "${stopReason}"`}
                        </div>
                      ) : (
                        "دلیلی یافت نشد"
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="min-w-[150px] font-medium">ساعت توقفات:</label>
            <Controller
              name="stopTime"
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
        </div>
      </form>
    </div>
  );
}
