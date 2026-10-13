"use client";

import {
  Eye,
  KeyRound,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  PortalPageHeader,
  PortalSection,
  PortalTable,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/toast/toast-context";
import { permissionService } from "@/lib/services/permission/PermissionService";
import {
  getRoleApiError,
  roleService,
  type RoleItem,
  type RoleRequest,
  type RoleStatusFilter,
} from "@/lib/services/permission/RoleService";
import {
  AccessScope,
  BaseStatus,
  PermissionAction,
  type Permission,
} from "@/types/models";

const actions = Object.values(PermissionAction);
const actionLabels: Record<PermissionAction, string> = {
  [PermissionAction.Read]: "Xem",
  [PermissionAction.Create]: "Thêm",
  [PermissionAction.Update]: "Sửa",
  [PermissionAction.Delete]: "Xóa",
};
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

type RoleDraft = {
  uuid?: string;
  name: string;
  description: string;
  isDoctor: boolean;
  scope: AccessScope;
  status: BaseStatus;
  permissionKeys: Set<string>;
};

function permissionKey(permissionUuid: string, action: PermissionAction) {
  return `${permissionUuid}:${action}`;
}

function createDraft(role?: RoleItem): RoleDraft {
  return {
    uuid: role?.uuid,
    name: role?.name ?? "",
    description: role?.description ?? "",
    isDoctor: role?.isDoctor ?? false,
    scope: role?.scope ?? AccessScope.Hospital,
    status: role?.status ?? BaseStatus.Active,
    permissionKeys: new Set(
      role?.permissions.map((item) => permissionKey(item.permissionUuid, item.action)) ?? [],
    ),
  };
}

function isDeleted(role: RoleItem) {
  return Boolean(role.deletedAt);
}

export function PermissionManagementScreen() {
  const { success, error: showError } = useToast();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleUuid, setSelectedRoleUuid] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RoleStatusFilter>("all");
  const [draft, setDraft] = useState<RoleDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      const [items, permissionItems] = await Promise.all([
        roleService.getAll(query, statusFilter, signal),
        permissionService.getPermissions(signal),
      ]);
      setRoles(items);
      setPermissions(permissionItems);
      setSelectedRoleUuid((current) =>
        items.some((item) => item.uuid === current) ? current : "",
      );
    } catch (error) {
      if (signal?.aborted) return;
      showError("Không thể tải dữ liệu phân quyền", getRoleApiError(error, "Vui lòng thử lại."));
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [query, statusFilter, showError]);

  useEffect(() => {
    const controller = new AbortController();
    void loadData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadData]);

  const selectedRole = roles.find((role) => role.uuid === selectedRoleUuid) ?? null;
  const assignedPermissions = selectedRole
    ? permissions
        .map((permission) => ({
          permission,
          actions: selectedRole.permissions
            .filter((item) => item.permissionUuid === permission.uuid)
            .map((item) => item.action),
        }))
        .filter((item) => item.actions.length > 0)
    : [];
  const activeCount = roles.filter((role) => role.status === BaseStatus.Active).length;
  const inactiveCount = roles.filter((role) => role.status === BaseStatus.InActive).length;
  const availablePermissions = draft?.scope === AccessScope.Hospital
    ? permissions.filter((permission) => permission.scope === AccessScope.Hospital)
    : permissions;

  function changeDraftScope(scope: AccessScope) {
    setDraft((current) => {
      if (!current) return current;
      const allowedPermissionUuids = new Set(
        permissions
          .filter((permission) => scope === AccessScope.System || permission.scope === AccessScope.Hospital)
          .map((permission) => permission.uuid),
      );
      return {
        ...current,
        scope,
        permissionKeys: new Set(
          [...current.permissionKeys].filter((key) => allowedPermissionUuids.has(key.split(":")[0])),
        ),
      };
    });
  }

  function toggleDraftPermission(permissionUuid: string, action: PermissionAction) {
    setDraft((current) => {
      if (!current) return current;
      const nextKeys = new Set(current.permissionKeys);
      const key = permissionKey(permissionUuid, action);
      if (nextKeys.has(key)) nextKeys.delete(key);
      else nextKeys.add(key);
      return { ...current, permissionKeys: nextKeys };
    });
  }

  async function saveRole() {
    if (!draft || isSubmitting) return;
    if (draft.name.trim().length < 2) {
      setFormError("Tên vai trò phải có ít nhất 2 ký tự.");
      return;
    }

    const payload: RoleRequest = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      isDoctor: draft.isDoctor,
      scope: draft.scope,
      status: draft.status,
      permissions: permissions.flatMap((permission) =>
        actions
          .filter((action) => draft.permissionKeys.has(permissionKey(permission.uuid, action)))
          .map((action) => ({ permissionUuid: permission.uuid, action })),
      ),
    };

    setIsSubmitting(true);
    setFormError("");
    try {
      const saved = draft.uuid
        ? await roleService.update(draft.uuid, payload)
        : await roleService.create(payload);
      setDraft(null);
      await loadData();
      success(draft.uuid ? "Đã cập nhật vai trò" : "Đã tạo vai trò", saved.name);
    } catch (error) {
      setFormError(getRoleApiError(error, "Không thể lưu vai trò. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteRole(role: RoleItem) {
    if (isSubmitting || !window.confirm(`Bạn có chắc muốn xóa vai trò "${role.name}"?`)) return;
    setIsSubmitting(true);
    try {
      await roleService.delete(role.uuid);
      await loadData();
      success("Đã xóa vai trò", role.name);
    } catch (error) {
      showError("Không thể xóa vai trò", getRoleApiError(error, "Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  }

  const rows = roles.map((role) => [
    <div
      key={`${role.uuid}-name`}
      className="text-left"
    >
      <span className="block font-semibold text-primary">{role.name}</span>
      <span className="mt-1 block max-w-sm whitespace-normal text-xs font-normal text-muted-foreground">
        {role.description || "Chưa có mô tả"}
      </span>
    </div>,
    <StatusPill key={`${role.uuid}-type`} tone={role.scope === AccessScope.System ? "blue" : "purple"}>
      {role.scope === AccessScope.System ? "Toàn hệ thống" : "Theo cơ sở"}
    </StatusPill>,
    <span key={`${role.uuid}-accounts`} className="inline-flex items-center gap-1.5">
      <UsersRound className="size-4 text-muted-foreground" />
      {role.accountCount}
    </span>,
    <StatusPill key={`${role.uuid}-status`} tone={role.status === BaseStatus.Active ? "green" : "amber"}>
      {role.status === BaseStatus.Active ? "Hoạt động" : "Tạm ngưng"}
    </StatusPill>,
    <div key={`${role.uuid}-record`}>
      <StatusPill tone={isDeleted(role) ? "red" : "green"}>
        {isDeleted(role) ? "Đã xóa" : "Đang quản lý"}
      </StatusPill>
      {role.deletedAt ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {dateFormatter.format(new Date(role.deletedAt))}
        </p>
      ) : null}
    </div>,
    dateFormatter.format(new Date(role.updatedAt)),
    <div key={`${role.uuid}-actions`} className="flex gap-2">
      {!isDeleted(role) ? (
        <>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setSelectedRoleUuid(role.uuid)}
          >
            <Eye /> Xem
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setDraft(createDraft(role))}>
            <Pencil /> Sửa
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => void deleteRole(role)}
          >
            <Trash2 /> Xóa
          </Button>
        </>
      ) : null}
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Kiểm soát truy cập linh động"
        title="Vai trò và quyền hạn"
        description="Quản lý vai trò và các thao tác được phép trên từng chức năng trong cổng nội bộ."
        actions={
          <Button type="button" size="sm" onClick={() => { setFormError(""); setDraft(createDraft()); }}>
            <Plus /> Tạo role
          </Button>
        }
      />

      <PortalSection
        title="Danh sách role"
        description={`${activeCount} hoạt động, ${inactiveCount} tạm ngưng trong kết quả hiện tại`}
      >
        <div className="border-b bg-muted/20 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <label className="block w-full space-y-1.5 lg:max-w-md">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tìm kiếm
              </span>
              <span className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tên hoặc mô tả vai trò"
                  className="h-9 bg-background pl-9"
                />
              </span>
            </label>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Trạng thái
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc trạng thái role">
                {(["all", BaseStatus.Active, BaseStatus.InActive] as const).map((value) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={statusFilter === value ? "default" : "outline"}
                    aria-pressed={statusFilter === value}
                    onClick={() => setStatusFilter(value)}
                  >
                    {value === "all" ? "Tất cả" : value === BaseStatus.Active ? "Hoạt động" : "Tạm ngưng"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Đang tải danh sách vai trò...</p>
        ) : rows.length ? (
          <PortalTable
            caption="Danh sách role hệ thống"
            columns={["Role", "Phân loại", "Tài khoản", "Trạng thái", "Bản ghi", "Cập nhật", "Thao tác"]}
            rows={rows}
          />
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">Không có role phù hợp với bộ lọc.</p>
        )}
      </PortalSection>

      {selectedRole ? (
        <PortalSection
          title={`Permission của ${selectedRole.name}`}
          description={`${selectedRole.permissions.length} thao tác được cấp trên ${assignedPermissions.length} chức năng`}
          action={<StatusPill tone={isDeleted(selectedRole) ? "red" : "green"}>{isDeleted(selectedRole) ? "Role đã xóa" : "Đang hoạt động"}</StatusPill>}
        >
          {assignedPermissions.length ? (
            <div className="grid gap-3 p-5 md:grid-cols-3 2xl:grid-cols-4">
              {assignedPermissions.map(({ permission, actions: assignedActions }) => (
                <article key={permission.uuid} className="border bg-white p-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="size-4 text-primary" />
                    <strong className="text-sm">{permission.name}</strong>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">/{permission.slug}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {assignedActions.map((action) => (
                      <span
                        key={action}
                        className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {actionLabels[action]}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Role này chưa được cấp quyền trên chức năng nào.
            </p>
          )}
        </PortalSection>
      ) : null}

      <Dialog open={draft !== null} onOpenChange={(open) => { if (!open && !isSubmitting) setDraft(null); }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{draft?.uuid ? "Sửa vai trò" : "Tạo vai trò"}</DialogTitle>
            <DialogDescription>Cập nhật thông tin và chọn thao tác được phép cho từng chức năng.</DialogDescription>
          </DialogHeader>
          {draft ? (
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Tên vai trò</Label>
                  <Input id="role-name" value={draft.name} maxLength={200} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
                </div>
                <label className="flex items-end gap-2 pb-2 text-sm">
                  <input type="checkbox" checked={draft.isDoctor} onChange={(event) => setDraft({ ...draft, isDoctor: event.target.checked })} />
                  Vai trò bác sĩ
                </label>
                <div className="space-y-2">
                  <Label htmlFor="role-scope">Phạm vi quản lý</Label>
                  <select
                    id="role-scope"
                    value={draft.scope}
                    onChange={(event) => changeDraftScope(event.target.value as AccessScope)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value={AccessScope.Hospital}>Theo cơ sở y tế</option>
                    <option value={AccessScope.System}>Toàn hệ thống</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Mô tả</Label>
                <Textarea id="role-description" value={draft.description} maxLength={1000} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4 text-primary" /> Phân quyền
                </div>
                <div className="grid max-h-[42vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-4">
                  {availablePermissions.map((permission) => (
                    <fieldset key={permission.uuid} className="border p-3">
                      <legend className="px-1 text-sm font-semibold">{permission.name}</legend>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {actions.map((action) => {
                          const key = permissionKey(permission.uuid, action);
                          return (
                            <label key={action} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={draft.permissionKeys.has(key)} onChange={() => toggleDraftPermission(permission.uuid, action)} />
                              {actionLabels[action]}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </div>
              {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setDraft(null)}>Hủy</Button>
            <Button type="button" disabled={isSubmitting} onClick={() => void saveRole()}>{isSubmitting ? "Đang lưu..." : "Lưu vai trò"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
