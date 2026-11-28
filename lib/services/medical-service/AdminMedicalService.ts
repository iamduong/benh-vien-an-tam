import { httpClient } from "@/lib/http/client";
import type { BaseStatus } from "@/types/models";

export type AdminMedicalServiceItem = {
  uuid: string;
  image: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  detailService: string;
  workingHour: string;
  status: BaseStatus;
  isInsured: boolean;
  insuranceCap: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MedicalServiceRequest = Omit<
  AdminMedicalServiceItem,
  "uuid" | "status" | "createdAt" | "updatedAt"
>;

type ListResponse = {
  message: string;
  data: AdminMedicalServiceItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type ItemResponse = {
  message: string;
  data: AdminMedicalServiceItem;
};

class AdminMedicalService {
  async getAll(signal?: AbortSignal) {
    const response = await httpClient.get<ListResponse>("/medical-services", {
      params: { page: 1, pageSize: 100 },
      signal,
    });
    return response.data.data;
  }

  async create(payload: MedicalServiceRequest) {
    const response = await httpClient.post<ItemResponse>("/medical-services", payload);
    return response.data.data;
  }

  async update(uuid: string, payload: MedicalServiceRequest) {
    const response = await httpClient.put<ItemResponse>(
      `/medical-services/${encodeURIComponent(uuid)}`,
      payload,
    );
    return response.data.data;
  }

  async delete(uuid: string) {
    await httpClient.delete(`/medical-services/${encodeURIComponent(uuid)}`);
  }
}

export const adminMedicalService = new AdminMedicalService();
