using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Contract.Hospital;
using api.Model;
using api.Model.Enum;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/hospitals")]
public sealed class HospitalController(HospitalManagementService service) : ControllerBase
{
    private HospitalManagementService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet("branch-profile")]
    [Authorize]
    public async Task<IActionResult> GetBranchProfile(
        CancellationToken cancellationToken = default) => await Service.GetBranchProfile(cancellationToken);
    [HttpGet]
    public async Task<IActionResult> GetHospitals(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] BaseStatus? status = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default) => await Service.GetHospitals(page, pageSize, status, search, cancellationToken);
    [HttpGet("{slugOrId}")]
    public async Task<IActionResult> GetHospital(string slugOrId, CancellationToken cancellationToken = default) => await Service.GetHospital(slugOrId, cancellationToken);
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateHospital(
        CreateHospitalRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateHospital(request, cancellationToken);
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateHospital(
        Guid id,
        UpdateHospitalRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateHospital(id, request, cancellationToken);
    [HttpPut("{id}/assignments")]
    [Authorize]
    public async Task<IActionResult> UpdateHospitalAssignments(
        Guid id,
        UpdateHospitalAssignmentsRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateHospitalAssignments(id, request, cancellationToken);
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteHospital(Guid id, CancellationToken cancellationToken = default) => await Service.DeleteHospital(id, cancellationToken);
    [HttpGet("{id}/departments")]
    [Authorize]
    public async Task<IActionResult> GetHospitalDepartments(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) => await Service.GetHospitalDepartments(id, page, pageSize, cancellationToken);
    [HttpGet("{id}/medical-services")]
    [Authorize]
    public async Task<IActionResult> GetHospitalMedicalServices(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) => await Service.GetHospitalMedicalServices(id, page, pageSize, cancellationToken);
    [HttpGet("{id}/rooms")]
    [Authorize]
    public async Task<IActionResult> GetRooms(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] RoomStatus? status = null,
        [FromQuery] string? search = null,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default) => await Service.GetRooms(id, page, pageSize, status, search, includeDeleted, cancellationToken);
    [HttpGet("{id}/rooms/{roomId}")]
    [Authorize]
    public async Task<IActionResult> GetRoom(Guid id, Guid roomId, CancellationToken cancellationToken = default) => await Service.GetRoom(id, roomId, cancellationToken);
    [HttpPost("{id}/rooms")]
    [Authorize]
    public async Task<IActionResult> CreateRoom(
        Guid id,
        CreateRoomRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateRoom(id, request, cancellationToken);
    [HttpPut("{id}/rooms/{roomId}")]
    [Authorize]
    public async Task<IActionResult> UpdateRoom(
        Guid id,
        Guid roomId,
        UpdateRoomRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateRoom(id, roomId, request, cancellationToken);
    [HttpDelete("{id}/rooms/{roomId}")]
    [Authorize]
    public async Task<IActionResult> DeleteRoom(Guid id, Guid roomId, CancellationToken cancellationToken = default) => await Service.DeleteRoom(id, roomId, cancellationToken);
    [HttpPost("{id}/rooms/{roomId}/restore")]
    [Authorize]
    public async Task<IActionResult> RestoreRoom(
        Guid id,
        Guid roomId,
        CancellationToken cancellationToken = default) => await Service.RestoreRoom(id, roomId, cancellationToken);
}
