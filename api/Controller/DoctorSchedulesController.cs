using api.Contract.Doctor;
using api.Lib;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Authorize]
[Route("api/internal/doctor-schedules")]
public sealed class DoctorSchedulesController(DoctorSchedulesService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] Guid? doctorUuid, CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Unauthorized(new { message = "Tài khoản chưa được gắn với chi nhánh." });
        var data = await service.GetAsync(hospitalUuid.Value, doctorUuid, cancellationToken);
        return Ok(new { message = "Đã tải lịch làm việc bác sĩ.", data });
    }

    [HttpPost]
    public async Task<IActionResult> Replace(CreateDoctorScheduleRequest request, CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue) return Unauthorized(new { message = "Phiên chi nhánh không hợp lệ." });
        var (data, error, statusCode) = await service.ReplaceAsync(hospitalUuid.Value, request, cancellationToken);
        return data is null ? StatusCode(statusCode, new { message = error })
            : Ok(new { message = "Đã cập nhật lịch làm việc bác sĩ.", data });
    }
}
