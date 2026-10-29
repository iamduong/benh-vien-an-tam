import { ExportTicketStatus, type ExportTicket } from "@/types/models";

export const mockExportTickets: ExportTicket[] = [
  {
    uuid: "6584b574-4630-48dd-b043-d7b84c9d1101",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    accountUuid: "2a9a4604-aa8a-4f39-84ea-f6cb613884be",
    note: "Xuất thuốc theo nhu cầu điều trị.",
    status: ExportTicketStatus.Confirmed,
    createdAt: new Date("2026-09-19T02:00:00.000Z"),
    updatedAt: new Date("2026-09-19T03:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "6584b574-4630-48dd-b043-d7b84c9d1102",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    accountUuid: "2a9a4604-aa8a-4f39-84ea-f6cb613884be",
    note: "Phiếu xuất đang chờ duyệt.",
    status: ExportTicketStatus.Pending,
    createdAt: new Date("2026-09-21T04:00:00.000Z"),
    updatedAt: new Date("2026-09-21T04:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "6584b574-4630-48dd-b043-d7b84c9d1103",
    hospitalUuid: "f02f7063-adc4-47ae-9a42-02ca5adff369",
    accountUuid: "ec52c5f3-411d-472e-8df4-d5d17e5a540e",
    note: "Phiếu xuất đã hủy.",
    status: ExportTicketStatus.Cancelled,
    createdAt: new Date("2026-08-22T02:00:00.000Z"),
    updatedAt: new Date("2026-08-22T03:00:00.000Z"),
    deletedAt: new Date(0),
  },
];
