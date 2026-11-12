using api.Contract.Hospital;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Authorize]
[Route("api/hospitals/{hospitalUuid:guid}/appointments")]
public sealed class HospitalAppointmentsController(HospitalAppointmentsService service) : ControllerBase
{
    private HospitalAppointmentsService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAppointments(
        Guid hospitalUuid,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null,
        [FromQuery] AppointmentStatus? status = null,
        [FromQuery] AppointmentType? type = null,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100,
        CancellationToken cancellationToken = default) => await Service.GetAppointments(hospitalUuid, from, to, status, type, search, page, pageSize, cancellationToken);
    [HttpPost]
    public async Task<IActionResult> CreateAppointment(
        Guid hospitalUuid,
        CreateBranchAppointmentRequest request,
        CancellationToken cancellationToken = default) => await Service.CreateAppointment(hospitalUuid, request, cancellationToken);
    [HttpPut("{appointmentUuid:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid hospitalUuid,
        Guid appointmentUuid,
        BranchAppointmentStatusRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateStatus(hospitalUuid, appointmentUuid, request, cancellationToken);
    [HttpPut("{appointmentUuid:guid}/payment")]
    public async Task<IActionResult> UpdatePayment(
        Guid hospitalUuid,
        Guid appointmentUuid,
        BranchAppointmentPaymentRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdatePayment(hospitalUuid, appointmentUuid, request, cancellationToken);
    [HttpPut("{appointmentUuid:guid}/note")]
    public async Task<IActionResult> UpdateDoctorNote(
        Guid hospitalUuid,
        Guid appointmentUuid,
        BranchAppointmentNoteRequest request,
        CancellationToken cancellationToken = default) => await Service.UpdateDoctorNote(hospitalUuid, appointmentUuid, request, cancellationToken);
    [HttpPost("{appointmentUuid:guid}/services")]
    public async Task<IActionResult> AddService(
        Guid hospitalUuid,
        Guid appointmentUuid,
        CreateAppointmentServiceRequest request,
        CancellationToken cancellationToken = default) => await Service.AddService(hospitalUuid, appointmentUuid, request, cancellationToken);
    [HttpPut("{appointmentUuid:guid}/services/{detailUuid:guid}/complete")]
    public async Task<IActionResult> CompleteService(
        Guid hospitalUuid,
        Guid appointmentUuid,
        Guid detailUuid,
        CancellationToken cancellationToken = default) => await Service.CompleteService(hospitalUuid, appointmentUuid, detailUuid, cancellationToken);
}
