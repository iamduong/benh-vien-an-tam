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

        var schedule = await dbContext.DoctorWorkingHours
            .AsNoTracking()
            .Where(item => item.DoctorUuid == doctor.Uuid)
            .Join(
                ActiveWorkingHours(),
                assignment => assignment.WorkingHourUuid,
                working => working.Uuid,
                (assignment, working) => new DoctorWorkingHourResponse
                {
                    DoctorWorkingHourUuid = assignment.Uuid,
                    Uuid = working.Uuid,
                    DayOfWeek = working.DayOfWeek,
                    StartTime = working.StartTime,
                    EndTime = working.EndTime,
                })
            .OrderBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime)
            .ToListAsync(cancellationToken);

        var availableWorkingHours = await ActiveWorkingHours()
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

        DoctorWorkingHour? assignment = null;
        if (request.Type is DoctorWorkSubmissionType.Change or DoctorWorkSubmissionType.Delete)
        {
            if (!request.DoctorWorkingHourUuid.HasValue)
                return BadRequest(new { message = "Vui lòng chọn giờ làm việc hiện tại." });
            assignment = await dbContext.DoctorWorkingHours.FirstOrDefaultAsync(
                item => item.Uuid == request.DoctorWorkingHourUuid.Value && item.DoctorUuid == doctor.Uuid,
                cancellationToken);
            if (assignment is null)
                return NotFound(new { message = "Không tìm thấy giờ làm việc cần thay đổi." });
        }

        if (request.Type is DoctorWorkSubmissionType.Change or DoctorWorkSubmissionType.Add &&
            !request.RequestedWorkingHourUuid.HasValue)
            return BadRequest(new { message = "Vui lòng chọn khung giờ đề nghị." });
        if (request.Type == DoctorWorkSubmissionType.Change &&
            assignment!.WorkingHourUuid == request.RequestedWorkingHourUuid)
            return BadRequest(new { message = "Khung giờ mới phải khác khung giờ hiện tại." });

        TimeWorking? requestedWorking = null;
        if (request.Type is DoctorWorkSubmissionType.Change or DoctorWorkSubmissionType.Add)
        {
            requestedWorking = await ActiveWorkingHours().FirstOrDefaultAsync(
                item => item.Uuid == request.RequestedWorkingHourUuid!.Value,
                cancellationToken);
            if (requestedWorking is null)
                return NotFound(new { message = "Khung giờ đề nghị không tồn tại hoặc đã ngừng hoạt động." });
        }

        var hasPendingSubmission = request.Type == DoctorWorkSubmissionType.Add
            ? await dbContext.DoctorWorkSubmissions.AnyAsync(
                item => item.DoctorUuid == doctor.Uuid &&
                        item.RequestedWorkingHourUuid == request.RequestedWorkingHourUuid &&
                        item.Status == DoctorWorkSubmissionStatus.Pending,
                cancellationToken)
            : await dbContext.DoctorWorkSubmissions.AnyAsync(
                item => item.DoctorWorkingHourUuid == assignment!.Uuid &&
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
            DoctorWorkingHourUuid = assignment?.Uuid,
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

        DoctorWorkingHour? assignment = null;
        if (submission.Type != DoctorWorkSubmissionType.Add)
        {
            assignment = await dbContext.DoctorWorkingHours.FirstOrDefaultAsync(
                item => item.Uuid == submission.DoctorWorkingHourUuid &&
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
                dbContext.DoctorWorkingHours.Remove(assignment!);
            }
            else
            {
                if (!submission.RequestedWorkingHourUuid.HasValue)
                    return Conflict(new { message = "Đơn thay đổi không có khung giờ đề nghị." });
                var requestedWorking = await ActiveWorkingHours().FirstOrDefaultAsync(
                    item => item.Uuid == submission.RequestedWorkingHourUuid.Value,
                    cancellationToken);
                if (requestedWorking is null)
                    return Conflict(new { message = "Khung giờ đề nghị không còn hoạt động." });
                if (await HasDoctorScheduleConflictAsync(
                        submission.DoctorUuid,
                        requestedWorking,
                        assignment?.Uuid,
                        cancellationToken))
                    return Conflict(new { message = "Không thể duyệt vì khung giờ mới bị trùng lịch." });

                if (submission.Type == DoctorWorkSubmissionType.Add)
                {
                    dbContext.DoctorWorkingHours.Add(new DoctorWorkingHour
                    {
                        Uuid = Guid.NewGuid(),
                        DoctorUuid = submission.DoctorUuid,
                        WorkingHourUuid = requestedWorking.Uuid,
                    });
                }
                else
                {
                    assignment!.WorkingHourUuid = requestedWorking.Uuid;
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
            DoctorWorkingHourUuid = submission.DoctorWorkingHourUuid,
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
        var assignedHours = await dbContext.DoctorWorkingHours
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

}
