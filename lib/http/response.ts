export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type PaginatedData<T> = {
  Items: T[];
  Page: number;
  PageSize: number;
  TotalItems: number;
  TotalPages: number;
};

export type PublicPaginatedData<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export function fromPublicPagination<T>(data: PublicPaginatedData<T>): PaginatedData<T> {
  return {
    Items: data.items,
    Page: data.page,
    PageSize: data.pageSize,
    TotalItems: data.totalItems,
    TotalPages: data.totalPages,
  };
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
