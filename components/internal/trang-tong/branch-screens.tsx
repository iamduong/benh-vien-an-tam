"use client";

import {
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";

import { ErrorState, LoadingState } from "@/components/shared/data-state";
import {
  ApiImplementationRequired,
  DetailGrid,
  DetailItem,
  INTERNAL_PAGE_SIZE,
  PortalPageHeader,
  PortalPagination,
  PortalSection,
  PortalTable,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HospitalWorkingScreen } from "@/components/internal/trang-tong/working-hours-screens";
import { DoctorShiftAssignmentScreen } from "@/components/internal/trang-tong/doctor-shift-assignment-screen";
import { HospitalReviewsScreen as HospitalReviewsManagementScreen } from "@/components/internal/trang-tong/hospital-reviews-screen";
import { BranchAppointmentsScreen } from "@/components/internal/trang-tong/branch-appointments-screen";
import { RealInventoryScreen } from "@/components/internal/trang-tong/warehouse-management-screens";
import { markdownToPlainText } from "@/lib/format";
import {
  hospitalService,
  type HospitalUpdateRequest,
} from "@/lib/services/hospital/HospitalService";
import { roomService } from "@/lib/services/hospital/RoomService";
import {
  staffService,
  type HospitalStaffMember,
} from "@/lib/services/hospital/StaffService";
import { roleService, type RoleItem } from "@/lib/services/permission/RoleService";
import { departmentService } from "@/lib/services/department/DepartmentService";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";
import {
  BaseStatus,
  AccessScope,
  RoomStatus,
  type Department,
  type Hospital,
  type HospitalAssignmentSelection,
  type MedicalService,
  type Room,
} from "@/types/models";

export function BranchScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <HospitalDashboard />;
    case "thong-tin-chi-nhanh": return <HospitalProfileScreen />;
    case "chuyen-khoa-dich-vu": return <AssignmentsScreen />;
    case "phong-kham": return <BranchRoomsScreen />;
    case "nhan-su": return <StaffAccountsScreen />;
    case "lich-hen": return <HospitalAppointmentsScreen />;
    case "don-thuoc": return <HospitalPrescriptionsScreen />;
    case "kho-thuoc": return <RealInventoryScreen />;
    case "danh-gia": return <HospitalReviewsManagementScreen />;
    case "bao-cao": return <HospitalReportsScreen />;
    case "nhat-ky": return <HospitalAuditScreen />;
    case "gio-lam-viec-benh-vien": return <HospitalWorkingScreen view="booking-hours" />;
    case "phan-ca-lam-viec-bac-si": return <DoctorShiftAssignmentScreen />;
    default: return null;
  }
}

function HospitalDashboard() {
  return (
    <ApiImplementationRequired
      title="Tổng quan chi nhánh"
      description="Chưa có API tổng hợp dashboard vận hành chi nhánh."
    />
  );
}

function HospitalProfileScreen() {
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState<
    | { status: "loading" }
    | {
        status: "success";
        hospital: Hospital;
        draft: HospitalProfileDraft;
        savedMessage?: string;
        saveError?: string;
      }
    | { status: "error"; message: string }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    hospitalService
      .getBranchProfile(controller.signal)
      .then((response) => {
        if (active) {
          setState({
            status: "success",
            hospital: response.data,
            draft: toHospitalProfileDraft(response.data),
          });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: getHospitalSaveError(
              error,
              "Không thể tải thông tin chi nhánh. Vui lòng thử lại.",
            ),
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  if (state.status === "loading") {
    return <LoadingState label="Đang tải thông tin chi nhánh" />;
  }

  if (state.status === "error") {
    return (
      <ErrorState
        message={state.message}
        onRetry={() => {
          setState({ status: "loading" });
          setAttempt((current) => current + 1);
        }}
      />
    );
  }

  const { hospital, draft } = state;
  const isActive = hospital.status === BaseStatus.Active;

  function updateDraft<K extends keyof HospitalProfileDraft>(
    key: K,
    value: HospitalProfileDraft[K],
  ) {
    setState((current) =>
      current.status === "success"
        ? {
            ...current,
            draft: { ...current.draft, [key]: value },
            savedMessage: undefined,
            saveError: undefined,
          }
        : current,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status !== "success") return;

    setIsSaving(true);
    setState((current) =>
      current.status === "success"
        ? { ...current, savedMessage: undefined, saveError: undefined }
        : current,
    );

    const request: HospitalUpdateRequest = {
      image: hospital.image,
      mapUrl: hospital.mapUrl,
      slug: draft.slug.trim(),
      name: draft.name.trim(),
      address: draft.address.trim(),
      numberOfRoom: Number(draft.numberOfRoom),
      description: draft.description.trim(),
      detailService: hospital.detailService,
      workingHour: draft.workingHour.trim(),
    };

    try {
      const response = await hospitalService.updateBranchProfile(
        hospital.uuid,
        request,
      );
      setState({
        status: "success",
        hospital: response.data,
        draft: toHospitalProfileDraft(response.data),
        savedMessage: response.message,
      });
    } catch (error) {
      setState((current) =>
        current.status === "success"
          ? { ...current, saveError: getHospitalSaveError(error) }
          : current,
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      id="hospital-profile-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <PortalPageHeader
        eyebrow="Thiết lập chi nhánh"
        title="Thông tin chi nhánh"
        description="Cập nhật thông tin công khai của chi nhánh."
        actions={
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <PortalSection title="Thông tin hiển thị">
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Field
              label="Tên cơ sở"
              value={draft.name}
              onChange={(value) => updateDraft("name", value)}
              required
              disabled={isSaving}
            />
            <Field
              label="slug"
              value={draft.slug}
              onChange={(value) => updateDraft("slug", value)}
              required
              disabled={isSaving}
            />
            <div className="sm:col-span-2">
              <Field
                label="Địa chỉ"
                value={draft.address}
                onChange={(value) => updateDraft("address", value)}
                required
                disabled={isSaving}
              />
            </div>
            <Field
              label="Giờ làm việc"
              value={draft.workingHour}
              onChange={(value) => updateDraft("workingHour", value)}
              required
              disabled={isSaving}
            />
            <Field
              label="Số phòng"
              value={draft.numberOfRoom}
              onChange={(value) => updateDraft("numberOfRoom", value)}
              type="number"
              min="1"
              step="1"
              required
              disabled={isSaving}
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hospital-description">Mô tả</Label>
              <Textarea
                id="hospital-description"
                rows={6}
                value={draft.description}
                onChange={(event) =>
                  updateDraft("description", event.currentTarget.value)
                }
                disabled={isSaving}
              />
            </div>
            {state.savedMessage ? (
              <p
                role="status"
                className="text-sm font-medium text-emerald-700 sm:col-span-2"
              >
                {state.savedMessage}
              </p>
            ) : null}
            {state.saveError ? (
              <p
                role="alert"
                className="text-sm font-medium text-destructive sm:col-span-2"
              >
                {state.saveError}
              </p>
            ) : null}
          </div>
        </PortalSection>
        <PortalSection title="Trạng thái xuất bản">
          <DetailGrid>
            <DetailItem label="Trạng thái" value={<StatusPill tone={isActive ? "green" : "amber"}>{isActive ? "Hoạt động" : "Tạm ngưng"}</StatusPill>} />
            <DetailItem label="UUID cơ sở" value={<span className="break-all font-mono text-xs">{hospital.uuid}</span>} />
            <DetailItem label="Cập nhật cuối" value={formatHospitalDate(hospital.updatedAt)} />
          </DetailGrid>
        </PortalSection>
      </div>
    </form>
  );
}

function AssignmentsScreen() {
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | {
        status: "success";
        hospital: Hospital;
        departments: Department[];
        services: MedicalService[];
        assigned: HospitalAssignmentSelection;
        selected: HospitalAssignmentSelection;
        savedMessage?: string;
        saveError?: string;
      }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState({ status: "loading" });
    hospitalService
      .getBranchProfile(controller.signal)
      .then(async (hospitalResponse) => {
        const hospital = hospitalResponse.data;
        const [
          departmentResponse,
          serviceResponse,
          assignedDepartmentResponse,
          assignedServiceResponse,
        ] = await Promise.all([
          departmentService.getAll(
            { page: 1, pageSize: 100, status: BaseStatus.Active },
            controller.signal,
          ),
          medicalServiceService.getAll(
            { page: 1, pageSize: 100 },
            controller.signal,
          ),
          hospitalService.getAssignedDepartments(
            hospital.uuid,
            controller.signal,
          ),
          hospitalService.getAssignedMedicalServices(
            hospital.uuid,
            controller.signal,
          ),
        ]);

        if (!active) return;

        const assigned = {
          departmentUuids: assignedDepartmentResponse.data.Items.map(
            (department) => department.uuid,
          ),
          medicalServiceUuids: assignedServiceResponse.data.Items.map(
            (service) => service.uuid,
          ),
        };
        setState({
          status: "success",
          hospital,
          departments: departmentResponse.data.Items,
          services: serviceResponse.data.Items,
          assigned,
          selected: {
            departmentUuids: [...assigned.departmentUuids],
            medicalServiceUuids: [...assigned.medicalServiceUuids],
          },
        });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: getHospitalSaveError(
              error,
              "Không thể tải chuyên khoa và dịch vụ. Vui lòng thử lại.",
            ),
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  if (state.status === "loading") {
    return <LoadingState label="Đang tải chuyên khoa và dịch vụ chi nhánh" />;
  }

  if (state.status === "error") {
    return (
      <ErrorState
        message={state.message}
        onRetry={() => setAttempt((current) => current + 1)}
      />
    );
  }

  const hasChanges =
    !sameUuidSelection(
      state.assigned.departmentUuids,
      state.selected.departmentUuids,
    ) ||
    !sameUuidSelection(
      state.assigned.medicalServiceUuids,
      state.selected.medicalServiceUuids,
    );

  function toggleAssignment(
    key: keyof HospitalAssignmentSelection,
    uuid: string,
  ) {
    setState((current) => {
      if (current.status !== "success") return current;
      const selected = new Set(current.selected[key]);
      if (selected.has(uuid)) selected.delete(uuid);
      else selected.add(uuid);

      return {
        ...current,
        selected: { ...current.selected, [key]: [...selected] },
        savedMessage: undefined,
        saveError: undefined,
      };
    });
  }

  function resetChanges() {
    setState((current) =>
      current.status === "success"
        ? {
            ...current,
            selected: {
              departmentUuids: [...current.assigned.departmentUuids],
              medicalServiceUuids: [...current.assigned.medicalServiceUuids],
            },
            savedMessage: undefined,
            saveError: undefined,
          }
        : current,
    );
  }

  async function saveAssignments() {
    if (state.status !== "success" || !hasChanges) return;
    setIsSaving(true);
    setState((current) =>
      current.status === "success"
        ? { ...current, savedMessage: undefined, saveError: undefined }
        : current,
    );

    try {
      const response = await hospitalService.updateAssignments(
        state.hospital.uuid,
        state.selected,
      );
      setState((current) =>
        current.status === "success"
          ? {
              ...current,
              assigned: response.data,
              selected: {
                departmentUuids: [...response.data.departmentUuids],
                medicalServiceUuids: [...response.data.medicalServiceUuids],
              },
              savedMessage: response.message,
            }
          : current,
      );
    } catch (error) {
      setState((current) =>
        current.status === "success"
          ? {
              ...current,
              saveError: getHospitalSaveError(
                error,
                "Không thể lưu phân bổ. Vui lòng thử lại.",
              ),
            }
          : current,
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow={`Phân bổ danh mục · ${state.hospital.name}`}
        title="Chuyên khoa và dịch vụ"
        description="Chọn danh mục đang được cung cấp tại chi nhánh."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              disabled={!hasChanges || isSaving}
              onClick={resetChanges}
            >
              Hủy thay đổi
            </Button>
            <Button
              type="button"
              disabled={!hasChanges || isSaving}
              onClick={saveAssignments}
            >
              {isSaving ? "Đang lưu..." : "Lưu phân bổ"}
            </Button>
          </>
        }
      />
      {state.savedMessage ? (
        <p
          role="status"
          className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {state.savedMessage}
        </p>
      ) : null}
      {state.saveError ? (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {state.saveError}
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <AssignmentList
          title="Chuyên khoa"
          items={state.departments}
          selectedUuids={state.selected.departmentUuids}
          disabled={isSaving}
          onToggle={(uuid) => toggleAssignment("departmentUuids", uuid)}
        />
        <AssignmentList
          title="Dịch vụ"
          items={state.services}
          selectedUuids={state.selected.medicalServiceUuids}
          disabled={isSaving}
          onToggle={(uuid) => toggleAssignment("medicalServiceUuids", uuid)}
        />
      </div>
    </div>
  );
}

function AssignmentList({
  title,
  items,
  selectedUuids,
  disabled,
  onToggle,
}: {
  title: string;
  items: Array<{ uuid: string; name: string; description: string }>;
  selectedUuids: string[];
  disabled: boolean;
  onToggle: (uuid: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filteredItems = items.filter((item) =>
    `${item.name} ${item.description}`
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi")),
  );
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * INTERNAL_PAGE_SIZE,
    safePage * INTERNAL_PAGE_SIZE,
  );

  return (
    <PortalSection
      title={title}
      description={`${selectedUuids.length}/${items.length} đang áp dụng`}
    >
      <div className="border-b p-4">
        <label className="block">
          <span className="sr-only">Tìm {title.toLocaleLowerCase("vi")}</span>
          <Input
            value={query}
            onChange={(event) => { setQuery(event.currentTarget.value); setPage(1); }}
            placeholder={`Tìm ${title.toLocaleLowerCase("vi")}`}
            className="h-9"
          />
        </label>
      </div>
      {filteredItems.length > 0 ? (
        <div className="divide-y">
          {paginatedItems.map((item) => {
            const isSelected = selectedUuids.includes(item.uuid);
            return (
              <label
                key={item.uuid}
                className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 hover:bg-muted/35"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => onToggle(item.uuid)}
                    className="mt-1 size-4 shrink-0 accent-primary"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                      {markdownToPlainText(item.description)}
                    </span>
                  </span>
                </span>
                <StatusPill
                  tone={isSelected ? "green" : "neutral"}
                  className="shrink-0 whitespace-nowrap"
                >
                  {isSelected ? "Đang áp dụng" : "Chưa áp dụng"}
                </StatusPill>
              </label>
            );
          })}
          <PortalPagination page={safePage} totalItems={filteredItems.length} onPageChange={setPage} />
        </div>
      ) : (
        <p className="p-8 text-center text-sm text-muted-foreground">
          Không tìm thấy {title.toLocaleLowerCase("vi")} phù hợp.
        </p>
      )}
    </PortalSection>
  );
}

function sameUuidSelection(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((uuid) => right.includes(uuid))
  );
}

export function BranchRoomsScreen() {
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(
    RoomStatus.Available,
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");
  const [recordFilter, setRecordFilter] = useState<"active" | "deleted" | "all">(
    "active",
  );
  const [page, setPage] = useState(1);
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; hospital: Hospital; rooms: Room[] }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    hospitalService
      .getBranchProfile(controller.signal)
      .then(async (response) => {
        const hospital = response.data;
        const roomsResponse = await roomService.getAll(
          hospital.uuid,
          { page: 1, pageSize: 100, includeDeleted: true },
          controller.signal,
        );
        const remainingPages = await Promise.all(
          Array.from(
            { length: Math.max(roomsResponse.data.TotalPages - 1, 0) },
            (_, index) =>
              roomService.getAll(
                hospital.uuid,
                {
                  page: index + 2,
                  pageSize: 100,
                  includeDeleted: true,
                },
                controller.signal,
              ),
          ),
        );

        if (active) {
          setState({
            status: "success",
            hospital,
            rooms: [
              ...roomsResponse.data.Items,
              ...remainingPages.flatMap((page) => page.data.Items),
            ],
          });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: getRoomError(
              error,
              "Không thể tải danh sách phòng khám. Vui lòng thử lại.",
            ),
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  if (state.status === "loading") {
    return <LoadingState label="Đang tải danh sách phòng khám" />;
  }

  if (state.status === "error") {
    return (
      <ErrorState
        message={state.message}
        onRetry={() => {
          setState({ status: "loading" });
          setAttempt((current) => current + 1);
        }}
      />
    );
  }

  const { hospital, rooms } = state;
  const activeRooms = rooms.filter((room) => room.deletedAt.getTime() === 0);
  const atCapacity = activeRooms.length >= hospital.numberOfRoom;
  const capacityPercent =
    hospital.numberOfRoom > 0
      ? Math.min((activeRooms.length / hospital.numberOfRoom) * 100, 100)
      : 0;
  const normalizedSearch = search.trim().toLocaleLowerCase("vi");
  const visibleRooms = rooms.filter((room) => {
    const isDeleted = room.deletedAt.getTime() !== 0;
    const matchesRecord =
      recordFilter === "all" ||
      (recordFilter === "deleted" ? isDeleted : !isDeleted);
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    const matchesSearch =
      !normalizedSearch ||
      `${room.name} ${room.uuid}`.toLocaleLowerCase("vi").includes(normalizedSearch);

    return matchesRecord && matchesStatus && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(visibleRooms.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedRooms = visibleRooms.slice(
    (safePage - 1) * INTERNAL_PAGE_SIZE,
    safePage * INTERNAL_PAGE_SIZE,
  );

  function openCreateForm() {
    setEditingRoom(null);
    setRoomName("");
    setRoomStatus(RoomStatus.Available);
    setShowForm(true);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status !== "success" || isSaving) return;

    const name = roomName.trim();
    const status = roomStatus;
    if (!name) {
      setMessage("Vui lòng nhập tên phòng.");
      return;
    }
    setIsSaving(true);
    setMessage("");

    try {
      if (editingRoom) {
        const response = await roomService.update(hospital.uuid, editingRoom.uuid, {
          name: name,
          status: status,
        });
        setState((current) =>
          current.status === "success"
            ? {
                ...current,
                rooms: current.rooms.map((room) =>
                  room.uuid === response.data.uuid ? response.data : room,
                ),
              }
            : current,
        );
        setMessage(`Đã cập nhật ${name}.`);
      } else {
        const response = await roomService.create(hospital.uuid, {
          name: name,
          status: status,
        });
        setState((current) =>
          current.status === "success"
            ? { ...current, rooms: [...current.rooms, response.data] }
            : current,
        );
        setMessage(`Đã thêm ${name}.`);
      }

      setEditingRoom(null);
      setShowForm(false);
    } catch (error) {
      setMessage(getRoomError(error, "Không thể lưu phòng. Vui lòng thử lại."));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRoom(room: Room) {
    if (state.status !== "success" || isSaving) return;
    setIsSaving(true);
    setMessage("");

    try {
      await roomService.delete(hospital.uuid, room.uuid);
      const deletedAt = new Date();
      setState((current) =>
        current.status === "success"
          ? {
              ...current,
              rooms: current.rooms.map((item) =>
                item.uuid === room.uuid
                  ? { ...item, deletedAt: deletedAt, updatedAt: deletedAt }
                  : item,
              ),
            }
          : current,
      );
      setMessage(`Đã chuyển ${room.name} vào danh sách đã xóa.`);
      if (editingRoom?.uuid === room.uuid) {
        setEditingRoom(null);
        setShowForm(false);
      }
    } catch (error) {
      setMessage(getRoomError(error, "Không thể xóa phòng. Vui lòng thử lại."));
    } finally {
      setIsSaving(false);
    }
  }

  async function restoreRoom(room: Room) {
    if (state.status !== "success" || isSaving) return;
    setIsSaving(true);
    setMessage("");

    try {
      const response = await roomService.restore(hospital.uuid, room.uuid);
      setState((current) =>
        current.status === "success"
          ? {
              ...current,
              rooms: current.rooms.map((item) =>
                item.uuid === response.data.uuid ? response.data : item,
              ),
            }
          : current,
      );
      setMessage(`Đã khôi phục ${response.data.name}.`);
    } catch (error) {
      setMessage(
        getRoomError(error, "Không thể khôi phục phòng. Vui lòng thử lại."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const roomRows = paginatedRooms.map((room) => {
    const isDeleted = room.deletedAt.getTime() !== 0;
    const status = room.status === RoomStatus.Available
      ? <StatusPill tone="green">Khả dụng</StatusPill>
      : room.status === RoomStatus.Occupied
        ? <StatusPill tone="blue">Đang sử dụng</StatusPill>
        : <StatusPill tone="amber">Bảo trì</StatusPill>;
    return [
      <div key={`${room.uuid}-name`}><p>{room.name}</p><p className="mt-1 font-mono text-xs font-normal text-muted-foreground">{room.uuid.slice(0, 8)}</p></div>,
      status,
      <StatusPill key={`${room.uuid}-record`} tone={isDeleted ? "red" : "green"}>{isDeleted ? "Đã xóa" : "Đang quản lý"}</StatusPill>,
      new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(room.updatedAt),
      <div key={`${room.uuid}-actions`} className="flex gap-2">
        {isDeleted ? (
          <Button type="button" size="sm" variant="outline" disabled={isSaving || atCapacity} onClick={() => restoreRoom(room)}><RotateCcw />Khôi phục</Button>
        ) : (
          <>
            <Button type="button" size="sm" variant="outline" disabled={isSaving} onClick={() => { setEditingRoom(room); setRoomName(room.name); setRoomStatus(room.status); setShowForm(true); setMessage(""); }}><Pencil />Sửa</Button>
            <Button type="button" size="sm" variant="outline" disabled={isSaving} onClick={() => deleteRoom(room)}><Trash2 />Xóa</Button>
          </>
        )}
      </div>,
    ];
  });

  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Vận hành cơ sở" title="Phòng khám" description={`Quản lý phòng của ${hospital.name}; giới hạn lấy từ cấu hình Hospital.numberOfRoom.`} actions={<Button type="button" size="sm" onClick={openCreateForm} disabled={atCapacity || isSaving}><Plus />Thêm phòng</Button>} />
      <PortalSection title="Sức chứa phòng" description={`${activeRooms.length} phòng đang quản lý trên tối đa ${hospital.numberOfRoom} phòng`}>
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between gap-4 text-sm"><span className="font-medium">Mức sử dụng cấu hình</span><span className={atCapacity ? "font-semibold text-red-600" : "text-muted-foreground"}>{Math.round(capacityPercent)}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${atCapacity ? "bg-red-500" : "bg-primary"}`} style={{ width: `${capacityPercent}%` }} /></div>
          <p className="mt-3 text-xs text-muted-foreground">Phòng đã xóa mềm không xuất hiện trong danh sách vận hành và không chiếm sức chứa.</p>
        </div>
      </PortalSection>
      {showForm ? (
        <PortalSection title={editingRoom ? `Chỉnh sửa ${editingRoom.name}` : "Thêm phòng mới"} description={editingRoom ? "Cập nhật tên và trạng thái vận hành." : `Còn ${Math.max(hospital.numberOfRoom - activeRooms.length, 0)} vị trí có thể tạo.`}>
          <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="room-name">Tên phòng</Label><Input id="room-name" name="name" maxLength={100} value={roomName} onChange={(event) => setRoomName(event.currentTarget.value)} placeholder="Ví dụ: Phòng khám A2" required disabled={isSaving} /></div>
            <div className="space-y-2"><Label htmlFor="room-status">Trạng thái</Label><select id="room-status" name="status" value={roomStatus} onChange={(event) => setRoomStatus(event.currentTarget.value as RoomStatus)} disabled={isSaving} className="h-10 w-full rounded-md border px-3 text-sm"><option value={RoomStatus.Available}>Khả dụng</option><option value={RoomStatus.Occupied}>Đang sử dụng</option><option value={RoomStatus.Maintenance}>Bảo trì</option></select></div>
            <div className="flex gap-2 sm:col-span-2"><Button type="submit" disabled={isSaving || (!editingRoom && atCapacity)}>{isSaving ? "Đang lưu..." : editingRoom ? "Lưu thay đổi" : "Thêm phòng"}</Button><Button type="button" variant="outline" disabled={isSaving} onClick={() => { setShowForm(false); setEditingRoom(null); setRoomName(""); setRoomStatus(RoomStatus.Available); }}>Hủy</Button></div>
          </form>
        </PortalSection>
      ) : null}
      {message ? <p role={message.startsWith("Không thể") ? "alert" : "status"} className={`border px-4 py-3 text-sm ${message.startsWith("Không thể") ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{message}</p> : null}
      <PortalSection title="Danh sách phòng" description={`${activeRooms.length} phòng đang quản lý`}>
        <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 sm:grid-cols-3">
          <label className="sm:col-span-1">
            <span className="sr-only">Tìm theo tên hoặc mã phòng</span>
            <Input
              value={search}
              onChange={(event) => { setSearch(event.currentTarget.value); setPage(1); }}
              placeholder="Tìm tên hoặc mã phòng"
              className="h-9"
            />
          </label>
          <label>
            <span className="sr-only">Lọc theo trạng thái phòng</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.currentTarget.value as RoomStatus | "all");
                setPage(1);
              }}
              className="h-9 w-full rounded-md border bg-white px-3 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={RoomStatus.Available}>Khả dụng</option>
              <option value={RoomStatus.Occupied}>Đang sử dụng</option>
              <option value={RoomStatus.Maintenance}>Bảo trì</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Lọc bản ghi phòng</span>
            <select
              value={recordFilter}
              onChange={(event) => {
                setRecordFilter(
                  event.currentTarget.value as "active" | "deleted" | "all",
                );
                setPage(1);
              }}
              className="h-9 w-full rounded-md border bg-white px-3 text-sm"
            >
              <option value="active">Đang quản lý</option>
              <option value="deleted">Đã xóa</option>
              <option value="all">Tất cả bản ghi</option>
            </select>
          </label>
        </div>
        {roomRows.length > 0 ? (
          <>
            <PortalTable caption="Danh sách phòng khám" columns={["Phòng", "Trạng thái", "Bản ghi", "Cập nhật", "Thao tác"]} rows={roomRows} />
            <PortalPagination page={safePage} totalItems={visibleRooms.length} onPageChange={setPage} />
          </>
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">{rooms.length ? "Không có phòng phù hợp với bộ lọc." : "Chi nhánh chưa có phòng khám nào."}</p>
        )}
      </PortalSection>
    </div>
  );
}

function StaffAccountsScreen() {
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<BaseStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleUuid, setRoleUuid] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [departmentUuid, setDepartmentUuid] = useState("");
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | {
        status: "success";
        hospital: Hospital;
        staff: HospitalStaffMember[];
        departments: Department[];
        roles: RoleItem[];
      }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    hospitalService
      .getBranchProfile(controller.signal)
      .then(async ({ data: hospital }) => {
        const [staffResponse, departmentsResponse, allRoles] = await Promise.all([
          staffService.getAll(
            hospital.uuid,
            { page: 1, pageSize: 100 },
            controller.signal,
          ),
          hospitalService.getAssignedDepartments(hospital.uuid, controller.signal),
          roleService.getAll("", BaseStatus.Active, controller.signal),
        ]);
        const roles = allRoles.filter(
          (role) => role.scope === AccessScope.Hospital && isStaffRole(role),
        );
        const remainingPages = await Promise.all(
          Array.from(
            { length: Math.max(staffResponse.data.TotalPages - 1, 0) },
            (_, index) =>
              staffService.getAll(
                hospital.uuid,
                { page: index + 2, pageSize: 100 },
                controller.signal,
              ),
          ),
        );

        if (active) {
          setState({
            status: "success",
            hospital,
            staff: [
              ...staffResponse.data.Items,
              ...remainingPages.flatMap((page) => page.data.Items),
            ],
            departments: departmentsResponse.data.Items,
            roles,
          });
          setRoleUuid((current) =>
            current || roles.find((role) => !isDoctorStaffRole(role))?.uuid || roles[0]?.uuid || "",
          );
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: getStaffError(
              error,
              "Không thể tải nhân sự chi nhánh. Vui lòng thử lại.",
            ),
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  if (state.status === "loading") {
    return <LoadingState label="Đang tải danh sách nhân sự" />;
  }
  if (state.status === "error") {
    return (
      <ErrorState
        message={state.message}
        onRetry={() => {
          setState({ status: "loading" });
          setAttempt((current) => current + 1);
        }}
      />
    );
  }

  const { hospital, staff, departments, roles } = state;
  const normalizedSearch = search.trim().toLocaleLowerCase("vi");
  const filteredStaff = staff.filter((member) => {
    const matchesRole = roleFilter === "all" || member.roleUuid === roleFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    const searchText =
      `${member.DisplayName} ${member.phone} ${member.RoleName} ${member.DepartmentName ?? ""}`.toLocaleLowerCase("vi");
    return (
      matchesRole &&
      matchesStatus &&
      (!normalizedSearch || searchText.includes(normalizedSearch))
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedStaff = filteredStaff.slice(
    (safePage - 1) * INTERNAL_PAGE_SIZE,
    safePage * INTERNAL_PAGE_SIZE,
  );
  function resetForm() {
    setPhone("");
    setPassword("");
    setRoleUuid(roles.find((role) => !isDoctorStaffRole(role))?.uuid ?? roles[0]?.uuid ?? "");
    setDoctorName("");
    setSpecialty("");
    setDepartmentUuid("");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status !== "success" || isSaving) return;

    setIsSaving(true);
    setMessage("");
    try {
      const response = await staffService.create(hospital.uuid, {
        phone: phone.trim(),
        password: password,
        roleUuid,
        ...(isDoctorStaffRole(roles.find((role) => role.uuid === roleUuid))
          ? {
              name: doctorName.trim(),
              specialty: specialty.trim(),
              departmentUuid: departmentUuid,
            }
          : {}),
      });
      setState((current) =>
        current.status === "success"
          ? { ...current, staff: [response.data, ...current.staff] }
          : current,
      );
      setMessage(`Đã tạo tài khoản ${response.data.DisplayName}.`);
      setShowForm(false);
      resetForm();
    } catch (error) {
      setMessage(
        getStaffError(error, "Không thể tạo tài khoản. Vui lòng thử lại."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleStatus(member: HospitalStaffMember) {
    if (state.status !== "success" || isSaving) return;
    const nextStatus =
      member.status === BaseStatus.Active
        ? BaseStatus.InActive
        : BaseStatus.Active;
    setIsSaving(true);
    setMessage("");
    try {
      const response = await staffService.updateStatus(
        hospital.uuid,
        member.accountUuid,
        nextStatus,
      );
      setState((current) =>
        current.status === "success"
          ? {
              ...current,
              staff: current.staff.map((item) =>
                item.accountUuid === response.data.accountUuid
                  ? {
                      ...item,
                      status: response.data.status,
                      updatedAt: response.data.updatedAt,
                    }
                  : item,
              ),
            }
          : current,
      );
      setMessage(
        nextStatus === BaseStatus.Active
          ? `Đã kích hoạt ${member.DisplayName}.`
          : `Đã vô hiệu hóa ${member.DisplayName}.`,
      );
    } catch (error) {
      setMessage(
        getStaffError(error, "Không thể cập nhật tài khoản. Vui lòng thử lại."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const rows = paginatedStaff.map((member) => [
    <div key={`${member.accountUuid}-identity`}>
      <p className="font-medium">{member.DisplayName}</p>
      <p className="mt-1 text-xs text-muted-foreground">{member.phone}</p>
    </div>,
    <StatusPill
      key={`${member.accountUuid}-role`}
      tone={getStaffRoleTone(roles.find((role) => role.uuid === member.roleUuid))}
    >
      {member.RoleName}
    </StatusPill>,
    member.DepartmentName ??
      (isDoctorStaffRole(roles.find((role) => role.uuid === member.roleUuid))
        ? "Chưa gán chuyên khoa"
        : "Nhân sự chi nhánh"),
    <StatusPill
      key={`${member.accountUuid}-status`}
      tone={member.status === BaseStatus.Active ? "green" : "red"}
    >
      {member.status === BaseStatus.Active ? "Hoạt động" : "Vô hiệu hóa"}
    </StatusPill>,
    new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(member.updatedAt),
    <Button
      key={`${member.accountUuid}-action`}
      type="button"
      size="sm"
      variant={member.status === BaseStatus.Active ? "outline" : "default"}
      disabled={isSaving}
      onClick={() => toggleStatus(member)}
    >
      {member.status === BaseStatus.Active ? "Vô hiệu hóa" : "Kích hoạt"}
    </Button>,
  ]);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Nhân sự chi nhánh"
        title="Tài khoản nhân sự"
        description={`Quản lý Doctor, Staff và Warehouse Manager thuộc ${hospital.name}.`}
        actions={
          <Button
            type="button"
            size="sm"
            disabled={isSaving}
            onClick={() => {
              resetForm();
              setShowForm((current) => !current);
              setMessage("");
            }}
          >
            <Plus />
            Thêm nhân sự
          </Button>
        }
      />
      {message ? (
        <p
          role={message.startsWith("Không thể") ? "alert" : "status"}
          className={`border px-4 py-3 text-sm ${message.startsWith("Không thể") ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
        >
          {message}
        </p>
      ) : null}
      {showForm ? (
        <PortalSection
          title="Tạo tài khoản nhân sự"
          description="Tài khoản được gán vào đúng chi nhánh hiện tại. Mật khẩu được dùng để khởi tạo thông tin đăng nhập."
        >
          {roles.length === 0 ? (
            <p role="alert" className="px-5 pt-4 text-sm text-destructive">
              Chưa cấu hình vai trò nhân sự thuộc phạm vi chi nhánh.
            </p>
          ) : null}
          <form onSubmit={handleCreate} className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="staff-phone">Số điện thoại</Label>
              <Input
                id="staff-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.currentTarget.value)}
                pattern="[0-9+() -]{8,20}"
                maxLength={20}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-password">Mật khẩu khởi tạo</Label>
              <Input
                id="staff-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                minLength={8}
                maxLength={128}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-role">Vai trò</Label>
              <select
                id="staff-role"
                value={roleUuid}
                onChange={(event) =>
                  setRoleUuid(event.currentTarget.value)
                }
                disabled={isSaving}
                className="h-10 w-full rounded-md border px-3 text-sm"
              >
                <option value="">Chọn vai trò</option>
                {roles.map((role) => (
                  <option key={role.uuid} value={role.uuid}>{role.name}</option>
                ))}
              </select>
            </div>
            {isDoctorStaffRole(roles.find((role) => role.uuid === roleUuid)) ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="staff-doctor-name">Họ tên bác sĩ</Label>
                  <Input
                    id="staff-doctor-name"
                    value={doctorName}
                    onChange={(event) =>
                      setDoctorName(event.currentTarget.value)
                    }
                    minLength={2}
                    maxLength={100}
                    required
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-specialty">Chuyên môn</Label>
                  <Input
                    id="staff-specialty"
                    value={specialty}
                    onChange={(event) =>
                      setSpecialty(event.currentTarget.value)
                    }
                    minLength={2}
                    maxLength={100}
                    required
                    disabled={isSaving}
                    placeholder="Ví dụ: Nội khoa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-department">Chuyên khoa</Label>
                  <select
                    id="staff-department"
                    value={departmentUuid}
                    onChange={(event) =>
                      setDepartmentUuid(event.currentTarget.value)
                    }
                    required
                    disabled={isSaving || departments.length === 0}
                    className="h-10 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="">Chọn chuyên khoa</option>
                    {departments.map((department) => (
                      <option key={department.uuid} value={department.uuid}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {departments.length === 0 ? (
                    <p className="text-xs text-red-600">
                      Chi nhánh chưa được gán chuyên khoa nào.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
            <div className="flex gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={
                  isSaving ||
                  !roleUuid ||
                  (isDoctorStaffRole(roles.find((role) => role.uuid === roleUuid)) &&
                    departments.length === 0)
                }
              >
                {isSaving ? "Đang tạo..." : "Tạo tài khoản"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </PortalSection>
      ) : null}
      <PortalSection
        title="Danh sách nhân sự"
        description={`${filteredStaff.length} nhân sự thuộc chi nhánh`}
      >
        <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 sm:grid-cols-3">
          <Input
            aria-label="Tìm nhân sự"
            value={search}
            onChange={(event) => { setSearch(event.currentTarget.value); setPage(1); }}
            placeholder="Tìm tên, số điện thoại, chuyên khoa"
            className="h-9"
          />
          <select
            aria-label="Lọc theo vai trò"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.currentTarget.value);
              setPage(1);
            }}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role.uuid} value={role.uuid}>{role.name}</option>
            ))}
          </select>
          <select
            aria-label="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.currentTarget.value as BaseStatus | "all");
              setPage(1);
            }}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Mọi trạng thái</option>
            <option value={BaseStatus.Active}>Hoạt động</option>
            <option value={BaseStatus.InActive}>Vô hiệu hóa</option>
          </select>
        </div>
        {rows.length > 0 ? (
          <>
            <PortalTable
              caption="Danh sách tài khoản nhân sự chi nhánh"
              columns={["Nhân sự", "Vai trò", "Bộ phận", "Trạng thái", "Cập nhật", "Thao tác"]}
              rows={rows}
            />
            <PortalPagination page={safePage} totalItems={filteredStaff.length} onPageChange={setPage} />
          </>
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {staff.length
              ? "Không có nhân sự phù hợp với bộ lọc."
              : "Chi nhánh chưa có tài khoản nhân sự."}
          </p>
        )}
      </PortalSection>
    </div>
  );
}

function HospitalAppointmentsScreen() {
  return <BranchAppointmentsScreen />;
}

function HospitalPrescriptionsScreen() {
  return (
    <ApiImplementationRequired
      title="Đơn thuốc chi nhánh"
      description="Chưa có API danh sách đơn thuốc theo phạm vi chi nhánh."
    />
  );
}

function HospitalReportsScreen() {
  return (
    <ApiImplementationRequired
      title="Báo cáo vận hành chi nhánh"
      description="Chưa có API báo cáo và thống kê theo kỳ của chi nhánh."
    />
  );
}

function HospitalAuditScreen() {
  return (
    <ApiImplementationRequired
      title="Nhật ký hoạt động chi nhánh"
      description="Chưa có API audit log theo phạm vi chi nhánh."
    />
  );
}

type HospitalProfileDraft = {
  name: string;
  slug: string;
  address: string;
  workingHour: string;
  numberOfRoom: string;
  description: string;
};

function toHospitalProfileDraft(hospital: Hospital): HospitalProfileDraft {
  return {
    name: hospital.name,
    slug: hospital.slug,
    address: hospital.address,
    workingHour: hospital.workingHour,
    numberOfRoom: String(hospital.numberOfRoom),
    description: hospital.description,
  };
}

function getHospitalSaveError(
  error: unknown,
  fallback = "Không thể lưu thông tin chi nhánh. Vui lòng thử lại.",
) {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    if (error.response?.data?.error === "HOSPITAL_SLUG_ALREADY_EXISTS") {
      return "Slug này đã được sử dụng cho một chi nhánh khác.";
    }
    if (error.response?.data?.error === "ROOM_CAPACITY_BELOW_CURRENT_USAGE") {
      return "Số phòng không thể thấp hơn số phòng đang được quản lý.";
    }
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error && error.message
    ? error.message
    : fallback;
}

function getRoomError(error: unknown, fallback: string) {
  if (
    isAxiosError<{
      error?: string;
      message?: string;
    }>(error)
  ) {
    const code = error.response?.data?.error;
    if (code === "ROOM_CAPACITY_REACHED") {
      return "Không thể thêm hoặc khôi phục phòng vì chi nhánh đã đạt sức chứa cấu hình.";
    }
    if (code === "ROOM_HAS_ACTIVE_APPOINTMENTS") {
      return "Không thể xóa hoặc đưa phòng vào bảo trì vì phòng còn lịch hẹn đang chờ hoặc đã xác nhận.";
    }
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error && error.message ? error.message : fallback;
}

function getStaffError(error: unknown, fallback: string) {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    switch (error.response?.data?.error) {
      case "PHONE_ALREADY_EXISTS":
        return "Số điện thoại này đã được sử dụng cho một tài khoản khác.";
      case "DEPARTMENT_NOT_ASSIGNED":
        return "Chuyên khoa đã chọn chưa được gán cho chi nhánh.";
      case "DOCTOR_PROFILE_REQUIRED":
        return "Vui lòng nhập họ tên, chuyên môn và chuyên khoa cho bác sĩ.";
      case "STAFF_ROLES_NOT_CONFIGURED":
        return "Backend chưa cấu hình đầy đủ các vai trò nhân sự.";
      case "INVALID_STAFF_ROLE":
        return "Vai trò nhân sự không hợp lệ.";
      default:
        return error.response?.data?.message
          ? `Không thể thực hiện: ${error.response.data.message}`
          : fallback;
    }
  }
  return error instanceof Error && error.message
    ? `Không thể thực hiện: ${error.message}`
    : fallback;
}

function isStaffRole(role: RoleItem) {
  const name = role.name.trim().toLocaleLowerCase("vi");
  return (
    isDoctorStaffRole(role) ||
    name.includes("warehouse") ||
    name.includes("kho") ||
    name.includes("staff") ||
    name.includes("tiếp nhận")
  );
}

function isDoctorStaffRole(role: RoleItem | undefined) {
  return Boolean(
    role &&
      (role.isDoctor ||
        role.name.toLocaleLowerCase("vi").includes("doctor") ||
        role.name.toLocaleLowerCase("vi").includes("bác sĩ")),
  );
}

function getStaffRoleTone(role: RoleItem | undefined): "blue" | "green" | "amber" {
  if (isDoctorStaffRole(role)) return "blue";
  const name = role?.name.toLocaleLowerCase("vi") ?? "";
  return name.includes("kho") || name.includes("warehouse") ? "amber" : "green";
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
  step,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  step?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const id = `hospital-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        min={min}
        step={step}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </div>
  );
}

function formatHospitalDate(value: Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có dữ liệu";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
