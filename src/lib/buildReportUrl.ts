import { BASE_URL } from "../api/base";

export function buildReportUrl(
  shomareradiffactor: string | null | undefined
): string {
  const baseUrl = `${BASE_URL}/Lists/Subproductionplan/Control.aspx`;
  const viewId = "7ABE9D36-A211-4E6A-B92E-E940005F2C3A";
  const filterValue =
    shomareradiffactor && shomareradiffactor.trim()
      ? shomareradiffactor.trim()
      : "";

  const params = new URLSearchParams({
    View: `{${viewId}}`,
    FilterField1: "shomareradiffactor",
    FilterValue1: filterValue,
  });

  return `${baseUrl}?${params.toString()}`;
}
