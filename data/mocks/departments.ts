import { BaseStatus, type Department } from "@/types/models";

export const mockDepartments: Department[] = [
  {
    Uuid: "09a6bb46-92d4-4d40-bda3-f7e1a466f85d",
    Icon: "/images/departments/internal-medicine.svg",
    Slug: "noi-tong-quat",
    Name: "Nội tổng quát",
    Description: "Khám và theo dõi các bệnh lý nội khoa thường gặp.",
    Status: BaseStatus.Active,
    CreatedAt: new Date("2025-01-05T00:00:00.000Z"),
    UpdatedAt: new Date("2026-08-15T00:00:00.000Z"),
    DeletedAt: new Date(0),
  },
  {
    Uuid: "f4d6bff1-bb1d-4a0d-a4c8-19c7bdb193eb",
    Icon: "/images/departments/cardiology.svg",
    Slug: "tim-mach",
    Name: "Tim mạch",
    Description: "Tầm soát và điều trị các vấn đề tim mạch.",
    Status: BaseStatus.Active,
    CreatedAt: new Date("2025-01-06T00:00:00.000Z"),
    UpdatedAt: new Date("2026-08-14T00:00:00.000Z"),
    DeletedAt: new Date(0),
  },
  {
    Uuid: "672bbda6-a7cc-462f-b00f-17189c00114f",
    Icon: "/images/departments/pediatrics.svg",
    Slug: "nhi-khoa",
    Name: "Nhi khoa",
    Description: "Chăm sóc sức khỏe và theo dõi phát triển cho trẻ.",
    Status: BaseStatus.Active,
    CreatedAt: new Date("2025-01-07T00:00:00.000Z"),
    UpdatedAt: new Date("2026-08-13T00:00:00.000Z"),
    DeletedAt: new Date(0),
  },
  {
    Uuid: "cb4214bd-b85c-4694-b9e9-57fc395d2c68",
    Icon: "/images/departments/dermatology.svg",
    Slug: "da-lieu",
    Name: "Da liễu",
    Description: "Thăm khám các vấn đề về da, tóc và móng.",
    Status: BaseStatus.Active,
    CreatedAt: new Date("2025-01-08T00:00:00.000Z"),
    UpdatedAt: new Date("2026-08-12T00:00:00.000Z"),
    DeletedAt: new Date(0),
  },
];

export const featuredDepartments = mockDepartments
  .filter((department) => department.Status === BaseStatus.Active)
  .slice(0, 4);
