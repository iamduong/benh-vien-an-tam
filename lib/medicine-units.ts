import { MedicineUnit } from "@/types/models";

const medicineUnitLabels: Record<MedicineUnit, string> = {
  [MedicineUnit.Other]: "Khác",
  [MedicineUnit.Tablet]: "Viên",
  [MedicineUnit.Bottle]: "Chai",
  [MedicineUnit.Box]: "Hộp",
  [MedicineUnit.Tube]: "Tuýp",
  [MedicineUnit.Sachet]: "Gói",
};

export function getMedicineUnitLabel(unit: string) {
  return medicineUnitLabels[unit as MedicineUnit] ?? unit;
}
