using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class HospitalSeed
{
    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static IReadOnlyList<Hospital> Hospitals { get; } =
    [
        Create("64fe32c1-af1f-4ed3-b7e9-ae588a14a560", "benh-vien-bach-mai", "Bệnh viện Bạch Mai",
            "78 đường Giải Phóng, phường Kim Liên, Hà Nội", 120,
            "https://bachmai.gov.vn/assets/images/ad1.jpg",
            "https://www.google.com/maps?q=Benh+vien+Bach+Mai&output=embed",
            "**Bệnh viện Bạch Mai** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối tại Hà Nội. Bệnh viện tiếp nhận khám, cấp cứu và điều trị nhiều nhóm bệnh lý chuyên sâu.\n\n- Cấp cứu và hồi sức tích cực\n- Tim mạch, hô hấp, thần kinh\n- Xét nghiệm và chẩn đoán hình ảnh",
            "**Khi đến khám**\n\nNgười bệnh nên mang theo giấy tờ tùy thân, thẻ bảo hiểm y tế, giấy chuyển tuyến (nếu có), đơn thuốc và kết quả xét nghiệm gần nhất. Lịch của từng khoa có thể thay đổi; nên kiểm tra trên kênh chính thức trước khi đến.",
            "Thứ Hai - Thứ Sáu, 07:30 - 16:30; khám theo yêu cầu có lịch cuối tuần"),

        Create("a79a1b4f-ebb2-4bd8-b227-c8d0b0ab62ae", "benh-vien-huu-nghi-viet-duc", "Bệnh viện Hữu nghị Việt Đức",
            "40 Tràng Thi, phường Cửa Nam, Hà Nội", 90,
            "https://upload.wikimedia.org/wikipedia/commons/d/d0/B%E1%BB%87nh_vi%E1%BB%87n_Vi%E1%BB%87t_%C4%90%E1%BB%A9c%2C_Tr%C3%A0ng_Thi%2C_H%C3%A0_N%E1%BB%99i_002.JPG",
            "https://www.google.com/maps?q=Benh+vien+Huu+nghi+Viet+Duc&output=embed",
            "**Bệnh viện Hữu nghị Việt Đức** là cơ sở ngoại khoa tuyến cuối, nổi bật với điều trị chấn thương, phẫu thuật tiêu hóa, thần kinh, tim mạch và ghép tạng.\n\n- Khám ngoại khoa chuyên sâu\n- Cấp cứu chấn thương\n- Phẫu thuật và phục hồi sau mổ",
            "**Chuẩn bị hồ sơ**\n\n- Giấy tờ tùy thân và thẻ bảo hiểm y tế\n- Giấy chuyển tuyến nếu khám đúng tuyến\n- Phim chụp, kết quả xét nghiệm và hồ sơ phẫu thuật cũ\n\nNgười bệnh cần làm theo hướng dẫn phân luồng tại khu tiếp đón.",
            "Thứ Hai - Thứ Sáu, 07:00 - 16:30; cấp cứu 24/7"),

        Create("30eb8e2a-1290-47bf-9cdb-82060c5a896e", "benh-vien-trung-uong-quan-doi-108", "Bệnh viện Trung ương Quân đội 108",
            "1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội", 110,
            "https://upload.wikimedia.org/wikipedia/commons/e/e8/Benh_vien_Trung_uong_Quan_doi_108.jpg",
            "https://www.google.com/maps?q=Benh+vien+Trung+uong+Quan+doi+108&output=embed",
            "**Bệnh viện Trung ương Quân đội 108** là bệnh viện đa khoa, chuyên khoa sâu tuyến cuối của quân đội và phục vụ người dân.\n\nCác thế mạnh gồm chấn thương chỉnh hình, tim mạch, ung bướu, đột quỵ, ghép mô và tạng.",
            "**Lưu ý khi đăng ký khám**\n\nNgười bệnh nên xác định khu khám phù hợp, đến trước giờ hẹn và chuẩn bị đầy đủ hồ sơ y tế. Một số kỹ thuật hoặc chuyên gia làm việc theo lịch riêng.",
            "Thứ Hai - Thứ Sáu, 06:30 - 17:00; một số khu khám làm việc Thứ Bảy"),

        Create("b892126f-bad5-47ed-a714-1e620f12e385", "benh-vien-cho-ray", "Bệnh viện Chợ Rẫy",
            "201B Nguyễn Chí Thanh, phường Chợ Lớn, TP. Hồ Chí Minh", 130,
            "https://upload.wikimedia.org/wikipedia/commons/a/a7/C%E1%BB%95ng_b%E1%BB%87nh_vi%E1%BB%87n_Ch%E1%BB%A3_R%E1%BA%ABy_2016.jpg",
            "https://www.google.com/maps?q=Benh+vien+Cho+Ray&output=embed",
            "**Bệnh viện Chợ Rẫy** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối khu vực phía Nam. Bệnh viện tiếp nhận nhiều ca bệnh nặng và cần phối hợp đa chuyên khoa.\n\n- Cấp cứu, hồi sức và chống độc\n- Tim mạch, ung bướu, huyết học\n- Ngoại khoa và ghép tạng",
            "**Hướng dẫn chung**\n\nNgười bệnh có lịch hẹn nên đến sớm để xác nhận thông tin. Khi khám bảo hiểm y tế, cần mang bản gốc giấy tờ liên quan và giấy chuyển tuyến còn hiệu lực nếu được yêu cầu.",
            "Thứ Hai - Thứ Sáu, 07:00 - 16:00; khám dịch vụ có lịch Thứ Bảy"),

        Create("26c92e11-d112-426b-b689-fb44e45d7052", "benh-vien-tu-du", "Bệnh viện Từ Dũ",
            "284 Cống Quỳnh, phường Bến Thành, TP. Hồ Chí Minh", 85,
            "https://upload.wikimedia.org/wikipedia/commons/6/6c/Tu_Du_Maternity_Hospital_01.jpg",
            "https://www.google.com/maps?q=Benh+vien+Tu+Du&output=embed",
            "**Bệnh viện Từ Dũ** là bệnh viện chuyên khoa phụ sản tại TP. Hồ Chí Minh, cung cấp dịch vụ chăm sóc thai kỳ, sinh nở, phụ khoa và hỗ trợ sinh sản.\n\n- Khám sản và quản lý thai\n- Khám, điều trị phụ khoa\n- Chăm sóc sơ sinh",
            "**Khi khám thai hoặc phụ khoa**\n\nNên mang sổ khám thai, kết quả siêu âm, xét nghiệm và danh sách thuốc đang sử dụng. Trường hợp có dấu hiệu cấp cứu sản khoa cần đến khu cấp cứu ngay, không chờ lịch hẹn.",
            "Khám theo lịch từ Thứ Hai - Chủ Nhật; cấp cứu sản phụ khoa 24/7"),

        Create("9e70212a-f0db-49ec-8d70-f83ea9362f6d", "benh-vien-nhi-dong-1", "Bệnh viện Nhi Đồng 1",
            "341 Sư Vạn Hạnh, phường Hòa Hưng, TP. Hồ Chí Minh", 80,
            "https://upload.wikimedia.org/wikipedia/commons/c/cb/Benh_vien_nhi_dong_1-ph%C6%B0%E1%BB%9Dng_10%2C_Qu%E1%BA%ADn_10%2C_TPHCM%2C_Vi%E1%BB%87t_Nam_-_panoramio.jpg",
            "https://www.google.com/maps?q=Benh+vien+Nhi+Dong+1&output=embed",
            "**Bệnh viện Nhi Đồng 1** là bệnh viện chuyên khoa nhi, tiếp nhận khám và điều trị trẻ em với nhiều chuyên khoa nội, ngoại và cấp cứu.\n\n- Nhi tổng quát và chuyên khoa\n- Cấp cứu, hồi sức nhi\n- Ngoại nhi và chăm sóc sơ sinh",
            "**Phụ huynh cần chuẩn bị**\n\n- Giấy khai sinh hoặc giấy tờ của trẻ\n- Thẻ bảo hiểm y tế\n- Sổ khám, đơn thuốc và thông tin dị ứng\n\nKhông tự ý cho trẻ dùng thêm thuốc trước khi được nhân viên y tế đánh giá nếu trẻ có biểu hiện bất thường.",
            "Thứ Hai - Chủ Nhật theo từng khu khám; cấp cứu 24/7"),

        Create("59ef0150-3a93-4b7b-aa28-778866eede6a", "benh-vien-trung-uong-hue", "Bệnh viện Trung ương Huế",
            "16 Lê Lợi, phường Thuận Hóa, TP. Huế", 115,
            "https://upload.wikimedia.org/wikipedia/commons/0/04/BV_TW_Hu%E1%BA%BF_2025.jpg",
            "https://www.google.com/maps?q=Benh+vien+Trung+uong+Hue&output=embed",
            "**Bệnh viện Trung ương Huế** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối khu vực miền Trung. Cơ sở thực hiện khám, điều trị chuyên sâu và đào tạo y khoa.\n\n- Tim mạch, đột quỵ và hồi sức\n- Ung bướu, huyết học\n- Ngoại khoa và ghép tạng",
            "**Trước khi đến khám**\n\nNgười bệnh nên kiểm tra đúng cơ sở, khu khám và lịch chuyên gia. Mang theo hồ sơ điều trị cũ để tránh lặp lại xét nghiệm không cần thiết khi bác sĩ có thể sử dụng kết quả còn giá trị.",
            "Thứ Hai - Thứ Sáu, 07:00 - 17:00; cấp cứu 24/7"),

        Create("510eb5df-e6b3-4476-b8ac-f36989949b2e", "benh-vien-phu-san-trung-uong", "Bệnh viện Phụ sản Trung ương",
            "43 Tràng Thi, phường Cửa Nam, Hà Nội", 70,
            "https://upload.wikimedia.org/wikipedia/commons/e/eb/B%E1%BB%87nh_vi%E1%BB%87n_ph%E1%BB%A5_s%E1%BA%A3n_trung_%C6%B0%C6%A1ng%2C_Tri%E1%BB%87u_Qu%E1%BB%91c_%C4%90%E1%BA%A1t%2C_H%C3%A0_N%E1%BB%99i_004.JPG",
            "https://www.google.com/maps?q=Benh+vien+Phu+san+Trung+uong&output=embed",
            "**Bệnh viện Phụ sản Trung ương** là cơ sở chuyên khoa đầu ngành về sản khoa, phụ khoa, sơ sinh và hỗ trợ sinh sản.\n\nBệnh viện tiếp nhận khám định kỳ, điều trị chuyên sâu và cấp cứu sản phụ khoa.",
            "**Hồ sơ nên mang theo**\n\n- Sổ khám thai và phiếu siêu âm\n- Kết quả xét nghiệm gần nhất\n- Thông tin thuốc, bệnh nền và tiền sử dị ứng\n\nLịch khám chuyên gia và khám theo yêu cầu cần được xác nhận trước.",
            "Thứ Hai - Thứ Sáu, 06:30 - 16:30; khám dịch vụ theo lịch cuối tuần"),

        Create("39ae7eb7-27c9-46b2-8897-de60ee8532fd", "benh-vien-thong-nhat", "Bệnh viện Thống Nhất",
            "1 Lý Thường Kiệt, phường Tân Sơn Nhất, TP. Hồ Chí Minh", 95,
            "https://upload.wikimedia.org/wikipedia/commons/f/f0/Hinh-anh-benh-vien-thong-nhat.jpg",
            "https://www.google.com/maps?q=Benh+vien+Thong+Nhat&output=embed",
            "**Bệnh viện Thống Nhất** là bệnh viện đa khoa tuyến cuối tại TP. Hồ Chí Minh, có thế mạnh chăm sóc người cao tuổi và điều trị các bệnh lý nội khoa phối hợp.\n\n- Tim mạch và lão khoa\n- Nội tiết, hô hấp, tiêu hóa\n- Ngoại khoa và phục hồi chức năng",
            "**Lưu ý**\n\nNgười bệnh có nhiều bệnh nền nên mang đầy đủ đơn thuốc đang dùng và kết quả theo dõi gần nhất. Không tự ngưng thuốc trước buổi khám nếu chưa có hướng dẫn chuyên môn.",
            "Thứ Hai - Thứ Sáu, 07:00 - 16:30; cấp cứu 24/7"),

        Create("bbb8ca82-4e3d-4074-9bf7-86f1640ed0c7", "benh-vien-quoc-te-city", "Bệnh viện Quốc tế City",
            "3 đường 17A, phường An Lạc, TP. Hồ Chí Minh", 65,
            "https://commons.wikimedia.org/wiki/Special:FilePath/City%20International%20Hospital%20Vietnam.jpg",
            "https://www.google.com/maps?q=City+International+Hospital+Vietnam&output=embed",
            "**Bệnh viện Quốc tế City** là bệnh viện đa khoa tại khu Y tế kỹ thuật cao Hoa Lâm Shangri-La, cung cấp khám ngoại trú, điều trị nội trú và cấp cứu.\n\n- Nội, ngoại và nhi khoa\n- Sản phụ khoa\n- Chẩn đoán hình ảnh và xét nghiệm",
            "**Đặt lịch khám**\n\nNgười bệnh nên xác nhận bác sĩ, chuyên khoa, chi phí dự kiến và phạm vi bảo lãnh của đơn vị bảo hiểm trước khi đến. Mang theo hồ sơ cũ để bác sĩ có đủ thông tin đánh giá.",
            "Thứ Hai - Thứ Bảy theo lịch chuyên khoa; cấp cứu 24/7")
    ];

    private static Hospital Create(
        string uuid, string slug, string name, string address, int numberOfRoom,
        string image, string mapUrl, string description, string detailService, string workingHour) => new()
    {
        Uuid = Guid.Parse(uuid),
        Image = image,
        MapUrl = mapUrl,
        Slug = slug,
        Name = name,
        Address = address,
        NumberOfRoom = numberOfRoom,
        Description = description,
        DetailService = detailService,
        WorkingHour = workingHour,
        Status = BaseStatus.Active,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt,
        DeletedAt = null
    };
}
