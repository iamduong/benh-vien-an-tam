import { Gender, type PatientProfile } from "@/types/models";

export const mockPatientProfiles: PatientProfile[] = [
  {
    uuid: "c8067404-5a51-4a83-a4e5-d6a7d7508a12",
    avatar: "",
    name: "Nguyễn An",
    gender: Gender.Male,
    birthdate: new Date("1992-06-18T00:00:00.000Z"),
    medicalCode: "BN10001234",
    email: "nguyen.an@example.com",
    accountUuid: "dfbd3aa5-ab7a-4ad7-a0a1-e870f38129b8",
  },
  {
    uuid: "f7472b18-f178-4e9c-9d2d-cd87b4fca3c5",
    avatar: "",
    name: "Trần Bình",
    gender: Gender.Other,
    birthdate: new Date("1988-03-24T00:00:00.000Z"),
    medicalCode: "BN10005678",
    email: "tran.binh@example.com",
    accountUuid: "0ad1f4f4-15fc-4b6a-a89d-67917d4278bf",
  },
];
