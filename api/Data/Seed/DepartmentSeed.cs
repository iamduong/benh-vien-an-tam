using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class DepartmentSeed
{
    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static IReadOnlyList<Department> Departments { get; } =
    [
        Create("3a8d2865-ede9-4224-b8ee-7e90d9235d29", "noi-tong-quat", "Nội tổng quát", "/images/departments/internal-medicine.svg", "Khám, chẩn đoán và theo dõi các bệnh lý nội khoa thường gặp ở người trưởng thành."),
        Create("275f8f9c-a2f3-4367-b4ac-605a38b61a92", "tim-mach", "Tim mạch", "/images/departments/cardiology.svg", "Tầm soát và điều trị bệnh lý tim, mạch máu, tăng huyết áp và rối loạn nhịp."),
        Create("cb4ef8d3-c441-40a9-8399-e05312ce46cf", "nhi-khoa", "Nhi khoa", "/images/departments/pediatrics.svg", "Chăm sóc sức khỏe, theo dõi tăng trưởng và điều trị bệnh lý ở trẻ em."),
        Create("dd8d50bb-e41f-4fe0-b804-0303166d51a0", "da-lieu", "Da liễu", "/images/departments/dermatology.svg", "Khám và điều trị các vấn đề về da, tóc, móng và bệnh lây truyền qua da."),
        Create("dc0b229d-7b35-4be3-8140-f7f7c24961c6", "san-phu-khoa", "Sản phụ khoa", "/images/departments/internal-medicine.svg", "Chăm sóc thai kỳ, sức khỏe sinh sản và điều trị các bệnh lý phụ khoa."),
        Create("94959244-65d0-4f43-9c19-f102b54f4b7a", "tai-mui-hong", "Tai Mũi Họng", "/images/departments/pediatrics.svg", "Chẩn đoán và điều trị bệnh lý tai, mũi, xoang, họng và vùng đầu cổ."),
        Create("d9cd01b6-2f11-4850-b0da-2792defbccf2", "rang-ham-mat", "Răng Hàm Mặt", "/images/departments/dermatology.svg", "Khám, điều trị và dự phòng các bệnh lý răng miệng, hàm và mặt."),
        Create("baba10d4-8362-4be9-b021-14d54bee66bb", "mat", "Mắt", "/images/departments/internal-medicine.svg", "Kiểm tra thị lực, chẩn đoán và điều trị các bệnh lý nhãn khoa."),
        Create("9097e2b0-f4a2-4809-8e24-71c4197e8dc7", "co-xuong-khop", "Cơ Xương Khớp", "/images/departments/internal-medicine.svg", "Điều trị bệnh lý cơ, xương, khớp và tư vấn phục hồi khả năng vận động."),
        Create("61e09e13-12ad-4aa5-a7bc-570b6be1e322", "than-kinh", "Thần kinh", "/images/departments/internal-medicine.svg", "Khám và điều trị bệnh lý não, tủy sống, dây thần kinh và cơ."),
        Create("044d982b-f38c-4256-8dc8-a8609fea49eb", "tieu-hoa", "Tiêu hóa", "/images/departments/internal-medicine.svg", "Chẩn đoán và điều trị bệnh lý thực quản, dạ dày, ruột, gan, mật và tụy."),
        Create("abf3d2c7-9fec-4168-9906-a96881580c38", "ho-hap", "Hô hấp", "/images/departments/internal-medicine.svg", "Khám, theo dõi và điều trị các bệnh lý đường thở, phổi và màng phổi."),
        Create("7ac9a12d-008a-4926-85b0-d089b6b2b6e7", "noi-tiet", "Nội tiết", "/images/departments/internal-medicine.svg", "Quản lý đái tháo đường và các rối loạn tuyến giáp, tuyến yên, tuyến thượng thận."),
        Create("cd6b83dc-d9d8-4cb6-ab63-624793312d0e", "ung-buou", "Ung bướu", "/images/departments/internal-medicine.svg", "Tầm soát, chẩn đoán và phối hợp điều trị các bệnh lý ung thư."),
        Create("930ebb0c-612f-4226-a777-2df6ed5ac466", "phuc-hoi-chuc-nang", "Phục hồi chức năng", "/images/departments/cardiology.svg", "Đánh giá chức năng và xây dựng chương trình vật lý trị liệu, phục hồi vận động.")
    ];

    private static Department Create(string uuid, string slug, string name, string icon, string description) => new()
    {
        Uuid = Guid.Parse(uuid),
        Icon = icon,
        Slug = slug,
        Name = name,
        Description = description,
        Status = BaseStatus.Active,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt,
        DeletedAt = null
    };
}
