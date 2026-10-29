import type { ImportTicketDetail } from "@/types/models";

export const mockImportTicketDetails: ImportTicketDetail[] = [
  {
    uuid: "73a1386a-1ee7-46aa-a0b4-7780f5e51101",
    importTicketUuid: "bc4fcc5d-5421-4ae6-81ca-e6bc4c791101",
    medicineUuid: "a951d152-7aea-4be8-b525-c38142331101",
    quantity: 500,
    price: 900,
  },
  {
    uuid: "73a1386a-1ee7-46aa-a0b4-7780f5e51102",
    importTicketUuid: "bc4fcc5d-5421-4ae6-81ca-e6bc4c791101",
    medicineUuid: "a951d152-7aea-4be8-b525-c38142331102",
    quantity: 200,
    price: 1400,
  },
  {
    uuid: "73a1386a-1ee7-46aa-a0b4-7780f5e51103",
    importTicketUuid: "bc4fcc5d-5421-4ae6-81ca-e6bc4c791102",
    medicineUuid: "a951d152-7aea-4be8-b525-c38142331103",
    quantity: 100,
    price: 36000,
  },
];
