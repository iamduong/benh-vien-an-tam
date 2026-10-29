import type AxiosMockAdapter from "axios-mock-adapter";

import { featuredDepartments, mockDepartments } from "@/data/mocks/departments";
import { mockDoctorDepartments } from "@/data/mocks/doctor-departments";
import { mockDoctors } from "@/data/mocks/doctors";
import { mockHospitals } from "@/data/mocks/hospitals";
import { getHospitalAssignments } from "@/lib/mocks/hospital-assignments";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
  paginate,
} from "@/lib/mocks/query-utils";
import { BaseStatus } from "@/types/models";

export function registerDepartmentRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/public/departments").reply(200, {
    data: featuredDepartments,
    message: "Lấy danh sách chuyên khoa nổi bật thành công.",
  });

  mock.onGet(/^\/public\/departments\/[^/]+$/).reply((config) => {
    const identifier = decodeURIComponent(config.url?.split("/").pop() ?? "");
    const normalizedUuid = identifier.replace(
      /^(........)(....)(....)(....)(............)$/,
      "$1-$2-$3-$4-$5",
    );
    const department = mockDepartments.find(
      (item) =>
        item.status === BaseStatus.Active &&
        (item.slug === identifier || item.uuid === normalizedUuid),
    );

    if (!department) {
      return [404, { data: null, message: "Không tìm thấy chuyên khoa." }];
    }

    const doctorUuids = new Set(
      mockDoctorDepartments
        .filter((item) => item.departmentUuid === department.uuid)
        .map((item) => item.doctorUuid),
    );

    return [
      200,
      {
        data: {
          department,
          hospitals: mockHospitals.filter(
            (hospital) =>
              hospital.status === BaseStatus.Active &&
              getHospitalAssignments(hospital.uuid).departmentUuids.includes(
                department.uuid,
              ),
          ),
          doctors: mockDoctors.filter((doctor) => doctorUuids.has(doctor.uuid)),
        },
        message: "Lấy chi tiết chuyên khoa thành công.",
      },
    ];
  });

  mock.onGet("/departments").reply((config) => {
    const search =
      getStringParam(config.params, "search") ||
      getStringParam(config.params, "q");
    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = getPositiveIntegerParam(config.params, "pageSize", 20);
    const items = mockDepartments.filter(
      (department) =>
        department.status === BaseStatus.Active &&
        matchesKeyword(search, department.name, department.slug),
    );

    return [
      200,
      {
        data: paginate(items, page, pageSize),
        message: "Lấy danh sách chuyên khoa thành công.",
      },
    ];
  });

  mock.onGet("/departments/featured").reply(200, {
    data: featuredDepartments,
    message: "Lấy danh sách chuyên khoa nổi bật thành công.",
  });

  mock.onGet("/departments/options").reply(200, {
    data: mockDepartments.filter(
      (department) => department.status === BaseStatus.Active,
    ),
    message: "Lấy lựa chọn chuyên khoa thành công.",
  });
}
