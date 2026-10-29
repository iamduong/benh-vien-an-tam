import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type {
  PortalIconName,
  PortalNavigationItem,
} from "@/lib/combined-internal-portal";

type SidebarItemResponse = {
  slug: string;
  label: string;
  description: string;
  icon: string;
  href: string;
};

type SidebarResponse = {
  role: string;
  groups: Array<{
    label: string;
    items: SidebarItemResponse[];
  }>;
};

export type SidebarNavigationGroup = {
  label: string;
  items: Array<PortalNavigationItem & { href: string }>;
};

class SidebarService {
  async get(signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<SidebarResponse>>(
      "/sidebar",
      { signal },
    );
    const data = response.data.data ?? response.data.data;

    return {
      role: data.role,
      groups: data.groups.map((group) => ({
        label: group.label,
        items: group.items.map((item) => ({
          ...item,
          icon: item.icon as PortalIconName,
        })),
      })),
    };
  }
}

export const sidebarService = new SidebarService();
