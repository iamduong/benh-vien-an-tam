using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Contract.MedicalService;
using api.Model;
using api.Model.Enum;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/medical-services")]
public sealed class MedicalServiceController(MedicalServiceService service) : ControllerBase
{
    private MedicalServiceService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMedicalServices(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] BaseStatus? status = null,
        [FromQuery] bool? isFeatured = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default) => await Service.GetMedicalServices(page, pageSize, status, isFeatured, search, cancellationToken);
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMedicalService(Guid id, CancellationToken cancellationToken = default) => await Service.GetMedicalService(id, cancellationToken);
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateMedicalService(
        CreateMedicalServiceRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateMedicalService(request, cancellationToken);
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateMedicalService(
        Guid id,
        UpdateMedicalServiceRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateMedicalService(id, request, cancellationToken);
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteMedicalService(Guid id, CancellationToken cancellationToken = default) => await Service.DeleteMedicalService(id, cancellationToken);
}
