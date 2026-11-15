using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Contract.Doctor;
using api.Lib;
using api.Model;

namespace api.Service;

[NonController]
public sealed class DoctorService(DBContext dbContext) : ControllerBase
{
    public async Task<IActionResult> GetDoctors(
        int page = 1,
        int pageSize = 20,
        Guid? departmentId = null,
        Guid? hospitalId = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Min(pageSize, 100);

        var query = dbContext.DoctorProfiles
            .Where(x => x.DeletedAt == null &&
                (!x.AccountUuid.HasValue ||
                 dbContext.Accounts.Any(account =>
                     account.Uuid == x.AccountUuid.Value &&
                     account.DeletedAt == null &&
                     account.Status == api.Model.Enum.BaseStatus.Active)))
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Name.Contains(search) || x.Slug.Contains(search));
        }

        if (hospitalId.HasValue)
        {
            query = query.Where(x => x.HospitalUuid == hospitalId.Value);
        }

        if (departmentId.HasValue)
        {
            query = from d in query
                    join dd in dbContext.DoctorDepartments on d.Uuid equals dd.DoctorUuid
                    where dd.DepartmentUuid == departmentId.Value
                    select d;
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.Uuid)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new DoctorResponse
            {
                Uuid = x.Uuid,
                AccountUuid = x.AccountUuid,
                Avatar = x.Avatar,
                Slug = x.Slug,
                Name = x.Name,
                DepartmentDisplay = x.DepartmentDisplay,
                Introduction = x.Introduction,
                Expertise = x.Expertise,
                Specialty = x.Specialty,
                Workplace = x.Workplace,
                IsFeatured = x.IsFeatured,
                HospitalUuid = x.HospitalUuid,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            message = "Fetched successfully",
            data = items,
            pagination = new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        });
    }

    public async Task<IActionResult> GetDoctor(Guid id, CancellationToken cancellationToken = default)
    {
        var doctor = await dbContext.DoctorProfiles
            .Where(x => x.Uuid == id &&
                x.DeletedAt == null &&
                (!x.AccountUuid.HasValue ||
                 dbContext.Accounts.Any(account =>
                     account.Uuid == x.AccountUuid.Value &&
                     account.DeletedAt == null &&
                     account.Status == api.Model.Enum.BaseStatus.Active)))
            .FirstOrDefaultAsync(cancellationToken);

        if (doctor is null)
            return NotFound(new { message = "Doctor not found", error = "Resource does not exist" });

        var response = new DoctorResponse
        {
            Uuid = doctor.Uuid,
            AccountUuid = doctor.AccountUuid,
            Avatar = doctor.Avatar,
            Slug = doctor.Slug,
            Name = doctor.Name,
            DepartmentDisplay = doctor.DepartmentDisplay,
            Introduction = doctor.Introduction,
            Expertise = doctor.Expertise,
            Specialty = doctor.Specialty,
            Workplace = doctor.Workplace,
            IsFeatured = doctor.IsFeatured,
            HospitalUuid = doctor.HospitalUuid,
            CreatedAt = doctor.CreatedAt,
            UpdatedAt = doctor.UpdatedAt
        };

        return Ok(new { message = "Fetched successfully", data = response });
    }

    public async Task<IActionResult> CreateDoctor(
        CreateDoctorRequest request,
        CancellationToken cancellationToken = default)
    {
        var doctor = new DoctorProfile
        {
            Uuid = Guid.NewGuid(),
            AccountUuid = request.AccountUuid,
            Avatar = request.Avatar,
            Slug = request.Slug,
            Name = request.Name,
            DepartmentDisplay = request.DepartmentDisplay,
            Introduction = request.Introduction,
            Expertise = request.Expertise,
            Specialty = request.Specialty,
            Workplace = request.Workplace,
            IsFeatured = request.IsFeatured,
            HospitalUuid = request.HospitalUuid,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.DoctorProfiles.Add(doctor);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new DoctorResponse
        {
            Uuid = doctor.Uuid,
            AccountUuid = doctor.AccountUuid,
            Avatar = doctor.Avatar,
            Slug = doctor.Slug,
            Name = doctor.Name,
            DepartmentDisplay = doctor.DepartmentDisplay,
            Introduction = doctor.Introduction,
            Expertise = doctor.Expertise,
            Specialty = doctor.Specialty,
            Workplace = doctor.Workplace,
            IsFeatured = doctor.IsFeatured,
            HospitalUuid = doctor.HospitalUuid,
            CreatedAt = doctor.CreatedAt,
            UpdatedAt = doctor.UpdatedAt
        };

        return StatusCode(StatusCodes.Status201Created,
            new { message = "Created successfully", data = response });
    }

    public async Task<IActionResult> UpdateDoctor(
        Guid id,
        UpdateDoctorRequest request,
        CancellationToken cancellationToken = default)
    {
        var doctor = await dbContext.DoctorProfiles
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (doctor is null)
            return NotFound(new { message = "Doctor not found", error = "Resource does not exist" });

        doctor.AccountUuid = request.AccountUuid ?? doctor.AccountUuid;
        doctor.Avatar = request.Avatar ?? doctor.Avatar;
        doctor.Slug = request.Slug ?? doctor.Slug;
        doctor.Name = request.Name ?? doctor.Name;
        doctor.DepartmentDisplay = request.DepartmentDisplay ?? doctor.DepartmentDisplay;
        doctor.Introduction = request.Introduction ?? doctor.Introduction;
        doctor.Expertise = request.Expertise ?? doctor.Expertise;
        doctor.Specialty = request.Specialty ?? doctor.Specialty;
        doctor.Workplace = request.Workplace ?? doctor.Workplace;
        doctor.IsFeatured = request.IsFeatured;
        doctor.HospitalUuid = request.HospitalUuid ?? doctor.HospitalUuid;
        doctor.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new DoctorResponse
        {
            Uuid = doctor.Uuid,
            AccountUuid = doctor.AccountUuid,
            Avatar = doctor.Avatar,
            Slug = doctor.Slug,
            Name = doctor.Name,
            DepartmentDisplay = doctor.DepartmentDisplay,
            Introduction = doctor.Introduction,
            Expertise = doctor.Expertise,
            Specialty = doctor.Specialty,
            Workplace = doctor.Workplace,
            IsFeatured = doctor.IsFeatured,
            HospitalUuid = doctor.HospitalUuid,
            CreatedAt = doctor.CreatedAt,
            UpdatedAt = doctor.UpdatedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }

    public async Task<IActionResult> DeleteDoctor(Guid id, CancellationToken cancellationToken = default)
    {
        var doctor = await dbContext.DoctorProfiles
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (doctor is null)
            return NotFound(new { message = "Doctor not found", error = "Resource does not exist" });

        // Soft delete: set DeletedAt timestamp
        doctor.DeletedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    public async Task<IActionResult> GetDoctorDepartments(
        Guid id,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Min(pageSize, 100);

        var query = from dd in dbContext.DoctorDepartments
                    join d in dbContext.Departments on dd.DepartmentUuid equals d.Uuid
                    where dd.DoctorUuid == id
                    select d;

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new api.Contract.Department.DepartmentResponse
            {
                Uuid = x.Uuid,
                Icon = x.Icon,
                Slug = x.Slug,
                Name = x.Name,
                Description = x.Description,
                Status = x.Status,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            message = "Fetched successfully",
            data = items,
            pagination = new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        });
    }

    public async Task<IActionResult> AddDoctorDepartment(
        Guid id,
        AddDoctorDepartmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var doctorDepartment = new DoctorDepartment
        {
            Uuid = Guid.NewGuid(),
            DoctorUuid = id,
            DepartmentUuid = request.DepartmentUuid
        };

        dbContext.DoctorDepartments.Add(doctorDepartment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return StatusCode(StatusCodes.Status201Created,
            new
            {
                message = "Created successfully",
                data = new
                {
                    uuid = doctorDepartment.Uuid,
                    doctorUuid = doctorDepartment.DoctorUuid,
                    departmentUuid = doctorDepartment.DepartmentUuid
                }
            });
    }

    public async Task<IActionResult> RemoveDoctorDepartment(
        Guid id,
        Guid departmentId,
        CancellationToken cancellationToken = default)
    {
        var doctorDepartment = await dbContext.DoctorDepartments
            .Where(x => x.DoctorUuid == id && x.DepartmentUuid == departmentId)
            .FirstOrDefaultAsync(cancellationToken);

        if (doctorDepartment is null)
            return NotFound(new { message = "Doctor department not found", error = "Resource does not exist" });

        dbContext.DoctorDepartments.Remove(doctorDepartment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    public async Task<IActionResult> GetMySchedule(CancellationToken cancellationToken)
    {
        var accountUuid = User.GetAccountUuid();
        if (!accountUuid.HasValue) return Forbid();
        var doctorUuid = await dbContext.DoctorProfiles.AsNoTracking()
            .Where(item => item.AccountUuid == accountUuid.Value && item.DeletedAt == null)
            .Select(item => (Guid?)item.Uuid).FirstOrDefaultAsync(cancellationToken);
        if (!doctorUuid.HasValue) return Forbid();
        var data = await (from schedule in dbContext.DoctorSchedules.AsNoTracking()
                          join assignment in dbContext.DoctorWorkingHours.AsNoTracking()
                              on schedule.Uuid equals assignment.DoctorScheduleUuid
                          join working in dbContext.TimeWorkings.AsNoTracking() on assignment.WorkingHourUuid equals working.Uuid
                          where schedule.DoctorUuid == doctorUuid.Value && working.DeletedAt == null
                              && working.Status == api.Model.Enum.BaseStatus.Active
                          orderby working.DayOfWeek, working.StartTime
                          select new api.Contract.Doctor.DoctorWorkingHourResponse
                          {
                              DoctorScheduleUuid = schedule.Uuid,
                              Uuid = working.Uuid,
                              DayOfWeek = working.DayOfWeek,
                              StartTime = working.StartTime,
                              EndTime = working.EndTime,
                              RoomUuid = assignment.RoomUuid,
                              RoomName = dbContext.Rooms.Where(room => room.Uuid == assignment.RoomUuid)
                                  .Select(room => room.Name).FirstOrDefault(),
                          }).ToListAsync(cancellationToken);
        return Ok(new { message = "Lấy lịch làm việc của bác sĩ thành công.", data });
    }

    public async Task<IActionResult> GetDoctorAppointments(
        Guid id,
        int page = 1,
        int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Min(pageSize, 100);

        var query = dbContext.Appointments
            .Where(x => x.DoctorUuid == id && x.DeletedAt == null);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new api.Contract.Appointment.AppointmentResponse
            {
                Uuid = x.Uuid,
                PatientName = x.PatientName,
                Gender = x.Gender.ToString(),
                MedicalCode = x.MedicalCode,
                Note = x.Note,
                AppointmentDate = x.AppointmentDate,
                TimeSlot = x.TimeSlot,
                Status = x.Status.ToString(),
                PatientUuid = x.PatientUuid,
                HospitalUuid = x.HospitalUuid,
                DoctorUuid = x.DoctorUuid,
                RoomUuid = x.RoomUuid,
                DoctorNote = x.DoctorNote,
                TotalPrice = x.TotalPrice,
                IsPaid = x.IsPaid,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(new
        {
            message = "Fetched successfully",
            data = items,
            pagination = new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            }
        });
    }
}
