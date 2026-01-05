import { BASE_URL } from "./base";
import { config } from "./config";
import type {
  IStopListItem,
  ICUManagementSubmitData,
  ICUManagementRowListItem,
  ICUManagementReelsListItem,
} from "../types/type";

async function getRequestDigest(): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/_api/contextinfo`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
      },
    });

    if (!response.ok) {
      throw new Error(`خطا در دریافت Request Digest: ${response.status}`);
    }

    const data = await response.json();
    return data.d.GetContextWebInformation.FormDigestValue;
  } catch (error) {
    console.error("خطا در دریافت Request Digest:", error);
    throw error;
  }
}

export async function submitCUManagement(
  formData: ICUManagementSubmitData
): Promise<{ success: boolean; message: string }> {
  const listGuid = config.LIST_GUIDS.CU_MANAGEMENT;

  if (!listGuid) {
    throw new Error("GUID لیست CU_MANAGEMENT تنظیم نشده است");
  }

  try {
    const payload: any = {
      __metadata: {
        type: "SP.Data.CU_x005f_ManagementListItem",
      },
      Title: String(formData.productionPlanNumber || ""),
    };

    if (formData.actualAmountProduction) {
      payload.actualAmountProduction = String(formData.actualAmountProduction);
    }
    if (formData.operator) {
      payload.operator = String(formData.operator);
    }
    if (formData.productionPlanAmount) {
      payload.productionPlanAmount = String(formData.productionPlanAmount);
    }
    if (formData.preInvoiceRow) {
      const preInvoiceRowValue = String(formData.preInvoiceRow);
      payload.preInvoiceRow =
        preInvoiceRowValue.length > 65536
          ? preInvoiceRowValue.substring(0, 65536)
          : preInvoiceRowValue;
    }
    if (formData.stage) {
      payload.stage = String(formData.stage);
    }
    if (formData.device) {
      payload.device = String(formData.device);
    }
    if (formData.calculatedWeight) {
      payload.calculatedWeight = String(formData.calculatedWeight);
    }
    if (formData.actualWeight) {
      payload.actualWeight = String(formData.actualWeight);
    }
    if (formData.product) {
      payload.product = String(formData.productCode);
    }
    if (formData.description) {
      payload.description = String(formData.description);
    }

    if (formData.stopTitle) {
      payload.stopTitle = String(formData.stopTitle);
    }
    if (formData.stopCode) {
      payload.stopCode = String(formData.stopCode);
    }
    if (formData.stopTime) {
      payload.stopTime = String(formData.stopTime);
    }
    if (formData.shiftTitle) {
      payload.shiftTitle = String(formData.shiftTitle);
    }
    if (formData.shiftStartedAt) {
      payload.shiftStartedAt = String(formData.shiftStartedAt);
    }
    if (formData.shiftEndedAt) {
      payload.shiftEndedAt = String(formData.shiftEndedAt);
    }
    if (formData.waste) {
      payload.waste = String(formData.waste);
    }

    if (formData.shiftId && formData.shiftId !== "") {
      payload.shiftId = String(formData.shiftId);
    }

    if (formData.deviceId) {
      payload.deviceId = String(formData.deviceId);
    }

    if (formData.entranceWeight) {
      payload.entranceWeight = String(formData.entranceWeight);
    }

    if (formData.ordersTotalWeight) {
      payload.ordersTotalWeight = String(formData.ordersTotalWeight);
    }

    if (formData.ordersTotalAmount) {
      payload.ordersTotalAmount = String(formData.ordersTotalAmount);
    }

    const response = await fetch(
      `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": await getRequestDigest(),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `خطا در ارسال داده: ${errorText} (Status: ${response.status})`
      );
    }

    return {
      success: true,
      message: "اطلاعات با موفقیت ثبت شد ✅",
    };
  } catch (error) {
    console.error("خطا در ارسال داده به CU_MANAGEMENT:", error);
    return {
      success: false,
      message: `خطا در ثبت اطلاعات: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}

export async function submitCUManagementRow(
  rowData: ICUManagementRowListItem
): Promise<{ success: boolean; message: string }> {
  const listGuid = config.LIST_GUIDS.CU_MANAGEMENT_ROW;

  if (!listGuid) {
    throw new Error("GUID لیست CU_MANAGEMENT_ROW تنظیم نشده است");
  }

  try {
    const listInfoResponse = await fetch(
      `${BASE_URL}/_api/web/lists(guid'${listGuid}')?$select=ListItemEntityTypeFullName`,
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      }
    );

    let itemType = "SP.Data.CU_x005f_Management_x005f_RowListItem";
    if (listInfoResponse.ok) {
      try {
        const contentType = listInfoResponse.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const listInfo = await listInfoResponse.json();
          if (listInfo.d?.ListItemEntityTypeFullName) {
            itemType = listInfo.d.ListItemEntityTypeFullName;
          }
        } else if (contentType.includes("xml")) {
          const xmlText = await listInfoResponse.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const typeElement = xmlDoc.querySelector(
            "ListItemEntityTypeFullName"
          );
          if (typeElement && typeElement.textContent) {
            itemType = typeElement.textContent.trim();
          }
        }
      } catch (parseError) {
        console.warn("خطا در parse کردن پاسخ لیست:", parseError);
      }
    }

    const payload: any = {
      __metadata: {
        type: itemType,
      },
      Title: String(rowData.Title || ""),
    };

    if (rowData.customer) {
      payload.customer = String(rowData.customer);
    }
    if (rowData.productionPlanItem) {
      payload.productionPlanItem = String(rowData.productionPlanItem);
    }
    if (rowData.actualAmount) {
      payload.actualAmount = String(rowData.actualAmount);
    }
    if (rowData.orderAmount) {
      payload.orderAmount = String(rowData.orderAmount);
    }
    if (rowData.orderWeight) {
      payload.orderWeight = String(rowData.orderWeight);
    }
    if (rowData.actualWeight) {
      payload.actualWeight = String(rowData.actualWeight);
    }
    if (rowData.waste) {
      payload.waste = String(rowData.waste);
    }
    if (rowData.product) {
      payload.product = String(rowData.product);
    }
    if (rowData.productCode) {
      payload.productCode = String(rowData.productCode);
    }
    if (rowData.priority) {
      payload.priority = String(rowData.priority);
    }
    if (rowData.level) {
      payload.level = String(rowData.level);
    }
    if (rowData.levelNumber) {
      payload.levelNumber = String(rowData.levelNumber);
    }
    if (rowData.device) {
      payload.device = String(rowData.device);
    }

    const response = await fetch(
      `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": await getRequestDigest(),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ خطای SharePoint در CU_MANAGEMENT_ROW:", errorText);
      throw new Error(
        `خطا در ارسال داده: ${errorText} (Status: ${response.status})`
      );
    }

    return {
      success: true,
      message: "ردیف با موفقیت ثبت شد ✅",
    };
  } catch (error) {
    console.error("خطا در ارسال داده به CU_MANAGEMENT_ROW:", error);
    return {
      success: false,
      message: `خطا در ثبت ردیف: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}

export async function addStopItem(
  title: string,
  code?: string
): Promise<{ success: boolean; message: string; data?: IStopListItem }> {
  const listGuid = config.LIST_GUIDS.STOP_LIST;

  if (!listGuid) {
    throw new Error("GUID لیست STOP_LIST تنظیم نشده است");
  }

  if (!title || title.trim().length === 0) {
    return {
      success: false,
      message: "عنوان توقف نمی‌تواند خالی باشد",
    };
  }

  try {
    const payload: any = {
      __metadata: {
        type: "SP.Data.Stop_x0020_ListListItem",
      },
      Title: title.trim(),
    };

    if (code && code.trim().length > 0) {
      payload.Code = code.trim();
    }

    const response = await fetch(
      `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": await getRequestDigest(),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `خطا در افزودن توقف: ${errorText} (Status: ${response.status})`
      );
    }

    const result = await response.json();
    const newItem: IStopListItem = {
      Id: result.d.Id,
      Title: result.d.Title,
      Code: result.d.Code || "",
    };

    return {
      success: true,
      message: "توقف با موفقیت اضافه شد ✅",
      data: newItem,
    };
  } catch (error) {
    console.error("خطا در افزودن توقف:", error);
    return {
      success: false,
      message: `خطا در افزودن توقف: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}

export async function submitCUManagementReels(
  reelData: ICUManagementReelsListItem
): Promise<{ success: boolean; message: string }> {
  const listGuid = config.LIST_GUIDS.CU_MANAGEMENT_REELS;

  if (!listGuid) {
    throw new Error("GUID لیست CU_MANAGEMENT_REELS تنظیم نشده است");
  }

  try {
    const listInfoResponse = await fetch(
      `${BASE_URL}/_api/web/lists(guid'${listGuid}')?$select=ListItemEntityTypeFullName`,
      {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      }
    );

    let itemType = "SP.Data.CU_x005f_Management_x005f_ReelsListItem";
    if (listInfoResponse.ok) {
      try {
        const contentType = listInfoResponse.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const listInfo = await listInfoResponse.json();
          if (listInfo.d?.ListItemEntityTypeFullName) {
            itemType = listInfo.d.ListItemEntityTypeFullName;
          }
        } else if (contentType.includes("xml")) {
          const xmlText = await listInfoResponse.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const typeElement = xmlDoc.querySelector(
            "ListItemEntityTypeFullName"
          );
          if (typeElement && typeElement.textContent) {
            itemType = typeElement.textContent.trim();
          }
        }
      } catch (parseError) {
        console.warn("خطا در parse کردن پاسخ لیست:", parseError);
      }
    }

    const payload: any = {
      __metadata: {
        type: itemType,
      },
      Title: String(reelData.Title || ""),
    };

    if (reelData.reelNumber) {
      payload.reelNumber = String(reelData.reelNumber);
    }
    if (reelData.wasteCategory) {
      payload.wasteCategory = String(reelData.wasteCategory);
    }
    if (reelData.productAmount) {
      payload.productAmount = String(reelData.productAmount);
    }
    if (reelData.productWeight) {
      payload.productWeight = String(reelData.productWeight);
    }
    if (reelData.wasteWeight) {
      payload.wasteWeight = String(reelData.wasteWeight);
    }
    if (reelData.productionStage) {
      payload.productionStage = String(reelData.productionStage);
    }
    if (reelData.device) {
      payload.device = String(reelData.device);
    }
    if (reelData.operator) {
      payload.operator = String(reelData.operator);
    }
    if (reelData.statusId) {
      payload.statusId = String(reelData.statusId);
    }
    if (reelData.status) {
      payload.status = String(reelData.status);
    }
    if (reelData.preInvoiceRowNumber) {
      payload.preInvoiceRowNumber = String(reelData.preInvoiceRowNumber);
    }

    const response = await fetch(
      `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": await getRequestDigest(),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ خطای SharePoint در CU_MANAGEMENT_REELS:", errorText);
      throw new Error(
        `خطا در ارسال داده: ${errorText} (Status: ${response.status})`
      );
    }

    return {
      success: true,
      message: "قرقره با موفقیت ثبت شد ✅",
    };
  } catch (error) {
    console.error("خطا در ارسال داده به CU_MANAGEMENT_REELS:", error);
    return {
      success: false,
      message: `خطا در ثبت قرقره: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}
