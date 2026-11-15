"use client";

import { isAxiosError } from "axios";
import { Search, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PortalPageHeader, PortalSection, StatusPill } from "@/components/internal/portal-ui";
import { WeeklySchedule } from "@/components/internal/trang-tong/working-hours-screens";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doctorScheduleService, type DoctorScheduleEntry } from "@/lib/services/doctor/DoctorScheduleService";
import { doctorService } from "@/lib/services/doctor/DoctorService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { hospitalWorkingService, type HospitalWorkingSlot } from "@/lib/services/hospital/HospitalWorkingService";
import { roomService } from "@/lib/services/hospital/RoomService";
import type { DoctorProfile, Room } from "@/types/models";

const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
type LoadState = { status: "loading" } | { status: "error"; message: string } | {
  status: "success";
  doctors: DoctorProfile[];
  rooms: Room[];
  workings: HospitalWorkingSlot[];
  schedules: DoctorScheduleEntry[];
};

export function DoctorShiftAssignmentScreen() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorUuid, setDoctorUuid] = useState("");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    hospitalService.getBranchProfile(controller.signal).then(async ({ data: hospital }) => {
      const [doctorResponse, roomResponse, workingResponse, scheduleResponse] = await Promise.all([
        doctorService.getAll({ hospital: hospital.uuid, page: 1, pageSize: 100 }, controller.signal),
        roomService.getAll(hospital.uuid, { page: 1, pageSize: 100 }, controller.signal),
        hospitalWorkingService.getBranchWorkings(controller.signal),
        doctorScheduleService.getAll(undefined, controller.signal),
      ]);
      if (!active) return;
      const doctors = doctorResponse.data.Items;
      const selectedDoctorUuid = doctors[0]?.uuid ?? "";
      const schedules = scheduleResponse.data;
      setState({
        status: "success",
        doctors,
        rooms: roomResponse.data.Items,
        workings: workingResponse.data.assignedWorkings,
        schedules,
      });
      setDoctorUuid(selectedDoctorUuid);
      setSelections(scheduleSelections(schedules, selectedDoctorUuid));
    }).catch((error: unknown) => {
      if (active && !controller.signal.aborted) {
        setState({ status: "error", message: getError(error, "Không thể tải dữ liệu phân ca.") });
      }
    });
    return () => { active = false; controller.abort(); };
  }, [attempt]);

  const data = state.status === "success" ? state : null;
  const filteredDoctors = useMemo(() => {
    const keyword = doctorSearch.trim().toLocaleLowerCase("vi-VN");
    return (data?.doctors ?? []).filter((doctor) =>
      !keyword || `${doctor.name} ${doctor.specialty} ${doctor.departmentDisplay} ${doctor.workplace}`
        .toLocaleLowerCase("vi-VN").includes(keyword),
    );
  }, [data?.doctors, doctorSearch]);
  const selectedDoctor = data?.doctors.find((doctor) => doctor.uuid === doctorUuid);
  const selectedWorkings = (data?.workings ?? []).filter((item) => selections[item.workingUuid]);

  function selectDoctor(uuid: string) {
    setDoctorUuid(uuid);
    setSelections(scheduleSelections(data?.schedules ?? [], uuid));
    setMessage("");
  }

  function toggleWorking(working: HospitalWorkingSlot) {
    setSelections((current) => {
      if (current[working.workingUuid]) {
        const next = { ...current };
        delete next[working.workingUuid];
        return next;
      }
      return { ...current, [working.workingUuid]: data?.rooms[0]?.uuid ?? "" };
    });
  }

  async function saveSchedule() {
    if (!doctorUuid || !selectedWorkings.length || selectedWorkings.some((working) => !selections[working.workingUuid])) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await doctorScheduleService.replace({
        doctorUuid,
        selections: selectedWorkings.map((working) => ({
          workingHourUuid: working.workingUuid,
          roomUuid: selections[working.workingUuid],
        })),
      });
      setMessage(response.message);
      setState((current) => current.status === "success" ? {
        ...current,
        schedules: [...current.schedules.filter((schedule) => schedule.doctorUuid !== doctorUuid), ...response.data],
      } : current);
    } catch (error) {
      setMessage(getError(error, "Không thể lưu thời khóa biểu."));
    } finally {
      setSaving(false);
    }
  }

  if (state.status === "loading") return <LoadingState label="Đang tải dữ liệu phân ca bác sĩ" />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={() => setAttempt((value) => value + 1)} />;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Điều phối nhân sự"
        title="Phân ca làm việc bác sĩ"
        description="Chọn bác sĩ để xem thời khóa biểu hiện tại, sau đó chọn lại ca và phòng để cập nhật trực tiếp."
        actions={selectedDoctor ? <StatusPill tone="blue">Đang xếp lịch: {selectedDoctor.name}</StatusPill> : undefined}
      />

      {message ? (
        <p role="status" className={`border px-4 py-3 text-sm font-medium ${message.includes("công bố") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}

      <PortalSection title="Chọn bác sĩ" description={`${filteredDoctors.length} bác sĩ phù hợp`}>
        <div className="border-b bg-slate-50 p-4">
          <label className="relative block max-w-md">
            <span className="sr-only">Lọc bác sĩ</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={doctorSearch} onChange={(event) => setDoctorSearch(event.target.value)} placeholder="Tìm tên, chuyên khoa hoặc nơi làm việc..." className="bg-white pl-9" />
          </label>
        </div>
        {filteredDoctors.length ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => {
              const selected = doctor.uuid === doctorUuid;
              const assignedCount = state.schedules.filter((schedule) => schedule.doctorUuid === doctor.uuid).length;
              return (
                <button key={doctor.uuid} type="button" onClick={() => selectDoctor(doctor.uuid)} className={`flex gap-4 border p-4 text-left transition-colors ${selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-white hover:border-primary/40 hover:bg-slate-50"}`}>
                  <span
                    className="flex size-16 shrink-0 items-center justify-center rounded-full bg-slate-100 bg-cover bg-center text-lg font-bold text-primary"
                    style={doctor.avatar ? { backgroundImage: `url("${doctor.avatar}")` } : undefined}
                    aria-label={`Ảnh ${doctor.name}`}
                  >
                    {!doctor.avatar ? initials(doctor.name) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-[#173b57]">{doctor.name}</span>
                    <span className="mt-1 block truncate text-sm font-medium text-primary">{doctor.specialty || doctor.departmentDisplay || "Chưa cập nhật chuyên khoa"}</span>
                    <span className="mt-2 block truncate text-xs text-muted-foreground">{doctor.workplace || "Bác sĩ tại chi nhánh"}</span>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{assignedCount ? `${assignedCount} ca đang áp dụng` : "Chưa xếp lịch"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : <EmptyState message="Không tìm thấy bác sĩ phù hợp." />}
      </PortalSection>

      {selectedDoctor ? (
        <>
          <div className="space-y-6">
            <PortalSection title="Chọn ca và phòng làm việc" description="Các ca lấy từ giờ nhận lịch đang áp dụng của bệnh viện.">
              {state.workings.length ? (
                <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
                  {state.workings.map((working) => {
                    const selected = Boolean(selections[working.workingUuid]);
                    return (
                      <article key={working.uuid} className={`border p-4 ${selected ? "border-primary bg-primary/5" : "bg-white"}`}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleWorking(working)}
                          className="flex w-full cursor-pointer items-start gap-3 text-left"
                        >
                          <span aria-hidden="true" className={`mt-1 flex size-4 shrink-0 items-center justify-center rounded-[3px] border ${selected ? "border-primary bg-primary text-white" : "border-slate-400 bg-white"}`}>
                            {selected ? <span className="text-xs leading-none">✓</span> : null}
                          </span>
                          <span className="flex-1"><strong className="block text-[#173b57]">{dayNames[working.dayOfWeek]}</strong><span className="text-sm text-muted-foreground">{working.startTime.slice(0, 5)}–{working.endTime.slice(0, 5)}</span></span>
                        </button>
                        {selected ? (
                          <div className="mt-3 space-y-1.5 border-t pt-3">
                            <Label htmlFor={`room-${working.uuid}`}>Phòng làm việc</Label>
                            <select id={`room-${working.uuid}`} value={selections[working.workingUuid]} onChange={(event) => setSelections((current) => ({ ...current, [working.workingUuid]: event.target.value }))} className="h-9 w-full rounded-md border bg-white px-3 text-sm">
                              {state.rooms.map((room) => <option key={room.uuid} value={room.uuid}>{room.name}</option>)}
                            </select>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : <EmptyState message="Bệnh viện chưa cấu hình khung giờ nhận lịch." />}
            </PortalSection>

            <PortalSection title={`Thời khóa biểu · ${selectedDoctor.name}`} description={`${selectedWorkings.length} ca đang được chọn`}>
              {selectedWorkings.length ? (
                <WeeklySchedule
                  schedule={selectedWorkings.map((working) => ({
                    uuid: working.workingUuid,
                    dayOfWeek: working.dayOfWeek,
                    startTime: working.startTime,
                    endTime: working.endTime,
                    doctorScheduleUuid: `assignment-preview-${working.workingUuid}`,
                    roomName: state.rooms.find((room) => room.uuid === selections[working.workingUuid])?.name ?? "Chưa chọn phòng",
                  }))}
                />
              ) : <EmptyState message="Bác sĩ chưa có ca làm việc. Chọn ca để vẽ thời khóa biểu." />}
              <div className="flex justify-end border-t bg-slate-50 p-4">
                <Button type="button" disabled={saving || !selectedWorkings.length || state.rooms.length === 0} onClick={() => void saveSchedule()}>
                  <Send />{saving ? "Đang lưu..." : "Lưu thời khóa biểu"}
                </Button>
              </div>
            </PortalSection>
          </div>
        </>
      ) : <EmptyState message="Chọn một bác sĩ để xem và cập nhật thời khóa biểu." />}
    </div>
  );
}

function scheduleSelections(schedules: DoctorScheduleEntry[], doctorUuid: string) {
  return Object.fromEntries(schedules.filter((item) => item.doctorUuid === doctorUuid && item.roomUuid).map((item) => [item.uuid, item.roomUuid!]));
}

function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join("").toLocaleUpperCase("vi-VN"); }
function getError(error: unknown, fallback: string) { return isAxiosError(error) && typeof error.response?.data?.message === "string" ? error.response.data.message : error instanceof Error ? error.message : fallback; }
