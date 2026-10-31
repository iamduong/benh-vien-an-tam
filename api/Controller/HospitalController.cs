using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Contract.Hospital;
using api.Lib;
using api.Model;
using api.Model.Enum;

namespace api.Controller;

[ApiController]
[Route("api/hospitals")]
public sealed class HospitalController(DBContext dbContext) : ControllerBase
{
    [HttpGet("branch-profile")]
    [Authorize]
    public async Task<IActionResult> GetBranchProfile(
        CancellationToken cancellationToken = default)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue ||
            !await HasBranchAccess(hospitalUuid.Value, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var hospital = await dbContext.Hospitals
            .FirstOrDefaultAsync(
                item => item.Uuid == hospitalUuid.Value && item.DeletedAt == null,
                cancellationToken);
        if (hospital is null)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        return Ok(new
        {
            message = "Fetched successfully",
            data = HospitalResponse.FromModel(hospital)
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetHospitals(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] BaseStatus? status = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.Hospitals.Where(x => x.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Name.Contains(search) || x.Slug.Contains(search));
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new HospitalResponse
            {
                Uuid = x.Uuid,
                Image = x.Image,
                MapUrl = x.MapUrl,
                Slug = x.Slug,
                Name = x.Name,
                Address = x.Address,
                NumberOfRoom = x.NumberOfRoom,
                Description = x.Description,
                DetailService = x.DetailService,
                WorkingHour = x.WorkingHour,
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

    [HttpGet("{slugOrId}")]
    public async Task<IActionResult> GetHospital(string slugOrId, CancellationToken cancellationToken = default)
    {
        var hospitals = dbContext.Hospitals.Where(x => x.DeletedAt == null);
        var hospital = Guid.TryParse(slugOrId, out var uuid)
            ? await hospitals.FirstOrDefaultAsync(x => x.Uuid == uuid, cancellationToken)
            : await hospitals.FirstOrDefaultAsync(x => x.Slug == slugOrId, cancellationToken);

        if (hospital is null)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var response = new HospitalResponse
        {
            Uuid = hospital.Uuid,
            Image = hospital.Image,
            MapUrl = hospital.MapUrl,
            Slug = hospital.Slug,
            Name = hospital.Name,
            Address = hospital.Address,
            NumberOfRoom = hospital.NumberOfRoom,
            Description = hospital.Description,
            DetailService = hospital.DetailService,
            WorkingHour = hospital.WorkingHour,
            Status = hospital.Status,
            CreatedAt = hospital.CreatedAt,
            UpdatedAt = hospital.UpdatedAt
        };

        return Ok(new { message = "Fetched successfully", data = response });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateHospital(
        CreateHospitalRequest request,
        CancellationToken cancellationToken = default)
    {
        var hospital = new Hospital
        {
            Uuid = Guid.NewGuid(),
            Image = request.Image,
            MapUrl = request.MapUrl,
            Slug = request.Slug,
            Name = request.Name,
            Address = request.Address,
            NumberOfRoom = request.NumberOfRoom,
            Description = request.Description,
            DetailService = request.DetailService,
            WorkingHour = request.WorkingHour,
            Status = BaseStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Hospitals.Add(hospital);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new HospitalResponse
        {
            Uuid = hospital.Uuid,
            Image = hospital.Image,
            MapUrl = hospital.MapUrl,
            Slug = hospital.Slug,
            Name = hospital.Name,
            Address = hospital.Address,
            NumberOfRoom = hospital.NumberOfRoom,
            Description = hospital.Description,
            DetailService = hospital.DetailService,
            WorkingHour = hospital.WorkingHour,
            Status = hospital.Status,
            CreatedAt = hospital.CreatedAt,
            UpdatedAt = hospital.UpdatedAt
        };

        return StatusCode(StatusCodes.Status201Created,
            new { message = "Created successfully", data = response });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateHospital(
        Guid id,
        UpdateHospitalRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var hospital = await dbContext.Hospitals
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (hospital is null)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var slugInUse = await dbContext.Hospitals.AnyAsync(
            item => item.Uuid != id &&
                    item.Slug == request.Slug &&
                    item.DeletedAt == null,
            cancellationToken);
        if (slugInUse)
            return Conflict(new { message = "Hospital slug is already in use", error = "HOSPITAL_SLUG_ALREADY_EXISTS" });

        var activeRoomCount = await dbContext.Rooms.CountAsync(
            room => room.HospitalUuid == id && room.DeletedAt == null,
            cancellationToken);
        if (request.NumberOfRoom < activeRoomCount)
            return Conflict(new { message = "Room capacity cannot be lower than the number of active rooms", error = "ROOM_CAPACITY_BELOW_CURRENT_USAGE" });

        hospital.Image = request.Image;
        hospital.MapUrl = request.MapUrl;
        hospital.Slug = request.Slug;
        hospital.Name = request.Name;
        hospital.Address = request.Address;
        hospital.NumberOfRoom = request.NumberOfRoom;
        hospital.Description = request.Description;
        hospital.DetailService = request.DetailService;
        hospital.WorkingHour = request.WorkingHour;
        hospital.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new HospitalResponse
        {
            Uuid = hospital.Uuid,
            Image = hospital.Image,
            MapUrl = hospital.MapUrl,
            Slug = hospital.Slug,
            Name = hospital.Name,
            Address = hospital.Address,
            NumberOfRoom = hospital.NumberOfRoom,
            Description = hospital.Description,
            DetailService = hospital.DetailService,
            WorkingHour = hospital.WorkingHour,
            Status = hospital.Status,
            CreatedAt = hospital.CreatedAt,
            UpdatedAt = hospital.UpdatedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }

    [HttpPut("{id}/assignments")]
    [Authorize]
    public async Task<IActionResult> UpdateHospitalAssignments(
        Guid id,
        UpdateHospitalAssignmentsRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        if (request.DepartmentUuids is null || request.MedicalServiceUuids is null)
            return BadRequest(new { message = "Both assignment lists are required", error = "INVALID_HOSPITAL_ASSIGNMENT" });

        var departmentUuids = request.DepartmentUuids.Distinct().ToArray();
        var medicalServiceUuids = request.MedicalServiceUuids.Distinct().ToArray();
        var validDepartments = await dbContext.Departments.CountAsync(
            department => departmentUuids.Contains(department.Uuid) &&
                          department.Status == BaseStatus.Active &&
                          department.DeletedAt == null,
            cancellationToken);
        var validServices = await dbContext.MedicalServices.CountAsync(
            service => medicalServiceUuids.Contains(service.Uuid) &&
                       service.Status == BaseStatus.Active &&
                       service.DeletedAt == null,
            cancellationToken);

        if (validDepartments != departmentUuids.Length ||
            validServices != medicalServiceUuids.Length)
            return BadRequest(new { message = "Assignments must reference active catalog entries", error = "INVALID_HOSPITAL_ASSIGNMENT" });

        var existingDepartments = await dbContext.HospitalDepartments
            .Where(item => item.HospitalUuid == id)
            .ToListAsync(cancellationToken);
        var existingServices = await dbContext.HospitalMedicalServices
            .Where(item => item.HospitalUuid == id)
            .ToListAsync(cancellationToken);
        dbContext.HospitalDepartments.RemoveRange(existingDepartments);
        dbContext.HospitalMedicalServices.RemoveRange(existingServices);
        dbContext.HospitalDepartments.AddRange(departmentUuids.Select(departmentUuid =>
            new HospitalDepartment
            {
                Uuid = Guid.NewGuid(),
                HospitalUuid = id,
                DepartmentUuid = departmentUuid
            }));
        dbContext.HospitalMedicalServices.AddRange(medicalServiceUuids.Select(serviceUuid =>
            new HospitalMedicalService
            {
                Uuid = Guid.NewGuid(),
                HospitalUuid = id,
                MedicalServiceUuid = serviceUuid
            }));
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            message = "Assignments updated successfully",
            data = new
            {
                departmentUuids,
                medicalServiceUuids
            }
        });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteHospital(Guid id, CancellationToken cancellationToken = default)
    {
        var hospital = await dbContext.Hospitals
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (hospital is null)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        hospital.DeletedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpGet("{id}/departments")]
    [Authorize]
    public async Task<IActionResult> GetHospitalDepartments(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = (from hd in dbContext.HospitalDepartments
                     join d in dbContext.Departments on hd.DepartmentUuid equals d.Uuid
                     where hd.HospitalUuid == id &&
                           d.Status == BaseStatus.Active &&
                           d.DeletedAt == null
                     select d).Distinct();

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

    [HttpGet("{id}/medical-services")]
    [Authorize]
    public async Task<IActionResult> GetHospitalMedicalServices(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = (from hms in dbContext.HospitalMedicalServices
                     join ms in dbContext.MedicalServices on hms.MedicalServiceUuid equals ms.Uuid
                     where hms.HospitalUuid == id &&
                           ms.Status == BaseStatus.Active &&
                           ms.DeletedAt == null
                     select ms).Distinct();

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new api.Contract.MedicalService.MedicalServiceResponse
            {
                Uuid = x.Uuid,
                Image = x.Image,
                Slug = x.Slug,
                Name = x.Name,
                Price = x.Price,
                Description = x.Description,
                DetailService = x.DetailService,
                WorkingHour = x.WorkingHour,
                Status = x.Status.ToString(),
                IsInsured = x.IsInsured,
                InsuranceCap = x.InsuranceCap,
                IsFeatured = x.IsFeatured,
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

    [HttpGet("{id}/rooms")]
    [Authorize]
    public async Task<IActionResult> GetRooms(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] RoomStatus? status = null,
        [FromQuery] string? search = null,
        [FromQuery] bool includeDeleted = false,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var hospitalExists = await dbContext.Hospitals
            .AnyAsync(x => x.Uuid == id && x.DeletedAt == null, cancellationToken);
        if (!hospitalExists)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.Rooms.Where(x =>
            x.HospitalUuid == id && (includeDeleted || x.DeletedAt == null));

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        var normalizedSearch = search?.Trim().ToLower();
        if (!string.IsNullOrEmpty(normalizedSearch))
        {
            query = query.Where(x =>
                x.Name.ToLower().Contains(normalizedSearch) ||
                x.Uuid.ToString().Contains(normalizedSearch));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new RoomResponse
            {
                Uuid = x.Uuid,
                Name = x.Name,
                Status = x.Status.ToString(),
                HospitalUuid = x.HospitalUuid,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                DeletedAt = x.DeletedAt
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

    [HttpGet("{id}/rooms/{roomId}")]
    [Authorize]
    public async Task<IActionResult> GetRoom(Guid id, Guid roomId, CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var room = await dbContext.Rooms
            .Where(x => x.Uuid == roomId && x.HospitalUuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (room is null)
            return NotFound(new { message = "Room not found", error = "Resource does not exist" });

        var response = new RoomResponse
        {
            Uuid = room.Uuid,
            Name = room.Name,
            Status = room.Status.ToString(),
            HospitalUuid = room.HospitalUuid,
            CreatedAt = room.CreatedAt,
            UpdatedAt = room.UpdatedAt,
            DeletedAt = room.DeletedAt
        };

        return Ok(new { message = "Fetched successfully", data = response });
    }

    [HttpPost("{id}/rooms")]
    [Authorize]
    public async Task<IActionResult> CreateRoom(
        Guid id,
        CreateRoomRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var hospital = await dbContext.Hospitals
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);
        if (hospital is null)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var activeRoomCount = await dbContext.Rooms
            .CountAsync(x => x.HospitalUuid == id && x.DeletedAt == null, cancellationToken);
        if (activeRoomCount >= hospital.NumberOfRoom)
            return Conflict(new { message = "Hospital room capacity reached", error = "ROOM_CAPACITY_REACHED" });

        var room = new Room
        {
            Uuid = Guid.NewGuid(),
            Name = request.Name,
            Status = request.Status ?? RoomStatus.Available,
            HospitalUuid = id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Rooms.Add(room);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new RoomResponse
        {
            Uuid = room.Uuid,
            Name = room.Name,
            Status = room.Status.ToString(),
            HospitalUuid = room.HospitalUuid,
            CreatedAt = room.CreatedAt,
            UpdatedAt = room.UpdatedAt,
            DeletedAt = room.DeletedAt
        };

        return StatusCode(StatusCodes.Status201Created,
            new { message = "Created successfully", data = response });
    }

    [HttpPut("{id}/rooms/{roomId}")]
    [Authorize]
    public async Task<IActionResult> UpdateRoom(
        Guid id,
        Guid roomId,
        UpdateRoomRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var room = await dbContext.Rooms
            .Where(x => x.Uuid == roomId && x.HospitalUuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (room is null)
            return NotFound(new { message = "Room not found", error = "Resource does not exist" });

        if (request.Status == RoomStatus.Maintenance)
        {
            var hasActiveAppointments = await dbContext.Appointments.AnyAsync(
                x => x.RoomUuid == roomId &&
                     x.HospitalUuid == id &&
                     x.DeletedAt == null &&
                     (x.Status == AppointmentStatus.Pending ||
                      x.Status == AppointmentStatus.Approved ||
                      x.Status == AppointmentStatus.CheckedIn),
                cancellationToken);
            if (hasActiveAppointments)
                return Conflict(new
                {
                    message = "Room has active appointments",
                    error = "ROOM_HAS_ACTIVE_APPOINTMENTS"
                });
        }

        room.Name = request.Name ?? room.Name;
        if (request.Status.HasValue)
        {
            room.Status = request.Status.Value;
        }
        room.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new RoomResponse
        {
            Uuid = room.Uuid,
            Name = room.Name,
            Status = room.Status.ToString(),
            HospitalUuid = room.HospitalUuid,
            CreatedAt = room.CreatedAt,
            UpdatedAt = room.UpdatedAt,
            DeletedAt = room.DeletedAt
        };

        return Ok(new { message = "Updated successfully", data = response });
    }

    [HttpDelete("{id}/rooms/{roomId}")]
    [Authorize]
    public async Task<IActionResult> DeleteRoom(Guid id, Guid roomId, CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var room = await dbContext.Rooms
            .Where(x => x.Uuid == roomId && x.HospitalUuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);

        if (room is null)
            return NotFound(new { message = "Room not found", error = "Resource does not exist" });

        var hasActiveAppointments = await dbContext.Appointments.AnyAsync(
            x => x.RoomUuid == roomId &&
                 x.HospitalUuid == id &&
                 x.DeletedAt == null &&
                 (x.Status == AppointmentStatus.Pending ||
                  x.Status == AppointmentStatus.Approved ||
                  x.Status == AppointmentStatus.CheckedIn),
            cancellationToken);
        if (hasActiveAppointments)
            return Conflict(new
            {
                message = "Room has active appointments",
                error = "ROOM_HAS_ACTIVE_APPOINTMENTS"
            });

        room.DeletedAt = DateTime.UtcNow;
        room.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPost("{id}/rooms/{roomId}/restore")]
    [Authorize]
    public async Task<IActionResult> RestoreRoom(
        Guid id,
        Guid roomId,
        CancellationToken cancellationToken = default)
    {
        if (!await HasBranchAccess(id, cancellationToken))
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var room = await dbContext.Rooms
            .Where(x => x.Uuid == roomId && x.HospitalUuid == id && x.DeletedAt != null)
            .FirstOrDefaultAsync(cancellationToken);

        if (room is null)
            return NotFound(new { message = "Deleted room not found", error = "Resource does not exist" });

        var hospital = await dbContext.Hospitals
            .Where(x => x.Uuid == id && x.DeletedAt == null)
            .FirstOrDefaultAsync(cancellationToken);
        if (hospital is null)
            return NotFound(new { message = "Hospital not found", error = "Resource does not exist" });

        var activeRoomCount = await dbContext.Rooms
            .CountAsync(x => x.HospitalUuid == id && x.DeletedAt == null, cancellationToken);
        if (activeRoomCount >= hospital.NumberOfRoom)
            return Conflict(new { message = "Hospital room capacity reached", error = "ROOM_CAPACITY_REACHED" });

        room.DeletedAt = null;
        room.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new RoomResponse
        {
            Uuid = room.Uuid,
            Name = room.Name,
            Status = room.Status.ToString(),
            HospitalUuid = room.HospitalUuid,
            CreatedAt = room.CreatedAt,
            UpdatedAt = room.UpdatedAt,
            DeletedAt = room.DeletedAt
        };

        return Ok(new { message = "Room restored successfully", data = response });
    }

    private async Task<bool> HasBranchAccess(
        Guid hospitalUuid,
        CancellationToken cancellationToken)
    {
        var accountUuid = User.GetAccountUuid();
        return accountUuid.HasValue &&
               User.GetHospitalUuid() == hospitalUuid &&
               await dbContext.Hospitals.AnyAsync(
                   hospital => hospital.Uuid == hospitalUuid &&
                               hospital.DeletedAt == null &&
                               dbContext.Accounts.Any(account =>
                                   account.Uuid == accountUuid.Value &&
                                   account.HospitalUuid == hospitalUuid &&
                                   account.Status == BaseStatus.Active &&
                                   account.DeletedAt == null &&
                                   account.RoleUuid.HasValue &&
                                   dbContext.Roles.Any(role =>
                                       role.Uuid == account.RoleUuid.Value &&
                                       role.Status == BaseStatus.Active &&
                                       role.DeletedAt == null &&
                                       (role.Name.ToLower().Contains("admin") ||
                                        role.Name.ToLower().Contains("quản trị")))),
                   cancellationToken);
    }
}
