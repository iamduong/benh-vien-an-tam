using api.Contract.Doctor;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/doctor-work-submissions")]
[Authorize]
public sealed class DoctorWorkSubmissionsController(DoctorWorkSubmissionsService service) : ControllerBase
{
    private DoctorWorkSubmissionsService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken) => await Service.GetMine(cancellationToken);
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateDoctorWorkSubmissionRequest request,
        CancellationToken cancellationToken) => await Service.Create(request, cancellationToken);
    [HttpGet("hospital")]
    public async Task<IActionResult> GetHospitalSubmissions(CancellationToken cancellationToken) => await Service.GetHospitalSubmissions(cancellationToken);
    [HttpPut("{uuid:guid}/review")]
    public async Task<IActionResult> Review(
        Guid uuid,
        ReviewDoctorWorkSubmissionRequest request,
        CancellationToken cancellationToken) => await Service.Review(uuid, request, cancellationToken);
}
