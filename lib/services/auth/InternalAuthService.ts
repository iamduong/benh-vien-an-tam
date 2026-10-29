import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { AccessScope } from "@/types/models";

type InternalSession = {
  account: {
    uuid: string;
    phone: string;
    roleUuid: string;
  };
  profile: {
    type: "staff" | "doctor" | "patient";
  };
  role: {
    uuid: string;
    name: string;
    isDoctor: boolean;
    scope: AccessScope;
  } | null;
};

class InternalAuthService {
  async login(phone: string, password: string) {
    try {
      const response = await httpClient.post<ApiResponse<InternalSession>>(
        "/auth/login",
        { phone, password },
      );
      const session = response.data.data;
      if (!session.role) {
        throw new Error("Tài khoản không có quyền truy cập cổng quản lý.");
      }
      return session as InternalSession & { role: NonNullable<InternalSession["role"]> };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const body = error.response?.data as { message?: string } | undefined;
        throw new Error(body?.message ?? "Đăng nhập không thành công.");
      }
      throw error;
    }
  }
}

export const internalAuthService = new InternalAuthService();
