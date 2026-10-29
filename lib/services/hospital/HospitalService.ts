import { isAxiosError } from "axios";

import { httpClient } from "@/lib/http/client";
import {
  fromPublicPagination,
  type ApiResponse,
  type PaginatedData,
  type PublicPaginatedData,
} from "@/lib/http/response";
import type { HospitalDetail } from "@/types/details";
import type { HospitalListQuery } from "@/types/discovery";
import type {
  Department,
  Hospital,
  HospitalAssignmentSelection,
  MedicalService,
} from "@/types/models";

export type HospitalUpdateRequest = Pick<
  Hospital,
  | "image"
  | "mapUrl"
  | "slug"
  | "name"
  | "address"
  | "numberOfRoom"
  | "description"
  | "detailService"
  | "workingHour"
>;

export class HospitalService {
  async getBranchProfile(
    signal?: AbortSignal,
  ): Promise<ApiResponse<Hospital>> {
    const response = await httpClient.get<ApiResponse<Hospital>>(
      "/hospitals/branch-profile",
      { signal },
    );

    return response.data;
  }

  async updateBranchProfile(
    uuid: string,
    request: HospitalUpdateRequest,
  ): Promise<ApiResponse<Hospital>> {
    const response = await httpClient.put<ApiResponse<Hospital>>(
      `/hospitals/${encodeURIComponent(uuid)}`,
      request,
    );

    return response.data;
  }

  async getAssignedDepartments(
    uuid: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<Department>>> {
    const response = await httpClient.get<
      ApiResponse<PaginatedData<Department>>
    >(`/hospitals/${encodeURIComponent(uuid)}/departments`, {
      params: { page: 1, pageSize: 100 },
      signal,
    });

    return response.data;
  }

  async getAssignedMedicalServices(
    uuid: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<MedicalService>>> {
    const response = await httpClient.get<
      ApiResponse<PaginatedData<MedicalService>>
    >(`/hospitals/${encodeURIComponent(uuid)}/medical-services`, {
      params: { page: 1, pageSize: 100 },
      signal,
    });

    return response.data;
  }

  async updateAssignments(
    uuid: string,
    selection: HospitalAssignmentSelection,
  ): Promise<ApiResponse<HospitalAssignmentSelection>> {
    const response = await httpClient.put<
      ApiResponse<HospitalAssignmentSelection>
    >(`/hospitals/${encodeURIComponent(uuid)}/assignments`, selection);

    return response.data;
  }

  async getBySlug(slug: string): Promise<ApiResponse<HospitalDetail> | null> {
    try {
      const response = await httpClient.get<ApiResponse<HospitalDetail>>(
        `/public/hospitals/${encodeURIComponent(slug)}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  }

  async getAll(
    query: HospitalListQuery = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<Hospital>>> {
    const response = await httpClient.get<ApiResponse<PublicPaginatedData<Hospital>>>(
      "/public/hospitals/search",
      {
        params: {
          q: query.q || query.name,
          department: query.department,
          page: query.page,
          pageSize: query.pageSize,
        },
        signal,
      },
    );

    return { ...response.data, data: fromPublicPagination(response.data.data) };
  }

  async getOptions(signal?: AbortSignal): Promise<ApiResponse<Hospital[]>> {
    const response = await httpClient.get<ApiResponse<Hospital[]>>(
      "/public/hospitals",
      { signal },
    );

    return response.data;
  }

  async getFeaturedHospital(signal?: AbortSignal): Promise<ApiResponse<Hospital[]>> {
    const response = await httpClient.get<ApiResponse<Hospital[]>>(
      "/public/hospitals",
      { signal },
    );

    return response.data;
  }
}

export const hospitalService = new HospitalService();
