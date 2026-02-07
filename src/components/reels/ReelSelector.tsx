import { useState, useRef } from "react";
import { Input } from "../ui/input";
import ReelsAmount from "./ReelsAmount";
import ReelsWeight from "./ReelsWeight";
import WasteType from "../waste/WasteType";
import WasteWeight from "../waste/WasteWeight";
import { useQueryClient } from "@tanstack/react-query";
import { SkeletonSearchSuggestion } from "../ui/Skeleton";
import { useSearchReels } from "../../hooks/useSearchReels";
import ReelsActionsComponent from "./ReelsActionsComponent";
import { deleteCUManagementReel } from "../../api/deleteData";
import type { IReelSelectorProps, IReelItem } from "../../types/type";
import {
  submitCUManagementReels,
  updateCUManagementReels,
} from "../../api/addData";

export default function ReelSelector({
  reels,
  label,
  onReelsChange,
  productionPlanNumber = "",
  selectedStage = "",
  device = "",
  operator = "",
  preInvoiceRow = "",
  materialConsumptionPerString = null,
}: IReelSelectorProps) {
  const [showReelSuggestions, setShowReelSuggestions] = useState<number | null>(
    null
  );
  const [editingReelIndex, setEditingReelIndex] = useState<number | null>(null);
  const originalReelSnapshotRef = useRef<IReelItem | null>(null);
  const queryClient = useQueryClient();

  const {
    searchResults: reelResults,
    isLoading: reelLoading,
    handleSearch: handleReelSearch,
  } = useSearchReels();

  // const { wasteList, isLoading: wasteLoading } = useWasteList();

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

  const handleWasteChange = (
    index: number,
    wasteType: string,
    wasteWeight: string
  ) => {
    const updatedReels = [...reels];
    updatedReels[index] = {
      ...updatedReels[index],
      wasteCategory: wasteType,
      wasteWeight: wasteWeight,
    };
    onReelsChange(updatedReels);
  };

  const handleReelWeightAndAmountChange = (
    index: number,
    weight: string,
    amount: string
  ) => {
    const updatedReels = [...reels];
    updatedReels[index] = {
      ...updatedReels[index],
      weight,
      amount,
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
    if (editingReelIndex !== null && editingReelIndex !== index) {
      const original = originalReelSnapshotRef.current;
      if (original) {
        const updatedReels = [...reels];
        updatedReels[editingReelIndex] = { ...original };
        onReelsChange(updatedReels);
        originalReelSnapshotRef.current = null;
      }
    }
    const reel = reels[index];
    if (reel) {
      originalReelSnapshotRef.current = { ...reel };
    }
    setEditingReelIndex(index);
  };

  const handleCancel = (index: number) => {
    const original = originalReelSnapshotRef.current;
    if (original) {
      const updatedReels = [...reels];
      updatedReels[index] = { ...original };
      onReelsChange(updatedReels);
      originalReelSnapshotRef.current = null;
    }
    setEditingReelIndex(null);
  };

  const handleSave = async (index: number) => {
    const reel = reels[index];
    if (!reel) return;

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
    };

    try {
      if (reel.reelId > 0) {
        const result = await updateCUManagementReels(reel.reelId, reelData);
        if (result.success) {
          originalReelSnapshotRef.current = null;
          setEditingReelIndex(null);
          queryClient.invalidateQueries({ queryKey: ["cu-management-reels"] });
        } else {
          console.error(result.message);
        }
      } else {
        const result = await submitCUManagementReels(reelData);
        if (result.success) {
          originalReelSnapshotRef.current = null;
          setEditingReelIndex(null);
          const newId = result.newItemId;
          if (typeof newId === "number") {
            const updatedReels = [...reels];
            updatedReels[index] = { ...reel, reelId: newId };
            onReelsChange(updatedReels);
          }
          queryClient.invalidateQueries({ queryKey: ["cu-management-reels"] });
        } else {
          console.error(result.message);
        }
      }
    } catch (error) {
      console.error("❌ خطا در ثبت قرقره:", error);
    }
  };

  const handleDelete = async (index: number) => {
    const reel = reels[index];
    if (!reel) return;

    if (reel.reelId > 0) {
      try {
        const result = await deleteCUManagementReel(reel.reelId);
        if (result.success) {
          handleRemoveReel(index);
          queryClient.invalidateQueries({ queryKey: ["cu-management-reels"] });
        } else {
          console.error(result.message)
        }
      } catch (error) {
        console.error("❌ خطا در حذف قرقره:", error);
      }
    } else {
      handleRemoveReel(index);
    }
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

      {reels.map((reel, index) => {
        const isExistingReel = reel.reelId > 0;
        const isReelEditable = !isExistingReel || editingReelIndex === index;

        return (
          <div
            key={index}
            className="flex flex-wrap justify-start items-center gap-3 p-3 rounded-lg bg-gray-50 border border-[#1e7677]"
          >
            <div className="flex items-center justify-start gap-2 min-w-[250px]">
              <label className="min-w-[100px] font-medium">شماره قرقره:</label>
              {isReelEditable ? (
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
              ) : (
                <span className="text-lg font-normal">
                  {reel.reelTitle || "-"}
                </span>
              )}
            </div>

            {isReelEditable ? (
              <>
                <ReelsWeight
                  value={reel.weight}
                  materialConsumptionPerString={materialConsumptionPerString}
                  onWeightAndAmountChange={(weight, amount) =>
                    handleReelWeightAndAmountChange(index, weight, amount)
                  }
                  onReelChange={(field, value) => handleReelChange(index, field, value)}
                />

                <ReelsAmount
                  value={reel.amount}
                  materialConsumptionPerString={materialConsumptionPerString}
                  onWeightAndAmountChange={(weight, amount) =>
                    handleReelWeightAndAmountChange(index, weight, amount)
                  }
                  onReelChange={(field, value) => handleReelChange(index, field, value)}
                />
              </>
            ) : (
              <>
                <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3 w-[200px]">
                  <label className="min-w-[50px] font-medium text-sm">وزن:</label>
                  <span className="text-lg font-normal">
                    {reel.weight ? `${reel.weight} کیلوگرم` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3 w-[200px]">
                  <label className="min-w-[50px] font-medium text-sm">متراژ:</label>
                  <span className="text-lg font-normal">
                    {reel.amount ? `${reel.amount} متر` : "-"}
                  </span>
                </div>
              </>
            )}

            {label === "قرقره‌های خروجی:" && isReelEditable && (
              <div className="w-full flex items-center justify-start gap-3">
                <WasteType
                  value={reel.wasteCategory || ""}
                  onChange={(value) =>
                    handleWasteChange(index, value, reel.wasteWeight || "")
                  }
                  compact
                />
                <WasteWeight
                  value={reel.wasteWeight || ""}
                  onChange={(value) =>
                    handleWasteChange(index, reel.wasteCategory || "", value)
                  }
                  compact
                />
              </div>
            )}
            {label === "قرقره‌های خروجی:" && !isReelEditable && (
              <div className="flex items-center justify-start gap-2 rounded-lg py-2 px-3">
                <span className="text-sm text-gray-500">
                  {reel.wasteCategory
                    ? `${reel.wasteCategory}${reel.wasteWeight ? ` - ${reel.wasteWeight} kg` : ""}`
                    : "-"}
                </span>
              </div>
            )}

            <ReelsActionsComponent
              index={index}
              reel={reel}
              isEditing={editingReelIndex === index}
              onEdit={handleEdit}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={handleCancel}
            />
          </div>
        );
      })}

      {reels.length === 0 && (
        <div className="text-right py-4 text-gray-500 text-sm">
          هیچ قرقره‌ای اضافه نشده است
        </div>
      )}
    </div>
  );
}
