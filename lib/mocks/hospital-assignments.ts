import { mockHospitalDepartments } from "@/data/mocks/hospital-departments";
import { mockHospitalMedicalServices } from "@/data/mocks/hospital-medical-services";
import type { HospitalAssignmentSelection } from "@/types/models";

const storageKey = "an-tam-mock.hospital-assignments";

export function getHospitalAssignments(
  hospitalUuid: string,
): HospitalAssignmentSelection {
  const saved = readSavedAssignments();
  const savedSelection = saved?.[hospitalUuid];
  if (savedSelection) {
    return {
      departmentUuids: [...savedSelection.departmentUuids],
      medicalServiceUuids: [...savedSelection.medicalServiceUuids],
    };
  }

  return {
    departmentUuids: mockHospitalDepartments
      .filter((item) => item.hospitalUuid === hospitalUuid)
      .map((item) => item.departmentUuid),
    medicalServiceUuids: mockHospitalMedicalServices
      .filter((item) => item.hospitalUuid === hospitalUuid)
      .map((item) => item.medicalServiceUuid),
  };
}

export function saveHospitalAssignments(
  hospitalUuid: string,
  selection: HospitalAssignmentSelection,
) {
  if (typeof window === "undefined") return;

  const saved = readSavedAssignments() ?? {};
  saved[hospitalUuid] = {
    departmentUuids: [...selection.departmentUuids],
    medicalServiceUuids: [...selection.medicalServiceUuids],
  };
  window.localStorage.setItem(storageKey, JSON.stringify(saved));
}

function readSavedAssignments(): Record<
  string,
  HospitalAssignmentSelection
> | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(storageKey);
  if (!value) return null;

  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Dữ liệu phân bổ mock đã lưu không hợp lệ.");
  }

  const assignments: Record<string, HospitalAssignmentSelection> = {};
  for (const [hospitalUuid, selection] of Object.entries(parsed)) {
    if (
      !selection ||
      typeof selection !== "object" ||
      !("departmentUuids" in selection) ||
      !("medicalServiceUuids" in selection) ||
      !isStringArray(selection.departmentUuids) ||
      !isStringArray(selection.medicalServiceUuids)
    ) {
      throw new Error("Dữ liệu phân bổ mock đã lưu không hợp lệ.");
    }

    assignments[hospitalUuid] = {
      departmentUuids: selection.departmentUuids,
      medicalServiceUuids: selection.medicalServiceUuids,
    };
  }

  return assignments;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
