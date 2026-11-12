using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Contract.Doctor;
using api.Model;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/doctors")]
public sealed class DoctorController(DoctorService service) : ControllerBase
{
    private DoctorService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetDoctors(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] Guid? departmentId = null,
        [FromQuery] Guid? hospitalId = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default) => await Service.GetDoctors(page, pageSize, departmentId, hospitalId, search, cancellationToken);
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctor(Guid id, CancellationToken cancellationToken = default) => await Service.GetDoctor(id, cancellationToken);
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateDoctor(
        CreateDoctorRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateDoctor(request, cancellationToken);
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateDoctor(
        Guid id,
        UpdateDoctorRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateDoctor(id, request, cancellationToken);
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteDoctor(Guid id, CancellationToken cancellationToken = default) => await Service.DeleteDoctor(id, cancellationToken);
    [HttpGet("{id}/departments")]
    public async Task<IActionResult> GetDoctorDepartments(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) => await Service.GetDoctorDepartments(id, page, pageSize, cancellationToken);
    [HttpPost("{id}/departments")]
    [Authorize]
    public async Task<IActionResult> AddDoctorDepartment(
        Guid id,
        AddDoctorDepartmentRequest request,
        CancellationToken cancellationToken = default) => await Service.AddDoctorDepartment(id, request, cancellationToken);
    [HttpDelete("{id}/departments/{departmentId}")]
    [Authorize]
    public async Task<IActionResult> RemoveDoctorDepartment(
        Guid id,
        Guid departmentId,
        CancellationToken cancellationToken = default) => await Service.RemoveDoctorDepartment(id, departmentId, cancellationToken);
    [HttpGet("{id}/workings")]
    public async Task<IActionResult> GetDoctorWorkings(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) => await Service.GetDoctorWorkings(id, page, pageSize, cancellationToken);
    [HttpPost("{id}/workings")]
    [Authorize]
    public async Task<IActionResult> AddDoctorWorking(
        Guid id,
        AddDoctorWorkingRequest request,
        CancellationToken cancellationToken = default) => await Service.AddDoctorWorking(id, request, cancellationToken);
    [HttpDelete("{id}/workings/{workingId}")]
    [Authorize]
    public async Task<IActionResult> RemoveDoctorWorking(
        Guid id,
        Guid workingId,
        CancellationToken cancellationToken = default) => await Service.RemoveDoctorWorking(id, workingId, cancellationToken);
    [HttpGet("{id}/appointments")]
    public async Task<IActionResult> GetDoctorAppointments(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) => await Service.GetDoctorAppointments(id, page, pageSize, cancellationToken);
}
