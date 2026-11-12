using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Contract.Appointment;
using api.Model;
using api.Model.Enum;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/appointments")]
public sealed class AppointmentController(AppointmentService service) : ControllerBase
{
    private AppointmentService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet("booking-context")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBookingContext(CancellationToken cancellationToken) => await Service.GetBookingContext(cancellationToken);
    [HttpGet("availability")]
    [Authorize]
    public async Task<IActionResult> GetAvailability(
        [FromQuery] string type,
        [FromQuery] Guid targetUuid,
        [FromQuery] Guid hospitalUuid,
        [FromQuery] Guid accountUuid,
        [FromQuery] DateOnly date,
        CancellationToken cancellationToken) => await Service.GetAvailability(type, targetUuid, hospitalUuid, accountUuid, date, cancellationToken);
    [HttpPost("hospitals")]
    [Authorize]
    public Task<IActionResult> CreateHospitalBooking(CreatePatientBookingRequest request, CancellationToken cancellationToken) => Service.CreateHospitalBooking(request, cancellationToken);
    [HttpPost("doctors")]
    [Authorize]
    public Task<IActionResult> CreateDoctorBooking(CreatePatientBookingRequest request, CancellationToken cancellationToken) => Service.CreateDoctorBooking(request, cancellationToken);
    [HttpPost("medical-services")]
    [Authorize]
    public Task<IActionResult> CreateMedicalServiceBooking(CreatePatientBookingRequest request, CancellationToken cancellationToken) => Service.CreateMedicalServiceBooking(request, cancellationToken);
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAppointments(
        [FromQuery] Guid accountUuid,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] AppointmentStatus? status = null,
        [FromQuery] string? type = null,
        [FromQuery] DateOnly? from = null,
        [FromQuery] DateOnly? to = null,
        CancellationToken cancellationToken = default) => await Service.GetAppointments(accountUuid, page, pageSize, status, type, from, to, cancellationToken);
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetAppointment(Guid id, CancellationToken cancellationToken = default) => await Service.GetAppointment(id, cancellationToken);
    [HttpGet("{uuid:guid}/detail")]
    [Authorize]
    public async Task<IActionResult> GetAppointmentDetail(Guid uuid, [FromQuery] Guid accountUuid, CancellationToken cancellationToken = default) => await Service.GetAppointmentDetail(uuid, accountUuid, cancellationToken);
    [HttpPost("{uuid:guid}/reschedule")]
    [Authorize]
    public async Task<IActionResult> RescheduleAppointment(Guid uuid, ReschedulePatientAppointmentRequest request, CancellationToken cancellationToken = default) => await Service.RescheduleAppointment(uuid, request, cancellationToken);
    [HttpPost("{uuid:guid}/cancel")]
    [Authorize]
    public async Task<IActionResult> CancelPatientAppointment(Guid uuid, CancelPatientAppointmentRequest request, CancellationToken cancellationToken = default) => await Service.CancelPatientAppointment(uuid, request, cancellationToken);
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateAppointment(
        CreateAppointmentRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateAppointment(request, cancellationToken);
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateAppointment(
        Guid id,
        UpdateAppointmentRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateAppointment(id, request, cancellationToken);
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAppointment(Guid id, CancellationToken cancellationToken = default) => await Service.DeleteAppointment(id, cancellationToken);
    [HttpPut("{id}/approve")]
    [Authorize]
    public async Task<IActionResult> ApproveAppointment(
        Guid id,
        ApproveAppointmentRequest request,
        CancellationToken cancellationToken = default) => await Service.ApproveAppointment(id, request, cancellationToken);
    [HttpPut("{id}/complete")]
    [Authorize]
    public async Task<IActionResult> CompleteAppointment(
        Guid id,
        CompleteAppointmentRequest request,
        CancellationToken cancellationToken = default) => await Service.CompleteAppointment(id, request, cancellationToken);
    [HttpPut("{id}/check-in")]
    [Authorize]
    public async Task<IActionResult> CheckInAppointment(
        Guid id,
        CancellationToken cancellationToken = default) => await Service.CheckInAppointment(id, cancellationToken);
}
