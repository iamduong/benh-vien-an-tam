import { combinedPortalSections } from "@/lib/combined-internal-portal";
import { AccessScope, type Permission } from "@/types/models";

const uniqueItems = Array.from(
  new Map(combinedPortalSections.flatMap((section) => section.items).map((item) => [item.slug, item])).values(),
);

export const mockPermissions: Permission[] = uniqueItems.map((item, index) => ({
  uuid: `20000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  slug: item.slug,
  icon: item.icon,
  name: item.slug,
  description: item.description,
  scope: AccessScope.System,
}));
