import { BASE_URL } from "./base";

export async function getRequestDigest(): Promise<string> {
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