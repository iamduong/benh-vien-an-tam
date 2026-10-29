import {
  BaseStatus,
  MedicineUnit,
  type Medicine,
} from "@/types/models";

const createdAt = new Date("2025-01-10T00:00:00.000Z");
const updatedAt = new Date("2026-08-20T00:00:00.000Z");

export const mockMedicines: Medicine[] = [
  {
    uuid: "a951d152-7aea-4be8-b525-c38142331101",
    image: "",
    name: "Paracetamol 500mg",
    description: "Thuốc giảm đau và hạ sốt.",
    price: 1200,
    unit: MedicineUnit.Tablet,
    status: BaseStatus.Active,
    isInsured: true,
    insuranceCap: 0.8,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: new Date(0),
  },
  {
    uuid: "a951d152-7aea-4be8-b525-c38142331102",
    image: "",
    name: "Vitamin C 500mg",
    description: "Bổ sung vitamin C theo chỉ định.",
    price: 1800,
    unit: MedicineUnit.Tablet,
    status: BaseStatus.Active,
    isInsured: false,
    insuranceCap: 0,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: new Date(0),
  },
  {
    uuid: "a951d152-7aea-4be8-b525-c38142331103",
    image: "",
    name: "Dung dịch súc họng 250ml",
    description: "Sử dụng ngoài theo hướng dẫn của bác sĩ.",
    price: 45000,
    unit: MedicineUnit.Bottle,
    status: BaseStatus.Active,
    isInsured: true,
    insuranceCap: 0.5,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: new Date(0),
  },
];
