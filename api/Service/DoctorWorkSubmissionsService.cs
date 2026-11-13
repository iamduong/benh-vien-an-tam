using api.Contract.Doctor;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

[NonController]
public sealed class DoctorWorkSubmissionsService(DBContext dbContext) : ControllerBase
{
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        var doctor = await GetCurrentDoctorAsync(cancellationToken);
        if (doctor is null)
            return Forbid();

        var schedule = await dbContext.DoctorSchedules
            .AsNoTracking()
            .Where(item => item.DoctorUuid == doctor.Uuid)
            .Join(
                ActiveWorkingHours(),
                assignment => assignment.WorkingHourUuid,
                working => working.Uuid,
                (assignment, working) => new DoctorScheduleResponse
                {
                    DoctorScheduleUuid = assignment.Uuid,
                    RoomUuid = assignment.RoomUuid,
                    RoomName = assignment.RoomUuid.HasValue
                        ? dbContext.Rooms.Where(room => room.Uuid == assignment.RoomUuid).Select(room => room.Name).FirstOrDefault()
                        : null,
                    Uuid = working.Uuid,
                    DayOfWeek = working.DayOfWeek,
                    StartTime = working.StartTime,
                    EndTime = working.EndTime,
                })
            .OrderBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime)
            .ToListAsync(cancellationToken);

        var availableWorkingHours = await HospitalWorkingHours(doctor.HospitalUuid)
            .OrderBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime)
            .Select(item => new WorkingHourOptionResponse
            {
                Uuid = item.Uuid,
                DayOfWeek = item.DayOfWeek,
                StartTime = item.StartTime,
                EndTime = item.EndTime,
            })
            .ToListAsync(cancellationToken);

        var submissions = await GetSubmissionQuery()
            .Where(item => item.DoctorUuid == doctor.Uuid)
            .OrderByDescending(item => item.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            message = "Lấy lịch và đơn thay đổi giờ làm thành công.",
            data = new DoctorWorkingOverviewResponse
            {
                Schedule = schedule,
                AvailableWorkingHours = availableWorkingHours,
                Submissions = submissions,
            },
        });
    }

    public async Task<IActionResult> Create(
        CreateDoctorWorkSubmissionRequest request,
        CancellationToken cancellationToken)
    {
        var doctor = await GetCurrentDoctorAsync(cancellationToken);
        if (doctor is null)
            return Forbid();

        if (request.Type == DoctorWorkSubmissionType.Add)
            return await CreateAddSubmissions(doctor, request, cancellationToken);

        DoctorSchedule? assignment = null;
        if (request.Type is DoctorWorkSubmissionType.Change or DoctorWorkSubmissionType.Delete)
        {
            if (!request.DoctorScheduleUuid.HasValue)
                return BadRequest(new { message = "Vui lòng chọn giờ làm việc hiện tại." });
            assignment = await dbContext.DoctorSchedules.FirstOrDefaultAsync(
                item => item.Uuid == request.DoctorScheduleUuid.Value && item.DoctorUuid == doctor.Uuid,
                cancellationToken);
            if (assignment is null)
                return NotFound(new { message = "Không tìm thấy giờ làm việc cần thay đổi." });
        }

        if (request.Type == DoctorWorkSubmissionType.Change &&
            !request.RequestedWorkingHourUuid.HasValue)
            return BadRequest(new { message = "Vui lòng chọn khung giờ đề nghị." });
        if (request.Type == DoctorWorkSubmissionType.Change &&
            assignment!.WorkingHourUuid == request.RequestedWorkingHourUuid)
            return BadRequest(new { message = "Khung giờ mới phải khác khung giờ hiện tại." });

        TimeWorking? requestedWorking = null;
        if (request.Type == DoctorWorkSubmissionType.Change)
        {
            requestedWorking = await HospitalWorkingHours(doctor.HospitalUuid).FirstOrDefaultAsync(
                item => item.Uuid == request.RequestedWorkingHourUuid!.Value,
                cancellationToken);
            if (requestedWorking is null)
                return NotFound(new { message = "Khung giờ đề nghị không thuộc giờ làm việc đang áp dụng của bệnh viện." });
        }

        var hasPendingSubmission = await dbContext.DoctorWorkSubmissions.AnyAsync(
                item => item.DoctorScheduleUuid == assignment!.Uuid &&
                        item.Status == DoctorWorkSubmissionStatus.Pending,
                cancellationToken);
        if (hasPendingSubmission)
            return Conflict(new { message = "Khung giờ này đang có một đơn chờ duyệt." });

        if (requestedWorking is not null && await HasDoctorScheduleConflictAsync(
            doctor.Uuid,
            requestedWorking,
            assignment?.Uuid,
            cancellationToken))
            return Conflict(new { message = "Khung giờ đề nghị bị trùng với lịch làm việc khác của bạn." });

        var now = DateTime.UtcNow;
        var submission = new DoctorWorkSubmission
        {
            Uuid = Guid.NewGuid(),
            DoctorUuid = doctor.Uuid,
            DoctorScheduleUuid = assignment?.Uuid,
            PreviousWorkingHourUuid = assignment?.WorkingHourUuid,
            RequestedWorkingHourUuid = requestedWorking?.Uuid,
            Type = request.Type,
            Reason = request.Reason.Trim(),
            Status = DoctorWorkSubmissionStatus.Pending,
            CreatedAt = now,
            UpdatedAt = now,
        };
        dbContext.DoctorWorkSubmissions.Add(submission);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Created($"/api/doctor-work-submissions/{submission.Uuid}", new
        {
            message = "Đã gửi đơn thay đổi giờ làm việc.",
            data = await GetSubmissionQuery().FirstAsync(item => item.Uuid == submission.Uuid, cancellationToken),
        });
    }

    private async Task<IActionResult> CreateAddSubmissions(
        DoctorProfile doctor,
        CreateDoctorWorkSubmissionRequest request,
        CancellationToken cancellationToken)
    {
        var requestedUuids = request.RequestedWorkingHourUuids
            .Append(request.RequestedWorkingHourUuid ?? Guid.Empty)
            .Where(item => item != Guid.Empty)
            .Distinct()
            .ToArray();
        if (requestedUuids.Length == 0)
            return BadRequest(new { message = "Vui lòng chọn ít nhất một khung giờ đề nghị." });
        if (requestedUuids.Length > 14)
            return BadRequest(new { message = "Mỗi đơn chỉ được chọn tối đa 14 khung giờ." });

        var requestedWorkings = await HospitalWorkingHours(doctor.HospitalUuid)
            .Where(item => requestedUuids.Contains(item.Uuid))
            .ToListAsync(cancellationToken);
        if (requestedWorkings.Count != requestedUuids.Length)
            return BadRequest(new { message = "Có khung giờ không thuộc giờ làm việc đang áp dụng của bệnh viện." });
        var hasInternalOverlap = requestedWorkings.Any(left => requestedWorkings.Any(right =>
            left.Uuid != right.Uuid && left.DayOfWeek == right.DayOfWeek
            && left.StartTime < right.EndTime && right.StartTime < left.EndTime));
        if (hasInternalOverlap)
            return Conflict(new { message = "Các khung giờ được chọn đang bị trùng nhau." });

        var pendingUuids = await dbContext.DoctorWorkSubmissions.AsNoTracking()
            .Where(item => item.DoctorUuid == doctor.Uuid
                && item.RequestedWorkingHourUuid.HasValue
                && requestedUuids.Contains(item.RequestedWorkingHourUuid.Value)
                && item.Status == DoctorWorkSubmissionStatus.Pending)
            .Select(item => item.RequestedWorkingHourUuid!.Value)
            .ToArrayAsync(cancellationToken);
        if (pendingUuids.Length > 0)
            return Conflict(new { message = "Một hoặc nhiều khung giờ đã có đơn chờ duyệt." });

        foreach (var working in requestedWorkings)
        {
            if (await HasDoctorScheduleConflictAsync(doctor.Uuid, working, null, cancellationToken))
                return Conflict(new { message = $"Khung {working.StartTime.ToString("HH:mm")}–{working.EndTime.ToString("HH:mm")} bị trùng với thời khóa biểu hiện tại." });
        }

        var now = DateTime.UtcNow;
        var submissions = requestedWorkings.Select(working => new DoctorWorkSubmission
        {
            Uuid = Guid.NewGuid(),
            DoctorUuid = doctor.Uuid,
            RequestedWorkingHourUuid = working.Uuid,
            Type = DoctorWorkSubmissionType.Add,
            Reason = request.Reason.Trim(),
            Status = DoctorWorkSubmissionStatus.Pending,
            CreatedAt = now,
            UpdatedAt = now,
        }).ToList();
        dbContext.DoctorWorkSubmissions.AddRange(submissions);
        await dbContext.SaveChangesAsync(cancellationToken);

        var submissionUuids = submissions.Select(item => item.Uuid).ToArray();
        var data = (await GetSubmissionQuery()
            .Where(item => submissionUuids.Contains(item.Uuid))
            .ToListAsync(cancellationToken))
            .OrderBy(item => item.RequestedWorkingHour?.DayOfWeek)
            .ThenBy(item => item.RequestedWorkingHour?.StartTime)
            .ToList();
        return Created("/api/doctor-work-submissions", new
        {
            message = $"Đã gửi đề nghị thêm {submissions.Count} khung giờ làm việc.",
            data,
        });
    }

    public async Task<IActionResult> GetHospitalSubmissions(CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue)
            return Forbid();

        var submissions = await GetSubmissionQuery()
            .Where(item => dbContext.DoctorProfiles.Any(doctor =>
                doctor.Uuid == item.DoctorUuid && doctor.HospitalUuid == hospitalUuid.Value))
            .OrderBy(item => item.Status)
            .ThenByDescending(item => item.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(new { message = "Lấy danh sách đơn thay đổi giờ làm thành công.", data = submissions });
    }

    public async Task<IActionResult> Review(
        Guid uuid,
        ReviewDoctorWorkSubmissionRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Status is not (DoctorWorkSubmissionStatus.Approved or DoctorWorkSubmissionStatus.Rejected))
            return BadRequest(new { message = "Trạng thái duyệt không hợp lệ." });

        var hospitalUuid = User.GetHospitalUuid();
        var accountUuid = User.GetAccountUuid();
        if (!hospitalUuid.HasValue || !accountUuid.HasValue)
            return Forbid();

        var submission = await dbContext.DoctorWorkSubmissions.FirstOrDefaultAsync(
            item => item.Uuid == uuid,
            cancellationToken);
        if (submission is null)
            return NotFound(new { message = "Không tìm thấy đơn thay đổi giờ làm." });
        if (submission.Status != DoctorWorkSubmissionStatus.Pending)
            return Conflict(new { message = "Đơn này đã được xử lý trước đó." });

        var doctorBelongsToHospital = await dbContext.DoctorProfiles.AnyAsync(
            item => item.Uuid == submission.DoctorUuid && item.HospitalUuid == hospitalUuid.Value,
            cancellationToken);
        if (!doctorBelongsToHospital)
            return Forbid();

        DoctorSchedule? assignment = null;
        if (submission.Type != DoctorWorkSubmissionType.Add)
        {
            assignment = await dbContext.DoctorSchedules.FirstOrDefaultAsync(
                item => item.Uuid == submission.DoctorScheduleUuid &&
                        item.DoctorUuid == submission.DoctorUuid,
                cancellationToken);
            if (assignment is null)
                return Conflict(new { message = "Giờ làm việc gốc không còn tồn tại." });
            if (assignment.WorkingHourUuid != submission.PreviousWorkingHourUuid)
                return Conflict(new { message = "Lịch làm việc đã thay đổi sau khi đơn được gửi." });
        }

        if (request.Status == DoctorWorkSubmissionStatus.Approved)
        {
            if (submission.Type == DoctorWorkSubmissionType.Delete)
            {
                dbContext.DoctorSchedules.Remove(assignment!);
            }
            else
            {
                if (!submission.RequestedWorkingHourUuid.HasValue)
                    return Conflict(new { message = "Đơn thay đổi không có khung giờ đề nghị." });
                var requestedWorking = await HospitalWorkingHours(hospitalUuid).FirstOrDefaultAsync(
                    item => item.Uuid == submission.RequestedWorkingHourUuid.Value,
                    cancellationToken);
                if (requestedWorking is null)
                    return Conflict(new { message = "Khung giờ đề nghị không còn thuộc giờ làm việc của bệnh viện." });
                var roomUuid = request.RoomUuid ?? assignment?.RoomUuid;
                if (!roomUuid.HasValue)
                    return BadRequest(new { message = "Vui lòng chọn phòng làm việc cho ca này." });
                var roomExists = await dbContext.Rooms.AnyAsync(item =>
                    item.Uuid == roomUuid.Value && item.HospitalUuid == hospitalUuid.Value
                    && item.DeletedAt == null && item.Status != RoomStatus.Maintenance,
                    cancellationToken);
                if (!roomExists)
                    return BadRequest(new { message = "Phòng làm việc không khả dụng tại chi nhánh." });
                if (await HasDoctorScheduleConflictAsync(
                        submission.DoctorUuid,
                        requestedWorking,
                        assignment?.Uuid,
                        cancellationToken))
                    return Conflict(new { message = "Không thể duyệt vì khung giờ mới bị trùng lịch." });
                if (await HasRoomScheduleConflictAsync(roomUuid.Value, requestedWorking.Uuid, assignment?.Uuid, cancellationToken))
                    return Conflict(new { message = "Phòng đã được phân cho bác sĩ khác trong ca này." });

                if (submission.Type == DoctorWorkSubmissionType.Add)
                {
                    dbContext.DoctorSchedules.Add(new DoctorSchedule
                    {
                        Uuid = Guid.NewGuid(),
                        DoctorUuid = submission.DoctorUuid,
                        WorkingHourUuid = requestedWorking.Uuid,
                        RoomUuid = roomUuid.Value,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    });
                }
                else
                {
                    assignment!.WorkingHourUuid = requestedWorking.Uuid;
                    assignment.RoomUuid = roomUuid.Value;
                    assignment.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        var now = DateTime.UtcNow;
        submission.Status = request.Status;
        submission.ReviewNote = request.ReviewNote.Trim();
        submission.ReviewedByAccountUuid = accountUuid.Value;
        submission.ReviewedAt = now;
        submission.UpdatedAt = now;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            message = request.Status == DoctorWorkSubmissionStatus.Approved
                ? "Đã duyệt đơn và cập nhật lịch làm việc mới."
                : "Đã từ chối đơn thay đổi giờ làm.",
            data = await GetSubmissionQuery().FirstAsync(item => item.Uuid == submission.Uuid, cancellationToken),
        });
    }

    private Task<DoctorProfile?> GetCurrentDoctorAsync(CancellationToken cancellationToken)
    {
        var accountUuid = User.GetAccountUuid();
        return accountUuid.HasValue
            ? dbContext.DoctorProfiles.FirstOrDefaultAsync(
                item => item.AccountUuid == accountUuid.Value && item.DeletedAt == null,
                cancellationToken)
            : Task.FromResult<DoctorProfile?>(null);
    }

    private IQueryable<TimeWorking> ActiveWorkingHours() =>
        dbContext.TimeWorkings.AsNoTracking().Where(item =>
            item.DeletedAt == null && item.Status == BaseStatus.Active);

    private IQueryable<TimeWorking> HospitalWorkingHours(Guid? hospitalUuid)
    {
        if (!hospitalUuid.HasValue)
            return ActiveWorkingHours().Where(_ => false);

        return from working in ActiveWorkingHours()
               join assignment in dbContext.HospitalWorkings.AsNoTracking()
                   on working.Uuid equals assignment.WorkingUuid
               where assignment.HospitalUuid == hospitalUuid.Value
               select working;
    }

    private IQueryable<DoctorWorkSubmissionResponse> GetSubmissionQuery() =>
        from submission in dbContext.DoctorWorkSubmissions.AsNoTracking()
        join doctor in dbContext.DoctorProfiles.AsNoTracking()
            on submission.DoctorUuid equals doctor.Uuid
        join previousHour in dbContext.TimeWorkings.AsNoTracking()
            on submission.PreviousWorkingHourUuid equals (Guid?)previousHour.Uuid into previousHours
        from previous in previousHours.DefaultIfEmpty()
        join requestedHour in dbContext.TimeWorkings.AsNoTracking()
            on submission.RequestedWorkingHourUuid equals (Guid?)requestedHour.Uuid into requestedHours
        from requested in requestedHours.DefaultIfEmpty()
        select new DoctorWorkSubmissionResponse
        {
            Uuid = submission.Uuid,
            DoctorUuid = submission.DoctorUuid,
            DoctorName = doctor.Name,
            DoctorScheduleUuid = submission.DoctorScheduleUuid,
            Type = submission.Type,
            CurrentWorkingHour = previous == null ? null : new WorkingHourOptionResponse
                {
                    Uuid = previous.Uuid,
                    DayOfWeek = previous.DayOfWeek,
                    StartTime = previous.StartTime,
                    EndTime = previous.EndTime,
                },
            RequestedWorkingHour = requested == null ? null : new WorkingHourOptionResponse
                {
                    Uuid = requested.Uuid,
                    DayOfWeek = requested.DayOfWeek,
                    StartTime = requested.StartTime,
                    EndTime = requested.EndTime,
                },
            Reason = submission.Reason,
            Status = submission.Status,
            ReviewNote = submission.ReviewNote,
            ReviewedAt = submission.ReviewedAt,
            CreatedAt = submission.CreatedAt,
            UpdatedAt = submission.UpdatedAt,
        };

    private async Task<bool> HasDoctorScheduleConflictAsync(
        Guid doctorUuid,
        TimeWorking candidate,
        Guid? excludedAssignmentUuid,
        CancellationToken cancellationToken)
    {
        var assignedHours = await dbContext.DoctorSchedules
            .Where(item => item.DoctorUuid == doctorUuid &&
                           (!excludedAssignmentUuid.HasValue || item.Uuid != excludedAssignmentUuid.Value))
            .Join(
                ActiveWorkingHours(),
                assignment => assignment.WorkingHourUuid,
                working => working.Uuid,
                (_, working) => new { working.DayOfWeek, working.StartTime, working.EndTime })
            .ToListAsync(cancellationToken);

        return assignedHours.Any(item =>
            item.DayOfWeek == candidate.DayOfWeek &&
            item.StartTime < candidate.EndTime &&
            candidate.StartTime < item.EndTime);
    }

    private Task<bool> HasRoomScheduleConflictAsync(
        Guid roomUuid,
        Guid workingHourUuid,
        Guid? excludedScheduleUuid,
        CancellationToken cancellationToken) =>
        dbContext.DoctorSchedules.AnyAsync(item =>
            item.RoomUuid == roomUuid && item.WorkingHourUuid == workingHourUuid
            && (!excludedScheduleUuid.HasValue || item.Uuid != excludedScheduleUuid.Value),
            cancellationToken);

}
