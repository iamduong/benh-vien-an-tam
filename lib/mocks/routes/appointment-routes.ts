import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockAppointments } from "@/data/mocks/appointments";
import { mockDoctors } from "@/data/mocks/doctors";
import { mockHospitalMedicalServices } from "@/data/mocks/hospital-medical-services";
import { mockHospitals } from "@/data/mocks/hospitals";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import { mockPatientProfiles } from "@/data/mocks/patient-profiles";
import { mockRooms } from "@/data/mocks/rooms";
import { mockTimeWorkings } from "@/data/mocks/time-workings";
import {
  createSlotTimes,
  formatWorkingTime,
  getVietnamDateTimeParts,
  getVietnamToday,
  intersectWorkingHours,
  isValidDateString,
  parseWorkingHours,
  toAppointmentIso,
  type ParsedWorkingHours,
} from "@/lib/booking/working-hours";
import { getStringParam } from "@/lib/mocks/query-utils";
import type {
  Appointment as AppointmentView,
  AppointmentPresentation,
  BookingType,
  CancelAppointmentRequest,
  CreateAppointmentRequest,
  CreateWalkInAppointmentRequest,
  RescheduleAppointmentRequest,
} from "@/types/appointments";
import {
  AppointmentStatus,
  AppointmentType,
  BaseStatus,
  Gender,
  ROLE_UUIDS,
  RoomStatus,
  type Appointment,
  type DoctorProfile,
  type Hospital,
  type MedicalService,
} from "@/types/models";

const rescheduledAppointmentUuids = new Set<string>();

function resolveWorkingSlot(appointmentAt: Date) {
  const parts = getVietnamDateTimeParts(appointmentAt);
  const dayOfWeek = new Date(`${parts.date}T12:00:00+07:00`).getDay();
  const slot = mockTimeWorkings.find(
    (working) => working.dayOfWeek === dayOfWeek && working.startTime <= parts.time && working.endTime >= parts.time,
  );

  return {
    appointmentDate: new Date(`${parts.date}T00:00:00+07:00`),
    timeSlot: slot?.uuid ?? mockTimeWorkings[0].uuid,
  };
}

type ResolvedBooking = {
  type: BookingType;
  hospital: Hospital;
  doctor?: DoctorProfile;
  medicalService?: MedicalService;
  WorkingHours: ParsedWorkingHours;
};

export function registerAppointmentRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/appointments/booking-context").reply(200, {
    data: getBookingContext(),
    message: "Lấy thông tin đặt lịch thành công.",
  });

  mock.onGet("/appointments").reply((config): [number, unknown] => {
    const accountUuid = getStringParam(config.params, "accountUuid");
    const authenticatedAccountUuid = getAuthenticatedAccountUuid(config.headers);
    if (!authenticatedAccountUuid || accountUuid !== authenticatedAccountUuid) {
      return unauthorizedResponse();
    }

    const status = getStringParam(config.params, "status");
    const type = getStringParam(config.params, "type");
    const from = getStringParam(config.params, "from");
    const to = getStringParam(config.params, "to");
    if (
      (status && !Object.values(AppointmentStatus).includes(status as AppointmentStatus)) ||
      (type && !isBookingType(type)) ||
      (from && !isValidDateString(from)) ||
      (to && !isValidDateString(to)) ||
      (from && to && from > to)
    ) {
      return [422, errorBody("INVALID_FILTER", "Bộ lọc lịch hẹn không hợp lệ.")];
    }

    const page = parsePositiveInteger(config.params?.page, 1);
    const pageSize = Math.min(parsePositiveInteger(config.params?.pageSize, 5), 20);
    const items = getAppointmentPresentations(accountUuid)
      .filter((item) => !status || item.appointment.status === status)
      .filter((item) => !type || item.type === type)
      .filter((item) => {
        const date = getVietnamDateTimeParts(item.appointment.appointmentAt).date;
        return (!from || date >= from) && (!to || date <= to);
      })
      .sort(
        (left, right) =>
          right.appointment.appointmentAt.getTime() -
          left.appointment.appointmentAt.getTime(),
      );
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
        message: "Lấy danh sách lịch hẹn thành công.",
      },
    ];
  });

  mock.onGet("/appointments/availability").reply((config): [number, unknown] => {
    const type = getStringParam(config.params, "type") as BookingType;
    const targetUuid = getStringParam(config.params, "targetUuid");
    const hospitalUuid = getStringParam(config.params, "hospitalUuid");
    const accountUuid = getStringParam(config.params, "accountUuid");
    const authenticatedAccountUuid = getAuthenticatedAccountUuid(config.headers);
    const date = getStringParam(config.params, "date");
    const resolved = resolveBooking(type, targetUuid, hospitalUuid);
    const patient = getPatientByAccountUuid(accountUuid);

    if (!resolved) return invalidBranchResponse();
    if (
      !authenticatedAccountUuid ||
      accountUuid !== authenticatedAccountUuid ||
      !patient
    ) {
      return unauthorizedResponse();
    }
    if (!isValidDateString(date) || date < getVietnamToday()) {
      return [422, errorBody("INVALID_DATE", "Ngày khám không hợp lệ.")];
    }

    const slots = createSlotTimes(date, resolved.WorkingHours).map((time) => {
      const appointmentAt = new Date(toAppointmentIso(date, time));
      return {
        appointmentAt: appointmentAt.toISOString(),
        time: time,
        isAvailable:
          appointmentAt.getTime() > Date.now() &&
          canBook(resolved, appointmentAt, patient.uuid),
      };
    });

    return [
      200,
      {
        data: {
          date: date,
          workingHour: formatWorkingTime(resolved.WorkingHours),
          slots: slots,
        },
        message: "Lấy thời gian khả dụng thành công.",
      },
    ];
  });

  mock
    .onPost(/^\/appointments\/(hospitals|doctors|medical-services)$/)
    .reply((config): [number, unknown] => {
      const path = config.url?.split("/").pop();
      const type: BookingType =
        path === "hospitals"
          ? "hospital"
          : path === "doctors"
            ? "doctor"
            : "medical-service";
      const request = {
        ...parseBody<Omit<CreateAppointmentRequest, "type">>(config.data),
        type: type,
      } as CreateAppointmentRequest;
      const authenticatedAccountUuid = getAuthenticatedAccountUuid(config.headers);
      if (
        !authenticatedAccountUuid ||
        request.accountUuid !== authenticatedAccountUuid
      ) {
        return unauthorizedResponse();
      }
      const targetUuid =
        request.type === "hospital"
          ? request.hospitalUuid
          : request.type === "doctor"
            ? request.doctorUuid
            : request.medicalServiceUuid;
      const resolved = resolveBooking(
        request.type,
        targetUuid,
        request.hospitalUuid,
      );
      if (!resolved) return invalidBranchResponse();

      const identityError = validatePatient(request);
      if (identityError) return identityError;
      const patient = getPatientByAccountUuid(request.accountUuid);
      if (!patient) return unauthorizedResponse();

      const appointmentAt = new Date(request.appointmentAt);
      if (
        Number.isNaN(appointmentAt.getTime()) ||
        appointmentAt.getTime() <= Date.now()
      ) {
        return [
          422,
          errorBody("INVALID_DATE", "Thời gian khám phải ở tương lai."),
        ];
      }

      const parts = getVietnamDateTimeParts(appointmentAt);
      if (
        !createSlotTimes(parts.date, resolved.WorkingHours).includes(parts.time)
      ) {
        return [
          422,
          errorBody(
            "OUTSIDE_WORKING_HOURS",
            "Thời gian nằm ngoài giờ làm việc.",
          ),
        ];
      }
      if (!canBook(resolved, appointmentAt, patient.uuid)) {
        return [
          409,
          errorBody(
            "SLOT_CONFLICT",
            "Thời gian này vừa không còn khả dụng. Vui lòng chọn thời gian khác.",
          ),
        ];
      }

      const now = new Date();
      const common = {
        uuid: crypto.randomUUID(),
        patientName: request.patientName.trim(),
        gender: request.gender as Gender,
        note: request.note.trim(),
        medicalCode: request.medicalCode,
        startTime: appointmentAt,
        ...resolveWorkingSlot(appointmentAt),
        status: AppointmentStatus.Pending,
        patientUuid: patient.uuid,
        hospitalUuid: resolved.hospital.uuid,
        roomUuid: null,
        doctorNote: "",
        totalPrice: resolved.doctor?.price ?? resolved.medicalService?.price ?? 0,
        isPaid: false,
        isWalkIn: false,
        guestPhone: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: new Date(0),
      };
      const appointment: Appointment =
        request.type === "doctor"
          ? {
              ...common,
              type: AppointmentType.Doctor,
              doctorUuid: request.doctorUuid,
              medicalServiceUuid: null,
            }
          : request.type === "medical-service"
            ? {
                ...common,
                type: AppointmentType.Service,
                doctorUuid: null,
                medicalServiceUuid: request.medicalServiceUuid,
              }
            : {
                ...common,
                type: AppointmentType.Hospital,
                doctorUuid: null,
                medicalServiceUuid: null,
              };
      mockAppointments.push(appointment);
      const appointmentView = toAppointmentView(appointment);
      return appointmentView
        ? createdResponse(appointmentView)
        : notFoundResponse();
    });

  mock
    .onGet(/^\/appointments\/[^/]+\/detail$/)
    .reply((config): [number, unknown] => {
      const uuid = decodeURIComponent(config.url?.split("/").at(-2) ?? "");
      const accountUuid = getStringParam(config.params, "accountUuid");
      const authenticatedAccountUuid = getAuthenticatedAccountUuid(config.headers);
      if (!authenticatedAccountUuid || accountUuid !== authenticatedAccountUuid) {
        return unauthorizedResponse();
      }
      const item = getAppointmentPresentation(uuid, accountUuid);
      return item
        ? [200, { data: item, message: "Lấy chi tiết lịch hẹn thành công." }]
        : notFoundResponse();
    });

  mock
    .onPost(/^\/appointments\/[^/]+\/reschedule$/)
    .reply((config): [number, unknown] => {
      const uuid = decodeURIComponent(config.url?.split("/").at(-2) ?? "");
      const request = parseBody<RescheduleAppointmentRequest>(config.data);
      const owned = getOwnedAppointment(config.headers, request.accountUuid, uuid);
      if (!owned) return unauthorizedResponse();
      const editableError = validateEditable(owned.appointment);
      if (editableError) return editableError;
      if (rescheduledAppointmentUuids.has(uuid)) {
        return [
          409,
          errorBody("RESCHEDULE_LIMIT", "Lịch hẹn này đã được đổi một lần."),
        ];
      }

      const appointmentAt = new Date(request.appointmentAt);
      if (
        Number.isNaN(appointmentAt.getTime()) ||
        appointmentAt.getTime() - Date.now() < 24 * 60 * 60 * 1000
      ) {
        return [
          422,
          errorBody("INVALID_DATE", "Thời gian mới phải cách hiện tại ít nhất 24 giờ."),
        ];
      }
      const resolved = resolveExistingBooking(owned);
      if (!resolved) return invalidBranchResponse();
      const parts = getVietnamDateTimeParts(appointmentAt);
      if (!createSlotTimes(parts.date, resolved.WorkingHours).includes(parts.time)) {
        return [
          422,
          errorBody("OUTSIDE_WORKING_HOURS", "Thời gian nằm ngoài giờ làm việc."),
        ];
      }
      if (!canBook(resolved, appointmentAt, owned.appointment.patientUuid, uuid)) {
        return [
          409,
          errorBody("SLOT_CONFLICT", "Thời gian này vừa không còn khả dụng."),
        ];
      }
      owned.appointment.startTime = appointmentAt;
      Object.assign(owned.appointment, resolveWorkingSlot(appointmentAt));
      owned.appointment.roomUuid = null;
      owned.appointment.updatedAt = new Date();
      rescheduledAppointmentUuids.add(uuid);
      return [
        200,
        {
          data: buildAppointmentPresentation(owned.type, owned.appointment),
          message: "Đổi lịch hẹn thành công.",
        },
      ];
    });

  mock
    .onPost(/^\/appointments\/[^/]+\/cancel$/)
    .reply((config): [number, unknown] => {
      const uuid = decodeURIComponent(config.url?.split("/").at(-2) ?? "");
      const request = parseBody<CancelAppointmentRequest>(config.data);
      const owned = getOwnedAppointment(config.headers, request.accountUuid, uuid);
      if (!owned) return unauthorizedResponse();
      const editableError = validateEditable(owned.appointment);
      if (editableError) return editableError;

      owned.appointment.status = AppointmentStatus.Cancelled;
      owned.appointment.updatedAt = new Date();
      return [
        200,
        {
          data: buildAppointmentPresentation(owned.type, owned.appointment),
          message: "Hủy lịch hẹn thành công.",
        },
      ];
    });

  mock.onGet(/^\/appointments\/[^/]+$/).reply((config): [number, unknown] => {
    const uuid = decodeURIComponent(config.url?.split("/").pop() ?? "");
    const accountUuid = getStringParam(config.params, "accountUuid");
    const authenticatedAccountUuid = getAuthenticatedAccountUuid(config.headers);
    if (!authenticatedAccountUuid || accountUuid !== authenticatedAccountUuid) {
      return unauthorizedResponse();
    }
    const presentation = getAppointmentPresentation(uuid, accountUuid);
    return presentation
      ? confirmationResponse(
          presentation.type,
          presentation.appointment,
          presentation.targetName,
          presentation.hospitalName,
        )
      : notFoundResponse();
  });

  // ==== Tiếp nhận & điều phối - Walk-in (khách vãng lai không cần tài khoản) ====
  //
  // STAFF đăng nhập → tạo lịch hẹn trực tiếp cho người đến quầy mà không yêu cầu
  // tài khoản PATIENT. Lịch này có IsWalkIn=true, PatientUuid=null,
  // GuestPhone là số điện thoại khách cung cấp.

  mock.onGet("/appointments/walk-in/availability").reply((config): [number, unknown] => {
    if (!getAuthenticatedStaffUuid(config.headers)) {
      return unauthorizedResponse();
    }
    const type = getStringParam(config.params, "type") as BookingType;
    const targetUuid = getStringParam(config.params, "targetUuid");
    const hospitalUuid = getStringParam(config.params, "hospitalUuid");
    const date = getStringParam(config.params, "date");
    const resolved = resolveBooking(type, targetUuid, hospitalUuid);
    if (!resolved) return invalidBranchResponse();
    if (!isValidDateString(date) || date < getVietnamToday()) {
      return [422, errorBody("INVALID_DATE", "Ngày khám không hợp lệ.")];
    }

    const slots = createSlotTimes(date, resolved.WorkingHours).map((time) => {
      const appointmentAt = new Date(toAppointmentIso(date, time));
      return {
        appointmentAt: appointmentAt.toISOString(),
        time: time,
        isAvailable:
          appointmentAt.getTime() > Date.now() &&
          hasHospitalCapacity(resolved.hospital.uuid, appointmentAt.getTime()),
      };
    });

    return [
      200,
      {
        data: {
          date: date,
          workingHour: formatWorkingTime(resolved.WorkingHours),
          slots: slots,
        },
        message: "Lấy thời gian khả dụng cho khách vãng lai thành công.",
      },
    ];
  });

  mock.onPost("/appointments/walk-in").reply((config): [number, unknown] => {
    if (!getAuthenticatedStaffUuid(config.headers)) {
      return unauthorizedResponse();
    }
    const request = parseBody<CreateWalkInAppointmentRequest>(config.data);
    const guestError = validateWalkInGuest(request);
    if (guestError) return guestError;

    const targetUuid =
      request.type === "hospital"
        ? request.hospitalUuid
        : request.type === "doctor"
          ? request.doctorUuid
          : request.medicalServiceUuid;
    const resolved = resolveBooking(
      request.type,
      targetUuid,
      request.hospitalUuid,
    );
    if (!resolved) return invalidBranchResponse();

    const appointmentAt = new Date(request.appointmentAt);
    if (
      Number.isNaN(appointmentAt.getTime()) ||
      appointmentAt.getTime() <= Date.now()
    ) {
      return [
        422,
        errorBody("INVALID_DATE", "Thời gian khám phải ở tương lai."),
      ];
    }

    const parts = getVietnamDateTimeParts(appointmentAt);
    if (
      !createSlotTimes(parts.date, resolved.WorkingHours).includes(parts.time)
    ) {
      return [
        422,
        errorBody("OUTSIDE_WORKING_HOURS", "Thời gian nằm ngoài giờ làm việc."),
      ];
    }
    if (!hasHospitalCapacity(resolved.hospital.uuid, appointmentAt.getTime())) {
      return [
        409,
        errorBody(
          "SLOT_CONFLICT",
          "Thời gian này vừa không còn khả dụng. Vui lòng chọn thời gian khác.",
        ),
      ];
    }

    const now = new Date();
    const common = {
      uuid: crypto.randomUUID(),
      patientName: request.patientName.trim(),
      gender: request.gender as Gender,
      note: request.note.trim(),
      medicalCode: request.medicalCode,
      startTime: appointmentAt,
      ...resolveWorkingSlot(appointmentAt),
      status: AppointmentStatus.Pending,
      patientUuid: null, // walk-in: không gắn với tài khoản người bệnh
      hospitalUuid: resolved.hospital.uuid,
      roomUuid: null,
      doctorNote: "",
      totalPrice: resolved.doctor?.price ?? resolved.medicalService?.price ?? 0,
      isPaid: false,
      isWalkIn: true,
      guestPhone: request.phone.replace(/[\s.-]/g, ""),
      createdAt: now,
      updatedAt: now,
      deletedAt: new Date(0),
    };
    const appointment: Appointment =
      request.type === "doctor"
        ? {
            ...common,
            type: AppointmentType.Doctor,
            doctorUuid: request.doctorUuid,
            medicalServiceUuid: null,
          }
        : request.type === "medical-service"
          ? {
              ...common,
              type: AppointmentType.Service,
              doctorUuid: null,
              medicalServiceUuid: request.medicalServiceUuid,
            }
          : {
              ...common,
              type: AppointmentType.Hospital,
              doctorUuid: null,
              medicalServiceUuid: null,
            };
    mockAppointments.push(appointment);
    const appointmentView = toAppointmentView(appointment);
    return appointmentView
      ? createdResponse(appointmentView)
      : notFoundResponse();
  });
}

type OwnedAppointment = { type: BookingType; appointment: Appointment };

function getOwnedAppointment(
  headers: unknown,
  accountUuid: string,
  uuid: string,
): OwnedAppointment | null {
  const authenticatedAccountUuid = getAuthenticatedAccountUuid(headers);
  if (!authenticatedAccountUuid || authenticatedAccountUuid !== accountUuid) {
    return null;
  }
  const found = findAppointment(uuid);
  const patient = getPatientByAccountUuid(accountUuid);
  return found?.appointment.patientUuid === patient?.uuid ? found : null;
}

function findAppointment(uuid: string): OwnedAppointment | null {
  const appointment = mockAppointments.find(
    (item) => item.uuid === uuid && item.deletedAt.getTime() === 0,
  );
  return appointment
    ? { type: toBookingType(appointment.type), appointment: appointment }
    : null;
}

function getAppointmentPresentations(accountUuid: string) {
  const patient = getPatientByAccountUuid(accountUuid);
  if (!patient) return [];
  return mockAppointments
    .filter(
      (item) =>
        item.patientUuid === patient.uuid && item.deletedAt.getTime() === 0,
    )
    .map((item) => {
      const found = findAppointment(item.uuid);
      return found
        ? buildAppointmentPresentation(found.type, found.appointment)
        : null;
    })
    .filter((item): item is AppointmentPresentation => Boolean(item));
}

function getAppointmentPresentation(uuid: string, accountUuid: string) {
  const found = findAppointment(uuid);
  const patient = getPatientByAccountUuid(accountUuid);
  if (!found || found.appointment.patientUuid !== patient?.uuid) return null;
  return buildAppointmentPresentation(found.type, found.appointment);
}

function buildAppointmentPresentation(
  type: BookingType,
  appointment: Appointment,
): AppointmentPresentation | null {
  const hospital = mockHospitals.find((item) => item.uuid === appointment.hospitalUuid);
  const room = mockRooms.find((item) => item.uuid === appointment.roomUuid);
  if (!hospital) return null;
  const appointmentView = toAppointmentView(appointment);
  if (!appointmentView) return null;

  if (type === "doctor" && appointment.doctorUuid) {
    const doctor = mockDoctors.find((item) => item.uuid === appointment.doctorUuid);
    if (!doctor) return null;
    return {
      type: type,
      appointment: appointmentView,
      targetName: doctor.name,
      hospitalName: hospital.name,
      hospitalSlug: hospital.slug,
      targetSlug: doctor.slug,
      roomName: room?.name ?? "",
    };
  }
  if (type === "medical-service" && appointment.medicalServiceUuid) {
    const service = mockMedicalServices.find(
      (item) => item.uuid === appointment.medicalServiceUuid,
    );
    if (!service) return null;
    return {
      type: type,
      appointment: appointmentView,
      targetName: service.name,
      hospitalName: hospital.name,
      hospitalSlug: hospital.slug,
      targetSlug: service.slug,
      roomName: room?.name ?? "",
    };
  }
  return {
    type: "hospital",
    appointment: appointmentView,
    targetName: hospital.name,
    hospitalName: hospital.name,
    hospitalSlug: hospital.slug,
    targetSlug: hospital.slug,
    roomName: room?.name ?? "",
  };
}

function validateEditable(appointment: Appointment): [number, unknown] | null {
  if (
    appointment.status !== AppointmentStatus.Pending &&
    appointment.status !== AppointmentStatus.Approved
  ) {
    return [409, errorBody("TERMINAL_STATUS", "Trạng thái lịch hẹn không cho phép thao tác này.")];
  }
  if (appointment.startTime.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
    return [409, errorBody("CHANGE_DEADLINE", "Chỉ có thể thao tác trước giờ khám ít nhất 24 giờ.")];
  }
  return null;
}

function resolveExistingBooking(owned: OwnedAppointment) {
  const { appointment: appointment, type: type } = owned;
  const targetUuid =
    type === "doctor" && appointment.doctorUuid
      ? appointment.doctorUuid
      : type === "medical-service" && appointment.medicalServiceUuid
        ? appointment.medicalServiceUuid
        : appointment.hospitalUuid;
  return resolveBooking(type, targetUuid, appointment.hospitalUuid);
}

function getBookingContext() {
  const hospitals = mockHospitals.filter(
    (item) => item.status === BaseStatus.Active,
  );
  const hospitalUuids = new Set(hospitals.map((item) => item.uuid));
  const doctors = mockDoctors.filter(
    (doctor) => hospitalUuids.has(doctor.hospitalUuid) && Boolean(findPublicDoctor(doctor.uuid)),
  );
  const services = mockMedicalServices.filter(
    (item) => item.status === BaseStatus.Active,
  );
  const serviceUuids = new Set(services.map((item) => item.uuid));

  return {
    hospitals: hospitals,
    doctors: doctors,
    medicalServices: services,
    hospitalMedicalServices: mockHospitalMedicalServices.filter(
      (relation) =>
        hospitalUuids.has(relation.hospitalUuid) &&
        serviceUuids.has(relation.medicalServiceUuid),
    ),
  };
}

function resolveBooking(
  type: BookingType,
  targetUuid: string,
  hospitalUuid: string,
): ResolvedBooking | null {
  const hospital = findPublicHospital(hospitalUuid);
  if (!hospital) return null;
  const hospitalHours = parseWorkingHours(hospital.workingHour);
  if (!hospitalHours) return null;

  if (type === "hospital" && targetUuid === hospital.uuid) {
    return { type: type, hospital: hospital, WorkingHours: hospitalHours };
  }
  if (type === "doctor") {
    const doctor = findPublicDoctor(targetUuid);
    if (!doctor || doctor.hospitalUuid !== hospital.uuid) return null;
    return {
      type: type,
      hospital: hospital,
      doctor: doctor,
      WorkingHours: hospitalHours,
    };
  }
  if (type === "medical-service") {
    const service = mockMedicalServices.find(
      (item) => item.uuid === targetUuid && item.status === BaseStatus.Active,
    );
    const relation = mockHospitalMedicalServices.some(
      (item) =>
        item.medicalServiceUuid === targetUuid &&
        item.hospitalUuid === hospital.uuid,
    );
    const serviceHours = service
      ? parseWorkingHours(service.workingHour)
      : null;
    const workingHours = serviceHours
      ? intersectWorkingHours(hospitalHours, serviceHours)
      : null;
    if (!service || !relation || !workingHours) return null;
    return {
      type: type,
      hospital: hospital,
      medicalService: service,
      WorkingHours: workingHours,
    };
  }
  return null;
}

function findPublicHospital(uuid: string) {
  return mockHospitals.find(
    (item) => item.uuid === uuid && item.status === BaseStatus.Active,
  );
}

function findPublicDoctor(uuid: string) {
  const doctor = mockDoctors.find((item) => item.uuid === uuid);
  const account = mockAccounts.find((item) => item.uuid === doctor?.accountUuid);
  const hospital = doctor ? findPublicHospital(doctor.hospitalUuid) : undefined;
  return account?.status === BaseStatus.Active &&
    account.roleUuid === ROLE_UUIDS.DOCTOR &&
    hospital
    ? doctor
    : undefined;
}

function validateWalkInGuest(
  request: CreateWalkInAppointmentRequest,
): [number, unknown] | null {
  if (
    typeof request.patientName !== "string" ||
    typeof request.gender !== "string" ||
    typeof request.phone !== "string" ||
    typeof request.birthdate !== "string" ||
    typeof request.medicalCode !== "string" ||
    typeof request.note !== "string" ||
    typeof request.hospitalUuid !== "string" ||
    typeof request.appointmentAt !== "string"
  ) {
    return [
      422,
      errorBody("INVALID_REQUEST", "Thông tin khách vãng lai không hợp lệ."),
    ];
  }
  if (request.type === "doctor" && typeof request.doctorUuid !== "string") {
    return [422, errorBody("INVALID_REQUEST", "Thiếu thông tin bác sĩ.")];
  }
  if (
    request.type === "medical-service" &&
    typeof request.medicalServiceUuid !== "string"
  ) {
    return [422, errorBody("INVALID_REQUEST", "Thiếu thông tin dịch vụ.")];
  }
  if (
    request.patientName.trim().length === 0 ||
    request.patientName.trim().length > 100
  ) {
    return [
      422,
      errorBody("INVALID_PATIENT_INFO", "Tên khách vãng lai không hợp lệ."),
    ];
  }
  if (!Object.values(Gender).includes(request.gender as Gender)) {
    return [422, errorBody("INVALID_PATIENT_INFO", "Giới tính không hợp lệ.")];
  }
  const phone = request.phone.replace(/[\s.-]/g, "");
  if (!/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
    return [
      422,
      errorBody("INVALID_PATIENT_INFO", "Số điện thoại không hợp lệ."),
    ];
  }
  if (!isValidDateString(request.birthdate)) {
    return [
      422,
      errorBody("INVALID_PATIENT_INFO", "Ngày sinh không hợp lệ."),
    ];
  }
  const birth = new Date(`${request.birthdate}T00:00:00+07:00`);
  if (birth.getTime() > Date.now()) {
    return [
      422,
      errorBody("INVALID_PATIENT_INFO", "Ngày sinh không hợp lệ."),
    ];
  }
  if (
    request.medicalCode.trim().length === 0 ||
    request.medicalCode.trim().length > 50
  ) {
    return [422, errorBody("INVALID_PATIENT_INFO", "Mã khám không hợp lệ.")];
  }
  if (request.note.trim().length > 500) {
    return [422, errorBody("INVALID_NOTE", "Ghi chú tối đa 500 ký tự.")];
  }
  return null;
}

function validatePatient(
  request: CreateAppointmentRequest,
): [number, unknown] | null {
  if (
    typeof request.patientName !== "string" ||
    typeof request.gender !== "string" ||
    typeof request.note !== "string" ||
    typeof request.medicalCode !== "string" ||
    typeof request.accountUuid !== "string"
  ) {
    return [
      422,
      errorBody("INVALID_REQUEST", "Thông tin lịch hẹn không hợp lệ."),
    ];
  }
  const account = mockAccounts.find(
    (item) =>
      item.uuid === request.accountUuid &&
      item.roleUuid === ROLE_UUIDS.PATIENT &&
      item.status === BaseStatus.Active,
  );
  const profile = mockPatientProfiles.find(
    (item) => item.accountUuid === account?.uuid,
  );
  if (!account || !profile) {
    return [
      403,
      errorBody("INVALID_PATIENT", "Hồ sơ người khám không hợp lệ."),
    ];
  }
  if (
    request.patientName.trim().length === 0 ||
    request.patientName.trim().length > 100 ||
    !Object.values(Gender).includes(request.gender as Gender) ||
    request.medicalCode.trim().length === 0 ||
    request.medicalCode.trim().length > 50
  ) {
    return [
      422,
      errorBody("INVALID_PATIENT_INFO", "Thông tin người khám không hợp lệ."),
    ];
  }
  if (request.note.trim().length > 500) {
    return [422, errorBody("INVALID_NOTE", "Ghi chú tối đa 500 ký tự.")];
  }
  return null;
}

function canBook(
  resolved: ResolvedBooking,
  appointmentAt: Date,
  patientUuid: string | null,
  excludeUuid?: string,
) {
  const timestamp = appointmentAt.getTime();
  if (hasPatientConflict(patientUuid, timestamp, excludeUuid)) return false;
  if (
    resolved.doctor &&
    mockAppointments.some(
      (item) =>
        item.doctorUuid === resolved.doctor?.uuid &&
        item.startTime.getTime() === timestamp &&
        isBlockingAppointment(item, excludeUuid),
    )
  ) {
    return false;
  }
  return hasHospitalCapacity(resolved.hospital.uuid, timestamp, excludeUuid);
}

function hasHospitalCapacity(
  hospitalUuid: string,
  timestamp: number,
  excludeUuid?: string,
) {
  const numberOfRooms = mockRooms.filter(
    (room) =>
      room.hospitalUuid === hospitalUuid &&
      room.status === RoomStatus.Available,
  ).length;
  const numberOfAppointments = mockAppointments.filter(
    (item) =>
      item.hospitalUuid === hospitalUuid &&
      item.startTime.getTime() === timestamp &&
      isBlockingAppointment(item, excludeUuid),
  ).length;
  return numberOfAppointments < numberOfRooms;
}

function hasPatientConflict(patientUuid: string | null, timestamp: number, excludeUuid?: string) {
  if (!patientUuid) return false;
  return mockAppointments.some(
    (item) =>
      item.patientUuid === patientUuid &&
      item.startTime.getTime() === timestamp &&
      isBlockingAppointment(item, excludeUuid),
  );
}

function isBlockingAppointment(appointment: Appointment, excludeUuid?: string) {
  return (
    appointment.uuid !== excludeUuid &&
    appointment.deletedAt.getTime() === 0 &&
    appointment.status !== AppointmentStatus.Cancelled &&
    appointment.status !== AppointmentStatus.Unconfirmed
  );
}

function toAppointmentView(appointment: Appointment): AppointmentView | null {
  const patient = appointment.patientUuid
    ? mockPatientProfiles.find((item) => item.uuid === appointment.patientUuid)
    : null;
  const common = {
    uuid: appointment.uuid,
    patientName: appointment.patientName,
    gender: appointment.gender,
    note: appointment.note,
    medicalCode: appointment.medicalCode,
    appointmentAt: appointment.startTime,
    status: appointment.status,
    accountUuid: patient?.accountUuid ?? "",
    hospitalUuid: appointment.hospitalUuid,
    roomUuid: appointment.roomUuid ?? "",
    isWalkIn: appointment.isWalkIn,
    guestPhone: appointment.guestPhone,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
  if (appointment.type === AppointmentType.Doctor && appointment.doctorUuid) {
    return { ...common, doctorUuid: appointment.doctorUuid };
  }
  if (
    appointment.type === AppointmentType.Service &&
    appointment.medicalServiceUuid
  ) {
    return { ...common, medicalServiceUuid: appointment.medicalServiceUuid };
  }
  return common;
}

function toBookingType(type: AppointmentType): BookingType {
  if (type === AppointmentType.Doctor) return "doctor";
  if (type === AppointmentType.Service) return "medical-service";
  return "hospital";
}

function getPatientByAccountUuid(accountUuid: string) {
  return mockPatientProfiles.find((item) => item.accountUuid === accountUuid);
}

function parseBody<T>(data: unknown): T {
  return typeof data === "string" ? (JSON.parse(data) as T) : (data as T);
}

function parsePositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isBookingType(value: string): value is BookingType {
  return value === "hospital" || value === "doctor" || value === "medical-service";
}

function createdResponse(appointment: object): [number, unknown] {
  return [
    201,
    { data: appointment, message: "Gửi yêu cầu đặt lịch thành công." },
  ];
}

function confirmationResponse(
  type: BookingType,
  appointment: object,
  targetName: string,
  hospitalName: string,
): [number, unknown] {
  return [
    200,
    {
      data: {
        type: type,
        appointment: appointment,
        targetName: targetName,
        hospitalName: hospitalName,
      },
      message: "Lấy xác nhận lịch hẹn thành công.",
    },
  ];
}

function errorBody(code: string, message: string) {
  return { code: code, message: message };
}

function invalidBranchResponse(): [number, unknown] {
  return [
    422,
    errorBody("INVALID_BOOKING_CONTEXT", "Đối tượng hoặc cơ sở không hợp lệ."),
  ];
}

function notFoundResponse(): [number, unknown] {
  return [404, errorBody("NOT_FOUND", "Không tìm thấy lịch hẹn.")];
}

function unauthorizedResponse(): [number, unknown] {
  return [403, errorBody("UNAUTHORIZED", "Phiên đăng nhập không hợp lệ.")];
}

function getAuthenticatedAccountUuid(headers: unknown) {
  if (!headers || typeof headers !== "object") return "";
  const get = (headers as { get?: (name: string) => unknown }).get;
  const value =
    typeof get === "function"
      ? get.call(headers, "X-Mock-Account-Uuid")
      : (headers as Record<string, unknown>)["X-Mock-Account-Uuid"];
  if (typeof value !== "string") return "";
  const account = mockAccounts.find(
    (item) =>
      item.uuid === value &&
      item.roleUuid === ROLE_UUIDS.PATIENT &&
      item.status === BaseStatus.Active,
  );
  const profile = mockPatientProfiles.find(
    (item) => item.accountUuid === account?.uuid,
  );
  return account && profile ? account.uuid : "";
}

function getAuthenticatedStaffUuid(headers: unknown) {
  if (!headers || typeof headers !== "object") return "";
  const get = (headers as { get?: (name: string) => unknown }).get;
  const value =
    typeof get === "function"
      ? get.call(headers, "X-Mock-Account-Uuid")
      : (headers as Record<string, unknown>)["X-Mock-Account-Uuid"];
  if (typeof value !== "string") return "";
  const account = mockAccounts.find(
    (item) =>
      item.uuid === value &&
      item.roleUuid === ROLE_UUIDS.STAFF &&
      item.status === BaseStatus.Active,
  );
  return account ? account.uuid : "";
}
