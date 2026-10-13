using api.Model.Enum;

namespace api.Contract.Role;

public sealed record RolePermissionResponse(
    Guid PermissionUuid,
    PermissionAction Action);

public sealed class RoleResponse
{
    public Guid Uuid { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public bool IsDoctor { get; init; }
    public AccessScope Scope { get; init; }
    public BaseStatus Status { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public DateTime? DeletedAt { get; init; }
    public int AccountCount { get; init; }
    public IReadOnlyList<RolePermissionResponse> Permissions { get; init; } = [];
}
