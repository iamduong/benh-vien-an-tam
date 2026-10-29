import type {
  AccessScope,
  Account,
  BaseStatus,
  Gender,
  PatientProfile,
} from "@/types/models";

export type PublicAccount = Omit<Account, "password">;

export type AuthSession = {
  account: PublicAccount;
  patientProfile: PatientProfile;
};

export type AuthApiAccount = {
  uuid: string;
  phone: string;
  roleUuid: string | null;
  status: BaseStatus;
  hospitalUuid: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AuthApiPatientProfile = {
  type: "patient";
  uuid: string;
  accountUuid: string;
  avatar: string;
  name: string;
  gender: Gender;
  birthdate: string;
  medicalCode: string;
  email: string;
};

export type AuthApiDoctorProfile = {
  type: "doctor";
  uuid: string;
  accountUuid: string;
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
  hospitalUuid: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type AuthApiStaffProfile = {
  type: "staff";
  accountUuid: string;
};

export type AuthApiRole = {
  uuid: string;
  name: string;
  isDoctor: boolean;
  scope: AccessScope;
};

export type AuthApiSession = {
  account: AuthApiAccount;
  profile: AuthApiPatientProfile | AuthApiDoctorProfile | AuthApiStaffProfile;
  role: AuthApiRole | null;
};

export type ManagementAuthSession = AuthApiSession & { role: AuthApiRole };

export type AuthLoginResult =
  | { type: "patient"; session: AuthSession; apiSession: AuthApiSession }
  | { type: "management"; session: ManagementAuthSession };

export type LoginRequest = Pick<Account, "phone" | "password">;

export type RegisterPatientRequest = {
  name: string;
  gender: Gender;
  birthdate: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type AuthField =
  | "phone"
  | "password"
  | "name"
  | "gender"
  | "birthdate"
  | "email"
  | "confirmPassword";

export type AuthErrorResponse = {
  message?: string;
  errors?: Partial<Record<AuthField, string | string[]>>;
};
