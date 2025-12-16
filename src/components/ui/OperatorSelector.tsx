import { useState } from "react";
import { useSearchPersonnel } from "../../hooks/useSearchPersonnel";
import { Input } from "./input";
import { SkeletonSearchSuggestion } from "./Skeleton";
import type { IOperatorSelectorProps } from "../../types/type";



export default function OperatorSelector({
  value,
  onChange,
}: IOperatorSelectorProps) {
  const [showPersonnelSuggestions, setShowPersonnelSuggestions] =
    useState(false);

  const {
    searchResults: personnelResults,
    isLoading: personnelLoading,
    handleSearch: handlePersonnelSearch,
  } = useSearchPersonnel();

  return (
    <div className="flex items-center justify-start gap-2">
      <label className="min-w-[150px] font-medium">اپراتور دستگاه:</label>
      <div className="relative">
        <Input
          value={value}
          placeholder="جستجو اپراتور..."
          className="w-[250px]"
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            handlePersonnelSearch(newValue);
            setShowPersonnelSuggestions(true);
          }}
          onFocus={() => {
            if (value.trim().length > 0) {
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
                    onChange(personnel.Title);
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
  );
}
