using api.Contract.Public;
using api.Lib;
using api.Model.Enum;
using api.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public class PublicService(DBContext context) : IPublicService
{
    public async Task<DepartmentResponse[]> GetDepartmentsAsync()
    {
        var departments = await context.Departments
        .AsNoTracking()
        .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null)
        .Select(x => new DepartmentResponse
        {   
            Uuid = x.Uuid,
            Icon = x.Icon,
             Slug = x.Slug,
             Name = x.Name,
             Description = x.Description
        }).ToListAsync();

        return departments.ToArray();
    }

    public async Task<HospitalResponse[]> GetHospitalsAsync()
    {
        var hospitals = await context.Hospitals
        .AsNoTracking()
        .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null)
        .Select(x => new HospitalResponse
        {
            Uuid = x.Uuid,
            Name = x.Name,
            Address = x.Address,
            Image = x.Image,
            MapUrl = x.MapUrl,
            WorkingHour = x.WorkingHour,
            Slug = x.Slug,
            NumberOfRoom = x.NumberOfRoom,
            Description = x.Description,
            DetailService = x.DetailService
        }).ToListAsync();

        return hospitals.ToArray();
    }

    public async Task<DoctorResponse[]> GetDoctorsAsync()
    {
        var doctors = await context.DoctorProfiles
        .AsNoTracking()
        .Where(x => x.DeletedAt == null)
        .Where(x => !x.AccountUuid.HasValue || context.Accounts.Any(account =>
            account.Uuid == x.AccountUuid.Value
            && account.Status == BaseStatus.Active
            && account.DeletedAt == null))
        .OrderByDescending(x => x.IsFeatured)
        .ThenBy(x => x.Name)
        .Select(x => new DoctorResponse
        {
            Uuid = x.Uuid,
            Name = x.Name,
            Avatar = x.Avatar,
            DepartmentDisplay = x.DepartmentDisplay,
            Specialty = x.Specialty,
            Workplace = x.Workplace,
            Introduction = x.Introduction,
            Expertise = x.Expertise,
            Price = x.Price,
            Slug = x.Slug,
            HospitalUuid = x.HospitalUuid
        }).Take(6).ToListAsync();

        return doctors.ToArray();
    }

    public async Task<MedicalServicePublicResponse[]> GetMedicalServicesAsync()
    {
        return await context.MedicalServices
            .AsNoTracking()
            .Where(x => x.Status == BaseStatus.Active
                && x.DeletedAt == null)
            .OrderByDescending(x => x.IsFeatured)
            .ThenBy(x => x.Name)
            .Select(x => new MedicalServicePublicResponse
            {
                Uuid = x.Uuid,
                Image = x.Image,
                Slug = x.Slug,
                Name = x.Name,
                Price = x.Price,
                Description = x.Description,
                DetailService = x.DetailService,
                WorkingHour = x.WorkingHour,
                IsInsured = x.IsInsured,
                InsuranceCap = x.InsuranceCap
            })
            .Take(6)
            .ToArrayAsync();
    }

    public async Task<PublicPagedResponse<HospitalResponse>> SearchHospitalsAsync(
        string? keyword,
        Guid? departmentUuid,
        int page,
        int pageSize)
    {
        (page, pageSize) = NormalizePagination(page, pageSize);
        var query = context.Hospitals
            .AsNoTracking()
            .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var term = keyword.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(term) ||
                x.Address.ToLower().Contains(term));
        }

        if (departmentUuid.HasValue)
        {
            query = query.Where(x => context.HospitalDepartments.Any(relation =>
                relation.HospitalUuid == x.Uuid &&
                relation.DepartmentUuid == departmentUuid.Value));
        }

        var totalItems = await query.CountAsync();
        var totalPages = GetTotalPages(totalItems, pageSize);
        page = Math.Min(page, totalPages);
        var items = await query
            .OrderBy(x => x.Name)
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
                WorkingHour = x.WorkingHour
            })
            .ToArrayAsync();

        return new PublicPagedResponse<HospitalResponse>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<PublicPagedResponse<DoctorResponse>> SearchDoctorsAsync(
        string? keyword,
        Guid? hospitalUuid,
        Guid? departmentUuid,
        int page,
        int pageSize)
    {
        (page, pageSize) = NormalizePagination(page, pageSize);
        var query = context.DoctorProfiles
            .AsNoTracking()
            .Where(x => x.DeletedAt == null)
            .Where(x => !x.AccountUuid.HasValue || context.Accounts.Any(account =>
                account.Uuid == x.AccountUuid.Value
                && account.Status == BaseStatus.Active
                && account.DeletedAt == null))
            .Where(x => x.HospitalUuid.HasValue && context.Hospitals.Any(hospital =>
                hospital.Uuid == x.HospitalUuid.Value
                && hospital.Status == BaseStatus.Active
                && hospital.DeletedAt == null));

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var term = keyword.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(term) ||
                x.Specialty.ToLower().Contains(term) ||
                x.Workplace.ToLower().Contains(term));
        }

        if (hospitalUuid.HasValue)
            query = query.Where(x => x.HospitalUuid == hospitalUuid.Value);

        if (departmentUuid.HasValue)
        {
            query = query.Where(x => context.DoctorDepartments.Any(relation =>
                relation.DoctorUuid == x.Uuid &&
                relation.DepartmentUuid == departmentUuid.Value));
        }

        var totalItems = await query.CountAsync();
        var totalPages = GetTotalPages(totalItems, pageSize);
        page = Math.Min(page, totalPages);
        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new DoctorResponse
            {
                Uuid = x.Uuid,
                Name = x.Name,
                Avatar = x.Avatar,
                DepartmentDisplay = x.DepartmentDisplay,
                Specialty = x.Specialty,
                Workplace = x.Workplace,
                Introduction = x.Introduction,
                Expertise = x.Expertise,
                Price = x.Price,
                Slug = x.Slug,
                HospitalUuid = x.HospitalUuid
            })
            .ToArrayAsync();

        return new PublicPagedResponse<DoctorResponse>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<PublicPagedResponse<MedicalServicePublicResponse>> SearchMedicalServicesAsync(
        string? keyword,
        Guid? hospitalUuid,
        int page,
        int pageSize)
    {
        (page, pageSize) = NormalizePagination(page, pageSize);
        var query = context.MedicalServices
            .AsNoTracking()
            .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var term = keyword.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(term) ||
                x.Description.ToLower().Contains(term));
        }

        if (hospitalUuid.HasValue)
        {
            query = query.Where(x => context.HospitalMedicalServices.Any(relation =>
                relation.MedicalServiceUuid == x.Uuid &&
                relation.HospitalUuid == hospitalUuid.Value));
        }

        var totalItems = await query.CountAsync();
        var totalPages = GetTotalPages(totalItems, pageSize);
        page = Math.Min(page, totalPages);
        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new MedicalServicePublicResponse
            {
                Uuid = x.Uuid,
                Image = x.Image,
                Slug = x.Slug,
                Name = x.Name,
                Price = x.Price,
                Description = x.Description,
                DetailService = x.DetailService,
                WorkingHour = x.WorkingHour,
                IsInsured = x.IsInsured,
                InsuranceCap = x.InsuranceCap
            })
            .ToArrayAsync();

        return new PublicPagedResponse<MedicalServicePublicResponse>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<HospitalDetailResponse?> GetHospitalAsync(string identifier)
    {
        var uuid = ParseIdentifier(identifier);
        var hospital = await context.Hospitals
            .AsNoTracking()
            .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null)
            .Where(x => x.Slug == identifier
                || x.Slug.EndsWith(identifier)
                || (uuid.HasValue && x.Uuid == uuid.Value))
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
                WorkingHour = x.WorkingHour
            })
            .FirstOrDefaultAsync();

        if (hospital is null) return null;

        var departments = await (
            from relation in context.HospitalDepartments.AsNoTracking()
            join department in context.Departments.AsNoTracking()
                on relation.DepartmentUuid equals department.Uuid
            where relation.HospitalUuid == hospital.Uuid
                && department.Status == BaseStatus.Active
                && department.DeletedAt == null
            orderby department.Name
            select new DepartmentResponse
            {
                Uuid = department.Uuid,
                Icon = department.Icon,
                Slug = department.Slug,
                Name = department.Name,
                Description = department.Description
            }).ToArrayAsync();

        var medicalServices = await (
            from relation in context.HospitalMedicalServices.AsNoTracking()
            join medicalService in context.MedicalServices.AsNoTracking()
                on relation.MedicalServiceUuid equals medicalService.Uuid
            where relation.HospitalUuid == hospital.Uuid
                && medicalService.Status == BaseStatus.Active
                && medicalService.DeletedAt == null
            orderby medicalService.Name
            select new MedicalServicePublicResponse
            {
                Uuid = medicalService.Uuid,
                Image = medicalService.Image,
                Slug = medicalService.Slug,
                Name = medicalService.Name,
                Price = medicalService.Price,
                Description = medicalService.Description,
                DetailService = medicalService.DetailService,
                WorkingHour = medicalService.WorkingHour,
                IsInsured = medicalService.IsInsured,
                InsuranceCap = medicalService.InsuranceCap
            }).ToArrayAsync();

        var reviews = await context.ReviewHospitals
            .AsNoTracking()
            .Where(x => x.HospitalUuid == hospital.Uuid && x.Status == BaseStatus.Active)
            .OrderByDescending(x => x.CreatedAt)
            .Take(20)
            .Select(x => new PublicReviewResponse
            {
                Uuid = x.Uuid,
                Content = x.Content,
                NumberOfStar = x.NumberOfStar,
                CreatedAt = x.CreatedAt
            })
            .ToArrayAsync();

        return new HospitalDetailResponse
        {
            Hospital = hospital,
            Departments = departments,
            MedicalServices = medicalServices,
            Reviews = reviews
        };
    }

    public async Task<DoctorDetailResponse?> GetDoctorAsync(string identifier)
    {
        var uuid = ParseIdentifier(identifier);
        var doctor = await context.DoctorProfiles
            .AsNoTracking()
            .Where(x => x.DeletedAt == null)
            .Where(x => x.Slug == identifier
                || x.Slug.EndsWith(identifier)
                || (uuid.HasValue && x.Uuid == uuid.Value))
            .Select(x => new DoctorResponse
            {
                Uuid = x.Uuid,
                Name = x.Name,
                Avatar = x.Avatar,
                DepartmentDisplay = x.DepartmentDisplay,
                Specialty = x.Specialty,
                Workplace = x.Workplace,
                Introduction = x.Introduction,
                Expertise = x.Expertise,
                Price = x.Price,
                Slug = x.Slug,
                HospitalUuid = x.HospitalUuid
            })
            .FirstOrDefaultAsync();

        if (doctor is null || doctor.HospitalUuid is null) return null;

        var isActiveAccount = await (
            from profile in context.DoctorProfiles.AsNoTracking()
            join account in context.Accounts.AsNoTracking()
                on profile.AccountUuid equals account.Uuid
            where profile.Uuid == doctor.Uuid && account.Status == BaseStatus.Active
            select account.Uuid).AnyAsync();
        if (!isActiveAccount) return null;

        var hospital = await context.Hospitals
            .AsNoTracking()
            .Where(x => x.Uuid == doctor.HospitalUuid
                && x.Status == BaseStatus.Active
                && x.DeletedAt == null)
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
                WorkingHour = x.WorkingHour
            })
            .FirstOrDefaultAsync();
        if (hospital is null) return null;

        var departments = await (
            from relation in context.DoctorDepartments.AsNoTracking()
            join department in context.Departments.AsNoTracking()
                on relation.DepartmentUuid equals department.Uuid
            where relation.DoctorUuid == doctor.Uuid
                && department.Status == BaseStatus.Active
                && department.DeletedAt == null
            orderby department.Name
            select new DepartmentResponse
            {
                Uuid = department.Uuid,
                Icon = department.Icon,
                Slug = department.Slug,
                Name = department.Name,
                Description = department.Description
            }).ToArrayAsync();

        var reviews = await context.ReviewDoctors
            .AsNoTracking()
            .Where(x => x.DoctorUuid == doctor.Uuid && x.Status == BaseStatus.Active)
            .OrderByDescending(x => x.CreatedAt)
            .Take(20)
            .Select(x => new PublicReviewResponse
            {
                Uuid = x.Uuid,
                Content = x.Content,
                NumberOfStar = x.NumberOfStar,
                CreatedAt = x.CreatedAt
            })
            .ToArrayAsync();

        return new DoctorDetailResponse
        {
            Doctor = doctor,
            Departments = departments,
            Hospital = hospital,
            Reviews = reviews
        };
    }

    public async Task<DepartmentDetailResponse?> GetDepartmentAsync(string identifier)
    {
        var uuid = ParseIdentifier(identifier);
        var department = await context.Departments
            .AsNoTracking()
            .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null)
            .Where(x => x.Slug == identifier || (uuid.HasValue && x.Uuid == uuid.Value))
            .Select(x => new DepartmentResponse
            {
                Uuid = x.Uuid,
                Icon = x.Icon,
                Slug = x.Slug,
                Name = x.Name,
                Description = x.Description
            })
            .FirstOrDefaultAsync();
        if (department is null) return null;

        var hospitals = await (
            from relation in context.HospitalDepartments.AsNoTracking()
            join hospital in context.Hospitals.AsNoTracking()
                on relation.HospitalUuid equals hospital.Uuid
            where relation.DepartmentUuid == department.Uuid
                && hospital.Status == BaseStatus.Active
                && hospital.DeletedAt == null
            orderby hospital.Name
            select new HospitalResponse
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
                WorkingHour = hospital.WorkingHour
            }).ToArrayAsync();

        var doctors = await (
            from relation in context.DoctorDepartments.AsNoTracking()
            join doctor in context.DoctorProfiles.AsNoTracking()
                on relation.DoctorUuid equals doctor.Uuid
            join account in context.Accounts.AsNoTracking()
                on doctor.AccountUuid equals account.Uuid
            join hospital in context.Hospitals.AsNoTracking()
                on doctor.HospitalUuid equals hospital.Uuid
            where relation.DepartmentUuid == department.Uuid
                && doctor.DeletedAt == null
                && account.Status == BaseStatus.Active
                && hospital.Status == BaseStatus.Active
                && hospital.DeletedAt == null
            orderby doctor.Name
            select new DoctorResponse
            {
                Uuid = doctor.Uuid,
                Name = doctor.Name,
                Avatar = doctor.Avatar,
                DepartmentDisplay = doctor.DepartmentDisplay,
                Specialty = doctor.Specialty,
                Workplace = doctor.Workplace,
                Introduction = doctor.Introduction,
                Expertise = doctor.Expertise,
                Price = doctor.Price,
                Slug = doctor.Slug,
                HospitalUuid = doctor.HospitalUuid
            }).ToArrayAsync();

        return new DepartmentDetailResponse
        {
            Department = department,
            Hospitals = hospitals,
            Doctors = doctors
        };
    }

    public async Task<MedicalServiceDetailResponse?> GetMedicalServiceAsync(string identifier)
    {
        var uuid = ParseIdentifier(identifier);
        var medicalService = await context.MedicalServices
            .AsNoTracking()
            .Where(x => x.Status == BaseStatus.Active && x.DeletedAt == null)
            .Where(x => x.Slug == identifier
                || x.Slug.EndsWith(identifier)
                || (uuid.HasValue && x.Uuid == uuid.Value))
            .Select(x => new MedicalServicePublicResponse
            {
                Uuid = x.Uuid,
                Image = x.Image,
                Slug = x.Slug,
                Name = x.Name,
                Price = x.Price,
                Description = x.Description,
                DetailService = x.DetailService,
                WorkingHour = x.WorkingHour,
                IsInsured = x.IsInsured,
                InsuranceCap = x.InsuranceCap
            })
            .FirstOrDefaultAsync();
        if (medicalService is null) return null;

        var hospitals = await (
            from relation in context.HospitalMedicalServices.AsNoTracking()
            join hospital in context.Hospitals.AsNoTracking()
                on relation.HospitalUuid equals hospital.Uuid
            where relation.MedicalServiceUuid == medicalService.Uuid
                && hospital.Status == BaseStatus.Active
                && hospital.DeletedAt == null
            orderby hospital.Name
            select new HospitalResponse
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
                WorkingHour = hospital.WorkingHour
            }).ToArrayAsync();

        var reviews = await context.ReviewMedicalServices
            .AsNoTracking()
            .Where(x => x.MedicalServiceUuid == medicalService.Uuid
                && x.Status == BaseStatus.Active)
            .OrderByDescending(x => x.CreatedAt)
            .Take(20)
            .Select(x => new PublicReviewResponse
            {
                Uuid = x.Uuid,
                Content = x.Content,
                NumberOfStar = x.NumberOfStar,
                CreatedAt = x.CreatedAt
            })
            .ToArrayAsync();

        return new MedicalServiceDetailResponse
        {
            MedicalService = medicalService,
            Hospitals = hospitals,
            Reviews = reviews
        };
    }

    private static Guid? ParseIdentifier(string identifier) =>
        Guid.TryParse(identifier, out var uuid) ? uuid : null;

    private static (int Page, int PageSize) NormalizePagination(int page, int pageSize) =>
        (Math.Max(page, 1), Math.Clamp(pageSize, 1, 24));

    private static int GetTotalPages(int totalItems, int pageSize) =>
        Math.Max(1, (int)Math.Ceiling((double)totalItems / pageSize));
}
