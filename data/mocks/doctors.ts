import type { DoctorProfile } from "@/types/models";

export const mockDoctors: DoctorProfile[] = [
  {
    uuid: "57479ec8-29e0-44af-a8b0-15041655c5b8",
    avatar: "/images/doctor-placeholder.svg",
    slug: "bs-nguyen-minh-khoa",
    name: "BS. Nguyễn Minh Khoa",
    price: 350000,
    departmentDisplay: "Nội tổng quát",
    introduction:
      "**BS. Nguyễn Minh Khoa** có 12 năm kinh nghiệm trong khám và theo dõi các bệnh lý nội khoa thường gặp. Bác sĩ ưu tiên trao đổi rõ triệu chứng, tiền sử và thói quen sinh hoạt trước khi đưa ra hướng theo dõi.\n\nNgười bệnh được giải thích mục tiêu của từng chỉ định và các dấu hiệu cần lưu ý sau buổi khám. Cách tư vấn tập trung vào kế hoạch thực tế, phù hợp với sinh hoạt hằng ngày.\n\n- Khám nội tổng quát cho người trưởng thành\n- Theo dõi tăng huyết áp, rối loạn chuyển hóa và bệnh mạn tính\n- Tư vấn kiểm tra sức khỏe định kỳ",
    expertise:
      "**Lĩnh vực chuyên môn**\n\n- Nội tổng quát và đánh giá triệu chứng ban đầu\n- Quản lý bệnh mạn tính theo kế hoạch dài hạn\n- Tư vấn dinh dưỡng, vận động và phòng ngừa nguy cơ\n\n**Quy trình tư vấn**\n\n1. Khai thác triệu chứng và hồ sơ điều trị trước đây\n2. Đánh giá yếu tố nguy cơ và chỉ định cần thiết\n3. Thống nhất kế hoạch theo dõi, dùng thuốc hoặc tái khám",
    specialty: "Nội khoa và bệnh mạn tính",
    workplace: "Bệnh viện An Bình",
    isFeatured: true,
    accountUuid: "2a9a4604-aa8a-4f39-84ea-f6cb613884be",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
  },
  {
    uuid: "335db5d1-1b77-4590-88f3-c784156167d6",
    avatar: "/images/doctor-placeholder.svg",
    slug: "bs-tran-thu-ha",
    name: "BS. Trần Thu Hà",
    price: 400000,
    departmentDisplay: "Tim mạch",
    introduction:
      "**BS. Trần Thu Hà** tập trung vào tầm soát nguy cơ tim mạch và tư vấn dự phòng cho người trưởng thành. Bác sĩ kết hợp thông tin triệu chứng, huyết áp, thói quen sinh hoạt và kết quả cận lâm sàng để xây dựng kế hoạch theo dõi.\n\nBuổi khám hướng đến việc giúp người bệnh hiểu rõ chỉ số của mình và biết khi nào cần tái khám hoặc đến cơ sở y tế sớm.\n\n- Đánh giá đau ngực, hồi hộp và khó thở\n- Theo dõi huyết áp và các yếu tố nguy cơ tim mạch\n- Tư vấn thay đổi lối sống theo tình trạng cá nhân",
    expertise:
      "**Chuyên môn trọng tâm**\n\n- Tim mạch người lớn\n- Tăng huyết áp và rối loạn lipid máu\n- Tầm soát nguy cơ tim mạch\n\n**Kinh nghiệm tư vấn**\n\nBác sĩ chú trọng giải thích mối liên hệ giữa triệu chứng, chỉ số huyết áp và lối sống. Người bệnh nên mang theo kết quả đo tại nhà, đơn thuốc và xét nghiệm gần nhất để buổi khám có đầy đủ thông tin.",
    specialty: "Tim mạch người lớn",
    workplace: "Phòng khám Minh Tâm",
    isFeatured: true,
    accountUuid: "ec52c5f3-411d-472e-8df4-d5d17e5a540e",
    hospitalUuid: "f02f7063-adc4-47ae-9a42-02ca5adff369",
  },
  {
    uuid: "90e7697d-993e-4375-aaf3-1ceda0578fb3",
    avatar: "/images/doctor-placeholder.svg",
    slug: "bs-le-quang-huy",
    name: "BS. Lê Quang Huy",
    price: 300000,
    departmentDisplay: "Nhi khoa",
    introduction:
      "**BS. Lê Quang Huy** đồng hành cùng gia đình trong chăm sóc sức khỏe trẻ em từ giai đoạn sơ sinh đến tuổi học đường. Nội dung tư vấn được trình bày theo cách dễ theo dõi để cha mẹ có thể tiếp tục chăm sóc trẻ tại nhà.\n\nBác sĩ quan tâm đồng thời đến triệu chứng hiện tại, dinh dưỡng, giấc ngủ và các mốc phát triển của trẻ.\n\n- Khám các bệnh nhi khoa thường gặp\n- Theo dõi tăng trưởng và dinh dưỡng\n- Hướng dẫn nhận biết dấu hiệu cần đưa trẻ đi khám sớm",
    expertise:
      "**Lĩnh vực theo dõi**\n\n- Nhi tổng quát\n- Dinh dưỡng và tăng trưởng\n- Chăm sóc trẻ theo từng giai đoạn phát triển\n\n**Chuẩn bị trước buổi khám**\n\n1. Ghi lại thời điểm xuất hiện và diễn tiến triệu chứng\n2. Mang sổ theo dõi sức khỏe, đơn thuốc hoặc kết quả gần nhất\n3. Chuẩn bị thông tin về ăn uống, giấc ngủ và phản ứng của trẻ",
    specialty: "Nhi tổng quát",
    workplace: "Trung tâm Y khoa Sông Hàn",
    isFeatured: true,
    accountUuid: "22883a1f-c965-431f-955b-3e0ca2320520",
    hospitalUuid: "3ab3cdb8-606a-4718-9ed7-a8d7a781d4f7",
  },
  {
    uuid: "8540ac4f-d08e-482e-8f4a-0cb7a87ec404",
    avatar: "/images/doctor-placeholder.svg",
    slug: "bs-pham-mai-lan",
    name: "BS. Phạm Mai Lan",
    price: 320000,
    departmentDisplay: "Da liễu",
    introduction:
      "**BS. Phạm Mai Lan** tư vấn các vấn đề da liễu thường gặp với cách tiếp cận dựa trên diễn tiến tổn thương, sản phẩm đang sử dụng và thói quen chăm sóc da. Bác sĩ ưu tiên hướng dẫn rõ cách dùng thuốc và thời gian cần theo dõi.\n\nNgười bệnh được khuyến khích cung cấp hình ảnh diễn tiến nếu biểu hiện thay đổi theo thời gian.\n\n- Khám các vấn đề về da, tóc và móng\n- Tư vấn chăm sóc da theo tình trạng cụ thể\n- Theo dõi đáp ứng và điều chỉnh kế hoạch khi cần",
    expertise:
      "**Chuyên môn**\n\n- Da liễu tổng quát\n- Viêm da và các vấn đề da thường gặp\n- Chăm sóc và phục hồi hàng rào bảo vệ da\n\n**Lưu ý khi đi khám**\n\nKhông tự ý bắt đầu sản phẩm hoặc thuốc mới ngay trước buổi khám. Nên mang theo danh sách mỹ phẩm, thuốc bôi và thuốc uống đang sử dụng để bác sĩ đối chiếu.",
    specialty: "Da liễu tổng quát",
    workplace: "Phòng khám Đa khoa Hải Âu",
    isFeatured: false,
    accountUuid: "91543748-61cd-4dbf-8dd4-0b6fd8fac404",
    hospitalUuid: "c750f76e-a4cd-46ec-bb08-1c58ab73c901",
  },
  {
    uuid: "6a197dc0-625b-4013-96f3-f97757e91f05",
    avatar: "/images/doctor-placeholder.svg",
    slug: "bs-vo-hoang-nam",
    name: "BS. Võ Hoàng Nam",
    price: 280000,
    departmentDisplay: "Nội tổng quát",
    introduction:
      "**BS. Võ Hoàng Nam** khám và theo dõi sức khỏe theo định hướng y học gia đình, chú trọng sự liên tục giữa các lần khám. Bác sĩ xem xét triệu chứng cùng tiền sử cá nhân, gia đình và các yếu tố sinh hoạt để nhận diện nguy cơ sớm.\n\nMục tiêu của buổi khám là giúp người bệnh có kế hoạch chăm sóc dễ thực hiện và biết mốc cần kiểm tra lại.\n\n- Khám nội tổng quát\n- Quản lý sức khỏe định kỳ cho người trưởng thành\n- Theo dõi bệnh mạn tính và yếu tố nguy cơ",
    expertise:
      "**Phạm vi chuyên môn**\n\n- Nội khoa gia đình\n- Chăm sóc dự phòng\n- Quản lý nhiều vấn đề sức khỏe đồng thời\n\n**Cách thức theo dõi**\n\n1. Tổng hợp hồ sơ và vấn đề ưu tiên\n2. Xác định mục tiêu chăm sóc ngắn hạn và dài hạn\n3. Lập lịch kiểm tra, tái khám và điều chỉnh thói quen phù hợp",
    specialty: "Nội khoa gia đình",
    workplace: "Trung tâm Chăm sóc Gia đình",
    isFeatured: false,
    accountUuid: "e2ae3f54-e487-4e05-8493-17d2b4806f05",
    hospitalUuid: "2d76b699-c01b-41a2-8ccc-a39261eb8d02",
  },
  {
    uuid: "7fd0d807-b956-4070-bb72-b00bf6221f06",
    avatar: "/images/doctor-placeholder.svg",
    slug: "bs-khong-con-hoat-dong",
    name: "BS. Không còn hoạt động",
    price: 250000,
    departmentDisplay: "Nội tổng quát",
    introduction: "Hồ sơ không hiển thị công khai.",
    expertise: "- Nội tổng quát",
    specialty: "Nội tổng quát",
    workplace: "Bệnh viện An Bình",
    isFeatured: false,
    accountUuid: "55491f89-cf4a-428d-bfb8-102cce0b9f06",
    hospitalUuid: "a4a0a61f-577d-48cb-94b9-c9ce85554b11",
  },
];

export const featuredDoctors = mockDoctors.filter((doctor) => doctor.isFeatured);
