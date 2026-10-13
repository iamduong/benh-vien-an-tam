using api.Contract;
using api.Model;
using api.Model.Enum;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("/api/permissions")]
public sealed class PermissionController(PermissionService permissionService): ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetPermissions(
        [FromQuery] AccessScope? scope,
        CancellationToken cancellationToken)
    {
        var result = await permissionService.GetPermissionsAsync(scope, cancellationToken);

        return ApiResponse<IReadOnlyList<Permission>>.RequestSuccess(result);
    }
}
