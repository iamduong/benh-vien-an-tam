import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type {
  PrescriptionErrorResponse,
  PrescriptionList,
  PrescriptionListQuery,
  PrescriptionSummary,
  PrescriptionView,
} from "@/types/prescriptions";

export class PrescriptionServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "PrescriptionServiceError";
  }
}

function toPrescriptionError(error: unknown) {
  if (axios.isAxiosError<PrescriptionErrorResponse>(error)) {
    return new PrescriptionServiceError(
      error.response?.data?.message ??
        "Không thể kết nối đến hệ thống. Vui lòng thử lại.",
      error.response?.status,
    );
  }
  return new PrescriptionServiceError("Đã xảy ra lỗi. Vui lòng thử lại.");
}

export class PrescriptionService {
  async getAll(query: PrescriptionListQuery, signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<PrescriptionList>>(
        "/prescriptions",
        { params: query, signal },
      );
      return {
        ...response.data,
        data: {
          ...response.data.data,
          Items: response.data.data.Items.map(hydrateSummary),
        },
      };
    } catch (error) {
      throw toPrescriptionError(error);
    }
  }

  async getByUuid(uuid: string, signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<PrescriptionView>>(
        `/prescriptions/${encodeURIComponent(uuid)}`,
        { signal },
      );
      return {
        ...response.data,
        data: {
          ...hydrateSummary(response.data.data),
          details: response.data.data.details.map((item) => ({
            ...item,
            medicine: {
              ...item.medicine,
              createdAt: new Date(item.medicine.createdAt),
              updatedAt: new Date(item.medicine.updatedAt),
              deletedAt: new Date(item.medicine.deletedAt),
            },
          })),
        },
      };
    } catch (error) {
      throw toPrescriptionError(error);
    }
  }
}

function hydrateSummary<T extends PrescriptionSummary>(item: T): T {
  return {
    ...item,
    prescription: {
      ...item.prescription,
      createdAt: new Date(item.prescription.createdAt),
      updatedAt: new Date(item.prescription.updatedAt),
      deletedAt: new Date(item.prescription.deletedAt),
    },
  };
}

export const prescriptionService = new PrescriptionService();
