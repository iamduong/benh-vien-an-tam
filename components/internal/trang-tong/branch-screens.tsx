"use client";

import {
  Activity,
  BedDouble,
  CalendarCheck2,
  CircleDollarSign,
  ClipboardCheck,
  PackageCheck,
  Pencil,
  Plus,
  RotateCcw,
  ShieldAlert,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";

import { ErrorState, LoadingState } from "@/components/shared/data-state";
import {
  DetailGrid,
  DetailItem,
  MetricCard,
  MetricGrid,
  PortalAction,
  PortalPageHeader,
  PortalSection,
  PortalTable,
  PortalToolbar,
  ProgressList,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HospitalWorkingScreen } from "@/components/internal/trang-tong/working-hours-screens";
import { BranchAppointmentsScreen } from "@/components/internal/trang-tong/branch-appointments-screen";
import { markdownToPlainText } from "@/lib/format";
import {
  hospitalService,
  type HospitalUpdateRequest,
} from "@/lib/services/hospital/HospitalService";
import { roomService } from "@/lib/services/hospital/RoomService";
import {
  staffService,
  type HospitalStaffMember,
  type StaffRoleCode,
} from "@/lib/services/hospital/StaffService";
import { departmentService } from "@/lib/services/department/DepartmentService";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";
import {
  BaseStatus,
  RoomStatus,
  type Department,
  type Hospital,
  type HospitalAssignmentSelection,
  type MedicalService,
  type Room,
} from "@/types/models";

const appointmentRows = [
  ["09:30", "Nguyễn Thị Lan · BN-10248", "Khám bác sĩ", "BS. Nguyễn Hoàng Minh · P.203", <StatusPill key="1" tone="blue">Đã xác nhận</StatusPill>],
  ["09:45", "Trần Văn Phúc · BN-08421", "Khám tổng quát", "P.101", <StatusPill key="2" tone="amber">Chờ xác nhận</StatusPill>],
  ["10:00", "Lê Minh Châu · BN-11203", "Siêu âm tổng quát", "P.307", <StatusPill key="3" tone="green">Đã check-in</StatusPill>],
  ["10:15", "Phạm Thị Hồng · BN-09682", "Khám bác sĩ", "BS. Phạm Ngọc Anh · P.205", <StatusPill key="4" tone="blue">Đã xác nhận</StatusPill>],
  ["10:30", "Hoàng Nam Sơn · BN-11824", "Xét nghiệm máu", "P.108", <StatusPill key="5" tone="red">Đã hủy</StatusPill>],
];

export function BranchScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <HospitalDashboard />;
    case "thong-tin-chi-nhanh": return <HospitalProfileScreen />;
    case "chuyen-khoa-dich-vu": return <AssignmentsScreen />;
    case "phong-kham": return <RoomsScreen />;
    case "nhan-su": return <StaffAccountsScreen />;
    case "lich-hen": return <HospitalAppointmentsScreen />;
    case "don-thuoc": return <HospitalPrescriptionsScreen />;
    case "kho-thuoc": return <HospitalInventoryScreen />;
    case "danh-gia": return <HospitalReviewsScreen />;
    case "bao-cao": return <HospitalReportsScreen />;
    case "nhat-ky": return <HospitalAuditScreen />;
    case "gio-lam-viec-benh-vien": return <HospitalWorkingScreen />;
    default: return null;
  }
}

function HospitalDashboard() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="BV Đa khoa Thành Phố" title="Trung tâm điều hành chi nhánh" description="Tình hình tiếp nhận, phòng khám và công việc cần phê duyệt trong hôm nay." actions={<><PortalAction>Xem lịch trực</PortalAction><PortalAction variant="default">Tạo lịch hẹn</PortalAction></>} />
      <MetricGrid>
        <MetricCard label="Lịch hôm nay" value="148" detail="18 lịch đang chờ xác nhận" icon={<CalendarCheck2 className="size-5" />} />
        <MetricCard label="Đã check-in" value="92" detail="62,2% tổng lịch hôm nay" trend="up" icon={<ClipboardCheck className="size-5" />} tone="green" />
        <MetricCard label="Phòng đang sử dụng" value="16/24" detail="4 phòng đang bảo trì" icon={<BedDouble className="size-5" />} tone="cyan" />
        <MetricCard label="Phiếu chờ duyệt" value="7" detail="5 nhập kho, 2 xuất kho" icon={<PackageCheck className="size-5" />} tone="amber" />
      </MetricGrid>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <PortalSection title="Nhịp tiếp nhận hôm nay" description="Số lượt theo khung giờ"><ProgressList items={[
          { label: "07:00 - 09:00", value: 88, display: "42 lượt" },
          { label: "09:00 - 11:00", value: 72, display: "35 lượt", color: "bg-cyan-500" },
          { label: "13:00 - 15:00", value: 58, display: "28 lượt", color: "bg-emerald-500" },
          { label: "15:00 - 17:00", value: 41, display: "20 lượt", color: "bg-amber-500" },
        ]} /></PortalSection>
        <PortalSection title="Việc cần xử lý">
          <div className="divide-y p-5 pt-2">
            {[
              ["18 lịch chờ xác nhận", "Lịch hẹn", "amber"],
              ["7 phiếu kho chờ duyệt", "Kho thuốc", "blue"],
              ["12 đánh giá chưa xem", "Đánh giá", "purple"],
              ["4 phòng đang bảo trì", "Phòng khám", "red"],
            ].map(([label, category, tone]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-medium">{label}</span>
                <StatusPill tone={tone as "amber" | "blue" | "purple" | "red"}>{category}</StatusPill>
              </div>
            ))}
          </div>
        </PortalSection>
      </div>
      <PortalSection title="Lịch sắp diễn ra">
        <PortalTable caption="Lịch khám sắp diễn ra" columns={["Giờ", "Bệnh nhân", "Loại lịch", "Bác sĩ / phòng", "Trạng thái"]} rows={appointmentRows.slice(0, 4)} />
      </PortalSection>
    </div>
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
      .catch(() => {
        if (active) {
          setState({
            status: "error",
            message: "Không thể tải thông tin chi nhánh. Vui lòng thử lại.",
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

    if (process.env.NEXT_PUBLIC_USE_MOCK_API === "false") {
      setState({
        status: "error",
        message:
          "Màn hình này hiện chỉ hỗ trợ demo.",
      });

      return () => {
        active = false;
        controller.abort();
      };
    }

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
            { page: 1, pageSize: 100 },
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
      .catch(() => {
        if (active) {
          setState({
            status: "error",
            message: "Không thể tải chuyên khoa và dịch vụ. Vui lòng thử lại.",
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
        description="Chọn danh mục đang được cung cấp tại chi nhánh. Thay đổi hiện demo."
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
  const filteredItems = items.filter((item) =>
    `${item.name} ${item.description}`
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi")),
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
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={`Tìm ${title.toLocaleLowerCase("vi")}`}
            className="h-9"
          />
        </label>
      </div>
      {filteredItems.length > 0 ? (
        <div className="divide-y">
          {filteredItems.map((item) => {
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

function RoomsScreen() {
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
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; hospital: Hospital; rooms: Room[] }
  >(() =>
    process.env.NEXT_PUBLIC_USE_MOCK_API === "false"
      ? {
          status: "error",
          message: "Quản lý phòng khám hiện chỉ hỗ trợ mock API.",
        }
      : { status: "loading" },
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    if (process.env.NEXT_PUBLIC_USE_MOCK_API === "false") {
      return () => {
        active = false;
        controller.abort();
      };
    }

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
        onRetry={
          process.env.NEXT_PUBLIC_USE_MOCK_API === "false"
            ? undefined
            : () => {
                setState({ status: "loading" });
                setAttempt((current) => current + 1);
              }
        }
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

  const roomRows = visibleRooms.map((room) => {
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
            <div className="space-y-2"><Label htmlFor="room-status">Trạng thái</Label><select id="room-status" name="status" value={roomStatus} onChange={(event) => setRoomStatus(event.currentTarget.value as RoomStatus)} disabled={isSaving} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value={RoomStatus.Available}>Khả dụng</option><option value={RoomStatus.Occupied}>Đang sử dụng</option><option value={RoomStatus.Maintenance}>Bảo trì</option></select></div>
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
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Tìm tên hoặc mã phòng"
              className="h-9"
            />
          </label>
          <label>
            <span className="sr-only">Lọc theo trạng thái phòng</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.currentTarget.value as RoomStatus | "all")
              }
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
              onChange={(event) =>
                setRecordFilter(
                  event.currentTarget.value as "active" | "deleted" | "all",
                )
              }
              className="h-9 w-full rounded-md border bg-white px-3 text-sm"
            >
              <option value="active">Đang quản lý</option>
              <option value="deleted">Đã xóa</option>
              <option value="all">Tất cả bản ghi</option>
            </select>
          </label>
        </div>
        {roomRows.length > 0 ? (
          <PortalTable caption="Danh sách phòng khám" columns={["Phòng", "Trạng thái", "Bản ghi", "Cập nhật", "Thao tác"]} rows={roomRows} />
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
  const [roleFilter, setRoleFilter] = useState<StaffRoleCode | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BaseStatus | "all">("all");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleCode, setRoleCode] = useState<StaffRoleCode>("Staff");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [doctorPrice, setDoctorPrice] = useState("");
  const [departmentUuid, setDepartmentUuid] = useState("");
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | {
        status: "success";
        hospital: Hospital;
        staff: HospitalStaffMember[];
        departments: Department[];
      }
  >(() =>
    process.env.NEXT_PUBLIC_USE_MOCK_API === "false"
      ? {
          status: "error",
          message: "Quản lý nhân sự hiện chỉ hỗ trợ mock API.",
        }
      : { status: "loading" },
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    if (process.env.NEXT_PUBLIC_USE_MOCK_API === "false") {
      return () => {
        active = false;
        controller.abort();
      };
    }

    hospitalService
      .getBranchProfile(controller.signal)
      .then(async ({ data: hospital }) => {
        const [staffResponse, departmentsResponse] = await Promise.all([
          staffService.getAll(
            hospital.uuid,
            { page: 1, pageSize: 100 },
            controller.signal,
          ),
          hospitalService.getAssignedDepartments(hospital.uuid, controller.signal),
        ]);
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
          });
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
        onRetry={
          process.env.NEXT_PUBLIC_USE_MOCK_API === "false"
            ? undefined
            : () => {
                setState({ status: "loading" });
                setAttempt((current) => current + 1);
              }
        }
      />
    );
  }

  const { hospital, staff, departments } = state;
  const normalizedSearch = search.trim().toLocaleLowerCase("vi");
  const filteredStaff = staff.filter((member) => {
    const matchesRole = roleFilter === "all" || member.RoleCode === roleFilter;
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
  function resetForm() {
    setPhone("");
    setPassword("");
    setRoleCode("Staff");
    setDoctorName("");
    setSpecialty("");
    setDoctorPrice("");
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
        RoleCode: roleCode,
        ...(roleCode === "doctor"
          ? {
              name: doctorName.trim(),
              specialty: specialty.trim(),
              price: Number(doctorPrice),
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

  const rows = filteredStaff.map((member) => [
    <div key={`${member.accountUuid}-identity`}>
      <p className="font-medium">{member.DisplayName}</p>
      <p className="mt-1 text-xs text-muted-foreground">{member.phone}</p>
    </div>,
    <StatusPill
      key={`${member.accountUuid}-role`}
      tone={member.RoleCode === "doctor" ? "blue" : member.RoleCode === "Staff" ? "green" : "amber"}
    >
      {getStaffRoleLabel(member.RoleCode)}
    </StatusPill>,
    member.DepartmentName ??
      (member.RoleCode === "WarehouseManager"
        ? "Kho thuốc"
        : member.RoleCode === "Staff"
          ? "Tiếp nhận"
          : "Chưa gán chuyên khoa"),
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
                value={roleCode}
                onChange={(event) =>
                  setRoleCode(event.currentTarget.value as StaffRoleCode)
                }
                disabled={isSaving}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="doctor">Bác sĩ (Doctor)</option>
                <option value="Staff">Tiếp nhận (Staff)</option>
                <option value="WarehouseManager">Quản lý kho</option>
              </select>
            </div>
            {roleCode === "doctor" ? (
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
                  <Label htmlFor="staff-doctor-price">Phí khám (VNĐ)</Label>
                  <Input
                    id="staff-doctor-price"
                    type="number"
                    min={0}
                    step={1000}
                    value={doctorPrice}
                    onChange={(event) =>
                      setDoctorPrice(event.currentTarget.value)
                    }
                    required
                    disabled={isSaving}
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
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
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
                disabled={isSaving || (roleCode === "doctor" && departments.length === 0)}
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
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Tìm tên, số điện thoại, chuyên khoa"
            className="h-9"
          />
          <select
            aria-label="Lọc theo vai trò"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.currentTarget.value as StaffRoleCode | "all")
            }
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="doctor">Bác sĩ (Doctor)</option>
            <option value="Staff">Tiếp nhận (Staff)</option>
            <option value="WarehouseManager">Quản lý kho</option>
          </select>
          <select
            aria-label="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.currentTarget.value as BaseStatus | "all")
            }
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Mọi trạng thái</option>
            <option value={BaseStatus.Active}>Hoạt động</option>
            <option value={BaseStatus.InActive}>Vô hiệu hóa</option>
          </select>
        </div>
        {rows.length > 0 ? (
          <PortalTable
            caption="Danh sách tài khoản nhân sự chi nhánh"
            columns={["Nhân sự", "Vai trò", "Bộ phận", "Trạng thái", "Cập nhật", "Thao tác"]}
            rows={rows}
          />
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
  return <OperationalTable eyebrow="Điều phối đơn thuốc" title="Đơn thuốc chi nhánh" description="Theo dõi đơn khi có mục đích nghiệp vụ; không thay đổi nội dung chuyên môn của bác sĩ." metrics={[
    ["Đơn hôm nay", "74", "62 đơn đã hoàn tất", <ClipboardCheck key="1" className="size-5" />],
    ["Chưa thanh toán", "12", "Tổng tạm tính 3,8 triệu", <CircleDollarSign key="2" className="size-5" />],
    ["Đã thanh toán", "58", "78,4% tổng đơn", <PackageCheck key="3" className="size-5" />],
    ["Đã hủy", "4", "Đều có ghi nhận lý do", <ShieldAlert key="4" className="size-5" />],
  ]} columns={["Mã đơn", "Bệnh nhân", "Bác sĩ", "Tổng tiền", "Trạng thái"]} rows={[
    ["RX-260923-074", "Nguyễn Thị Lan", "BS. Nguyễn Hoàng Minh", "486.000 đ", <StatusPill key="1" tone="amber">Chưa thanh toán</StatusPill>],
    ["RX-260923-073", "Lê Minh Châu", "BS. Trần Thanh Vũ", "328.000 đ", <StatusPill key="2" tone="green">Đã thanh toán</StatusPill>],
    ["RX-260923-072", "Trần Văn Phúc", "BS. Nguyễn Hoàng Minh", "215.000 đ", <StatusPill key="3" tone="green">Đã thanh toán</StatusPill>],
    ["RX-260923-069", "Đỗ Hải Yến", "BS. Phạm Ngọc Anh", "0 đ", <StatusPill key="4" tone="red">Đã hủy</StatusPill>],
  ]} />;
}

function HospitalInventoryScreen() {
  return <OperationalTable eyebrow="Giám sát dược" title="Kho thuốc chi nhánh" description="Theo dõi tồn kho và duyệt phiếu nhập xuất theo nguyên tắc bốn mắt." action="Duyệt phiếu chờ" metrics={[
    ["Mặt hàng", "428", "392 thuốc đang hoạt động", <PackageCheck key="1" className="size-5" />],
    ["Dưới ngưỡng", "16", "5 mặt hàng mức nghiêm trọng", <ShieldAlert key="2" className="size-5" />],
    ["Phiếu chờ duyệt", "7", "5 nhập, 2 xuất", <ClipboardCheck key="3" className="size-5" />],
    ["Giá trị tồn", "1,84 tỷ", "Cập nhật lúc 09:35", <CircleDollarSign key="4" className="size-5" />],
  ]} columns={["Mã phiếu", "Loại", "Người tạo", "Số mặt hàng", "Tạo lúc", "Trạng thái"]} rows={[
    ["NK-260923-005", <StatusPill key="1" tone="green">Nhập kho</StatusPill>, "Lê Văn Tuấn", "12", "23/09 08:44", <StatusPill key="2" tone="amber">Chờ duyệt</StatusPill>],
    ["XK-260923-002", <StatusPill key="3" tone="blue">Xuất kho</StatusPill>, "Ngô Thanh Hà", "5", "23/09 08:12", <StatusPill key="4" tone="amber">Chờ duyệt</StatusPill>],
    ["NK-260922-018", <StatusPill key="5" tone="green">Nhập kho</StatusPill>, "Lê Văn Tuấn", "24", "22/09 16:32", <StatusPill key="6" tone="green">Đã duyệt</StatusPill>],
    ["XK-260922-011", <StatusPill key="7" tone="blue">Xuất kho</StatusPill>, "Ngô Thanh Hà", "8", "22/09 14:08", <StatusPill key="8" tone="red">Đã hủy</StatusPill>],
  ]} />;
}

function HospitalReviewsScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Chất lượng dịch vụ" title="Đánh giá người bệnh" description="Kiểm duyệt đánh giá liên quan đến cơ sở, bác sĩ và dịch vụ tại chi nhánh." />
      <MetricGrid>
        <MetricCard label="Điểm trung bình" value="4,7/5" detail="Từ 1.248 đánh giá" icon={<Star className="size-5" />} tone="amber" />
        <MetricCard label="Chưa xem" value="12" detail="5 đánh giá trong hôm nay" icon={<ShieldAlert className="size-5" />} />
        <MetricCard label="Đang hiển thị" value="1.196" detail="95,8% tổng đánh giá" icon={<ClipboardCheck className="size-5" />} tone="green" />
        <MetricCard label="Đã ẩn" value="52" detail="Có lý do kiểm duyệt" icon={<Activity className="size-5" />} tone="red" />
      </MetricGrid>
      <PortalSection title="Hàng chờ kiểm duyệt">
        <PortalToolbar placeholder="Tìm nội dung đánh giá" filters={[{ label: "Tất cả đối tượng", options: ["Cơ sở", "Bác sĩ", "Dịch vụ"] }, { label: "Số sao", options: ["5 sao", "4 sao", "1-3 sao"] }]} />
        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {[
            ["Nguyễn T. L.", "5", "BS. Nguyễn Hoàng Minh", "Bác sĩ tư vấn kỹ, quy trình tiếp nhận nhanh và rõ ràng."],
            ["Trần V. P.", "4", "Siêu âm tổng quát", "Thời gian chờ hơi lâu nhưng nhân viên hỗ trợ nhiệt tình."],
            ["Lê M. C.", "5", "BV Đa khoa Thành Phố", "Cơ sở sạch sẽ, đặt lịch trước nên không phải chờ nhiều."],
            ["Phạm T. H.", "2", "Khoa Nhi", "Khó tìm khu vực phòng khám, cần bổ sung biển hướng dẫn."],
          ].map(([name, stars, target, content]) => (
            <article key={`${name}-${target}`} className="border p-5">
              <div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{name}</p><p className="mt-1 text-xs text-muted-foreground">{target}</p></div><StatusPill tone={Number(stars) >= 4 ? "green" : "amber"}>{stars} sao</StatusPill></div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{content}</p>
              <div className="mt-4 flex gap-2"><PortalAction variant="default">Hiển thị</PortalAction><PortalAction>Ẩn đánh giá</PortalAction></div>
            </article>
          ))}
        </div>
      </PortalSection>
    </div>
  );
}

function HospitalReportsScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Phân tích chi nhánh" title="Báo cáo vận hành" description="Theo dõi hiệu quả lịch khám, công suất phòng và doanh thu dự kiến tại chi nhánh." actions={<PortalAction variant="default">Tải báo cáo</PortalAction>} />
      <MetricGrid>
        <MetricCard label="Lịch tháng này" value="2.845" detail="Tăng 9,6% so với tháng trước" trend="up" icon={<CalendarCheck2 className="size-5" />} />
        <MetricCard label="Hoàn thành" value="88,2%" detail="Mục tiêu tháng là 85%" trend="up" icon={<ClipboardCheck className="size-5" />} tone="green" />
        <MetricCard label="Công suất phòng" value="76%" detail="Cao điểm 09:00 - 11:00" icon={<BedDouble className="size-5" />} tone="cyan" />
        <MetricCard label="Doanh thu dự kiến" value="3,24 tỷ" detail="Khám, dịch vụ và đơn thuốc" icon={<CircleDollarSign className="size-5" />} tone="amber" />
      </MetricGrid>
      <div className="grid gap-6 lg:grid-cols-2">
        <PortalSection title="Hiệu suất chuyên khoa"><ProgressList items={[
          { label: "Tim mạch", value: 92, display: "92%" },
          { label: "Nội tổng quát", value: 84, display: "84%", color: "bg-cyan-500" },
          { label: "Nhi khoa", value: 78, display: "78%", color: "bg-emerald-500" },
          { label: "Cơ xương khớp", value: 65, display: "65%", color: "bg-amber-500" },
        ]} /></PortalSection>
        <PortalSection title="Cơ cấu doanh thu"><ProgressList items={[
          { label: "Dịch vụ y tế", value: 74, display: "1,42 tỷ" },
          { label: "Khám bác sĩ", value: 58, display: "1,08 tỷ", color: "bg-cyan-500" },
          { label: "Đơn thuốc", value: 41, display: "740 triệu", color: "bg-emerald-500" },
        ]} /></PortalSection>
      </div>
    </div>
  );
}

function HospitalAuditScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Kiểm toán chi nhánh" title="Nhật ký hoạt động" description="Theo dõi thay đổi trạng thái, phê duyệt và truy cập nghiệp vụ trong chi nhánh." actions={<PortalAction>Xuất nhật ký</PortalAction>} />
      <PortalSection title="Hoạt động gần đây">
        <PortalToolbar placeholder="Tìm nhân sự hoặc hành động" filters={[{ label: "Tất cả phân hệ", options: ["Lịch hẹn", "Kho thuốc", "Nhân sự", "Phòng"] }]} />
        <PortalTable caption="Nhật ký chi nhánh" columns={["Thời gian", "Nhân sự", "Hành động", "Đối tượng", "Kết quả"]} rows={[
          ["23/09 09:38", "Trần Thu Hà", "appointment.check_in", "APT-10248", <StatusPill key="1" tone="green">Thành công</StatusPill>],
          ["23/09 09:22", "Nguyễn Minh Anh", "stock_ticket.confirm", "NK-260923-004", <StatusPill key="2" tone="green">Thành công</StatusPill>],
          ["23/09 08:56", "Lê Văn Tuấn", "inventory.adjust", "MED-0182", <StatusPill key="3" tone="amber">Đã ghi lý do</StatusPill>],
          ["23/09 08:31", "Trần Thu Hà", "appointment.assign_room", "APT-10244", <StatusPill key="4" tone="green">Thành công</StatusPill>],
        ]} />
      </PortalSection>
    </div>
  );
}

function OperationalTable({ eyebrow, title, description, action, metrics, columns, rows }: { eyebrow: string; title: string; description: string; action?: string; metrics: [string, string, string, React.ReactNode][]; columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow={eyebrow} title={title} description={description} actions={action ? <PortalAction variant="default"><Plus />{action}</PortalAction> : undefined} />
      <MetricGrid>{metrics.map(([label, value, detail, icon], index) => <MetricCard key={label} label={label} value={value} detail={detail} icon={icon} tone={(["blue", "cyan", "green", "amber"] as const)[index]} />)}</MetricGrid>
      <PortalSection title={`Danh sách ${title.toLowerCase()}`}>
        <PortalToolbar placeholder={`Tìm trong ${title.toLowerCase()}`} filters={[{ label: "Tất cả trạng thái", options: ["Hoạt động", "Chờ xử lý", "Đã hoàn tất", "Đã hủy"] }]} />
        <PortalTable caption={`Danh sách ${title.toLowerCase()}`} columns={columns} rows={rows} />
      </PortalSection>
    </div>
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
  if (isAxiosError<{ message?: string }>(error)) {
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

function getStaffRoleLabel(roleCode: StaffRoleCode) {
  switch (roleCode) {
    case "doctor":
      return "Bác sĩ";
    case "Staff":
      return "Tiếp nhận";
    case "WarehouseManager":
      return "Quản lý kho";
  }
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
