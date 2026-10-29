import { mockPermissions } from "@/data/mocks/permissions";
import { PermissionAction, ROLE_UUIDS, type RolePermission } from "@/types/models";

const actions = Object.values(PermissionAction);

export const mockRolePermissions: RolePermission[] = mockPermissions.flatMap((permission, permissionIndex) =>
  actions.map((action, actionIndex) => ({
    uuid: `21000000-${String(permissionIndex + 1).padStart(4, "0")}-4000-8000-${String(actionIndex + 1).padStart(12, "0")}`,
    roleUuid: ROLE_UUIDS.SYSTEM_ADMIN,
    permissionUuid: permission.uuid,
    action,
  })),
);
