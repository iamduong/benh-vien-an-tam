using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SeedHospitalDepartmentMedicine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Department",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Description", "Icon", "Name", "Slug", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("044d982b-f38c-4256-8dc8-a8609fea49eb"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chẩn đoán và điều trị bệnh lý thực quản, dạ dày, ruột, gan, mật và tụy.", "/images/departments/internal-medicine.svg", "Tiêu hóa", "tieu-hoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("275f8f9c-a2f3-4367-b4ac-605a38b61a92"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Tầm soát và điều trị bệnh lý tim, mạch máu, tăng huyết áp và rối loạn nhịp.", "/images/departments/cardiology.svg", "Tim mạch", "tim-mach", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3a8d2865-ede9-4224-b8ee-7e90d9235d29"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám, chẩn đoán và theo dõi các bệnh lý nội khoa thường gặp ở người trưởng thành.", "/images/departments/internal-medicine.svg", "Nội tổng quát", "noi-tong-quat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("61e09e13-12ad-4aa5-a7bc-570b6be1e322"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám và điều trị bệnh lý não, tủy sống, dây thần kinh và cơ.", "/images/departments/internal-medicine.svg", "Thần kinh", "than-kinh", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("7ac9a12d-008a-4926-85b0-d089b6b2b6e7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Quản lý đái tháo đường và các rối loạn tuyến giáp, tuyến yên, tuyến thượng thận.", "/images/departments/internal-medicine.svg", "Nội tiết", "noi-tiet", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("9097e2b0-f4a2-4809-8e24-71c4197e8dc7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Điều trị bệnh lý cơ, xương, khớp và tư vấn phục hồi khả năng vận động.", "/images/departments/internal-medicine.svg", "Cơ Xương Khớp", "co-xuong-khop", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("930ebb0c-612f-4226-a777-2df6ed5ac466"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Đánh giá chức năng và xây dựng chương trình vật lý trị liệu, phục hồi vận động.", "/images/departments/cardiology.svg", "Phục hồi chức năng", "phuc-hoi-chuc-nang", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("94959244-65d0-4f43-9c19-f102b54f4b7a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chẩn đoán và điều trị bệnh lý tai, mũi, xoang, họng và vùng đầu cổ.", "/images/departments/pediatrics.svg", "Tai Mũi Họng", "tai-mui-hong", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("abf3d2c7-9fec-4168-9906-a96881580c38"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám, theo dõi và điều trị các bệnh lý đường thở, phổi và màng phổi.", "/images/departments/internal-medicine.svg", "Hô hấp", "ho-hap", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("baba10d4-8362-4be9-b021-14d54bee66bb"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kiểm tra thị lực, chẩn đoán và điều trị các bệnh lý nhãn khoa.", "/images/departments/internal-medicine.svg", "Mắt", "mat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("cb4ef8d3-c441-40a9-8399-e05312ce46cf"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chăm sóc sức khỏe, theo dõi tăng trưởng và điều trị bệnh lý ở trẻ em.", "/images/departments/pediatrics.svg", "Nhi khoa", "nhi-khoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("cd6b83dc-d9d8-4cb6-ab63-624793312d0e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Tầm soát, chẩn đoán và phối hợp điều trị các bệnh lý ung thư.", "/images/departments/internal-medicine.svg", "Ung bướu", "ung-buou", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("d9cd01b6-2f11-4850-b0da-2792defbccf2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám, điều trị và dự phòng các bệnh lý răng miệng, hàm và mặt.", "/images/departments/dermatology.svg", "Răng Hàm Mặt", "rang-ham-mat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("dc0b229d-7b35-4be3-8140-f7f7c24961c6"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chăm sóc thai kỳ, sức khỏe sinh sản và điều trị các bệnh lý phụ khoa.", "/images/departments/internal-medicine.svg", "Sản phụ khoa", "san-phu-khoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("dd8d50bb-e41f-4fe0-b804-0303166d51a0"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám và điều trị các vấn đề về da, tóc, móng và bệnh lây truyền qua da.", "/images/departments/dermatology.svg", "Da liễu", "da-lieu", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Hospital",
                columns: new[] { "Uuid", "Address", "CreatedAt", "DeletedAt", "Description", "DetailService", "Image", "MapUrl", "Name", "NumberOfRoom", "Slug", "Status", "UpdatedAt", "WorkingHour" },
                values: new object[,]
                {
                    { new Guid("26c92e11-d112-426b-b689-fb44e45d7052"), "284 Cống Quỳnh, phường Bến Thành, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Từ Dũ** là bệnh viện chuyên khoa phụ sản tại TP. Hồ Chí Minh, cung cấp dịch vụ chăm sóc thai kỳ, sinh nở, phụ khoa và hỗ trợ sinh sản.\n\n- Khám sản và quản lý thai\n- Khám, điều trị phụ khoa\n- Chăm sóc sơ sinh", "**Khi khám thai hoặc phụ khoa**\n\nNên mang sổ khám thai, kết quả siêu âm, xét nghiệm và danh sách thuốc đang sử dụng. Trường hợp có dấu hiệu cấp cứu sản khoa cần đến khu cấp cứu ngay, không chờ lịch hẹn.", "https://upload.wikimedia.org/wikipedia/commons/6/6c/Tu_Du_Maternity_Hospital_01.jpg", "https://www.google.com/maps?q=Benh+vien+Tu+Du&output=embed", "Bệnh viện Từ Dũ", 85, "benh-vien-tu-du", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Khám theo lịch từ Thứ Hai - Chủ Nhật; cấp cứu sản phụ khoa 24/7" },
                    { new Guid("30eb8e2a-1290-47bf-9cdb-82060c5a896e"), "1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Trung ương Quân đội 108** là bệnh viện đa khoa, chuyên khoa sâu tuyến cuối của quân đội và phục vụ người dân.\n\nCác thế mạnh gồm chấn thương chỉnh hình, tim mạch, ung bướu, đột quỵ, ghép mô và tạng.", "**Lưu ý khi đăng ký khám**\n\nNgười bệnh nên xác định khu khám phù hợp, đến trước giờ hẹn và chuẩn bị đầy đủ hồ sơ y tế. Một số kỹ thuật hoặc chuyên gia làm việc theo lịch riêng.", "https://upload.wikimedia.org/wikipedia/commons/e/e8/Benh_vien_Trung_uong_Quan_doi_108.jpg", "https://www.google.com/maps?q=Benh+vien+Trung+uong+Quan+doi+108&output=embed", "Bệnh viện Trung ương Quân đội 108", 110, "benh-vien-trung-uong-quan-doi-108", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 06:30 - 17:00; một số khu khám làm việc Thứ Bảy" },
                    { new Guid("39ae7eb7-27c9-46b2-8897-de60ee8532fd"), "1 Lý Thường Kiệt, phường Tân Sơn Nhất, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Thống Nhất** là bệnh viện đa khoa tuyến cuối tại TP. Hồ Chí Minh, có thế mạnh chăm sóc người cao tuổi và điều trị các bệnh lý nội khoa phối hợp.\n\n- Tim mạch và lão khoa\n- Nội tiết, hô hấp, tiêu hóa\n- Ngoại khoa và phục hồi chức năng", "**Lưu ý**\n\nNgười bệnh có nhiều bệnh nền nên mang đầy đủ đơn thuốc đang dùng và kết quả theo dõi gần nhất. Không tự ngưng thuốc trước buổi khám nếu chưa có hướng dẫn chuyên môn.", "https://upload.wikimedia.org/wikipedia/commons/f/f0/Hinh-anh-benh-vien-thong-nhat.jpg", "https://www.google.com/maps?q=Benh+vien+Thong+Nhat&output=embed", "Bệnh viện Thống Nhất", 95, "benh-vien-thong-nhat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 16:30; cấp cứu 24/7" },
                    { new Guid("510eb5df-e6b3-4476-b8ac-f36989949b2e"), "43 Tràng Thi, phường Cửa Nam, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Phụ sản Trung ương** là cơ sở chuyên khoa đầu ngành về sản khoa, phụ khoa, sơ sinh và hỗ trợ sinh sản.\n\nBệnh viện tiếp nhận khám định kỳ, điều trị chuyên sâu và cấp cứu sản phụ khoa.", "**Hồ sơ nên mang theo**\n\n- Sổ khám thai và phiếu siêu âm\n- Kết quả xét nghiệm gần nhất\n- Thông tin thuốc, bệnh nền và tiền sử dị ứng\n\nLịch khám chuyên gia và khám theo yêu cầu cần được xác nhận trước.", "https://upload.wikimedia.org/wikipedia/commons/e/eb/B%E1%BB%87nh_vi%E1%BB%87n_ph%E1%BB%A5_s%E1%BA%A3n_trung_%C6%B0%C6%A1ng%2C_Tri%E1%BB%87u_Qu%E1%BB%91c_%C4%90%E1%BA%A1t%2C_H%C3%A0_N%E1%BB%99i_004.JPG", "https://www.google.com/maps?q=Benh+vien+Phu+san+Trung+uong&output=embed", "Bệnh viện Phụ sản Trung ương", 70, "benh-vien-phu-san-trung-uong", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 06:30 - 16:30; khám dịch vụ theo lịch cuối tuần" },
                    { new Guid("59ef0150-3a93-4b7b-aa28-778866eede6a"), "16 Lê Lợi, phường Thuận Hóa, TP. Huế", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Trung ương Huế** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối khu vực miền Trung. Cơ sở thực hiện khám, điều trị chuyên sâu và đào tạo y khoa.\n\n- Tim mạch, đột quỵ và hồi sức\n- Ung bướu, huyết học\n- Ngoại khoa và ghép tạng", "**Trước khi đến khám**\n\nNgười bệnh nên kiểm tra đúng cơ sở, khu khám và lịch chuyên gia. Mang theo hồ sơ điều trị cũ để tránh lặp lại xét nghiệm không cần thiết khi bác sĩ có thể sử dụng kết quả còn giá trị.", "https://upload.wikimedia.org/wikipedia/commons/0/04/BV_TW_Hu%E1%BA%BF_2025.jpg", "https://www.google.com/maps?q=Benh+vien+Trung+uong+Hue&output=embed", "Bệnh viện Trung ương Huế", 115, "benh-vien-trung-uong-hue", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 17:00; cấp cứu 24/7" },
                    { new Guid("64fe32c1-af1f-4ed3-b7e9-ae588a14a560"), "78 đường Giải Phóng, phường Kim Liên, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Bạch Mai** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối tại Hà Nội. Bệnh viện tiếp nhận khám, cấp cứu và điều trị nhiều nhóm bệnh lý chuyên sâu.\n\n- Cấp cứu và hồi sức tích cực\n- Tim mạch, hô hấp, thần kinh\n- Xét nghiệm và chẩn đoán hình ảnh", "**Khi đến khám**\n\nNgười bệnh nên mang theo giấy tờ tùy thân, thẻ bảo hiểm y tế, giấy chuyển tuyến (nếu có), đơn thuốc và kết quả xét nghiệm gần nhất. Lịch của từng khoa có thể thay đổi; nên kiểm tra trên kênh chính thức trước khi đến.", "https://bachmai.gov.vn/assets/images/ad1.jpg", "https://www.google.com/maps?q=Benh+vien+Bach+Mai&output=embed", "Bệnh viện Bạch Mai", 120, "benh-vien-bach-mai", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:30 - 16:30; khám theo yêu cầu có lịch cuối tuần" },
                    { new Guid("9e70212a-f0db-49ec-8d70-f83ea9362f6d"), "341 Sư Vạn Hạnh, phường Hòa Hưng, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Nhi Đồng 1** là bệnh viện chuyên khoa nhi, tiếp nhận khám và điều trị trẻ em với nhiều chuyên khoa nội, ngoại và cấp cứu.\n\n- Nhi tổng quát và chuyên khoa\n- Cấp cứu, hồi sức nhi\n- Ngoại nhi và chăm sóc sơ sinh", "**Phụ huynh cần chuẩn bị**\n\n- Giấy khai sinh hoặc giấy tờ của trẻ\n- Thẻ bảo hiểm y tế\n- Sổ khám, đơn thuốc và thông tin dị ứng\n\nKhông tự ý cho trẻ dùng thêm thuốc trước khi được nhân viên y tế đánh giá nếu trẻ có biểu hiện bất thường.", "https://upload.wikimedia.org/wikipedia/commons/c/cb/Benh_vien_nhi_dong_1-ph%C6%B0%E1%BB%9Dng_10%2C_Qu%E1%BA%ADn_10%2C_TPHCM%2C_Vi%E1%BB%87t_Nam_-_panoramio.jpg", "https://www.google.com/maps?q=Benh+vien+Nhi+Dong+1&output=embed", "Bệnh viện Nhi Đồng 1", 80, "benh-vien-nhi-dong-1", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật theo từng khu khám; cấp cứu 24/7" },
                    { new Guid("a79a1b4f-ebb2-4bd8-b227-c8d0b0ab62ae"), "40 Tràng Thi, phường Cửa Nam, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Hữu nghị Việt Đức** là cơ sở ngoại khoa tuyến cuối, nổi bật với điều trị chấn thương, phẫu thuật tiêu hóa, thần kinh, tim mạch và ghép tạng.\n\n- Khám ngoại khoa chuyên sâu\n- Cấp cứu chấn thương\n- Phẫu thuật và phục hồi sau mổ", "**Chuẩn bị hồ sơ**\n\n- Giấy tờ tùy thân và thẻ bảo hiểm y tế\n- Giấy chuyển tuyến nếu khám đúng tuyến\n- Phim chụp, kết quả xét nghiệm và hồ sơ phẫu thuật cũ\n\nNgười bệnh cần làm theo hướng dẫn phân luồng tại khu tiếp đón.", "https://upload.wikimedia.org/wikipedia/commons/d/d0/B%E1%BB%87nh_vi%E1%BB%87n_Vi%E1%BB%87t_%C4%90%E1%BB%A9c%2C_Tr%C3%A0ng_Thi%2C_H%C3%A0_N%E1%BB%99i_002.JPG", "https://www.google.com/maps?q=Benh+vien+Huu+nghi+Viet+Duc&output=embed", "Bệnh viện Hữu nghị Việt Đức", 90, "benh-vien-huu-nghi-viet-duc", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 16:30; cấp cứu 24/7" },
                    { new Guid("b892126f-bad5-47ed-a714-1e620f12e385"), "201B Nguyễn Chí Thanh, phường Chợ Lớn, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Chợ Rẫy** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối khu vực phía Nam. Bệnh viện tiếp nhận nhiều ca bệnh nặng và cần phối hợp đa chuyên khoa.\n\n- Cấp cứu, hồi sức và chống độc\n- Tim mạch, ung bướu, huyết học\n- Ngoại khoa và ghép tạng", "**Hướng dẫn chung**\n\nNgười bệnh có lịch hẹn nên đến sớm để xác nhận thông tin. Khi khám bảo hiểm y tế, cần mang bản gốc giấy tờ liên quan và giấy chuyển tuyến còn hiệu lực nếu được yêu cầu.", "https://upload.wikimedia.org/wikipedia/commons/a/a7/C%E1%BB%95ng_b%E1%BB%87nh_vi%E1%BB%87n_Ch%E1%BB%A3_R%E1%BA%ABy_2016.jpg", "https://www.google.com/maps?q=Benh+vien+Cho+Ray&output=embed", "Bệnh viện Chợ Rẫy", 130, "benh-vien-cho-ray", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 16:00; khám dịch vụ có lịch Thứ Bảy" },
                    { new Guid("bbb8ca82-4e3d-4074-9bf7-86f1640ed0c7"), "3 đường 17A, phường An Lạc, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Quốc tế City** là bệnh viện đa khoa tại khu Y tế kỹ thuật cao Hoa Lâm Shangri-La, cung cấp khám ngoại trú, điều trị nội trú và cấp cứu.\n\n- Nội, ngoại và nhi khoa\n- Sản phụ khoa\n- Chẩn đoán hình ảnh và xét nghiệm", "**Đặt lịch khám**\n\nNgười bệnh nên xác nhận bác sĩ, chuyên khoa, chi phí dự kiến và phạm vi bảo lãnh của đơn vị bảo hiểm trước khi đến. Mang theo hồ sơ cũ để bác sĩ có đủ thông tin đánh giá.", "https://commons.wikimedia.org/wiki/Special:FilePath/City%20International%20Hospital%20Vietnam.jpg", "https://www.google.com/maps?q=City+International+Hospital+Vietnam&output=embed", "Bệnh viện Quốc tế City", 65, "benh-vien-quoc-te-city", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy theo lịch chuyên khoa; cấp cứu 24/7" }
                });

            migrationBuilder.InsertData(
                table: "Medicine",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Description", "Image", "InsuranceCap", "IsInsured", "Name", "Price", "Status", "Unit", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("036aeccd-f365-42a6-9e04-d068c7164baf"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm đau, hạ sốt; sử dụng đúng liều được hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Paracetamol 500 mg", 1200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("06cea414-bc4a-4536-bfb1-315122590d38"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc chống trầm cảm nhóm SSRI; hiệu quả và tác dụng không mong muốn cần được theo dõi.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Sertraline 50 mg", 4000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("06dd189c-9492-4587-8eff-b3c65439ea3a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Sản phẩm bổ sung vitamin C khi khẩu phần không đáp ứng đủ nhu cầu.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Vitamin C 500 mg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0a687332-e663-43ff-8ab4-359906254dab"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc ức chế bơm proton dùng trong một số bệnh lý liên quan acid dạ dày.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Esomeprazole 40 mg", 5500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0cc4ac88-1c60-48e4-90fd-b7bbb781b74c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị một số dạng đau thần kinh, sử dụng theo đơn và đánh giá đáp ứng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Pregabalin 75 mg", 8500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0e8ce2f7-692f-4070-ac51-e1ecacf6d45d"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm đau kháng viêm không steroid, dùng liều thấp nhất trong thời gian phù hợp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Meloxicam 7.5 mg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0f7e50a7-d269-41f1-bf84-71882c1e2774"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Corticosteroid dạng khí dung kiểm soát viêm đường thở, dùng theo đơn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Budesonide khí dung 0.5 mg/2 ml", 135000, 0, 3, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("116fc685-f1ec-4dfe-99a0-b0e5faf681dc"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung sắt và acid folic trong các trường hợp được xác định có nhu cầu.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Sắt fumarate + Acid folic", 2800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("1918e16c-2921-4d8e-a84f-7c7983dbe90e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bột bù nước và điện giải; pha đúng lượng nước ghi trên bao bì.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Oresol áp lực thẩm thấu thấp", 4500, 0, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("1fcb3999-4793-4381-bf96-d8d7a11d203c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dung dịch nhuận tràng thẩm thấu, liều dùng được điều chỉnh theo đáp ứng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Lactulose 3.35 g/5 ml - 100 ml", 48000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("21671875-846f-43c1-b817-5753ad9057f2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng kết tập tiểu cầu, sử dụng theo chỉ định tim mạch hoặc thần kinh.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Clopidogrel 75 mg", 5500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("2476615a-8777-4bb1-813d-6e69f3700b2b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hạ đường huyết phóng thích kéo dài; lưu ý nguy cơ hạ đường huyết.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Gliclazide MR 30 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("289aa313-b1ea-49c9-a9d6-056f55a13ab1"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Insulin tác dụng kéo dài; bảo quản và tiêm đúng kỹ thuật được hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Insulin glargine 100 IU/ml - bút 3 ml", 285000, 0, 3, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("35d71696-f7c4-4162-ac93-112b90a300c8"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng histamine hỗ trợ giảm triệu chứng dị ứng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Cetirizine 10 mg", 1200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("395bd57b-bd92-4f6b-bf40-d5932e348eb9"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dung dịch natri clorid đẳng trương dùng trong cơ sở y tế theo chỉ định.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Natri clorid 0.9% - 500 ml", 18000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3a0e5044-b2e3-4f08-8c2d-ae38329bb703"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Gel bôi ngoài da hỗ trợ giảm đau tại chỗ; không bôi lên vết thương hở.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Diclofenac gel 1% - 20 g", 29000, 0, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3b22896a-efbd-4976-b9d0-dc7eedcf1ee2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc nhuận tràng kích thích, chỉ nên dùng ngắn hạn theo hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Bisacodyl 5 mg", 900, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("55d0a06a-9934-4bff-a146-113d6a28ae46"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh nhóm macrolide, sử dụng theo chẩn đoán và đơn thuốc.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Azithromycin 500 mg", 12000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("5a815127-0801-434e-ad98-6e77c930590c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giãn phế quản dạng hít; cần được hướng dẫn kỹ thuật sử dụng bình hít.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Salbutamol bình hít 100 mcg/liều", 72000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("615f7045-5c22-44ed-b726-2b94d1718921"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dung dịch sát khuẩn dùng ngoài da; tránh dùng khi có chống chỉ định với iod.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Povidone iodine 10% - 90 ml", 24000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("61b33d56-8b3a-4c00-a13e-83979c60c950"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm tạo acid uric trong điều trị dài hạn; không dùng để cắt cơn gút cấp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Allopurinol 300 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("65af0a2b-3fa4-479c-949c-50b241d41e86"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị một số nhiễm khuẩn kỵ khí và ký sinh trùng theo chỉ định.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Metronidazole 250 mg", 900, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("6c23dad5-8938-4a06-af07-21dc9ba17978"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh phối hợp; dùng đủ liệu trình theo đơn và lưu ý tiền sử dị ứng penicillin.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Amoxicillin/Clavulanate 875/125 mg", 14500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("6e8f0bc6-92d7-4482-8533-d140d57e3186"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung kẽm theo độ tuổi, tình trạng dinh dưỡng và hướng dẫn chuyên môn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Kẽm 10 mg", 1500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("6fd78f28-5720-4299-b9f5-039691329d80"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng histamine dùng trong viêm mũi dị ứng và mày đay.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Loratadine 10 mg", 1500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("7f242f9c-380d-4125-917f-5266ea216441"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung vitamin D theo nhu cầu và hướng dẫn của nhân viên y tế.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Vitamin D3 1000 IU", 2200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("82e9b25d-d872-4aef-bc5e-22bf9e23c8b7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh penicillin, chỉ sử dụng khi có chỉ định của bác sĩ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Amoxicillin 500 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("8ab64ed5-dca4-4f0b-9b81-4f8cde3bfe00"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc dạng gói hỗ trợ điều trị triệu chứng tiêu chảy theo hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Diosmectite 3 g", 4000, 0, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("8bb56dd6-9f04-4833-9d68-4f479b308e1e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng histamine có thể gây buồn ngủ; thận trọng khi lái xe.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Chlorpheniramine 4 mg", 500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("92302b4c-4662-44b0-bbcb-ed0159e5b242"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Corticosteroid bôi da mức độ nhẹ; không tự ý bôi kéo dài hoặc trên diện rộng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Hydrocortisone cream 1% - 15 g", 32000, 0, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("92b6ae12-1264-444f-9c6b-21ad099cd8c2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc long đờm dạng gói; hòa tan hoàn toàn trước khi uống.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Acetylcysteine 200 mg", 2500, 0, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("9479e702-5a84-4690-8fc5-06012f21c751"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc dùng trong một số trường hợp gút; cần tuân thủ chặt chẽ liều kê đơn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Colchicine 1 mg", 3200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("985c68d7-8d12-45c9-b05b-17e392217dc6"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hạ cholesterol nhóm statin, dùng theo đánh giá nguy cơ tim mạch.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Rosuvastatin 10 mg", 4500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("9e5b33fc-15bd-425d-9ad1-8fa05bb266af"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm đau, kháng viêm không steroid; cần lưu ý nguy cơ trên dạ dày.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Ibuprofen 400 mg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a49b2f0a-fce2-42a4-9298-76f193da0b4f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng kết tập tiểu cầu liều thấp; chỉ dùng khi đã được đánh giá nguy cơ chảy máu.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Aspirin 81 mg", 1000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a7ad1d42-9230-407f-b23c-c8e58983166b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Hormone tuyến giáp tổng hợp; thường uống lúc đói và theo dõi xét nghiệm định kỳ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Levothyroxine 50 mcg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("b229c4c7-984c-4c42-86f7-5026e6a6923a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị đái tháo đường type 2, dùng cùng chế độ dinh dưỡng phù hợp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Metformin 500 mg", 900, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c2aaf13f-8c14-4f70-9ec0-757058723f90"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc dùng trong một số đau thần kinh và động kinh; có thể gây chóng mặt, buồn ngủ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Gabapentin 300 mg", 3500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c5b5e8b1-decf-4f59-bbd0-d2d9e72c73e7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc ức chế tiết acid dạ dày, thường dùng trước bữa ăn theo hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Omeprazole 20 mg", 1300, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c815e301-5461-4417-8f33-8130020d759f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh cephalosporin; không tự ý dùng cho nhiễm virus thông thường.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Cefuroxime 500 mg", 15000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c91ae78d-2bd4-4680-9163-69ca0d70da91"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị tăng huyết áp; cần theo dõi huyết áp và chức năng thận.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Losartan 50 mg", 2200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c99c115e-4faa-4fed-a36a-24a80a9eb8e2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung calci và vitamin D; cần lưu ý tổng lượng calci từ thực phẩm và thuốc.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Calcium carbonate 500 mg + Vitamin D3", 3500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("ca281ba6-e73b-491a-b334-861d990a6d97"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hỗ trợ điều trị buồn nôn và rối loạn vận động tiêu hóa theo chỉ định.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Domperidone 10 mg", 1600, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("d6ae74b5-74ec-43d1-853e-19d0fc5a6bbd"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hạ lipid máu nhóm statin, kết hợp chế độ ăn và theo dõi định kỳ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Atorvastatin 20 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("e4dc79f2-cfde-4db5-84b2-48688778acbc"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Siro giảm ho khan; không dùng thay thế việc đánh giá nguyên nhân ho kéo dài.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Dextromethorphan siro 15 mg/5 ml - 100 ml", 38000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f056d891-c813-4f21-aafe-c459714646be"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kem bôi kháng nấm ngoài da, dùng đủ thời gian được hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Clotrimazole cream 1% - 15 g", 28000, 0, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f85251fb-7e9d-4a1d-8e9d-c623e2752829"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm tiết acid dạ dày; thời gian sử dụng theo chỉ định chuyên môn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Pantoprazole 40 mg", 3500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f854d43f-b17f-4882-be04-131dc91c9383"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc tiêu nhầy, hỗ trợ làm loãng đờm trong bệnh lý đường hô hấp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Ambroxol 30 mg", 1200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("fb9e8dc2-196d-491c-bcc2-507d205f3876"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc chẹn beta; không tự ý ngừng đột ngột khi đang điều trị.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Bisoprolol 5 mg", 3000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("fdbbdc1a-4c2a-4617-b26b-0f9272fe3158"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc chẹn kênh canxi điều trị tăng huyết áp và một số trường hợp đau thắt ngực.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Amlodipine 5 mg", 1000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("044d982b-f38c-4256-8dc8-a8609fea49eb"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("275f8f9c-a2f3-4367-b4ac-605a38b61a92"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("3a8d2865-ede9-4224-b8ee-7e90d9235d29"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("61e09e13-12ad-4aa5-a7bc-570b6be1e322"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("7ac9a12d-008a-4926-85b0-d089b6b2b6e7"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("9097e2b0-f4a2-4809-8e24-71c4197e8dc7"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("930ebb0c-612f-4226-a777-2df6ed5ac466"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("94959244-65d0-4f43-9c19-f102b54f4b7a"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("abf3d2c7-9fec-4168-9906-a96881580c38"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("baba10d4-8362-4be9-b021-14d54bee66bb"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("cb4ef8d3-c441-40a9-8399-e05312ce46cf"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("cd6b83dc-d9d8-4cb6-ab63-624793312d0e"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("d9cd01b6-2f11-4850-b0da-2792defbccf2"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("dc0b229d-7b35-4be3-8140-f7f7c24961c6"));

            migrationBuilder.DeleteData(
                table: "Department",
                keyColumn: "Uuid",
                keyValue: new Guid("dd8d50bb-e41f-4fe0-b804-0303166d51a0"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("26c92e11-d112-426b-b689-fb44e45d7052"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("30eb8e2a-1290-47bf-9cdb-82060c5a896e"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("39ae7eb7-27c9-46b2-8897-de60ee8532fd"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("510eb5df-e6b3-4476-b8ac-f36989949b2e"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("59ef0150-3a93-4b7b-aa28-778866eede6a"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("64fe32c1-af1f-4ed3-b7e9-ae588a14a560"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("9e70212a-f0db-49ec-8d70-f83ea9362f6d"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("a79a1b4f-ebb2-4bd8-b227-c8d0b0ab62ae"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("b892126f-bad5-47ed-a714-1e620f12e385"));

            migrationBuilder.DeleteData(
                table: "Hospital",
                keyColumn: "Uuid",
                keyValue: new Guid("bbb8ca82-4e3d-4074-9bf7-86f1640ed0c7"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("036aeccd-f365-42a6-9e04-d068c7164baf"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("06cea414-bc4a-4536-bfb1-315122590d38"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("06dd189c-9492-4587-8eff-b3c65439ea3a"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("0a687332-e663-43ff-8ab4-359906254dab"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("0cc4ac88-1c60-48e4-90fd-b7bbb781b74c"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("0e8ce2f7-692f-4070-ac51-e1ecacf6d45d"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("0f7e50a7-d269-41f1-bf84-71882c1e2774"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("116fc685-f1ec-4dfe-99a0-b0e5faf681dc"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("1918e16c-2921-4d8e-a84f-7c7983dbe90e"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("1fcb3999-4793-4381-bf96-d8d7a11d203c"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("21671875-846f-43c1-b817-5753ad9057f2"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("2476615a-8777-4bb1-813d-6e69f3700b2b"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("289aa313-b1ea-49c9-a9d6-056f55a13ab1"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("35d71696-f7c4-4162-ac93-112b90a300c8"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("395bd57b-bd92-4f6b-bf40-d5932e348eb9"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("3a0e5044-b2e3-4f08-8c2d-ae38329bb703"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("3b22896a-efbd-4976-b9d0-dc7eedcf1ee2"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("55d0a06a-9934-4bff-a146-113d6a28ae46"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("5a815127-0801-434e-ad98-6e77c930590c"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("615f7045-5c22-44ed-b726-2b94d1718921"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("61b33d56-8b3a-4c00-a13e-83979c60c950"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("65af0a2b-3fa4-479c-949c-50b241d41e86"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("6c23dad5-8938-4a06-af07-21dc9ba17978"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("6e8f0bc6-92d7-4482-8533-d140d57e3186"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("6fd78f28-5720-4299-b9f5-039691329d80"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("7f242f9c-380d-4125-917f-5266ea216441"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("82e9b25d-d872-4aef-bc5e-22bf9e23c8b7"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("8ab64ed5-dca4-4f0b-9b81-4f8cde3bfe00"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("8bb56dd6-9f04-4833-9d68-4f479b308e1e"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("92302b4c-4662-44b0-bbcb-ed0159e5b242"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("92b6ae12-1264-444f-9c6b-21ad099cd8c2"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("9479e702-5a84-4690-8fc5-06012f21c751"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("985c68d7-8d12-45c9-b05b-17e392217dc6"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("9e5b33fc-15bd-425d-9ad1-8fa05bb266af"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("a49b2f0a-fce2-42a4-9298-76f193da0b4f"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("a7ad1d42-9230-407f-b23c-c8e58983166b"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("b229c4c7-984c-4c42-86f7-5026e6a6923a"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("c2aaf13f-8c14-4f70-9ec0-757058723f90"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("c5b5e8b1-decf-4f59-bbd0-d2d9e72c73e7"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("c815e301-5461-4417-8f33-8130020d759f"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("c91ae78d-2bd4-4680-9163-69ca0d70da91"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("c99c115e-4faa-4fed-a36a-24a80a9eb8e2"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("ca281ba6-e73b-491a-b334-861d990a6d97"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("d6ae74b5-74ec-43d1-853e-19d0fc5a6bbd"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("e4dc79f2-cfde-4db5-84b2-48688778acbc"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("f056d891-c813-4f21-aafe-c459714646be"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("f85251fb-7e9d-4a1d-8e9d-c623e2752829"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("f854d43f-b17f-4882-be04-131dc91c9383"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("fb9e8dc2-196d-491c-bcc2-507d205f3876"));

            migrationBuilder.DeleteData(
                table: "Medicine",
                keyColumn: "Uuid",
                keyValue: new Guid("fdbbdc1a-4c2a-4617-b26b-0f9272fe3158"));
        }
    }
}
