import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";

export type ReceptionAppointment = {
  uuid: string;
  code: string;
  patientName: string;
  medicalCode: string;
  phone: string;
  gender: string;
  appointmentDate: Date;
  type: "Doctor" | "Hospital" | "Service";
  status: "Pending" | "Approved" | "Unconfirmed" | "CheckedIn" | "InProgress" | "Done" | "Cancelled";
  doctorUuid: string | null;
  doctorName: string | null;
  roomUuid: string | null;
  roomName: string | null;
  note: string;
};

export type ReceptionRoomOption = {
  uuid: string;
  name: string;
  status: "Available" | "Occupied" | "Maintenance";
  waitingCount: number;
  slotLoadCount: number;
  isDoctorScheduled: boolean;
  scheduledDoctorNames: string[];
  isRecommended: boolean;
  canSelect: boolean;
  unavailableReason: string | null;
};

export type ReceptionRouting = {
  appointment: ReceptionAppointment;
  rooms: ReceptionRoomOption[];
  recommendedRoomUuid: string | null;
  recommendation: string;
};

type ApiAppointment = Omit<ReceptionAppointment, "appointmentDate"> & { appointmentDate: string };
type ApiRouting = Omit<ReceptionRouting, "appointment"> & { appointment: ApiAppointment };

class ReceptionService {
  async getQueue(signal?: AbortSignal): Promise<ReceptionAppointment[]> {
    const response = await httpClient.get<ApiResponse<ApiAppointment[]>>("/internal/reception/queue", { signal });
    return response.data.data.map(toAppointment);
  }

  async search(query: string, date: string, signal?: AbortSignal): Promise<ReceptionAppointment[]> {
    const response = await httpClient.get<ApiResponse<ApiAppointment[]>>("/internal/reception/appointments", {
      params: { query: query.trim() || undefined, date },
      signal,
    });
    return response.data.data.map(toAppointment);
  }

  async getRouting(uuid: string, signal?: AbortSignal): Promise<ReceptionRouting> {
    const response = await httpClient.get<ApiResponse<ApiRouting>>(
      `/internal/reception/appointments/${encodeURIComponent(uuid)}/routing`,
      { signal },
    );
    return { ...response.data.data, appointment: toAppointment(response.data.data.appointment) };
  }

  async checkIn(uuid: string, roomUuid: string): Promise<ReceptionAppointment> {
    const response = await httpClient.post<ApiResponse<ApiAppointment>>(
      `/internal/reception/appointments/${encodeURIComponent(uuid)}/check-in`,
      { roomUuid },
    );
    return toAppointment(response.data.data);
  }
}

function toAppointment(item: ApiAppointment): ReceptionAppointment {
  return { ...item, appointmentDate: new Date(item.appointmentDate) };
}

export const receptionService = new ReceptionService();
