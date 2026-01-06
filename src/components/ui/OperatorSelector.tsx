import { useState } from "react";
import { Input } from "./input";
import { SHIFT_LIST } from "../../lib/constants";
import { SkeletonSearchSuggestion } from "./Skeleton";
import type { IOperatorSelectorProps } from "../../types/type";
import { useSearchPersonnel } from "../../hooks/useSearchPersonnel";

export default function OperatorSelector({
  value,
  onChange,
  onShiftChange,
}: IOperatorSelectorProps) {
  const [showPersonnelSuggestions, setShowPersonnelSuggestions] =
    useState(false);
  const [shiftId, setShiftId] = useState<number | "">("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");

  const {
    searchResults: personnelResults,
    isLoading: personnelLoading,
    handleSearch: handlePersonnelSearch,
  } = useSearchPersonnel();

  return (
    <>
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

      <div className="flex items-center justify-start gap-2">
        <label className="min-w-[150px] font-medium">شیفت:</label>
        <select
          className="w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
          value={shiftId}
          onChange={(e) => {
            const id = e.target.value === "" ? "" : Number(e.target.value);
            setShiftId(id);
            const selectedShift = SHIFT_LIST.find((s) => s.id === id);
            if (onShiftChange) {
              onShiftChange({
                id,
                title: selectedShift?.title || "",
                start: shiftStart,
                end: shiftEnd,
              });
            }
          }}
        >
          <option value="">انتخاب شیفت...</option>
          {SHIFT_LIST.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-start gap-2">
        <label className="min-w-[150px] font-medium">ساعت شروع شیفت:</label>
        <Input
          value={shiftStart}
          placeholder="مثلاً 08:00"
          className="w-[250px]"
          onChange={(e) => {
            setShiftStart(e.target.value);
            if (onShiftChange) {
              const selectedShift = SHIFT_LIST.find((s) => s.id === shiftId);
              onShiftChange({
                id: shiftId,
                title: selectedShift?.title || "",
                start: e.target.value,
                end: shiftEnd,
              });
            }
          }}
        />
      </div>

      <div className="flex items-center justify-start gap-2">
        <label className="min-w-[150px] font-medium">ساعت پایان شیفت:</label>
        <Input
          value={shiftEnd}
          placeholder="مثلاً 16:00"
          className="w-[250px]"
          onChange={(e) => {
            setShiftEnd(e.target.value);
            if (onShiftChange) {
              const selectedShift = SHIFT_LIST.find((s) => s.id === shiftId);
              onShiftChange({
                id: shiftId,
                title: selectedShift?.title || "",
                start: shiftStart,
                end: e.target.value,
              });
            }
          }}
        />
      </div>
    </>
  );
}
