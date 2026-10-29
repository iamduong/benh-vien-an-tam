"use client";

import { Building2, CalendarDays, CircleDollarSign, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { DiscoveryPagination } from "@/components/discovery/discovery-pagination";
import {
  formatPrescriptionTotal,
  PrescriptionStatusBadge,
} from "@/components/prescriptions/prescription-ui";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAppointmentDateTime } from "@/lib/format";
import { prescriptionService } from "@/lib/services/prescription/PrescriptionService";
import { cn } from "@/lib/utils";
import { PrescriptionStatus } from "@/types/models";
import type { PrescriptionList } from "@/types/prescriptions";

type ListState =
  | { status: "idle" }
  | { status: "success"; key: string; data: PrescriptionList }
  | { status: "error"; key: string; message: string };

export function PrescriptionsPage() {
  const { session } = useAuth();
  const accountUuid = session?.account.uuid;
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();
  const status = parseStatus(searchParams.get("status"));
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const page = parsePage(searchParams.get("page"));
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${status || ""}:${from}:${to}:${page}:${attempt}`;
  const [state, setState] = useState<ListState>({ status: "idle" });

  useEffect(() => {
    if (!accountUuid) return;
    const controller = new AbortController();
    let active = true;
    const key = requestKey;
    prescriptionService
      .getAll(
        {
          status,
          from: from || undefined,
          to: to || undefined,
          page,
          pageSize: 4,
        },
        controller.signal,
      )
      .then((response) => {
        if (active) setState({ status: "success", key, data: response.data });
      })
      .catch(() => {
        if (active) {
          setState({
            status: "error",
            key,
            message: "Không thể tải danh sách đơn thuốc. Vui lòng thử lại.",
          });
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [accountUuid, from, page, requestKey, status, to]);

  if (!session) return null;

  return (
    <div className="min-w-0">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Khu vực Patient</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Đơn thuốc của tôi
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Xem hướng dẫn dùng thuốc, tổng chi phí đơn và trạng thái hiện tại.
        </p>
      </div>

      <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Mục “Đã thanh toán” chỉ phản ánh trạng thái của đơn thuốc. Hệ thống chưa có dữ liệu phương thức, mã giao dịch, biên lai hoặc hoàn tiền.
      </div>

      <form
        key={currentParams}
        action="/tai-khoan/don-thuoc"
        method="get"
        className="mt-6 rounded-xl border bg-card p-4 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <FilterSelect
            label="Trạng thái đơn"
            name="status"
            defaultValue={status || ""}
          >
            <option value="">Tất cả trạng thái</option>
            <option value={PrescriptionStatus.Unpaid}>Chưa thanh toán</option>
            <option value={PrescriptionStatus.Paid}>Đã thanh toán</option>
            <option value={PrescriptionStatus.Cancelled}>Đã hủy</option>
          </FilterSelect>
          <div className="space-y-2">
            <Label htmlFor="prescription-from">Từ ngày</Label>
            <Input
              id="prescription-from"
              name="from"
              type="date"
              defaultValue={from}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prescription-to">Đến ngày</Label>
            <Input
              id="prescription-to"
              name="to"
              type="date"
              defaultValue={to}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/tai-khoan/don-thuoc"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full sm:w-auto",
            )}
          >
            Xóa bộ lọc
          </Link>
          <button
            type="submit"
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            Áp dụng
          </button>
        </div>
      </form>

      <section aria-live="polite" className="mt-7">
        {state.status === "idle" || state.key !== requestKey ? (
          <LoadingState label="Đang tải đơn thuốc" />
        ) : null}
        {state.status === "error" && state.key === requestKey ? (
          <ErrorState
            message={state.message}
            onRetry={() => setAttempt((value) => value + 1)}
          />
        ) : null}
        {state.status === "success" && state.key === requestKey ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Danh sách đơn thuốc</h2>
              <p className="text-sm text-muted-foreground">
                {state.data.TotalItems} đơn
              </p>
            </div>
            {state.data.Items.length ? (
              <div className="space-y-4">
                {state.data.Items.map((item) => (
                  <article
                    key={item.prescription.uuid}
                    className="rounded-xl border bg-card p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Đơn ngày {formatAppointmentDateTime(item.prescription.createdAt)}
                          </p>
                          <PrescriptionStatusBadge status={item.prescription.status} />
                        </div>
                        <h3 className="mt-3 break-words text-lg font-bold">
                          {item.doctor.name}
                        </h3>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          <CardFact icon={Building2} value={item.hospital.name} />
                          <CardFact icon={Stethoscope} value={`${item.numberOfItems} loại thuốc`} />
                          <CardFact icon={CalendarDays} value={`Tạo lúc ${formatAppointmentDateTime(item.prescription.createdAt)}`} />
                          <CardFact icon={CircleDollarSign} value={`Tổng đơn: ${formatPrescriptionTotal(item.totalAmount)}`} />
                        </div>
                      </div>
                      <Link
                        href={`/tai-khoan/don-thuoc/${item.prescription.uuid}`}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full sm:w-auto",
                        )}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                message="Không có đơn thuốc phù hợp với bộ lọc hiện tại."
                action={
                  <Link
                    href="/tai-khoan/don-thuoc"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Xóa bộ lọc
                  </Link>
                }
              />
            )}
            <DiscoveryPagination
              pathname="/tai-khoan/don-thuoc"
              currentParams={currentParams}
              page={state.data.Page}
              totalPages={state.data.TotalPages}
            />
          </>
        ) : null}
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  children,
  ...props
}: React.ComponentProps<"select"> & { label: string }) {
  const id = `filter-${props.name}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function CardFact({
  icon: Icon,
  value,
}: {
  icon: typeof CalendarDays;
  value: string;
}) {
  return (
    <p className="flex min-w-0 items-start gap-2">
      <Icon
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-primary"
      />
      <span className="break-words">{value}</span>
    </p>
  );
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseStatus(value: string | null) {
  return Object.values(PrescriptionStatus).includes(value as PrescriptionStatus)
    ? (value as PrescriptionStatus)
    : undefined;
}
