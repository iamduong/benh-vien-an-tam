import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";

type InternalSession = {
  account: {
    uuid: string;
    phone: string;
    roleUuid: string;
  };
  profile: {
    type: "staff";
    accountUuid: string;
  };
};

class InternalAuthService {
  async login(phone: string, password: string) {
    try {
      const response = await httpClient.post<ApiResponse<InternalSession>>(
        "/auth/login",
        { phone, password },
      );
      return response.data.data ?? response.data.Data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const body = error.response?.data as { message?: string; Message?: string } | undefined;
        throw new Error(body?.message ?? body?.Message ?? "Đăng nhập không thành công.");
      }
      throw error;
    }
  }
}

export const internalAuthService = new InternalAuthService();
