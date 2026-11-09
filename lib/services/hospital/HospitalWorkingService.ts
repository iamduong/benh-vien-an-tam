import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { BaseStatus } from "@/types/models";

export type HospitalWorkingSlot = {
  uuid: string;
  workingUuid: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: BaseStatus;
};

export type HospitalWorkingData = {
  availableWorkings: HospitalWorkingSlot[];
  assignedWorkings: HospitalWorkingSlot[];
};

class HospitalWorkingService {
  async getBranchWorkings(signal?: AbortSignal) {
    const response = await httpClient.get<ApiResponse<HospitalWorkingData>>(
      "/hospital-workings",
      { signal },
    );
    return response.data;
  }

  async add(workingUuid: string) {
    const response = await httpClient.post<ApiResponse<HospitalWorkingSlot>>(
      "/hospital-workings",
      { workingUuid },
    );
    return response.data;
  }

  async update(uuid: string, workingUuid: string) {
    const response = await httpClient.put<ApiResponse<HospitalWorkingSlot>>(
      `/hospital-workings/${encodeURIComponent(uuid)}`,
      { workingUuid },
    );
    return response.data;
  }

  async delete(uuid: string) {
    await httpClient.delete(`/hospital-workings/${encodeURIComponent(uuid)}`);
  }
}

export const hospitalWorkingService = new HospitalWorkingService();
