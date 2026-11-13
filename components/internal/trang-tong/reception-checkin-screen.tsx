"use client";

import { isAxiosError } from "axios";
import { BedDouble, Clock3, Search, Stethoscope, UserCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { PortalPageHeader, PortalSection, StatusPill } from "@/components/internal/portal-ui";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getVietnamToday } from "@/lib/booking/working-hours";
import {
  receptionService,
  type ReceptionAppointment,
  type ReceptionRouting,
} from "@/lib/services/reception/ReceptionService";
import { cn } from "@/lib/utils";

type ListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: ReceptionAppointment[] };

export function ReceptionCheckinScreen() {
  const [date, setDate] = useState(getVietnamToday);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ListState>({ status: "loading" });
  const [queue, setQueue] = useState<ReceptionAppointment[]>([]);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [routing, setRouting] = useState<ReceptionRouting | null>(null);
  const [selectedRoomUuid, setSelectedRoomUuid] = useState("");
  const [routingLoading, setRoutingLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    queueMicrotask(() => setState({ status: "loading" }));
    receptionService.search(submittedQuery, date, controller.signal)
      .then((items) => {
        if (!active) return;
        setState({ status: "success", items });
      })
      .catch((error: unknown) => {
        if (active && !controller.signal.aborted) {
          setState({ status: "error", message: getError(error, "Không thể tải danh sách tiếp nhận.") });
        }
      });
    return () => { active = false; controller.abort(); };
  }, [attempt, date, submittedQuery]);

  useEffect(() => {
    const controller = new AbortController();
    receptionService.getQueue(controller.signal)
      .then(setQueue)
      .catch(() => {
        if (!controller.signal.aborted) setQueue([]);
      });
    return () => controller.abort();
  }, [attempt]);

  const items = useMemo(() => state.status === "success" ? state.items : [], [state]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSelectedUuid(null);
    setRouting(null);
    setSubmittedQuery(query.trim());
  }

  async function selectAppointment(item: ReceptionAppointment) {
    setSelectedUuid(item.uuid);
    setRouting(null);
    setMessage("");
    setRoutingLoading(true);
    try {
      const next = await receptionService.getRouting(item.uuid);
      setRouting(next);
      setSelectedRoomUuid(next.recommendedRoomUuid ?? item.roomUuid ?? "");
    } catch (error) {
      setMessage(getError(error, "Không thể tải tình trạng phòng."));
    } finally {
      setRoutingLoading(false);
    }
  }

  async function checkIn() {
    if (!routing || !selectedRoomUuid) return;
    setSaving(true);
    setMessage("");
    try {
      await receptionService.checkIn(routing.appointment.uuid, selectedRoomUuid);
      setMessage("Check-in thành công. Người bệnh đã được đưa vào hàng chờ của phòng.");
      setRouting(null);
      setSelectedUuid(null);
      setAttempt((value) => value + 1);
    } catch (error) {
      setMessage(getError(error, "Không thể check-in người bệnh."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Tiếp nhận tại quầy"
        title="Check-in và điều phối phòng khám"
        description="Tra cứu đúng người bệnh, xem tải từng phòng theo ca và chuyển người bệnh tới phòng phù hợp."
      />

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-6">
          <PortalSection title="Tra cứu người bệnh" description="Tìm theo mã lịch, UUID lịch, mã y tế, họ tên hoặc số điện thoại.">
            <form className="space-y-4 p-5" onSubmit={submitSearch}>
              <div className="space-y-2">
                <Label htmlFor="reception-date">Ngày khám</Label>
                <Input id="reception-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reception-search">Thông tin tra cứu</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="reception-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="VD: APT-12AB34CD, BN001, 090..." className="pl-9" />
                </div>
              </div>
              <Button type="submit" className="w-full"><Search />Tra cứu</Button>
            </form>
          </PortalSection>

          <PortalSection title="Kết quả tra cứu" description={`${items.length} lịch trong ngày đã chọn`}>
            {state.status === "loading" ? <div className="p-5"><LoadingState label="Đang tra cứu lịch hẹn" /></div>
              : state.status === "error" ? <div className="p-5"><ErrorState message={state.message} onRetry={() => setAttempt((value) => value + 1)} /></div>
              : items.length ? (
                <div className="divide-y">
                  {items.map((item) => (
                    <button key={item.uuid} type="button" onClick={() => void selectAppointment(item)} className={cn("w-full p-4 text-left transition-colors hover:bg-slate-50", selectedUuid === item.uuid && "bg-cyan-50")}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0"><p className="font-semibold text-[#173b57]">{item.patientName}</p><p className="mt-1 text-xs text-muted-foreground">{item.code} · {item.medicalCode || "Chưa có mã y tế"}</p></div>
                        <AppointmentStatus status={item.status} />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{formatDateTime(item.appointmentDate)} · {appointmentTarget(item)}</p>
                    </button>
                  ))}
                </div>
              ) : <EmptyState message="Không tìm thấy lịch phù hợp trong ngày đã chọn." />}
          </PortalSection>
        </div>

        <PortalSection
          title="Xác nhận và chọn phòng"
          description={routing?.recommendation ?? "Chọn một lịch ở danh sách bên trái để xem tải phòng theo ca."}
          action={routing ? <AppointmentStatus status={routing.appointment.status} /> : undefined}
        >
          {routingLoading ? <div className="p-5"><LoadingState label="Đang tính phương án phân phòng" /></div>
            : routing ? (
              <div>
                <div className="grid gap-4 border-b p-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Fact label="Người bệnh" value={routing.appointment.patientName} />
                  <Fact label="Mã y tế" value={routing.appointment.medicalCode || "Chưa có"} />
                  <Fact label="Số điện thoại" value={routing.appointment.phone || "Chưa có"} />
                  <Fact label="Giờ khám" value={formatDateTime(routing.appointment.appointmentDate)} />
                  <Fact label="Nội dung" value={appointmentTarget(routing.appointment)} />
                  <Fact label="Ghi chú" value={routing.appointment.note || "Không có"} />
                </div>

                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-semibold text-[#173b57]">Tình trạng phòng trong ca</h3><p className="mt-1 text-xs text-muted-foreground">Đang chờ: đã check-in; tải ca: lịch đã xác nhận và đang xử lý.</p></div><BedDouble className="size-5 text-primary" /></div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {routing.rooms.map((room) => (
                      <label key={room.uuid} className={cn("relative border p-4 transition-colors", room.canSelect ? "cursor-pointer hover:border-primary/50" : "cursor-not-allowed bg-slate-50 opacity-65", selectedRoomUuid === room.uuid && room.canSelect && "border-primary bg-cyan-50/60 ring-1 ring-primary")}>
                        <input type="radio" name="room" value={room.uuid} checked={selectedRoomUuid === room.uuid} disabled={!room.canSelect || routing.appointment.status !== "Approved"} onChange={() => setSelectedRoomUuid(room.uuid)} className="sr-only" />
                        <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#173b57]">{room.name}</p>{room.scheduledDoctorNames.length ? <p className="mt-1 text-xs text-primary"><Stethoscope className="mr-1 inline size-3" />{room.scheduledDoctorNames.join(", ")}</p> : <p className="mt-1 text-xs text-muted-foreground">Chưa xếp bác sĩ trong ca</p>}</div>{room.isRecommended ? <StatusPill tone="green">Đề xuất</StatusPill> : null}</div>
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm"><span className="flex items-center gap-1.5"><UsersRound className="size-4 text-amber-600" />{room.waitingCount} đang chờ</span><span className="flex items-center gap-1.5"><Clock3 className="size-4 text-blue-600" />{room.slotLoadCount} trong ca</span></div>
                        {room.unavailableReason ? <p className="mt-3 text-xs font-medium text-red-700">{room.unavailableReason}</p> : null}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p role="status" className={cn("text-sm font-medium", message.includes("thành công") ? "text-emerald-700" : "text-red-700")}>{message}</p>
                  <Button type="button" disabled={saving || !selectedRoomUuid || routing.appointment.status !== "Approved"} onClick={() => void checkIn()}><UserCheck />{saving ? "Đang check-in..." : "Xác nhận check-in"}</Button>
                </div>
              </div>
            ) : <EmptyState message="Chưa chọn lịch hẹn để phân phòng." />}
        </PortalSection>
      </div>

      {message && !routing ? <p role="status" className={cn("border px-4 py-3 text-sm font-medium", message.includes("thành công") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700")}>{message}</p> : null}

      <PortalSection title="Hàng chờ check-in" description={`${queue.length} lịch đã xác nhận đang chờ quầy tiếp nhận`}>
        {queue.length ? <div className="overflow-x-auto"><table className="w-full min-w-[46rem] text-left text-sm"><thead><tr className="border-b bg-slate-50 text-xs uppercase text-muted-foreground">{["Mã lịch", "Bệnh nhân", "Giờ hẹn", "Nội dung", "Trạng thái"].map((label) => <th key={label} className="px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y">{queue.map((item) => <tr key={item.uuid} className="cursor-pointer transition-colors hover:bg-slate-50" onClick={() => void selectAppointment(item)}><td className="px-5 py-4 font-medium text-primary">{item.code}</td><td className="px-5 py-4">{item.patientName}<span className="block text-xs text-muted-foreground">{item.medicalCode}</span></td><td className="px-5 py-4">{formatDateTime(item.appointmentDate)}</td><td className="px-5 py-4">{appointmentTarget(item)}</td><td className="px-5 py-4"><AppointmentStatus status={item.status} /></td></tr>)}</tbody></table></div> : <EmptyState message="Không có lịch đã xác nhận nào đang chờ check-in." />}
      </PortalSection>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1.5 text-sm font-medium">{value}</p></div>; }

function AppointmentStatus({ status }: { status: ReceptionAppointment["status"] }) {
  const config = {
    Pending: ["Chờ xác nhận", "amber"], Approved: ["Đã xác nhận", "green"], Unconfirmed: ["Không xác nhận", "red"],
    CheckedIn: ["Đã check-in", "blue"], InProgress: ["Đang khám bệnh", "purple"], Done: ["Hoàn thành", "green"], Cancelled: ["Đã hủy", "red"],
  } as const;
  const [label, tone] = config[status];
  return <StatusPill tone={tone}>{label}</StatusPill>;
}

function appointmentTarget(item: ReceptionAppointment) {
  if (item.type === "Doctor") return item.doctorName ? `Khám ${item.doctorName}` : "Khám bác sĩ";
  return item.type === "Service" ? "Khám dịch vụ" : "Khám tại bệnh viện";
}

function formatDateTime(value: Date) { return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(value); }
function getError(error: unknown, fallback: string) { return isAxiosError(error) && typeof error.response?.data?.message === "string" ? error.response.data.message : error instanceof Error ? error.message : fallback; }
