import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockDepartments } from "@/data/mocks/departments";
import { mockDoctorDepartments } from "@/data/mocks/doctor-departments";
import { mockDoctors } from "@/data/mocks/doctors";
import { mockHospitalDepartments } from "@/data/mocks/hospital-departments";
import { mockHospitals } from "@/data/mocks/hospitals";
import { mockRoles } from "@/data/mocks/roles";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
} from "@/lib/mocks/query-utils";
import {
  BaseStatus,
  ROLE_UUIDS,
  type Account,
  type DoctorProfile,
} from "@/types/models";
import type { StaffRoleCode } from "@/lib/services/hospital/StaffService";

type CreatePayload = {
  phone?: unknown;
  password?: unknown;
  roleCode?: unknown;
  name?: unknown;
  specialty?: unknown;
  price?: unknown;
  departmentUuid?: unknown;
};

export function registerStaffRoutes(mock: AxiosMockAdapter) {
  mock.onGet(/^\/hospitals\/[^/]+\/staff$/).reply((config) => {
    const hospitalUuid = getHospitalUuid(config.url);
    if (!hospitalExists(hospitalUuid)) return notFound();

    const role = getStringParam(config.params, "role");
    const status = getStringParam(config.params, "status");
    const search = getStringParam(config.params, "search");
    if (role && !isStaffRole(role)) {
      return [400, { message: "Staff role is invalid", error: "INVALID_STAFF_ROLE" }];
    }
    if (status && !Object.values(BaseStatus).includes(status as BaseStatus)) {
      return [400, { message: "Account status is invalid" }];
    }

    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = Math.min(
      getPositiveIntegerParam(config.params, "pageSize", 100),
      100,
    );
    const items = mockAccounts
      .filter(
        (account) =>
          account.hospitalUuid === hospitalUuid &&
          account.deletedAt.getTime() === 0 &&
          isStaffAccount(account) &&
          (!role || roleCodeFor(account) === role) &&
          (!status || account.status === status) &&
          matchesKeyword(search, ...getStaffSearchValues(account)),
      )
      .map((account) => toStaffDto(account, hospitalUuid))
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return [
      200,
      {
        message: "Fetched successfully",
        data: items.slice((page - 1) * pageSize, page * pageSize),
        pagination: { page, pageSize, totalCount, totalPages },
      },
    ];
  });

  mock.onPost(/^\/hospitals\/[^/]+\/staff$/).reply((config) => {
    const hospitalUuid = getHospitalUuid(config.url);
    if (!hospitalExists(hospitalUuid)) return notFound();

    const payload = parsePayload(config.data);
    if (!isValidPayload(payload)) {
      return [400, { message: "Staff account details are invalid", error: "INVALID_STAFF_REQUEST" }];
    }
    if (mockAccounts.some((account) => account.phone === payload.phone.trim())) {
      return [409, { message: "Phone number is already in use", error: "PHONE_ALREADY_EXISTS" }];
    }

    let departmentUuid: string | null = null;
    if (payload.roleCode === "doctor") {
      if (
        typeof payload.departmentUuid !== "string" ||
        !payload.name ||
        !payload.specialty ||
        typeof payload.price !== "number" ||
        !Number.isInteger(payload.price) ||
        payload.price < 0
      ) {
        return [400, { message: "Doctor name, specialty, department, and a valid consultation price are required", error: "DOCTOR_PROFILE_REQUIRED" }];
      }
      const assignment = mockHospitalDepartments.find(
        (item) =>
          item.hospitalUuid === hospitalUuid &&
          item.departmentUuid === payload.departmentUuid,
      );
      const department = mockDepartments.find(
        (item) =>
          item.uuid === payload.departmentUuid &&
          item.status === BaseStatus.Active &&
          item.deletedAt.getTime() === 0,
      );
      if (!assignment || !department) {
        return [400, { message: "Department is not assigned to this hospital", error: "DEPARTMENT_NOT_ASSIGNED" }];
      }
      departmentUuid = department.uuid;
    }

    const accountUuid = crypto.randomUUID();
    const now = new Date();
    const account: Account = {
      uuid: accountUuid,
      phone: payload.phone.trim(),
      password: payload.password,
      roleUuid: roleUuidFor(payload.roleCode),
      status: BaseStatus.Active,
      hospitalUuid: hospitalUuid,
      createdAt: now,
      updatedAt: now,
      deletedAt: new Date(0),
    };
    mockAccounts.push(account);

    if (payload.roleCode === "doctor" && departmentUuid) {
      const hospital = mockHospitals.find((item) => item.uuid === hospitalUuid)!;
      const doctorUuid = crypto.randomUUID();
      const name = payload.name!.trim();
      const department = mockDepartments.find((item) => item.uuid === departmentUuid)!;
      const doctor: DoctorProfile = {
        uuid: doctorUuid,
        avatar: "/images/doctor-placeholder.svg",
        slug: `${toSlug(name)}-${doctorUuid.slice(0, 8)}`,
        name: name,
        price: payload.price as number,
        departmentDisplay: department.name,
        introduction: "Hồ sơ bác sĩ mới.",
        expertise: payload.specialty!.trim(),
        specialty: payload.specialty!.trim(),
        workplace: hospital.name,
        isFeatured: false,
        accountUuid: accountUuid,
        hospitalUuid: hospitalUuid,
      };
      mockDoctors.push(doctor);
      mockDoctorDepartments.push({
        uuid: crypto.randomUUID(),
        doctorUuid: doctorUuid,
        departmentUuid: departmentUuid,
      });
    }

    return [201, { message: "Created successfully", data: toStaffDto(account, hospitalUuid) }];
  });

  mock
    .onPut(/^\/hospitals\/[^/]+\/staff\/[^/]+\/status$/)
    .reply((config) => {
      const [hospitalUuid, accountUuid] = getRouteIds(config.url);
      if (!hospitalExists(hospitalUuid)) return notFound();

      const account = mockAccounts.find(
        (item) =>
          item.uuid === accountUuid &&
          item.hospitalUuid === hospitalUuid &&
          item.deletedAt.getTime() === 0 &&
          isStaffAccount(item),
      );
      if (!account) return notFound("Staff account not found");

      const payload = parsePayload(config.data);
      if (
        !payload ||
        typeof payload !== "object" ||
        !Object.values(BaseStatus).includes(payload.status as BaseStatus)
      ) {
        return [400, { message: "Account status is invalid" }];
      }

      account.status = payload.status as BaseStatus;
      account.updatedAt = new Date();
      return [
        200,
        {
          message: "Updated successfully",
          data: {
            accountUuid: account.uuid,
            status: account.status,
            updatedAt: account.updatedAt.toISOString(),
          },
        },
      ];
    });
}

function getHospitalUuid(url?: string) {
  return decodeURIComponent(url?.split("/")[2] ?? "");
}

function getRouteIds(url?: string) {
  const parts = url?.split("/") ?? [];
  return [decodeURIComponent(parts[2] ?? ""), decodeURIComponent(parts[4] ?? "")];
}

function hospitalExists(uuid: string) {
  return mockHospitals.some(
    (hospital) => hospital.uuid === uuid && hospital.deletedAt.getTime() === 0,
  );
}

function isStaffAccount(account: Account) {
  return (
    account.roleUuid === ROLE_UUIDS.DOCTOR ||
    account.roleUuid === ROLE_UUIDS.STAFF ||
    account.roleUuid === ROLE_UUIDS.WAREHOUSE_MANAGER
  );
}

function roleCodeFor(account: Account): StaffRoleCode {
  if (account.roleUuid === ROLE_UUIDS.DOCTOR) return "doctor";
  if (account.roleUuid === ROLE_UUIDS.WAREHOUSE_MANAGER) return "WarehouseManager";
  return "Staff";
}

function roleUuidFor(roleCode: StaffRoleCode) {
  switch (roleCode) {
    case "doctor":
      return ROLE_UUIDS.DOCTOR;
    case "WarehouseManager":
      return ROLE_UUIDS.WAREHOUSE_MANAGER;
    case "Staff":
      return ROLE_UUIDS.STAFF;
  }
}

function toStaffDto(account: Account, hospitalUuid: string) {
  const roleCode = roleCodeFor(account);
  const doctor = mockDoctors.find((item) => item.accountUuid === account.uuid);
  const relation = doctor
    ? mockDoctorDepartments.find((item) => item.doctorUuid === doctor.uuid)
    : undefined;
  const department = relation
    ? mockDepartments.find((item) => item.uuid === relation.departmentUuid)
    : undefined;
  const role = mockRoles.find((item) => item.uuid === account.roleUuid);

  return {
    accountUuid: account.uuid,
    doctorUuid: doctor?.uuid ?? null,
    displayName: doctor?.name ?? account.phone,
    phone: account.phone,
    roleCode,
    roleName: role?.name ?? roleCode,
    departmentUuid: department?.uuid ?? null,
    departmentName: department?.name ?? null,
    specialty: doctor?.specialty ?? null,
    status: account.status,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
    hospitalUuid,
  };
}

function getStaffSearchValues(account: Account) {
  const dto = toStaffDto(account, account.hospitalUuid ?? "");
  return [dto.displayName, dto.phone, dto.roleName, dto.departmentName ?? ""];
}

function isValidPayload(
  payload: CreatePayload,
): payload is CreatePayload & {
  phone: string;
  password: string;
  roleCode: StaffRoleCode;
  name?: string;
  specialty?: string;
  departmentUuid?: string;
} {
  if (!payload || typeof payload !== "object") return false;
  if (
    typeof payload.phone !== "string" ||
    !/^[0-9+()\-\s]{8,20}$/.test(payload.phone.trim()) ||
    typeof payload.password !== "string" ||
    payload.password.length < 8 ||
    payload.password.length > 128 ||
    !isStaffRole(payload.roleCode)
  ) {
    return false;
  }
  if (payload.name !== undefined && (typeof payload.name !== "string" || payload.name.trim().length < 2 || payload.name.length > 100)) return false;
  if (payload.specialty !== undefined && (typeof payload.specialty !== "string" || payload.specialty.trim().length < 2 || payload.specialty.length > 100)) return false;
  if (payload.price !== undefined && (typeof payload.price !== "number" || !Number.isInteger(payload.price) || payload.price < 0)) return false;
  return payload.departmentUuid === undefined || typeof payload.departmentUuid === "string";
}

function isStaffRole(value: unknown): value is StaffRoleCode {
  return value === "doctor" || value === "Staff" || value === "WarehouseManager";
}

function parsePayload(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      return isRecord(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return isRecord(data) ? data : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function notFound(message = "Hospital not found"): [number, { message: string; error: string }] {
  return [404, { message, error: "Resource does not exist" }];
}