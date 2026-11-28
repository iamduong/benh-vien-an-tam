import type { Gender } from "@/types/models";

export type InsuranceIdentity = {
  medical: {
    refCode: string;
    insuranceCardCode: string;
    validFrom: string;
    validTo: string;
  };
  patient: {
    identityCardCode: string;
    name: string;
    gender: Gender;
    birthDate: string;
    address: string;
  };
};
