using api.Contract.Hospital;
using api.Contract.TimeWorking;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller;

[ApiController]
[Route("api/hospital-workings")]
[Authorize]
public sealed class HospitalWorkingsController(DBContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetBranchWorkings(CancellationToken cancellationToken)
    {
        var hospitalUuid = await GetCurrentHospitalUuidAsync(cancellationToken);
        if (hospitalUuid is null)
            return Unauthorized(new { message = "Tài khoản chưa được gán chi nhánh." });

        var availableWorkings = await dbContext.TimeWorkings
            .AsNoTracking()
            .Where(item => item.DeletedAt == null && item.Status == BaseStatus.Active)
            .OrderBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime)
            .Select(item => new TimeWorkingResponse
            {
                Uuid = item.Uuid,
                DayOfWeek = item.DayOfWeek,
                StartTime = item.StartTime,
                EndTime = item.EndTime,
                Status = item.Status,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt,
                DeletedAt = item.DeletedAt,
            })
            .ToListAsync(cancellationToken);

        var assignedWorkings = await dbContext.HospitalWorkings
            .AsNoTracking()
            .Where(item => item.HospitalUuid == hospitalUuid.Value)
            .Join(
                dbContext.TimeWorkings.Where(item =>
                    item.DeletedAt == null &&
                    item.Status == BaseStatus.Active),
                hospitalWorking => hospitalWorking.WorkingUuid,
                timeWorking => timeWorking.Uuid,
                (hospitalWorking, timeWorking) => new HospitalWorkingResponse
                {
                    Uuid = hospitalWorking.Uuid,
                    WorkingUuid = timeWorking.Uuid,
                    DayOfWeek = timeWorking.DayOfWeek,
                    StartTime = timeWorking.StartTime,
                    EndTime = timeWorking.EndTime,
                    Status = timeWorking.Status,
                })
            .OrderBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime)
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            message = "Lấy giờ làm việc của chi nhánh thành công.",
            data = new { availableWorkings, assignedWorkings },
        });
    }

    [HttpPost]
    public async Task<IActionResult> AddBranchWorking(
        HospitalWorkingRequest request,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = await GetCurrentHospitalUuidAsync(cancellationToken);
        if (hospitalUuid is null)
            return Unauthorized(new { message = "Tài khoản chưa được gán chi nhánh." });
        if (request.WorkingUuid == Guid.Empty)
            return BadRequest(new { message = "Khung giờ làm việc không hợp lệ." });

        var working = await GetAvailableWorkingAsync(request.WorkingUuid, cancellationToken);
        if (working is null)
            return NotFound(new { message = "Không tìm thấy khung giờ đang hoạt động." });

        if (await HasScheduleConflictAsync(hospitalUuid.Value, working, null, cancellationToken))
            return Conflict(new { message = "Ngày và khung giờ này đã được cấu hình hoặc bị trùng với lịch hiện có." });

        var assignment = new HospitalWorking
        {
            Uuid = Guid.NewGuid(),
            HospitalUuid = hospitalUuid.Value,
            WorkingUuid = working.Uuid,
        };
        dbContext.HospitalWorkings.Add(assignment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Created(
            $"/api/hospital-workings/{assignment.Uuid}",
            new
            {
                message = "Thêm khung giờ thành công.",
                data = ToResponse(assignment, working),
            });
    }

    [HttpPut("{uuid:guid}")]
    public async Task<IActionResult> UpdateBranchWorking(
        Guid uuid,
        HospitalWorkingRequest request,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = await GetCurrentHospitalUuidAsync(cancellationToken);
        if (hospitalUuid is null)
            return Unauthorized(new { message = "Tài khoản chưa được gán chi nhánh." });
        if (request.WorkingUuid == Guid.Empty)
            return BadRequest(new { message = "Khung giờ làm việc không hợp lệ." });

        var assignment = await dbContext.HospitalWorkings.FirstOrDefaultAsync(
            item => item.Uuid == uuid && item.HospitalUuid == hospitalUuid.Value,
            cancellationToken);
        if (assignment is null)
            return NotFound(new { message = "Không tìm thấy khung giờ của chi nhánh." });

        var working = await GetAvailableWorkingAsync(request.WorkingUuid, cancellationToken);
        if (working is null)
            return NotFound(new { message = "Không tìm thấy khung giờ đang hoạt động." });

        if (await HasScheduleConflictAsync(hospitalUuid.Value, working, uuid, cancellationToken))
            return Conflict(new { message = "Ngày và khung giờ này đã được cấu hình hoặc bị trùng với lịch hiện có." });

        assignment.WorkingUuid = working.Uuid;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            message = "Cập nhật khung giờ thành công.",
            data = ToResponse(assignment, working),
        });
    }

    [HttpDelete("{uuid:guid}")]
    public async Task<IActionResult> DeleteBranchWorking(
        Guid uuid,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = await GetCurrentHospitalUuidAsync(cancellationToken);
        if (hospitalUuid is null)
            return Unauthorized(new { message = "Tài khoản chưa được gán chi nhánh." });

        var assignment = await dbContext.HospitalWorkings.FirstOrDefaultAsync(
            item => item.Uuid == uuid && item.HospitalUuid == hospitalUuid.Value,
            cancellationToken);
        if (assignment is null)
            return NotFound(new { message = "Không tìm thấy khung giờ của chi nhánh." });

        dbContext.HospitalWorkings.Remove(assignment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Xóa khung giờ thành công." });
    }

    private async Task<Guid?> GetCurrentHospitalUuidAsync(CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue)
            return null;

        var hospitalExists = await dbContext.Hospitals.AnyAsync(
            item => item.Uuid == hospitalUuid.Value && item.DeletedAt == null,
            cancellationToken);
        return hospitalExists ? hospitalUuid : null;
    }

    private Task<TimeWorking?> GetAvailableWorkingAsync(
        Guid workingUuid,
        CancellationToken cancellationToken) =>
        dbContext.TimeWorkings.FirstOrDefaultAsync(
            item => item.Uuid == workingUuid &&
                    item.DeletedAt == null &&
                    item.Status == BaseStatus.Active,
            cancellationToken);

    private async Task<bool> HasScheduleConflictAsync(
        Guid hospitalUuid,
        TimeWorking candidate,
        Guid? excludedAssignmentUuid,
        CancellationToken cancellationToken)
    {
        var assignedSlots = await dbContext.HospitalWorkings
            .Where(item => item.HospitalUuid == hospitalUuid &&
                           (!excludedAssignmentUuid.HasValue ||
                            item.Uuid != excludedAssignmentUuid.Value))
            .Join(
                dbContext.TimeWorkings.Where(item =>
                    item.DeletedAt == null &&
                    item.Status == BaseStatus.Active),
                hospitalWorking => hospitalWorking.WorkingUuid,
                timeWorking => timeWorking.Uuid,
                (hospitalWorking, timeWorking) => new
                {
                    timeWorking.DayOfWeek,
                    timeWorking.StartTime,
                    timeWorking.EndTime,
                })
            .ToListAsync(cancellationToken);

        return assignedSlots.Any(item =>
            item.DayOfWeek == candidate.DayOfWeek &&
            item.StartTime < candidate.EndTime &&
            candidate.StartTime < item.EndTime);
    }

    private static HospitalWorkingResponse ToResponse(
        HospitalWorking assignment,
        TimeWorking working) =>
        new()
        {
            Uuid = assignment.Uuid,
            WorkingUuid = working.Uuid,
            DayOfWeek = working.DayOfWeek,
            StartTime = working.StartTime,
            EndTime = working.EndTime,
            Status = working.Status,
        };
}
