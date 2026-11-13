import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";

export type DoctorWorkSubmissionStatus = "Pending" | "Approved" | "Rejected";
export type DoctorWorkSubmissionType = "Change" | "Delete" | "Add";

export type WorkingHourOption = {
  uuid: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type DoctorSchedule = WorkingHourOption & {
  doctorScheduleUuid: string;
  roomUuid: string | null;
  roomName: string | null;
};

export type DoctorWorkSubmission = {
  uuid: string;
  doctorUuid: string;
  doctorName: string;
  doctorScheduleUuid: string | null;
  type: DoctorWorkSubmissionType;
  currentWorkingHour: WorkingHourOption | null;
  requestedWorkingHour: WorkingHourOption | null;
  reason: string;
  status: DoctorWorkSubmissionStatus;
  reviewNote: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DoctorWorkingOverview = {
  schedule: DoctorSchedule[];
  availableWorkingHours: WorkingHourOption[];
  submissions: DoctorWorkSubmission[];
};

class DoctorWorkSubmissionService {
  async getMine(signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<DoctorWorkingOverview>>(
      "/doctor-work-submissions/mine",
      { signal },
    );
    return response.data;
  }

  async create(payload: {
    doctorScheduleUuid: string | null;
    requestedWorkingHourUuid: string | null;
    requestedWorkingHourUuids?: string[];
    type: DoctorWorkSubmissionType;
    reason: string;
  }) {
    const response = await httpClient.post<ApiResponse<DoctorWorkSubmission | DoctorWorkSubmission[]>>(
      "/doctor-work-submissions",
      payload,
    );
    return response.data;
  }

  async getHospitalSubmissions(signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<DoctorWorkSubmission[]>>(
      "/doctor-work-submissions/hospital",
      { signal },
    );
    return response.data;
  }

  async review(
    uuid: string,
    status: Extract<DoctorWorkSubmissionStatus, "Approved" | "Rejected">,
    reviewNote: string,
    roomUuid?: string,
  ) {
    const response = await httpClient.put<ApiResponse<DoctorWorkSubmission>>(
      `/doctor-work-submissions/${encodeURIComponent(uuid)}/review`,
      { status, reviewNote, roomUuid: roomUuid || null },
    );
    return response.data;
  }
}

export const doctorWorkSubmissionService = new DoctorWorkSubmissionService();
