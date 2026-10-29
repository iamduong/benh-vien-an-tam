import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockAppointments } from "@/data/mocks/appointments";
import { mockDoctors } from "@/data/mocks/doctors";
import { mockHospitals } from "@/data/mocks/hospitals";
import { mockMedicines } from "@/data/mocks/medicines";
import { mockPatientProfiles } from "@/data/mocks/patient-profiles";
import { mockPrescriptionDetails } from "@/data/mocks/prescription-details";
import { mockPrescriptions } from "@/data/mocks/prescriptions";
import {
  getVietnamDateTimeParts,
  isValidDateString,
} from "@/lib/booking/working-hours";
import { getStringParam } from "@/lib/mocks/query-utils";
import {
  AppointmentType,
  BaseStatus,
  PrescriptionStatus,
  ROLE_UUIDS,
  type Prescription,
} from "@/types/models";
import type {
  LinkedPrescriptionAppointment,
  PrescriptionSummary,
  PrescriptionView,
} from "@/types/prescriptions";

export function registerPrescriptionRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/prescriptions").reply((config): [number, unknown] => {
    const patient = getCurrentPatient(config.headers);
    if (!patient) return unauthorizedResponse();

    const status = getStringParam(config.params, "status");
    const from = getStringParam(config.params, "from");
    const to = getStringParam(config.params, "to");
    if (
      (status &&
        !Object.values(PrescriptionStatus).includes(status as PrescriptionStatus)) ||
      (from && !isValidDateString(from)) ||
      (to && !isValidDateString(to)) ||
      (from && to && from > to)
    ) {
      return [422, { message: "Bộ lọc đơn thuốc không hợp lệ." }];
    }

    const page = parsePositiveInteger(config.params?.page, 1);
    const pageSize = Math.min(parsePositiveInteger(config.params?.pageSize, 5), 20);
    const items = mockPrescriptions
      .filter(
        (item) =>
          item.patientProfileUuid === patient.profileUuid &&
          item.deletedAt.getTime() === 0,
      )
      .filter((item) => !status || item.status === status)
      .filter((item) => {
        const date = getVietnamDateTimeParts(item.createdAt).date;
        return (!from || date >= from) && (!to || date <= to);
      })
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .map(buildSummary)
      .filter((item): item is PrescriptionSummary => Boolean(item));
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;

    return [
      200,
      {
        data: {
          Items: items.slice(start, start + pageSize),
          Page: safePage,
          PageSize: pageSize,
          TotalItems: items.length,
          TotalPages: totalPages,
        },
        message: "Lấy danh sách đơn thuốc thành công.",
      },
    ];
  });

  mock.onGet(/^\/prescriptions\/[^/]+$/).reply((config): [number, unknown] => {
    const patient = getCurrentPatient(config.headers);
    if (!patient) return unauthorizedResponse();
    const uuid = decodeURIComponent(config.url?.split("/").pop() ?? "");
    const prescription = mockPrescriptions.find(
      (item) =>
        item.uuid === uuid &&
        item.patientProfileUuid === patient.profileUuid &&
        item.deletedAt.getTime() === 0,
    );
    if (!prescription) return notFoundResponse();
    const view = buildView(prescription);
    return view
      ? [200, { data: view, message: "Lấy chi tiết đơn thuốc thành công." }]
      : notFoundResponse();
  });
}

function buildSummary(prescription: Prescription): PrescriptionSummary | null {
  const hospital = mockHospitals.find(
    (item) => item.uuid === prescription.hospitalUuid,
  );
  const doctor = mockDoctors.find(
    (item) => item.uuid === prescription.doctorProfileUuid,
  );
  if (!hospital || !doctor) return null;
  const details = mockPrescriptionDetails.filter(
    (item) => item.prescriptionUuid === prescription.uuid,
  );
  return {
    prescription: prescription,
    hospital: {
      uuid: hospital.uuid,
      name: hospital.name,
      slug: hospital.slug,
    },
    doctor: { uuid: doctor.uuid, name: doctor.name, slug: doctor.slug },
    appointment: getLinkedAppointment(prescription),
    totalAmount: details.length
      ? details.reduce((total, item) => total + item.quantity * item.price, 0)
      : null,
    numberOfItems: details.length,
  };
}

function buildView(prescription: Prescription): PrescriptionView | null {
  const summary = buildSummary(prescription);
  if (!summary) return null;
  return {
    ...summary,
    details: mockPrescriptionDetails
      .filter((item) => item.prescriptionUuid === prescription.uuid)
      .map((detail) => {
        const medicine = mockMedicines.find(
          (item) => item.uuid === detail.medicineUuid,
        );
        return medicine ? { detail: detail, medicine: medicine } : null;
      })
      .filter((item): item is PrescriptionView["details"][number] => Boolean(item)),
  };
}

function getLinkedAppointment(
  prescription: Prescription,
): LinkedPrescriptionAppointment | null {
  if (!prescription.appointmentUuid) return null;
  const appointment = mockAppointments.find(
    (item) =>
      item.uuid === prescription.appointmentUuid &&
      item.patientUuid === prescription.patientProfileUuid &&
      item.hospitalUuid === prescription.hospitalUuid &&
      (item.type !== AppointmentType.Doctor ||
        item.doctorUuid === prescription.doctorProfileUuid) &&
      item.deletedAt.getTime() === 0,
  );
  if (!appointment) return null;
  const type =
    appointment.type === AppointmentType.Doctor
      ? "doctor"
      : appointment.type === AppointmentType.Service
        ? "medical-service"
        : "hospital";
  return { uuid: appointment.uuid, type: type };
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
  return account && profile ? { profileUuid: profile.uuid } : null;
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

function parsePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function unauthorizedResponse(): [number, unknown] {
  return [403, { message: "Phiên đăng nhập không hợp lệ." }];
}

function notFoundResponse(): [number, unknown] {
  return [404, { message: "Không tìm thấy đơn thuốc." }];
}
