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

export async function getSubProductionPlanByNumbers(
  numbers: string[]
): Promise<ISubProductionPlanListItem[]> {
  const listGuid = config.LIST_GUIDS.SUB_PRODUCTION_PLAN;
  if (!numbers || numbers.length === 0) return [];

  const cleanNumbers = numbers.map((n) => n.trim()).filter((n) => n.length > 0);

  if (cleanNumbers.length === 0) return [];

  console.log("🔍 جستجوی ردیف‌های برنامه‌ریزی برای شماره‌ها:", cleanNumbers);

  let items: ISubProductionPlanListItem[] = [];

  // اگر تعداد شماره‌ها بیشتر از 10 باشد، همه را می‌گیریم و در JavaScript فیلتر می‌کنیم
  // چون URL خیلی طولانی می‌شود و SharePoint خطا می‌دهد
  const MAX_FILTER_ITEMS = 10;
  const selectFields =
    "ID,shomarebarnamerizi,codemahsol,mahsoletolidi,tarhetolid,meghdarkolesefaresh,Title";

  try {
    const startTime = performance.now();

    if (cleanNumbers.length <= MAX_FILTER_ITEMS) {
      // برای تعداد کم، از فیلتر OData استفاده می‌کنیم
      const filterParts = cleanNumbers.map(
        (num) => `shomarebarnamerizi eq '${num.replace(/'/g, "''")}'`
      );
      const filter = filterParts.join(" or ");
      const encodedFilter = encodeURIComponent(filter);

      let nextUrl:
        | string
        | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=${selectFields}&$filter=${encodedFilter}&$orderby=ID desc&$top=5000`;

      while (nextUrl) {
        const res = await fetch(nextUrl, {
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
          },
        });

        if (!res.ok) {
          const err = await res.text();
          console.error("❌ خطا در دریافت داده:", err);
          throw new Error(
            `خطا در گرفتن آیتم‌های برنامه‌ریزی: ${err} (Status: ${res.status})`
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
    } else {
      // برای تعداد زیاد، همه را می‌گیریم و در JavaScript فیلتر می‌کنیم
      // یا به چندین درخواست کوچکتر تقسیم می‌کنیم
      const batches: string[][] = [];
      for (let i = 0; i < cleanNumbers.length; i += MAX_FILTER_ITEMS) {
        batches.push(cleanNumbers.slice(i, i + MAX_FILTER_ITEMS));
      }

      console.log(
        `📦 تقسیم ${cleanNumbers.length} شماره به ${batches.length} دسته`
      );

      // اجرای موازی درخواست‌ها
      const promises = batches.map(async (batch) => {
        const filterParts = batch.map(
          (num) => `shomarebarnamerizi eq '${num.replace(/'/g, "''")}'`
        );
        const filter = filterParts.join(" or ");
        const encodedFilter = encodeURIComponent(filter);

        let batchItems: ISubProductionPlanListItem[] = [];
        let nextUrl:
          | string
          | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=${selectFields}&$filter=${encodedFilter}&$orderby=ID desc&$top=5000`;

        while (nextUrl) {
          const res = await fetch(nextUrl, {
            headers: {
              Accept: "application/json;odata=verbose",
              "Content-Type": "application/json;odata=verbose",
            },
          });

          if (!res.ok) {
            const err = await res.text();
            console.error(`❌ خطا در دریافت دسته:`, err);
            throw new Error(
              `خطا در گرفتن آیتم‌های برنامه‌ریزی: ${err} (Status: ${res.status})`
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

          batchItems = [...batchItems, ...results];
          nextUrl = json.d.__next ?? null;
        }

        return batchItems;
      });

      const results = await Promise.all(promises);
      items = results.flat();
    }

    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(
      `✅ دریافت ${items.length} ردیف برنامه‌ریزی در ${duration} ثانیه`
    );
    console.log("📦 داده‌های دریافت شده از subProductionPlan:", items);
    console.log("🔢 شماره‌های جستجو شده:", cleanNumbers);
    console.log(
      "📋 ردیف‌های پیدا شده:",
      items.map((item) => ({
        ID: item.ID,
        shomarebarnamerizi: item.shomarebarnamerizi,
        codemahsol: item.codemahsol,
        mahsoletolidi: item.mahsoletolidi,
      }))
    );

    return items;
  } catch (err) {
    console.error(`❌ خطا در دریافت آیتم‌های برنامه‌ریزی:`, err);
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
    | null = `${BASE_URL}/_api/web/lists(guid'${listGuid}')/items?$select=*&$filter=Title eq '${encodedCartNumber}'&$orderby=ID desc`;

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
