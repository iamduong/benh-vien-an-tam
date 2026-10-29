import { isAxiosError } from "axios";

import { httpClient } from "@/lib/http/client";
import {
  fromPublicPagination,
  type ApiResponse,
  type PaginatedData,
  type PublicPaginatedData,
} from "@/lib/http/response";
import type { MedicalServiceDetail } from "@/types/details";
import type { MedicalServiceListQuery } from "@/types/discovery";
import type { MedicalService } from "@/types/models";

export class MedicalServiceService {
  async getBySlug(
    slug: string,
  ): Promise<ApiResponse<MedicalServiceDetail> | null> {
    try {
      const response = await httpClient.get<ApiResponse<MedicalServiceDetail>>(
        `/public/medical-services/${encodeURIComponent(slug)}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  }

  async getAll(
    query: MedicalServiceListQuery = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<MedicalService>>> {
    const response = await httpClient.get<
      ApiResponse<PublicPaginatedData<MedicalService>>
    >("/public/medical-services/search", { params: query, signal });

    return { ...response.data, data: fromPublicPagination(response.data.data) };
  }

  async getFeatured(
    signal?: AbortSignal,
  ): Promise<ApiResponse<MedicalService[]>> {
    const response = await httpClient.get<ApiResponse<MedicalService[]>>(
      "/public/medical-services",
      { signal },
    );

    return response.data;
  }
}

export const medicalServiceService = new MedicalServiceService();
