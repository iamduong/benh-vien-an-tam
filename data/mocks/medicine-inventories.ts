import type { MedicineInventory } from "@/types/models";

const createdAt = new Date("2026-08-01T00:00:00.000Z");
const updatedAt = new Date("2026-09-20T00:00:00.000Z");

export const mockMedicineInventories: MedicineInventory[] = [
  {
    uuid: "3f53fa33-66dd-42e8-a88c-68a724b81101",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    medicineUuid: "a951d152-7aea-4be8-b525-c38142331101",
    quantity: 1200,
    minimumQuantity: 200,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: new Date(0),
  },
  {
    uuid: "3f53fa33-66dd-42e8-a88c-68a724b81102",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    medicineUuid: "a951d152-7aea-4be8-b525-c38142331102",
    quantity: 85,
    minimumQuantity: 100,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: new Date(0),
  },
  {
    uuid: "3f53fa33-66dd-42e8-a88c-68a724b81103",
    hospitalUuid: "f02f7063-adc4-47ae-9a42-02ca5adff369",
    medicineUuid: "a951d152-7aea-4be8-b525-c38142331103",
    quantity: 240,
    minimumQuantity: 50,
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: new Date(0),
  },
];
