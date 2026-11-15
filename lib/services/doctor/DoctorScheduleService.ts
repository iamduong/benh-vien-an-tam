import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";

export type DoctorScheduleEntry = {
  doctorScheduleUuid: string;
  doctorUuid: string;
  doctorName: string;
  uuid: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomUuid: string | null;
  roomName: string | null;
};

class DoctorScheduleService {
  async getAll(doctorUuid?: string, signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<DoctorScheduleEntry[]>>("/internal/doctor-schedules", {
      params: { doctorUuid: doctorUuid || undefined }, signal,
    });
    return response.data;
  }

  async getMine(signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<DoctorScheduleEntry[]>>("/doctors/me/schedule", { signal });
    return response.data;
  }

  async replace(payload: {
    doctorUuid: string;
    selections: Array<{ workingHourUuid: string; roomUuid: string }>;
  }) {
    const response = await httpClient.post<ApiResponse<DoctorScheduleEntry[]>>("/internal/doctor-schedules", payload);
    return response.data;
  }
}

export const doctorScheduleService = new DoctorScheduleService();
