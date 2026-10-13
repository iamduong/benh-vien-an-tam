using api.Model;

namespace api.Data.Seed;

public static class RoleSeed
{
    public static IReadOnlyList<Role> Roles { get; } = 
    [
        new Role {
            Uuid = Guid.Parse("ac448f86-bbf0-416f-95d0-8a32008880a8"),
            Name = "Quản trị hệ thống",
            Description = "Quản lý toàn bộ hệ thống",
            IsDoctor = false,
            Scope = Model.Enum.AccessScope.System,
            Status = Model.Enum.BaseStatus.Active
        },
        new Role {
            Uuid = Guid.Parse("0811c3b0-f5b6-4572-a136-45b791696ca7"),
            Name = "Vận hành chi nhánh",
            Description = "Quản trị viên hệ thống bệnh viện",
            IsDoctor = false,
            Scope = Model.Enum.AccessScope.Hospital,
            Status = Model.Enum.BaseStatus.Active
        },  
        new Role {
            Uuid = Guid.Parse("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f"),
            Name = "Bác sĩ",
            Description = "Khám, chữa bệnh và kê đơn thuốc",
            IsDoctor = true,
            Scope = Model.Enum.AccessScope.Hospital,
            Status = Model.Enum.BaseStatus.Active
        }, 
        new Role {
            Uuid = Guid.Parse("ef26813a-7ab9-435c-b5c5-86325dd14946"),
            Name = "Lễ tân",
            Description = "Tiếp nhận khách hàng, hỗ trợ thanh toán hóa đơn",
            IsDoctor = false,
            Scope = Model.Enum.AccessScope.Hospital,
            Status = Model.Enum.BaseStatus.Active
        },   
        new Role {
            Uuid = Guid.Parse("5264371e-ea25-47a3-ae34-b10d6a4b5c31"),
            Name = "Quản lý kho",
            Description = "Quản lý kho bệnh viện",
            IsDoctor = false,
            Scope = Model.Enum.AccessScope.Hospital,
            Status = Model.Enum.BaseStatus.Active
        }
    ];
}
