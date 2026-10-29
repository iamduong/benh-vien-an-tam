import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type {
  ClinicalAppointment,
  ClinicalCaseDetail,
  ClinicalMedicalService,
  ClinicalMedicalServiceStatus,
} from "@/types/internal-clinical";

export class InternalClinicalServiceError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "InternalClinicalServiceError";
  }
}

class InternalClinicalService {
  async getAppointments(date: string, signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<ClinicalAppointment[]>>(
        "/internal/clinical/appointments",
        { params: { date }, signal },
      );
      return response.data.data.map(hydrateAppointment);
    } catch (error) {
      throw toServiceError(error);
    }
  }

  async getAppointment(uuid: string, signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<ClinicalCaseDetail>>(
        `/internal/clinical/appointments/${encodeURIComponent(uuid)}`,
        { signal },
      );
      return hydrateAppointment(response.data.data);
    } catch (error) {
      throw toServiceError(error);
    }
  }

  async addMedicalService(appointmentUuid: string, medicalServiceUuid: string) {
    try {
      const response = await httpClient.post<ApiResponse<ClinicalMedicalService>>(
        `/internal/clinical/appointments/${encodeURIComponent(appointmentUuid)}/medical-services`,
        { medicalServiceUuid: medicalServiceUuid },
      );
      return response.data.data;
    } catch (error) {
      throw toServiceError(error);
    }
  }

  async updateMedicalService(
    appointmentUuid: string,
    uuid: string,
    request: { description: string; status: ClinicalMedicalServiceStatus },
  ) {
    try {
      const response = await httpClient.put<ApiResponse<ClinicalMedicalService>>(
        `/internal/clinical/appointments/${encodeURIComponent(appointmentUuid)}/medical-services/${encodeURIComponent(uuid)}`,
        request,
      );
      return response.data.data;
    } catch (error) {
      throw toServiceError(error);
    }
  }
}

function hydrateAppointment<T extends ClinicalAppointment>(item: T): T {
  return { ...item, appointmentAt: new Date(item.appointmentAt) };
}

function toServiceError(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return new InternalClinicalServiceError(
      error.response?.data?.message ?? "Không thể tải dữ liệu ca khám.",
      error.response?.status,
    );
  }
  return new InternalClinicalServiceError("Không thể tải dữ liệu ca khám.");
}

export const internalClinicalService = new InternalClinicalService();
