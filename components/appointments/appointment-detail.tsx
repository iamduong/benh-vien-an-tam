"use client";

import { ArrowLeft, CalendarClock, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  AppointmentStatusBadge,
  canChangeAppointment,
  getAppointmentTargetLabel,
  getAppointmentTypeLabel,
  getPublicTargetHref,
} from "@/components/appointments/appointment-ui";
import { AppointmentReviewSection } from "@/components/appointments/appointment-review-section";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVietnamToday, toAppointmentIso } from "@/lib/booking/working-hours";
import { displayText, formatAppointmentDateTime } from "@/lib/format";
import type { AsyncState } from "@/lib/http/response";
import {
  AppointmentServiceError,
  appointmentService,
} from "@/lib/services/appointment/AppointmentService";
import { cn } from "@/lib/utils";
import type { AppointmentPresentation, Availability } from "@/types/appointments";

type AvailabilityState =
  | { status: "idle" }
  | { status: "success"; key: string; data: Availability }
  | { status: "error"; key: string; message: string };

export function AppointmentDetail({ uuid }: { uuid: string }) {
  const { session } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AsyncState<AppointmentPresentation>>({ status: "loading" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    let active = true;
    appointmentService
      .getDetail(uuid, session.account.uuid, controller.signal)
      .then((response) => {
        if (active) setState({ status: "success", data: response.data });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          status: "error",
          message:
            error instanceof AppointmentServiceError && error.status === 404
              ? "Không tìm thấy lịch hẹn hoặc bạn không có quyền xem lịch này."
              : "Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.",
        });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, session, uuid]);

  if (!session) return null;

  return (
    <div className="min-w-0">
      <Link href="/tai-khoan/lich-hen" className={cn(buttonVariants({ variant: "ghost" }), "-ml-2")}>
        <ArrowLeft aria-hidden="true" />
        Quay lại lịch hẹn
      </Link>
      {state.status === "loading" || state.status === "idle" ? (
        <div className="mt-6"><LoadingState label="Đang tải chi tiết lịch hẹn" /></div>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-6"><ErrorState message={state.message} onRetry={() => setAttempt((value) => value + 1)} /></div>
      ) : null}
      {state.status === "success" ? (
        <DetailContent
          item={state.data}
          accountUuid={session.account.uuid}
          feedback={feedback}
          onFeedback={setFeedback}
          onUpdate={(item) => setState({ status: "success", data: item })}
        />
      ) : null}
    </div>
  );
}

function DetailContent({
  item,
  accountUuid,
  feedback,
  onFeedback,
  onUpdate,
}: {
  item: AppointmentPresentation;
  accountUuid: string;
  feedback: string;
  onFeedback: (value: string) => void;
  onUpdate: (item: AppointmentPresentation) => void;
}) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const appointment = item.appointment;
  const canChange = canChangeAppointment(item, currentTime);
  const targetUuid = getTargetUuid(item);

  useEffect(() => {
    const deadline = appointment.appointmentAt.getTime() - 86_400_000;
    const delay = deadline - Date.now();
    if (delay <= 0) return;
    const timer = window.setTimeout(
      () => setCurrentTime(Date.now()),
      Math.min(delay + 100, 2_147_483_647),
    );
    return () => window.clearTimeout(timer);
  }, [appointment.appointmentAt, currentTime]);

  return (
    <>
      <div className="mt-6 rounded-2xl border bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">{getAppointmentTypeLabel(item.type)}</p>
            <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">{item.targetName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Mã lịch: {appointment.uuid}</p>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
        <div className="mt-6 rounded-xl border-l-4 border-l-primary bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thời gian khám</p>
          <p className="mt-1 text-lg font-bold">{formatAppointmentDateTime(appointment.appointmentAt)}</p>
        </div>
        {feedback ? <p role="status" className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{feedback}</p> : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href={getPublicTargetHref(item)} className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
            Xem {getAppointmentTargetLabel(item.type).toLocaleLowerCase("vi-VN")}
          </Link>
          {item.type !== "hospital" ? (
            <Link href={`/co-so-y-te/${item.hospitalSlug}`} className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>Xem cơ sở</Link>
          ) : null}
          {canChange ? (
            <AppointmentActions
              item={item}
              targetUuid={targetUuid}
              accountUuid={accountUuid}
              onFeedback={onFeedback}
              onUpdate={onUpdate}
            />
          ) : null}
        </div>
        {!canChange && appointment.status !== "Done" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Lịch đã kết thúc, đã hủy hoặc còn dưới 24 giờ nên chỉ có thể xem.
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DetailSection title="Thông tin khám">
          <DetailField label="Người khám" value={appointment.patientName} />
          <DetailField label="Giới tính" value={getGenderLabel(appointment.gender)} />
          <DetailField label="Mã y tế" value={appointment.medicalCode} />
          <DetailField label="Ghi chú" value={displayText(appointment.note)} />
        </DetailSection>
        <DetailSection title="Địa điểm và trạng thái">
          <DetailField label="Cơ sở y tế" value={item.hospitalName} />
          <DetailField label="Phòng" value={item.roomName || "Chưa phân phòng"} />
          <DetailField label="Ngày tạo" value={formatAppointmentDateTime(appointment.createdAt)} />
          <DetailField label="Cập nhật lần cuối" value={formatAppointmentDateTime(appointment.updatedAt)} />
        </DetailSection>
      </div>

      {appointment.status === "Done" ? (
        <AppointmentReviewSection appointmentUuid={appointment.uuid} />
      ) : null}

      <details className="mt-6 rounded-xl border bg-card p-5 text-sm">
        <summary className="cursor-pointer font-semibold">Thông tin định danh</summary>
        <dl className="mt-4 grid gap-3 break-all text-muted-foreground sm:grid-cols-2">
          <DetailField label="accountUuid" value={appointment.accountUuid} />
          <DetailField label="hospitalUuid" value={appointment.hospitalUuid} />
          <DetailField label="roomUuid" value={appointment.roomUuid} />
          {typeof (appointment as { doctorUuid?: unknown }).doctorUuid === "string" ? <DetailField label="doctorUuid" value={(appointment as { doctorUuid: string }).doctorUuid} /> : null}
          {typeof (appointment as { medicalServiceUuid?: unknown }).medicalServiceUuid === "string" ? <DetailField label="medicalServiceUuid" value={(appointment as { medicalServiceUuid: string }).medicalServiceUuid} /> : null}
        </dl>
      </details>
    </>
  );
}

function AppointmentActions({
  item,
  targetUuid,
  accountUuid,
  onFeedback,
  onUpdate,
}: {
  item: AppointmentPresentation;
  targetUuid: string;
  accountUuid: string;
  onFeedback: (value: string) => void;
  onUpdate: (item: AppointmentPresentation) => void;
}) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" });
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actionLock = useRef(false);

  useEffect(() => {
    if (!rescheduleOpen || !date) return;
    const controller = new AbortController();
    let active = true;
    const key = date;
    const minimumTimestamp = Date.now() + 86_400_000;
    appointmentService
      .getAvailability(
        {
          type: item.type,
          targetUuid,
          hospitalUuid: item.appointment.hospitalUuid,
          accountUuid,
          date,
        },
        controller.signal,
      )
      .then((response) => {
        if (active) {
          setAvailability({
            status: "success",
            key,
            data: {
              ...response.data,
              slots: response.data.slots.map((slot) => ({
                ...slot,
                isAvailable:
                  slot.isAvailable &&
                  new Date(slot.appointmentAt).getTime() >= minimumTimestamp,
              })),
            },
          });
        }
      })
      .catch((error) => {
        if (active) setAvailability({ status: "error", key, message: getActionError(error) });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [accountUuid, date, item.appointment.hospitalUuid, item.type, rescheduleOpen, targetUuid]);

  async function reschedule() {
    if (!date || !time || actionLock.current) return;
    actionLock.current = true;
    setIsSubmitting(true);
    setActionError("");
    try {
      const response = await appointmentService.reschedule(item.appointment.uuid, {
        accountUuid: accountUuid,
        appointmentAt: toAppointmentIso(date, time),
      });
      onUpdate(response.data);
      onFeedback("Đã đổi thời gian lịch hẹn thành công.");
      setRescheduleOpen(false);
    } catch (error) {
      setActionError(getActionError(error));
    } finally {
      actionLock.current = false;
      setIsSubmitting(false);
    }
  }

  async function cancel() {
    if (actionLock.current) return;
    actionLock.current = true;
    setIsSubmitting(true);
    setActionError("");
    try {
      const response = await appointmentService.cancel(item.appointment.uuid, accountUuid);
      onUpdate(response.data);
      onFeedback("Đã hủy lịch hẹn thành công.");
      setCancelOpen(false);
    } catch (error) {
      setActionError(getActionError(error));
    } finally {
      actionLock.current = false;
      setIsSubmitting(false);
    }
  }

  const availableSlots = availability.status === "success" && availability.key === date
    ? availability.data.slots.filter(
        (slot) => slot.isAvailable,
      )
    : [];

  return (
    <>
      <Button type="button" className="w-full sm:w-auto" onClick={() => { setActionError(""); setRescheduleOpen(true); }}>
        <CalendarClock aria-hidden="true" />Đổi lịch
      </Button>
      <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={() => { setActionError(""); setCancelOpen(true); }}>Hủy lịch</Button>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn thời gian khám mới</DialogTitle>
            <DialogDescription>Mỗi lịch chỉ được đổi một lần và thao tác phải thực hiện trước giờ khám ít nhất 24 giờ.</DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">Ngày khám mới</Label>
              <Input id="reschedule-date" type="date" min={getVietnamToday()} max={addDays(getVietnamToday(), 14)} value={date} onChange={(event) => { setDate(event.target.value); setTime(""); setActionError(""); }} />
            </div>
            {date && (availability.status === "idle" || availability.key !== date) ? <LoadingState label="Đang tải thời gian khả dụng" /> : null}
            {availability.status === "error" && availability.key === date ? <ErrorState message={availability.message} /> : null}
            {availability.status === "success" && availability.key === date ? (
              availableSlots.length ? (
                <div>
                  <p className="text-sm font-medium">Chọn giờ</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {availableSlots.map((slot) => (
                      <Button key={slot.appointmentAt} type="button" variant={time === slot.time ? "default" : "outline"} onClick={() => setTime(slot.time)}>{slot.time}</Button>
                    ))}
                  </div>
                </div>
              ) : <EmptyState message="Ngày này chưa có thời gian phù hợp cách hiện tại ít nhất 24 giờ." />
            ) : null}
            {actionError ? <p role="alert" className="text-sm text-destructive">{actionError}</p> : null}
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>Đóng</DialogClose>
            <Button type="button" disabled={!time || isSubmitting} onClick={reschedule}>
              {isSubmitting ? <><LoaderCircle aria-hidden="true" className="animate-spin" />Đang đổi lịch...</> : "Xác nhận đổi lịch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy lịch</DialogTitle>
            <DialogDescription>Lịch sau khi hủy sẽ chuyển sang trạng thái kết thúc và không thể khôi phục.</DialogDescription>
          </DialogHeader>
          <p className="mt-5 rounded-lg bg-muted p-4 text-sm font-medium">{formatAppointmentDateTime(item.appointment.appointmentAt)} · {item.targetName}</p>
          {actionError ? <p role="alert" className="mt-4 text-sm text-destructive">{actionError}</p> : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>Giữ lịch</DialogClose>
            <Button type="button" variant="destructive" disabled={isSubmitting} onClick={cancel}>
              {isSubmitting ? <><LoaderCircle aria-hidden="true" className="animate-spin" />Đang hủy...</> : "Xác nhận hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-bold">{title}</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl></section>;
}

function DetailField({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-semibold leading-6">{value}</dd></div>;
}

function getTargetUuid(item: AppointmentPresentation) {
  const appointment = item.appointment;
  if (typeof (appointment as { doctorUuid?: unknown }).doctorUuid === "string") {
    return (appointment as { doctorUuid: string }).doctorUuid;
  }
  if (typeof (appointment as { medicalServiceUuid?: unknown }).medicalServiceUuid === "string") {
    return (appointment as { medicalServiceUuid: string }).medicalServiceUuid;
  }
  return appointment.hospitalUuid;
}

function getGenderLabel(value: string) {
  if (value === "Male") return "Nam";
  if (value === "Female") return "Nữ";
  return "Khác";
}

function getActionError(error: unknown) {
  return error instanceof AppointmentServiceError
    ? error.message
    : "Không thể thực hiện thao tác. Vui lòng thử lại.";
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00+07:00`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
