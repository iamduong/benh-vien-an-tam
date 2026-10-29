import { BaseStatus, type ReviewMedicalService } from "@/types/models";

export const mockReviewMedicalServices: ReviewMedicalService[] = [
  {
    uuid: "568076b0-657e-46ad-9e37-d2995d9d3301",
    content: "Danh mục kiểm tra rõ ràng và được hướng dẫn trước khi thực hiện.",
    numberOfStar: 5,
    patientUuid: "c8067404-5a51-4a83-a4e5-d6a7d7508a12",
    medicalServiceUuid: "227a9731-1a64-41c5-a934-ef464fc4d416",
    status: BaseStatus.Active,
    isViewed: true,
    createdAt: new Date("2026-07-30T06:40:00.000Z"),
  },
  {
    uuid: "568076b0-657e-46ad-9e37-d2995d9d3302",
    content: "Quy trình thực hiện nhanh, thông tin kết quả dễ theo dõi.",
    numberOfStar: 4,
    patientUuid: "f7472b18-f178-4e9c-9d2d-cd87b4fca3c5",
    medicalServiceUuid: "6fb2fb37-cf96-4926-b66a-bf81cce5ecb3",
    status: BaseStatus.Active,
    isViewed: true,
    createdAt: new Date("2026-07-21T07:10:00.000Z"),
  },
  {
    uuid: "568076b0-657e-46ad-9e37-d2995d9d3303",
    content: "Đánh giá không hiển thị công khai.",
    numberOfStar: 3,
    patientUuid: "f7472b18-f178-4e9c-9d2d-cd87b4fca3c5",
    medicalServiceUuid: "227a9731-1a64-41c5-a934-ef464fc4d416",
    status: BaseStatus.InActive,
    isViewed: false,
    createdAt: new Date("2026-08-06T11:00:00.000Z"),
  },
];
