import { mockHospitalDepartments } from "@/data/mocks/hospital-departments";
import { mockHospitalMedicalServices } from "@/data/mocks/hospital-medical-services";
import type { HospitalAssignmentSelection } from "@/types/models";

export function getHospitalAssignments(
  hospitalUuid: string,
): HospitalAssignmentSelection {
  return {
    departmentUuids: mockHospitalDepartments
      .filter((item) => item.hospitalUuid === hospitalUuid)
      .map((item) => item.departmentUuid),
    medicalServiceUuids: mockHospitalMedicalServices
      .filter((item) => item.hospitalUuid === hospitalUuid)
      .map((item) => item.medicalServiceUuid),
  };
}
