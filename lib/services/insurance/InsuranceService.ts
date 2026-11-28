import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { InsuranceIdentity } from "@/types/insurance";

type InsuranceErrorResponse = {
  message?: string;
  errors?: {
    code?: string[];
  };
};

export class InsuranceServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InsuranceServiceError";
  }
}

class InsuranceService {
  async validate(code: string, signal?: AbortSignal): Promise<InsuranceIdentity> {
    try {
      const response = await httpClient.post<ApiResponse<InsuranceIdentity>>(
        "/public/valid-insurance-code",
        { code },
        { signal },
      );
      return response.data.data;
    } catch (error) {
      if (axios.isCancel(error)) throw error;
      if (axios.isAxiosError<InsuranceErrorResponse>(error)) {
        throw new InsuranceServiceError(
          error.response?.data.errors?.code?.[0] ??
            error.response?.data.message ??
            "Không thể kiểm tra mã bảo hiểm y tế.",
        );
      }
      throw new InsuranceServiceError("Không thể kiểm tra mã bảo hiểm y tế.");
    }
  }
}

export const insuranceService = new InsuranceService();
