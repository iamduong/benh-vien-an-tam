import { BaseStatus, type ReviewHospital } from "@/types/models";

export const mockReviewHospitals: ReviewHospital[] = [
  {
    uuid: "0c1da2c0-0ddb-48ee-bc61-821a121d1101",
    content: "Quy trình tiếp nhận rõ ràng, nhân viên hướng dẫn tận tình.",
    numberOfStar: 5,
    patientUuid: "c8067404-5a51-4a83-a4e5-d6a7d7508a12",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    status: BaseStatus.Active,
    isViewed: true,
    createdAt: new Date("2026-07-18T08:30:00.000Z"),
  },
  {
    uuid: "0c1da2c0-0ddb-48ee-bc61-821a121d1102",
    content: "Không gian thuận tiện, thời gian chờ phù hợp.",
    numberOfStar: 4,
    patientUuid: "f7472b18-f178-4e9c-9d2d-cd87b4fca3c5",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    status: BaseStatus.Active,
    isViewed: true,
    createdAt: new Date("2026-06-25T09:15:00.000Z"),
  },
  {
    uuid: "0c1da2c0-0ddb-48ee-bc61-821a121d1103",
    content: "Đánh giá đang chờ hiển thị.",
    numberOfStar: 3,
    patientUuid: "c8067404-5a51-4a83-a4e5-d6a7d7508a12",
    hospitalUuid: "f02f7063-adc4-47ae-9a42-02ca5adff369",
    status: BaseStatus.InActive,
    isViewed: false,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
  },
];
