import type {
  IPrintTajmiListItem,
  ISubProductionPlanListItem,
} from "../types/type";

export interface ResetFormFieldsParams {
  reset?: () => void;
  setValue?: (name: string, value: any) => void;
  setOperator: (value: string) => void;
  setStopReason: (value: string) => void;
  setDeviceName: (value: string) => void;
  setDeviceId: (value: number | null) => void;
  setEntranceReels: (value: any[]) => void;
  setExitReels: (value: any[]) => void;
  setShiftData: (value: {
    id: number | "";
    title: string;
    start: string;
    end: string;
  }) => void;
  setStopItem: (value: any) => void;
  filteredPlanItems: ISubProductionPlanListItem[];
  planItem: IPrintTajmiListItem;
}

export function resetFormFields(params: ResetFormFieldsParams): void {
  const {
    reset,
    setValue,
    setOperator,
    setStopReason,
    setDeviceName,
    setDeviceId,
    setEntranceReels,
    setExitReels,
    setShiftData,
    setStopItem,
    filteredPlanItems,
    planItem,
  } = params;

  if (reset) {
    reset();
  }

  setOperator("");
  setStopReason("");
  setDeviceName(planItem.dasatghah || "");
  setDeviceId(null);
  setEntranceReels([]);
  setExitReels([]);
  setShiftData({
    id: "",
    title: "",
    start: "",
    end: "",
  });
  setStopItem(null);

  if (setValue) {
    setValue("actualAmountProduction", "");
    setValue("actualWeight", "");
    setValue("waste", "");
    setValue("description", "");
    setValue("stopTime", "");

    filteredPlanItems.forEach((item) => {
      const itemPreInvoiceRowId = item.shomareradiffactor;
      if (itemPreInvoiceRowId) {
        setValue(`${itemPreInvoiceRowId}.actualProduction`, "");
        setValue(`${itemPreInvoiceRowId}.actualMaterialConsumption`, "");
        setValue(`${itemPreInvoiceRowId}.waste`, "");
      }
    });
  }
}
