"use client";

import { ArrowLeft, Building2, CalendarDays, CircleDollarSign, ExternalLink, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  formatPrescriptionTotal,
  PrescriptionStatusBadge,
} from "@/components/prescriptions/prescription-ui";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { buttonVariants } from "@/components/ui/button";
import { displayText, formatAppointmentDateTime, formatPrice } from "@/lib/format";
import type { AsyncState } from "@/lib/http/response";
import {
  PrescriptionServiceError,
  prescriptionService,
} from "@/lib/services/prescription/PrescriptionService";
import { cn } from "@/lib/utils";
import { MedicineUnit } from "@/types/models";
import type { PrescriptionView } from "@/types/prescriptions";

export function PrescriptionDetail({ uuid }: { uuid: string }) {
  const { session } = useAuth();
  const accountUuid = session?.account.uuid;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AsyncState<PrescriptionView>>({
    status: "loading",
  });

  useEffect(() => {
    if (!accountUuid) return;
    const controller = new AbortController();
    let active = true;
    prescriptionService
      .getByUuid(uuid, controller.signal)
      .then((response) => {
        if (active) setState({ status: "success", data: response.data });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          status: "error",
          message:
            error instanceof PrescriptionServiceError && error.status === 404
              ? "Không tìm thấy đơn thuốc hoặc bạn không có quyền xem đơn này."
              : "Không thể tải chi tiết đơn thuốc. Vui lòng thử lại.",
        });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [accountUuid, attempt, uuid]);

  if (!session) return null;

  return (
    <div className="min-w-0">
      <Link
        href="/tai-khoan/don-thuoc"
        className={cn(buttonVariants({ variant: "ghost" }), "-ml-2")}
      >
        <ArrowLeft aria-hidden="true" />Quay lại đơn thuốc
      </Link>
      {state.status === "loading" || state.status === "idle" ? (
        <div className="mt-6"><LoadingState label="Đang tải chi tiết đơn thuốc" /></div>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-6">
          <ErrorState
            message={state.message}
            onRetry={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
          />
        </div>
      ) : null}
      {state.status === "success" ? <DetailContent view={state.data} /> : null}
    </div>
  );
}

function DetailContent({ view }: { view: PrescriptionView }) {
  const prescription = view.prescription;
  return (
    <>
      <section className="mt-6 rounded-2xl border bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">Chi tiết đơn thuốc</p>
            <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">
              Đơn ngày {formatAppointmentDateTime(prescription.createdAt)}
            </h1>
            <p className="mt-2 break-all text-sm text-muted-foreground">
              Mã đơn: {prescription.uuid}
            </p>
          </div>
          <PrescriptionStatusBadge status={prescription.status} />
        </div>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <SummaryFact icon={Stethoscope} label="Bác sĩ" value={view.doctor.name} />
          <SummaryFact icon={Building2} label="Cơ sở" value={view.hospital.name} />
          <SummaryFact icon={CalendarDays} label="Ngày tạo" value={formatAppointmentDateTime(prescription.createdAt)} />
          <SummaryFact icon={CircleDollarSign} label="Tổng đơn thuốc" value={formatPrescriptionTotal(view.totalAmount)} />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href={`/bac-si/${view.doctor.slug}`} className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>Xem bác sĩ</Link>
          <Link href={`/co-so-y-te/${view.hospital.slug}`} className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>Xem cơ sở</Link>
          {view.appointment ? (
            <Link href={`/tai-khoan/lich-hen/${view.appointment.uuid}`} className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>Xem lịch hẹn liên kết</Link>
          ) : null}
        </div>
      </section>

      <section className="mt-6 rounded-xl border bg-card p-5 sm:p-7">
        <h2 className="text-xl font-bold">Hướng dẫn dùng thuốc</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Dùng thuốc đúng liều và ghi chú của bác sĩ. Không tự ý thay đổi liệu trình.
        </p>
        {view.details.length ? (
          <div className="mt-5 space-y-4">
            {view.details.map(({ detail, medicine }, index) => {
              const unit = getMedicineUnitLabel(medicine.unit);
              return (
                <article key={detail.uuid} className="rounded-xl border p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary">Thuốc {index + 1}</p>
                      <h3 className="mt-1 break-words text-lg font-bold">{medicine.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{displayText(medicine.description)}</p>
                    </div>
                    {detail.isExternal ? (
                      <span className="inline-flex w-fit items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        <ExternalLink aria-hidden="true" className="size-3" />Thuốc ngoài
                      </span>
                    ) : null}
                  </div>
                  <dl className="mt-4 grid gap-3 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <MedicineFact label="Số lượng" value={`${detail.quantity} ${unit}`} />
                    <MedicineFact label="Mỗi lần" value={`${detail.quantityPerDose} ${unit}`} />
                    <MedicineFact label="Tần suất" value={`${detail.dosesPerDay} lần/ngày`} />
                    <MedicineFact label="Thời gian" value={`${detail.duration} ngày`} />
                  </dl>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <MedicineFact label="Ghi chú sử dụng" value={displayText(detail.note)} />
                    <MedicineFact label="Đơn giá / thành tiền" value={`${formatPrice(detail.price)} / ${formatPrice(detail.quantity * detail.price)}`} />
                  </div>
                  {detail.isExternal ? (
                    <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
                      Thuốc này được đánh dấu mua bên ngoài và vẫn được tính vào tổng dự kiến theo đơn giá trên đơn.
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-5"><EmptyState message="Đơn thuốc này chưa có chi tiết thuốc để hiển thị." /></div>
        )}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-bold">Ghi chú của đơn</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{displayText(prescription.note)}</p>
        </div>
        <div className="rounded-xl border bg-muted/40 p-5">
          <p className="text-sm font-medium text-muted-foreground">Tổng đơn thuốc</p>
          <p className="mt-2 text-2xl font-bold text-primary">{formatPrescriptionTotal(view.totalAmount)}</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {view.totalAmount === null
              ? "Chưa có chi tiết thuốc nên chưa thể xác định tổng đơn."
              : "Tổng được tính từ số lượng × đơn giá của từng chi tiết."}{" "}
            Đây không phải biên lai hoặc lịch sử giao dịch.
          </p>
        </div>
      </section>

      <details className="mt-6 rounded-xl border bg-card p-5 text-sm">
        <summary className="cursor-pointer font-semibold">Thông tin định danh</summary>
        <dl className="mt-4 grid gap-3 break-all text-muted-foreground sm:grid-cols-2">
          <MedicineFact label="patientProfileUuid" value={prescription.patientProfileUuid} />
          <MedicineFact label="doctorProfileUuid" value={prescription.doctorProfileUuid} />
          <MedicineFact label="hospitalUuid" value={prescription.hospitalUuid} />
          <MedicineFact label="Cập nhật lần cuối" value={formatAppointmentDateTime(prescription.updatedAt)} />
        </dl>
      </details>
    </>
  );
}

function SummaryFact({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg bg-muted/50 p-3">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words font-semibold">{value}</p></div>
    </div>
  );
}

function MedicineFact({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-semibold leading-6">{value}</dd></div>;
}

function getMedicineUnitLabel(unit: MedicineUnit) {
  if (unit === MedicineUnit.Tablet) return "viên";
  if (unit === MedicineUnit.Bottle) return "chai";
  if (unit === MedicineUnit.Box) return "hộp";
  if (unit === MedicineUnit.Tube) return "tuýp";
  if (unit === MedicineUnit.Sachet) return "gói";
  return "đơn vị";
}
