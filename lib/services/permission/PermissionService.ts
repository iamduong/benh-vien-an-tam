import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { Permission } from "@/types/models";

export class PermissionService {
  async getPermissions(signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<Permission[]>>("/permissions", {
      signal,
    });

    return response.data.data;
  }
}

export const permissionService = new PermissionService();
