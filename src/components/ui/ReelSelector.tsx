import { useState } from "react";
import { Input } from "./input";
import { SkeletonSearchSuggestion } from "./Skeleton";
import { useSearchReels } from "../../hooks/useSearchReels";
import type { IReelSelectorProps, IReelItem } from "../../types/type";

export default function ReelSelector({
  reels,
  label,
  onReelsChange,
}: IReelSelectorProps) {
  const [showReelSuggestions, setShowReelSuggestions] = useState<number | null>(
    null
  );

  const {
    searchResults: reelResults,
    isLoading: reelLoading,
    handleSearch: handleReelSearch,
  } = useSearchReels();

  const handleAddReel = () => {
    const newReel: IReelItem = {
      reelId: 0,
      reelTitle: "",
      weight: "",
      amount: "",
    };
    onReelsChange([...reels, newReel]);
  };

  const handleRemoveReel = (index: number) => {
    const updatedReels = reels.filter((_, i) => i !== index);
    onReelsChange(updatedReels);
  };

  const handleReelChange = (
    index: number,
    field: keyof IReelItem,
    value: string | number
  ) => {
    const updatedReels = [...reels];
    updatedReels[index] = {
      ...updatedReels[index],
      [field]: value,
    };
    onReelsChange(updatedReels);
  };

  const handleSelectReel = (
    index: number,
    reelId: number,
    reelTitle: string
  ) => {
    handleReelChange(index, "reelId", reelId);
    handleReelChange(index, "reelTitle", reelTitle);
    setShowReelSuggestions(null);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center w-[400px] justify-between gap-12 mb-2">
        <label className="font-medium text-lg">{label}</label>
        <div
          onClick={() => handleAddReel()}
          className="px-4 py-2 cursor-pointer bg-[#1e7677] text-white rounded-lg hover:bg-[#165556] transition-colors text-sm"
        >
          + افزودن قرقره
        </div>
      </div>

      {reels.map((reel, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
        >
          <div className="relative">
            <Input
              value={reel.reelTitle}
              placeholder="جستجو قرقره..."
              className="w-full max-w-[250px]"
              onChange={(e) => {
                const value = e.target.value;
                handleReelChange(index, "reelTitle", value);
                handleReelSearch(value);
                setShowReelSuggestions(index);
              }}
              onFocus={() => {
                if (reel.reelTitle.trim().length > 0) {
                  setShowReelSuggestions(index);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowReelSuggestions(null), 200);
              }}
            />

            {showReelSuggestions === index && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {reelLoading ? (
                  <SkeletonSearchSuggestion count={3} />
                ) : reelResults.length > 0 ? (
                  reelResults.map((reelOption) => (
                    <div
                      key={reelOption.Id}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        handleSelectReel(
                          index,
                          reelOption.Id,
                          reelOption.Title
                        );
                      }}
                    >
                      {reelOption.Title}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    قرقره‌ای یافت نشد
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-[200px]">
            <Input
              value={reel.weight}
              placeholder="وزن (کیلوگرم)..."
              type="string"
              className="w-full"
              onChange={(e) => {
                handleReelChange(index, "weight", e.target.value);
              }}
            />
          </div>

          <div className="w-[200px]">
            <Input
              value={reel.amount}
              placeholder="متراژ (متر)..."
              type="string"
              className="w-full"
              onChange={(e) => {
                handleReelChange(index, "amount", e.target.value);
              }}
            />
          </div>

          <div
            onClick={() => handleRemoveReel(index)}
            className="px-3 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-700 duration-300 transition-colors text-sm"
          >
            حذف
          </div>
        </div>
      ))}

      {reels.length === 0 && (
        <div className="text-right py-4 text-gray-500 text-sm">
          هیچ قرقره‌ای اضافه نشده است
        </div>
      )}
    </div>
  );
}
