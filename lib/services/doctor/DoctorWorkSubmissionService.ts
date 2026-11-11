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

export type DoctorWorkingHour = WorkingHourOption & {
  doctorWorkingHourUuid: string;
};

export type DoctorWorkSubmission = {
  uuid: string;
  doctorUuid: string;
  doctorName: string;
  doctorWorkingHourUuid: string | null;
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
  schedule: DoctorWorkingHour[];
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
    doctorWorkingHourUuid: string | null;
    requestedWorkingHourUuid: string | null;
    type: DoctorWorkSubmissionType;
    reason: string;
  }) {
    const response = await httpClient.post<ApiResponse<DoctorWorkSubmission>>(
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
  ) {
    const response = await httpClient.put<ApiResponse<DoctorWorkSubmission>>(
      `/doctor-work-submissions/${encodeURIComponent(uuid)}/review`,
      { status, reviewNote },
    );
    return response.data;
  }
}

export const doctorWorkSubmissionService = new DoctorWorkSubmissionService();
