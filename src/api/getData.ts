import { BASE_URL } from "./base";
import { config } from "./config";
import type {
  IDarkhastMavadListItem,
  ISupplierItem,
  IPersonnelItem,
  ISubProductionPlanListItem,
} from "../types/type";

export async function getDarkhastMavadList(): Promise<
  IDarkhastMavadListItem[] | null
> {
  let items: IDarkhastMavadListItem[] = [];

  const listGuid = config.LIST_GUIDS.DARKHAST_MAVAD;
  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$orderby=ID desc`;

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
          `خطا در گرفتن آیتم‌های DarkhastMavad: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: IDarkhastMavadListItem[]; __next?: string };
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
    console.error("خطا در دریافت آیتم‌های DarkhastMavad:", err);
    throw err;
  }
}

export async function searchDarkhastMavadPlans(
  term: string
): Promise<string[]> {
  const listGuid = config.LIST_GUIDS.DARKHAST_MAVAD;
  if (!term || term.trim().length < 2) return [];

  const encodedTerm = encodeURIComponent(term.trim());
  const url = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=Id,shpmarebarname&$filter=startswith(shpmarebarname,'${encodedTerm}')&$orderby=shpmarebarname&$top=50`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-Type": "application/json;odata=verbose",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `خطا در جستجوی شماره برنامه: ${err} (Status: ${res.status})`
    );
  }

  const json: {
    d: { results: Pick<IDarkhastMavadListItem, "shpmarebarname">[] };
  } = await res.json();

  const uniques = (json.d?.results ?? [])
    .map((i) => i.shpmarebarname)
    .filter((v): v is string => Boolean(v))
    .reduce<string[]>((acc, cur) => {
      if (!acc.includes(cur)) acc.push(cur);
      return acc;
    }, []);

  return uniques;
}

export async function getDarkhastMavadListByPlan(
  planNumber: string
): Promise<IDarkhastMavadListItem[]> {
  const listGuid = config.LIST_GUIDS.DARKHAST_MAVAD;
  if (!planNumber || planNumber.trim().length === 0) return [];

  let items: IDarkhastMavadListItem[] = [];
  const encodedPlanNumber = encodeURIComponent(planNumber.trim());

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$filter=shpmarebarname eq '${encodedPlanNumber}'&$orderby=ID desc`;

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
          `خطا در گرفتن آیتم‌های برنامه ${planNumber}: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: IDarkhastMavadListItem[]; __next?: string };
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
    console.error(`خطا در دریافت آیتم‌های برنامه ${planNumber}:`, err);
    throw err;
  }
}

export async function getSuppliers(): Promise<ISupplierItem[]> {
  let items: ISupplierItem[] = [];

  const listGuid = config.LIST_GUIDS.SUPPLIERS;
  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items??$select=ID,Supplier`;

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
          `خطا در گرفتن آیتم‌های DarkhastMavad: ${err} (Status: ${res.status})`
        );
      }

      const json: {
        d: { results: ISupplierItem[]; __next?: string };
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
    console.error("خطا در دریافت آیتم‌های DarkhastMavad:", err);
    throw err;
  }
}

export async function getPersonnel(): Promise<IPersonnelItem[]> {
  let items: IPersonnelItem[] = [];

  const listGuid = config.LIST_GUIDS.PERSONNEL;
  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=ID,Title`;

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
