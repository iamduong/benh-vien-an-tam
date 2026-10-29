import type { PaginatedData, PublicPaginatedData } from "@/lib/http/response";

type QueryParams = Record<string, unknown> | undefined;

export function getStringParam(params: QueryParams, key: string) {
  const value = params?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function paginatePublic<T>(
  items: T[],
  page: number,
  pageSize: number,
): PublicPaginatedData<T> {
  const result = paginate(items, page, pageSize);
  return {
    items: result.Items,
    page: result.Page,
    pageSize: result.PageSize,
    totalItems: result.TotalItems,
    totalPages: result.TotalPages,
  };
}

export function getPositiveIntegerParam(
  params: QueryParams,
  key: string,
  fallback: number,
) {
  const value = Number(params?.[key]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export function matchesKeyword(keyword: string, ...values: string[]) {
  if (!keyword) return true;

  const normalizedKeyword = normalizeText(keyword);
  return values.some((value) => normalizeText(value).includes(normalizedKeyword));
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedData<T> {
  const safePageSize = Math.min(pageSize, 24);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * safePageSize;

  return {
    Items: items.slice(start, start + safePageSize),
    Page: safePage,
    PageSize: safePageSize,
    TotalItems: items.length,
    TotalPages: totalPages,
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi-VN");
}
