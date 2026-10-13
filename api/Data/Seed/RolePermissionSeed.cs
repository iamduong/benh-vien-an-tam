using System.Security.Cryptography;
using System.Text;
using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class RolePermissionSeed
{
    private static readonly PermissionAction[] Actions = Enum.GetValues<PermissionAction>();

    private static readonly IReadOnlyDictionary<string, Guid> RoleByPermissionGroup =
        new Dictionary<string, Guid>
        {
            ["Quản trị hệ thống"] = Guid.Parse("ac448f86-bbf0-416f-95d0-8a32008880a8"),
            ["Vận hành chi nhánh"] = Guid.Parse("0811c3b0-f5b6-4572-a136-45b791696ca7"),
            ["Khám chữa bệnh"] = Guid.Parse("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f"),
            ["Tiếp nhận và điều phối"] = Guid.Parse("ef26813a-7ab9-435c-b5c5-86325dd14946"),
            ["Kho thuốc"] = Guid.Parse("5264371e-ea25-47a3-ae34-b10d6a4b5c31")
        };

    public static IReadOnlyList<RolePermission> RolePermissions { get; } =
        PermissionSeed.Permissions
            .SelectMany(permission => Create(
                GetRoleUuid(permission.Description),
                permission.Uuid))
            .ToArray();

    private static IEnumerable<RolePermission> Create(Guid roleUuid, Guid permissionUuid)
    {
        return Actions.Select(action => new RolePermission
        {
            Uuid = CreateDeterministicUuid(roleUuid, permissionUuid, action),
            RoleUuid = roleUuid,
            PermissionUuid = permissionUuid,
            Action = action
        });
    }

    private static Guid GetRoleUuid(string permissionGroup)
    {
        if (RoleByPermissionGroup.TryGetValue(permissionGroup, out var roleUuid))
        {
            return roleUuid;
        }

        throw new InvalidOperationException(
            $"Permission group '{permissionGroup}' has not been mapped to a role.");
    }

    private static Guid CreateDeterministicUuid(
        Guid roleUuid,
        Guid permissionUuid,
        PermissionAction action)
    {
        var value = $"{roleUuid:N}:{permissionUuid:N}:{(int)action}";
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return new Guid(hash.AsSpan(0, 16));
    }
}
