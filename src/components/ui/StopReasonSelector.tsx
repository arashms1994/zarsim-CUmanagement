import { useState } from "react";
import { Input } from "./input";
import { Controller } from "react-hook-form";
import { SkeletonSearchSuggestion } from "./Skeleton";
import { useSearchStop } from "../../hooks/useSearchStop";
import type { IStopReasonSelectorProps } from "../../types/type";
import type { IStopListItem } from "../../types/type";

export default function StopReasonSelector({
  stopReason,
  onStopReasonChange,
  control,
  onStopItemChange,
}: IStopReasonSelectorProps) {
  const [showStopSuggestions, setShowStopSuggestions] = useState(false);

  const {
    searchResults: stopResults,
    isLoading: stopLoading,
    handleSearch: handleStopSearch,
  } = useSearchStop();

  return (
    <>
      <div className="flex items-center justify-start gap-2">
        <label className="min-w-[150px] font-medium">دلیل توقفات:</label>
        <div className="relative">
          <Input
            value={stopReason}
            placeholder="جستجو دلیل توقف..."
            className="w-[250px]"
            onChange={(e) => {
              const value = e.target.value;
              onStopReasonChange(value);
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
                stopResults.map((stop: IStopListItem) => (
                  <div
                    key={stop.Id}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      onStopReasonChange(stop.Title);
                      if (onStopItemChange) {
                        onStopItemChange(stop);
                      }
                      setShowStopSuggestions(false);
                    }}
                  >
                    {stop.Title} {stop.Code && `(${stop.Code})`}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  دلیلی یافت نشد
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
              placeholder="مثلاً 10:00"
              className="w-[250px]"
            />
          )}
        />
      </div>
    </>
  );
}
