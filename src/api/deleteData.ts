import { BASE_URL } from "./base";
import { config } from "./config";
import { getRequestDigest } from "./addData";

export async function deleteCUManagementReel(
    itemId: number
): Promise<{ success: boolean; message: string }> {
    const listGuid = config.LIST_GUIDS.CU_MANAGEMENT_REELS;

    if (!listGuid) {
        throw new Error("GUID لیست CU_MANAGEMENT_REELS تنظیم نشده است");
    }

    try {
        const response = await fetch(
            `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items(${itemId})`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-HTTP-Method": "DELETE",
                    "IF-MATCH": "*",
                    "X-RequestDigest": await getRequestDigest(),
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ خطای SharePoint در حذف قرقره:", errorText);
            throw new Error(
                `خطا در حذف قرقره: ${errorText} (Status: ${response.status})`
            );
        }

        return {
            success: true,
            message: "قرقره با موفقیت حذف شد ✅",
        };
    } catch (error) {
        console.error("خطا در حذف قرقره:", error);
        return {
            success: false,
            message: `خطا در حذف قرقره: ${error instanceof Error ? error.message : "خطای نامشخص"
                }`,
        };
    }
}