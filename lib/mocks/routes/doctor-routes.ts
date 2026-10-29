import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockDoctorDepartments } from "@/data/mocks/doctor-departments";
import { featuredDoctors, mockDoctors } from "@/data/mocks/doctors";
import { mockDepartments } from "@/data/mocks/departments";
import { mockHospitals } from "@/data/mocks/hospitals";
import { mockReviewDoctors } from "@/data/mocks/review-doctors";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
  paginate,
  paginatePublic,
} from "@/lib/mocks/query-utils";
import { BaseStatus } from "@/types/models";

export function registerDoctorRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/doctors/featured").reply(200, {
    data: featuredDoctors,
    message: "Lấy danh sách bác sĩ nổi bật thành công.",
  });

  mock.onGet("/public/doctors").reply(200, {
    data: featuredDoctors,
    message: "Lấy danh sách bác sĩ nổi bật thành công.",
  });

  mock.onGet("/public/doctors/search").reply((config) => {
    const keyword = getStringParam(config.params, "q");
    const hospital = getStringParam(config.params, "hospital");
    const department = getStringParam(config.params, "department");
    const items = mockDoctors.filter((doctor) =>
      matchesKeyword(keyword, doctor.name, doctor.specialty, doctor.workplace) &&
      (!hospital || doctor.hospitalUuid === hospital) &&
      (!department || mockDoctorDepartments.some((relation) =>
        relation.doctorUuid === doctor.uuid && relation.departmentUuid === department)),
    );
    return [200, {
      data: paginatePublic(
        items,
        getPositiveIntegerParam(config.params, "page", 1),
        getPositiveIntegerParam(config.params, "pageSize", 8),
      ),
      message: "Lấy danh sách bác sĩ thành công.",
    }];
  });

  mock.onGet("/doctors").reply((config) => {
    const q = getStringParam(config.params, "q");
    const hospital = getStringParam(config.params, "hospital");
    const department = getStringParam(config.params, "department");
    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = getPositiveIntegerParam(config.params, "pageSize", 6);
    const items = mockDoctors.filter((doctor) => {
      const account = mockAccounts.find(
        (candidate) => candidate.uuid === doctor.accountUuid,
      );
      const workplace = mockHospitals.find(
        (candidate) => candidate.uuid === doctor.hospitalUuid,
      );

      return (
        account?.status === BaseStatus.Active &&
        workplace?.status === BaseStatus.Active &&
        matchesKeyword(q, doctor.name, doctor.specialty, doctor.workplace) &&
        (!hospital || doctor.hospitalUuid === hospital) &&
        (!department ||
          mockDoctorDepartments.some(
            (relation) =>
              relation.doctorUuid === doctor.uuid &&
              relation.departmentUuid === department,
          ))
      );
    });

    return [
      200,
      {
        data: paginate(items, page, pageSize),
        message: "Lấy danh sách bác sĩ thành công.",
      },
    ];
  });

  mock.onGet(/^\/(?:public\/)?doctors\/(?!featured$)[^/]+$/).reply((config) => {
    const slug = decodeURIComponent(config.url?.split("/").pop() ?? "");
    const normalizedUuid = slug.replace(
      /^(........)(....)(....)(....)(............)$/,
      "$1-$2-$3-$4-$5",
    );
    const doctor = mockDoctors.find(
      (item) =>
        item.slug === slug ||
        item.slug.endsWith(slug) ||
        item.uuid === normalizedUuid,
    );
    const account = mockAccounts.find(
      (item) => item.uuid === doctor?.accountUuid,
    );
    const hospital = mockHospitals.find(
      (item) => item.uuid === doctor?.hospitalUuid,
    );

    if (
      !doctor ||
      account?.status !== BaseStatus.Active ||
      hospital?.status !== BaseStatus.Active
    ) {
      return [404, { data: null, message: "Không tìm thấy bác sĩ." }];
    }

    const departmentUuids = new Set(
      mockDoctorDepartments
        .filter((relation) => relation.doctorUuid === doctor.uuid)
        .map((relation) => relation.departmentUuid),
    );

    return [
      200,
      {
        data: {
          doctor: doctor,
          departments: mockDepartments.filter(
            (item) =>
              item.status === BaseStatus.Active && departmentUuids.has(item.uuid),
          ),
          hospital: hospital,
          reviews: mockReviewDoctors
            .filter(
              (review) =>
                review.doctorUuid === doctor.uuid &&
                review.status === BaseStatus.Active,
            )
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        },
        message: "Lấy chi tiết bác sĩ thành công.",
      },
    ];
  });
}
