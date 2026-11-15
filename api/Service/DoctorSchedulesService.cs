using api.Contract.Doctor;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public sealed class DoctorSchedulesService(DBContext dbContext)
{
    public async Task<IReadOnlyList<DoctorScheduleResponse>> GetAsync(
        Guid hospitalUuid,
        Guid? doctorUuid,
        CancellationToken cancellationToken)
    {
        var query = from schedule in dbContext.DoctorSchedules.AsNoTracking()
                    join assignment in dbContext.DoctorWorkingHours.AsNoTracking()
                        on schedule.Uuid equals assignment.DoctorScheduleUuid
                    join doctor in dbContext.DoctorProfiles.AsNoTracking() on schedule.DoctorUuid equals doctor.Uuid
                    join working in dbContext.TimeWorkings.AsNoTracking() on assignment.WorkingHourUuid equals working.Uuid
                    where doctor.HospitalUuid == hospitalUuid && doctor.DeletedAt == null
                        && working.DeletedAt == null && working.Status == BaseStatus.Active
                    select new DoctorScheduleResponse
                    {
                        DoctorScheduleUuid = schedule.Uuid,
                        DoctorUuid = doctor.Uuid,
                        DoctorName = doctor.Name,
                        Uuid = working.Uuid,
                        DayOfWeek = working.DayOfWeek,
                        StartTime = working.StartTime,
                        EndTime = working.EndTime,
                        RoomUuid = assignment.RoomUuid,
                        RoomName = dbContext.Rooms.Where(room => room.Uuid == assignment.RoomUuid)
                            .Select(room => room.Name).FirstOrDefault(),
                    };
        if (doctorUuid.HasValue) query = query.Where(item => item.DoctorUuid == doctorUuid.Value);
        return await query.OrderBy(item => item.DoctorName).ThenBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime).ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<DoctorScheduleResponse>? Data, string? Error, int StatusCode)> ReplaceAsync(
        Guid hospitalUuid,
        CreateDoctorScheduleRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Selections.Count == 0)
            return (null, "Vui lòng chọn ít nhất một ca làm việc.", 400);

        var doctor = await dbContext.DoctorProfiles.AsNoTracking().FirstOrDefaultAsync(item =>
            item.Uuid == request.DoctorUuid && item.HospitalUuid == hospitalUuid && item.DeletedAt == null,
            cancellationToken);
        if (doctor is null) return (null, "Bác sĩ không thuộc chi nhánh.", 404);

        var selections = request.Selections.DistinctBy(item => item.WorkingHourUuid).ToArray();
        if (selections.Length != request.Selections.Count)
            return (null, "Một ca làm việc không thể được chọn nhiều lần.", 400);

        var workingUuids = selections.Select(item => item.WorkingHourUuid).ToArray();
        var roomUuids = selections.Select(item => item.RoomUuid).Distinct().ToArray();
        var workings = await (from assignment in dbContext.HospitalWorkings.AsNoTracking()
                              join working in dbContext.TimeWorkings.AsNoTracking() on assignment.WorkingUuid equals working.Uuid
                              where assignment.HospitalUuid == hospitalUuid && assignment.WorkingUuid.HasValue
                                  && workingUuids.Contains(working.Uuid) && working.DeletedAt == null
                                  && working.Status == BaseStatus.Active
                              select working).Distinct().ToListAsync(cancellationToken);
        if (workings.Count != workingUuids.Length)
            return (null, "Có ca không thuộc giờ làm việc đang áp dụng của bệnh viện.", 400);
        if (workings.Any(candidate => workings.Any(other => candidate.Uuid != other.Uuid
                && candidate.DayOfWeek == other.DayOfWeek && candidate.StartTime < other.EndTime
                && other.StartTime < candidate.EndTime)))
            return (null, "Các ca được chọn đang bị trùng nhau.", 400);

        var rooms = await dbContext.Rooms.AsNoTracking().Where(item => roomUuids.Contains(item.Uuid)
            && item.HospitalUuid == hospitalUuid && item.DeletedAt == null && item.Status != RoomStatus.Maintenance)
            .ToListAsync(cancellationToken);
        if (rooms.Count != roomUuids.Length) return (null, "Có phòng làm việc không khả dụng.", 400);

        foreach (var selection in selections)
        {
            var roomConflict = await (from assignment in dbContext.DoctorWorkingHours.AsNoTracking()
                                      join otherSchedule in dbContext.DoctorSchedules.AsNoTracking()
                                          on assignment.DoctorScheduleUuid equals otherSchedule.Uuid
                                      where otherSchedule.DoctorUuid != doctor.Uuid
                                          && assignment.RoomUuid == selection.RoomUuid
                                          && assignment.WorkingHourUuid == selection.WorkingHourUuid
                                      select assignment).AnyAsync(cancellationToken);
            if (roomConflict) return (null, "Phòng đã được phân cho bác sĩ khác trong cùng ca.", 409);
        }

        var now = DateTime.UtcNow;
        var schedule = await dbContext.DoctorSchedules.FirstOrDefaultAsync(
            item => item.DoctorUuid == doctor.Uuid, cancellationToken);
        if (schedule is null)
        {
            schedule = new DoctorSchedule
            {
                Uuid = Guid.NewGuid(),
                DoctorUuid = doctor.Uuid,
                CreatedAt = now,
                UpdatedAt = now,
            };
            dbContext.DoctorSchedules.Add(schedule);
        }
        else
        {
            schedule.UpdatedAt = now;
            var existing = await dbContext.DoctorWorkingHours
                .Where(item => item.DoctorScheduleUuid == schedule.Uuid)
                .ToListAsync(cancellationToken);
            dbContext.DoctorWorkingHours.RemoveRange(existing);
        }
        dbContext.DoctorWorkingHours.AddRange(selections.Select(item => new DoctorWorkingHour
        {
            Uuid = Guid.NewGuid(),
            DoctorScheduleUuid = schedule.Uuid,
            WorkingHourUuid = item.WorkingHourUuid,
            RoomUuid = item.RoomUuid,
        }));
        await dbContext.SaveChangesAsync(cancellationToken);
        return (await GetAsync(hospitalUuid, doctor.Uuid, cancellationToken), null, 200);
    }
}
