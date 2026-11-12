using System.Security.Claims;
using api.Contract;
using api.Contract.Sidebar;
using api.Lib;
using api.Model.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

[NonController]
public sealed class SidebarService(DBContext dbContext, Jwt jwt) : ControllerBase
{
    private static readonly string[] OrderedGroups =
    [
        "Quản trị hệ thống",
        "Vận hành chi nhánh",
        "Khám chữa bệnh",
        "Tiếp nhận và điều phối",
        "Kho thuốc",
    ];

    private static readonly string[] OrderedSlugs =
    [
        "tong-quan-he-thong", "co-so-y-te", "chuyen-khoa", "dich-vu", "thuoc",
        "tai-khoan", "bao-cao-he-thong", "nhat-ky-he-thong", "khung-gio-lam-viec", "phan-quyen",
        "tong-quan-chi-nhanh", "thong-tin-chi-nhanh", "chuyen-khoa-dich-vu",
        "phong-kham-chi-nhanh", "nhan-su", "lich-hen-chi-nhanh", "don-thuoc-chi-nhanh",
        "kho-thuoc", "danh-gia-chi-nhanh", "bao-cao-chi-nhanh", "nhat-ky-chi-nhanh",
        "gio-lam-viec-benh-vien", "duyet-don-lam-viec",
        "tong-quan-bac-si", "lich-kham", "ca-kham", "don-thuoc-bac-si",
        "thuoc-kha-dung", "ho-so-nghe-nghiep", "gio-lam-viec-bac-si",
        "tong-quan-tiep-nhan", "lich-hen-tiep-nhan", "tiep-nhan",
        "phong-kham-tiep-nhan", "thanh-toan-cap-thuoc", "danh-gia-tiep-nhan",
        "tong-quan-kho", "ton-kho", "nha-cung-cap", "nhap-hang", "xuat-hang",
        "bao-cao-kho",
    ];

    private static readonly IReadOnlyDictionary<string, int> GroupOrder = OrderedGroups
        .Select((label, index) => (label, index))
        .ToDictionary(item => item.label, item => item.index, StringComparer.Ordinal);

    private static readonly IReadOnlyDictionary<string, int> ItemOrder = OrderedSlugs
        .Select((slug, index) => (slug, index))
        .ToDictionary(item => item.slug, item => item.index, StringComparer.Ordinal);

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
            .OrderBy(group => GetOrder(GroupOrder, group.Key))
            .ThenBy(group => group.Key, StringComparer.Ordinal)
            .Select(group => new SidebarGroupResponse(
                group.Key,
                group.OrderBy(permission => GetOrder(ItemOrder, permission.Slug))
                    .ThenBy(permission => permission.Name, StringComparer.Ordinal)
                    .Select(permission => new SidebarItemResponse(
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

    private static int GetOrder(IReadOnlyDictionary<string, int> order, string key) =>
        order.TryGetValue(key, out var index) ? index : int.MaxValue;
}
