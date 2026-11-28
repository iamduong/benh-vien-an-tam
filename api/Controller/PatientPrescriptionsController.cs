using api.Lib;
using api.Model.Enum;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("api/prescriptions")]
[Authorize]
public sealed class PatientPrescriptionsController(PatientPrescriptionService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetList(
        [FromQuery] PrescriptionStatus? status = null,
        [FromQuery] DateOnly? from = null,
        [FromQuery] DateOnly? to = null,
        [FromQuery] string? q = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 4,
        CancellationToken cancellationToken = default)
    {
        var accountUuid = User.GetAccountUuid();
        if (!accountUuid.HasValue)
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var (hasProfile, invalidFilter, data) = await service.GetListAsync(
            accountUuid.Value,
            status,
            from,
            to,
            q,
            page,
            pageSize,
            cancellationToken);

        if (!hasProfile)
        {
            return Forbid();
        }

        if (invalidFilter)
        {
            return UnprocessableEntity(new { message = "Bộ lọc đơn thuốc không hợp lệ." });
        }

        return Ok(new { message = "Lấy danh sách đơn thuốc thành công.", data });
    }

    [HttpGet("{uuid:guid}")]
    public async Task<IActionResult> GetByUuid(Guid uuid, CancellationToken cancellationToken = default)
    {
        var accountUuid = User.GetAccountUuid();
        if (!accountUuid.HasValue)
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var (hasProfile, data) = await service.GetByUuidAsync(accountUuid.Value, uuid, cancellationToken);
        if (!hasProfile)
        {
            return Forbid();
        }

        if (data is null)
        {
            return NotFound(new { message = "Không tìm thấy đơn thuốc." });
        }

        return Ok(new { message = "Lấy chi tiết đơn thuốc thành công.", data });
    }
}

