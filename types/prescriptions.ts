import type { PaginatedData } from "@/lib/http/response";
import type {
  DoctorProfile,
  Hospital,
  Medicine,
  Prescription,
  PrescriptionDetail,
  PrescriptionStatus,
} from "@/types/models";

export type PrescriptionAppointmentType =
  | "hospital"
  | "doctor"
  | "medical-service";

export type LinkedPrescriptionAppointment = {
  uuid: string;
  type: PrescriptionAppointmentType;
};

export type PrescriptionSummary = {
  prescription: Prescription;
  hospital: Pick<Hospital, "uuid" | "name" | "slug">;
  doctor: Pick<DoctorProfile, "uuid" | "name" | "slug">;
  appointment: LinkedPrescriptionAppointment | null;
  totalAmount: number | null;
  numberOfItems: number;
};

export type PrescriptionMedicineDetail = {
  detail: PrescriptionDetail;
  medicine: Medicine;
};

export type PrescriptionView = PrescriptionSummary & {
  details: PrescriptionMedicineDetail[];
};

export type PrescriptionListQuery = {
  status?: PrescriptionStatus;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type PrescriptionList = PaginatedData<PrescriptionSummary>;

export type PrescriptionErrorResponse = {
  message?: string;
};
