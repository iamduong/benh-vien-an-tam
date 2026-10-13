using api.Contract.Role;
using api.Model.Enum;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("/api/roles")]
public sealed class RoleController(RoleService roleService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? q,
        [FromQuery] BaseStatus? status,
        CancellationToken cancellationToken = default)
    {
        var roles = await roleService.GetRolesAsync(q, status, cancellationToken);
        return Ok(new { Message = "Lấy danh sách vai trò thành công", Data = roles });
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateRoleRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var role = await roleService.CreateRoleAsync(request, cancellationToken);
            return Created($"api/roles/{role.Uuid}", new
            {
                Message = "Tạo vai trò thành công",
                Data = role
            });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { Message = exception.Message });
        }
    }

    [HttpPut("{uuid:guid}")]
    public async Task<IActionResult> Update(
        Guid uuid,
        UpdateRoleRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var role = await roleService.UpdateRoleAsync(uuid, request, cancellationToken);
            return role is null
                ? NotFound(new { Message = "Không tìm thấy vai trò" })
                : Ok(new { Message = "Cập nhật vai trò thành công", Data = role });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { Message = exception.Message });
        }
    }

    [HttpDelete("{uuid:guid}")]
    public async Task<IActionResult> Delete(Guid uuid, CancellationToken cancellationToken)
    {
        try
        {
            return await roleService.DeleteRoleAsync(uuid, cancellationToken)
                ? Ok(new { Message = "Xóa vai trò thành công" })
                : NotFound(new { Message = "Không tìm thấy vai trò" });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { Message = exception.Message });
        }
    }
}
