import { useState, useMemo } from "react";
import { Input } from "./input";
import { SkeletonSearchSuggestion } from "./Skeleton";
import { useSearchDevice } from "../../hooks/useSearchDevice";
import type { IDeviceSelectorProps } from "../../types/type";

export default function DeviceSelector({
  value,
  onChange,
  marhale,
  onDeviceChange,
}: IDeviceSelectorProps) {
  const [showDeviceSuggestions, setShowDeviceSuggestions] = useState(false);

  const {
    searchResults: deviceResults,
    allDevices,
    isLoading: deviceLoading,
    handleSearch: handleDeviceSearch,
    searchTerm,
  } = useSearchDevice();

  const devicesToFilter =
    searchTerm.trim().length > 0 ? deviceResults : allDevices;

  const filteredDevices = useMemo(() => {
    if (!marhale) return devicesToFilter;
    return devicesToFilter.filter(
      (device) => device.Level && device.Level.trim() === marhale.trim()
    );
  }, [devicesToFilter, marhale]);

  return (
    <div className="flex items-center justify-start gap-2">
      <label className="min-w-[150px] font-medium">نام دستگاه:</label>
      <div className="relative">
        <Input
          value={value}
          placeholder="جستجو نام دستگاه..."
          className="w-[250px]"
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            handleDeviceSearch(newValue);
            setShowDeviceSuggestions(true);
          }}
          onFocus={() => {
            setShowDeviceSuggestions(true);
            if (value.trim().length === 0) {
              handleDeviceSearch("");
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowDeviceSuggestions(false), 200);
          }}
        />

        {showDeviceSuggestions && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {deviceLoading ? (
              <SkeletonSearchSuggestion count={3} />
            ) : filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <div
                  key={device.ID}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    onChange(device.Title);
                    if (onDeviceChange) {
                      onDeviceChange({ id: device.ID, title: device.Title });
                    }
                    setShowDeviceSuggestions(false);
                  }}
                >
                  {device.Title}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {marhale
                  ? `دستگاهی برای مرحله "${marhale}" یافت نشد`
                  : "دستگاهی یافت نشد"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
