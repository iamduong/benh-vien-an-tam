import { isAxiosError } from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse, PaginatedData } from "@/lib/http/response";
import type { DepartmentDetail } from "@/types/details";
import { BaseStatus, type Department } from "@/types/models";

export class DepartmentService {
  async getBySlug(slug: string): Promise<ApiResponse<DepartmentDetail> | null> {
    try {
      const response = await httpClient.get<ApiResponse<DepartmentDetail>>(
        `/public/departments/${encodeURIComponent(slug)}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  }

  async getAll(
    query: {
      page?: number;
      pageSize?: number;
      search?: string;
      status?: BaseStatus;
    } = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<Department>>> {
    const response = await httpClient.get<DepartmentListApiResponse>(
      "/departments",
      { params: query, signal },
    );

    if (!("pagination" in response.data)) {
      return response.data;
    }

    return {
      message: response.data.message,
      data: {
        Items: response.data.data,
        Page: response.data.pagination.page,
        PageSize: response.data.pagination.pageSize,
        TotalItems: response.data.pagination.totalCount,
        TotalPages: response.data.pagination.totalPages,
      },
    };
  }

  async getOptions(signal?: AbortSignal): Promise<ApiResponse<Department[]>> {
    const response = await httpClient.get<ApiResponse<Department[]>>(
      "/public/departments",
      { signal },
    );

    return response.data;
  }

  async getFeaturedDepartments(signal?: AbortSignal): Promise<ApiResponse<Department[]>> {
    const response = await httpClient.get<ApiResponse<Department[]>>(
      "/public/departments",
      { signal },
    );

    return response.data;
  }
}

export const departmentService = new DepartmentService();

type DepartmentListApiResponse =
  | ApiResponse<PaginatedData<Department>>
  | {
      message: string;
      data: Department[];
      pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
      };
    };
