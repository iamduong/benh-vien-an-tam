import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { AccessScope, BaseStatus, PermissionAction } from "@/types/models";

export type RolePermissionItem = {
  permissionUuid: string;
  action: PermissionAction;
};

export type RoleItem = {
  uuid: string;
  name: string;
  description: string;
  isDoctor: boolean;
  scope: AccessScope;
  status: BaseStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  accountCount: number;
  permissions: RolePermissionItem[];
};

export type RoleRequest = {
  name: string;
  description: string;
  isDoctor: boolean;
  scope: AccessScope;
  status: BaseStatus;
  permissions: RolePermissionItem[];
};

export type RoleStatusFilter = BaseStatus | "all";

class RoleService {
  async getAll(q = "", status: RoleStatusFilter = "all", signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<RoleItem[]>>("/roles", {
      params: {
        q: q || undefined,
        status: status === "all" ? undefined : status,
      },
      signal,
    });
    return response.data.data;
  }

  async create(payload: RoleRequest) {
    const response = await httpClient.post<ApiResponse<RoleItem>>("/roles", payload);
    return response.data.data;
  }

  async update(uuid: string, payload: RoleRequest) {
    const response = await httpClient.put<ApiResponse<RoleItem>>(`/roles/${uuid}`, payload);
    return response.data.data;
  }

  async delete(uuid: string) {
    await httpClient.delete(`/roles/${uuid}`);
  }
}

export function getRoleApiError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as { message?: string } | undefined;
  return data?.message ?? fallback;
}

export const roleService = new RoleService();
