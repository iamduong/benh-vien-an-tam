import { isAxiosError } from "axios";

import { httpClient } from "@/lib/http/client";
import {
  fromPublicPagination,
  type ApiResponse,
  type PaginatedData,
  type PublicPaginatedData,
} from "@/lib/http/response";
import type { DoctorDetail } from "@/types/details";
import type { DoctorListQuery } from "@/types/discovery";
import type { DoctorProfile } from "@/types/models";

export class DoctorService {
  async getBySlug(slug: string): Promise<ApiResponse<DoctorDetail> | null> {
    try {
      const response = await httpClient.get<ApiResponse<DoctorDetail>>(
        `/public/doctors/${encodeURIComponent(slug)}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  }

  async getAll(
    query: DoctorListQuery = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<DoctorProfile>>> {
    const response = await httpClient.get<
      ApiResponse<PublicPaginatedData<DoctorProfile>>
    >("/public/doctors/search", { params: query, signal });

    return { ...response.data, data: fromPublicPagination(response.data.data) };
  }

  async getFeaturedDoctor(
    signal?: AbortSignal,
  ): Promise<ApiResponse<DoctorProfile[]>> {
    const response = await httpClient.get<ApiResponse<DoctorProfile[]>>(
      "/public/doctors",
      { signal },
    );

    return response.data;
  }
}

export const doctorService = new DoctorService();
