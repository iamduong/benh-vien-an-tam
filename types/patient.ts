import type { PatientProfile } from "@/types/models";

export type PatientProfileView = {
  profile: PatientProfile;
  phone: string;
};

export type UpdatePatientProfileRequest = Pick<
  PatientProfile,
  "avatar" | "name" | "gender" | "birthdate" | "email"
>;

export type PatientProfileField = keyof UpdatePatientProfileRequest;

export type PatientProfileErrorResponse = {
  message?: string;
  errors?: Partial<Record<PatientProfileField, string>>;
};
