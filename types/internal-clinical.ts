export type ClinicalAppointmentStatus = "Approved" | "Pending" | "Unconfirmed" | "CheckedIn" | "Done" | "Cancelled";
export type ClinicalMedicalServiceStatus = "InProgress" | "Completed";
export type PrescriptionStatus = "Unpaid" | "Paid" | "Cancelled";

export interface ClinicalAppointment {
    uuid: string;
    patientName: string;
    gender: "Male" | "Female" | "Other";
    medicalCode: string;
    note?: string;
    appointmentAt: Date;
    typeLabel: string;
    roomName: string;
    status: ClinicalAppointmentStatus;
    doctorNote?: string;
}

export interface ClinicalMedicalService {
    uuid: string;
    appointmentUuid: string;
    medicalServiceUuid: string;
    name: string;
    price: number;
    description: string;
    status: ClinicalMedicalServiceStatus;
}

export interface ClinicalServiceOption {
    uuid: string;
    name: string;
    price: number;
}

export interface ClinicalMedicineOption {
    uuid: string;
    name: string;
    unit: string;
}

export interface PrescriptionDetail {
    uuid: string;
    medicineUuid: string;
    medicineName: string;
    unit: string;
    quantity: number;
    quantityPerDose: number;
    dosesPerDay: number;
    duration: number;
    note: string;
}

export interface Prescription {
    uuid: string;
    status: PrescriptionStatus;
    note?: string;
    details: PrescriptionDetail[];
}

export interface ClinicalCaseDetail extends ClinicalAppointment {
    medicalServices: ClinicalMedicalService[];
    availableMedicalServices: ClinicalServiceOption[];
    availableMedicines: ClinicalMedicineOption[];
    prescription?: Prescription | null;
}
