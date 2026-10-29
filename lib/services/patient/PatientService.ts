import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type {
  PatientProfileErrorResponse,
  PatientProfileField,
  PatientProfileView,
  UpdatePatientProfileRequest,
} from "@/types/patient";

export class PatientServiceError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Partial<Record<PatientProfileField, string>> = {},
    public readonly status?: number,
  ) {
    super(message);
    this.name = "PatientServiceError";
  }
}

function toPatientError(error: unknown) {
  if (axios.isAxiosError<PatientProfileErrorResponse>(error)) {
    return new PatientServiceError(
      error.response?.data?.message ??
        "Không thể kết nối đến hệ thống. Vui lòng thử lại.",
      error.response?.data?.errors,
      error.response?.status,
    );
  }
  return new PatientServiceError("Đã xảy ra lỗi. Vui lòng thử lại.");
}

export class PatientService {
  async getCurrent(signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<PatientProfileView>>(
        "/patients/me",
        { signal },
      );
      return { ...response.data, data: hydrateView(response.data.data) };
    } catch (error) {
      throw toPatientError(error);
    }
  }

  async updateCurrent(request: UpdatePatientProfileRequest) {
    try {
      const response = await httpClient.put<ApiResponse<PatientProfileView>>(
        "/patients/me",
        request,
      );
      return { ...response.data, data: hydrateView(response.data.data) };
    } catch (error) {
      throw toPatientError(error);
    }
  }
}

function hydrateView(view: PatientProfileView): PatientProfileView {
  return {
    ...view,
    profile: {
      ...view.profile,
      birthdate: new Date(view.profile.birthdate),
    },
  };
}

export const patientService = new PatientService();
