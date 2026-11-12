using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Contract.Appointment;
using api.Lib;
using api.Model;
using api.Model.Enum;

namespace api.Service;

[NonController]
public sealed class AppointmentService(DBContext dbContext) : ControllerBase
{
    public async Task<IActionResult> GetBookingContext(CancellationToken cancellationToken)
    {
        var hospitals = await dbContext.Hospitals.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var hospitalUuids = hospitals.Select(item => item.Uuid).ToArray();

        var doctors = await dbContext.DoctorProfiles.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.HospitalUuid.HasValue && hospitalUuids.Contains(item.HospitalUuid.Value))
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var medicalServices = await dbContext.MedicalServices.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var medicalServiceUuids = medicalServices.Select(item => item.Uuid).ToArray();
        var hospitalMedicalServices = await dbContext.HospitalMedicalServices.AsNoTracking()
            .Where(item => item.HospitalUuid.HasValue && item.MedicalServiceUuid.HasValue
                && hospitalUuids.Contains(item.HospitalUuid.Value)
                && medicalServiceUuids.Contains(item.MedicalServiceUuid.Value))
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            message = "Lấy thông tin đặt lịch thành công.",
            data = new { hospitals, doctors, medicalServices, hospitalMedicalServices }
        });
    }

    public async Task<IActionResult> GetAvailability(
        string type,
        Guid targetUuid,
        Guid hospitalUuid,
        Guid accountUuid,
        DateOnly date,
        CancellationToken cancellationToken)
    {
        if (User.GetAccountUuid() != accountUuid)
            return Unauthorized(new { code = "UNAUTHORIZED", message = "Phiên đăng nhập không hợp lệ." });

        var patientUuid = await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => item.AccountUuid == accountUuid)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);
        if (!patientUuid.HasValue)
            return Forbid();

        var hospital = await dbContext.Hospitals.AsNoTracking()
            .FirstOrDefaultAsync(item => item.Uuid == hospitalUuid && item.DeletedAt == null && item.Status == BaseStatus.Active, cancellationToken);
        if (hospital is null)
            return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Cơ sở khám không hợp lệ." });

        Guid[] targetWorkingUuids;
        Guid? doctorUuid = null;
        if (type == "hospital")
        {
            if (targetUuid != hospitalUuid)
                return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Cơ sở khám không hợp lệ." });
            targetWorkingUuids = await dbContext.HospitalWorkings.AsNoTracking()
                .Where(item => item.HospitalUuid == hospitalUuid && item.WorkingUuid.HasValue)
                .Select(item => item.WorkingUuid!.Value)
                .ToArrayAsync(cancellationToken);
        }
        else if (type == "doctor")
        {
            var doctorExists = await dbContext.DoctorProfiles.AsNoTracking()
                .AnyAsync(item => item.Uuid == targetUuid && item.HospitalUuid == hospitalUuid && item.DeletedAt == null, cancellationToken);
            if (!doctorExists)
                return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Bác sĩ không thuộc cơ sở đã chọn." });
            doctorUuid = targetUuid;
            targetWorkingUuids = await dbContext.DoctorWorkingHours.AsNoTracking()
                .Where(item => item.DoctorUuid == targetUuid)
                .Select(item => item.WorkingHourUuid)
                .ToArrayAsync(cancellationToken);
        }
        else if (type == "medical-service")
        {
            var serviceExists = await dbContext.HospitalMedicalServices.AsNoTracking()
                .AnyAsync(item => item.HospitalUuid == hospitalUuid && item.MedicalServiceUuid == targetUuid, cancellationToken);
            if (!serviceExists)
                return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Dịch vụ không khả dụng tại cơ sở đã chọn." });
            targetWorkingUuids = await dbContext.ServiceWorkings.AsNoTracking()
                .Where(item => item.ServiceUuid == targetUuid && item.WorkingUuid.HasValue)
                .Select(item => item.WorkingUuid!.Value)
                .ToArrayAsync(cancellationToken);
        }
        else
        {
            return UnprocessableEntity(new { code = "INVALID_TYPE", message = "Loại lịch hẹn không hợp lệ." });
        }

        var hospitalWorkingUuids = await dbContext.HospitalWorkings.AsNoTracking()
            .Where(item => item.HospitalUuid == hospitalUuid && item.WorkingUuid.HasValue)
            .Select(item => item.WorkingUuid!.Value)
            .ToArrayAsync(cancellationToken);
        if (type != "hospital" && hospitalWorkingUuids.Length > 0)
        {
            targetWorkingUuids = targetWorkingUuids.Length > 0
                ? targetWorkingUuids.Intersect(hospitalWorkingUuids).ToArray()
                : hospitalWorkingUuids;
        }

        var dayOfWeek = (int)date.DayOfWeek;
        var workingQuery = dbContext.TimeWorkings.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active && item.DayOfWeek == dayOfWeek);
        if (targetWorkingUuids.Length > 0)
            workingQuery = workingQuery.Where(item => targetWorkingUuids.Contains(item.Uuid));
        var workings = await workingQuery.OrderBy(item => item.StartTime).ToListAsync(cancellationToken);

        var blockingStatuses = new[] { AppointmentStatus.Pending, AppointmentStatus.Approved, AppointmentStatus.Done, AppointmentStatus.CheckedIn };
        var slots = new List<object>();
        foreach (var working in workings)
        {
            for (var time = working.StartTime; time < working.EndTime; time = time.AddHours(1))
            {
                var localDateTime = date.ToDateTime(time);
                var appointmentAt = new DateTimeOffset(localDateTime, TimeSpan.FromHours(7)).UtcDateTime;
                var patientConflict = await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
                    item.DeletedAt == null && item.PatientUuid == patientUuid && item.AppointmentDate == appointmentAt
                    && blockingStatuses.Contains(item.Status), cancellationToken);
                var doctorConflict = doctorUuid.HasValue && await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
                    item.DeletedAt == null && item.DoctorUuid == doctorUuid && item.AppointmentDate == appointmentAt
                    && blockingStatuses.Contains(item.Status), cancellationToken);
                var appointmentCount = await dbContext.Appointments.AsNoTracking().CountAsync(item =>
                    item.DeletedAt == null && item.HospitalUuid == hospitalUuid && item.AppointmentDate == appointmentAt
                    && blockingStatuses.Contains(item.Status), cancellationToken);
                var roomCapacity = await dbContext.Rooms.AsNoTracking().CountAsync(item =>
                    item.DeletedAt == null && item.HospitalUuid == hospitalUuid && item.Status == RoomStatus.Available, cancellationToken);
                var capacity = roomCapacity > 0 ? roomCapacity : Math.Max(hospital.NumberOfRoom, 1);
                slots.Add(new
                {
                    appointmentAt,
                    time = time.ToString("HH:mm"),
                    isAvailable = appointmentAt > DateTime.UtcNow && !patientConflict && !doctorConflict && appointmentCount < capacity
                });
            }
        }

        var workingHour = workings.Count == 0
            ? "Không có lịch làm việc"
            : $"{workings.Min(item => item.StartTime).ToString("HH:mm")} - {workings.Max(item => item.EndTime).ToString("HH:mm")}";
        return Ok(new
        {
            message = "Lấy thời gian khả dụng thành công.",
            data = new { date = date.ToString("yyyy-MM-dd"), workingHour, slots }
        });
    }

    public Task<IActionResult> CreateHospitalBooking(CreatePatientBookingRequest request, CancellationToken cancellationToken) =>
        CreatePatientBooking("hospital", request, cancellationToken);

    public Task<IActionResult> CreateDoctorBooking(CreatePatientBookingRequest request, CancellationToken cancellationToken) =>
        CreatePatientBooking("doctor", request, cancellationToken);

    public Task<IActionResult> CreateMedicalServiceBooking(CreatePatientBookingRequest request, CancellationToken cancellationToken) =>
        CreatePatientBooking("medical-service", request, cancellationToken);

    private async Task<IActionResult> CreatePatientBooking(string type, CreatePatientBookingRequest request, CancellationToken cancellationToken)
    {
        if (User.GetAccountUuid() != request.AccountUuid)
            return Unauthorized(new { code = "UNAUTHORIZED", message = "Phiên đăng nhập không hợp lệ." });
        var appointmentAtUtc = request.AppointmentAt.ToUniversalTime();
        if (appointmentAtUtc <= DateTime.UtcNow)
            return UnprocessableEntity(new { code = "INVALID_DATE", message = "Thời gian khám phải ở tương lai." });

        var patient = await dbContext.PatientProfiles.FirstOrDefaultAsync(item => item.AccountUuid == request.AccountUuid, cancellationToken);
        if (patient is null)
            return Forbid();
        var hospital = await dbContext.Hospitals.AsNoTracking().FirstOrDefaultAsync(item =>
            item.Uuid == request.HospitalUuid && item.DeletedAt == null && item.Status == BaseStatus.Active, cancellationToken);
        if (hospital is null)
            return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Cơ sở khám không hợp lệ." });

        Guid? doctorUuid = null;
        Guid? medicalServiceUuid = null;
        var totalPrice = 0;
        var appointmentType = AppointmentType.Hospital;
        if (type == "doctor")
        {
            if (!request.DoctorUuid.HasValue)
                return UnprocessableEntity(new { code = "INVALID_REQUEST", message = "Thiếu thông tin bác sĩ." });
            var doctor = await dbContext.DoctorProfiles.AsNoTracking().FirstOrDefaultAsync(item =>
                item.Uuid == request.DoctorUuid && item.HospitalUuid == request.HospitalUuid && item.DeletedAt == null, cancellationToken);
            if (doctor is null)
                return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Bác sĩ không thuộc cơ sở đã chọn." });
            doctorUuid = doctor.Uuid;
            totalPrice = doctor.Price;
            appointmentType = AppointmentType.Doctor;
        }
        else if (type == "medical-service")
        {
            if (!request.MedicalServiceUuid.HasValue)
                return UnprocessableEntity(new { code = "INVALID_REQUEST", message = "Thiếu thông tin dịch vụ." });
            var service = await dbContext.MedicalServices.AsNoTracking().FirstOrDefaultAsync(item =>
                item.Uuid == request.MedicalServiceUuid && item.DeletedAt == null && item.Status == BaseStatus.Active, cancellationToken);
            var assigned = service is not null && await dbContext.HospitalMedicalServices.AsNoTracking().AnyAsync(item =>
                item.HospitalUuid == request.HospitalUuid && item.MedicalServiceUuid == request.MedicalServiceUuid, cancellationToken);
            if (!assigned)
                return UnprocessableEntity(new { code = "INVALID_BRANCH", message = "Dịch vụ không khả dụng tại cơ sở đã chọn." });
            medicalServiceUuid = service!.Uuid;
            totalPrice = service.Price;
            appointmentType = AppointmentType.Service;
        }

        var blockingStatuses = new[] { AppointmentStatus.Pending, AppointmentStatus.Approved, AppointmentStatus.Done, AppointmentStatus.CheckedIn };
        var patientConflict = await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
            item.DeletedAt == null && item.PatientUuid == patient.Uuid && item.AppointmentDate == appointmentAtUtc
            && blockingStatuses.Contains(item.Status), cancellationToken);
        var doctorConflict = doctorUuid.HasValue && await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
            item.DeletedAt == null && item.DoctorUuid == doctorUuid && item.AppointmentDate == appointmentAtUtc
            && blockingStatuses.Contains(item.Status), cancellationToken);
        var appointmentCount = await dbContext.Appointments.AsNoTracking().CountAsync(item =>
            item.DeletedAt == null && item.HospitalUuid == request.HospitalUuid && item.AppointmentDate == appointmentAtUtc
            && blockingStatuses.Contains(item.Status), cancellationToken);
        var roomCapacity = await dbContext.Rooms.AsNoTracking().CountAsync(item =>
            item.DeletedAt == null && item.HospitalUuid == request.HospitalUuid && item.Status == RoomStatus.Available, cancellationToken);
        if (patientConflict || doctorConflict || appointmentCount >= (roomCapacity > 0 ? roomCapacity : Math.Max(hospital.NumberOfRoom, 1)))
            return Conflict(new { code = "SLOT_CONFLICT", message = "Thời gian này vừa không còn khả dụng. Vui lòng chọn thời gian khác." });

        var localAppointment = TimeZoneInfo.ConvertTimeFromUtc(appointmentAtUtc, GetVietnamTimeZone());
        var timeSlot = await dbContext.TimeWorkings.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active
                && item.DayOfWeek == (int)localAppointment.DayOfWeek
                && item.StartTime <= TimeOnly.FromDateTime(localAppointment)
                && item.EndTime > TimeOnly.FromDateTime(localAppointment))
            .OrderBy(item => item.StartTime)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);
        if (!timeSlot.HasValue)
            return UnprocessableEntity(new { code = "OUTSIDE_WORKING_HOURS", message = "Thời gian nằm ngoài giờ làm việc." });

        var now = DateTime.UtcNow;
        var appointment = new Appointment
        {
            Uuid = Guid.NewGuid(),
            PatientName = request.PatientName.Trim(),
            Gender = request.Gender,
            MedicalCode = request.MedicalCode.Trim(),
            Note = request.Note.Trim(),
            AppointmentDate = appointmentAtUtc,
            TimeSlot = timeSlot,
            Type = appointmentType,
            Status = AppointmentStatus.Pending,
            PatientUuid = patient.Uuid,
            HospitalUuid = hospital.Uuid,
            DoctorUuid = doctorUuid,
            MedicalServiceUuid = medicalServiceUuid,
            TotalPrice = totalPrice,
            IsPaid = false,
            CreatedAt = now,
            UpdatedAt = now
        };
        dbContext.Appointments.Add(appointment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return StatusCode(StatusCodes.Status201Created, new
        {
            message = "Đặt lịch thành công.",
            data = new
            {
                appointment.Uuid,
                appointment.PatientName,
                appointment.Gender,
                appointment.Note,
                appointment.MedicalCode,
                appointmentAt = appointment.AppointmentDate,
                appointment.Status,
                accountUuid = request.AccountUuid,
                hospitalUuid = hospital.Uuid,
                roomUuid = appointment.RoomUuid,
                doctorUuid = appointment.DoctorUuid,
                medicalServiceUuid = appointment.MedicalServiceUuid,
                isWalkIn = false,
                guestPhone = (string?)null,
                appointment.CreatedAt,
                appointment.UpdatedAt
            }
        });
    }

    private static TimeZoneInfo GetVietnamTimeZone()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
        catch (TimeZoneNotFoundException) { return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
    }

    public async Task<IActionResult> GetAppointments(
        Guid accountUuid,
        int page = 1,
        int pageSize = 20,
        AppointmentStatus? status = null,
        string? type = null,
        DateOnly? from = null,
        DateOnly? to = null,
        CancellationToken cancellationToken = default)
    {
        if (User.GetAccountUuid() != accountUuid)
            return Unauthorized(new { code = "UNAUTHORIZED", message = "Phiên đăng nhập không hợp lệ." });
        if (page < 1 || pageSize < 1 || pageSize > 20 || (from.HasValue && to.HasValue && from > to))
            return UnprocessableEntity(new { code = "INVALID_FILTER", message = "Bộ lọc lịch hẹn không hợp lệ." });
        if (type is not null && type is not ("hospital" or "doctor" or "medical-service"))
            return UnprocessableEntity(new { code = "INVALID_FILTER", message = "Loại lịch hẹn không hợp lệ." });

        var patientUuid = await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => item.AccountUuid == accountUuid)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);
        if (!patientUuid.HasValue) return Forbid();

        var query = dbContext.Appointments.AsNoTracking().Where(item =>
            item.DeletedAt == null && item.PatientUuid == patientUuid);
        if (status.HasValue) query = query.Where(item => item.Status == status.Value);
        if (type == "hospital") query = query.Where(item => item.Type == AppointmentType.Hospital);
        else if (type == "doctor") query = query.Where(item => item.Type == AppointmentType.Doctor);
        else if (type == "medical-service") query = query.Where(item => item.Type == AppointmentType.Service);
        if (from.HasValue)
        {
            var fromUtc = new DateTimeOffset(from.Value.ToDateTime(TimeOnly.MinValue), TimeSpan.FromHours(7)).UtcDateTime;
            query = query.Where(item => item.AppointmentDate >= fromUtc);
        }
        if (to.HasValue)
        {
            var toUtc = new DateTimeOffset(to.Value.AddDays(1).ToDateTime(TimeOnly.MinValue), TimeSpan.FromHours(7)).UtcDateTime;
            query = query.Where(item => item.AppointmentDate < toUtc);
        }

        var totalItems = await query.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling((double)totalItems / pageSize));
        var safePage = Math.Min(page, totalPages);
        var appointments = await query.OrderByDescending(item => item.AppointmentDate)
            .Skip((safePage - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        var hospitalUuids = appointments.Where(item => item.HospitalUuid.HasValue).Select(item => item.HospitalUuid!.Value).Distinct().ToArray();
        var doctorUuids = appointments.Where(item => item.DoctorUuid.HasValue).Select(item => item.DoctorUuid!.Value).Distinct().ToArray();
        var serviceUuids = appointments.Where(item => item.MedicalServiceUuid.HasValue).Select(item => item.MedicalServiceUuid!.Value).Distinct().ToArray();
        var roomUuids = appointments.Where(item => item.RoomUuid.HasValue).Select(item => item.RoomUuid!.Value).Distinct().ToArray();
        var hospitals = await dbContext.Hospitals.AsNoTracking().Where(item => hospitalUuids.Contains(item.Uuid)).ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var doctors = await dbContext.DoctorProfiles.AsNoTracking().Where(item => doctorUuids.Contains(item.Uuid)).ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var services = await dbContext.MedicalServices.AsNoTracking().Where(item => serviceUuids.Contains(item.Uuid)).ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var rooms = await dbContext.Rooms.AsNoTracking().Where(item => roomUuids.Contains(item.Uuid)).ToDictionaryAsync(item => item.Uuid, cancellationToken);

        var items = appointments.Select(item =>
        {
            hospitals.TryGetValue(item.HospitalUuid ?? Guid.Empty, out var hospital);
            doctors.TryGetValue(item.DoctorUuid ?? Guid.Empty, out var doctor);
            services.TryGetValue(item.MedicalServiceUuid ?? Guid.Empty, out var service);
            rooms.TryGetValue(item.RoomUuid ?? Guid.Empty, out var room);
            var bookingType = item.Type == AppointmentType.Doctor ? "doctor" : item.Type == AppointmentType.Service ? "medical-service" : "hospital";
            return new
            {
                type = bookingType,
                appointment = new
                {
                    item.Uuid,
                    item.PatientName,
                    item.Gender,
                    item.Note,
                    item.MedicalCode,
                    appointmentAt = item.AppointmentDate,
                    item.Status,
                    accountUuid,
                    hospitalUuid = item.HospitalUuid,
                    roomUuid = item.RoomUuid,
                    doctorUuid = item.DoctorUuid,
                    medicalServiceUuid = item.MedicalServiceUuid,
                    isWalkIn = false,
                    guestPhone = (string?)null,
                    item.CreatedAt,
                    item.UpdatedAt
                },
                targetName = doctor?.Name ?? service?.Name ?? hospital?.Name ?? "Cơ sở y tế",
                hospitalName = hospital?.Name ?? "Cơ sở y tế",
                hospitalSlug = hospital?.Slug ?? string.Empty,
                targetSlug = doctor?.Slug ?? service?.Slug ?? hospital?.Slug ?? string.Empty,
                roomName = room?.Name ?? string.Empty
            };
        }).ToList();

        return Ok(new { message = "Lấy danh sách lịch hẹn thành công.", data = new { Items = items, Page = safePage, PageSize = pageSize, TotalItems = totalItems, TotalPages = totalPages } });
    }

    public async Task<IActionResult> GetAppointment(Guid id, CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });

        var response = new AppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            RoomUuid = appointment.RoomUuid,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };

        return Ok(new { message = "Fetched successfully", data = response });
    }

    public async Task<IActionResult> GetAppointmentDetail(Guid uuid, Guid accountUuid, CancellationToken cancellationToken = default)
    {
        if (User.GetAccountUuid() != accountUuid)
            return Unauthorized(new { code = "UNAUTHORIZED", message = "Phiên đăng nhập không hợp lệ." });
        var presentation = await BuildPatientPresentationAsync(uuid, accountUuid, cancellationToken);
        return presentation is null
            ? NotFound(new { code = "NOT_FOUND", message = "Không tìm thấy lịch hẹn hoặc bạn không có quyền xem." })
            : Ok(new { message = "Lấy chi tiết lịch hẹn thành công.", data = presentation });
    }

    public async Task<IActionResult> RescheduleAppointment(Guid uuid, ReschedulePatientAppointmentRequest request, CancellationToken cancellationToken = default)
    {
        if (User.GetAccountUuid() != request.AccountUuid)
            return Unauthorized(new { code = "UNAUTHORIZED", message = "Phiên đăng nhập không hợp lệ." });
        var patientUuid = await GetPatientUuidAsync(request.AccountUuid, cancellationToken);
        if (!patientUuid.HasValue) return Forbid();
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(item =>
            item.Uuid == uuid && item.PatientUuid == patientUuid && item.DeletedAt == null, cancellationToken);
        if (appointment is null)
            return NotFound(new { code = "NOT_FOUND", message = "Không tìm thấy lịch hẹn." });
        if (appointment.Status is not (AppointmentStatus.Pending or AppointmentStatus.Approved))
            return Conflict(new { code = "NOT_EDITABLE", message = "Trạng thái lịch hẹn hiện tại không cho phép đổi lịch." });

        var appointmentAtUtc = request.AppointmentAt.ToUniversalTime();
        if (appointment.AppointmentDate <= DateTime.UtcNow.AddHours(24) || appointmentAtUtc <= DateTime.UtcNow.AddHours(24))
            return UnprocessableEntity(new { code = "INVALID_DATE", message = "Thời gian mới phải cách hiện tại ít nhất 24 giờ." });
        var localAppointment = TimeZoneInfo.ConvertTimeFromUtc(appointmentAtUtc, GetVietnamTimeZone());
        var localTime = TimeOnly.FromDateTime(localAppointment);
        var timeSlot = await dbContext.TimeWorkings.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active
                && item.DayOfWeek == (int)localAppointment.DayOfWeek
                && item.StartTime <= localTime && item.EndTime > localTime)
            .OrderBy(item => item.StartTime)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);
        if (!timeSlot.HasValue)
            return UnprocessableEntity(new { code = "OUTSIDE_WORKING_HOURS", message = "Thời gian nằm ngoài giờ làm việc." });

        var conflict = await HasAppointmentConflictAsync(appointment, appointmentAtUtc, cancellationToken);
        if (conflict)
            return Conflict(new { code = "SLOT_CONFLICT", message = "Thời gian này vừa không còn khả dụng. Vui lòng chọn thời gian khác." });
        appointment.AppointmentDate = appointmentAtUtc;
        appointment.TimeSlot = timeSlot;
        appointment.RoomUuid = null;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        var presentation = await BuildPatientPresentationAsync(uuid, request.AccountUuid, cancellationToken);
        return Ok(new { message = "Đổi thời gian lịch hẹn thành công.", data = presentation });
    }

    public async Task<IActionResult> CancelPatientAppointment(Guid uuid, CancelPatientAppointmentRequest request, CancellationToken cancellationToken = default)
    {
        if (User.GetAccountUuid() != request.AccountUuid)
            return Unauthorized(new { code = "UNAUTHORIZED", message = "Phiên đăng nhập không hợp lệ." });
        var patientUuid = await GetPatientUuidAsync(request.AccountUuid, cancellationToken);
        if (!patientUuid.HasValue) return Forbid();
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(item =>
            item.Uuid == uuid && item.PatientUuid == patientUuid && item.DeletedAt == null, cancellationToken);
        if (appointment is null)
            return NotFound(new { code = "NOT_FOUND", message = "Không tìm thấy lịch hẹn." });
        if (appointment.Status is not (AppointmentStatus.Pending or AppointmentStatus.Approved))
            return Conflict(new { code = "NOT_EDITABLE", message = "Trạng thái lịch hẹn hiện tại không cho phép hủy." });
        if (appointment.AppointmentDate <= DateTime.UtcNow.AddHours(24))
            return UnprocessableEntity(new { code = "TOO_LATE", message = "Chỉ có thể hủy lịch trước giờ khám ít nhất 24 giờ." });

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        var presentation = await BuildPatientPresentationAsync(uuid, request.AccountUuid, cancellationToken);
        return Ok(new { message = "Hủy lịch hẹn thành công.", data = presentation });
    }

    private async Task<Guid?> GetPatientUuidAsync(Guid accountUuid, CancellationToken cancellationToken) =>
        await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => item.AccountUuid == accountUuid)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);

    private async Task<bool> HasAppointmentConflictAsync(Appointment appointment, DateTime appointmentAt, CancellationToken cancellationToken)
    {
        var blockingStatuses = new[] { AppointmentStatus.Pending, AppointmentStatus.Approved, AppointmentStatus.Done, AppointmentStatus.CheckedIn };
        var patientConflict = await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
            item.Uuid != appointment.Uuid && item.DeletedAt == null && item.PatientUuid == appointment.PatientUuid
            && item.AppointmentDate == appointmentAt && blockingStatuses.Contains(item.Status), cancellationToken);
        var doctorConflict = appointment.DoctorUuid.HasValue && await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
            item.Uuid != appointment.Uuid && item.DeletedAt == null && item.DoctorUuid == appointment.DoctorUuid
            && item.AppointmentDate == appointmentAt && blockingStatuses.Contains(item.Status), cancellationToken);
        var appointmentCount = await dbContext.Appointments.AsNoTracking().CountAsync(item =>
            item.Uuid != appointment.Uuid && item.DeletedAt == null && item.HospitalUuid == appointment.HospitalUuid
            && item.AppointmentDate == appointmentAt && blockingStatuses.Contains(item.Status), cancellationToken);
        var roomCapacity = await dbContext.Rooms.AsNoTracking().CountAsync(item =>
            item.DeletedAt == null && item.HospitalUuid == appointment.HospitalUuid && item.Status == RoomStatus.Available, cancellationToken);
        if (roomCapacity == 0 && appointment.HospitalUuid.HasValue)
            roomCapacity = await dbContext.Hospitals.AsNoTracking().Where(item => item.Uuid == appointment.HospitalUuid)
                .Select(item => item.NumberOfRoom).FirstOrDefaultAsync(cancellationToken);
        return patientConflict || doctorConflict || appointmentCount >= Math.Max(roomCapacity, 1);
    }

    private async Task<object?> BuildPatientPresentationAsync(Guid uuid, Guid accountUuid, CancellationToken cancellationToken)
    {
        var patientUuid = await GetPatientUuidAsync(accountUuid, cancellationToken);
        if (!patientUuid.HasValue) return null;
        var appointment = await dbContext.Appointments.AsNoTracking().FirstOrDefaultAsync(item =>
            item.Uuid == uuid && item.PatientUuid == patientUuid && item.DeletedAt == null, cancellationToken);
        if (appointment is null) return null;
        var hospital = appointment.HospitalUuid.HasValue
            ? await dbContext.Hospitals.AsNoTracking().FirstOrDefaultAsync(item => item.Uuid == appointment.HospitalUuid, cancellationToken)
            : null;
        var doctor = appointment.DoctorUuid.HasValue
            ? await dbContext.DoctorProfiles.AsNoTracking().FirstOrDefaultAsync(item => item.Uuid == appointment.DoctorUuid, cancellationToken)
            : null;
        var medicalService = appointment.MedicalServiceUuid.HasValue
            ? await dbContext.MedicalServices.AsNoTracking().FirstOrDefaultAsync(item => item.Uuid == appointment.MedicalServiceUuid, cancellationToken)
            : null;
        var room = appointment.RoomUuid.HasValue
            ? await dbContext.Rooms.AsNoTracking().FirstOrDefaultAsync(item => item.Uuid == appointment.RoomUuid, cancellationToken)
            : null;
        var type = appointment.Type == AppointmentType.Doctor ? "doctor" : appointment.Type == AppointmentType.Service ? "medical-service" : "hospital";
        return new
        {
            type,
            appointment = new
            {
                appointment.Uuid,
                appointment.PatientName,
                appointment.Gender,
                appointment.Note,
                appointment.MedicalCode,
                appointmentAt = appointment.AppointmentDate,
                appointment.Status,
                accountUuid,
                hospitalUuid = appointment.HospitalUuid,
                roomUuid = appointment.RoomUuid,
                doctorUuid = appointment.DoctorUuid,
                medicalServiceUuid = appointment.MedicalServiceUuid,
                isWalkIn = false,
                guestPhone = (string?)null,
                appointment.CreatedAt,
                appointment.UpdatedAt
            },
            targetName = doctor?.Name ?? medicalService?.Name ?? hospital?.Name ?? "Cơ sở y tế",
            hospitalName = hospital?.Name ?? "Cơ sở y tế",
            hospitalSlug = hospital?.Slug ?? string.Empty,
            targetSlug = doctor?.Slug ?? medicalService?.Slug ?? hospital?.Slug ?? string.Empty,
            roomName = room?.Name ?? string.Empty
        };
    }

    public async Task<IActionResult> CreateAppointment(
        CreateAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = new Appointment
        {
            Uuid = Guid.NewGuid(),
            PatientName = request.PatientName,
            Gender = request.Gender,
            MedicalCode = request.MedicalCode,
            Note = request.Note,
            AppointmentDate = request.AppointmentDate,
            TimeSlot = request.TimeSlot,
            Type = request.Type,
            Status = AppointmentStatus.Pending,
            PatientUuid = request.PatientUuid,
            HospitalUuid = request.HospitalUuid,
            DoctorUuid = request.DoctorUuid,
            MedicalServiceUuid = request.MedicalServiceUuid,
            RoomUuid = request.RoomUuid,
            TotalPrice = request.TotalPrice,
            IsPaid = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Appointments.Add(appointment);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new AppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            RoomUuid = appointment.RoomUuid,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };

        return StatusCode(StatusCodes.Status201Created,
            new { message = "Created successfully", data = response });
    }

    public async Task<IActionResult> UpdateAppointment(
        Guid id,
        UpdateAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });

        appointment.PatientName = request.PatientName ?? appointment.PatientName;
        appointment.Gender = request.Gender;
        appointment.MedicalCode = request.MedicalCode ?? appointment.MedicalCode;
        appointment.Note = request.Note ?? appointment.Note;
        appointment.AppointmentDate = request.AppointmentDate != default ? request.AppointmentDate : appointment.AppointmentDate;
        appointment.TimeSlot = request.TimeSlot ?? appointment.TimeSlot;
        appointment.Type = request.Type;
        appointment.PatientUuid = request.PatientUuid ?? appointment.PatientUuid;
        appointment.DoctorUuid = request.DoctorUuid ?? appointment.DoctorUuid;
        appointment.MedicalServiceUuid = request.MedicalServiceUuid ?? appointment.MedicalServiceUuid;
        appointment.RoomUuid = request.RoomUuid ?? appointment.RoomUuid;
        appointment.TotalPrice = request.TotalPrice.HasValue ? request.TotalPrice.Value : appointment.TotalPrice;
        appointment.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new AppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            RoomUuid = appointment.RoomUuid,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }

    public async Task<IActionResult> DeleteAppointment(Guid id, CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });

        appointment.DeletedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    public async Task<IActionResult> ApproveAppointment(
        Guid id,
        ApproveAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });

        if (appointment.Status != AppointmentStatus.Pending)
            return BadRequest(new { message = "Invalid state", error = "Appointment must be in Pending status" });

        appointment.Status = AppointmentStatus.Approved;
        appointment.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new AppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            RoomUuid = appointment.RoomUuid,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }

    public async Task<IActionResult> CompleteAppointment(
        Guid id,
        CompleteAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });

        if (appointment.Status != AppointmentStatus.CheckedIn)
            return BadRequest(new { message = "Invalid state", error = "Appointment must be in CheckedIn status" });
        if (!appointment.IsPaid)
            return Conflict(new { message = "Appointment must be paid before completion", error = "PAYMENT_REQUIRED" });
        if (await dbContext.AppointmentMedicalServices.AnyAsync(
                item => item.AppointmentUuid == appointment.Uuid &&
                        item.Status != AppointmentMedicalServiceStatus.Completed,
                cancellationToken))
            return Conflict(new { message = "All additional services must be completed first", error = "SERVICES_INCOMPLETE" });

        appointment.Status = AppointmentStatus.Done;
        appointment.DoctorNote = request.DoctorNote ?? appointment.DoctorNote;
        appointment.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new AppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            RoomUuid = appointment.RoomUuid,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }

    public async Task<IActionResult> CheckInAppointment(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
            return NotFound(new { message = "Appointment not found", error = "Resource does not exist" });

        if (appointment.Status != AppointmentStatus.Approved)
            return BadRequest(new { message = "Invalid state", error = "Appointment must be in Approved status" });

        appointment.Status = AppointmentStatus.CheckedIn;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new AppointmentResponse
        {
            Uuid = appointment.Uuid,
            PatientName = appointment.PatientName,
            Gender = appointment.Gender.ToString(),
            MedicalCode = appointment.MedicalCode,
            Note = appointment.Note,
            AppointmentDate = appointment.AppointmentDate,
            TimeSlot = appointment.TimeSlot,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            PatientUuid = appointment.PatientUuid,
            HospitalUuid = appointment.HospitalUuid,
            DoctorUuid = appointment.DoctorUuid,
            MedicalServiceUuid = appointment.MedicalServiceUuid,
            RoomUuid = appointment.RoomUuid,
            DoctorNote = appointment.DoctorNote,
            TotalPrice = appointment.TotalPrice,
            IsPaid = appointment.IsPaid,
            CreatedAt = appointment.CreatedAt,
            UpdatedAt = appointment.UpdatedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }
}
