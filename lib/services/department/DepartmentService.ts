import { isAxiosError } from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse, PaginatedData } from "@/lib/http/response";
import type { DepartmentDetail } from "@/types/details";
import type { Department } from "@/types/models";

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
    query: { page?: number; pageSize?: number; search?: string } = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<Department>>> {
    const response = await httpClient.get<
      ApiResponse<PaginatedData<Department>>
    >("/departments", { params: query, signal });

    return response.data;
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
