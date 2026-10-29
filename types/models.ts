export type Guid = string;

export const ROLE_UUIDS = {
  SYSTEM_ADMIN: "10000000-0000-4000-8000-000000000001",
  HOSPITAL_ADMIN: "10000000-0000-4000-8000-000000000002",
  DOCTOR: "10000000-0000-4000-8000-000000000003",
  STAFF: "10000000-0000-4000-8000-000000000004",
  WAREHOUSE_MANAGER: "10000000-0000-4000-8000-000000000005",
  PATIENT: "10000000-0000-4000-8000-000000000006",
} as const;

export enum BaseStatus {
  Active = "Active",
  InActive = "InActive",
}

export enum Gender {
  Other = "Other",
  Male = "Male",
  Female = "Female",
}

export type Account = {
  uuid: Guid;
  phone: string;
  password: string;
  roleUuid: Guid;
  status: BaseStatus;
  hospitalUuid: Guid | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type PatientProfile = {
  uuid: Guid;
  avatar: string;
  name: string;
  gender: Gender;
  birthdate: Date;
  medicalCode: string;
  email: string;
  accountUuid: Guid;
};

export type Hospital = {
  uuid: Guid;
  image: string;
  lImage: string;
  mapUrl: string;
  slug: string;
  name: string;
  address: string;
  numberOfRoom: number;
  description: string;
  detailService: string;
  workingHour: string;
  status: BaseStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export enum RoomStatus {
  Available = "Available",
  Occupied = "Occupied",
  Maintenance = "Maintenance",
}

export type Room = {
  uuid: Guid;
  name: string;
  status: RoomStatus;
  hospitalUuid: Guid;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type DoctorProfile = {
  uuid: Guid;
  avatar: string;
  slug: string;
  name: string;
  price: number;
  departmentDisplay: string;
  introduction: string;
  expertise: string;
  specialty: string;
  workplace: string;
  isFeatured: boolean;
  accountUuid: Guid;
  hospitalUuid: Guid;
};

export type DoctorDepartment = {
  uuid: Guid;
  doctorUuid: Guid;
  departmentUuid: Guid;
};

export type Department = {
  uuid: Guid;
  icon: string;
  slug: string;
  name: string;
  description: string;
  status: BaseStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type HospitalDepartment = {
  uuid: Guid;
  hospitalUuid: Guid;
  departmentUuid: Guid;
};

export type MedicalService = {
  uuid: Guid;
  image: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  detailService: string;
  workingHour: string;
  status: BaseStatus;
  isInsured: boolean;
  insuranceCap: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type HospitalMedicalService = {
  uuid: Guid;
  hospitalUuid: Guid;
  medicalServiceUuid: Guid;
};

export type HospitalAssignmentSelection = {
  departmentUuids: Guid[];
  medicalServiceUuids: Guid[];
};

export type ReviewHospital = {
  uuid: Guid;
  content: string;
  numberOfStar: number;
  patientUuid: Guid;
  hospitalUuid: Guid;
  status: BaseStatus;
  isViewed: boolean;
  createdAt: Date;
};

export type ReviewDoctor = {
  uuid: Guid;
  content: string;
  numberOfStar: number;
  patientUuid: Guid;
  doctorUuid: Guid;
  status: BaseStatus;
  isViewed: boolean;
  createdAt: Date;
};

export type ReviewMedicalService = {
  uuid: Guid;
  content: string;
  numberOfStar: number;
  patientUuid: Guid;
  medicalServiceUuid: Guid;
  status: BaseStatus;
  isViewed: boolean;
  createdAt: Date;
};

export enum MedicineUnit {
  Other = "Other",
  Tablet = "Tablet",
  Bottle = "Bottle",
  Box = "Box",
  Tube = "Tube",
  Sachet = "Sachet",
}

export type Medicine = {
  uuid: Guid;
  image: string;
  name: string;
  description: string;
  price: number;
  unit: MedicineUnit;
  status: BaseStatus;
  isInsured: boolean;
  insuranceCap: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type MedicineInventory = {
  uuid: Guid;
  hospitalUuid: Guid;
  medicineUuid: Guid;
  quantity: number;
  minimumQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export enum ProviderStatus {
  Active = "Active",
  InActive = "InActive",
}

export type Provider = {
  uuid: Guid;
  name: string;
  address: string;
  hotline: string;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export enum ImportTicketStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
}

export type ImportTicket = {
  uuid: Guid;
  hospitalUuid: Guid;
  accountUuid: Guid;
  providerUuid: Guid;
  note: string;
  status: ImportTicketStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type ImportTicketDetail = {
  uuid: Guid;
  importTicketUuid: Guid;
  medicineUuid: Guid;
  quantity: number;
  price: number;
};

export enum ExportTicketStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
}

export type ExportTicket = {
  uuid: Guid;
  hospitalUuid: Guid;
  accountUuid: Guid;
  note: string;
  status: ExportTicketStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type ExportTicketDetail = {
  uuid: Guid;
  exportTicketUuid: Guid;
  medicineUuid: Guid;
  quantity: number;
  price: number;
};

export enum PrescriptionStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
  Cancelled = "Cancelled",
}

export type Prescription = {
  uuid: Guid;
  patientProfileUuid: Guid;
  doctorProfileUuid: Guid;
  hospitalUuid: Guid;
  status: PrescriptionStatus;
  note: string;
  appointmentUuid: Guid | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type PrescriptionDetail = {
  uuid: Guid;
  prescriptionUuid: Guid;
  medicineUuid: Guid;
  quantity: number;
  quantityPerDose: number;
  dosesPerDay: number;
  duration: number;
  price: number;
  isExternal: boolean;
  note: string;
};

export enum AppointmentStatus {
  Pending = "Pending",
  Approved = "Approved",
  Unconfirmed = "Unconfirmed",
  CheckedIn = "CheckedIn",
  Done = "Done",
  Cancelled = "Cancelled",
}

export enum AppointmentType {
  Doctor = "Doctor",
  Hospital = "Hospital",
  Service = "Service",
}

type AppointmentBase = {
  uuid: Guid;
  patientName: string;
  gender: Gender;
  medicalCode: string;
  note: string;
  startTime: Date;
  appointmentDate: Date;
  timeSlot: Guid;
  status: AppointmentStatus;
  patientUuid: Guid | null;
  hospitalUuid: Guid;
  roomUuid: Guid | null;
  doctorNote: string;
  totalPrice: number;
  isPaid: boolean;
  isWalkIn: boolean;
  guestPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type Appointment =
  | (AppointmentBase & {
      type: AppointmentType.Hospital;
      doctorUuid: null;
      medicalServiceUuid: null;
    })
  | (AppointmentBase & {
      type: AppointmentType.Doctor;
      doctorUuid: Guid;
      medicalServiceUuid: null;
    })
  | (AppointmentBase & {
      type: AppointmentType.Service;
      doctorUuid: null;
      medicalServiceUuid: Guid;
    });

export type AppointmentMedicalService = {
  uuid: Guid;
  appointmentUuid: Guid;
  medicalServiceUuid: Guid;
  price: number;
  description: string;
  status: AppointmentMedicalServiceStatus;
};

export enum AppointmentMedicalServiceStatus {
  InProgress = "InProgress",
  Completed = "Completed",
}

export enum PermissionAction {
  Read = "Read",
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
}

export enum AccessScope {
  System = "System",
  Hospital = "Hospital",
}

export type TimeWorking = {
  uuid: Guid;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: BaseStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type DoctorWorking = { uuid: Guid; doctorUuid: Guid; workingUuid: Guid };
export type HospitalWorking = { uuid: Guid; hospitalUuid: Guid; workingUuid: Guid };
export type ServiceWorking = { uuid: Guid; serviceUuid: Guid; workingUuid: Guid };

export type Role = {
  uuid: Guid;
  name: string;
  description: string;
  isDoctor: boolean;
  scope: AccessScope;
  status: BaseStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type Permission = {
  uuid: Guid;
  slug: string;
  icon: string;
  name: string;
  description: string;
  scope: AccessScope;
};

export type RolePermission = {
  uuid: Guid;
  roleUuid: Guid;
  permissionUuid: Guid;
  action: PermissionAction;
};
