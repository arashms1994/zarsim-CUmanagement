import { BASE_URL } from "./base";
import { config } from "./config";
import type {
  IPersonnelItem,
  ISubProductionPlanListItem,
  IPrintTajmiListItem,
  IStopListItem,
  IDevicesListItem,
} from "../types/type";

export async function getDevice(): Promise<IDevicesListItem[]> {
  let items: IDevicesListItem[] = [];

  const listGuid = config.LIST_GUIDS.DEVICES_LIST;
  if (!listGuid) {
    throw new Error("GUID لیست DEVICES_LIST تنظیم نشده است");
  }
  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=ID,Title,Level`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن لیست دستگاه ها: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: IDevicesListItem[]; __next?: string };
      } = await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error("خطا در دریافت لیست دستگاه ها:", err);
    throw err;
  }
}

export async function getPersonnel(): Promise<IPersonnelItem[]> {
  let items: IPersonnelItem[] = [];

  const listGuid = config.LIST_GUIDS.PERSONNEL;
  const encodedDepartment = encodeURIComponent("کارخانه");
  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=ID,Title&$filter=Department eq '${encodedDepartment}'`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن لیست پرسنل: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: IPersonnelItem[]; __next?: string };
      } = await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error("خطا در دریافت لیست پرسنل:", err);
    throw err;
  }
}

export async function searchSubProductionPlans(
  term: string
): Promise<string[]> {
  const listGuid = config.LIST_GUIDS.SUB_PRODUCTION_PLAN;
  if (!term || term.trim().length < 2) return [];

  const encodedTerm = encodeURIComponent(term.trim());
  const url = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=Id,shomarecart&$filter=startswith(shomarecart,'${encodedTerm}')&$orderby=shomarecart&$top=50`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`خطا در جستجوی شماره کارت: ${err} (Status: ${res.status})`);
  }

  const json: {
    d: { results: Pick<ISubProductionPlanListItem, "shomarecart">[] };
  } = await res.json();

  const uniques = (json.d?.results ?? [])
    .map((i) => i.shomarecart)
    .filter((v): v is string => Boolean(v))
    .reduce<string[]>((acc, cur) => {
      if (!acc.includes(cur)) acc.push(cur);
      return acc;
    }, []);

  return uniques;
}

export async function getSubProductionPlanByCart(
  cartNumber: string
): Promise<ISubProductionPlanListItem[]> {
  const listGuid = config.LIST_GUIDS.SUB_PRODUCTION_PLAN;
  if (!cartNumber || cartNumber.trim().length === 0) return [];

  let items: ISubProductionPlanListItem[] = [];
  const encodedCartNumber = encodeURIComponent(cartNumber.trim());

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$filter=shomarecart eq '${encodedCartNumber}'&$orderby=ID desc`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن آیتم‌های کارت ${cartNumber}: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: ISubProductionPlanListItem[]; __next?: string };
      } = await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error(`خطا در دریافت آیتم‌های کارت ${cartNumber}:`, err);
    throw err;
  }
}

export async function searchPrintTajmi(term: string): Promise<string[]> {
  const listGuid = config.LIST_GUIDS.PRINT_TAJMI;
  if (!term || term.trim().length < 2) return [];

  const encodedTerm = encodeURIComponent(term.trim());
  const url = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=Id,Title&$filter=startswith(Title,'${encodedTerm}')&$orderby=Title&$top=50`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`خطا در جستجوی شماره کارت: ${err} (Status: ${res.status})`);
  }

  const json: {
    d: { results: Pick<IPrintTajmiListItem, "Title">[] };
  } = await res.json();

  const uniques = (json.d?.results ?? [])
    .map((i) => i.Title)
    .filter((v): v is string => Boolean(v))
    .reduce<string[]>((acc, cur) => {
      if (!acc.includes(cur)) acc.push(cur);
      return acc;
    }, []);

  return uniques;
}

export async function getPrintTajmi(
  cartNumber: string
): Promise<IPrintTajmiListItem[]> {
  const listGuid = config.LIST_GUIDS.PRINT_TAJMI;
  if (!cartNumber || cartNumber.trim().length === 0) return [];

  const encodedCartNumber = encodeURIComponent(cartNumber.trim());

  let items: IPrintTajmiListItem[] = [];
  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$filter=Title eq '${encodedCartNumber}'&$orderby=ID desc`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن آیتم‌های کارت ${cartNumber}: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: IPrintTajmiListItem[]; __next?: string };
      } = await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error(`خطا در دریافت آیتم‌های کارت ${cartNumber}:`, err);
    throw err;
  }
}

export async function getStopList(): Promise<IStopListItem[]> {
  let items: IStopListItem[] = [];

  const listGuid = config.LIST_GUIDS.STOP_LIST;
  if (!listGuid) {
    throw new Error("GUID لیست STOP_LIST تنظیم نشده است");
  }

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=Id,Title,Code`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(
          `خطا در گرفتن لیست توقفات: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: IStopListItem[]; __next?: string };
      } = await res.json();

      const results = json.d?.results;
      if (!Array.isArray(results)) {
        throw new Error(
          "ساختار داده‌ی برگشتی نامعتبر است: results یک آرایه نیست"
        );
      }

      items = [...items, ...results];
      nextUrl = json.d.__next ?? null;
    }

    return items;
  } catch (err) {
    console.error("خطا در دریافت لیست توقفات:", err);
    throw err;
  }
}
