using System.Security.Claims;
using api.Contract;
using api.Contract.Sidebar;
using api.Lib;
using api.Model.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller;

[ApiController]
[Route("api/sidebar")]
public sealed class SidebarController(DBContext dbContext, Jwt jwt) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetSidebar(CancellationToken cancellationToken)
    {
        if (!Request.Cookies.TryGetValue("access_token", out var accessToken))
        {
            return ApiResponse<SidebarResponse>.Unauthorized("Chưa đăng nhập");
        }

        var principal = jwt.ValidateAccessToken(accessToken);
        if (principal is null ||
            !Guid.TryParse(principal.FindFirstValue("uuid"), out var accountUuid))
        {
            return ApiResponse<SidebarResponse>.Unauthorized("Access token không hợp lệ");
        }

        var account = await dbContext.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(
                item => item.Uuid == accountUuid &&
                        item.DeletedAt == null &&
                        item.Status == BaseStatus.Active,
                cancellationToken);

        if (account?.RoleUuid is null)
        {
            return ApiResponse<SidebarResponse>.Forbidden("Tài khoản không có vai trò nội bộ");
        }

        var role = await dbContext.Roles
            .AsNoTracking()
            .SingleOrDefaultAsync(
                item => item.Uuid == account.RoleUuid &&
                        item.DeletedAt == null &&
                        item.Status == BaseStatus.Active,
                cancellationToken);

        if (role is null)
        {
            return ApiResponse<SidebarResponse>.Forbidden("Quyền không còn hoạt động");
        }

        var permissions = await (
            from rolePermission in dbContext.RolePermissions.AsNoTracking()
            join permission in dbContext.Permissions.AsNoTracking()
                on rolePermission.PermissionUuid equals permission.Uuid
            where rolePermission.RoleUuid == role.Uuid &&
                  rolePermission.Action == PermissionAction.Read
            select permission)
            .Distinct()
            .ToListAsync(cancellationToken);

        var groups = permissions
            .GroupBy(permission => permission.Description)
            .Select(group => new SidebarGroupResponse(
                group.Key,
                group.Select(permission => new SidebarItemResponse(
                        permission.Slug,
                        permission.Name,
                        permission.Description,
                        permission.Icon,
                        $"/noi-bo/trang-tong/{permission.Slug}"))
                    .ToList()))
            .ToList();

        return ApiResponse<SidebarResponse>.RequestSuccess(
            new SidebarResponse(role.Name, groups),
            "Lấy sidebar thành công");
    }
}
