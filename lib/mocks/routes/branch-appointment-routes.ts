import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAppointmentMedicalServices } from "@/data/mocks/appointment-medical-services";
import { mockAppointments } from "@/data/mocks/appointments";
import { mockAccounts } from "@/data/mocks/accounts";
import { mockDoctorWorkings } from "@/data/mocks/doctor-workings";
import { mockDoctors } from "@/data/mocks/doctors";
import { mockHospitalMedicalServices } from "@/data/mocks/hospital-medical-services";
import { mockHospitals } from "@/data/mocks/hospitals";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockRooms } from "@/data/mocks/rooms";
import { mockTimeWorkings } from "@/data/mocks/time-workings";
import { getPositiveIntegerParam, getStringParam } from "@/lib/mocks/query-utils";
import {
  AppointmentMedicalServiceStatus,
  AppointmentStatus,
  AppointmentType,
  BaseStatus,
  RoomStatus,
  type Appointment,
  type AppointmentMedicalService,
} from "@/types/models";

type Payload = Record<string, unknown>;

const appointments = mockAppointments.map((item) => ({
  ...item,
  appointmentDate: new Date(item.appointmentDate.getTime()),
  startTime: new Date(item.startTime.getTime()),
  createdAt: new Date(item.createdAt.getTime()),
  updatedAt: new Date(item.updatedAt.getTime()),
  deletedAt: new Date(item.deletedAt.getTime()),
}));
const appointmentServices: AppointmentMedicalService[] =
  mockAppointmentMedicalServices.map((item) => ({ ...item }));
const rooms = mockRooms.map((item) => ({ ...item }));

export function registerBranchAppointmentRoutes(mock: AxiosMockAdapter) {
  mock.onGet(/^\/hospitals\/[^/]+\/appointments\/resources$/).reply((config) => {
    const hospitalUuid = getHospitalUuid(config.url);
    if (!hospitalExists(hospitalUuid)) return notFound();
    return [
      200,
      {
        message: "Fetched successfully",
        data: {
          rooms: rooms.filter((item) =>
            item.hospitalUuid === hospitalUuid &&
            item.deletedAt.getTime() === 0 &&
            item.status === RoomStatus.Available)
            .map((room) => ({
              uuid: room.uuid,
              name: room.name,
              status: room.status,
            })),
          doctors: mockDoctors
            .filter((doctor) =>
              doctor.hospitalUuid === hospitalUuid &&
              mockAccountsActive(hospitalUuid, doctor.accountUuid))
            .map((doctor) => ({ uuid: doctor.uuid, name: doctor.name })),
          services: mockMedicalServices
            .filter((service) =>
              service.status === BaseStatus.Active &&
              mockHospitalMedicalServices.some((relation) =>
                relation.hospitalUuid === hospitalUuid &&
                relation.medicalServiceUuid === service.uuid))
            .map((service) => ({
              uuid: service.uuid,
              name: service.name,
              price: service.price,
            })),
          timeWorkings: mockTimeWorkings
            .filter((working) =>
              working.status === BaseStatus.Active &&
              working.deletedAt.getTime() === 0)
            .map((working) => ({
              uuid: working.uuid,
              dayOfWeek: working.dayOfWeek,
              startTime: working.startTime,
              endTime: working.endTime,
            })),
        },
      },
    ];
  });

  mock.onGet(/^\/hospitals\/[^/]+\/appointments$/).reply((config) => {
    const hospitalUuid = getHospitalUuid(config.url);
    if (!hospitalExists(hospitalUuid)) return notFound();

    const from = getStringParam(config.params, "from");
    const to = getStringParam(config.params, "to");
    const status = getStringParam(config.params, "status");
    const type = getStringParam(config.params, "type");
    const search = getStringParam(config.params, "search").toLocaleLowerCase("vi");
    if (status && !Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      return [400, { message: "Appointment status is invalid" }];
    }
    if (type && !Object.values(AppointmentType).includes(type as AppointmentType)) {
      return [400, { message: "Appointment type is invalid" }];
    }

    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = Math.min(getPositiveIntegerParam(config.params, "pageSize", 100), 100);
    const filtered = appointments
      .filter((item) =>
        item.hospitalUuid === hospitalUuid &&
        item.deletedAt.getTime() === 0 &&
        (!from || item.appointmentDate >= parseDate(from)) &&
        (!to || item.appointmentDate < addDays(parseDate(to), 1)) &&
        (!status || item.status === status) &&
        (!type || item.type === type))
      .map(toDto)
      .filter((item) =>
        !search ||
        `${item.patientName} ${item.medicalCode} ${item.doctorName ?? ""} ${item.roomName ?? ""}`
          .toLocaleLowerCase("vi")
          .includes(search))
      .sort((left, right) =>
        new Date(left.appointmentDate).getTime() - new Date(right.appointmentDate).getTime() ||
        left.time.localeCompare(right.time));
    const totalCount = filtered.length;
    return [
      200,
      {
        message: "Fetched successfully",
        data: filtered.slice((page - 1) * pageSize, page * pageSize),
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
    ];
  });

  mock.onPut(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/status$/).reply((config) => {
    const [hospitalUuid, appointmentUuid] = getRouteIds(config.url);
    const appointment = findAppointment(hospitalUuid, appointmentUuid);
    if (!appointment) return notFound("Appointment not found");
    const payload = parsePayload(config.data);
    const nextStatus = payload.status;
    if (
      nextStatus !== AppointmentStatus.Approved &&
      nextStatus !== AppointmentStatus.Unconfirmed &&
      nextStatus !== AppointmentStatus.CheckedIn &&
      nextStatus !== AppointmentStatus.Cancelled
    ) {
      return badRequest("Requested appointment status is not supported");
    }
    const validTransition =
      (appointment.status === AppointmentStatus.Pending &&
        (nextStatus === AppointmentStatus.Approved ||
          nextStatus === AppointmentStatus.Unconfirmed ||
          nextStatus === AppointmentStatus.Cancelled)) ||
      (appointment.status === AppointmentStatus.Approved &&
        (nextStatus === AppointmentStatus.CheckedIn ||
          nextStatus === AppointmentStatus.Cancelled));
    if (!validTransition) {
      return conflict("Appointment status transition is not allowed", "INVALID_APPOINTMENT_STATE");
    }
    appointment.status = nextStatus;
    appointment.updatedAt = new Date();
    return success(appointment);
  });

  mock.onPut(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/assignment$/).reply((config) => {
    const [hospitalUuid, appointmentUuid] = getRouteIds(config.url);
    const appointment = findAppointment(hospitalUuid, appointmentUuid);
    if (!appointment) return notFound("Appointment not found");
    if (appointment.status !== AppointmentStatus.Pending && appointment.status !== AppointmentStatus.Approved) {
      return conflict("Only pending or approved appointments can be assigned", "INVALID_APPOINTMENT_STATE");
    }
    const payload = parsePayload(config.data);
    const doctorUuid = typeof payload.doctorUuid === "string" ? payload.doctorUuid : null;
    const roomUuid = typeof payload.roomUuid === "string" ? payload.roomUuid : null;

    if (doctorUuid) {
      const doctor = mockDoctors.find((item) =>
        item.uuid === doctorUuid && item.hospitalUuid === hospitalUuid &&
        mockAccountsActive(hospitalUuid, item.accountUuid));
      if (!doctor) return badRequest("Doctor does not belong to this branch or is inactive", "DOCTOR_NOT_AVAILABLE");
      const working = mockTimeWorkings.find((item) =>
        item.uuid === appointment.timeSlot &&
        item.status === BaseStatus.Active &&
        item.dayOfWeek === appointment.appointmentDate.getDay());
      if (!working || !mockDoctorWorkings.some((item) =>
        item.doctorUuid === doctorUuid && item.workingUuid === working.uuid)) {
        return conflict("Doctor is not scheduled for this time slot", "DOCTOR_NOT_SCHEDULED");
      }
      if (appointments.some((item) =>
        item.uuid !== appointment.uuid && item.hospitalUuid === hospitalUuid &&
        item.doctorUuid === doctorUuid && sameSlot(item, appointment) &&
        isActiveAppointment(item.status) &&
        item.deletedAt.getTime() === 0)) {
        return conflict("Doctor already has an appointment for this time slot", "DOCTOR_SLOT_TAKEN");
      }
    }

    if (roomUuid) {
      const room = rooms.find((item) =>
        item.uuid === roomUuid && item.hospitalUuid === hospitalUuid &&
        item.deletedAt.getTime() === 0 && item.status === RoomStatus.Available);
      if (!room) return badRequest("Room is not available in this branch", "ROOM_NOT_AVAILABLE");
      if (appointments.some((item) =>
        item.uuid !== appointment.uuid && item.hospitalUuid === hospitalUuid &&
        item.roomUuid === roomUuid && sameSlot(item, appointment) &&
        isActiveAppointment(item.status) &&
        item.deletedAt.getTime() === 0)) {
        return conflict("Room already has an appointment for this time slot", "ROOM_SLOT_TAKEN");
      }
    }
    appointment.doctorUuid = doctorUuid;
    appointment.roomUuid = roomUuid;
    appointment.updatedAt = new Date();
    return success(appointment, "Resources assigned successfully");
  });

  mock.onPut(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/payment$/).reply((config) => {
    const [hospitalUuid, uuid] = getRouteIds(config.url);
    const appointment = findAppointment(hospitalUuid, uuid);
    if (!appointment) return notFound("Appointment not found");
    if (appointment.status !== AppointmentStatus.Approved && appointment.status !== AppointmentStatus.CheckedIn) {
      return conflict("Payment can only be updated for approved or checked-in appointments", "INVALID_APPOINTMENT_STATE");
    }
    const payload = parsePayload(config.data);
    if (typeof payload.isPaid !== "boolean") return badRequest("Payment status is invalid");
    appointment.isPaid = payload.isPaid;
    appointment.updatedAt = new Date();
    return success(appointment, "Payment updated successfully");
  });

  mock.onPut(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/note$/).reply((config) => {
    const [hospitalUuid, uuid] = getRouteIds(config.url);
    const appointment = findAppointment(hospitalUuid, uuid);
    if (!appointment) return notFound("Appointment not found");
    if (appointment.status === AppointmentStatus.Done || appointment.status === AppointmentStatus.Cancelled ||
        appointment.status === AppointmentStatus.Unconfirmed) {
      return conflict("Notes cannot be changed for a completed or cancelled appointment", "INVALID_APPOINTMENT_STATE");
    }
    const payload = parsePayload(config.data);
    if (typeof payload.doctorNote !== "string") return badRequest("Doctor note is invalid");
    appointment.doctorNote = payload.doctorNote.trim();
    appointment.updatedAt = new Date();
    return success(appointment, "Doctor note updated successfully");
  });

  mock.onPost(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/services$/).reply((config) => {
    const [hospitalUuid, uuid] = getRouteIds(config.url);
    const appointment = findAppointment(hospitalUuid, uuid);
    if (!appointment) return notFound("Appointment not found");
    if (appointment.status !== AppointmentStatus.Approved && appointment.status !== AppointmentStatus.CheckedIn) {
      return conflict("Services can only be added to approved or checked-in appointments", "INVALID_APPOINTMENT_STATE");
    }
    const payload = parsePayload(config.data);
    const medicalServiceUuid = typeof payload.medicalServiceUuid === "string" ? payload.medicalServiceUuid : "";
    const service = mockMedicalServices.find((item) =>
      item.uuid === medicalServiceUuid &&
      item.status === BaseStatus.Active &&
      mockHospitalMedicalServices.some((relation) =>
        relation.hospitalUuid === hospitalUuid && relation.medicalServiceUuid === item.uuid));
    if (!service) return badRequest("Service is not available in this branch", "SERVICE_NOT_AVAILABLE");

    const detail: AppointmentMedicalService = {
      uuid: crypto.randomUUID(),
      appointmentUuid: appointment.uuid,
      medicalServiceUuid: service.uuid,
      price: service.price,
      description: typeof payload.description === "string" ? payload.description.trim() : "",
      status: AppointmentMedicalServiceStatus.InProgress,
    };
    appointmentServices.push(detail);
    appointment.totalPrice += detail.price;
    appointment.updatedAt = new Date();
    return success(appointment, "Service added successfully");
  });

  mock.onPut(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/services\/[^/]+\/complete$/).reply((config) => {
    const [hospitalUuid, uuid, detailUuid] = getRouteIds(config.url, true);
    const appointment = findAppointment(hospitalUuid, uuid);
    if (!appointment) return notFound("Appointment not found");
    if (appointment.status !== AppointmentStatus.Approved && appointment.status !== AppointmentStatus.CheckedIn) {
      return conflict("Services can only be completed for approved or checked-in appointments", "INVALID_APPOINTMENT_STATE");
    }
    const detail = appointmentServices.find((item) =>
      item.uuid === detailUuid && item.appointmentUuid === appointment.uuid);
    if (!detail) return notFound("Appointment service not found");
    detail.status = AppointmentMedicalServiceStatus.Completed;
    appointment.updatedAt = new Date();
    return success(appointment, "Service completed successfully");
  });

  mock.onPut(/^\/hospitals\/[^/]+\/appointments\/[^/]+\/complete$/).reply((config) => {
    const [hospitalUuid, uuid] = getRouteIds(config.url);
    const appointment = findAppointment(hospitalUuid, uuid);
    if (!appointment) return notFound("Appointment not found");
    if (appointment.status !== AppointmentStatus.CheckedIn) {
      return conflict("Only checked-in appointments can be completed", "INVALID_APPOINTMENT_STATE");
    }
    if (!appointment.isPaid) return conflict("Appointment must be paid before completion", "PAYMENT_REQUIRED");
    if (appointmentServices.some((item) =>
      item.appointmentUuid === uuid && item.status !== AppointmentMedicalServiceStatus.Completed)) {
      return conflict("All additional services must be completed first", "SERVICES_INCOMPLETE");
    }
    const payload = parsePayload(config.data);
    if (typeof payload.doctorNote !== "string") return badRequest("Doctor note is invalid");
    appointment.status = AppointmentStatus.Done;
    appointment.doctorNote = payload.doctorNote.trim();
    appointment.updatedAt = new Date();
    if (appointment.roomUuid && !appointments.some((item) =>
      item.uuid !== appointment.uuid &&
      item.hospitalUuid === hospitalUuid &&
      item.roomUuid === appointment.roomUuid &&
      item.deletedAt.getTime() === 0 &&
      isActiveAppointment(item.status))) {
      const room = rooms.find((item) => item.uuid === appointment.roomUuid);
      if (room?.status === RoomStatus.Occupied) room.status = RoomStatus.Available;
    }
    return success(appointment, "Appointment completed successfully");
  });
}

function toDto(appointment: Appointment) {
  const working = mockTimeWorkings.find((item) => item.uuid === appointment.timeSlot);
  const doctor = mockDoctors.find((item) => item.uuid === appointment.doctorUuid);
  const room = rooms.find((item) => item.uuid === appointment.roomUuid);
  const service = mockMedicalServices.find((item) => item.uuid === appointment.medicalServiceUuid);
  return {
    uuid: appointment.uuid,
    patientName: appointment.patientName,
    gender: appointment.gender,
    medicalCode: appointment.medicalCode,
    note: appointment.note,
    appointmentDate: appointment.appointmentDate.toISOString(),
    timeSlot: appointment.timeSlot,
    time: working ? `${working.startTime} - ${working.endTime}` : appointment.startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    type: appointment.type,
    status: appointment.status,
    patientUuid: appointment.patientUuid,
    hospitalUuid: appointment.hospitalUuid,
    doctorUuid: appointment.doctorUuid,
    doctorName: doctor?.name ?? null,
    medicalServiceUuid: appointment.medicalServiceUuid,
    medicalServiceName: service?.name ?? null,
    roomUuid: appointment.roomUuid,
    roomName: room?.name ?? null,
    doctorNote: appointment.doctorNote,
    totalPrice: appointment.totalPrice,
    isPaid: appointment.isPaid,
    isWalkIn: appointment.isWalkIn,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    services: appointmentServices
      .filter((item) => item.appointmentUuid === appointment.uuid)
      .map((item) => ({
        uuid: item.uuid,
        medicalServiceUuid: item.medicalServiceUuid,
        name: mockMedicalServices.find((serviceItem) =>
          serviceItem.uuid === item.medicalServiceUuid)?.name ?? "Dịch vụ",
        price: item.price,
        description: item.description,
        status: item.status,
      })),
  };
}

function findAppointment(hospitalUuid: string, uuid: string) {
  if (!hospitalExists(hospitalUuid)) return undefined;
  return appointments.find((item) =>
    item.uuid === uuid && item.hospitalUuid === hospitalUuid && item.deletedAt.getTime() === 0);
}

function mockAccountsActive(hospitalUuid: string, accountUuid: string) {
  return mockAccounts.some((account) =>
    account.uuid === accountUuid &&
    account.hospitalUuid === hospitalUuid &&
    account.status === BaseStatus.Active &&
    account.deletedAt.getTime() === 0);
}

function sameSlot(left: Appointment, right: Appointment) {
  return left.appointmentDate.getTime() === right.appointmentDate.getTime() &&
    left.timeSlot === right.timeSlot;
}

function isActiveAppointment(status: AppointmentStatus) {
  return status === AppointmentStatus.Pending ||
    status === AppointmentStatus.Approved ||
    status === AppointmentStatus.CheckedIn;
}

function hospitalExists(uuid: string) {
  return mockHospitals.some((item) =>
    item.uuid === uuid && item.deletedAt.getTime() === 0);
}

function getHospitalUuid(url?: string) {
  return decodeURIComponent(url?.split("/")[2] ?? "");
}

function getRouteIds(url?: string, serviceRoute = false) {
  const parts = url?.split("/") ?? [];
  return [
    decodeURIComponent(parts[2] ?? ""),
    decodeURIComponent(parts[4] ?? ""),
    serviceRoute ? decodeURIComponent(parts[6] ?? "") : "",
  ];
}

function parsePayload(data: unknown): Payload {
  if (typeof data === "string") {
    try {
      const parsed: unknown = JSON.parse(data);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed as Payload
        : {};
    } catch {
      return {};
    }
  }
  return data && typeof data === "object" && !Array.isArray(data)
    ? data as Payload
    : {};
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function success(appointment: Appointment, message = "Updated successfully") {
  return [200, { message, data: toDto(appointment) }] as [number, unknown];
}

function badRequest(message: string, error?: string) {
  return [400, { message, ...(error ? { error } : {}) }] as [number, unknown];
}

function conflict(message: string, error: string) {
  return [409, { message, error }] as [number, unknown];
}

function notFound(message = "Hospital not found") {
  return [404, { message, error: "Resource does not exist" }] as [number, unknown];
}
