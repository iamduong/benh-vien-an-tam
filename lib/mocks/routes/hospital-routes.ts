import type AxiosMockAdapter from "axios-mock-adapter";

import { featuredHospitals, mockHospitals } from "@/data/mocks/hospitals";
import { mockDepartments } from "@/data/mocks/departments";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockReviewHospitals } from "@/data/mocks/review-hospitals";
import {
  getHospitalAssignments,
  saveHospitalAssignments,
} from "@/lib/mocks/hospital-assignments";
import type { HospitalUpdateRequest } from "@/lib/services/hospital/HospitalService";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
  paginate,
  paginatePublic,
} from "@/lib/mocks/query-utils";
import {
  BaseStatus,
  type Hospital,
  type HospitalAssignmentSelection,
} from "@/types/models";

const branchProfileStorageKey = "an-tam-mock.branch-profile";

export function registerHospitalRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/hospitals/featured").reply(() => {
    return [
      200,
      {
        data: featuredHospitals.map(withSavedBranchProfile),
        message: "Lấy danh sách cơ sở nổi bật thành công.",
      },
    ];
  });

  mock.onGet("/public/hospitals").reply(200, {
    data: mockHospitals
      .filter((hospital) => hospital.status === BaseStatus.Active)
      .map(withSavedBranchProfile),
    message: "Lấy danh sách cơ sở nổi bật thành công.",
  });

  mock.onGet("/public/hospitals/search").reply((config) => {
    const keyword = getStringParam(config.params, "q");
    const department = getStringParam(config.params, "department");
    const items = mockHospitals.map(withSavedBranchProfile).filter(
      (hospital) =>
        hospital.status === BaseStatus.Active &&
        matchesKeyword(keyword, hospital.name, hospital.address) &&
        (!department ||
          getHospitalAssignments(hospital.uuid).departmentUuids.includes(department)),
    );
    return [200, {
      data: paginatePublic(
        items,
        getPositiveIntegerParam(config.params, "page", 1),
        getPositiveIntegerParam(config.params, "pageSize", 8),
      ),
      message: "Lấy danh sách cơ sở y tế thành công.",
    }];
  });

  mock.onGet("/hospitals").reply((config) => {
    const q = getStringParam(config.params, "q");
    const name = getStringParam(config.params, "name");
    const department = getStringParam(config.params, "department");
    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = getPositiveIntegerParam(config.params, "pageSize", 6);
    const items = mockHospitals.map(withSavedBranchProfile).filter(
      (hospital) =>
        hospital.status === BaseStatus.Active &&
        matchesKeyword(name, hospital.name) &&
        matchesKeyword(q, hospital.name, hospital.address) &&
        (!department ||
          getHospitalAssignments(hospital.uuid).departmentUuids.includes(
            department,
          )),
    );

    return [
      200,
      {
        data: paginate(items, page, pageSize),
        message: "Lấy danh sách cơ sở y tế thành công.",
      },
    ];
  });

  mock.onGet("/hospitals/options").reply(200, {
    data: mockHospitals
      .filter((hospital) => hospital.status === BaseStatus.Active)
      .map(withSavedBranchProfile),
    message: "Lấy lựa chọn cơ sở y tế thành công.",
  });

  mock.onGet("/hospitals/branch-profile").reply(() => {
    const hospital = mockHospitals.find(
      (item) =>
        item.status === BaseStatus.Active && item.deletedAt.getTime() === 0,
    );

    if (!hospital) {
      return [
        404,
        { data: null, message: "Không tìm thấy hồ sơ chi nhánh mock." },
      ];
    }

    const profile = withSavedBranchProfile(hospital);

    return [
      200,
      {
        data: profile,
        message: "Lấy hồ sơ chi nhánh thành công.",
      },
    ];
  });

  mock
    .onGet(/^\/hospitals\/[^/]+\/departments$/)
    .reply((config) => {
      const uuid = getHospitalUuid(config.url);
      const hospital = mockHospitals.find(
        (item) => item.uuid === uuid && item.deletedAt.getTime() === 0,
      );

      if (!hospital) {
        return [404, { data: null, message: "Không tìm thấy chi nhánh mock." }];
      }

      const { departmentUuids } = getHospitalAssignments(uuid);
      const departments = mockDepartments.filter(
        (item) =>
          departmentUuids.includes(item.uuid) &&
          item.status === BaseStatus.Active,
      );

      return [
        200,
        {
          data: paginate(
            departments,
            getPositiveIntegerParam(config.params, "page", 1),
            getPositiveIntegerParam(config.params, "pageSize", 20),
          ),
          message: "Lấy chuyên khoa của chi nhánh thành công.",
        },
      ];
    });

  mock
    .onGet(/^\/hospitals\/[^/]+\/medical-services$/)
    .reply((config) => {
      const uuid = getHospitalUuid(config.url);
      const hospital = mockHospitals.find(
        (item) => item.uuid === uuid && item.deletedAt.getTime() === 0,
      );

      if (!hospital) {
        return [404, { data: null, message: "Không tìm thấy chi nhánh mock." }];
      }

      const { medicalServiceUuids } = getHospitalAssignments(uuid);
      const services = mockMedicalServices.filter(
        (item) =>
          medicalServiceUuids.includes(item.uuid) &&
          item.status === BaseStatus.Active,
      );

      return [
        200,
        {
          data: paginate(
            services,
            getPositiveIntegerParam(config.params, "page", 1),
            getPositiveIntegerParam(config.params, "pageSize", 20),
          ),
          message: "Lấy dịch vụ của chi nhánh thành công.",
        },
      ];
    });

  mock.onPut(/^\/hospitals\/[^/]+$/).reply((config) => {
    const uuid = decodeURIComponent(config.url?.split("/").pop() ?? "");
    const hospital = mockHospitals.find(
      (item) => item.uuid === uuid && item.deletedAt.getTime() === 0,
    );

    if (!hospital) {
      return [404, { data: null, message: "Không tìm thấy chi nhánh mock." }];
    }

    const request = parseHospitalUpdateRequest(config.data);
    if (!isValidHospitalUpdateRequest(request)) {
      return [
        400,
        { data: null, message: "Thông tin chi nhánh không hợp lệ." },
      ];
    }

    const updatedAt = new Date();
    saveBranchProfile(request, updatedAt);
    Object.assign(hospital, request, { updatedAt: updatedAt });

    return [
      200,
      {
        data: { ...hospital },
        message: "Cập nhật thông tin chi nhánh thành công.",
      },
    ];
  });

  mock.onPut(/^\/hospitals\/[^/]+\/assignments$/).reply((config) => {
    const uuid = getHospitalUuid(config.url);
    const hospital = mockHospitals.find(
      (item) => item.uuid === uuid && item.deletedAt.getTime() === 0,
    );

    if (!hospital) {
      return [404, { data: null, message: "Không tìm thấy chi nhánh mock." }];
    }

    const selection = parseHospitalAssignments(config.data);
    if (
      !isValidHospitalAssignments(selection) ||
      !selection.departmentUuids.every((id) =>
        mockDepartments.some(
          (item) => item.uuid === id && item.status === BaseStatus.Active,
        ),
      ) ||
      !selection.medicalServiceUuids.every((id) =>
        mockMedicalServices.some(
          (item) => item.uuid === id && item.status === BaseStatus.Active,
        ),
      )
    ) {
      return [400, { data: null, message: "Phân bổ danh mục không hợp lệ." }];
    }

    const normalizedSelection = {
      departmentUuids: [...new Set(selection.departmentUuids)],
      medicalServiceUuids: [...new Set(selection.medicalServiceUuids)],
    };
    saveHospitalAssignments(uuid, normalizedSelection);

    return [
      200,
      {
        data: normalizedSelection,
        message: "Đã lưu phân bổ chuyên khoa và dịch vụ.",
      },
    ];
  });

  mock
    .onGet(/^\/(?:public\/)?hospitals\/(?!featured$|options$|branch-profile$)[^/]+$/)
    .reply((config) => {
      const slug = decodeURIComponent(config.url?.split("/").pop() ?? "");
      const hospital = mockHospitals.map(withSavedBranchProfile).find(
        (item) => item.slug === slug && item.status === BaseStatus.Active,
      );

      if (!hospital) {
        return [404, { data: null, message: "Không tìm thấy cơ sở y tế." }];
      }

      const assignments = getHospitalAssignments(hospital.uuid);
      const departmentUuids = new Set(assignments.departmentUuids);
      const serviceUuids = new Set(assignments.medicalServiceUuids);

      return [
        200,
        {
          data: {
            hospital: hospital,
            departments: mockDepartments.filter(
              (item) =>
                item.status === BaseStatus.Active && departmentUuids.has(item.uuid),
            ),
            medicalServices: mockMedicalServices.filter(
              (item) =>
                item.status === BaseStatus.Active && serviceUuids.has(item.uuid),
            ),
            reviews: mockReviewHospitals
              .filter(
                (review) =>
                  review.hospitalUuid === hospital.uuid &&
                  review.status === BaseStatus.Active,
              )
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
          },
          message: "Lấy chi tiết cơ sở y tế thành công.",
        },
      ];
    });
}

function getHospitalUuid(url?: string) {
  return decodeURIComponent(url?.split("/")[2] ?? "");
}

function withSavedBranchProfile(hospital: Hospital): Hospital {
  const branchHospital = mockHospitals.find(
    (item) =>
      item.status === BaseStatus.Active && item.deletedAt.getTime() === 0,
  );
  const savedProfile = readSavedBranchProfile();

  if (!savedProfile || hospital.uuid !== branchHospital?.uuid) {
    return hospital;
  }

  return {
    ...hospital,
    ...savedProfile.profile,
    updatedAt: new Date(savedProfile.updatedAt),
  };
}

function parseHospitalUpdateRequest(data: unknown): unknown {
  return typeof data === "string" ? JSON.parse(data) : data;
}

function parseHospitalAssignments(data: unknown): unknown {
  return typeof data === "string" ? JSON.parse(data) : data;
}

function isValidHospitalAssignments(
  value: unknown,
): value is HospitalAssignmentSelection {
  if (!value || typeof value !== "object") return false;
  const selection = value as Partial<HospitalAssignmentSelection>;

  return (
    Array.isArray(selection.departmentUuids) &&
    selection.departmentUuids.every((uuid) => typeof uuid === "string") &&
    Array.isArray(selection.medicalServiceUuids) &&
    selection.medicalServiceUuids.every((uuid) => typeof uuid === "string")
  );
}

function isValidHospitalUpdateRequest(
  value: unknown,
): value is HospitalUpdateRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<HospitalUpdateRequest>;

  return (
    typeof request.name === "string" &&
    request.name.trim().length > 0 &&
    typeof request.slug === "string" &&
    request.slug.trim().length > 0 &&
    typeof request.address === "string" &&
    request.address.trim().length > 0 &&
    typeof request.workingHour === "string" &&
    request.workingHour.trim().length > 0 &&
    typeof request.numberOfRoom === "number" &&
    Number.isInteger(request.numberOfRoom) &&
    request.numberOfRoom > 0 &&
    typeof request.description === "string" &&
    typeof request.image === "string" &&
    typeof request.mapUrl === "string" &&
    typeof request.detailService === "string"
  );
}

function readSavedBranchProfile(): {
  profile: HospitalUpdateRequest;
  updatedAt: string;
} | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(branchProfileStorageKey);
  if (!saved) return null;

  const parsed: unknown = JSON.parse(saved);
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("profile" in parsed) ||
    !("updatedAt" in parsed) ||
    !isValidHospitalUpdateRequest(parsed.profile) ||
    typeof parsed.updatedAt !== "string" ||
    Number.isNaN(new Date(parsed.updatedAt).getTime())
  ) {
    throw new Error("Dữ liệu hồ sơ chi nhánh mock đã lưu không hợp lệ.");
  }

  return {
    profile: parsed.profile,
    updatedAt: parsed.updatedAt,
  };
}

function saveBranchProfile(
  profile: HospitalUpdateRequest,
  updatedAt: Date,
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    branchProfileStorageKey,
    JSON.stringify({
      profile,
      updatedAt: updatedAt.toISOString(),
    }),
  );
}
