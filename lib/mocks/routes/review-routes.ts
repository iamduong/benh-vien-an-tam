import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockAppointmentMedicalServices } from "@/data/mocks/appointment-medical-services";
import { mockAppointments } from "@/data/mocks/appointments";
import { mockDoctors } from "@/data/mocks/doctors";
import { mockHospitals } from "@/data/mocks/hospitals";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockPatientProfiles } from "@/data/mocks/patient-profiles";
import { mockReviewDoctors } from "@/data/mocks/review-doctors";
import { mockReviewHospitals } from "@/data/mocks/review-hospitals";
import { mockReviewMedicalServices } from "@/data/mocks/review-medical-services";
import { getStringParam } from "@/lib/mocks/query-utils";
import {
  AppointmentStatus,
  AppointmentType,
  BaseStatus,
  ROLE_UUIDS,
  type ReviewHospital,
} from "@/types/models";
import type {
  PatientReview,
  ReviewEligibilityTarget,
  ReviewTargetType,
  SaveReviewRequest,
} from "@/types/reviews";

const reviewStorageKey = "an-tam-y-te.mock-reviews.v1";
let restoredPersistedReviews = false;

export function registerReviewRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/reviews/eligibility").reply((config): [number, unknown] => {
    restoreReviewState();
    const current = getCurrentPatient(config.headers);
    if (!current) return unauthorizedResponse();
    const appointmentUuid = getStringParam(config.params, "appointmentUuid");
    const targets = getAppointmentTargets(
      appointmentUuid,
      current.patientUuid,
    );
    if (!targets) {
      return [
        403,
        {
          message:
            "Chỉ có thể đánh giá sau khi lịch khám của bạn đã hoàn thành.",
        },
      ];
    }
    return [
      200,
      {
        data: { appointmentUuid: appointmentUuid, targets: targets },
        message: "Lấy đối tượng có thể đánh giá thành công.",
      },
    ];
  });

  mock.onGet("/reviews/public").reply((config): [number, unknown] => {
    restoreReviewState();
    const type = getStringParam(config.params, "type");
    const targetUuid = getStringParam(config.params, "targetUuid");
    if (!isReviewType(type) || !targetUuid) {
      return [422, { message: "Đối tượng đánh giá không hợp lệ." }];
    }
    return [
      200,
      {
        data: getReviewStore(type)
          .filter(
            (item) =>
              getReviewTargetUuid(type, item) === targetUuid &&
              item.status === BaseStatus.Active,
          )
          .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
          .map(({ uuid, content, numberOfStar, createdAt }) => ({
            uuid,
            content,
            numberOfStar,
            createdAt,
          })),
        message: "Lấy đánh giá công khai thành công.",
      },
    ];
  });

  mock
    .onPut(/^\/reviews\/(hospital|doctor|medical-service)\/[^/]+$/)
    .reply((config): [number, unknown] => {
      restoreReviewState();
      const current = getCurrentPatient(config.headers);
      if (!current) return unauthorizedResponse();
      const segments = config.url?.split("/") ?? [];
      const type = segments.at(-2) ?? "";
      const targetUuid = decodeURIComponent(segments.at(-1) ?? "");
      if (!isReviewType(type) || !targetUuid) {
        return [422, { message: "Đối tượng đánh giá không hợp lệ." }];
      }
      const request = parseBody(config.data);
      const errors = validateReviewRequest(request);
      if (errors) {
        return [422, { message: "Vui lòng kiểm tra lại đánh giá.", errors: errors }];
      }
      const payload = request as SaveReviewRequest;
      if (!hasDoneAppointment(type, targetUuid, current.accountUuid)) {
        return [
          403,
          {
            message:
              "Bạn cần hoàn thành lịch khám liên quan trước khi đánh giá.",
          },
        ];
      }
      if (!targetExists(type, targetUuid)) {
        return [404, { message: "Không tìm thấy đối tượng đánh giá." }];
      }

      const store = getReviewStore(type);
      const existing = store.find(
        (item) =>
          item.patientUuid === current.patientUuid &&
          getReviewTargetUuid(type, item) === targetUuid,
      );
      if (existing) {
        existing.content = payload.content.trim();
        existing.numberOfStar = payload.numberOfStar;
        existing.status = BaseStatus.Active;
        existing.isViewed = false;
        persistReviewState();
        return [
          200,
          { data: existing, message: "Cập nhật đánh giá thành công." },
        ];
      }

      const common = {
        uuid: crypto.randomUUID(),
        content: payload.content.trim(),
        numberOfStar: payload.numberOfStar,
        patientUuid: current.patientUuid,
        status: BaseStatus.Active,
        isViewed: false,
        createdAt: new Date(),
      };
      const review = createReview(type, targetUuid, common);
      pushReview(type, review);
      persistReviewState();
      return [
        201,
        { data: review, message: "Gửi đánh giá thành công." },
      ];
    });
}

function getAppointmentTargets(
  appointmentUuid: string,
  patientUuid: string,
): ReviewEligibilityTarget[] | null {
  const appointment = mockAppointments.find(
    (item) =>
      item.uuid === appointmentUuid &&
      item.patientUuid === patientUuid &&
      item.status === AppointmentStatus.Done &&
      item.deletedAt.getTime() === 0,
  );
  if (!appointment) return null;
  const hospital = mockHospitals.find(
    (item) => item.uuid === appointment.hospitalUuid,
  );
  if (!hospital) return null;
  const targets: ReviewEligibilityTarget[] = [
    buildTarget("hospital", hospital.uuid, hospital.name, patientUuid),
  ];
  if (appointment.type === AppointmentType.Doctor && appointment.doctorUuid) {
    const doctor = mockDoctors.find(
      (item) => item.uuid === appointment.doctorUuid,
    );
    if (!doctor) return null;
    targets.push(buildTarget("doctor", doctor.uuid, doctor.name, patientUuid));
  }
  if (
    appointment.type === AppointmentType.Service &&
    appointment.medicalServiceUuid
  ) {
    const service = mockMedicalServices.find(
      (item) => item.uuid === appointment.medicalServiceUuid,
    );
    if (!service) return null;
    targets.push(
      buildTarget("medical-service", service.uuid, service.name, patientUuid),
    );
  }
  for (const relation of mockAppointmentMedicalServices.filter(
    (item) => item.appointmentUuid === appointment.uuid,
  )) {
    if (
      targets.some(
        (item) =>
          item.type === "medical-service" &&
          item.targetUuid === relation.medicalServiceUuid,
      )
    ) {
      continue;
    }
    const service = mockMedicalServices.find(
      (item) => item.uuid === relation.medicalServiceUuid,
    );
    if (service) {
      targets.push(
        buildTarget("medical-service", service.uuid, service.name, patientUuid),
      );
    }
  }
  return targets;
}

function buildTarget(
  type: ReviewTargetType,
  targetUuid: string,
  targetName: string,
  patientUuid: string,
): ReviewEligibilityTarget {
  const review = getReviewStore(type).find(
    (item) =>
      item.patientUuid === patientUuid &&
      getReviewTargetUuid(type, item) === targetUuid,
  );
  return {
    type: type,
    targetUuid: targetUuid,
    targetName: targetName,
    review: review ?? null,
  };
}

function hasDoneAppointment(
  type: ReviewTargetType,
  targetUuid: string,
  accountUuid: string,
) {
  const patient = mockPatientProfiles.find(
    (item) => item.accountUuid === accountUuid,
  );
  if (!patient) return false;
  return mockAppointments.some((item) => {
    if (
      item.patientUuid !== patient.uuid ||
      item.status !== AppointmentStatus.Done ||
      item.deletedAt.getTime() !== 0
    ) {
      return false;
    }
    if (type === "hospital") return item.hospitalUuid === targetUuid;
    if (type === "doctor") return item.doctorUuid === targetUuid;
    return (
      item.medicalServiceUuid === targetUuid ||
      mockAppointmentMedicalServices.some(
        (relation) =>
          relation.appointmentUuid === item.uuid &&
          relation.medicalServiceUuid === targetUuid,
      )
    );
  });
}

function getCurrentPatient(headers: unknown) {
  const accountUuid = getHeader(headers, "X-Mock-Account-Uuid");
  const account = mockAccounts.find(
    (item) =>
      item.uuid === accountUuid &&
      item.roleUuid === ROLE_UUIDS.PATIENT &&
      item.status === BaseStatus.Active,
  );
  const profile = mockPatientProfiles.find(
    (item) => item.accountUuid === account?.uuid,
  );
  return account && profile
    ? { accountUuid: account.uuid, patientUuid: profile.uuid }
    : null;
}

function getReviewStore(type: ReviewTargetType): PatientReview[] {
  if (type === "hospital") return mockReviewHospitals;
  if (type === "doctor") return mockReviewDoctors;
  return mockReviewMedicalServices;
}

function getReviewTargetUuid(type: ReviewTargetType, review: PatientReview) {
  if (type === "hospital" && "hospitalUuid" in review) {
    return review.hospitalUuid;
  }
  if (type === "doctor" && "doctorUuid" in review) {
    return review.doctorUuid;
  }
  if (type === "medical-service" && "medicalServiceUuid" in review) {
    return review.medicalServiceUuid;
  }
  return "";
}

function targetExists(type: ReviewTargetType, targetUuid: string) {
  if (type === "hospital") {
    return mockHospitals.some((item) => item.uuid === targetUuid);
  }
  if (type === "doctor") {
    return mockDoctors.some((item) => item.uuid === targetUuid);
  }
  return mockMedicalServices.some((item) => item.uuid === targetUuid);
}

function createReview(
  type: ReviewTargetType,
  targetUuid: string,
  common: Omit<ReviewHospital, "hospitalUuid">,
): PatientReview {
  if (type === "hospital") return { ...common, hospitalUuid: targetUuid };
  if (type === "doctor") return { ...common, doctorUuid: targetUuid };
  return { ...common, medicalServiceUuid: targetUuid };
}

function pushReview(type: ReviewTargetType, review: PatientReview) {
  if (type === "hospital" && "hospitalUuid" in review) {
    mockReviewHospitals.push(review);
  } else if (type === "doctor" && "doctorUuid" in review) {
    mockReviewDoctors.push(review);
  } else if (type === "medical-service" && "medicalServiceUuid" in review) {
    mockReviewMedicalServices.push(review);
  }
}

function restoreReviewState() {
  if (typeof window === "undefined" || restoredPersistedReviews) return;
  restoredPersistedReviews = true;
  try {
    const persisted = JSON.parse(localStorage.getItem(reviewStorageKey) ?? "{}") as Record<
      string,
      unknown
    >;
    for (const type of [
      "hospital",
      "doctor",
      "medical-service",
    ] satisfies ReviewTargetType[]) {
      const values = persisted[type];
      if (!Array.isArray(values)) continue;
      for (const value of values) {
        const review = hydratePersistedReview(type, value);
        if (!review) continue;
        const store = getReviewStore(type);
        if (
          !targetExists(type, getReviewTargetUuid(type, review)) ||
          !hasDoneAppointmentForPatient(type, review)
        ) {
          continue;
        }
        const existing = store.find(
          (item) =>
            item.patientUuid === review.patientUuid &&
            getReviewTargetUuid(type, item) === getReviewTargetUuid(type, review),
        );
        if (store.some((item) => item.uuid === review.uuid && item !== existing)) {
          continue;
        }
        if (existing) {
          existing.content = review.content;
          existing.numberOfStar = review.numberOfStar;
          existing.status = BaseStatus.Active;
          existing.isViewed = false;
        } else {
          review.status = BaseStatus.Active;
          review.isViewed = false;
          pushReview(type, review);
        }
      }
    }
  } catch {
    localStorage.removeItem(reviewStorageKey);
  }
}

function persistReviewState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      reviewStorageKey,
      JSON.stringify({
        hospital: mockReviewHospitals,
        doctor: mockReviewDoctors,
        "medical-service": mockReviewMedicalServices,
      }),
    );
  } catch {
    // The in-memory mock remains usable when storage is unavailable or full.
  }
}

function hydratePersistedReview(
  type: ReviewTargetType,
  value: unknown,
): PatientReview | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const review = value as Record<string, unknown>;
  const targetField =
    type === "hospital"
      ? "hospitalUuid"
      : type === "doctor"
        ? "doctorUuid"
        : "medicalServiceUuid";
  const createdAt = new Date(String(review.createdAt));
  if (
    typeof review.uuid !== "string" ||
    typeof review.patientUuid !== "string" ||
    typeof review[targetField] !== "string" ||
    typeof review.content !== "string" ||
    review.content.trim().length < 10 ||
    review.content.trim().length > 1000 ||
    !Number.isInteger(review.numberOfStar) ||
    Number(review.numberOfStar) < 1 ||
    Number(review.numberOfStar) > 5 ||
    (review.status !== BaseStatus.Active && review.status !== BaseStatus.InActive) ||
    typeof review.isViewed !== "boolean" ||
    Number.isNaN(createdAt.getTime())
  ) {
    return null;
  }
  return { ...review, createdAt: createdAt } as PatientReview;
}

function hasDoneAppointmentForPatient(
  type: ReviewTargetType,
  review: PatientReview,
) {
  const profile = mockPatientProfiles.find(
    (item) => item.uuid === review.patientUuid,
  );
  const account = mockAccounts.find(
    (item) =>
      item.uuid === profile?.accountUuid &&
      item.roleUuid === ROLE_UUIDS.PATIENT &&
      item.status === BaseStatus.Active,
  );
  return Boolean(
    account &&
      hasDoneAppointment(
        type,
        getReviewTargetUuid(type, review),
        account.uuid,
      ),
  );
}

function validateReviewRequest(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { content: "Nội dung đánh giá không hợp lệ." };
  }
  const body = value as Record<string, unknown>;
  const errors: Partial<Record<keyof SaveReviewRequest, string>> = {};
  if (
    !Number.isInteger(body.numberOfStar) ||
    Number(body.numberOfStar) < 1 ||
    Number(body.numberOfStar) > 5
  ) {
    errors.numberOfStar = "Chọn số sao từ 1 đến 5.";
  }
  if (typeof body.content !== "string" || body.content.trim().length < 10) {
    errors.content = "Nội dung đánh giá cần ít nhất 10 ký tự.";
  } else if (body.content.trim().length > 1000) {
    errors.content = "Nội dung đánh giá tối đa 1000 ký tự.";
  }
  return Object.keys(errors).length ? errors : null;
}

function parseBody(data: unknown): unknown {
  try {
    return typeof data === "string" ? (JSON.parse(data) as unknown) : data;
  } catch {
    return null;
  }
}

function isReviewType(value: string): value is ReviewTargetType {
  return value === "hospital" || value === "doctor" || value === "medical-service";
}

function getHeader(headers: unknown, name: string) {
  if (!headers || typeof headers !== "object") return "";
  const get = (headers as { get?: (key: string) => unknown }).get;
  const value =
    typeof get === "function"
      ? get.call(headers, name)
      : (headers as Record<string, unknown>)[name];
  return typeof value === "string" ? value : "";
}

function unauthorizedResponse(): [number, unknown] {
  return [403, { message: "Phiên đăng nhập không hợp lệ." }];
}
