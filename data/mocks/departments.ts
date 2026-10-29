import { BaseStatus, type Department } from "@/types/models";

export const mockDepartments: Department[] = [
  {
    uuid: "09a6bb46-92d4-4d40-bda3-f7e1a466f85d",
    icon: "/images/departments/internal-medicine.svg",
    slug: "noi-tong-quat",
    name: "Nội tổng quát",
    description: "Khám và theo dõi các bệnh lý nội khoa thường gặp.",
    status: BaseStatus.Active,
    createdAt: new Date("2025-01-05T00:00:00.000Z"),
    updatedAt: new Date("2026-08-15T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "f4d6bff1-bb1d-4a0d-a4c8-19c7bdb193eb",
    icon: "/images/departments/cardiology.svg",
    slug: "tim-mach",
    name: "Tim mạch",
    description: "Tầm soát và điều trị các vấn đề tim mạch.",
    status: BaseStatus.Active,
    createdAt: new Date("2025-01-06T00:00:00.000Z"),
    updatedAt: new Date("2026-08-14T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "672bbda6-a7cc-462f-b00f-17189c00114f",
    icon: "/images/departments/pediatrics.svg",
    slug: "nhi-khoa",
    name: "Nhi khoa",
    description: "Chăm sóc sức khỏe và theo dõi phát triển cho trẻ.",
    status: BaseStatus.Active,
    createdAt: new Date("2025-01-07T00:00:00.000Z"),
    updatedAt: new Date("2026-08-13T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "cb4214bd-b85c-4694-b9e9-57fc395d2c68",
    icon: "/images/departments/dermatology.svg",
    slug: "da-lieu",
    name: "Da liễu",
    description: "Thăm khám các vấn đề về da, tóc và móng.",
    status: BaseStatus.Active,
    createdAt: new Date("2025-01-08T00:00:00.000Z"),
    updatedAt: new Date("2026-08-12T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
];

export const featuredDepartments = mockDepartments
  .filter((department) => department.status === BaseStatus.Active)
  .slice(0, 4);
