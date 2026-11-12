using api.Contract.Warehouse;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/warehouse")]
[Authorize]
public sealed class WarehouseController(WarehouseService service) : ControllerBase
{
    private WarehouseService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet("providers")]
    public async Task<IActionResult> GetProviders([FromQuery] bool includeDeleted, CancellationToken cancellationToken) => await Service.GetProviders(includeDeleted, cancellationToken);
    [HttpPost("providers")]
    public async Task<IActionResult> CreateProvider(ProviderRequest request, CancellationToken cancellationToken) => await Service.CreateProvider(request, cancellationToken);
    [HttpPut("providers/{uuid:guid}")]
    public async Task<IActionResult> UpdateProvider(Guid uuid, ProviderRequest request, CancellationToken cancellationToken) => await Service.UpdateProvider(uuid, request, cancellationToken);
    [HttpDelete("providers/{uuid:guid}")]
    public async Task<IActionResult> DeleteProvider(Guid uuid, CancellationToken cancellationToken) => await Service.DeleteProvider(uuid, cancellationToken);
    [HttpPost("providers/{uuid:guid}/restore")]
    public async Task<IActionResult> RestoreProvider(Guid uuid, CancellationToken cancellationToken) => await Service.RestoreProvider(uuid, cancellationToken);
    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventory(CancellationToken cancellationToken) => await Service.GetInventory(cancellationToken);
    [HttpGet("options")]
    public async Task<IActionResult> GetOptions(CancellationToken cancellationToken) => await Service.GetOptions(cancellationToken);
    [HttpGet("imports")]
    public async Task<IActionResult> GetImports(CancellationToken cancellationToken) => await Service.GetImports(cancellationToken);
    [HttpGet("exports")]
    public async Task<IActionResult> GetExports(CancellationToken cancellationToken) => await Service.GetExports(cancellationToken);
    [HttpPost("imports")]
    public async Task<IActionResult> CreateImport(CreateImportTicketRequest request, CancellationToken cancellationToken) => await Service.CreateImport(request, cancellationToken);
    [HttpPost("exports")]
    public async Task<IActionResult> CreateExport(CreateExportTicketRequest request, CancellationToken cancellationToken) => await Service.CreateExport(request, cancellationToken);
    [HttpPut("imports/{uuid:guid}")]
    public async Task<IActionResult> UpdateImport(Guid uuid, CreateImportTicketRequest request, CancellationToken cancellationToken) => await Service.UpdateImport(uuid, request, cancellationToken);
    [HttpPut("exports/{uuid:guid}")]
    public async Task<IActionResult> UpdateExport(Guid uuid, CreateExportTicketRequest request, CancellationToken cancellationToken) => await Service.UpdateExport(uuid, request, cancellationToken);
    [HttpPost("imports/{uuid:guid}/confirm")]
    public Task<IActionResult> ConfirmImport(Guid uuid, CancellationToken cancellationToken) => Service.ConfirmImport(uuid, cancellationToken);
    [HttpPost("exports/{uuid:guid}/confirm")]
    public Task<IActionResult> ConfirmExport(Guid uuid, CancellationToken cancellationToken) => Service.ConfirmExport(uuid, cancellationToken);
    [HttpPost("imports/{uuid:guid}/cancel")]
    public Task<IActionResult> CancelImport(Guid uuid, CancellationToken cancellationToken) => Service.CancelImport(uuid, cancellationToken);
    [HttpPost("exports/{uuid:guid}/cancel")]
    public Task<IActionResult> CancelExport(Guid uuid, CancellationToken cancellationToken) => Service.CancelExport(uuid, cancellationToken);
}
