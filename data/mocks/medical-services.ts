import { BaseStatus, type MedicalService } from "@/types/models";

export const mockMedicalServices: MedicalService[] = [
  {
    uuid: "227a9731-1a64-41c5-a934-ef464fc4d416",
    image: "/images/service-placeholder.svg",
    slug: "kham-suc-khoe-tong-quat",
    name: "Khám sức khỏe tổng quát",
    price: 1200000,
    description:
      "**Khám sức khỏe tổng quát** giúp ghi nhận các chỉ số cơ bản, phát hiện dấu hiệu nguy cơ và xây dựng kế hoạch theo dõi phù hợp. Danh mục được thực hiện theo quy trình của cơ sở và tình trạng thực tế của người khám.\n\n- Đánh giá tiền sử và các vấn đề sức khỏe đang quan tâm\n- Khám lâm sàng tổng quát\n- Tư vấn kết quả và hướng theo dõi tiếp theo",
    detailService:
      "**Trước khi thực hiện**\n\n- Chuẩn bị giấy tờ, hồ sơ khám và đơn thuốc gần nhất\n- Nhịn ăn nếu cơ sở xác nhận danh mục có xét nghiệm cần chuẩn bị\n- Ghi lại triệu chứng hoặc câu hỏi cần trao đổi\n\n**Quy trình dự kiến**\n\n1. Tiếp nhận và xác nhận danh mục kiểm tra\n2. Khám lâm sàng và thực hiện chỉ định cơ bản\n3. Tổng hợp kết quả, tư vấn và hướng dẫn theo dõi\n\nDanh mục cụ thể có thể được điều chỉnh theo đánh giá chuyên môn tại cơ sở.",
    workingHour: "Thứ Hai - Thứ Bảy, 07:00 - 11:30",
    status: BaseStatus.Active,
    isInsured: true,
    insuranceCap: 0.8,
    isFeatured: true,
    createdAt: new Date("2025-02-01T00:00:00.000Z"),
    updatedAt: new Date("2026-08-19T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "d531fbd6-998a-49df-9e68-4388b8bf388b",
    image: "/images/service-placeholder.svg",
    slug: "sieu-am-tong-quat",
    name: "Siêu âm tổng quát",
    price: 450000,
    description:
      "**Siêu âm tổng quát** sử dụng hình ảnh để hỗ trợ khảo sát cơ quan theo vùng được chỉ định. Kết quả là một phần thông tin giúp bác sĩ đánh giá cùng triệu chứng và các xét nghiệm liên quan.\n\n- Thực hiện không xâm lấn\n- Hỗ trợ khảo sát hình thái cơ quan\n- Có kết quả theo quy trình của cơ sở",
    detailService:
      "**Chuẩn bị**\n\nTùy vùng khảo sát, người thực hiện có thể được hướng dẫn nhịn ăn, uống nước hoặc chuẩn bị riêng. Cần xác nhận lại với cơ sở sau khi đặt lịch.\n\n**Các bước dự kiến**\n\n1. Kiểm tra thông tin và chỉ định\n2. Chuẩn bị tư thế phù hợp với vùng khảo sát\n3. Thực hiện siêu âm bởi nhân sự chuyên môn\n4. Nhận kết quả và hướng dẫn trao đổi với bác sĩ\n\nThời lượng có thể thay đổi theo nội dung cần khảo sát.",
    workingHour: "Thứ Hai - Thứ Bảy, 08:00 - 16:30",
    status: BaseStatus.Active,
    isInsured: true,
    insuranceCap: 0.7,
    isFeatured: true,
    createdAt: new Date("2025-02-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-17T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "6fb2fb37-cf96-4926-b66a-bf81cce5ecb3",
    image: "/images/service-placeholder.svg",
    slug: "xet-nghiem-duong-huyet",
    name: "Xét nghiệm đường huyết",
    price: 180000,
    description:
      "**Xét nghiệm đường huyết** đo nồng độ glucose trong mẫu máu, hỗ trợ theo dõi sức khỏe chuyển hóa và đánh giá nguy cơ theo chỉ định. Kết quả cần được diễn giải cùng thời điểm lấy mẫu, triệu chứng và tiền sử.\n\n- Hỗ trợ kiểm tra đường huyết\n- Phù hợp cho theo dõi định kỳ theo hướng dẫn\n- Trả kết quả theo quy trình của cơ sở",
    detailService:
      "**Lưu ý chuẩn bị**\n\n- Xác nhận loại xét nghiệm có yêu cầu nhịn ăn hay không\n- Thông báo thuốc đang dùng và thời điểm dùng gần nhất\n- Không tự ý ngừng thuốc nếu chưa có hướng dẫn chuyên môn\n\n**Quy trình**\n\n1. Tiếp nhận và đối chiếu thông tin\n2. Lấy mẫu theo quy trình an toàn\n3. Phân tích và trả kết quả\n4. Trao đổi với bác sĩ nếu chỉ số nằm ngoài khoảng tham chiếu",
    workingHour: "Thứ Hai - Chủ Nhật, 07:00 - 10:00",
    status: BaseStatus.Active,
    isInsured: true,
    insuranceCap: 0.8,
    isFeatured: true,
    createdAt: new Date("2025-02-03T00:00:00.000Z"),
    updatedAt: new Date("2026-08-15T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "90f03176-14b8-4daa-bd19-5a56d9f35a04",
    image: "/images/service-placeholder.svg",
    slug: "soi-da-va-tu-van-da-lieu",
    name: "Soi da và tư vấn da liễu",
    price: 300000,
    description:
      "**Soi da và tư vấn da liễu** hỗ trợ quan sát bề mặt da, ghi nhận vấn đề đang gặp và xây dựng hướng chăm sóc phù hợp. Thông tin từ thiết bị được kết hợp với thăm khám trực tiếp và tiền sử sử dụng sản phẩm.\n\n- Đánh giá tình trạng da hiện tại\n- Đối chiếu thói quen và sản phẩm đang dùng\n- Tư vấn chăm sóc theo nhu cầu cụ thể",
    detailService:
      "**Trước buổi khám**\n\n- Hạn chế trang điểm dày tại vùng cần kiểm tra\n- Mang danh sách sản phẩm, thuốc bôi và thuốc uống đang dùng\n- Chuẩn bị hình ảnh diễn tiến nếu tình trạng thay đổi theo thời gian\n\n**Nội dung thực hiện**\n\n1. Khai thác vấn đề và thói quen chăm sóc\n2. Quan sát, thăm khám và soi da khi phù hợp\n3. Giải thích tình trạng và hướng chăm sóc\n4. Hẹn thời điểm theo dõi nếu cần",
    workingHour: "Thứ Hai - Thứ Bảy, 08:00 - 17:00",
    status: BaseStatus.Active,
    isInsured: false,
    insuranceCap: 0,
    isFeatured: false,
    createdAt: new Date("2025-02-04T00:00:00.000Z"),
    updatedAt: new Date("2026-08-14T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "53f43a59-29e4-4a62-9472-bbdd79e3e905",
    image: "/images/service-placeholder.svg",
    slug: "tam-soat-suc-khoe-dinh-ky",
    name: "Tầm soát sức khỏe định kỳ",
    price: 850000,
    description:
      "**Tầm soát sức khỏe định kỳ** hỗ trợ theo dõi sự thay đổi của các chỉ số quan trọng theo thời gian. Gói kiểm tra phù hợp với người muốn chủ động rà soát nguy cơ và chuẩn bị dữ liệu cho kế hoạch chăm sóc dài hạn.\n\n- Ghi nhận chỉ số sức khỏe cơ bản\n- Hỗ trợ nhận diện yếu tố cần theo dõi thêm\n- Tư vấn mốc kiểm tra tiếp theo",
    detailService:
      "**Chuẩn bị hồ sơ**\n\n- Kết quả khám hoặc xét nghiệm kỳ trước\n- Danh sách thuốc và thực phẩm bổ sung đang dùng\n- Thông tin tiền sử cá nhân và gia đình\n\n**Quy trình dự kiến**\n\n1. Xác nhận danh mục theo độ tuổi và nhu cầu\n2. Khám, đo chỉ số và thực hiện xét nghiệm liên quan\n3. Tổng hợp kết quả\n4. Tư vấn yếu tố nguy cơ và lịch theo dõi\n\nPhạm vi chính xác được cơ sở xác nhận trước khi thực hiện.",
    workingHour: "Thứ Hai - Chủ Nhật, 07:30 - 11:30",
    status: BaseStatus.Active,
    isInsured: true,
    insuranceCap: 0.6,
    isFeatured: false,
    createdAt: new Date("2025-02-05T00:00:00.000Z"),
    updatedAt: new Date("2026-08-13T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
  {
    uuid: "b526a1de-5eb7-4b35-85d9-11239bc83a06",
    image: "/images/service-placeholder.svg",
    slug: "dich-vu-tam-ngung",
    name: "Dịch vụ tạm ngưng",
    price: 100000,
    description: "Dịch vụ không còn hiển thị công khai.",
    detailService: "Đang cập nhật.",
    workingHour: "Đang cập nhật",
    status: BaseStatus.InActive,
    isInsured: false,
    insuranceCap: 0,
    isFeatured: false,
    createdAt: new Date("2025-02-06T00:00:00.000Z"),
    updatedAt: new Date("2026-08-10T00:00:00.000Z"),
    deletedAt: new Date(0),
  },
];

export const featuredMedicalServices = mockMedicalServices
  .filter((service) => service.status === BaseStatus.Active && service.isFeatured);
