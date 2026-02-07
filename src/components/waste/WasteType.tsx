import { WASTE_LIST } from "../../lib/constants";
import { useState, useEffect, useRef } from "react";
import type { IWasteTypeProps } from "../../types/type";

export default function WasteType({
  value,
  onChange,
  compact = false,
}: IWasteTypeProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className={`flex items-center justify-start ${compact ? "gap-2" : "gap-3"}`}>
      <label className={compact ? "min-w-[100px] font-medium" : "min-w-[150px] font-medium"}>
        نوع ضایعات:
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          tabIndex={0}
          className={compact
            ? "w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
            : "w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
          }
        >
          <span className={value ? "" : "text-gray-500"}>
            {value || "انتخاب نوع ضایعات..."}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
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
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {WASTE_LIST.map((item) => (
              <div
                key={item.id}
                className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 ${value === item.value ? "bg-[#1e7677] text-white" : "hover:bg-gray-100"}`}
                onClick={() => {
                  onChange(item.value);
                  setShowDropdown(false);
                }}
              >
                {item.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
