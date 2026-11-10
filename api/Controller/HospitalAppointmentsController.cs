using api.Contract.Hospital;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller;

[ApiController]
[Authorize]
[Route("api/hospitals/{hospitalUuid:guid}/appointments")]
public sealed class HospitalAppointmentsController(DBContext dbContext) : ControllerBase
{
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
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = dbContext.Appointments
            .Where(item => item.HospitalUuid == hospitalUuid && item.DeletedAt == null);
        if (from.HasValue)
            query = query.Where(item => item.AppointmentDate >= from.Value.Date);
        if (to.HasValue)
            query = query.Where(item => item.AppointmentDate < to.Value.Date.AddDays(1));
        if (status.HasValue)
            query = query.Where(item => item.Status == status.Value);
        if (type.HasValue)
            query = query.Where(item => item.Type == type.Value);

        var appointments = await query
            .OrderBy(item => item.AppointmentDate)
            .ThenBy(item => item.TimeSlot)
            .ToListAsync(cancellationToken);
        var items = await ToResponses(appointments, cancellationToken);
        var normalizedSearch = search?.Trim();
        if (!string.IsNullOrWhiteSpace(normalizedSearch))
        {
            items = items.Where(item =>
                item.PatientName.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ||
                item.MedicalCode.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ||
                (item.DoctorName?.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ?? false) ||
                (item.RoomName?.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ?? false))
                .ToList();
        }

        var totalCount = items.Count;
        return Ok(new
        {
            message = "Fetched successfully",
            data = items.Skip((page - 1) * pageSize).Take(pageSize),
            pagination = new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(
        Guid hospitalUuid,
        CreateBranchAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(request.Gender) || !Enum.IsDefined(request.Type))
            return BadRequest(new { message = "Appointment details are invalid", error = "INVALID_APPOINTMENT_REQUEST" });
        if (request.AppointmentDate == default)
            return BadRequest(new { message = "Appointment date is required", error = "INVALID_APPOINTMENT_REQUEST" });
        var sessionHospitalUuid = User.GetHospitalUuid();
        if (!sessionHospitalUuid.HasValue)
            return Unauthorized(new { message = "The current account is not associated with a hospital" });
        hospitalUuid = sessionHospitalUuid.Value;

        var hospitalExists = await dbContext.Hospitals.AnyAsync(
            item => item.Uuid == hospitalUuid && item.DeletedAt == null,
            cancellationToken);
        if (!hospitalExists)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var uuid = Guid.NewGuid();
        var now = DateTime.UtcNow;
        var appointment = new Appointment
        {
            Uuid = uuid,
            PatientName = request.PatientName.Trim(),
            Gender = request.Gender,
            MedicalCode = $"APT-{request.AppointmentDate:yyyyMMdd}-{uuid.ToString("N")[..8].ToUpperInvariant()}",
            Note = request.Note.Trim(),
            AppointmentDate = request.AppointmentDate,
            Type = request.Type,
            Status = AppointmentStatus.Pending,
            PatientUuid = null,
            HospitalUuid = hospitalUuid,
            DoctorUuid = null,
            MedicalServiceUuid = null,
            RoomUuid = null,
            TotalPrice = 0,
            IsPaid = false,
            CreatedAt = now,
            UpdatedAt = now
        };
        dbContext.Appointments.Add(appointment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return StatusCode(StatusCodes.Status201Created, new
        {
            message = "Appointment created successfully",
            data = await ToResponse(appointment, cancellationToken)
        });
    }

    [HttpPut("{appointmentUuid:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid hospitalUuid,
        Guid appointmentUuid,
        BranchAppointmentStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.Status is not AppointmentStatus.Approved
            and not AppointmentStatus.Unconfirmed
            and not AppointmentStatus.Cancelled)
            return BadRequest(new { message = "Requested appointment status is not supported" });
        var appointment = await FindAppointment(hospitalUuid, appointmentUuid, cancellationToken);
        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });
        var validTransition = appointment.Status switch
        {
            AppointmentStatus.Pending => request.Status is AppointmentStatus.Approved
                or AppointmentStatus.Unconfirmed or AppointmentStatus.Cancelled,
            AppointmentStatus.Approved => request.Status is AppointmentStatus.Cancelled,
            _ => false
        };
        if (!validTransition)
            return Conflict(new { message = "Appointment status transition is not allowed", error = "INVALID_APPOINTMENT_STATE" });

        appointment.Status = request.Status;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Updated successfully", data = await ToResponse(appointment, cancellationToken) });
    }

    [HttpPut("{appointmentUuid:guid}/payment")]
    public async Task<IActionResult> UpdatePayment(
        Guid hospitalUuid,
        Guid appointmentUuid,
        BranchAppointmentPaymentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await FindAppointment(hospitalUuid, appointmentUuid, cancellationToken);
        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });
        if (appointment.Status is not AppointmentStatus.Approved and not AppointmentStatus.CheckedIn)
            return Conflict(new { message = "Payment can only be updated for approved or checked-in appointments", error = "INVALID_APPOINTMENT_STATE" });

        appointment.IsPaid = request.IsPaid;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Payment updated successfully", data = await ToResponse(appointment, cancellationToken) });
    }

    [HttpPut("{appointmentUuid:guid}/note")]
    public async Task<IActionResult> UpdateDoctorNote(
        Guid hospitalUuid,
        Guid appointmentUuid,
        BranchAppointmentNoteRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await FindAppointment(hospitalUuid, appointmentUuid, cancellationToken);
        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });
        if (appointment.Status is AppointmentStatus.Done or AppointmentStatus.Cancelled or AppointmentStatus.Unconfirmed)
            return Conflict(new { message = "Notes cannot be changed for a completed or cancelled appointment", error = "INVALID_APPOINTMENT_STATE" });

        appointment.DoctorNote = request.DoctorNote.Trim();
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Doctor note updated successfully", data = await ToResponse(appointment, cancellationToken) });
    }

    [HttpPost("{appointmentUuid:guid}/services")]
    public async Task<IActionResult> AddService(
        Guid hospitalUuid,
        Guid appointmentUuid,
        CreateAppointmentServiceRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await FindAppointment(hospitalUuid, appointmentUuid, cancellationToken);
        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });
        if (appointment.Status is not AppointmentStatus.Approved and not AppointmentStatus.CheckedIn)
            return Conflict(new { message = "Services can only be added to approved or checked-in appointments", error = "INVALID_APPOINTMENT_STATE" });

        var service = await dbContext.MedicalServices.FirstOrDefaultAsync(item =>
            item.Uuid == request.MedicalServiceUuid &&
            item.Status == BaseStatus.Active &&
            item.DeletedAt == null &&
            dbContext.HospitalMedicalServices.Any(assignment =>
                assignment.HospitalUuid == hospitalUuid &&
                assignment.MedicalServiceUuid == item.Uuid), cancellationToken);
        if (service is null)
            return BadRequest(new { message = "Service is not available in this branch", error = "SERVICE_NOT_AVAILABLE" });

        var detail = new AppointmentMedicalService
        {
            Uuid = Guid.NewGuid(),
            AppointmentUuid = appointment.Uuid,
            MedicalServiceUuid = service.Uuid,
            Price = service.Price,
            Description = request.Description.Trim(),
            Status = AppointmentMedicalServiceStatus.InProgress
        };
        dbContext.AppointmentMedicalServices.Add(detail);
        appointment.TotalPrice += detail.Price;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Service added successfully", data = await ToResponse(appointment, cancellationToken) });
    }

    [HttpPut("{appointmentUuid:guid}/services/{detailUuid:guid}/complete")]
    public async Task<IActionResult> CompleteService(
        Guid hospitalUuid,
        Guid appointmentUuid,
        Guid detailUuid,
        CancellationToken cancellationToken = default)
    {
        var appointment = await FindAppointment(hospitalUuid, appointmentUuid, cancellationToken);
        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });
        if (appointment.Status is not AppointmentStatus.Approved and not AppointmentStatus.CheckedIn)
            return Conflict(new { message = "Services can only be completed for approved or checked-in appointments", error = "INVALID_APPOINTMENT_STATE" });
        var detail = await dbContext.AppointmentMedicalServices.FirstOrDefaultAsync(item =>
            item.Uuid == detailUuid && item.AppointmentUuid == appointmentUuid, cancellationToken);
        if (detail is null)
            return NotFound(new { message = "Appointment service not found", error = "Resource does not exist" });

        detail.Status = AppointmentMedicalServiceStatus.Completed;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Service completed successfully", data = await ToResponse(appointment, cancellationToken) });
    }

    private async Task<Appointment?> FindAppointment(
        Guid hospitalUuid,
        Guid appointmentUuid,
        CancellationToken cancellationToken)
    {
        return await dbContext.Appointments.FirstOrDefaultAsync(item =>
            item.Uuid == appointmentUuid &&
            item.HospitalUuid == hospitalUuid &&
            item.DeletedAt == null, cancellationToken);
    }

    private async Task<List<BranchAppointmentResponse>> ToResponses(
        List<Appointment> appointments,
        CancellationToken cancellationToken)
    {
        var result = new List<BranchAppointmentResponse>(appointments.Count);
        foreach (var appointment in appointments)
            result.Add(await ToResponse(appointment, cancellationToken));
        return result;
    }

    private async Task<BranchAppointmentResponse> ToResponse(
        Appointment appointment,
        CancellationToken cancellationToken)
    {
        var working = appointment.TimeSlot.HasValue
            ? await dbContext.TimeWorkings.FirstOrDefaultAsync(item =>
                item.Uuid == appointment.TimeSlot.Value, cancellationToken)
            : null;
        var doctor = appointment.DoctorUuid.HasValue
            ? await dbContext.DoctorProfiles.FirstOrDefaultAsync(item =>
                item.Uuid == appointment.DoctorUuid.Value, cancellationToken)
            : null;
        var room = appointment.RoomUuid.HasValue
            ? await dbContext.Rooms.FirstOrDefaultAsync(item =>
                item.Uuid == appointment.RoomUuid.Value, cancellationToken)
            : null;
        var service = appointment.MedicalServiceUuid.HasValue
            ? await dbContext.MedicalServices.FirstOrDefaultAsync(item =>
                item.Uuid == appointment.MedicalServiceUuid.Value, cancellationToken)
            : null;
        var serviceDetails = await (
            from detail in dbContext.AppointmentMedicalServices
            join medicalService in dbContext.MedicalServices
                on detail.MedicalServiceUuid equals medicalService.Uuid into joined
            from medicalService in joined.DefaultIfEmpty()
            where detail.AppointmentUuid == appointment.Uuid
            select new BranchAppointmentServiceResponse
            {
                Uuid = detail.Uuid,
                MedicalServiceUuid = detail.MedicalServiceUuid,
                Name = medicalService == null ? "Dịch vụ" : medicalService.Name,
                Price = detail.Price,
                Description = detail.Description,
                Status = detail.Status.ToString()
            }).ToListAsync(cancellationToken);

        return new BranchAppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Time = working is null ? string.Empty : $"{working.StartTime:HH\\:mm} - {working.EndTime:HH\\:mm}",
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            DoctorName = doctor?.Name,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            MedicalServiceName = service?.Name,
            RoomUuid = appointment.RoomUuid,
            RoomName = room?.Name,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            IsWalkIn = appointment.PatientUuid == null,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt,
            Services = serviceDetails
        };
    }
}
