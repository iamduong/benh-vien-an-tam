import { ProviderStatus, type Provider } from "@/types/models";

export const mockProviders: Provider[] = [
  {
    uuid: "fa625aa7-0a4c-4fa8-b39e-c4950e561101",
    name: "Công ty Dược An Tâm",
    address: "12 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh",
    hotline: "02873001234",
    status: ProviderStatus.Active,
    createdAt: new Date("2025-01-10T00:00:00.000Z"),
    updatedAt: new Date("2026-08-20T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "fa625aa7-0a4c-4fa8-b39e-c4950e561102",
    name: "Nhà phân phối Minh Phúc",
    address: "85 Lê Duẩn, Hải Châu, Đà Nẵng",
    hotline: "02367300123",
    status: ProviderStatus.InActive,
    createdAt: new Date("2025-03-15T00:00:00.000Z"),
    updatedAt: new Date("2026-07-01T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
];
