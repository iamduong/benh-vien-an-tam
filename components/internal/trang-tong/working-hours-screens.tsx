"use client";

import { isAxiosError } from "axios";
import { CalendarClock, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { PortalPageHeader, PortalSection, PortalTable, StatusPill } from "@/components/internal/portal-ui";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doctorScheduleService, type DoctorScheduleEntry } from "@/lib/services/doctor/DoctorScheduleService";
import { hospitalWorkingService, type HospitalWorkingData } from "@/lib/services/hospital/HospitalWorkingService";
import { adminTimeWorkingService, type AdminTimeWorkingItem } from "@/lib/services/time-working/AdminTimeWorkingService";
import { BaseStatus, type TimeWorking } from "@/types/models";

const dayNames = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

export function TimeWorkingCatalogScreen() {
  const [workings, setWorkings] = useState<TimeWorking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<TimeWorking | null>(null);
  const [visibility, setVisibility] = useState<"current" | "deleted">(
    "current",
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    adminTimeWorkingService
      .getAll(controller.signal)
      .then((response) => {
        if (!active) return;
        setWorkings((response.data ?? response.data ?? []).map(mapTimeWorking));
      })
      .catch((requestError) => {
        if (!active) return;
        console.error("Lỗi khi tải khung giờ làm việc:", requestError);
        setError("Không tải được danh sách khung giờ làm việc");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function saveWorking(value: ScheduleFormValue) {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        dayOfWeek: value.dayOfWeek,
        startTime: value.startTime,
        endTime: value.endTime,
        status: BaseStatus.Active,
      };
      const response = editing
        ? await adminTimeWorkingService.update(editing.uuid, payload)
        : await adminTimeWorkingService.create(payload);
      const saved = response.data ?? response.data;
      if (!saved) throw new Error("API không trả về khung giờ đã lưu");
      const mapped = mapTimeWorking(saved);
      setWorkings((current) =>
        (editing
          ? current.map((item) => (item.uuid === mapped.uuid ? mapped : item))
          : [...current, mapped]
        ).sort(compareTimeWorking),
      );
      setEditing(null);
    } catch (requestError) {
      console.error("Không thể lưu khung giờ:", requestError);
      setError(
        "Không thể lưu khung giờ. Khung giờ có thể đã tồn tại hoặc giờ kết thúc không hợp lệ.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleDeleted(working: TimeWorking) {
    if (submitting) return;
    const deleted = working.deletedAt.getTime() === 0;
    if (!window.confirm(`${deleted ? "Xóa" : "Khôi phục"} khung giờ này?`))
      return;

    setSubmitting(true);
    setError(null);
    try {
      if (deleted) await adminTimeWorkingService.delete(working.uuid);
      else await adminTimeWorkingService.restore(working.uuid);
      const now = new Date();
      setWorkings((current) =>
        current.map((item) =>
          item.uuid === working.uuid
            ? {
                ...item,
                deletedAt: deleted ? now : new Date(0),
                updatedAt: now,
              }
            : item,
        ),
      );
    } catch (requestError) {
      console.error("Không thể thay đổi khung giờ:", requestError);
      setError(`Không thể ${deleted ? "xóa" : "khôi phục"} khung giờ.`);
    } finally {
      setSubmitting(false);
    }
  }

  const visibleWorkings = workings.filter((working) =>
    visibility === "deleted"
      ? working.deletedAt.getTime() > 0
      : working.deletedAt.getTime() === 0,
  );
  const rows = visibleWorkings.map((working) => [
    dayNames[working.dayOfWeek],
    working.startTime,
    working.endTime,
    working.deletedAt.getTime() > 0 ? (
      <StatusPill key={`${working.uuid}-status`} tone="red">
        Đã xóa
      </StatusPill>
    ) : (
      <StatusPill key={`${working.uuid}-status`} tone="green">
        Hoạt động
      </StatusPill>
    ),
    <div key={`${working.uuid}-actions`} className="flex gap-1">
      {working.deletedAt.getTime() === 0 ? (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          disabled={submitting}
          aria-label="Sửa khung giờ"
          onClick={() => setEditing(working)}
        >
          <Pencil />
        </Button>
      ) : null}
      <Button
        type="button"
        size="sm"
        disabled={submitting}
        variant={working.deletedAt.getTime() > 0 ? "outline" : "destructive"}
        onClick={() => void toggleDeleted(working)}
      >
        {working.deletedAt.getTime() > 0 ? (
          <>
            <RotateCcw />
            Khôi phục
          </>
        ) : (
          <>
            <Trash2 />
            Xóa
          </>
        )}
      </Button>
    </div>,
  ]);

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">Đang tải...</div>
    );

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Danh mục lịch dùng chung"
        title="Khung giờ làm việc"
        description="Tạo các khung giờ chuẩn để gán cho bệnh viện và lịch làm việc bác sĩ."
      />
      {error ? (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      <PortalSection
        title="Danh sách khung giờ"
        description={`${workings.length} khung giờ đang hoạt động`}
      >
        <div className="flex justify-end border-b p-4">
          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as "current" | "deleted")
            }
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="current">Khung giờ hiện hành</option>
            <option value="deleted">Đã xóa</option>
          </select>
        </div>
        <PortalTable
          caption="Danh sách khung giờ làm việc"
          columns={["Ngày", "Bắt đầu", "Kết thúc", "Trạng thái", "Thao tác"]}
          rows={rows}
        />
      </PortalSection>
      <ScheduleForm
        key={editing?.uuid ?? "create-time-working"}
        title={editing ? "Chỉnh sửa khung giờ" : "Tạo khung giờ mới"}
        submitLabel={editing ? "Lưu thay đổi" : "Lưu khung giờ"}
        initialValue={
          editing
            ? {
                dayOfWeek: editing.dayOfWeek,
                startTime: editing.startTime,
                endTime: editing.endTime,
              }
            : undefined
        }
        submitting={submitting}
        onCancel={editing ? () => setEditing(null) : undefined}
        onSubmit={(value) => void saveWorking(value)}
      />
    </div>
  );
}

function mapTimeWorking(item: AdminTimeWorkingItem): TimeWorking {
  return {
    uuid: item.uuid,
    dayOfWeek: item.dayOfWeek,
    startTime: item.startTime.slice(0, 5),
    endTime: item.endTime.slice(0, 5),
    status: item.status,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    deletedAt: item.deletedAt ? new Date(item.deletedAt) : new Date(0),
  };
}

function compareTimeWorking(left: TimeWorking, right: TimeWorking) {
  return (
    left.dayOfWeek - right.dayOfWeek ||
    left.startTime.localeCompare(right.startTime)
  );
}


export function DoctorWorkingScreen({ view = "schedule" }: { view?: "schedule" }) {
  const [schedule, setSchedule] = useState<DoctorScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    doctorScheduleService.getMine(controller.signal)
      .then((response) => setSchedule(response.data))
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(getWorkingError(requestError, "Không thể tải lịch làm việc."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingState label="Đang tải lịch làm việc bác sĩ" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Lịch cá nhân"
        title="Giờ làm việc bác sĩ"
        description="Thời khóa biểu và phòng làm việc do bệnh viện phân công."
        actions={<StatusPill tone="blue">{schedule.length} ca làm việc</StatusPill>}
      />
      <PortalSection title="Thời khóa biểu" description="Lịch làm việc hiện hành theo tuần.">
        {schedule.length ? <WeeklySchedule schedule={schedule} /> : <EmptyState message="Bạn chưa được phân ca làm việc." />}
      </PortalSection>
    </div>
  );
}

export function WeeklySchedule({
  schedule,
}: {
  schedule: Array<Pick<DoctorScheduleEntry, "uuid" | "dayOfWeek" | "startTime" | "endTime" | "roomName">>;
}) {
  const rows = [...schedule]
    .sort((left, right) => left.dayOfWeek - right.dayOfWeek || left.startTime.localeCompare(right.startTime))
    .map((item) => [
      dayNames[item.dayOfWeek],
      `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}`,
      item.roomName || "Chưa phân phòng",
      <StatusPill key={`${item.uuid}-status`} tone="green">Đang áp dụng</StatusPill>,
    ]);
  return <PortalTable caption="Thời khóa biểu bác sĩ" columns={["Ngày", "Khung giờ", "Phòng", "Trạng thái"]} rows={rows} />;
}

export function HospitalWorkingScreen({ view = "booking-hours" }: { view?: "booking-hours" }) {
  const [data, setData] = useState<HospitalWorkingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedWorkingUuid, setSelectedWorkingUuid] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await hospitalWorkingService.getBranchWorkings(signal);
      setData(response.data);
      setSelectedWorkingUuid(response.data.availableWorkings[0]?.uuid ?? "");
      setError("");
    } catch (requestError) {
      if (!signal?.aborted) setError(getWorkingError(requestError, "Không thể tải giờ làm việc bệnh viện."));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function addWorking() {
    if (!selectedWorkingUuid || saving) return;
    setSaving(true);
    try {
      await hospitalWorkingService.add(selectedWorkingUuid);
      await load();
    } catch (requestError) {
      setError(getWorkingError(requestError, "Không thể thêm giờ làm việc."));
    } finally {
      setSaving(false);
    }
  }

  async function removeWorking(uuid: string) {
    if (saving || !window.confirm("Xóa khung giờ này khỏi lịch bệnh viện?")) return;
    setSaving(true);
    try {
      await hospitalWorkingService.delete(uuid);
      await load();
    } catch (requestError) {
      setError(getWorkingError(requestError, "Không thể xóa giờ làm việc."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Đang tải giờ làm việc bệnh viện" />;
  if (error && !data) return <ErrorState message={error} onRetry={() => void load()} />;

  const rows = (data?.assignedWorkings ?? []).map((item) => [
    dayNames[item.dayOfWeek],
    `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}`,
    <StatusPill key={`${item.uuid}-status`} tone="green">Đang áp dụng</StatusPill>,
    <Button key={`${item.uuid}-delete`} type="button" size="sm" variant="destructive" disabled={saving} onClick={() => void removeWorking(item.uuid)}>
      <Trash2 />Xóa
    </Button>,
  ]);

  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Vận hành chi nhánh" title="Giờ làm việc bệnh viện" description="Các khung giờ bệnh nhân có thể đăng ký đến khám." />
      {error ? <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <PortalSection title="Thêm khung giờ" description="Chọn từ danh mục khung giờ đang hoạt động.">
        <div className="flex flex-col gap-3 p-5 sm:flex-row">
          <select value={selectedWorkingUuid} onChange={(event) => setSelectedWorkingUuid(event.target.value)} className="h-10 flex-1 rounded-md border bg-white px-3 text-sm">
            <option value="">Chọn khung giờ</option>
            {(data?.availableWorkings ?? []).map((item) => (
              <option key={item.uuid} value={item.uuid}>{dayNames[item.dayOfWeek]} · {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}</option>
            ))}
          </select>
          <Button type="button" disabled={!selectedWorkingUuid || saving} onClick={() => void addWorking()}><Plus />Thêm khung giờ</Button>
        </div>
      </PortalSection>
      <PortalSection title="Lịch đang áp dụng" description={`${rows.length} khung giờ đã gán`}>
        {rows.length ? <PortalTable caption="Giờ làm việc bệnh viện" columns={["Ngày", "Khung giờ", "Trạng thái", ""]} rows={rows} /> : <EmptyState message="Bệnh viện chưa có giờ làm việc." />}
      </PortalSection>
    </div>
  );
}

type ScheduleFormValue = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

function ScheduleForm({
  title,
  submitLabel,
  initialValue,
  submitting = false,
  onCancel,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  initialValue?: Partial<ScheduleFormValue>;
  submitting?: boolean;
  onCancel?: () => void;
  onSubmit: (value: ScheduleFormValue) => void;
}) {
  const [dayOfWeek, setDayOfWeek] = useState(initialValue?.dayOfWeek ?? 1);
  const [startTime, setStartTime] = useState(initialValue?.startTime ?? "07:00");
  const [endTime, setEndTime] = useState(initialValue?.endTime ?? "08:00");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ dayOfWeek, startTime, endTime });
  }

  return (
    <PortalSection title={title}>
      <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2"><Label htmlFor={`${title}-day`}>Ngày</Label><select id={`${title}-day`} value={dayOfWeek} onChange={(event) => setDayOfWeek(Number(event.target.value))} className="h-10 w-full rounded-md border px-3 text-sm">{dayNames.map((day, index) => <option key={day} value={index}>{day}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor={`${title}-start`}>Bắt đầu</Label><Input id={`${title}-start`} type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required /></div>
        <div className="space-y-2"><Label htmlFor={`${title}-end`}>Kết thúc</Label><Input id={`${title}-end`} type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required /></div>
        <div className="flex justify-end gap-2 sm:col-span-3">{onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button> : null}<Button type="submit" disabled={submitting}><CalendarClock />{submitting ? "Đang lưu..." : submitLabel}</Button></div>
      </form>
    </PortalSection>
  );
}

function getWorkingError(error: unknown, fallback: string) {
  return isAxiosError(error) && typeof error.response?.data?.message === "string"
    ? error.response.data.message
    : error instanceof Error ? error.message : fallback;
}
