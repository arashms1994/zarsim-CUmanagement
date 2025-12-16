import { config } from "./config";
import type {
  IEnterFormInput,
  ICUManagementFormProps,
  IDarkhastMavadListItem,
  IStopListItem,
} from "../types/type";
import { BASE_URL } from "./base";

export async function submitMaterialChargeEntry(
  formData: IEnterFormInput
): Promise<{ success: boolean; message: string }> {
  const listGuid = config.LIST_GUIDS.MATERIAL_CHARGE;

  if (!listGuid) {
    throw new Error("GUID لیست MATERIAL_CHARGE تنظیم نشده است");
  }

  try {
    const payload = {
      __metadata: {
        type: "SP.Data.Material_x005f_ChargeListItem",
      },
      Material_Category: formData.materialCategories,
      Material_Name: formData.materialName,
      Material_Supplier: formData.supplier,
      Inventory: formData.materialWeight,
      Enter_Responsible: formData.responsible,
      Enterance_Date: formData.materialEnterDate,
    };

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
    console.error("خطا در ارسال داده به MATERIAL_CHARGE:", error);
    return {
      success: false,
      message: `خطا در ثبت اطلاعات: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}

export async function submitMaterialChargeExit(
  formData: ICUManagementFormProps,
  planItem: IDarkhastMavadListItem,
  index: number
): Promise<{ success: boolean; message: string }> {
  const listGuid = config.LIST_GUIDS.MATERIAL_CHARGE;

  if (!listGuid) {
    throw new Error("GUID لیست MATERIAL_CHARGE تنظیم نشده است");
  }

  try {
    const payload = {
      __metadata: {
        type: "SP.Data.Material_x005f_ChargeListItem",
      },
      Title: formData.productionPlanNumber,
      Request_Row: (index + 1).toString(),
      Exit_Responsible: formData.responsible,
      Material_Category: planItem.dastemavadi,
      Material_Name: planItem.rizmavad,
      Material_Supplier: planItem.tamin,
      Device: planItem.dastghah,
      Phase: planItem.marhaleha,
      Request_Date: planItem.time,
      Inventory: planItem.meghdardarkhast,
      Exit_Date: formData.materialExitDate,
      Exit_Amount: formData.materialWeight,
    };

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
      message: `ردیف ${index + 1} شارژ با موفقیت ثبت شد ✅`,
    };
  } catch (error) {
    console.error("خطا در ارسال داده به MATERIAL_CHARGE:", error);
    return {
      success: false,
      message: `خطا در ثبت ردیف ${index + 1} شارژ: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}

export async function submitMaterialProductionExit(
  formData: ICUManagementFormProps,
  planItem: IDarkhastMavadListItem,
  index: number
): Promise<{ success: boolean; message: string }> {
  const listGuid = config.LIST_GUIDS.MATERIAL_PRODUCTION;

  if (!listGuid) {
    throw new Error("GUID لیست MATERIAL_PRODUCTION تنظیم نشده است");
  }

  try {
    const payload = {
      __metadata: {
        type: "SP.Data.Material_x005f_ProductionListItem",
      },
      Title: formData.productionPlanNumber,
      Request_Row: (index + 1).toString(),
      Responsible: formData.responsible,
      Material_Category: planItem.dastemavadi,
      Material_Name: planItem.rizmavad,
      Material_Supplier: planItem.tamin,
      Device: planItem.dastghah,
      Phase: planItem.marhaleha,
      Request_Date: planItem.time,
      Inventory: planItem.meghdardarkhast,
      Date: formData.materialExitDate,
      Amount: formData.materialWeight,
    };

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
      message: `ردیف ${index + 1} با موفقیت ثبت شد ✅`,
    };
  } catch (error) {
    console.error("خطا در ارسال داده به MATERIAL_PRODUCTION:", error);
    return {
      success: false,
      message: `خطا در ثبت ردیف ${index + 1}: ${
        error instanceof Error ? error.message : "خطای نامشخص"
      }`,
    };
  }
}

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
