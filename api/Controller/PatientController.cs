using api.Contract.Patient;
using api.Lib;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;


[ApiController]
[Route("api/patients")]
[Authorize]
public sealed class PatientController(PatientService patientService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrent(CancellationToken cancellationToken)
    {
        var accountUuid = User.GetAccountUuid();
        if (!accountUuid.HasValue) return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });

        var view = await patientService.GetCurrentAsync(accountUuid.Value, cancellationToken);
        if (view is null)
            return NotFound(new { message = "Không tìm thấy hồ sơ người bệnh." });

        return Ok(new { message = "Lấy hồ sơ người bệnh thành công.", data = new { profile = view.Profile, phone = view.Phone } });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateCurrent(UpdateCurrentPatientRequest request, CancellationToken cancellationToken)
    {
        var accountUuid = User.GetAccountUuid();
        if (!accountUuid.HasValue) return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });

        var result = await patientService.UpdateCurrentAsync(accountUuid.Value, request, cancellationToken);
        if (!result.WasFound)
            return NotFound(new { message = "Không tìm thấy hồ sơ người bệnh." });
        if (result.Errors.Count > 0)
            return UnprocessableEntity(new { message = "Vui lòng kiểm tra lại thông tin.", errors = result.Errors });
        return Ok(new { message = "Cập nhật hồ sơ thành công.", data = new { profile = result.View!.Profile, phone = result.View.Phone } });
    }
}
