import { BaseStatus, type Hospital } from "@/types/models";

export const mockHospitals: Hospital[] = [
  {
    uuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
    image: "/images/hospital-placeholder.svg",
    lImage: "/images/hospital-campus-placeholder.svg",
    mapUrl: "https://www.google.com/maps?q=52%20Nguyen%20Van%20Troi%20Phu%20Nhuan%20Ho%20Chi%20Minh&output=embed",
    slug: "benh-vien-an-binh",
    name: "Bệnh viện An Bình",
    address: "52 Nguyễn Văn Trỗi, Phú Nhuận, TP. Hồ Chí Minh",
    numberOfRoom: 42,
    description:
      "**Bệnh viện An Bình** hướng đến mô hình chăm sóc ngoại trú thuận tiện, kết nối khám tổng quát với các chuyên khoa trong cùng một quy trình. Người bệnh được hướng dẫn từ khâu tiếp nhận, thăm khám đến khi nhận chỉ định và tư vấn theo dõi.\n\nKhông gian được phân luồng theo từng khu vực chức năng nhằm hạn chế thời gian di chuyển. Đội ngũ hỗ trợ ưu tiên giải thích rõ các bước cần chuẩn bị trước khi vào phòng khám.\n\n- Tiếp nhận thông tin và kiểm tra lịch hẹn\n- Hướng dẫn đến đúng khu vực chuyên khoa\n- Tư vấn kết quả và kế hoạch theo dõi sau khám\n\n![Không gian cơ sở](/images/hospital-campus-placeholder.svg)",
    detailService:
      "**Hướng dẫn đi khám**\n\n- Đặt lịch trước và kiểm tra lại ngày, giờ khám\n- Có mặt trước giờ hẹn khoảng 15 phút\n- Mang theo giấy tờ tùy thân, hồ sơ và đơn thuốc gần nhất nếu có\n- Thông báo cho nhân viên tiếp nhận về các triệu chứng hoặc nhu cầu hỗ trợ đặc biệt\n\n**Thông tin dịch vụ**\n\nCơ sở cung cấp khám tổng quát, khám chuyên khoa và các dịch vụ hỗ trợ theo chỉ định. Phạm vi thực hiện cụ thể được xác nhận trong quá trình đặt lịch.",
    workingHour: "Thứ Hai - Thứ Bảy, 07:00 - 17:00",
    status: BaseStatus.Active,
    createdAt: new Date("2025-01-10T00:00:00.000Z"),
    updatedAt: new Date("2026-08-20T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "f02f7063-adc4-47ae-9a42-02ca5adff369",
    image: "/images/hospital-placeholder.svg",
    lImage: "/images/hospital-campus-placeholder.svg",
    mapUrl: "https://www.google.com/maps?q=18%20Le%20Dai%20Hanh%20Hai%20Ba%20Trung%20Ha%20Noi&output=embed",
    slug: "phong-kham-minh-tam",
    name: "Phòng khám Minh Tâm",
    address: "18 Lê Đại Hành, Hai Bà Trưng, Hà Nội",
    numberOfRoom: 18,
    description:
      "**Phòng khám Minh Tâm** cung cấp dịch vụ ngoại trú với lịch khám linh hoạt và quy trình tiếp nhận gọn. Các khu vực khám nội, tư vấn và chẩn đoán được bố trí gần nhau để người bệnh thuận tiện di chuyển.\n\nĐội ngũ chuyên môn tập trung khai thác tiền sử, giải thích chỉ định và hướng dẫn người bệnh theo dõi sức khỏe sau buổi khám.\n\n- Khám và tư vấn bệnh lý nội khoa thường gặp\n- Tầm soát nguy cơ tim mạch theo chỉ định\n- Chẩn đoán hình ảnh và tư vấn kết quả",
    detailService:
      "**Chuẩn bị trước khi đến**\n\n- Ghi lại triệu chứng và thuốc đang sử dụng\n- Mang kết quả xét nghiệm hoặc phim chụp gần nhất\n- Đến sớm để hoàn thiện thông tin tiếp nhận\n\nCơ sở tiếp nhận từ Thứ Hai đến Chủ Nhật. Khung giờ thực tế của từng bác sĩ hoặc dịch vụ cần được kiểm tra tại bước đặt lịch.",
    workingHour: "Thứ Hai - Chủ Nhật, 07:30 - 19:00",
    status: BaseStatus.Active,
    createdAt: new Date("2025-03-15T00:00:00.000Z"),
    updatedAt: new Date("2026-08-18T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "3ab3cdb8-606a-4718-9ed7-a8d7a781d4f7",
    image: "/images/hospital-placeholder.svg",
    lImage: "/images/hospital-campus-placeholder.svg",
    mapUrl: "https://www.google.com/maps?q=126%20Nguyen%20Van%20Linh%20Hai%20Chau%20Da%20Nang&output=embed",
    slug: "trung-tam-y-khoa-song-han",
    name: "Trung tâm Y khoa Sông Hàn",
    address: "126 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
    numberOfRoom: 25,
    description:
      "**Trung tâm Y khoa Sông Hàn** phục vụ khám ngoại trú cho người lớn và trẻ em, kết hợp nhiều chuyên khoa cùng các dịch vụ xét nghiệm hỗ trợ. Quy trình được thiết kế để người bệnh dễ theo dõi từng bước trong buổi khám.\n\nTrung tâm chú trọng trao đổi rõ ràng giữa bác sĩ và gia đình, đặc biệt với các trường hợp cần theo dõi định kỳ hoặc phối hợp nhiều chuyên khoa.\n\n- Khu tiếp nhận và chờ khám thuận tiện\n- Hỗ trợ xét nghiệm theo chỉ định\n- Tư vấn kế hoạch chăm sóc sau khám",
    detailService:
      "**Quy trình dự kiến**\n\n- Xác nhận lịch tại quầy tiếp nhận\n- Khám ban đầu và thực hiện chỉ định cần thiết\n- Quay lại phòng khám để được giải thích kết quả\n- Nhận hướng dẫn theo dõi hoặc lịch tái khám\n\nNgười bệnh nên chuẩn bị hồ sơ cũ để bác sĩ có thêm thông tin khi đánh giá.",
    workingHour: "Thứ Hai - Thứ Bảy, 07:00 - 18:00",
    status: BaseStatus.Active,
    createdAt: new Date("2025-05-08T00:00:00.000Z"),
    updatedAt: new Date("2026-08-16T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "c750f76e-a4cd-46ec-bb08-1c58ab73c901",
    image: "/images/hospital-placeholder.svg",
    lImage: "/images/hospital-campus-placeholder.svg",
    mapUrl: "https://www.google.com/maps?q=74%20Tran%20Phu%20Nha%20Trang%20Khanh%20Hoa&output=embed",
    slug: "phong-kham-da-khoa-hai-au",
    name: "Phòng khám Đa khoa Hải Âu",
    address: "74 Trần Phú, Nha Trang, Khánh Hòa",
    numberOfRoom: 16,
    description:
      "**Phòng khám Đa khoa Hải Âu** tập trung vào dịch vụ ngoại trú với quy trình tiếp nhận nhanh gọn. Cơ sở cung cấp khám da liễu và khám tổng quát, phù hợp với nhu cầu thăm khám ban đầu và theo dõi định kỳ.\n\nKhông gian tư vấn được bố trí riêng để người bệnh có thể trao đổi kỹ về triệu chứng, thói quen chăm sóc và các vấn đề cần theo dõi.\n\n- Khám các vấn đề da, tóc và móng\n- Khám sức khỏe tổng quát\n- Tư vấn chăm sóc và lịch tái khám",
    detailService:
      "**Lưu ý khi đi khám**\n\n- Không tự ý bôi thuốc mới trước buổi khám da liễu\n- Mang theo sản phẩm hoặc thuốc đang sử dụng nếu cần đối chiếu\n- Chuẩn bị hình ảnh diễn tiến triệu chứng nếu tổn thương thay đổi theo thời gian\n\nMọi chỉ định điều trị được bác sĩ tư vấn trực tiếp sau khi thăm khám.",
    workingHour: "Thứ Hai - Thứ Bảy, 07:30 - 17:30",
    status: BaseStatus.Active,
    createdAt: new Date("2025-06-12T00:00:00.000Z"),
    updatedAt: new Date("2026-08-12T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "2d76b699-c01b-41a2-8ccc-a39261eb8d02",
    image: "/images/hospital-placeholder.svg",
    lImage: "/images/hospital-campus-placeholder.svg",
    mapUrl: "https://www.google.com/maps?q=35%20Vo%20Thi%20Sau%20Ninh%20Kieu%20Can%20Tho&output=embed",
    slug: "trung-tam-cham-soc-gia-dinh",
    name: "Trung tâm Chăm sóc Gia đình",
    address: "35 Võ Thị Sáu, Ninh Kiều, Cần Thơ",
    numberOfRoom: 20,
    description:
      "**Trung tâm Chăm sóc Gia đình** hướng đến việc theo dõi sức khỏe liên tục cho các thành viên ở nhiều độ tuổi. Hồ sơ và thông tin các lần khám trước được khuyến khích sử dụng để bác sĩ đánh giá thay đổi theo thời gian.\n\nCơ sở ưu tiên tư vấn dự phòng, quản lý các yếu tố nguy cơ và xây dựng kế hoạch kiểm tra định kỳ phù hợp với từng người.\n\n- Nội tổng quát và y học gia đình\n- Khám sức khỏe định kỳ\n- Tư vấn lối sống và theo dõi bệnh mạn tính",
    detailService:
      "**Chuẩn bị hồ sơ**\n\n- Danh sách thuốc và thực phẩm bổ sung đang dùng\n- Kết quả khám sức khỏe gần nhất\n- Thông tin tiền sử bệnh của bản thân và gia đình\n\nSau buổi khám, người bệnh được hướng dẫn các mốc theo dõi và thời điểm cần tái khám.",
    workingHour: "Thứ Hai - Chủ Nhật, 08:00 - 18:00",
    status: BaseStatus.Active,
    createdAt: new Date("2025-07-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-11T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "6167cb3b-e89b-4d49-8f03-99cc86f1ed03",
    image: "/images/hospital-placeholder.svg",
    lImage: "/images/hospital-campus-placeholder.svg",
    mapUrl: "https://www.google.com/maps?q=10%20Duong%20Mau%20Ho%20Chi%20Minh&output=embed",
    slug: "co-so-y-te-tam-ngung",
    name: "Cơ sở Y tế Tạm ngưng",
    address: "10 Đường Mẫu, TP. Hồ Chí Minh",
    numberOfRoom: 8,
    description: "Cơ sở không còn hiển thị công khai.",
    detailService: "- Khám tổng quát",
    workingHour: "Đang cập nhật",
    status: BaseStatus.InActive,
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-08-01T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
];

export const featuredHospitals = mockHospitals
  .filter((hospital) => hospital.status === BaseStatus.Active)
  .slice(0, 3);
