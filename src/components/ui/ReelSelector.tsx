import { useState } from "react";
import { Input } from "./input";
import { SkeletonSearchSuggestion } from "./Skeleton";
import { useWasteList } from "../../hooks/useWasteList";
import { useSearchReels } from "../../hooks/useSearchReels";
import ReelsActionsComponent from "./ReelsActionsComponent";
import { submitCUManagementReels } from "../../api/addData";
import type { IReelSelectorProps, IReelItem } from "../../types/type";

export default function ReelSelector({
  reels,
  label,
  onReelsChange,
  productionPlanNumber = "",
  selectedStage = "",
  device = "",
  operator = "",
  preInvoiceRow = "",
}: IReelSelectorProps) {
  const [showReelSuggestions, setShowReelSuggestions] = useState<number | null>(
    null
  );
  const [showWasteDropdown, setShowWasteDropdown] = useState<number | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    searchResults: reelResults,
    isLoading: reelLoading,
    handleSearch: handleReelSearch,
  } = useSearchReels();

  const { wasteList, isLoading: wasteLoading } = useWasteList();

  const handleAddReel = () => {
    const newReel: IReelItem = {
      reelId: 0,
      reelTitle: "",
      weight: "",
      amount: "",
      wasteCategory: "",
      wasteWeight: "",
      wasteCategoryId: undefined,
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
    value: string | number | undefined
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

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = async (index: number) => {
    const reel = reels[index];
    if (!reel) return;

    // تعیین statusId و status بر اساس label
    const isEntrance = label === "قرقره‌های ورودی:";
    const statusId = isEntrance ? "1" : "2";
    const status = isEntrance ? "ورودی" : "خروجی";

    const reelData = {
      Title: productionPlanNumber || "",
      reelNumber: reel.reelTitle || "",
      wasteCategory: reel.wasteCategory || "",
      productAmount: reel.amount || "",
      productWeight: reel.weight || "",
      wasteWeight: reel.wasteWeight || "",
      productionStage: selectedStage || "",
      device: device || "",
      operator: operator || "",
      statusId: statusId,
      status: status,
      preInvoiceRowNumber: preInvoiceRow || "",
      Created: "",
      Modified: "",
    };

    try {
      const result = await submitCUManagementReels(reelData);
      if (result.success) {
        setEditingIndex(null);
        alert("قرقره با موفقیت ثبت شد ✅");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(
        `خطا در ثبت قرقره: ${
          error instanceof Error ? error.message : "خطای نامشخص"
        }`
      );
    }
  };

  const handleDelete = (index: number) => {
    handleRemoveReel(index);
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

          {label === "قرقره‌های خروجی:" && (
            <>
              <div className="relative w-[200px]">
                <div
                  onClick={() => {
                    setShowWasteDropdown(
                      showWasteDropdown === index ? null : index
                    );
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowWasteDropdown(null), 200);
                  }}
                  tabIndex={0}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#1e7677]"
                >
                  <span className={reel.wasteCategory ? "" : "text-gray-500"}>
                    {reel.wasteCategory || "انتخاب نوع ضایعات..."}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showWasteDropdown === index ? "rotate-180" : ""
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
                {showWasteDropdown === index && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {wasteLoading ? (
                      <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e7677]"></div>
                        در حال بارگذاری...
                      </div>
                    ) : wasteList.length > 0 ? (
                      wasteList.map((waste) => (
                        <div
                          key={waste.ID}
                          className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            reel.wasteCategoryId === waste.ID
                              ? "bg-[#1e7677] text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            handleReelChange(
                              index,
                              "wasteCategory",
                              waste.Title
                            );
                            handleReelChange(
                              index,
                              "wasteCategoryId",
                              waste.ID
                            );
                            setShowWasteDropdown(null);
                          }}
                        >
                          {waste.Title}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        دسته‌بندی ضایعاتی یافت نشد
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-[200px]">
                <Input
                  value={reel.wasteWeight}
                  placeholder="وزن ضایعات (کیلوگرم)..."
                  type="string"
                  className="w-full"
                  onChange={(e) => {
                    handleReelChange(index, "wasteWeight", e.target.value);
                  }}
                />
              </div>
            </>
          )}

          <ReelsActionsComponent
            index={index}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            isEditing={editingIndex === index}
          />
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
