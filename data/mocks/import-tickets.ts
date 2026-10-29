import { ImportTicketStatus, type ImportTicket } from "@/types/models";

export const mockImportTickets: ImportTicket[] = [
  {
    uuid: "bc4fcc5d-5421-4ae6-81ca-e6bc4c791101",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    accountUuid: "2a9a4604-aa8a-4f39-84ea-f6cb613884be",
    providerUuid: "fa625aa7-0a4c-4fa8-b39e-c4950e561101",
    note: "Nhập thuốc bổ sung định kỳ.",
    status: ImportTicketStatus.Confirmed,
    createdAt: new Date("2026-09-18T02:00:00.000Z"),
    updatedAt: new Date("2026-09-18T04:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "bc4fcc5d-5421-4ae6-81ca-e6bc4c791102",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    accountUuid: "2a9a4604-aa8a-4f39-84ea-f6cb613884be",
    providerUuid: "fa625aa7-0a4c-4fa8-b39e-c4950e561101",
    note: "Phiếu đang chờ xác nhận.",
    status: ImportTicketStatus.Pending,
    createdAt: new Date("2026-09-21T02:00:00.000Z"),
    updatedAt: new Date("2026-09-21T02:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "bc4fcc5d-5421-4ae6-81ca-e6bc4c791103",
    hospitalUuid: "f02f7063-adc4-47ae-9a42-02ca5adff369",
    accountUuid: "ec52c5f3-411d-472e-8df4-d5d17e5a540e",
    providerUuid: "fa625aa7-0a4c-4fa8-b39e-c4950e561102",
    note: "Phiếu đã hủy do thay đổi nhà cung cấp.",
    status: ImportTicketStatus.Cancelled,
    createdAt: new Date("2026-08-20T02:00:00.000Z"),
    updatedAt: new Date("2026-08-21T02:00:00.000Z"),
    deletedAt: new Date(0),
  },
];
