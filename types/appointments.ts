import type {
  AppointmentStatus,
  DoctorProfile,
  Gender,
  Hospital,
  HospitalMedicalService,
  MedicalService,
} from "@/types/models";
import type { PaginatedData } from "@/lib/http/response";

export type BookingType = "hospital" | "doctor" | "medical-service";

export type BookingContext = {
  hospitals: Hospital[];
  doctors: DoctorProfile[];
  medicalServices: MedicalService[];
  hospitalMedicalServices: HospitalMedicalService[];
};

export type AvailabilitySlot = {
  appointmentAt: string;
  time: string;
  isAvailable: boolean;
};

export type Availability = {
  date: string;
  workingHour: string;
  slots: AvailabilitySlot[];
};

export type CommonAppointmentRequest = {
  patientName: string;
  gender: string;
  note: string;
  medicalCode: string;
  appointmentAt: string;
  accountUuid: string;
  hospitalUuid: string;
};

export type HospitalBookingRequest = CommonAppointmentRequest & {
  type: "hospital";
};

export type DoctorBookingRequest = CommonAppointmentRequest & {
  type: "doctor";
  doctorUuid: string;
};

export type MedicalServiceBookingRequest = CommonAppointmentRequest & {
  type: "medical-service";
  medicalServiceUuid: string;
};

export type CreateAppointmentRequest =
  | HospitalBookingRequest
  | DoctorBookingRequest
  | MedicalServiceBookingRequest;

export type WalkInAppointmentRequest = {
  type: BookingType;
  hospitalUuid: string;
  targetUuid: string;
  patientName: string;
  gender: string;
  phone: string;
  birthdate: string;
  medicalCode: string;
  note: string;
  appointmentAt: string;
};

export type WalkInHospitalBookingRequest = Omit<
  WalkInAppointmentRequest,
  "type" | "targetUuid"
>;

export type WalkInDoctorBookingRequest = WalkInAppointmentRequest & {
  type: "doctor";
  doctorUuid: string;
};

export type WalkInMedicalServiceBookingRequest = WalkInAppointmentRequest & {
  type: "medical-service";
  medicalServiceUuid: string;
};

export type CreateWalkInAppointmentRequest =
  | (WalkInAppointmentRequest & { type: "hospital" })
  | WalkInDoctorBookingRequest
  | WalkInMedicalServiceBookingRequest;

type AppointmentViewBase = {
  uuid: string;
  patientName: string;
  gender: Gender;
  note: string;
  medicalCode: string;
  appointmentAt: Date;
  status: AppointmentStatus;
  accountUuid: string;
  hospitalUuid: string;
  roomUuid: string;
  isWalkIn: boolean;
  guestPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Appointment =
  | AppointmentViewBase
  | (AppointmentViewBase & { doctorUuid: string })
  | (AppointmentViewBase & { medicalServiceUuid: string });

export type AppointmentConfirmation = {
  type: BookingType;
  appointment: Appointment;
  targetName: string;
  hospitalName: string;
};

export type AppointmentPresentation = AppointmentConfirmation & {
  hospitalSlug: string;
  targetSlug: string;
  roomName: string;
};

export type AppointmentListQuery = {
  accountUuid: string;
  status?: AppointmentStatus;
  type?: BookingType;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type AppointmentList = PaginatedData<AppointmentPresentation>;

export type RescheduleAppointmentRequest = {
  accountUuid: string;
  appointmentAt: string;
};

export type CancelAppointmentRequest = {
  accountUuid: string;
};

export type AppointmentErrorResponse = {
  message?: string;
  code?: string;
};
