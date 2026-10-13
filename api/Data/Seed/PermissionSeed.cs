using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class PermissionSeed
{
    public static IReadOnlyList<Permission> Permissions { get; } =
    [
        // Nhóm quản trị hệ thống
        Create(Guid.Parse("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), "dashboard", "tong-quan-he-thong", "Tổng quan hệ thống", "Quản trị hệ thống"),
        Create(Guid.Parse("772f59fb-5ba1-4a7b-b80c-b7a46f9fbbc2"), "hospital", "co-so-y-te", "Cơ sở y tế", "Quản trị hệ thống"),
        Create(Guid.Parse("7328d282-a103-4dda-878f-6bef13cabd64"), "department", "chuyen-khoa", "Chuyên khoa", "Quản trị hệ thống"),
        Create(Guid.Parse("519e14cf-63d5-426d-8e1d-c069dfd4d780"), "service", "dich-vu", "Dịch vụ", "Quản trị hệ thống"),
        Create(Guid.Parse("6d32f7d6-e898-4bed-914f-2b9cda821a5f"), "medicine", "thuoc", "Danh mục thuốc", "Quản trị hệ thống"),
        Create(Guid.Parse("df8fc1d9-d239-4923-b0a9-613519e8ec36"), "account", "tai-khoan", "Tài khoản", "Quản trị hệ thống"),
        Create(Guid.Parse("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), "report", "bao-cao-he-thong", "Báo cáo hệ thống", "Quản trị hệ thống"),
        Create(Guid.Parse("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), "audit", "nhat-ky-he-thong", "Nhật ký hệ thống", "Quản trị hệ thống"),
        Create(Guid.Parse("5ec6258d-0ba0-40bf-843c-39b90e22a261"), "schedule", "khung-gio-lam-viec", "Khung giờ làm việc", "Quản trị hệ thống"),
        Create(Guid.Parse("6a64941b-93ae-4e14-a65d-a89a904b2c36"), "permission", "phan-quyen", "Vai trò & quyền hạn", "Quản trị hệ thống"),

        // Vận hành chi nhánh - Cần Hospital Uuid
        Create(Guid.Parse("e2767a1f-f32c-40dc-86ae-b582f114e453"), "dashboard", "tong-quan-chi-nhanh", "Tổng quan chi nhánh", "Vận hành chi nhánh"),
        Create(Guid.Parse("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), "hospital", "thong-tin-chi-nhanh", "Thông tin chi nhánh", "Vận hành chi nhánh"),
        Create(Guid.Parse("eee59a00-8cc0-4f04-a467-d6efb46f7692"), "department", "chuyen-khoa-dich-vu", "Chuyên khoa & dịch vụ", "Vận hành chi nhánh"),
        Create(Guid.Parse("c27f7f8a-1397-4c16-9649-b301ada7842f"), "room", "phong-kham-chi-nhanh", "Phòng khám", "Vận hành chi nhánh"),
        Create(Guid.Parse("869dd7d5-cc15-4651-b565-d001a813bc41"), "account", "nhan-su", "Nhân sự", "Vận hành chi nhánh"),
        Create(Guid.Parse("7fab88c2-fb9c-435c-b218-4fedbbae1a78"), "appointment", "lich-hen-chi-nhanh", "Lịch hẹn", "Vận hành chi nhánh"),
        Create(Guid.Parse("ef48a2e3-5f42-44d5-a3b9-68853f2db70d"), "prescription", "don-thuoc-chi-nhanh", "Đơn thuốc", "Vận hành chi nhánh"),
        Create(Guid.Parse("52edd052-303c-462a-9a27-70bd3c37cbcf"), "inventory", "kho-thuoc", "Kho thuốc", "Vận hành chi nhánh"),
        Create(Guid.Parse("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), "review", "danh-gia-chi-nhanh", "Đánh giá", "Vận hành chi nhánh"),
        Create(Guid.Parse("d906ec34-3b76-4827-b3c2-9b2dd800c718"), "report", "bao-cao-chi-nhanh", "Báo cáo", "Vận hành chi nhánh"),
        Create(Guid.Parse("69f59a3e-4d01-44fa-817a-5ff8e1ba4208"), "audit", "nhat-ky-chi-nhanh", "Nhật ký hoạt động", "Vận hành chi nhánh"),
        Create(Guid.Parse("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), "schedule", "gio-lam-viec-benh-vien", "Giờ làm việc bệnh viện", "Vận hành chi nhánh"),

        // Khám chữa bệnh - Cần Hospitall Uuid
        Create(Guid.Parse("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), "dashboard", "tong-quan-bac-si", "Tổng quan bác sĩ", "Khám chữa bệnh"),
        Create(Guid.Parse("88d3176b-809d-45ab-b229-09e62768f26c"), "appointment", "lich-kham", "Lịch khám", "Khám chữa bệnh"),
        Create(Guid.Parse("abc18357-8581-414d-a48e-5d9e6672a688"), "patient", "ca-kham", "Ca khám", "Khám chữa bệnh"),
        Create(Guid.Parse("b10b0ded-d0f9-4682-baae-5df3c36933b5"), "prescription", "don-thuoc-bac-si", "Đơn thuốc", "Khám chữa bệnh"),
        Create(Guid.Parse("2e1486a8-fa76-47a5-a36a-02df91b7c813"), "medicine", "thuoc-kha-dung", "Thuốc khả dụng", "Khám chữa bệnh"),
        Create(Guid.Parse("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), "profile", "ho-so-nghe-nghiep", "Hồ sơ nghề nghiệp", "Khám chữa bệnh"),
        Create(Guid.Parse("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), "schedule", "gio-lam-viec-bac-si", "Giờ làm việc", "Khám chữa bệnh"),

        // Tiếp nhận và điều phối - Cần Hospitall Uuid
        Create(Guid.Parse("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), "dashboard", "tong-quan-tiep-nhan", "Tổng quan lễ tân", "Tiếp nhận và điều phối"),
        Create(Guid.Parse("e8adca19-51ca-4815-809b-20eab76e1d20"), "appointment", "lich-hen-tiep-nhan", "Lịch hẹn", "Tiếp nhận và điều phối"),
        Create(Guid.Parse("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), "patient", "tiep-nhan", "Tiếp nhận", "Tiếp nhận và điều phối"),
        Create(Guid.Parse("8f39ace5-80cf-4f90-9d2d-7ac3e0e4c247"), "room", "phong-kham-tiep-nhan", "Phòng khám", "Tiếp nhận và điều phối"),
        Create(Guid.Parse("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), "payment", "thanh-toan-cap-thuoc", "Thanh toán & cấp thuốc", "Tiếp nhận và điều phối"),
        Create(Guid.Parse("fb8ec9b7-1625-4eba-bb6e-14893287cda4"), "review", "danh-gia-tiep-nhan", "Đánh giá", "Tiếp nhận và điều phối"),

        // Kho thuốc - Cần Hospitall Uuid
        Create(Guid.Parse("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), "dashboard", "tong-quan-kho", "Tổng quan kho thuốc", "Kho thuốc"),
        Create(Guid.Parse("892e4dbf-a00f-4759-a676-39d5681f8542"), "inventory", "ton-kho", "Tồn kho", "Kho thuốc"),
        Create(Guid.Parse("df01b115-6849-4a46-906b-79339166b797"), "provider", "nha-cung-cap", "Nhà cung cấp", "Kho thuốc"),
        Create(Guid.Parse("952d3443-6ca0-4001-a67e-5547b2c57f3c"), "ticket", "phieu-nhap-xuat", "Phiếu nhập xuất", "Kho thuốc"),
        Create(Guid.Parse("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), "medicine", "dieu-chinh-ton", "Điều chỉnh tồn", "Kho thuốc"),
        Create(Guid.Parse("3a8ded95-de99-4ba7-98e6-147328997e06"), "history", "lich-su", "Lịch sử kho", "Kho thuốc"),
        Create(Guid.Parse("ce817bab-056f-4f1f-a31b-22f294eae961"), "report", "bao-cao-kho", "Báo cáo kho", "Kho thuốc"),
    ];

    private static Permission Create(
        Guid uuid,
        string icon,
        string slug,
        string name,
        string description) => new()
    {
        Uuid = uuid,
        Icon = icon,
        Slug = slug,
        Name = name,
        Description = description,
        Scope = description == "Quản trị hệ thống" ? AccessScope.System : AccessScope.Hospital
    };
}
