"use client";

import { isAxiosError } from "axios";
import {
  CalendarClock,
  Check,
  FilePenLine,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { mockServiceWorkings } from "@/data/mocks/service-workings";
import { mockTimeWorkings } from "@/data/mocks/time-workings";
import {
  PortalAction,
  PortalPageHeader,
  PortalSection,
  PortalTable,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  hospitalWorkingService,
  type HospitalWorkingData,
  type HospitalWorkingSlot,
} from "@/lib/services/hospital/HospitalWorkingService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { roomService } from "@/lib/services/hospital/RoomService";
import {
  adminTimeWorkingService,
  type AdminTimeWorkingItem,
} from "@/lib/services/time-working/AdminTimeWorkingService";
import {
  doctorWorkSubmissionService,
  type DoctorSchedule,
  type DoctorWorkingOverview,
  type DoctorWorkSubmission,
  type DoctorWorkSubmissionStatus,
  type DoctorWorkSubmissionType,
  type WorkingHourOption,
} from "@/lib/services/doctor/DoctorWorkSubmissionService";
import { BaseStatus, type Room, type TimeWorking } from "@/types/models";

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
        description="Tạo các khung giờ chuẩn để gán cho bác sĩ, bệnh viện và dịch vụ."
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

export function DoctorWorkingScreen({ view = "schedule" }: { view?: "schedule" | "requests" }) {
  const [data, setData] = useState<DoctorWorkingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingAssignmentUuid, setEditingAssignmentUuid] = useState("");
  const [requestedWorkingHourUuid, setRequestedWorkingHourUuid] = useState("");
  const [requestedWorkingHourUuids, setRequestedWorkingHourUuids] = useState<string[]>([]);
  const [submissionType, setSubmissionType] =
    useState<DoctorWorkSubmissionType>("Change");
  const [reason, setReason] = useState("");

  const loadData = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await doctorWorkSubmissionService.getMine(signal);
      setData(response.data);
      setError(null);
    } catch (requestError) {
      if (signal?.aborted) return;
      setError(
        getWorkingError(
          requestError,
          "Không tải được lịch làm việc của bác sĩ.",
        ),
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => loadData(controller.signal));
    return () => controller.abort();
  }, [loadData]);

  const activeAssignmentUuid = editingAssignmentUuid;
  const selectedAssignment = data?.schedule.find(
    (item) => item.doctorScheduleUuid === activeAssignmentUuid,
  );
  const pendingAssignmentUuids = new Set(
    data?.submissions
      .filter(
        (
          item,
        ): item is DoctorWorkSubmission & { doctorScheduleUuid: string } =>
          item.status === "Pending" && Boolean(item.doctorScheduleUuid),
      )
      .map((item) => item.doctorScheduleUuid) ?? [],
  );
  const targetDayOfWeek = selectedAssignment?.dayOfWeek;
  const requestedOptions = (data?.availableWorkingHours ?? []).filter(
    (item) => {
      if (
        item.dayOfWeek !== targetDayOfWeek ||
        item.uuid === selectedAssignment?.uuid
      )
        return false;
      if (submissionType !== "Add") return true;
      return !(data?.schedule ?? []).some(
        (assigned) =>
          assigned.dayOfWeek === item.dayOfWeek &&
          assigned.startTime.slice(0, 5) < item.endTime.slice(0, 5) &&
          item.startTime.slice(0, 5) < assigned.endTime.slice(0, 5),
      );
    },
  );
  const pendingAddWorkingUuids = new Set(
    (data?.submissions ?? [])
      .filter((item) => item.type === "Add" && item.status === "Pending" && item.requestedWorkingHour)
      .map((item) => item.requestedWorkingHour!.uuid),
  );
  const addableOptions = (data?.availableWorkingHours ?? []).filter(
    (candidate) =>
      !pendingAddWorkingUuids.has(candidate.uuid) &&
      !(data?.schedule ?? []).some(
        (assigned) =>
          assigned.dayOfWeek === candidate.dayOfWeek &&
          assigned.startTime.slice(0, 5) < candidate.endTime.slice(0, 5) &&
          candidate.startTime.slice(0, 5) < assigned.endTime.slice(0, 5),
      ),
  );
  const selectedAddWorkings = addableOptions.filter((item) =>
    requestedWorkingHourUuids.includes(item.uuid),
  );
  const activeRequestedWorkingHourUuid =
    requestedWorkingHourUuid || requestedOptions[0]?.uuid || "";
  const selectedRequestedWorkingHour = requestedOptions.find(
    (item) => item.uuid === activeRequestedWorkingHourUuid,
  );
  const changedPreviewSchedule = (data?.schedule ?? []).flatMap((item) => {
    if (item.doctorScheduleUuid !== activeAssignmentUuid) return [item];
    if (submissionType === "Delete") return [];
    return selectedRequestedWorkingHour
      ? [
          {
            ...item,
            ...selectedRequestedWorkingHour,
            doctorScheduleUuid: `preview-${item.doctorScheduleUuid}`,
          },
        ]
      : [item];
  });
  const previewSchedule =
    submissionType === "Add" && selectedAddWorkings.length
      ? [
          ...(data?.schedule ?? []),
          ...selectedAddWorkings.map((working) => ({
            ...working,
            doctorScheduleUuid: `preview-add-${working.uuid}`,
          })),
        ]
      : changedPreviewSchedule;

  function startRequest(
    assignmentUuid: string,
    type: DoctorWorkSubmissionType,
  ) {
    const assignment = data?.schedule.find(
      (item) => item.doctorScheduleUuid === assignmentUuid,
    );
    setEditingAssignmentUuid(assignmentUuid);
    setRequestedWorkingHourUuid(
      data?.availableWorkingHours.find(
        (item) =>
          item.dayOfWeek === assignment?.dayOfWeek &&
          item.uuid !== assignment?.uuid,
      )?.uuid ?? "",
    );
    setReason("");
    setSubmissionType(type);
    setError(null);
    setSuccess(null);
  }

  function startAddRequest() {
    setEditingAssignmentUuid("");
    setSubmissionType("Add");
    setRequestedWorkingHourUuid("");
    setRequestedWorkingHourUuids([]);
    setReason("");
    setError(null);
    setSuccess(null);
  }

  function cancelRequest() {
    setEditingAssignmentUuid("");
    setRequestedWorkingHourUuid("");
    setRequestedWorkingHourUuids([]);
    setReason("");
    setSubmissionType("Change");
  }

  async function submitRequest() {
    if (
      (submissionType !== "Add" && !activeAssignmentUuid) ||
      (submissionType === "Change" && !activeRequestedWorkingHourUuid) ||
      (submissionType === "Add" && requestedWorkingHourUuids.length === 0) ||
      submitting
    )
      return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await doctorWorkSubmissionService.create({
        doctorScheduleUuid:
          submissionType === "Add" ? null : activeAssignmentUuid,
        requestedWorkingHourUuid:
          submissionType === "Change" ? activeRequestedWorkingHourUuid : null,
        requestedWorkingHourUuids:
          submissionType === "Add" ? requestedWorkingHourUuids : [],
        type: submissionType,
        reason: reason.trim(),
      });
      await loadData();
      cancelRequest();
      setSuccess(
        "Đã gửi đơn thay đổi giờ làm. Lịch hiện tại chỉ đổi sau khi quản lý duyệt.",
      );
    } catch (requestError) {
      setError(
        getWorkingError(requestError, "Không thể gửi đơn thay đổi giờ làm."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Lịch cá nhân"
        title={view === "schedule" ? "Giờ làm việc bác sĩ" : "Thay đổi giờ làm việc"}
        description={view === "schedule" ? "Xem thời khóa biểu, ca trực và phòng làm việc đã được bệnh viện phân công." : "Tạo và theo dõi đơn đề nghị thêm, đổi hoặc xóa ca làm việc. Lịch chỉ thay đổi sau khi quản lý duyệt."}
        actions={
          <StatusPill tone="blue">
            {data?.schedule.length ?? 0} khung giờ
          </StatusPill>
        }
      />
      {error ? (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          role="status"
          className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {success}
        </p>
      ) : null}

      {view === "schedule" ? <PortalSection
        title="Thời khóa biểu"
        description="Lịch làm việc theo tuần trong khung giờ cố định từ 06:00 đến 20:00."
      >
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">
            Đang tải lịch làm việc...
          </p>
        ) : (
          <WeeklySchedule schedule={data?.schedule ?? []} />
        )}
      </PortalSection> : null}

      {view === "requests" ? <PortalSection
        title="Giờ làm việc hiện tại của bạn"
        description="Chọn thao tác cho từng khung giờ. Thời khóa biểu phía trên chỉ dùng để xem."
        action={
          <Button type="button" size="sm" onClick={startAddRequest}>
            <Plus />
            Thêm giờ làm việc
          </Button>
        }
      >
        {(data?.schedule ?? []).length ? (
          <div className="divide-y">
            {(data?.schedule ?? []).map((working, index) => {
              const pending = pendingAssignmentUuids.has(
                working.doctorScheduleUuid,
              );
              const selected =
                working.doctorScheduleUuid === activeAssignmentUuid;
              return (
                <div
                  key={working.doctorScheduleUuid}
                  className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${selected ? "bg-primary/5" : ""}`}
                >
                  <div>
                    <p className="font-semibold text-[#173b57]">
                      Giờ {String.fromCharCode(65 + index)}:{" "}
                      {formatWorking(working)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {working.roomName ?? "Chưa được phân phòng"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pending ? (
                      <StatusPill tone="amber">Đang chờ duyệt</StatusPill>
                    ) : (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            startRequest(
                              working.doctorScheduleUuid,
                              "Change",
                            )
                          }
                        >
                          <Pencil />
                          Đổi giờ
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            startRequest(
                              working.doctorScheduleUuid,
                              "Delete",
                            )
                          }
                        >
                          <Trash2 />
                          Xóa
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">
            Bạn chưa được phân công giờ làm việc.
          </p>
        )}
      </PortalSection> : null}

      {view === "requests" && (selectedAssignment || submissionType === "Add") ? (
        <>
          <PortalSection
            title="Thông tin giờ làm việc mới"
            description={
              submissionType === "Delete"
                ? "Bạn đang tạo đơn xin xóa khung giờ này."
                : submissionType === "Add"
                  ? "Chỉ hiển thị ngày và khung giờ đang được bệnh viện áp dụng."
                  : `Chỉ hiển thị khung giờ thuộc ${dayNames[selectedAssignment!.dayOfWeek]}.`
            }
          >
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {submissionType === "Add" ? (
                <fieldset className="space-y-3 sm:col-span-2">
                  <legend className="text-sm font-medium">Chọn các khung giờ muốn bổ sung</legend>
                  {addableOptions.length ? (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {addableOptions.map((working) => {
                        const checked = requestedWorkingHourUuids.includes(working.uuid);
                        return (
                          <label key={working.uuid} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${checked ? "border-primary bg-primary/5" : "bg-white"}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setRequestedWorkingHourUuids((current) =>
                                checked ? current.filter((uuid) => uuid !== working.uuid) : [...current, working.uuid],
                              )}
                              className="size-4 accent-primary"
                            />
                            <span>{formatWorking(working)}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">Không còn khung giờ bệnh viện phù hợp để đề nghị thêm.</p>}
                  <p className="text-xs text-muted-foreground">Đã chọn {requestedWorkingHourUuids.length} khung giờ. Tất cả dùng chung lý do bên dưới.</p>
                </fieldset>
              ) : (
                <div className="space-y-2">
                  <Label>Giờ làm việc hiện tại</Label>
                  <Input value={formatWorking(selectedAssignment!)} disabled />
                </div>
              )}
              {submissionType === "Change" ? (
                <div className="space-y-2">
                  <Label htmlFor="doctor-requested-working">
                    Giờ làm việc mới
                  </Label>
                  <select
                    id="doctor-requested-working"
                    value={activeRequestedWorkingHourUuid}
                    onChange={(event) =>
                      setRequestedWorkingHourUuid(event.target.value)
                    }
                    disabled={requestedOptions.length === 0}
                    className="h-10 w-full rounded-md border px-3 text-sm"
                  >
                    {requestedOptions.map((working) => (
                      <option key={working.uuid} value={working.uuid}>
                        {formatWorking(working)}
                      </option>
                    ))}
                  </select>
                  {requestedOptions.length === 0 ? (
                    <p className="text-xs text-red-600">
                      Không còn khung giờ phù hợp trong ngày này.
                    </p>
                  ) : null}
                </div>
              ) : submissionType === "Delete" ? (
                <div className="border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  Khung giờ sẽ được gỡ khỏi lịch nếu đơn được duyệt.
                </div>
              ) : null}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="doctor-working-reason">Lý do</Label>
                <Textarea
                  id="doctor-working-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  minLength={5}
                  maxLength={1000}
                  rows={4}
                  placeholder="Nhập lý do thay đổi lịch..."
                />
              </div>
            </div>
          </PortalSection>
          <PortalSection
            title="Thời khóa biểu mới"
            description="Bản xem trước nếu đề nghị được phê duyệt."
          >
            <WeeklySchedule
              schedule={previewSchedule}
              previewAssignmentUuid={
                submissionType === "Add"
                  ? "preview-add"
                  : submissionType === "Change"
                    ? `preview-${activeAssignmentUuid}`
                    : undefined
              }
            />
            <div className="flex justify-end gap-2 border-t bg-[#fbfdfe] p-4">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={cancelRequest}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant={
                  submissionType === "Delete" ? "destructive" : "default"
                }
                disabled={
                  submitting ||
                  (submissionType === "Change" && requestedOptions.length === 0) ||
                  (submissionType === "Add" && requestedWorkingHourUuids.length === 0) ||
                  reason.trim().length < 5
                }
                onClick={() => void submitRequest()}
              >
                <Send />
                {submitting ? "Đang gửi..." : "Gửi đơn"}
              </Button>
            </div>
          </PortalSection>
        </>
      ) : null}

      {view === "requests" ? <PortalSection
        title="Lịch sử đơn thay đổi"
        description={`${data?.submissions.length ?? 0} đơn đã gửi`}
      >
        <PortalTable
          caption="Lịch sử đơn thay đổi giờ làm"
          columns={[
            "Ngày gửi",
            "Từ khung giờ",
            "Sang khung giờ",
            "Lý do",
            "Trạng thái",
            "Phản hồi",
          ]}
          rows={(data?.submissions ?? []).map((submission) => [
            formatDateTime(submission.createdAt),
            submission.type === "Add"
              ? "Thêm mới"
              : submission.currentWorkingHour
                ? formatWorking(submission.currentWorkingHour)
                : "—",
            submission.type === "Delete"
              ? "Xóa khỏi lịch"
              : submission.requestedWorkingHour
                ? formatWorking(submission.requestedWorkingHour)
                : "—",
            submission.reason,
            submissionStatus(submission.status, submission.uuid),
            submission.reviewNote || "—",
          ])}
        />
      </PortalSection> : null}
    </div>
  );
}

function WeeklySchedule({
  schedule,
  previewAssignmentUuid,
}: {
  schedule: Array<WorkingHourOption & Pick<DoctorSchedule, "doctorScheduleUuid"> & Partial<Pick<DoctorSchedule, "roomName">>>;
  previewAssignmentUuid?: string;
}) {
  const startHour = 6;
  const endHour = 20;
  const hourHeight = 72;
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => startHour + index,
  );
  const orderedDays = [1, 2, 3, 4, 5, 6, 0];
  const calendarHeight = hours.length * hourHeight;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[72rem]">
        <div
          className="grid border-b bg-[#f6f9fb]"
          style={{ gridTemplateColumns: "5rem repeat(7, minmax(9rem, 1fr))" }}
        >
          <div className="border-r px-3 py-4 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Giờ
          </div>
          {orderedDays.map((dayOfWeek) => (
            <div
              key={dayOfWeek}
              className="border-r px-3 py-4 text-center text-sm font-bold text-[#173b57] last:border-r-0"
            >
              {dayNames[dayOfWeek]}
            </div>
          ))}
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: "5rem repeat(7, minmax(9rem, 1fr))" }}
        >
          <div
            className="relative border-r bg-[#fbfdfe]"
            style={{ height: calendarHeight }}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex h-[72px] items-start justify-end border-b px-3 pt-2 text-xs font-semibold text-muted-foreground"
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>
          {orderedDays.map((dayOfWeek) => (
            <div
              key={dayOfWeek}
              className="relative border-r bg-white last:border-r-0"
              style={{ height: calendarHeight }}
            >
              {hours.map((hour) => (
                <div key={hour} className="h-[72px] border-b" />
              ))}
              {schedule
                .filter((item) => item.dayOfWeek === dayOfWeek)
                .map((item) => {
                  const startMinutes = toMinutes(item.startTime);
                  const endMinutes = toMinutes(item.endTime);
                  const top =
                    ((startMinutes - startHour * 60) / 60) * hourHeight;
                  const rawHeight =
                    ((endMinutes - startMinutes) / 60) * hourHeight;
                  const height = Math.max(rawHeight - 8, 48);
                  const isPreview =
                    item.doctorScheduleUuid === previewAssignmentUuid ||
                    (previewAssignmentUuid === "preview-add" && item.doctorScheduleUuid.startsWith("preview-add-"));
                  return (
                    <div
                      key={item.doctorScheduleUuid}
                      className={`absolute inset-x-2 z-10 flex overflow-hidden rounded-md border p-2.5 shadow-sm ${isPreview ? "border-emerald-400 bg-emerald-50" : "border-primary/35 bg-[#e8f6fb]"}`}
                      style={{ top: Math.max(top + 4, 4), height }}
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p
                          className={`text-xs font-bold ${isPreview ? "text-emerald-700" : "text-primary"}`}
                        >
                          {item.startTime.slice(0, 5)}–
                          {item.endTime.slice(0, 5)}
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                          {isPreview ? "Giờ làm việc mới" : item.roomName ?? "Chưa phân phòng"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function toMinutes(value: string) {
  const [hour, minute] = value.slice(0, 5).split(":").map(Number);
  return hour * 60 + minute;
}

export function HospitalWorkingScreen({ view = "booking-hours" }: { view?: "booking-hours" | "submissions" }) {
  const [data, setData] = useState<HospitalWorkingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedWorkingUuid, setSelectedWorkingUuid] = useState("");
  const [editing, setEditing] = useState<{
    uuid: string;
    workingUuid: string;
  } | null>(null);
  const [submissions, setSubmissions] = useState<DoctorWorkSubmission[]>([]);
  const [reviewingUuid, setReviewingUuid] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewRoomUuid, setReviewRoomUuid] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);

  const refresh = useCallback(
    async (signal?: AbortSignal, showLoading = false) => {
      if (showLoading) setLoading(true);
      setLoadError(null);
      try {
        const response = await hospitalWorkingService.getBranchWorkings(signal);
        setData(response.data);
      } catch (requestError) {
        if (signal?.aborted) return;
        console.error(
          "Không thể tải giờ làm việc của chi nhánh:",
          requestError,
        );
        setLoadError(
          getWorkingError(
            requestError,
            "Không tải được giờ làm việc của chi nhánh.",
          ),
        );
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [],
  );

  const refreshSubmissions = useCallback(async (signal?: AbortSignal) => {
    try {
      const response =
        await doctorWorkSubmissionService.getHospitalSubmissions(signal);
      setSubmissions(response.data);
    } catch (requestError) {
      if (signal?.aborted) return;
      setActionError(
        getWorkingError(
          requestError,
          "Không tải được đơn thay đổi giờ làm của bác sĩ.",
        ),
      );
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      hospitalWorkingService.getBranchWorkings(controller.signal),
      doctorWorkSubmissionService.getHospitalSubmissions(controller.signal),
      hospitalService.getBranchProfile(controller.signal).then((hospitalResponse) =>
        roomService.getAll(hospitalResponse.data.uuid, { page: 1, pageSize: 100 }, controller.signal),
      ),
    ])
      .then(([response, submissionResponse, roomResponse]) => {
        if (controller.signal.aborted) return;
        setData(response.data);
        setSubmissions(submissionResponse.data);
        setRooms(roomResponse.data.Items);
        setLoadError(null);
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        console.error(
          "Không thể tải giờ làm việc của chi nhánh:",
          requestError,
        );
        setLoadError(
          getWorkingError(
            requestError,
            "Không tải được giờ làm việc của chi nhánh.",
          ),
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const assignedWorkings = data?.assignedWorkings ?? [];
  const addableWorkings = getAssignableWorkings(data, null);

  async function addWorking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const workingUuid = selectedWorkingUuid || addableWorkings[0]?.uuid;
    if (!workingUuid || submitting) return;

    setSubmitting(true);
    setActionError(null);
    setSuccess(null);
    try {
      await hospitalWorkingService.add(workingUuid);
      await refresh();
      setSelectedWorkingUuid("");
      setSuccess("Đã thêm khung giờ làm việc cho chi nhánh.");
    } catch (requestError) {
      console.error("Không thể thêm giờ làm việc cho chi nhánh:", requestError);
      setActionError(
        getWorkingError(requestError, "Không thể thêm khung giờ làm việc."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function updateWorking() {
    if (!editing || submitting) return;

    setSubmitting(true);
    setActionError(null);
    setSuccess(null);
    try {
      await hospitalWorkingService.update(editing.uuid, editing.workingUuid);
      await refresh();
      setEditing(null);
      setSuccess("Đã cập nhật khung giờ làm việc.");
    } catch (requestError) {
      console.error(
        "Không thể cập nhật giờ làm việc của chi nhánh:",
        requestError,
      );
      setActionError(
        getWorkingError(requestError, "Không thể cập nhật khung giờ làm việc."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteWorking(working: HospitalWorkingSlot) {
    if (
      submitting ||
      !window.confirm("Xóa khung giờ này khỏi lịch làm việc của chi nhánh?")
    )
      return;

    setSubmitting(true);
    setActionError(null);
    setSuccess(null);
    try {
      await hospitalWorkingService.delete(working.uuid);
      await refresh();
      if (editing?.uuid === working.uuid) setEditing(null);
      setSuccess("Đã xóa khung giờ khỏi lịch làm việc của chi nhánh.");
    } catch (requestError) {
      console.error("Không thể xóa giờ làm việc của chi nhánh:", requestError);
      setActionError(
        getWorkingError(requestError, "Không thể xóa khung giờ làm việc."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function reviewSubmission(
    submission: DoctorWorkSubmission,
    status: Extract<DoctorWorkSubmissionStatus, "Approved" | "Rejected">,
  ) {
    if (submitting) return;
    if (status === "Rejected" && reviewNote.trim().length < 3) {
      setActionError("Vui lòng nhập lý do từ chối ít nhất 3 ký tự.");
      return;
    }

    setSubmitting(true);
    setActionError(null);
    setSuccess(null);
    try {
      const response = await doctorWorkSubmissionService.review(
        submission.uuid,
        status,
        reviewNote.trim(),
        status === "Approved" ? reviewRoomUuid : undefined,
      );
      await Promise.all([refresh(), refreshSubmissions()]);
      setReviewingUuid("");
      setReviewNote("");
      setReviewRoomUuid("");
      setSuccess(response.message);
    } catch (requestError) {
      setActionError(
        getWorkingError(requestError, "Không thể xử lý đơn thay đổi giờ làm."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const rows = assignedWorkings.map((working) => {
    const isEditing = editing?.uuid === working.uuid;
    const editableOptions = getAssignableWorkings(data, working.uuid);
    return [
      dayNames[working.dayOfWeek],
      isEditing ? (
        <select
          key={`${working.uuid}-select`}
          value={editing.workingUuid}
          onChange={(event) =>
            setEditing((current) =>
              current
                ? { ...current, workingUuid: event.target.value }
                : current,
            )
          }
          className="h-9 min-w-48 rounded-md border px-3 text-sm"
          aria-label="Khung giờ mới"
        >
          {editableOptions.map((option) => (
            <option key={option.uuid} value={option.uuid}>
              {formatWorking(option)}
            </option>
          ))}
        </select>
      ) : (
        `${working.startTime.slice(0, 5)} - ${working.endTime.slice(0, 5)}`
      ),
      <StatusPill key={`${working.uuid}-status`} tone="green">
        Đang áp dụng
      </StatusPill>,
      <div key={`${working.uuid}-actions`} className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              type="button"
              size="sm"
              disabled={submitting || editableOptions.length === 0}
              onClick={() => void updateWorking()}
            >
              Lưu
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => setEditing(null)}
            >
              Hủy
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={submitting}
              aria-label="Sửa khung giờ"
              onClick={() =>
                setEditing({
                  uuid: working.uuid,
                  workingUuid: working.workingUuid,
                })
              }
            >
              <Pencil />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={submitting}
              aria-label="Xóa khung giờ"
              onClick={() => void deleteWorking(working)}
            >
              <Trash2 />
            </Button>
          </>
        )}
      </div>,
    ];
  });

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow={view === "booking-hours" ? "Cấu hình nhận đặt lịch" : "Điều phối nhân sự"}
        title={view === "booking-hours" ? "Khung giờ đặt lịch bệnh viện" : "Duyệt đơn thay đổi thời khóa biểu"}
        description={view === "booking-hours" ? "Các khung giờ khách hàng được phép chọn khi đặt lịch tại chi nhánh; không phải thời khóa biểu làm việc của bác sĩ." : "Xử lý đề nghị thay đổi ca làm trong thời khóa biểu thực tế của bác sĩ."}
        actions={
          <StatusPill tone="blue">
            {assignedWorkings.length} khung giờ
          </StatusPill>
        }
      />
      {actionError ? (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      ) : null}
      {loadError ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{loadError}</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void refresh(undefined, true)}
          >
            Thử tải lại
          </Button>
        </div>
      ) : null}
      {success ? (
        <p
          role="status"
          className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {success}
        </p>
      ) : null}
      {view === "booking-hours" ? <PortalSection
        title="Khung giờ nhận đặt lịch đang áp dụng"
        description="Chỉ các ngày và khung giờ trong danh sách này mới xuất hiện ở màn hình đặt lịch bệnh viện."
      >
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">
            Đang tải khung giờ nhận lịch...
          </p>
        ) : assignedWorkings.length ? (
          <PortalTable
            caption="Khung giờ khách được đặt lịch tại chi nhánh"
            columns={["Ngày", "Khung giờ", "Trạng thái", "Thao tác"]}
            rows={rows}
          />
        ) : (
          <p className="p-5 text-sm text-muted-foreground">
            Chi nhánh chưa cấu hình khung giờ nhận đặt lịch.
          </p>
        )}
      </PortalSection> : null}
      {view === "submissions" ? <PortalSection
        title="Duyệt đơn thay đổi giờ làm"
        description={`${submissions.filter((item) => item.status === "Pending").length} đơn của bác sĩ đang chờ xử lý`}
      >
        {submissions.length ? (
          <PortalTable
            caption="Đơn thay đổi giờ làm của bác sĩ"
            columns={[
              "Bác sĩ",
              "Lịch hiện tại",
              "Lịch đề nghị",
              "Lý do",
              "Trạng thái",
              "Thao tác",
            ]}
            rows={submissions.map((submission) => [
              <div key={`${submission.uuid}-doctor`}>
                <p>{submission.doctorName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Gửi {formatDateTime(submission.createdAt)}
                </p>
              </div>,
              submission.type === "Add"
                ? "Thêm mới"
                : submission.currentWorkingHour
                  ? formatWorking(submission.currentWorkingHour)
                  : "—",
              submission.type === "Delete"
                ? "Xóa khỏi lịch"
                : submission.requestedWorkingHour
                  ? formatWorking(submission.requestedWorkingHour)
                  : "—",
              <p
                key={`${submission.uuid}-reason`}
                className="max-w-xs whitespace-normal"
              >
                {submission.reason}
              </p>,
              submissionStatus(submission.status, submission.uuid),
              submission.status === "Pending" ? (
                <Button
                  key={`${submission.uuid}-review`}
                  type="button"
                  size="sm"
                  variant={
                    reviewingUuid === submission.uuid ? "default" : "outline"
                  }
                  onClick={() => {
                    setReviewingUuid(submission.uuid);
                    setReviewNote("");
                    setReviewRoomUuid(rooms[0]?.uuid ?? "");
                  }}
                >
                  <FilePenLine />
                  Xem và duyệt
                </Button>
              ) : (
                <span
                  key={`${submission.uuid}-done`}
                  className="text-xs text-muted-foreground"
                >
                  {submission.reviewNote || "Đã xử lý"}
                </span>
              ),
            ])}
          />
        ) : (
          <p className="p-5 text-sm text-muted-foreground">
            Chưa có đơn thay đổi giờ làm nào.
          </p>
        )}
        {submissions.find((item) => item.uuid === reviewingUuid) ? (
          <div className="space-y-4 border-t bg-[#fbfdfe] p-5">
            {submissions.find((item) => item.uuid === reviewingUuid)?.type !== "Delete" ? (
              <div className="space-y-2">
                <Label htmlFor="working-review-room">Phòng làm việc</Label>
                <select
                  id="working-review-room"
                  value={reviewRoomUuid}
                  onChange={(event) => setReviewRoomUuid(event.target.value)}
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                >
                  <option value="">Chọn phòng cho ca làm việc</option>
                  {rooms.map((room) => <option key={room.uuid} value={room.uuid}>{room.name}</option>)}
                </select>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="working-review-note">Phản hồi của quản lý</Label>
              <Textarea
                id="working-review-note"
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Ghi chú duyệt hoặc lý do từ chối..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={submitting || (submissions.find((item) => item.uuid === reviewingUuid)?.type !== "Delete" && !reviewRoomUuid)}
                onClick={() => {
                  const submission = submissions.find(
                    (item) => item.uuid === reviewingUuid,
                  );
                  if (submission) void reviewSubmission(submission, "Approved");
                }}
              >
                <Check />
                Duyệt và cập nhật lịch
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={submitting || reviewNote.trim().length < 3}
                onClick={() => {
                  const submission = submissions.find(
                    (item) => item.uuid === reviewingUuid,
                  );
                  if (submission) void reviewSubmission(submission, "Rejected");
                }}
              >
                <X />
                Từ chối
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => {
                  setReviewingUuid("");
                  setReviewNote("");
                  setReviewRoomUuid("");
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        ) : null}
      </PortalSection> : null}
      {view === "booking-hours" ? <PortalSection
        title="Thêm khung giờ nhận đặt lịch"
        description="Danh sách lựa chọn được lấy từ danh mục khung giờ đang hoạt động."
      >
        {loading ? (
          <p className="p-5 text-sm text-muted-foreground">
            Đang tải danh mục khung giờ...
          </p>
        ) : (
          <form
            onSubmit={(event) => void addWorking(event)}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="branch-working-slot">Khung giờ khách được đặt lịch</Label>
              <select
                id="branch-working-slot"
                value={selectedWorkingUuid || addableWorkings[0]?.uuid || ""}
                onChange={(event) => setSelectedWorkingUuid(event.target.value)}
                disabled={submitting || addableWorkings.length === 0}
                className="h-10 w-full rounded-md border px-3 text-sm"
              >
                {addableWorkings.map((working) => (
                  <option key={working.uuid} value={working.uuid}>
                    {formatWorking(working)}
                  </option>
                ))}
              </select>
              {addableWorkings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Không còn khung giờ khả dụng để thêm.
                </p>
              ) : null}
            </div>
            <Button
              type="submit"
              disabled={submitting || addableWorkings.length === 0}
            >
              <Plus />
              {submitting ? "Đang lưu..." : "Thêm giờ nhận lịch"}
            </Button>
          </form>
        )}
      </PortalSection> : null}
    </div>
  );
}

function getAssignableWorkings(
  data: HospitalWorkingData | null,
  excludedAssignmentUuid: string | null,
) {
  if (!data) return [];
  return data.availableWorkings.filter(
    (candidate) =>
      !data.assignedWorkings.some(
        (assigned) =>
          assigned.uuid !== excludedAssignmentUuid &&
          assigned.dayOfWeek === candidate.dayOfWeek &&
          assigned.startTime.slice(0, 5) < candidate.endTime.slice(0, 5) &&
          candidate.startTime.slice(0, 5) < assigned.endTime.slice(0, 5),
      ),
  );
}

function formatWorking(
  working: Pick<WorkingHourOption, "dayOfWeek" | "startTime" | "endTime">,
) {
  return `${dayNames[working.dayOfWeek]} - ${working.startTime.slice(0, 5)} đến ${working.endTime.slice(0, 5)}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function submissionStatus(status: DoctorWorkSubmissionStatus, key: string) {
  if (status === "Approved")
    return (
      <StatusPill key={key} tone="green">
        Đã duyệt
      </StatusPill>
    );
  if (status === "Rejected")
    return (
      <StatusPill key={key} tone="red">
        Đã từ chối
      </StatusPill>
    );
  return (
    <StatusPill key={key} tone="amber">
      Chờ duyệt
    </StatusPill>
  );
}

function getWorkingError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }
  return error instanceof Error ? error.message : fallback;
}

export function ServiceWorkingScreen() {
  return (
    <AssignmentScreen
      eyebrow="Lịch cung cấp dịch vụ"
      title="Giờ làm việc dịch vụ"
      description="Gán khung giờ thực hiện cho từng dịch vụ và gửi thay đổi lịch."
      assignmentCount={mockServiceWorkings.length}
    />
  );
}

type WorkingRequest = {
  code: string;
  doctor: string;
  date: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
};

type Schedule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  source: string;
};

const initialRequests: WorkingRequest[] = [
  {
    code: "WHR-2609-014",
    doctor: "BS. Nguyễn Hoàng Minh",
    date: "26/09/2026",
    dayOfWeek: 5,
    startTime: "07:00",
    endTime: "11:30",
    reason: "Điều chỉnh lịch trực chiều",
    status: "pending",
  },
  {
    code: "WHR-2609-012",
    doctor: "BS. Phạm Ngọc Anh",
    date: "25/09/2026",
    dayOfWeek: 6,
    startTime: "08:00",
    endTime: "12:00",
    reason: "Bổ sung ca khám cuối tuần",
    status: "pending",
  },
  {
    code: "WHR-2608-008",
    doctor: "BS. Trần Thanh Vũ",
    date: "18/08/2026",
    dayOfWeek: 2,
    startTime: "13:00",
    endTime: "17:00",
    reason: "Bổ sung ca chiều",
    status: "approved",
  },
];

function AssignmentScreen({
  eyebrow,
  title,
  description,
  assignmentCount,
  request = false,
  admin = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  assignmentCount: number;
  request?: boolean;
  admin?: boolean;
}) {
  const [requests, setRequests] = useState<WorkingRequest[]>(initialRequests);
  const [schedules, setSchedules] = useState<Schedule[]>(() =>
    mockTimeWorkings.slice(0, 6).map((working) => ({
      id: working.uuid,
      dayOfWeek: working.dayOfWeek,
      startTime: working.startTime,
      endTime: working.endTime,
      source: "Lịch hiện tại",
    })),
  );
  const rows = schedules.map((working) => [
    dayNames[working.dayOfWeek],
    `${working.startTime} - ${working.endTime}`,
    working.source,
    <StatusPill key={working.id} tone="green">
      Đang áp dụng
    </StatusPill>,
  ]);

  function addSchedule(value: ScheduleFormValue, source: string) {
    setSchedules((current) => [
      ...current,
      { id: crypto.randomUUID(), ...value, source },
    ]);
  }

  function reviewRequest(code: string, status: "approved" | "rejected") {
    const selected = requests.find((item) => item.code === code);
    setRequests((current) =>
      current.map((item) => (item.code === code ? { ...item, status } : item)),
    );
    if (selected && status === "approved") {
      addSchedule(selected, `Duyệt từ ${selected.code}`);
    }
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          request ? (
            <PortalAction variant="default">
              <FilePenLine />
              Tạo yêu cầu thay đổi
            </PortalAction>
          ) : admin ? (
            <StatusPill tone="blue">HOSPITAL_ADMIN</StatusPill>
          ) : undefined
        }
      />
      <PortalSection
        title="Lịch hiện tại"
        description={`${assignmentCount} lượt gán khung giờ trong dữ liệu mẫu`}
      >
        <PortalTable
          caption={title}
          columns={["Ngày", "Khung giờ", "Nguồn", "Trạng thái"]}
          rows={rows}
        />
      </PortalSection>
      {request ? (
        <>
          <ScheduleForm
            title="Đơn đề nghị thay đổi giờ làm việc"
            submitLabel="Gửi đơn thay đổi"
            showReason
            onSubmit={({ dayOfWeek, startTime, endTime, reason }) =>
              setRequests((current) => [
                {
                  code: `WHR-${Date.now().toString().slice(-6)}`,
                  doctor: "BS. Nguyễn Hoàng Minh",
                  date: new Intl.DateTimeFormat("vi-VN").format(new Date()),
                  dayOfWeek,
                  startTime,
                  endTime,
                  reason,
                  status: "pending",
                },
                ...current,
              ])
            }
          />
          <PortalSection title="Yêu cầu gần đây">
            <PortalTable
              caption="Yêu cầu thay đổi giờ làm việc"
              columns={[
                "Mã đơn",
                "Ngày gửi",
                "Khung giờ",
                "Lý do",
                "Trạng thái",
              ]}
              rows={requests
                .filter((item) => item.doctor === "BS. Nguyễn Hoàng Minh")
                .map((item) => [
                  item.code,
                  item.date,
                  `${dayNames[item.dayOfWeek]}, ${item.startTime} - ${item.endTime}`,
                  item.reason,
                  requestStatus(item),
                ])}
            />
          </PortalSection>
        </>
      ) : null}
      {admin ? (
        <>
          <PortalSection
            title="Hàng chờ phê duyệt"
            description={`${requests.filter((item) => item.status === "pending").length} yêu cầu của bác sĩ đang chờ xử lý`}
          >
            <PortalTable
              caption="Hàng chờ phê duyệt giờ làm việc"
              columns={[
                "Mã đơn",
                "Bác sĩ",
                "Khung giờ đề nghị",
                "Lý do",
                "Trạng thái",
                "Thao tác",
              ]}
              rows={requests.map((item) => [
                item.code,
                <div key={`${item.code}-doctor`}>
                  <p>{item.doctor}</p>
                  <p className="mt-1 text-xs font-normal text-muted-foreground">
                    Gửi {item.date}
                  </p>
                </div>,
                `${dayNames[item.dayOfWeek]}, ${item.startTime} - ${item.endTime}`,
                item.reason,
                requestStatus(item),
                item.status === "pending" ? (
                  <div key={`${item.code}-actions`} className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => reviewRequest(item.code, "approved")}
                    >
                      <Check />
                      Duyệt
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => reviewRequest(item.code, "rejected")}
                    >
                      <X />
                      Từ chối
                    </Button>
                  </div>
                ) : (
                  <span
                    key={`${item.code}-reviewed`}
                    className="text-xs text-muted-foreground"
                  >
                    Đã xử lý
                  </span>
                ),
              ])}
            />
          </PortalSection>
          <ScheduleForm
            title="Thêm giờ làm việc trực tiếp cho bác sĩ"
            submitLabel="Thêm vào lịch bác sĩ"
            showDoctor
            onSubmit={(value) =>
              addSchedule(value, `Quản trị viên thêm cho ${value.doctor}`)
            }
          />
        </>
      ) : null}
      {!request && !admin ? (
        <ScheduleForm
          title="Cập nhật giờ làm việc"
          submitLabel="Gửi thay đổi"
          showReason
          onSubmit={(value) => addSchedule(value, "Thay đổi được gửi")}
        />
      ) : null}
    </div>
  );
}

function requestStatus(request: WorkingRequest) {
  if (request.status === "approved")
    return (
      <StatusPill key={request.code} tone="green">
        Đã duyệt
      </StatusPill>
    );
  if (request.status === "rejected")
    return (
      <StatusPill key={request.code} tone="red">
        Đã từ chối
      </StatusPill>
    );
  return (
    <StatusPill key={request.code} tone="amber">
      Chờ duyệt
    </StatusPill>
  );
}

type ScheduleFormValue = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  reason: string;
  doctor: string;
};

function ScheduleForm({
  title,
  submitLabel,
  showReason = false,
  showDoctor = false,
  initialValue,
  submitting = false,
  onCancel,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  showReason?: boolean;
  showDoctor?: boolean;
  initialValue?: Partial<ScheduleFormValue>;
  submitting?: boolean;
  onCancel?: () => void;
  onSubmit: (value: ScheduleFormValue) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      dayOfWeek: Number(data.get("dayOfWeek")),
      startTime: String(data.get("startTime")),
      endTime: String(data.get("endTime")),
      reason: String(data.get("reason") ?? ""),
      doctor: String(data.get("doctor") ?? "bác sĩ được chọn"),
    });
    event.currentTarget.reset();
  }

  return (
    <PortalSection
      title={title}
      action={<CalendarClock className="size-5 text-primary" />}
    >
      <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:grid-cols-3">
        {showDoctor ? (
          <div className="space-y-2 sm:col-span-3">
            <Label htmlFor={`${title}-doctor`}>Bác sĩ</Label>
            <select
              id={`${title}-doctor`}
              name="doctor"
              className="h-10 w-full rounded-md border px-3 text-sm"
            >
              <option>BS. Nguyễn Hoàng Minh</option>
              <option>BS. Phạm Ngọc Anh</option>
              <option>BS. Trần Thanh Vũ</option>
            </select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor={`${title}-day`}>Ngày trong tuần</Label>
          <select
            id={`${title}-day`}
            name="dayOfWeek"
            defaultValue={initialValue?.dayOfWeek ?? 1}
            className="h-10 w-full rounded-md border px-3 text-sm"
          >
            <option value="0">Chủ Nhật</option>
            <option value="1">Thứ Hai</option>
            <option value="2">Thứ Ba</option>
            <option value="3">Thứ Tư</option>
            <option value="4">Thứ Năm</option>
            <option value="5">Thứ Sáu</option>
            <option value="6">Thứ Bảy</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-start`}>Bắt đầu</Label>
          <Input
            id={`${title}-start`}
            name="startTime"
            type="time"
            defaultValue={initialValue?.startTime ?? "07:00"}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-end`}>Kết thúc</Label>
          <Input
            id={`${title}-end`}
            name="endTime"
            type="time"
            defaultValue={initialValue?.endTime ?? "11:30"}
            required
          />
        </div>
        {showReason ? (
          <div className="space-y-2 sm:col-span-3">
            <Label htmlFor={`${title}-reason`}>Lý do thay đổi</Label>
            <Textarea
              id={`${title}-reason`}
              name="reason"
              rows={3}
              placeholder="Mô tả lý do và thời gian muốn áp dụng"
              required
            />
          </div>
        ) : null}
        <div className="flex gap-2 sm:col-span-3">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={onCancel}
            >
              Hủy
            </Button>
          ) : null}
          <Button type="submit" disabled={submitting}>
            <Send />
            {submitting ? "Đang lưu..." : submitLabel}
          </Button>
        </div>
      </form>
    </PortalSection>
  );
}
