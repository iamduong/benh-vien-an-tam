using api.Contract.Reception;
using api.Lib;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Authorize]
[Route("api/internal/reception")]
public sealed class ReceptionController(ReceptionService service) : ControllerBase
{
    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue(CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Unauthorized(new { message = "Tài khoản chưa được gắn với chi nhánh." });
        var data = await service.GetQueueAsync(hospitalUuid.Value, cancellationToken);
        return Ok(new { message = "Đã tải hàng chờ check-in.", data });
    }

    [HttpGet("appointments")]
    public async Task<IActionResult> Search(
        [FromQuery] string? query,
        [FromQuery] string? date,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Unauthorized(new { message = "Tài khoản chưa được gắn với chi nhánh." });
        var (data, error) = await service.SearchAsync(hospitalUuid.Value, query, date, cancellationToken);
        return data is null ? BadRequest(new { message = error }) : Ok(new { message = "Tra cứu thành công.", data });
    }

    [HttpGet("appointments/{appointmentUuid:guid}/routing")]
    public async Task<IActionResult> GetRouting(Guid appointmentUuid, CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Unauthorized(new { message = "Tài khoản chưa được gắn với chi nhánh." });
        var (data, error) = await service.GetRoutingAsync(hospitalUuid.Value, appointmentUuid, cancellationToken);
        return data is null ? NotFound(new { message = error }) : Ok(new { message = "Đã tải phương án phân phòng.", data });
    }

    [HttpPost("appointments/{appointmentUuid:guid}/check-in")]
    public async Task<IActionResult> CheckIn(
        Guid appointmentUuid,
        ReceptionCheckInRequest request,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Unauthorized(new { message = "Tài khoản chưa được gắn với chi nhánh." });
        var (data, error, statusCode) = await service.CheckInAsync(
            hospitalUuid.Value, appointmentUuid, request.RoomUuid, cancellationToken);
        return data is null
            ? StatusCode(statusCode, new { message = error })
            : Ok(new { message = "Check-in thành công.", data });
    }
}
