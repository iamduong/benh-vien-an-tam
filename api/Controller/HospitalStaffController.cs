using System.Text;
using api.Contract.Hospital;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Authorize]
[Route("api/hospitals/{hospitalUuid:guid}/staff")]
public sealed class HospitalStaffController(HospitalStaffService service) : ControllerBase
{
    private HospitalStaffService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetStaff(
        Guid hospitalUuid,
        [FromQuery] string? search = null,
        [FromQuery] Guid? roleUuid = null,
        [FromQuery] BaseStatus? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100,
        CancellationToken cancellationToken = default) => await Service.GetStaff(hospitalUuid, search, roleUuid, status, page, pageSize, cancellationToken);
    [HttpPost]
    public async Task<IActionResult> CreateStaff(
        Guid hospitalUuid,
        CreateHospitalStaffRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateStaff(hospitalUuid, request, cancellationToken);
    [HttpPut("{accountUuid:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid hospitalUuid,
        Guid accountUuid,
        UpdateHospitalStaffStatusRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateStatus(hospitalUuid, accountUuid, request, cancellationToken);
}
