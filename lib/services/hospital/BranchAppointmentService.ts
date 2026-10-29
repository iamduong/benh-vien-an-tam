import { httpClient } from "@/lib/http/client";
import type { ApiResponse, PaginatedData } from "@/lib/http/response";
import {
  AppointmentMedicalServiceStatus,
  AppointmentStatus,
  AppointmentType,
  type Guid,
  type RoomStatus,
} from "@/types/models";

export type BranchAppointmentServiceItem = {
  uuid: Guid;
  medicalServiceUuid: Guid | null;
  name: string;
  price: number;
  description: string;
  status: AppointmentMedicalServiceStatus;
};

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
  doctorUuid: Guid | null;
  DoctorName: string | null;
  medicalServiceUuid: Guid | null;
  MedicalServiceName: string | null;
  roomUuid: Guid | null;
  roomName: string | null;
  doctorNote: string;
  totalPrice: number;
  isPaid: boolean;
  isWalkIn: boolean;
  createdAt: Date;
  updatedAt: Date;
  Services: BranchAppointmentServiceItem[];
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

export type BranchAppointmentResources = {
  Rooms: Array<{ uuid: Guid; name: string; status: RoomStatus }>;
  doctors: Array<{ uuid: Guid; name: string }>;
  Services: Array<{ uuid: Guid; name: string; price: number }>;
  TimeWorkings: Array<{
    uuid: Guid;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
};

type ApiServiceItem = {
  uuid: Guid;
  medicalServiceUuid: Guid | null;
  name: string;
  price: number;
  description: string;
  status: AppointmentMedicalServiceStatus;
};
type ApiAppointment = {
  uuid: Guid;
  patientName: string;
  gender: string;
  medicalCode: string;
  note: string;
  appointmentDate: string;
  timeSlot: Guid | null;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  patientUuid: Guid | null;
  hospitalUuid: Guid | null;
  doctorUuid: Guid | null;
  doctorName: string | null;
  medicalServiceUuid: Guid | null;
  medicalServiceName: string | null;
  roomUuid: Guid | null;
  roomName: string | null;
  doctorNote: string;
  totalPrice: number;
  isPaid: boolean;
  isWalkIn: boolean;
  createdAt: string;
  updatedAt: string;
  services: ApiServiceItem[];
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
type ResourcesApiResponse = {
  message: string;
  data: {
    rooms: Array<{ uuid: Guid; name: string; status: RoomStatus }>;
    doctors: Array<{ uuid: Guid; name: string }>;
    services: Array<{ uuid: Guid; name: string; price: number }>;
    timeWorkings: Array<{
      uuid: Guid;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }>;
  };
};

export class BranchAppointmentService {
  private endpoint(hospitalUuid: Guid) {
    return `/hospitals/${encodeURIComponent(hospitalUuid)}/appointments`;
  }

  async getResources(
    hospitalUuid: Guid,
    signal?: AbortSignal,
  ): Promise<ApiResponse<BranchAppointmentResources>> {
    const response = await httpClient.get<ResourcesApiResponse>(
      `${this.endpoint(hospitalUuid)}/resources`,
      { signal },
    );
    return {
      message: response.data.message,
      data: {
        Rooms: response.data.data.rooms.map((room) => ({
          uuid: room.uuid,
          name: room.name,
          status: room.status,
        })),
        doctors: response.data.data.doctors.map((doctor) => ({
          uuid: doctor.uuid,
          name: doctor.name,
        })),
        Services: response.data.data.services.map((service) => ({
          uuid: service.uuid,
          name: service.name,
          price: service.price,
        })),
        TimeWorkings: response.data.data.timeWorkings.map((working) => ({
          uuid: working.uuid,
          dayOfWeek: working.dayOfWeek,
          startTime: working.startTime,
          endTime: working.endTime,
        })),
      },
    };
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

  async updateStatus(
    hospitalUuid: Guid,
    uuid: Guid,
    status:
      | AppointmentStatus.Approved
      | AppointmentStatus.Unconfirmed
      | AppointmentStatus.CheckedIn
      | AppointmentStatus.Cancelled,
  ) {
    return this.update(hospitalUuid, uuid, "status", { status });
  }

  async assign(
    hospitalUuid: Guid,
    uuid: Guid,
    assignment: { doctorUuid: Guid | null; roomUuid: Guid | null },
  ) {
    return this.update(hospitalUuid, uuid, "assignment", assignment);
  }

  async updatePayment(hospitalUuid: Guid, uuid: Guid, isPaid: boolean) {
    return this.update(hospitalUuid, uuid, "payment", { isPaid });
  }

  async updateNote(hospitalUuid: Guid, uuid: Guid, doctorNote: string) {
    return this.update(hospitalUuid, uuid, "note", { doctorNote });
  }

  async addService(
    hospitalUuid: Guid,
    uuid: Guid,
    medicalServiceUuid: Guid,
    description: string,
  ) {
    const response = await httpClient.post<AppointmentResponse>(
      `${this.endpoint(hospitalUuid)}/${encodeURIComponent(uuid)}/services`,
      { medicalServiceUuid, description },
    );
    return { message: response.data.message, data: toAppointment(response.data.data) };
  }

  async completeService(hospitalUuid: Guid, uuid: Guid, serviceUuid: Guid) {
    return this.update(
      hospitalUuid,
      uuid,
      `services/${encodeURIComponent(serviceUuid)}/complete`,
      {},
      "put",
    );
  }

  async complete(hospitalUuid: Guid, uuid: Guid, doctorNote: string) {
    return this.update(hospitalUuid, uuid, "complete", { doctorNote });
  }

  private async update(
    hospitalUuid: Guid,
    uuid: Guid,
    action: string,
    body: object,
    method: "put" | "post" = "put",
  ) {
    const url = `${this.endpoint(hospitalUuid)}/${encodeURIComponent(uuid)}/${action}`;
    const response =
      method === "post"
        ? await httpClient.post<AppointmentResponse>(url, body)
        : await httpClient.put<AppointmentResponse>(url, body);
    return { message: response.data.message, data: toAppointment(response.data.data) };
  }
}

function toAppointment(item: ApiAppointment): BranchAppointment {
  return {
    uuid: item.uuid,
    patientName: item.patientName,
    gender: item.gender,
    medicalCode: item.medicalCode,
    note: item.note,
    appointmentDate: new Date(item.appointmentDate),
    timeSlot: item.timeSlot,
    time: item.time,
    type: item.type,
    status: item.status,
    patientUuid: item.patientUuid,
    hospitalUuid: item.hospitalUuid ?? "",
    doctorUuid: item.doctorUuid,
    DoctorName: item.doctorName,
    medicalServiceUuid: item.medicalServiceUuid,
    MedicalServiceName: item.medicalServiceName,
    roomUuid: item.roomUuid,
    roomName: item.roomName,
    doctorNote: item.doctorNote,
    totalPrice: item.totalPrice,
    isPaid: item.isPaid,
    isWalkIn: item.isWalkIn,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    Services: item.services.map((service) => ({
      uuid: service.uuid,
      medicalServiceUuid: service.medicalServiceUuid,
      name: service.name,
      price: service.price,
      description: service.description,
      status: service.status,
    })),
  };
}

export const branchAppointmentService = new BranchAppointmentService();
