using api.Lib;
using api.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public sealed class PatientPrescriptionService(DBContext dbContext)
{
    public async Task<(bool HasProfile, bool InvalidFilter, object? Data)> GetListAsync(
        Guid accountUuid,
        PrescriptionStatus? status,
        DateOnly? from,
        DateOnly? to,
        string? q,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        if (page < 1 || pageSize < 1 || pageSize > 20 || (from.HasValue && to.HasValue && from > to))
        {
            return (true, true, null);
        }

        var patientUuid = await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => item.AccountUuid == accountUuid)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);

        if (!patientUuid.HasValue)
        {
            return (false, false, null);
        }

        var query = dbContext.Prescriptions.AsNoTracking()
            .Where(item => item.DeletedAt == null && item.PatientProfileUuid == patientUuid.Value);

        if (status.HasValue)
        {
            query = query.Where(item => item.Status == status.Value);
        }

        if (from.HasValue)
        {
            var fromUtc = new DateTimeOffset(from.Value.ToDateTime(TimeOnly.MinValue), TimeSpan.FromHours(7)).UtcDateTime;
            query = query.Where(item => item.CreatedAt >= fromUtc);
        }

        if (to.HasValue)
        {
            var toUtc = new DateTimeOffset(to.Value.AddDays(1).ToDateTime(TimeOnly.MinValue), TimeSpan.FromHours(7)).UtcDateTime;
            query = query.Where(item => item.CreatedAt < toUtc);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim().ToLower();
            var matchingDoctorUuids = dbContext.DoctorProfiles.AsNoTracking()
                .Where(doc => doc.Name.ToLower().Contains(keyword))
                .Select(doc => doc.Uuid);
            var matchingHospitalUuids = dbContext.Hospitals.AsNoTracking()
                .Where(hosp => hosp.Name.ToLower().Contains(keyword))
                .Select(hosp => hosp.Uuid);
            var matchingPrescriptionUuidsByMedicine =
                from pd in dbContext.PrescriptionDetails.AsNoTracking()
                join med in dbContext.Medicines.AsNoTracking() on pd.MedicineUuid equals med.Uuid
                where pd.PrescriptionUuid.HasValue && med.Name.ToLower().Contains(keyword)
                select pd.PrescriptionUuid!.Value;

            query = query.Where(item =>
                item.Note.ToLower().Contains(keyword) ||
                item.Uuid.ToString().ToLower().Contains(keyword) ||
                (item.DoctorProfileUuid.HasValue && matchingDoctorUuids.Contains(item.DoctorProfileUuid.Value)) ||
                (item.HospitalUuid.HasValue && matchingHospitalUuids.Contains(item.HospitalUuid.Value)) ||
                matchingPrescriptionUuidsByMedicine.Contains(item.Uuid));
        }

        var totalItems = await query.CountAsync(cancellationToken);
        var totalPages = Math.Max(1, (int)Math.Ceiling((double)totalItems / pageSize));
        var safePage = Math.Min(page, totalPages);

        var prescriptions = await query
            .OrderByDescending(item => item.CreatedAt)
            .Skip((safePage - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var prescriptionUuids = prescriptions.Select(item => item.Uuid).ToArray();
        var hospitalUuids = prescriptions.Where(item => item.HospitalUuid.HasValue).Select(item => item.HospitalUuid!.Value).Distinct().ToArray();
        var doctorUuids = prescriptions.Where(item => item.DoctorProfileUuid.HasValue).Select(item => item.DoctorProfileUuid!.Value).Distinct().ToArray();
        var appointmentUuids = prescriptions.Where(item => item.AppointmentUuid.HasValue).Select(item => item.AppointmentUuid!.Value).Distinct().ToArray();

        var hospitals = await dbContext.Hospitals.AsNoTracking()
            .Where(item => hospitalUuids.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var doctors = await dbContext.DoctorProfiles.AsNoTracking()
            .Where(item => doctorUuids.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, cancellationToken);
        var validAppointments = await dbContext.Appointments.AsNoTracking()
            .Where(item => appointmentUuids.Contains(item.Uuid) && item.DeletedAt == null && item.PatientUuid == patientUuid.Value)
            .Select(item => item.Uuid)
            .ToHashSetAsync(cancellationToken);
        var details = await dbContext.PrescriptionDetails.AsNoTracking()
            .Where(item => item.PrescriptionUuid.HasValue && prescriptionUuids.Contains(item.PrescriptionUuid.Value))
            .ToListAsync(cancellationToken);

        var items = prescriptions.Select(item =>
        {
            hospitals.TryGetValue(item.HospitalUuid ?? Guid.Empty, out var hospital);
            doctors.TryGetValue(item.DoctorProfileUuid ?? Guid.Empty, out var doctor);
            var itemDetails = details.Where(detail => detail.PrescriptionUuid == item.Uuid).ToList();

            return new
            {
                prescription = new
                {
                    item.Uuid,
                    item.PatientProfileUuid,
                    item.DoctorProfileUuid,
                    item.HospitalUuid,
                    item.Status,
                    item.Note,
                    item.AppointmentUuid,
                    item.CreatedAt,
                    item.UpdatedAt,
                    deletedAt = item.DeletedAt ?? DateTime.UnixEpoch
                },
                hospital = new
                {
                    uuid = hospital?.Uuid ?? item.HospitalUuid ?? Guid.Empty,
                    name = hospital?.Name ?? "Cơ sở y tế",
                    slug = hospital?.Slug ?? string.Empty
                },
                doctor = new
                {
                    uuid = doctor?.Uuid ?? item.DoctorProfileUuid ?? Guid.Empty,
                    name = doctor?.Name ?? "Bác sĩ",
                    slug = doctor?.Slug ?? string.Empty
                },
                appointment = item.AppointmentUuid.HasValue && validAppointments.Contains(item.AppointmentUuid.Value)
                    ? new { uuid = item.AppointmentUuid.Value, type = "hospital" }
                    : null,
                totalAmount = itemDetails.Count > 0
                    ? itemDetails.Sum(detail => (long)detail.Quantity * detail.Price)
                    : (long?)null,
                numberOfItems = itemDetails.Count
            };
        }).ToList();

        return (true, false, new
        {
            Items = items,
            Page = safePage,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        });
    }

    public async Task<(bool HasProfile, object? Data)> GetByUuidAsync(
        Guid accountUuid,
        Guid uuid,
        CancellationToken cancellationToken)
    {
        var patientUuid = await dbContext.PatientProfiles.AsNoTracking()
            .Where(item => item.AccountUuid == accountUuid)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);

        if (!patientUuid.HasValue)
        {
            return (false, null);
        }

        var prescription = await dbContext.Prescriptions.AsNoTracking()
            .FirstOrDefaultAsync(item =>
                item.Uuid == uuid &&
                item.PatientProfileUuid == patientUuid.Value &&
                item.DeletedAt == null, cancellationToken);

        if (prescription is null)
        {
            return (true, null);
        }

        var hospital = prescription.HospitalUuid.HasValue
            ? await dbContext.Hospitals.AsNoTracking().FirstOrDefaultAsync(item => item.Uuid == prescription.HospitalUuid.Value, cancellationToken)
            : null;
        var doctor = prescription.DoctorProfileUuid.HasValue
            ? await dbContext.DoctorProfiles.AsNoTracking().FirstOrDefaultAsync(item => item.Uuid == prescription.DoctorProfileUuid.Value, cancellationToken)
            : null;
        var hasLinkedAppointment = prescription.AppointmentUuid.HasValue &&
            await dbContext.Appointments.AsNoTracking().AnyAsync(item =>
                item.Uuid == prescription.AppointmentUuid.Value &&
                item.PatientUuid == patientUuid.Value &&
                item.DeletedAt == null, cancellationToken);

        var rawDetails = await dbContext.PrescriptionDetails.AsNoTracking()
            .Where(item => item.PrescriptionUuid == prescription.Uuid)
            .ToListAsync(cancellationToken);
        var medicineUuids = rawDetails
            .Where(item => item.MedicineUuid.HasValue)
            .Select(item => item.MedicineUuid!.Value)
            .Distinct()
            .ToArray();
        var medicines = await dbContext.Medicines.AsNoTracking()
            .Where(item => medicineUuids.Contains(item.Uuid))
            .ToDictionaryAsync(item => item.Uuid, cancellationToken);

        var detailViews = rawDetails.Select(detail =>
        {
            medicines.TryGetValue(detail.MedicineUuid ?? Guid.Empty, out var medicine);
            return new
            {
                detail = new
                {
                    detail.Uuid,
                    detail.PrescriptionUuid,
                    detail.MedicineUuid,
                    detail.Quantity,
                    detail.QuantityPerDose,
                    detail.DosesPerDay,
                    detail.Duration,
                    detail.Price,
                    detail.IsExternal,
                    detail.Note
                },
                medicine = medicine is not null
                    ? new
                    {
                        medicine.Uuid,
                        medicine.Image,
                        medicine.Name,
                        medicine.Description,
                        medicine.Price,
                        medicine.Unit,
                        medicine.Status,
                        medicine.IsInsured,
                        medicine.InsuranceCap,
                        medicine.CreatedAt,
                        medicine.UpdatedAt,
                        deletedAt = medicine.DeletedAt ?? DateTime.UnixEpoch
                    }
                    : new
                    {
                        Uuid = detail.MedicineUuid ?? Guid.Empty,
                        Image = string.Empty,
                        Name = "Thuốc không xác định",
                        Description = string.Empty,
                        detail.Price,
                        Unit = MedicineUnit.Other,
                        Status = BaseStatus.Active,
                        IsInsured = false,
                        InsuranceCap = 0f,
                        CreatedAt = prescription.CreatedAt,
                        UpdatedAt = prescription.UpdatedAt,
                        deletedAt = DateTime.UnixEpoch
                    }
            };
        }).ToList();

        return (true, new
        {
            prescription = new
            {
                prescription.Uuid,
                prescription.PatientProfileUuid,
                prescription.DoctorProfileUuid,
                prescription.HospitalUuid,
                prescription.Status,
                prescription.Note,
                prescription.AppointmentUuid,
                prescription.CreatedAt,
                prescription.UpdatedAt,
                deletedAt = prescription.DeletedAt ?? DateTime.UnixEpoch
            },
            hospital = new
            {
                uuid = hospital?.Uuid ?? prescription.HospitalUuid ?? Guid.Empty,
                name = hospital?.Name ?? "Cơ sở y tế",
                slug = hospital?.Slug ?? string.Empty
            },
            doctor = new
            {
                uuid = doctor?.Uuid ?? prescription.DoctorProfileUuid ?? Guid.Empty,
                name = doctor?.Name ?? "Bác sĩ",
                slug = doctor?.Slug ?? string.Empty
            },
            appointment = hasLinkedAppointment && prescription.AppointmentUuid.HasValue
                ? new { uuid = prescription.AppointmentUuid.Value, type = "hospital" }
                : null,
            totalAmount = rawDetails.Count > 0
                ? rawDetails.Sum(detail => (long)detail.Quantity * detail.Price)
                : (long?)null,
            numberOfItems = rawDetails.Count,
            details = detailViews
        });
    }
}

