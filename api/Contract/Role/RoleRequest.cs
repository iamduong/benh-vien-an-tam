using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Contract.Role;

public sealed class RolePermissionRequest
{
    public Guid PermissionUuid { get; init; }

    [EnumDataType(typeof(PermissionAction))]
    public PermissionAction Action { get; init; }
}

public class RoleRequest
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; init; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; init; } = string.Empty;

    public bool IsDoctor { get; init; }

    [EnumDataType(typeof(AccessScope))]
    public AccessScope Scope { get; init; } = AccessScope.Hospital;

    [EnumDataType(typeof(BaseStatus))]
    public BaseStatus Status { get; init; } = BaseStatus.Active;

    public IReadOnlyList<RolePermissionRequest> Permissions { get; init; } = [];
}

public sealed class CreateRoleRequest : RoleRequest;

public sealed class UpdateRoleRequest : RoleRequest;
