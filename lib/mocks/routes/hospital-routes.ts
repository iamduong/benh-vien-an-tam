import type AxiosMockAdapter from "axios-mock-adapter";

import { featuredHospitals, mockHospitals } from "@/data/mocks/hospitals";
import { mockDepartments } from "@/data/mocks/departments";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockReviewHospitals } from "@/data/mocks/review-hospitals";
import { getHospitalAssignments } from "@/lib/mocks/hospital-assignments";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
  paginate,
  paginatePublic,
} from "@/lib/mocks/query-utils";
import { BaseStatus } from "@/types/models";

export function registerHospitalRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/hospitals/featured").reply(() => {
    return [
      200,
      {
        data: featuredHospitals,
        message: "Lấy danh sách cơ sở nổi bật thành công.",
      },
    ];
  });

  mock.onGet("/public/hospitals").reply(200, {
    data: mockHospitals.filter((hospital) => hospital.status === BaseStatus.Active),
    message: "Lấy danh sách cơ sở nổi bật thành công.",
  });

  mock.onGet("/public/hospitals/search").reply((config) => {
    const keyword = getStringParam(config.params, "q");
    const department = getStringParam(config.params, "department");
    const items = mockHospitals.filter(
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
    const items = mockHospitals.filter(
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
    data: mockHospitals.filter((hospital) => hospital.status === BaseStatus.Active),
    message: "Lấy lựa chọn cơ sở y tế thành công.",
  });

  mock
    .onGet(/^\/(?:public\/)?hospitals\/(?!featured$|options$|branch-profile$)[^/]+$/)
    .reply((config) => {
      const slug = decodeURIComponent(config.url?.split("/").pop() ?? "");
      const hospital = mockHospitals.find(
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
