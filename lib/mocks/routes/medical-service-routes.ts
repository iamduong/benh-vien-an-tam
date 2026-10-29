import type AxiosMockAdapter from "axios-mock-adapter";

import { mockHospitals } from "@/data/mocks/hospitals";
import {
  featuredMedicalServices,
  mockMedicalServices,
} from "@/data/mocks/medical-services";
import { mockReviewMedicalServices } from "@/data/mocks/review-medical-services";
import { getHospitalAssignments } from "@/lib/mocks/hospital-assignments";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
  paginate,
  paginatePublic,
} from "@/lib/mocks/query-utils";
import { BaseStatus } from "@/types/models";

export function registerMedicalServiceRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/medical-services/featured").reply(200, {
    data: featuredMedicalServices,
    message: "Lấy danh sách dịch vụ nổi bật thành công.",
  });

  mock.onGet("/public/medical-services").reply(200, {
    data: featuredMedicalServices,
    message: "Lấy danh sách dịch vụ nổi bật thành công.",
  });

  mock.onGet("/public/medical-services/search").reply((config) => {
    const keyword = getStringParam(config.params, "q");
    const hospital = getStringParam(config.params, "hospital");
    const items = mockMedicalServices.filter((service) =>
      service.status === BaseStatus.Active &&
      matchesKeyword(keyword, service.name, service.description) &&
      (!hospital || getHospitalAssignments(hospital).medicalServiceUuids.includes(service.uuid)),
    );
    return [200, {
      data: paginatePublic(
        items,
        getPositiveIntegerParam(config.params, "page", 1),
        getPositiveIntegerParam(config.params, "pageSize", 8),
      ),
      message: "Lấy danh sách dịch vụ y tế thành công.",
    }];
  });

  mock.onGet("/medical-services").reply((config) => {
    const q = getStringParam(config.params, "q");
    const hospital = getStringParam(config.params, "hospital");
    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = getPositiveIntegerParam(config.params, "pageSize", 6);
    const items = mockMedicalServices.filter(
      (service) =>
        service.status === BaseStatus.Active &&
        matchesKeyword(
          getStringParam(config.params, "search") || q,
          service.name,
          service.description,
        ) &&
        (!hospital ||
          getHospitalAssignments(hospital).medicalServiceUuids.includes(
            service.uuid,
          )),
    );

    return [
      200,
      {
        data: paginate(items, page, pageSize),
        message: "Lấy danh sách dịch vụ y tế thành công.",
      },
    ];
  });

  mock
    .onGet(/^\/(?:public\/)?medical-services\/(?!featured$)[^/]+$/)
    .reply((config) => {
      const slug = decodeURIComponent(config.url?.split("/").pop() ?? "");
      const service = mockMedicalServices.find(
        (item) => item.slug === slug && item.status === BaseStatus.Active,
      );

      if (!service) {
        return [404, { data: null, message: "Không tìm thấy dịch vụ y tế." }];
      }

      const hospitalUuids = new Set(
        mockHospitals
          .filter(
            (hospital) =>
              hospital.status === BaseStatus.Active &&
              getHospitalAssignments(hospital.uuid).medicalServiceUuids.includes(
                service.uuid,
              ),
          )
          .map((hospital) => hospital.uuid),
      );

      return [
        200,
        {
          data: {
            medicalService: service,
            hospitals: mockHospitals.filter(
              (item) =>
                item.status === BaseStatus.Active && hospitalUuids.has(item.uuid),
            ),
            reviews: mockReviewMedicalServices
              .filter(
                (review) =>
                  review.medicalServiceUuid === service.uuid &&
                  review.status === BaseStatus.Active,
              )
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
          },
          message: "Lấy chi tiết dịch vụ y tế thành công.",
        },
      ];
    });
}
