import { mockDoctors } from "@/data/mocks/doctors";
import { mockTimeWorkings } from "@/data/mocks/time-workings";
import type { DoctorWorking } from "@/types/models";

export const mockDoctorWorkings: DoctorWorking[] = mockDoctors.slice(0, 5).flatMap((doctor, doctorIndex) =>
  mockTimeWorkings.slice(0, 10).map((working, workingIndex) => ({
    uuid: `31000000-${String(doctorIndex + 1).padStart(4, "0")}-4000-8000-${String(workingIndex + 1).padStart(12, "0")}`,
    doctorUuid: doctor.uuid,
    workingUuid: working.uuid,
  })),
);
