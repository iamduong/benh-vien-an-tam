"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { buttonVariants } from "@/components/ui/button";
import { formatAppointmentDateTime } from "@/lib/format";
import { appointmentService } from "@/lib/services/appointment/AppointmentService";
import { cn } from "@/lib/utils";
import type { AppointmentConfirmation as Confirmation } from "@/types/appointments";

type ConfirmationState =
  | { status: "loading" }
  | { status: "success"; key: string; data: Confirmation }
  | { status: "error"; key: string; message: string };

export function BookingConfirmation() {
  const { session } = useAuth();
  const searchParams = useSearchParams();
  const appointmentUuid = searchParams.get("appointment") || "";
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ConfirmationState>({
    status: "loading",
  });
  const requestKey = session
    ? `${session.account.uuid}:${appointmentUuid}`
    : "";

  useEffect(() => {
    if (!session || !appointmentUuid) return;
    const controller = new AbortController();
    let cancelled = false;

    appointmentService
      .getConfirmation(
        appointmentUuid,
        session.account.uuid,
        controller.signal,
      )
      .then((response) => {
        if (!cancelled) {
          setState({ status: "success", key: requestKey, data: response.data });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "error",
            key: requestKey,
            message:
              "Không thể tải xác nhận lịch. Dữ liệu Mock API có thể đã được làm mới.",
          });
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [appointmentUuid, attempt, requestKey, session]);

  if (!session) return null;
  if (!appointmentUuid) {
    return (
      <div className="container-shell py-12">
        <EmptyState
          message="Thiếu mã lịch hẹn để hiển thị xác nhận."
          action={
            <Link href="/tai-khoan/lich-hen" className={buttonVariants({ variant: "outline" })}>
              Xem lịch hẹn của tôi
            </Link>
          }
        />
      </div>
    );
  }
  if (state.status === "loading" || state.key !== requestKey) {
    return (
      <div className="container-shell py-12">
        <LoadingState label="Đang tải xác nhận lịch hẹn" />
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="container-shell py-12">
        <ErrorState
          message={state.message}
          onRetry={() => {
            setState({ status: "loading" });
            setAttempt((current) => current + 1);
          }}
        />
      </div>
    );
  }

  const { appointment: appointment } = state.data;

  return (
    <div className="container-shell py-10 sm:py-16">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-card">
        <div className="border-b bg-muted/45 p-6 text-center sm:p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 aria-hidden="true" className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Yêu cầu đặt lịch đã được gửi
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Lịch đang chờ cơ sở duyệt. Hệ thống chưa giữ chỗ hoặc xác nhận thanh toán.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
            <Clock3 aria-hidden="true" />
            Trạng thái: Chờ duyệt
          </div>
          <dl className="grid gap-5 sm:grid-cols-2">
            <ConfirmationField label="Loại lịch" value={getTypeLabel(state.data.type)} />
            <ConfirmationField label="Đối tượng" value={state.data.targetName} />
            <ConfirmationField label="Cơ sở" value={state.data.hospitalName} />
            <ConfirmationField
              label="Thời gian"
              value={formatAppointmentDateTime(appointment.appointmentAt)}
            />
            <ConfirmationField label="Người khám" value={appointment.patientName} />
            <ConfirmationField label="Mã y tế" value={appointment.medicalCode} />
            <div className="sm:col-span-2">
              <ConfirmationField
                label="Ghi chú"
                value={appointment.note || "Không có"}
              />
            </div>
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/tai-khoan/lich-hen" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              Xem lịch hẹn của tôi
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-primary/30 pl-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold leading-6">{value}</dd>
    </div>
  );
}

function getTypeLabel(type: Confirmation["type"]) {
  if (type === "hospital") return "Khám tại cơ sở";
  if (type === "doctor") return "Khám với bác sĩ";
  return "Dịch vụ y tế";
}
