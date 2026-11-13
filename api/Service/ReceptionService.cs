using System.Globalization;
using api.Contract.Reception;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public sealed class ReceptionService(DBContext dbContext)
{
    private static readonly AppointmentStatus[] QueueStatuses =
        [AppointmentStatus.CheckedIn, AppointmentStatus.InProgress];

    public async Task<List<ReceptionAppointmentResponse>> GetQueueAsync(
        Guid hospitalUuid,
        CancellationToken cancellationToken)
    {
        var appointments = await dbContext.Appointments.AsNoTracking()
            .Where(item => item.HospitalUuid == hospitalUuid
                && item.DeletedAt == null
                && item.Status == AppointmentStatus.Approved)
            .OrderBy(item => item.AppointmentDate)
            .ThenBy(item => item.CreatedAt)
            .Take(100)
            .ToListAsync(cancellationToken);

        return await BuildResponsesAsync(appointments, cancellationToken);
    }

    public async Task<(List<ReceptionAppointmentResponse>? Data, string? Error)> SearchAsync(
        Guid accountHospitalUuid,
        string? query,
        string? date,
        CancellationToken cancellationToken)
    {
        if (!TryGetLocalDay(date, out var startUtc, out var endUtc))
            return (null, "Ngày tra cứu không hợp lệ.");

        var appointments = await dbContext.Appointments.AsNoTracking()
            .Where(item => item.HospitalUuid == accountHospitalUuid
                && item.DeletedAt == null
                && item.AppointmentDate >= startUtc
                && item.AppointmentDate < endUtc)
            .OrderBy(item => item.AppointmentDate)
            .Take(500)
            .ToListAsync(cancellationToken);

        var patientIds = appointments.Where(item => item.PatientUuid.HasValue)
            .Select(item => item.PatientUuid!.Value).Distinct().ToArray();
        var patients = await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => patientIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var accountIds = patients.Values.Where(item => item.AccountUuid.HasValue)
            .Select(item => item.AccountUuid!.Value).Distinct().ToArray();
        var phones = await dbContext.Accounts.AsNoTracking()
            .Where(item => accountIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Phone, cancellationToken);
        var doctorIds = appointments.Where(item => item.DoctorUuid.HasValue)
            .Select(item => item.DoctorUuid!.Value).Distinct().ToArray();
        var doctors = await dbContext.DoctorProfiles.AsNoTracking()
            .Where(item => doctorIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Name, cancellationToken);
        var roomIds = appointments.Where(item => item.RoomUuid.HasValue)
            .Select(item => item.RoomUuid!.Value).Distinct().ToArray();
        var rooms = await dbContext.Rooms.AsNoTracking()
            .Where(item => roomIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Name, cancellationToken);

        var keyword = query?.Trim();
        var responses = appointments.Select(item => ToResponse(item, patients, phones, doctors, rooms));
        if (!string.IsNullOrWhiteSpace(keyword))
        {
            responses = responses.Where(item =>
                item.Code.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                || item.Uuid.ToString().Contains(keyword, StringComparison.OrdinalIgnoreCase)
                || item.PatientName.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                || item.MedicalCode.Contains(keyword, StringComparison.OrdinalIgnoreCase)
                || item.Phone.Contains(keyword, StringComparison.OrdinalIgnoreCase));
        }
        else
        {
            responses = responses.Where(item => item.Status is "Approved" or "CheckedIn" or "InProgress");
        }

        return (responses.Take(50).ToList(), null);
    }

    public async Task<(ReceptionRoutingResponse? Data, string? Error)> GetRoutingAsync(
        Guid hospitalUuid,
        Guid appointmentUuid,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.AsNoTracking().FirstOrDefaultAsync(item =>
            item.Uuid == appointmentUuid && item.HospitalUuid == hospitalUuid && item.DeletedAt == null,
            cancellationToken);
        if (appointment is null) return (null, "Không tìm thấy lịch hẹn tại chi nhánh này.");

        var roomEntities = await dbContext.Rooms.AsNoTracking()
            .Where(item => item.HospitalUuid == hospitalUuid && item.DeletedAt == null)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);
        var roomIds = roomEntities.Select(item => item.Uuid).ToArray();
        var local = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(appointment.AppointmentDate, DateTimeKind.Utc), GetVietnamTimeZone());
        var dayStart = new DateTimeOffset(local.Date, TimeSpan.FromHours(7)).UtcDateTime;
        var dayEnd = dayStart.AddDays(1);

        var waitingCounts = await dbContext.Appointments.AsNoTracking()
            .Where(item => item.HospitalUuid == hospitalUuid && item.RoomUuid.HasValue
                && roomIds.Contains(item.RoomUuid.Value) && item.DeletedAt == null
                && item.AppointmentDate >= dayStart && item.AppointmentDate < dayEnd
                && QueueStatuses.Contains(item.Status))
            .GroupBy(item => item.RoomUuid!.Value)
            .Select(group => new { RoomUuid = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.RoomUuid, item => item.Count, cancellationToken);
        var slotCounts = appointment.TimeSlot.HasValue
            ? await dbContext.Appointments.AsNoTracking()
                .Where(item => item.HospitalUuid == hospitalUuid && item.RoomUuid.HasValue
                    && roomIds.Contains(item.RoomUuid.Value) && item.DeletedAt == null
                    && item.AppointmentDate >= dayStart && item.AppointmentDate < dayEnd
                    && item.TimeSlot == appointment.TimeSlot
                    && (item.Status == AppointmentStatus.Approved || QueueStatuses.Contains(item.Status)))
                .GroupBy(item => item.RoomUuid!.Value)
                .Select(group => new { RoomUuid = group.Key, Count = group.Count() })
                .ToDictionaryAsync(item => item.RoomUuid, item => item.Count, cancellationToken)
            : [];

        var assignments = appointment.TimeSlot.HasValue
            ? await (from working in dbContext.DoctorSchedules.AsNoTracking()
                     join doctor in dbContext.DoctorProfiles.AsNoTracking() on working.DoctorUuid equals doctor.Uuid
                     where working.WorkingHourUuid == appointment.TimeSlot.Value
                         && working.RoomUuid.HasValue && roomIds.Contains(working.RoomUuid.Value)
                         && doctor.HospitalUuid == hospitalUuid && doctor.DeletedAt == null
                     select new { working.RoomUuid, working.DoctorUuid, doctor.Name }).ToListAsync(cancellationToken)
            : [];

        Guid? requiredDoctorRoom = null;
        if (appointment.Type == AppointmentType.Doctor && appointment.DoctorUuid.HasValue)
            requiredDoctorRoom = assignments.FirstOrDefault(item => item.DoctorUuid == appointment.DoctorUuid)?.RoomUuid;

        var selectable = roomEntities.Where(room => room.Status != RoomStatus.Maintenance)
            .Where(room => appointment.Type != AppointmentType.Doctor || room.Uuid == requiredDoctorRoom)
            .Where(room => appointment.Type != AppointmentType.Hospital || assignments.Any(item => item.RoomUuid == room.Uuid))
            .OrderBy(room => waitingCounts.GetValueOrDefault(room.Uuid))
            .ThenBy(room => slotCounts.GetValueOrDefault(room.Uuid))
            .FirstOrDefault();
        var recommendedRoomUuid = requiredDoctorRoom ?? selectable?.Uuid;

        var patientIds = appointment.PatientUuid.HasValue ? new[] { appointment.PatientUuid.Value } : [];
        var patients = await dbContext.PatientProfiles.AsNoTracking().Where(item => patientIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var accountIds = patients.Values.Where(item => item.AccountUuid.HasValue).Select(item => item.AccountUuid!.Value).ToArray();
        var phones = await dbContext.Accounts.AsNoTracking().Where(item => accountIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Phone, cancellationToken);
        var doctors = await dbContext.DoctorProfiles.AsNoTracking().Where(item => item.Uuid == appointment.DoctorUuid)
            .ToDictionaryAsync(item => item.Uuid, item => item.Name, cancellationToken);
        var roomNames = roomEntities.ToDictionary(item => item.Uuid, item => item.Name);

        var roomOptions = roomEntities.Select(room =>
        {
            var roomAssignments = assignments.Where(item => item.RoomUuid == room.Uuid).ToList();
            var doctorMismatch = appointment.Type == AppointmentType.Doctor && room.Uuid != requiredDoctorRoom;
            var missingSchedule = appointment.Type == AppointmentType.Doctor && !requiredDoctorRoom.HasValue;
            var noDoctorInRoom = appointment.Type == AppointmentType.Hospital && roomAssignments.Count == 0;
            var unavailableReason = room.Status == RoomStatus.Maintenance
                ? "Phòng đang bảo trì."
                : missingSchedule
                    ? "Bác sĩ chưa được xếp phòng trong ca này."
                    : doctorMismatch
                        ? "Không phải phòng làm việc của bác sĩ đã đặt."
                        : noDoctorInRoom ? "Chưa có bác sĩ làm tại phòng trong ca này." : null;
            return new ReceptionRoomOptionResponse
            {
                Uuid = room.Uuid,
                Name = room.Name,
                Status = room.Status.ToString(),
                WaitingCount = waitingCounts.GetValueOrDefault(room.Uuid),
                SlotLoadCount = slotCounts.GetValueOrDefault(room.Uuid),
                IsDoctorScheduled = roomAssignments.Count > 0,
                ScheduledDoctorNames = roomAssignments.Select(item => item.Name).Distinct().ToList(),
                IsRecommended = room.Uuid == recommendedRoomUuid,
                CanSelect = unavailableReason is null,
                UnavailableReason = unavailableReason
            };
        }).ToList();

        var recommendation = appointment.Type == AppointmentType.Doctor
            ? requiredDoctorRoom.HasValue
                ? "Phòng được xác định theo ca làm việc của bác sĩ đã đặt."
                : "Chưa thể check-in: bác sĩ chưa được xếp phòng cho ca này."
            : recommendedRoomUuid.HasValue
                ? "Ưu tiên phòng có hàng chờ và tải trong ca thấp nhất."
                : "Không có phòng khả dụng.";

        return (new ReceptionRoutingResponse
        {
            Appointment = ToResponse(appointment, patients, phones, doctors, roomNames),
            Rooms = roomOptions,
            RecommendedRoomUuid = recommendedRoomUuid,
            Recommendation = recommendation
        }, null);
    }

    public async Task<(ReceptionAppointmentResponse? Data, string? Error, int StatusCode)> CheckInAsync(
        Guid hospitalUuid,
        Guid appointmentUuid,
        Guid roomUuid,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments.FirstOrDefaultAsync(item =>
            item.Uuid == appointmentUuid && item.HospitalUuid == hospitalUuid && item.DeletedAt == null,
            cancellationToken);
        if (appointment is null) return (null, "Không tìm thấy lịch hẹn tại chi nhánh này.", 404);
        if (appointment.Status != AppointmentStatus.Approved)
            return (null, "Chỉ lịch đã xác nhận mới có thể check-in.", 409);

        var room = await dbContext.Rooms.AsNoTracking().FirstOrDefaultAsync(item =>
            item.Uuid == roomUuid && item.HospitalUuid == hospitalUuid && item.DeletedAt == null,
            cancellationToken);
        if (room is null || room.Status == RoomStatus.Maintenance)
            return (null, "Phòng khám không khả dụng.", 422);

        if (appointment.Type == AppointmentType.Doctor)
        {
            var doctorWorksHere = appointment.DoctorUuid.HasValue && appointment.TimeSlot.HasValue
                && await dbContext.DoctorSchedules.AsNoTracking().AnyAsync(item =>
                    item.DoctorUuid == appointment.DoctorUuid.Value
                    && item.WorkingHourUuid == appointment.TimeSlot.Value
                    && item.RoomUuid == roomUuid, cancellationToken);
            if (!doctorWorksHere)
                return (null, "Lịch đặt bác sĩ phải được chuyển đúng phòng bác sĩ làm trong ca này.", 422);
        }
        else if (appointment.Type == AppointmentType.Hospital)
        {
            var hasDoctor = appointment.TimeSlot.HasValue && await dbContext.DoctorSchedules.AsNoTracking()
                .AnyAsync(item => item.WorkingHourUuid == appointment.TimeSlot.Value && item.RoomUuid == roomUuid, cancellationToken);
            if (!hasDoctor)
                return (null, "Phòng chưa có bác sĩ làm việc trong ca của lịch hẹn.", 422);
        }

        appointment.RoomUuid = roomUuid;
        appointment.Status = AppointmentStatus.CheckedIn;
        appointment.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return (new ReceptionAppointmentResponse
        {
            Uuid = appointment.Uuid,
            Code = AppointmentCode(appointment.Uuid),
            PatientName = appointment.PatientName,
            MedicalCode = appointment.MedicalCode,
            Gender = appointment.Gender.ToString(),
            AppointmentDate = appointment.AppointmentDate,
            Type = appointment.Type.ToString(),
            Status = appointment.Status.ToString(),
            DoctorUuid = appointment.DoctorUuid,
            RoomUuid = room.Uuid,
            RoomName = room.Name,
            Note = appointment.Note
        }, null, 200);
    }

    private static ReceptionAppointmentResponse ToResponse(
        Appointment item,
        IReadOnlyDictionary<Guid, PatientProfile> patients,
        IReadOnlyDictionary<Guid, string> phones,
        IReadOnlyDictionary<Guid, string> doctors,
        IReadOnlyDictionary<Guid, string> rooms)
    {
        patients.TryGetValue(item.PatientUuid ?? Guid.Empty, out var patient);
        var phone = patient?.AccountUuid is Guid accountUuid ? phones.GetValueOrDefault(accountUuid) : null;
        return new ReceptionAppointmentResponse
        {
            Uuid = item.Uuid,
            Code = AppointmentCode(item.Uuid),
            PatientName = item.PatientName,
            MedicalCode = !string.IsNullOrWhiteSpace(patient?.MedicalCode) ? patient.MedicalCode : item.MedicalCode,
            Phone = phone ?? string.Empty,
            Gender = item.Gender.ToString(),
            AppointmentDate = item.AppointmentDate,
            Type = item.Type.ToString(),
            Status = item.Status.ToString(),
            DoctorUuid = item.DoctorUuid,
            DoctorName = item.DoctorUuid.HasValue ? doctors.GetValueOrDefault(item.DoctorUuid.Value) : null,
            RoomUuid = item.RoomUuid,
            RoomName = item.RoomUuid.HasValue ? rooms.GetValueOrDefault(item.RoomUuid.Value) : null,
            Note = item.Note
        };
    }

    private async Task<List<ReceptionAppointmentResponse>> BuildResponsesAsync(
        List<Appointment> appointments,
        CancellationToken cancellationToken)
    {
        var patientIds = appointments.Where(item => item.PatientUuid.HasValue)
            .Select(item => item.PatientUuid!.Value).Distinct().ToArray();
        var patients = await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => patientIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var accountIds = patients.Values.Where(item => item.AccountUuid.HasValue)
            .Select(item => item.AccountUuid!.Value).Distinct().ToArray();
        var phones = await dbContext.Accounts.AsNoTracking()
            .Where(item => accountIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Phone, cancellationToken);
        var doctorIds = appointments.Where(item => item.DoctorUuid.HasValue)
            .Select(item => item.DoctorUuid!.Value).Distinct().ToArray();
        var doctors = await dbContext.DoctorProfiles.AsNoTracking()
            .Where(item => doctorIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Name, cancellationToken);
        var roomIds = appointments.Where(item => item.RoomUuid.HasValue)
            .Select(item => item.RoomUuid!.Value).Distinct().ToArray();
        var rooms = await dbContext.Rooms.AsNoTracking()
            .Where(item => roomIds.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, item => item.Name, cancellationToken);

        return appointments.Select(item => ToResponse(item, patients, phones, doctors, rooms)).ToList();
    }

    private static string AppointmentCode(Guid uuid) => $"APT-{uuid.ToString("N")[..8].ToUpperInvariant()}";

    private static bool TryGetLocalDay(string? date, out DateTime startUtc, out DateTime endUtc)
    {
        var selected = string.IsNullOrWhiteSpace(date)
            ? DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, GetVietnamTimeZone()))
            : DateOnly.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed)
                ? parsed : default;
        if (selected == default) { startUtc = endUtc = default; return false; }
        startUtc = new DateTimeOffset(selected.ToDateTime(TimeOnly.MinValue), TimeSpan.FromHours(7)).UtcDateTime;
        endUtc = startUtc.AddDays(1);
        return true;
    }

    private static TimeZoneInfo GetVietnamTimeZone()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
        catch (TimeZoneNotFoundException) { return TimeZoneInfo.CreateCustomTimeZone("UTC+7", TimeSpan.FromHours(7), "UTC+7", "UTC+7"); }
    }
}
