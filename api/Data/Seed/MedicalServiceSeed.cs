using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class MedicalServiceSeed
{
    private const string ConsultationImage =
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80";

    private const string DiagnosticImage =
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80";

    private const string LaboratoryImage =
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80";

    private const string RehabilitationImage =
        "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&q=80";

    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static IReadOnlyList<MedicalService> MedicalServices { get; } =
    [
        Create("0abbfe08-a2eb-40ba-9a06-d9007a5c6723", "kham-noi-tong-quat", "Khám Nội tổng quát", 250000,
            ConsultationImage,
            "**Khám Nội tổng quát** giúp đánh giá các triệu chứng thường gặp, bệnh nền và tình trạng sức khỏe chung của người trưởng thành.\n\n- Khai thác tiền sử và thuốc đang dùng\n- Khám lâm sàng\n- Tư vấn xét nghiệm hoặc chuyên khoa phù hợp",
            "**Chuẩn bị**\n\nMang theo hồ sơ khám gần nhất, danh sách thuốc và ghi lại diễn tiến triệu chứng.\n\n**Quy trình**\n\n1. Tiếp nhận và đo dấu hiệu sinh tồn\n2. Khám với bác sĩ\n3. Nhận chỉ định và hướng dẫn theo dõi",
            "Thứ Hai - Thứ Bảy, 07:00 - 16:30", true, true),

        Create("c4b2c06c-4524-4434-8fef-d5175e2c20e9", "kham-tim-mach", "Khám Tim mạch", 350000,
            ConsultationImage,
            "**Khám Tim mạch** hỗ trợ đánh giá tăng huyết áp, đau ngực, hồi hộp, khó thở và các yếu tố nguy cơ tim mạch.\n\nKết luận được đưa ra dựa trên thăm khám và các chỉ định phù hợp.",
            "**Nên mang theo**\n\n- Sổ theo dõi huyết áp, nhịp tim\n- Điện tâm đồ hoặc siêu âm tim cũ\n- Danh sách thuốc đang sử dụng\n\nKhông tự ý ngừng thuốc tim mạch trước buổi khám.",
            "Thứ Hai - Thứ Bảy, 07:30 - 16:30", true, true),

        Create("c96496be-2faf-4485-ad5f-5a79f711e90b", "kham-nhi-khoa", "Khám Nhi khoa", 280000,
            ConsultationImage,
            "**Khám Nhi khoa** dành cho trẻ có triệu chứng cấp tính, cần theo dõi bệnh mạn tính hoặc đánh giá tăng trưởng và phát triển.",
            "**Phụ huynh cần chuẩn bị**\n\n- Sổ khám và sổ tiêm chủng của trẻ\n- Thông tin cân nặng, nhiệt độ và triệu chứng\n- Danh sách thuốc trẻ đã dùng\n\nTrẻ có dấu hiệu nặng cần đến khu cấp cứu thay vì chờ lịch khám.",
            "Thứ Hai - Chủ Nhật, 07:00 - 17:00", true, true),

        Create("59bb50a3-4655-42f6-ae97-e95e37e63a1e", "kham-da-lieu", "Khám Da liễu", 300000,
            ConsultationImage,
            "**Khám Da liễu** đánh giá các vấn đề về da, tóc và móng, kết hợp tiền sử, thăm khám trực tiếp và xét nghiệm khi cần.",
            "**Trước buổi khám**\n\n- Hạn chế trang điểm hoặc bôi sản phẩm lên vùng cần khám\n- Mang thuốc và mỹ phẩm đang sử dụng\n- Chuẩn bị ảnh chụp diễn tiến tổn thương nếu có",
            "Thứ Hai - Thứ Bảy, 08:00 - 17:00", false, false),

        Create("65d34919-ded3-4f69-bb60-2334e4499763", "kham-san-phu-khoa", "Khám Sản phụ khoa", 350000,
            ConsultationImage,
            "**Khám Sản phụ khoa** hỗ trợ chăm sóc thai kỳ, sức khỏe sinh sản và đánh giá các triệu chứng phụ khoa.",
            "**Hồ sơ nên mang theo**\n\n- Sổ khám thai hoặc hồ sơ phụ khoa trước đây\n- Kết quả siêu âm, xét nghiệm gần nhất\n- Thông tin chu kỳ và thuốc đang dùng\n\nNội dung khám được điều chỉnh theo tình trạng thực tế.",
            "Thứ Hai - Chủ Nhật, 07:00 - 17:00", true, true),

        Create("bf313821-f3a3-41ce-8ebf-db272e78898b", "kham-tai-mui-hong", "Khám Tai Mũi Họng", 280000,
            ConsultationImage,
            "**Khám Tai Mũi Họng** đánh giá các triệu chứng ở tai, mũi, xoang, họng, thanh quản và vùng đầu cổ.",
            "**Quy trình dự kiến**\n\n1. Khai thác triệu chứng và tiền sử\n2. Khám tai, mũi và họng\n3. Nội soi hoặc xét nghiệm khi có chỉ định\n4. Tư vấn điều trị và tái khám",
            "Thứ Hai - Thứ Bảy, 07:30 - 16:30", true, false),

        Create("4006a2d0-abc8-437e-84c2-d8a84fc49dc1", "kham-mat-tong-quat", "Khám Mắt tổng quát", 300000,
            DiagnosticImage,
            "**Khám Mắt tổng quát** kiểm tra thị lực và hỗ trợ phát hiện các vấn đề thường gặp của mắt.",
            "**Lưu ý**\n\nMang kính đang sử dụng và đơn kính cũ. Một số trường hợp cần nhỏ thuốc giãn đồng tử, vì vậy người khám nên hạn chế tự lái xe sau khi thực hiện nếu thị lực còn mờ.",
            "Thứ Hai - Thứ Bảy, 07:30 - 16:30", true, false),

        Create("d82ad43a-baa1-4156-9b62-e85eae266106", "kham-co-xuong-khop", "Khám Cơ Xương Khớp", 320000,
            ConsultationImage,
            "**Khám Cơ Xương Khớp** đánh giá đau, sưng, cứng khớp, hạn chế vận động và các bệnh lý cơ xương khớp mạn tính.",
            "**Nên chuẩn bị**\n\n- Phim X-quang, CT hoặc MRI cũ\n- Kết quả xét nghiệm liên quan\n- Danh sách thuốc giảm đau đã sử dụng\n\nMặc trang phục thuận tiện để bác sĩ kiểm tra vận động.",
            "Thứ Hai - Thứ Bảy, 07:30 - 16:30", true, false),

        Create("589142f2-a8a3-41ee-b3d6-5e25ee778e21", "kham-than-kinh", "Khám Thần kinh", 380000,
            ConsultationImage,
            "**Khám Thần kinh** hỗ trợ đánh giá đau đầu, chóng mặt, tê yếu, rối loạn vận động, co giật và các triệu chứng thần kinh khác.",
            "**Chuẩn bị**\n\nMang theo phim chụp não hoặc cột sống, điện não đồ, đơn thuốc và ghi chú thời điểm xuất hiện triệu chứng. Người bệnh có cơn bất thường nên đi cùng người thân nếu có thể.",
            "Thứ Hai - Thứ Sáu, 07:30 - 16:30", true, false),

        Create("fc740d36-d7de-48a6-95ac-fc3c7b7df465", "kham-tieu-hoa", "Khám Tiêu hóa", 320000,
            ConsultationImage,
            "**Khám Tiêu hóa** đánh giá triệu chứng liên quan thực quản, dạ dày, ruột, gan, mật và tụy.",
            "**Khi đến khám**\n\nMang kết quả nội soi, siêu âm, xét nghiệm gan và danh sách thuốc gần nhất. Chỉ nhịn ăn khi đã được cơ sở xác nhận có xét nghiệm hoặc thủ thuật yêu cầu chuẩn bị.",
            "Thứ Hai - Thứ Bảy, 07:00 - 16:30", true, false),

        Create("6401edbe-2788-4aa7-8287-0ec81abbbe04", "kham-ho-hap", "Khám Hô hấp", 320000,
            ConsultationImage,
            "**Khám Hô hấp** dành cho các triệu chứng ho, khó thở, khò khè, đau ngực khi thở hoặc bệnh phổi cần theo dõi.",
            "**Nên mang theo**\n\n- Phim X-quang hoặc CT ngực\n- Kết quả đo chức năng hô hấp\n- Bình hít và thuốc đang sử dụng\n\nThông báo ngay nếu có khó thở tăng nhanh hoặc đau ngực dữ dội.",
            "Thứ Hai - Thứ Bảy, 07:30 - 16:30", true, false),

        Create("4e941bd7-8a0d-4087-81eb-af8b03424a35", "kham-noi-tiet", "Khám Nội tiết", 320000,
            ConsultationImage,
            "**Khám Nội tiết** hỗ trợ quản lý đái tháo đường, bệnh tuyến giáp và các rối loạn hormone khác.",
            "**Chuẩn bị**\n\nMang sổ theo dõi đường huyết, kết quả HbA1c hoặc xét nghiệm hormone, đơn thuốc và thông tin chế độ ăn. Không tự ý bỏ thuốc trước khi khám.",
            "Thứ Hai - Thứ Sáu, 07:30 - 16:30", true, false),

        Create("47f3f9db-eb80-4861-8281-68fcb39a6e16", "sieu-am-o-bung-tong-quat", "Siêu âm ổ bụng tổng quát", 350000,
            DiagnosticImage,
            "**Siêu âm ổ bụng tổng quát** sử dụng sóng âm để khảo sát hình thái một số cơ quan trong ổ bụng theo chỉ định.",
            "**Chuẩn bị**\n\nNgười thực hiện có thể được yêu cầu nhịn ăn hoặc uống nước tùy mục tiêu khảo sát. Cần xác nhận hướng dẫn cụ thể tại thời điểm đặt lịch.\n\nKết quả phải được bác sĩ diễn giải cùng triệu chứng và xét nghiệm liên quan.",
            "Thứ Hai - Thứ Bảy, 07:30 - 17:00", true, true),

        Create("9e62b6a7-e98e-4a5d-b565-d779ed380942", "xet-nghiem-cong-thuc-mau", "Xét nghiệm công thức máu", 150000,
            LaboratoryImage,
            "**Xét nghiệm công thức máu** cung cấp thông tin về hồng cầu, bạch cầu và tiểu cầu, hỗ trợ đánh giá nhiều tình trạng sức khỏe.",
            "**Quy trình**\n\n1. Đối chiếu thông tin người bệnh\n2. Lấy mẫu máu tĩnh mạch\n3. Phân tích mẫu và trả kết quả\n\nViệc có cần nhịn ăn hay không phụ thuộc các xét nghiệm thực hiện cùng lúc.",
            "Thứ Hai - Chủ Nhật, 06:30 - 11:30", true, true),

        Create("afe98471-45f0-4be9-8d2b-e217c74404c6", "xet-nghiem-duong-huyet-hba1c", "Xét nghiệm đường huyết và HbA1c", 280000,
            LaboratoryImage,
            "**Xét nghiệm đường huyết và HbA1c** hỗ trợ đánh giá mức glucose tại thời điểm lấy mẫu và xu hướng kiểm soát đường huyết trong thời gian gần đây.",
            "**Lưu ý**\n\nXác nhận yêu cầu nhịn ăn trước khi đến. Thông báo thuốc đang dùng và không tự ý thay đổi liều insulin hoặc thuốc hạ đường huyết nếu chưa được hướng dẫn.",
            "Thứ Hai - Chủ Nhật, 06:30 - 11:30", true, true),

        Create("b5e11c20-fd42-4352-97b5-596352222bd9", "dien-tam-do-12-chuyen-dao", "Điện tâm đồ 12 chuyển đạo", 180000,
            DiagnosticImage,
            "**Điện tâm đồ 12 chuyển đạo** ghi lại hoạt động điện của tim, hỗ trợ đánh giá nhịp tim và một số bất thường tim mạch.",
            "**Trước khi thực hiện**\n\nNghỉ vài phút, tránh vận động gắng sức ngay trước đo và thông báo thuốc tim mạch đang sử dụng. Thủ thuật không xâm lấn và thường hoàn thành trong thời gian ngắn.",
            "Thứ Hai - Chủ Nhật, 07:00 - 17:00", true, true),

        Create("a3d977bb-31c3-46e7-ade7-97a36c1db751", "x-quang-nguc-thang", "X-quang ngực thẳng", 220000,
            DiagnosticImage,
            "**X-quang ngực thẳng** hỗ trợ khảo sát phổi, tim và các cấu trúc trong lồng ngực theo chỉ định chuyên môn.",
            "**Lưu ý an toàn**\n\nThông báo cho nhân viên y tế nếu đang hoặc có khả năng mang thai. Tháo vật kim loại tại vùng chụp và làm theo hướng dẫn nín thở để hình ảnh đạt yêu cầu.",
            "Thứ Hai - Chủ Nhật, 07:00 - 17:00", true, false),

        Create("7d8af6a5-e1b9-4ee9-b7b8-56d4d9dc602e", "noi-soi-da-day-khong-gay-me", "Nội soi dạ dày không gây mê", 750000,
            DiagnosticImage,
            "**Nội soi dạ dày không gây mê** giúp bác sĩ quan sát niêm mạc đường tiêu hóa trên và thực hiện lấy mẫu khi có chỉ định.",
            "**Chuẩn bị bắt buộc**\n\n- Nhịn ăn và uống theo thời gian cơ sở hướng dẫn\n- Thông báo thuốc chống đông, dị ứng và bệnh nền\n- Mang kết quả nội soi cũ nếu có\n\nChỉ thực hiện sau khi được sàng lọc và giải thích thủ thuật.",
            "Thứ Hai - Thứ Bảy, 07:00 - 11:30", true, false),

        Create("1893e6df-8119-4f49-bdb2-3ad389c6ed62", "vat-ly-tri-lieu-phuc-hoi-van-dong", "Vật lý trị liệu phục hồi vận động", 400000,
            RehabilitationImage,
            "**Vật lý trị liệu phục hồi vận động** được xây dựng theo tình trạng chức năng, mục tiêu và khả năng đáp ứng của từng người bệnh.",
            "**Buổi đầu tiên**\n\n1. Đánh giá đau, tầm vận động và sức cơ\n2. Xác định mục tiêu phục hồi\n3. Hướng dẫn bài tập và kỹ thuật phù hợp\n4. Lập lịch đánh giá lại\n\nNên mặc trang phục thuận tiện cho vận động.",
            "Thứ Hai - Thứ Bảy, 07:30 - 17:00", true, false),

        Create("06d3f5d6-d6ea-44d8-90d1-3ad3993f8a9b", "kham-suc-khoe-tong-quat", "Khám sức khỏe tổng quát", 1200000,
            LaboratoryImage,
            "**Khám sức khỏe tổng quát** kết hợp khám lâm sàng và danh mục cận lâm sàng cơ bản để ghi nhận tình trạng sức khỏe tại thời điểm kiểm tra.\n\nDanh mục cụ thể được điều chỉnh theo tuổi, giới, tiền sử và nhu cầu.",
            "**Chuẩn bị**\n\n- Đặt lịch và xác nhận yêu cầu nhịn ăn\n- Mang giấy tờ, hồ sơ sức khỏe và đơn thuốc\n- Tránh rượu bia và vận động gắng sức trước ngày khám\n\n**Quy trình**\n\n1. Đăng ký và đo chỉ số cơ bản\n2. Lấy mẫu, chẩn đoán hình ảnh theo danh mục\n3. Khám bác sĩ và nhận tư vấn tổng hợp",
            "Thứ Hai - Thứ Bảy, 07:00 - 11:30", false, true)
    ];

    private static MedicalService Create(
        string uuid, string slug, string name, int price, string image,
        string description, string detailService, string workingHour,
        bool isInsured, bool isFeatured) => new()
    {
        Uuid = Guid.Parse(uuid),
        Image = image,
        Slug = slug,
        Name = name,
        Price = price,
        Description = description,
        DetailService = detailService,
        WorkingHour = workingHour,
        Status = BaseStatus.Active,
        IsInsured = isInsured,
        InsuranceCap = isInsured ? 1 : 0,
        IsFeatured = isFeatured,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt,
        DeletedAt = null
    };
}
