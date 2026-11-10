import { httpClient } from "@/lib/http/client";
import type { ApiResponse, PaginatedData } from "@/lib/http/response";
import {
  AppointmentStatus,
  AppointmentType,
  type Guid,
} from "@/types/models";

export type BranchAppointment = {
  uuid: Guid;
  patientName: string;
  gender: string;
  medicalCode: string;
  note: string;
  appointmentDate: Date;
  timeSlot: Guid | null;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  patientUuid: Guid | null;
  hospitalUuid: Guid;
  isWalkIn: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BranchAppointmentQuery = {
  from?: string;
  to?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type CreateBranchAppointmentRequest = {
  patientName: string;
  gender: string;
  appointmentDate: string;
  type: AppointmentType;
  note: string;
};

type ApiAppointment = Omit<
  BranchAppointment,
  "appointmentDate" | "createdAt" | "updatedAt"
> & {
  appointmentDate: string;
  createdAt: string;
  updatedAt: string;
};

type AppointmentResponse = { message: string; data: ApiAppointment };
type AppointmentListResponse = {
  message: string;
  data: ApiAppointment[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export class BranchAppointmentService {
  private endpoint(hospitalUuid: Guid) {
    return `/hospitals/${encodeURIComponent(hospitalUuid)}/appointments`;
  }

  async getAll(
    hospitalUuid: Guid,
    query: BranchAppointmentQuery = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<BranchAppointment>>> {
    const response = await httpClient.get<AppointmentListResponse>(
      this.endpoint(hospitalUuid),
      { params: query, signal },
    );
    return {
      message: response.data.message,
      data: {
        Items: response.data.data.map(toAppointment),
        Page: response.data.pagination.page,
        PageSize: response.data.pagination.pageSize,
        TotalItems: response.data.pagination.totalCount,
        TotalPages: response.data.pagination.totalPages,
      },
    };
  }

  async create(
    hospitalUuid: Guid,
    request: CreateBranchAppointmentRequest,
  ): Promise<ApiResponse<BranchAppointment>> {
    const response = await httpClient.post<AppointmentResponse>(
      this.endpoint(hospitalUuid),
      request,
    );
    return {
      message: response.data.message,
      data: toAppointment(response.data.data),
    };
  }

  async updateStatus(
    hospitalUuid: Guid,
    uuid: Guid,
    status:
      | AppointmentStatus.Approved
      | AppointmentStatus.Unconfirmed
      | AppointmentStatus.Cancelled,
  ): Promise<ApiResponse<BranchAppointment>> {
    const response = await httpClient.put<AppointmentResponse>(
      `${this.endpoint(hospitalUuid)}/${encodeURIComponent(uuid)}/status`,
      { status },
    );
    return {
      message: response.data.message,
      data: toAppointment(response.data.data),
    };
  }
}

function toAppointment(item: ApiAppointment): BranchAppointment {
  const appointmentDate = new Date(item.appointmentDate);
  return {
    ...item,
    appointmentDate,
    time: item.time || new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(appointmentDate),
    hospitalUuid: item.hospitalUuid ?? "",
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };
}

export const branchAppointmentService = new BranchAppointmentService();
