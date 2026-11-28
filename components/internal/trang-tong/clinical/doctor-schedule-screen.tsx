"use client";

import { CalendarDays, Eye, Search, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
    INTERNAL_PAGE_SIZE,
    PortalPageHeader,
    PortalPagination,
    PortalSection,
    PortalTable,
    StatusPill,
} from "@/components/internal/portal-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    getVietnamDateTimeParts,
    getVietnamToday,
} from "@/lib/booking/working-hours";
import { doctorAppointmentService } from "@/lib/services/appointment/doctorAppointmentService";
import { cn } from "@/lib/utils";
import type {
    ClinicalAppointment,
    ClinicalAppointmentStatus,
} from "@/types/internal-clinical";

type LoadState =
    | { status: "loading" }
    | { status: "success"; items: ClinicalAppointment[] }
    | { status: "error"; message: string };

type ScheduleFilters = {
    q: string;
    from: string;
    to: string;
    status: string;
};

const statusLabels: Record<string, string> = {
    Approved: "Đã xác nhận",
    Pending: "Chờ xác nhận",
    Unconfirmed: "Không xác nhận",
    CheckedIn: "Đang khám",
    InProgress: "Đang khám bệnh",
    Done: "Đã hoàn thành",
    Cancelled: "Đã hủy",
};

const statusTones: Record<string, "amber" | "blue" | "green" | "red"> = {
    Approved: "blue",
    Pending: "amber",
    Unconfirmed: "red",
    CheckedIn: "blue",
    InProgress: "blue",
    Done: "green",
    Cancelled: "red",
};

const genderLabels: Record<string, string> = {
    Male: "Nam",
    Female: "Nữ",
    Other: "Khác",
};

export function DoctorScheduleScreen() {
    const [filters, setFilters] = useState<ScheduleFilters>(() => {
        const today = getVietnamToday();
        return { q: "", from: today, to: today, status: "" };
    });
    const [appliedFilters, setAppliedFilters] = useState<ScheduleFilters>(() => {
        const today = getVietnamToday();
        return { q: "", from: today, to: today, status: "" };
    });
    const [page, setPage] = useState(1);
    const [state, setState] = useState<LoadState>({ status: "loading" });

    useEffect(() => {
        const controller = new AbortController();
        queueMicrotask(() => setState({ status: "loading" }));
        doctorAppointmentService
            .getAppointments(appliedFilters, controller.signal)
            .then((items) => setState({ status: "success", items }))
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setState({
                        status: "error",
                        message: error instanceof Error ? error.message : "Không thể tải lịch khám.",
                    });
                }
            });
        return () => controller.abort();
    }, [appliedFilters]);

    function handleFilter(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPage(1);
        setAppliedFilters({ ...filters, q: filters.q.trim() });
    }

    const items = state.status === "success" ? state.items : [];
    const totalPages = Math.max(1, Math.ceil(items.length / INTERNAL_PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginatedItems = items.slice(
        (safePage - 1) * INTERNAL_PAGE_SIZE,
        safePage * INTERNAL_PAGE_SIZE,
    );

    const rows = paginatedItems.map((item) => {
        const isReadOnly =
            item.status === "Done" ||
            item.status === "Pending" ||
            item.status === "Cancelled" ||
            item.status === "Unconfirmed";

        return [
            formatTime(item.appointmentAt),
            item.patientName,
            genderLabels[item.gender] ?? item.gender,
            <span
                key={`note-${item.uuid}`}
                title={item.note || undefined}
                className="block max-w-xs truncate"
            >
                {item.note || "—"}
            </span>,
            <AppointmentStatus key={`status-${item.uuid}`} status={item.status} />,
            isReadOnly ? (
                <Link
                    key={`action-${item.uuid}`}
                    href={`/noi-bo/trang-tong/ca-kham/${item.uuid}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
                >
                    <Eye className="size-4" aria-hidden="true" />
                    Xem chi tiết
                </Link>
            ) : (
                <Link
                    key={`action-${item.uuid}`}
                    href={`/noi-bo/trang-tong/ca-kham/${item.uuid}`}
                    className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
                >
                    <Stethoscope className="size-4" aria-hidden="true" />
                    Khám ngay
                </Link>
            ),
        ];
    });

    return (
        <div className="space-y-6">
            <PortalPageHeader
                eyebrow="Ca được phân công"
                title="Lịch khám của tôi"
                description="Hiển thị lịch đặt riêng và hàng chờ tại phòng, ca làm việc của bác sĩ hiện tại."
            />

            <PortalSection
                title={formatSelectedRange(appliedFilters.from, appliedFilters.to)}
                description={
                    state.status === "success"
                        ? `${state.items.length} ca khám được phân công`
                        : "Lịch khám được phân công"
                }
            >
                <form
                    onSubmit={handleFilter}
                    className="grid gap-3 border-b bg-[#fbfdfe] p-4 md:grid-cols-2 xl:grid-cols-[minmax(15rem,1fr)_11rem_11rem_12rem_auto] xl:items-end"
                >
                    <label className="relative min-w-0">
                        <span className="sr-only">Tìm bệnh nhân hoặc mã y tế</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={filters.q}
                            onChange={(event) =>
                                setFilters((current) => ({ ...current, q: event.target.value }))
                            }
                            placeholder="Tìm bệnh nhân hoặc mã y tế"
                            className="h-9 pl-9"
                        />
                    </label>

                    <label>
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                            <CalendarDays className="size-3.5" aria-hidden="true" />
                            Ngày bắt đầu
                        </span>
                        <Input
                            type="date"
                            value={filters.from}
                            max={filters.to || undefined}
                            required
                            onChange={(event) =>
                                setFilters((current) => ({ ...current, from: event.target.value }))
                            }
                            className="h-9 bg-white"
                        />
                    </label>

                    <label>
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                            <CalendarDays className="size-3.5" aria-hidden="true" />
                            Ngày kết thúc
                        </span>
                        <Input
                            type="date"
                            value={filters.to}
                            min={filters.from || undefined}
                            required
                            onChange={(event) =>
                                setFilters((current) => ({ ...current, to: event.target.value }))
                            }
                            className="h-9 bg-white"
                        />
                    </label>

                    <label>
                        <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            Trạng thái
                        </span>
                        <select
                            value={filters.status}
                            onChange={(event) =>
                                setFilters((current) => ({ ...current, status: event.target.value }))
                            }
                            className="h-9 w-full rounded-md border bg-white px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Button type="submit" className="h-9">
                        Lọc
                    </Button>
                </form>

                {state.status === "loading" ? (
                    <p className="p-8 text-center text-sm text-muted-foreground">
                        Đang tải lịch khám...
                    </p>
                ) : state.status === "error" ? (
                    <p className="p-8 text-center text-sm text-destructive">
                        {state.message}
                    </p>
                ) : rows.length ? (
                    <>
                        <PortalTable
                            caption="Lịch khám của bác sĩ"
                            columns={["Giờ", "Tên", "Giới tính", "Ghi chú", "Trạng thái", "Thao tác"]}
                            rows={rows}
                        />
                        <PortalPagination
                            page={safePage}
                            totalItems={items.length}
                            onPageChange={setPage}
                            alwaysVisible
                        />
                    </>
                ) : (
                    <p className="p-8 text-center text-sm text-muted-foreground">
                        Không có ca khám phù hợp trong ngày đã chọn.
                    </p>
                )}
            </PortalSection>
        </div>
    );
}

function AppointmentStatus({ status }: { status: ClinicalAppointmentStatus }) {
    const tone = statusTones[status] ?? "amber";
    const label = statusLabels[status] ?? status;
    return <StatusPill tone={tone}>{label}</StatusPill>;
}

function formatTime(value: Date) {
    return getVietnamDateTimeParts(value).time;
}

function formatSelectedRange(from: string, to: string) {
    if (from !== to) {
        return `Lịch khám từ ${formatDate(from)} đến ${formatDate(to)}`;
    }

    const value = new Date(`${from}T12:00:00+07:00`);
    if (Number.isNaN(value.getTime())) return "Lịch khám";
    const weekday = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        timeZone: "Asia/Ho_Chi_Minh",
    }).format(value);
    const [, month, day] = from.split("-");
    return `${weekday.charAt(0).toLocaleUpperCase("vi-VN")}${weekday.slice(
        1
    )}, ${day}/${month}/${from.slice(0, 4)}`;
}

function formatDate(value: string) {
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}/${month}/${year}` : value;
}
