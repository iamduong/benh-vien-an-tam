using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public sealed class PermissionService(
    DBContext dbContext
)
{
    public async Task<IReadOnlyList<Permission>> GetPermissionsAsync(
        AccessScope? scope,
        CancellationToken cancellationToken
    )
    {
        var query = dbContext.Permissions.AsNoTracking();
        if (scope.HasValue)
        {
            query = query.Where(permission => permission.Scope == scope.Value);
        }

        var permissions = await query
            .OrderBy(permission => permission.Description)
            .ThenBy(permission => permission.Name)
            .ToListAsync(cancellationToken);

        return permissions;
    }
}
