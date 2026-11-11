"use client";

import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";

import { ErrorState, LoadingState } from "@/components/shared/data-state";
import {
  INTERNAL_PAGE_SIZE,
  PortalPageHeader,
  PortalPagination,
  PortalSection,
  PortalTable,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  branchAppointmentService,
  type BranchAppointment,
  type CreateBranchAppointmentRequest,
} from "@/lib/services/hospital/BranchAppointmentService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import {
  AppointmentStatus,
  AppointmentType,
  Gender,
  type Hospital,
} from "@/types/models";

type ScreenState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      hospital: Hospital;
      appointments: BranchAppointment[];
    };

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Pending]: "Chờ duyệt",
  [AppointmentStatus.Approved]: "Đã duyệt",
  [AppointmentStatus.Unconfirmed]: "Không xác nhận",
  [AppointmentStatus.CheckedIn]: "Đang khám",
  [AppointmentStatus.Done]: "Hoàn thành",
  [AppointmentStatus.Cancelled]: "Đã hủy",
};

const typeLabels: Record<AppointmentType, string> = {
  [AppointmentType.Doctor]: "Khám bác sĩ",
  [AppointmentType.Hospital]: "Khám tại viện",
  [AppointmentType.Service]: "Khám dịch vụ",
};

const vietnamDateTime = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

export function BranchAppointmentsScreen() {
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AppointmentType | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<BranchAppointment | null>(null);
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.Other);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    AppointmentType.Hospital,
  );
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<ScreenState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const query = {
      search: search.trim() || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      type: typeFilter === "all" ? undefined : typeFilter,
      from: fromDate || undefined,
      to: toDate || undefined,
      page: 1,
      pageSize: 100,
    };

    hospitalService
      .getBranchProfile(controller.signal)
      .then(async ({ data: hospital }) => {
        const firstPage = await branchAppointmentService.getAll(
          hospital.uuid,
          query,
          controller.signal,
        );
        const remainingPages = await Promise.all(
          Array.from(
            { length: Math.max(firstPage.data.TotalPages - 1, 0) },
            (_, index) =>
              branchAppointmentService.getAll(
                hospital.uuid,
                { ...query, page: index + 2 },
                controller.signal,
              ),
          ),
        );
        if (!active) return;

        const appointments = [
          ...firstPage.data.Items,
          ...remainingPages.flatMap((page) => page.data.Items),
        ];
        setState({ status: "success", hospital, appointments });
        setSelected((current) =>
          current
            ? appointments.find((item) => item.uuid === current.uuid) ?? null
            : null,
        );
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: getError(error, "Không thể tải lịch hẹn chi nhánh. Vui lòng thử lại."),
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, fromDate, search, statusFilter, toDate, typeFilter]);

  if (state.status === "loading") {
    return <LoadingState label="Đang tải lịch hẹn chi nhánh" />;
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

  const { hospital, appointments } = state;
  const totalPages = Math.max(1, Math.ceil(appointments.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedAppointments = appointments.slice(
    (safePage - 1) * INTERNAL_PAGE_SIZE,
    safePage * INTERNAL_PAGE_SIZE,
  );

  function updateLocal(updated: BranchAppointment) {
    setState((current) =>
      current.status === "success"
        ? {
            ...current,
            appointments: current.appointments.map((item) =>
              item.uuid === updated.uuid ? updated : item,
            ),
          }
        : current,
    );
    setSelected(updated);
  }

  async function createAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status !== "success" || isSaving) return;

    setIsSaving(true);
    setMessage("");
    const request: CreateBranchAppointmentRequest = {
      patientName: patientName.trim(),
      gender,
      appointmentDate: new Date(appointmentDate).toISOString(),
      type: appointmentType,
      note: note.trim(),
    };
    try {
      const response = await branchAppointmentService.create(
        hospital.uuid,
        request,
      );
      setState((current) =>
        current.status === "success"
          ? {
              ...current,
              appointments: [response.data, ...current.appointments],
            }
          : current,
      );
      setSelected(response.data);
      setMessage(`Đã tạo lịch cho ${response.data.patientName}.`);
      setShowForm(false);
      setPatientName("");
      setGender(Gender.Other);
      setAppointmentDate("");
      setAppointmentType(AppointmentType.Hospital);
      setNote("");
    } catch (error) {
      setMessage(getError(error, "Không thể tạo lịch hẹn. Vui lòng thử lại."));
    } finally {
      setIsSaving(false);
    }
  }

  async function runStatusAction(
    appointment: BranchAppointment,
    nextStatus:
      | AppointmentStatus.Approved
      | AppointmentStatus.Unconfirmed
      | AppointmentStatus.Cancelled,
  ) {
    if (isSaving) return;
    setIsSaving(true);
    setMessage("");
    try {
      const response = await branchAppointmentService.updateStatus(
        hospital.uuid,
        appointment.uuid,
        nextStatus,
      );
      updateLocal(response.data);
      setMessage(`Đã cập nhật trạng thái: ${statusLabels[nextStatus]}.`);
    } catch (error) {
      setMessage(getError(error, "Không thể cập nhật lịch hẹn. Vui lòng thử lại."));
    } finally {
      setIsSaving(false);
    }
  }

  const rows = paginatedAppointments.map((appointment) => [
    vietnamDateTime.format(appointment.appointmentDate),
    <div key={`${appointment.uuid}-patient`}>
      <p className="font-medium">{appointment.patientName}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        {appointment.medicalCode}
      </p>
      {appointment.isWalkIn ? (
        <p className="mt-1 text-xs text-muted-foreground">Khách vãng lai</p>
      ) : null}
    </div>,
    typeLabels[appointment.type],
    <StatusPill
      key={`${appointment.uuid}-status`}
      tone={
        appointment.status === AppointmentStatus.Pending
          ? "amber"
          : appointment.status === AppointmentStatus.Approved
            ? "blue"
            : appointment.status === AppointmentStatus.Done
              ? "green"
              : appointment.status === AppointmentStatus.Cancelled
                ? "red"
                : "neutral"
      }
    >
      {statusLabels[appointment.status]}
    </StatusPill>,
    <Button
      key={`${appointment.uuid}-details`}
      type="button"
      size="sm"
      variant={selected?.uuid === appointment.uuid ? "default" : "outline"}
      onClick={() => setSelected(appointment)}
    >
      Chi tiết
    </Button>,
  ]);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Tiếp nhận lịch hẹn"
        title="Lịch hẹn chi nhánh"
        description={`Quản lý lịch hẹn tại ${hospital.name} và tạo lịch cho khách vãng lai.`}
        actions={
          <Button
            type="button"
            onClick={() => {
              setShowForm((current) => !current);
              setMessage("");
            }}
          >
            {showForm ? "Đóng biểu mẫu" : "Thêm lịch hẹn"}
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
          title="Tạo lịch khách vãng lai"
          description="Lịch được lưu không gắn PatientUuid và không tự phân bác sĩ hoặc phòng khám."
        >
          <form onSubmit={createAppointment} className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="branch-appointment-patient">Họ tên khách</Label>
              <Input
                id="branch-appointment-patient"
                value={patientName}
                onChange={(event) => setPatientName(event.currentTarget.value)}
                minLength={2}
                maxLength={100}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-appointment-gender">Giới tính</Label>
              <select
                id="branch-appointment-gender"
                value={gender}
                onChange={(event) => setGender(event.currentTarget.value as Gender)}
                className="h-10 w-full rounded-md border px-3 text-sm"
                disabled={isSaving}
              >
                <option value={Gender.Other}>Khác</option>
                <option value={Gender.Male}>Nam</option>
                <option value={Gender.Female}>Nữ</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-appointment-date">Ngày và giờ</Label>
              <Input
                id="branch-appointment-date"
                type="datetime-local"
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.currentTarget.value)}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-appointment-type">Loại lịch</Label>
              <select
                id="branch-appointment-type"
                value={appointmentType}
                onChange={(event) =>
                  setAppointmentType(event.currentTarget.value as AppointmentType)
                }
                className="h-10 w-full rounded-md border px-3 text-sm"
                disabled={isSaving}
              >
                {Object.values(AppointmentType).map((type) => (
                  <option key={type} value={type}>{typeLabels[type]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="branch-appointment-note">Ghi chú</Label>
              <Textarea
                id="branch-appointment-note"
                value={note}
                onChange={(event) => setNote(event.currentTarget.value)}
                maxLength={1000}
                rows={3}
                disabled={isSaving}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Đang tạo..." : "Tạo lịch"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setShowForm(false)}
              >
                Hủy
              </Button>
            </div>
          </form>
        </PortalSection>
      ) : null}

      <PortalSection
        title="Danh sách lịch hẹn"
        description={`${appointments.length} lịch theo điều kiện lọc`}
      >
        <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 sm:grid-cols-2 xl:grid-cols-5">
          <Input
            aria-label="Tìm bệnh nhân hoặc mã y tế"
            value={search}
            onChange={(event) => { setSearch(event.currentTarget.value); setPage(1); }}
            placeholder="Tên hoặc mã lịch"
            className="h-9"
          />
          <Input
            aria-label="Từ ngày"
            type="date"
            value={fromDate}
            onChange={(event) => { setFromDate(event.currentTarget.value); setPage(1); }}
            className="h-9"
          />
          <Input
            aria-label="Đến ngày"
            type="date"
            value={toDate}
            onChange={(event) => { setToDate(event.currentTarget.value); setPage(1); }}
            className="h-9"
          />
          <select
            aria-label="Lọc trạng thái lịch hẹn"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.currentTarget.value as AppointmentStatus | "all");
              setPage(1);
            }}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Mọi trạng thái</option>
            {Object.values(AppointmentStatus).map((status) => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
          <select
            aria-label="Lọc loại lịch hẹn"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.currentTarget.value as AppointmentType | "all");
              setPage(1);
            }}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">Mọi loại lịch</option>
            {Object.values(AppointmentType).map((type) => (
              <option key={type} value={type}>{typeLabels[type]}</option>
            ))}
          </select>
        </div>
        {rows.length ? (
          <>
            <PortalTable
              caption="Lịch hẹn thuộc chi nhánh"
              columns={["Ngày / giờ", "Bệnh nhân", "Loại lịch", "Trạng thái", ""]}
              rows={rows}
            />
            <PortalPagination page={safePage} totalItems={appointments.length} onPageChange={setPage} />
          </>
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {appointments.length
              ? "Không có lịch hẹn phù hợp với bộ lọc."
              : "Chi nhánh chưa có lịch hẹn nào."}
          </p>
        )}
      </PortalSection>

      {selected ? (
        <PortalSection
          title={`Chi tiết lịch · ${selected.patientName}`}
          description={`${selected.medicalCode} · ${vietnamDateTime.format(selected.appointmentDate)}`}
        >
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <Detail label="Đối tượng" value={selected.isWalkIn ? "Khách vãng lai" : "Người bệnh"} />
            <Detail label="Giới tính" value={genderLabels[selected.gender as Gender] ?? selected.gender} />
            <Detail label="Loại lịch" value={typeLabels[selected.type]} />
            <Detail label="Trạng thái" value={statusLabels[selected.status]} />
            <div className="border p-3 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Ghi chú</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{selected.note || "Không có ghi chú."}</p>
            </div>
            {selected.status === AppointmentStatus.Pending ? (
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button
                  type="button"
                  disabled={isSaving}
                  onClick={() => void runStatusAction(selected, AppointmentStatus.Approved)}
                >
                  Duyệt lịch
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => void runStatusAction(selected, AppointmentStatus.Unconfirmed)}
                >
                  Không xác nhận
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSaving}
                  onClick={() => void runStatusAction(selected, AppointmentStatus.Cancelled)}
                >
                  Hủy lịch
                </Button>
              </div>
            ) : selected.status === AppointmentStatus.Approved ? (
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSaving}
                  onClick={() => void runStatusAction(selected, AppointmentStatus.Cancelled)}
                >
                  Hủy lịch
                </Button>
              </div>
            ) : null}
          </div>
        </PortalSection>
      ) : null}
    </div>
  );
}

const genderLabels: Record<Gender, string> = {
  [Gender.Other]: "Khác",
  [Gender.Male]: "Nam",
  [Gender.Female]: "Nữ",
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function getError(error: unknown, fallback: string) {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.message
      ? `Không thể thực hiện: ${error.response.data.message}`
      : fallback;
  }
  return error instanceof Error && error.message
    ? `Không thể thực hiện: ${error.message}`
    : fallback;
}
