import { httpClient } from "@/lib/http/client";
import type { ApiResponse, PaginatedData } from "@/lib/http/response";
import { BaseStatus, type Guid } from "@/types/models";

export type StaffRoleCode = "doctor" | "Staff" | "WarehouseManager";

export type HospitalStaffMember = {
  accountUuid: Guid;
  doctorUuid: Guid | null;
  DisplayName: string;
  phone: string;
  RoleCode: StaffRoleCode;
  RoleName: string;
  departmentUuid: Guid | null;
  DepartmentName: string | null;
  specialty: string | null;
  status: BaseStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type HospitalStaffQuery = {
  search?: string;
  role?: StaffRoleCode;
  status?: BaseStatus;
  page?: number;
  pageSize?: number;
};

export type CreateHospitalStaffRequest = {
  phone: string;
  password: string;
  RoleCode: StaffRoleCode;
  name?: string;
  specialty?: string;
  price?: number;
  departmentUuid?: Guid;
};

export type HospitalStaffStatusResult = {
  accountUuid: Guid;
  status: BaseStatus;
  updatedAt: Date;
};

type StaffApiDto = {
  accountUuid: Guid;
  doctorUuid: Guid | null;
  displayName: string;
  phone: string;
  roleCode: StaffRoleCode;
  roleName: string;
  departmentUuid: Guid | null;
  departmentName: string | null;
  specialty: string | null;
  status: BaseStatus;
  createdAt: string;
  updatedAt: string;
};

type StaffListApiResponse = {
  message: string;
  data: StaffApiDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type StaffApiResponse = {
  message: string;
  data: StaffApiDto;
};

type StaffStatusApiResponse = {
  message: string;
  data: {
    accountUuid: Guid;
    status: BaseStatus;
    updatedAt: string;
  };
};

export class StaffService {
  async getAll(
    hospitalUuid: Guid,
    query: HospitalStaffQuery = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<HospitalStaffMember>>> {
    const response = await httpClient.get<StaffListApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/staff`,
      { params: query, signal },
    );
    return {
      message: response.data.message,
      data: {
        Items: response.data.data.map(toStaffMember),
        Page: response.data.pagination.page,
        PageSize: response.data.pagination.pageSize,
        TotalItems: response.data.pagination.totalCount,
        TotalPages: response.data.pagination.totalPages,
      },
    };
  }

  async create(
    hospitalUuid: Guid,
    request: CreateHospitalStaffRequest,
  ): Promise<ApiResponse<HospitalStaffMember>> {
    const response = await httpClient.post<StaffApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/staff`,
      {
        phone: request.phone,
        password: request.password,
        roleCode: request.RoleCode,
        name: request.name,
        specialty: request.specialty,
        price: request.price,
        departmentUuid: request.departmentUuid,
      },
    );
    return {
      message: response.data.message,
      data: toStaffMember(response.data.data),
    };
  }

  async updateStatus(
    hospitalUuid: Guid,
    accountUuid: Guid,
    status: BaseStatus,
  ): Promise<ApiResponse<HospitalStaffStatusResult>> {
    const response = await httpClient.put<StaffStatusApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/staff/${encodeURIComponent(accountUuid)}/status`,
      { status },
    );
    return {
      message: response.data.message,
      data: {
        accountUuid: response.data.data.accountUuid,
        status: response.data.data.status,
        updatedAt: new Date(response.data.data.updatedAt),
      },
    };
  }
}

function toStaffMember(staff: StaffApiDto): HospitalStaffMember {
  return {
    accountUuid: staff.accountUuid,
    doctorUuid: staff.doctorUuid,
    DisplayName: staff.displayName,
    phone: staff.phone,
    RoleCode: staff.roleCode,
    RoleName: staff.roleName,
    departmentUuid: staff.departmentUuid,
    DepartmentName: staff.departmentName,
    specialty: staff.specialty,
    status: staff.status,
    createdAt: new Date(staff.createdAt),
    updatedAt: new Date(staff.updatedAt),
  };
}

export const staffService = new StaffService();