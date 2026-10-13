using api.Contract.Role;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public sealed class RoleService(DBContext dbContext)
{
    public async Task<IReadOnlyList<RoleResponse>> GetRolesAsync(
        string? q,
        BaseStatus? status,
        CancellationToken cancellationToken)
    {
        var rolesQuery = dbContext.Roles
            .AsNoTracking()
            .Where(role => role.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var pattern = $"%{q.Trim()}%";
            rolesQuery = rolesQuery.Where(role =>
                EF.Functions.ILike(role.Name, pattern) ||
                EF.Functions.ILike(role.Description, pattern));
        }

        if (status.HasValue)
        {
            rolesQuery = rolesQuery.Where(role => role.Status == status.Value);
        }

        var roles = await rolesQuery
            .OrderByDescending(role => role.UpdatedAt)
            .ThenBy(role => role.Name)
            .ToListAsync(cancellationToken);
        var roleUuids = roles.Select(role => role.Uuid).ToArray();

        var accountCounts = await dbContext.Accounts
            .AsNoTracking()
            .Where(account =>
                account.RoleUuid.HasValue &&
                roleUuids.Contains(account.RoleUuid.Value) &&
                account.DeletedAt == null)
            .GroupBy(account => account.RoleUuid!.Value)
            .Select(group => new { RoleUuid = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.RoleUuid, item => item.Count, cancellationToken);

        var permissionLookup = (await dbContext.RolePermissions
                .AsNoTracking()
                .Where(item => item.RoleUuid.HasValue && roleUuids.Contains(item.RoleUuid.Value))
                .OrderBy(item => item.PermissionUuid)
                .ThenBy(item => item.Action)
                .ToListAsync(cancellationToken))
            .GroupBy(item => item.RoleUuid!.Value)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyList<RolePermissionResponse>)group
                    .Where(item => item.PermissionUuid.HasValue)
                    .Select(item => new RolePermissionResponse(item.PermissionUuid!.Value, item.Action))
                    .ToList());

        return roles.Select(role => Map(
            role,
            accountCounts.GetValueOrDefault(role.Uuid),
            permissionLookup.GetValueOrDefault(role.Uuid, [])))
            .ToList();
    }

    public async Task<RoleResponse> CreateRoleAsync(
        CreateRoleRequest request,
        CancellationToken cancellationToken)
    {
        var name = NormalizeName(request.Name);
        await EnsureNameAvailableAsync(name, null, cancellationToken);
        var permissions = await ValidatePermissionsAsync(request.Permissions, request.Scope, cancellationToken);
        var now = DateTime.UtcNow;
        var role = new Role
        {
            Uuid = Guid.NewGuid(),
            Name = name,
            Description = request.Description.Trim(),
            IsDoctor = request.IsDoctor,
            Scope = request.Scope,
            Status = request.Status,
            CreatedAt = now,
            UpdatedAt = now
        };

        dbContext.Roles.Add(role);
        dbContext.RolePermissions.AddRange(CreateRolePermissions(role.Uuid, permissions));
        await dbContext.SaveChangesAsync(cancellationToken);
        return Map(role, 0, permissions.Select(item =>
            new RolePermissionResponse(item.PermissionUuid, item.Action)).ToList());
    }

    public async Task<RoleResponse?> UpdateRoleAsync(
        Guid uuid,
        UpdateRoleRequest request,
        CancellationToken cancellationToken)
    {
        var role = await dbContext.Roles.FirstOrDefaultAsync(
            item => item.Uuid == uuid && item.DeletedAt == null,
            cancellationToken);
        if (role is null) return null;

        var name = NormalizeName(request.Name);
        await EnsureNameAvailableAsync(name, uuid, cancellationToken);
        if (role.Scope != request.Scope && await dbContext.Accounts.AnyAsync(
                account => account.RoleUuid == uuid && account.DeletedAt == null,
                cancellationToken))
        {
            throw new InvalidOperationException(
                "Không thể thay đổi phạm vi của vai trò đang được gán cho tài khoản.");
        }

        var permissions = await ValidatePermissionsAsync(request.Permissions, request.Scope, cancellationToken);
        var currentPermissions = await dbContext.RolePermissions
            .Where(item => item.RoleUuid == uuid)
            .ToListAsync(cancellationToken);

        role.Name = name;
        role.Description = request.Description.Trim();
        role.IsDoctor = request.IsDoctor;
        role.Scope = request.Scope;
        role.Status = request.Status;
        role.UpdatedAt = DateTime.UtcNow;
        dbContext.RolePermissions.RemoveRange(currentPermissions);
        dbContext.RolePermissions.AddRange(CreateRolePermissions(uuid, permissions));
        await dbContext.SaveChangesAsync(cancellationToken);

        var accountCount = await dbContext.Accounts.CountAsync(
            account => account.RoleUuid == uuid && account.DeletedAt == null,
            cancellationToken);
        return Map(role, accountCount, permissions.Select(item =>
            new RolePermissionResponse(item.PermissionUuid, item.Action)).ToList());
    }

    public async Task<bool> DeleteRoleAsync(Guid uuid, CancellationToken cancellationToken)
    {
        var role = await dbContext.Roles.FirstOrDefaultAsync(
            item => item.Uuid == uuid && item.DeletedAt == null,
            cancellationToken);
        if (role is null) return false;

        var isInUse = await dbContext.Accounts.AnyAsync(
            account => account.RoleUuid == uuid && account.DeletedAt == null,
            cancellationToken);
        if (isInUse)
        {
            throw new InvalidOperationException(
                "Không thể xóa vai trò vì đang có tài khoản sử dụng.");
        }

        role.DeletedAt = DateTime.UtcNow;
        role.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task EnsureNameAvailableAsync(
        string name,
        Guid? excludedUuid,
        CancellationToken cancellationToken)
    {
        var exists = await dbContext.Roles.AnyAsync(
            role => role.Name.ToLower() == name.ToLower() &&
                    (!excludedUuid.HasValue || role.Uuid != excludedUuid.Value),
            cancellationToken);
        if (exists)
        {
            throw new InvalidOperationException("Tên vai trò đã tồn tại.");
        }
    }

    private async Task<IReadOnlyList<RolePermissionRequest>> ValidatePermissionsAsync(
        IReadOnlyList<RolePermissionRequest> permissions,
        AccessScope roleScope,
        CancellationToken cancellationToken)
    {
        var distinct = permissions
            .GroupBy(item => new { item.PermissionUuid, item.Action })
            .Select(group => group.First())
            .ToList();
        var permissionUuids = distinct.Select(item => item.PermissionUuid).Distinct().ToArray();
        var existingPermissions = await dbContext.Permissions
            .Where(permission => permissionUuids.Contains(permission.Uuid))
            .ToListAsync(cancellationToken);
        if (existingPermissions.Count != permissionUuids.Length)
        {
            throw new InvalidOperationException("Danh sách quyền chứa chức năng không tồn tại.");
        }

        if (roleScope == AccessScope.Hospital &&
            existingPermissions.Any(permission => permission.Scope == AccessScope.System))
        {
            throw new InvalidOperationException(
                "Vai trò theo cơ sở không được cấp quyền có phạm vi toàn hệ thống.");
        }

        return distinct;
    }

    private static IEnumerable<RolePermission> CreateRolePermissions(
        Guid roleUuid,
        IEnumerable<RolePermissionRequest> permissions) =>
        permissions.Select(item => new RolePermission
        {
            Uuid = Guid.NewGuid(),
            RoleUuid = roleUuid,
            PermissionUuid = item.PermissionUuid,
            Action = item.Action
        });

    private static string NormalizeName(string name)
    {
        var normalized = name.Trim();
        if (string.IsNullOrWhiteSpace(normalized))
        {
            throw new InvalidOperationException("Tên vai trò là bắt buộc.");
        }

        return normalized;
    }

    private static RoleResponse Map(
        Role role,
        int accountCount,
        IReadOnlyList<RolePermissionResponse> permissions) => new()
    {
        Uuid = role.Uuid,
        Name = role.Name,
        Description = role.Description,
        IsDoctor = role.IsDoctor,
        Scope = role.Scope,
        Status = role.Status,
        CreatedAt = role.CreatedAt,
        UpdatedAt = role.UpdatedAt,
        DeletedAt = role.DeletedAt,
        AccountCount = accountCount,
        Permissions = permissions
    };
}
