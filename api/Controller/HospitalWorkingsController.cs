using api.Contract.Hospital;
using api.Contract.TimeWorking;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/hospital-workings")]
[Authorize]
public sealed class HospitalWorkingsController(HospitalWorkingsService service) : ControllerBase
{
    private HospitalWorkingsService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetBranchWorkings(CancellationToken cancellationToken) => await Service.GetBranchWorkings(cancellationToken);
    [HttpPost]
    public async Task<IActionResult> AddBranchWorking(
        HospitalWorkingRequest request,
        CancellationToken cancellationToken) => await Service.AddBranchWorking(request, cancellationToken);
    [HttpPut("{uuid:guid}")]
    public async Task<IActionResult> UpdateBranchWorking(
        Guid uuid,
        HospitalWorkingRequest request,
        CancellationToken cancellationToken) => await Service.UpdateBranchWorking(uuid, request, cancellationToken);
    [HttpDelete("{uuid:guid}")]
    public async Task<IActionResult> DeleteBranchWorking(
        Guid uuid,
        CancellationToken cancellationToken) => await Service.DeleteBranchWorking(uuid, cancellationToken);
}
