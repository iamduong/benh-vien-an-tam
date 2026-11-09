using api.Contract;
using api.Contract.Review;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controller;

[ApiController]
[Route("api/reviews")]
public sealed class ReviewsController(DBContext dbContext) : ControllerBase
{
    [HttpGet("eligibility")]
    [Authorize]
    public async Task<IActionResult> GetEligibility(
        [FromQuery] Guid appointmentUuid,
        CancellationToken cancellationToken)
    {
        var patientUuid = await GetCurrentPatientUuidAsync(cancellationToken);
        if (patientUuid is null)
            return Unauthorized(new { message = "Chỉ bệnh nhân mới có thể gửi đánh giá." });

        var appointment = await dbContext.Appointments
            .AsNoTracking()
            .FirstOrDefaultAsync(item =>
                item.Uuid == appointmentUuid &&
                item.PatientUuid == patientUuid &&
                item.DeletedAt == null &&
                item.Status == AppointmentStatus.Done,
                cancellationToken);
        if (appointment is null)
            return Forbid();

        var targets = await GetAppointmentTargetsAsync(appointment, patientUuid.Value, cancellationToken);
        return Ok(new
        {
            message = "Lấy thông tin đánh giá thành công.",
            data = new { appointmentUuid, targets },
        });
    }

    [HttpPut("{type}/{targetUuid:guid}")]
    [Authorize]
    public async Task<IActionResult> SaveReview(
        string type,
        Guid targetUuid,
        SaveReviewRequest request,
        CancellationToken cancellationToken)
    {
        var patientUuid = await GetCurrentPatientUuidAsync(cancellationToken);
        if (patientUuid is null)
            return Unauthorized(new { message = "Chỉ bệnh nhân mới có thể gửi đánh giá." });
        if (!IsValidReviewType(type))
            return BadRequest(new { message = "Loại đối tượng đánh giá không hợp lệ." });

        var appointment = await FindCompletedAppointmentAsync(
            patientUuid.Value, type, targetUuid, cancellationToken);
        if (appointment is null)
            return Forbid();

        var content = request.Content.Trim();
        if (content.Length == 0)
            return BadRequest(new { message = "Nội dung đánh giá không được để trống." });

        var savedReview = await SaveReviewAsync(
            type, targetUuid, patientUuid.Value, request.NumberOfStar, content, cancellationToken);
        return Ok(new
        {
            message = "Đánh giá đã được gửi và đang chờ duyệt.",
            data = ToPatientReview(type, savedReview),
        });
    }

    [HttpGet("public")]
    public async Task<IActionResult> GetPublicReviews(
        [FromQuery] string type,
        [FromQuery] Guid targetUuid,
        CancellationToken cancellationToken)
    {
        if (!IsValidReviewType(type))
            return BadRequest(new { message = "Loại đối tượng đánh giá không hợp lệ." });

        var items = await QueryReviews(type)
            .Where(item => item.TargetUuid == targetUuid &&
                           item.Status == BaseStatus.Active &&
                           !item.IsViewed)
            .OrderByDescending(item => item.CreatedAt)
            .Take(100)
            .Select(item => new
            {
                item.Uuid,
                item.Content,
                item.NumberOfStar,
                item.CreatedAt,
                PatientName = item.PatientName ?? "Người bệnh",
            })
            .ToListAsync(cancellationToken);

        var averageRating = GetRoundedAverage(await QueryReviews(type)
            .Where(item => item.TargetUuid == targetUuid &&
                           item.Status == BaseStatus.Active &&
                           !item.IsViewed)
            .Select(item => item.NumberOfStar)
            .ToListAsync(cancellationToken));
        var reviewCount = await QueryReviews(type)
            .CountAsync(item => item.TargetUuid == targetUuid &&
                                item.Status == BaseStatus.Active &&
                                !item.IsViewed,
                cancellationToken);

        return Ok(new
        {
            message = "Lấy đánh giá công khai thành công.",
            data = items,
            averageRating,
            reviewCount,
        });
    }

    [HttpGet("~/api/hospital-reviews")]
    [Authorize]
    public async Task<IActionResult> GetBranchReviews(
        [FromQuery] string? type,
        [FromQuery] int? stars,
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = await GetCurrentHospitalUuidAsync(cancellationToken);
        if (hospitalUuid is null)
            return Unauthorized(new { message = "Tài khoản chưa được gán chi nhánh." });

        var types = type is null or "all"
            ? new[] { "hospital", "doctor", "medical-service" }
            : IsValidReviewType(type) ? new[] { type } : [];
        if (types.Length == 0)
            return BadRequest(new { message = "Loại đánh giá không hợp lệ." });
        if (stars.HasValue && stars is < 1 or > 5)
            return BadRequest(new { message = "Số sao phải từ 1 đến 5." });
        if (status is not null and not "all" and not "pending" and not "accepted" and not "rejected" and not "hidden")
            return BadRequest(new { message = "Trạng thái duyệt không hợp lệ." });

        var reviews = new List<ManagedReviewResponse>();
        foreach (var reviewType in types)
        {
            var query = WithHospitalFilter(reviewType, hospitalUuid.Value);

            var results = await query
                .OrderByDescending(item => item.CreatedAt)
                .Select(item => new ManagedReviewResponse
                {
                    Uuid = item.Uuid,
                    Type = reviewType,
                    TargetUuid = item.TargetUuid,
                    TargetName = item.TargetName,
                    PatientUuid = item.PatientUuid,
                    PatientName = item.PatientName ?? "Người bệnh",
                    Content = item.Content,
                    NumberOfStar = item.NumberOfStar,
                    Status = GetReviewStatus(item.Status, item.IsViewed),
                    CreatedAt = item.CreatedAt,
                })
                .ToListAsync(cancellationToken);
            reviews.AddRange(results);
        }

        var approved = reviews.Where(item => item.Status == "accepted").ToList();
        var summary = new
        {
            total = reviews.Count,
            pending = reviews.Count(item => item.Status == "pending"),
            accepted = reviews.Count(item => item.Status == "accepted"),
            rejected = reviews.Count(item => item.Status == "rejected"),
            hidden = reviews.Count(item => item.Status == "hidden"),
            hospital = GetRoundedAverage(approved.Where(item => item.Type == "hospital").Select(item => item.NumberOfStar)),
            doctors = GetRoundedAverage(approved.Where(item => item.Type == "doctor").Select(item => item.NumberOfStar)),
            medicalServices = GetRoundedAverage(approved.Where(item => item.Type == "medical-service").Select(item => item.NumberOfStar)),
        };
        var term = search?.Trim();
        var filteredReviews = reviews.Where(item =>
                (!stars.HasValue || item.NumberOfStar == stars.Value) &&
                (status is null or "all" || item.Status == status) &&
                (string.IsNullOrEmpty(term) ||
                 item.Content.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                 item.TargetName.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                 item.PatientName.Contains(term, StringComparison.OrdinalIgnoreCase)))
            .OrderByDescending(item => item.CreatedAt)
            .ToArray();

        return Ok(new
        {
            message = "Lấy đánh giá của chi nhánh thành công.",
            data = filteredReviews,
            summary,
        });
    }

    [HttpPut("~/api/hospital-reviews/{type}/{uuid:guid}/moderation")]
    [Authorize]
    public async Task<IActionResult> ModerateBranchReview(
        string type,
        Guid uuid,
        ReviewModerationRequest request,
        CancellationToken cancellationToken)
    {
        var hospitalUuid = await GetCurrentHospitalUuidAsync(cancellationToken);
        if (hospitalUuid is null)
            return Unauthorized(new { message = "Tài khoản chưa được gán chi nhánh." });
        if (!IsValidReviewType(type))
            return BadRequest(new { message = "Loại đối tượng đánh giá không hợp lệ." });

        var review = await FindReviewAsync(type, uuid, cancellationToken);
        if (review is null || !await IsReviewInHospitalAsync(type, review.TargetUuid, hospitalUuid.Value, cancellationToken))
            return NotFound(new { message = "Không tìm thấy đánh giá thuộc chi nhánh." });

        await SetModerationStatusAsync(type, uuid, request.Status, cancellationToken);
        return Ok(new { message = "Đã cập nhật trạng thái đánh giá." });
    }

    private async Task<Guid?> GetCurrentPatientUuidAsync(CancellationToken cancellationToken)
    {
        var accountUuid = User.GetAccountUuid();
        if (!accountUuid.HasValue)
            return null;

        return await dbContext.PatientProfiles
            .Where(item => item.AccountUuid == accountUuid.Value)
            .Select(item => (Guid?)item.Uuid)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private async Task<Guid?> GetCurrentHospitalUuidAsync(CancellationToken cancellationToken)
    {
        var hospitalUuid = User.GetHospitalUuid();
        if (!hospitalUuid.HasValue)
            return null;
        return await dbContext.Hospitals.AnyAsync(
            item => item.Uuid == hospitalUuid.Value && item.DeletedAt == null,
            cancellationToken) ? hospitalUuid : null;
    }

    private async Task<Appointment?> FindCompletedAppointmentAsync(
        Guid patientUuid,
        string type,
        Guid targetUuid,
        CancellationToken cancellationToken)
    {
        var appointments = dbContext.Appointments.Where(item =>
            item.PatientUuid == patientUuid &&
            item.Status == AppointmentStatus.Done &&
            item.DeletedAt == null);
        return type switch
        {
            "hospital" => await appointments.FirstOrDefaultAsync(
                item => item.HospitalUuid == targetUuid, cancellationToken),
            "doctor" => await appointments.FirstOrDefaultAsync(
                item => item.DoctorUuid == targetUuid, cancellationToken),
            "medical-service" => await appointments.FirstOrDefaultAsync(
                item => item.MedicalServiceUuid == targetUuid, cancellationToken)
                ?? await (from appointment in appointments
                          join service in dbContext.AppointmentMedicalServices
                              on appointment.Uuid equals service.AppointmentUuid
                          where service.MedicalServiceUuid == targetUuid
                          select appointment).FirstOrDefaultAsync(cancellationToken),
            _ => null,
        };
    }

    private async Task<object[]> GetAppointmentTargetsAsync(
        Appointment appointment,
        Guid patientUuid,
        CancellationToken cancellationToken)
    {
        var targets = new List<object>();
        var serviceUuids = new HashSet<Guid>();
        if (appointment.HospitalUuid.HasValue)
        {
            var hospital = await dbContext.Hospitals.AsNoTracking()
                .Where(item => item.Uuid == appointment.HospitalUuid.Value)
                .Select(item => new { item.Uuid, item.Name })
                .FirstOrDefaultAsync(cancellationToken);
            if (hospital is not null)
                targets.Add(await BuildEligibilityTargetAsync(
                    "hospital", hospital.Uuid, hospital.Name, patientUuid, cancellationToken));
        }
        if (appointment.DoctorUuid.HasValue)
        {
            var doctor = await dbContext.DoctorProfiles.AsNoTracking()
                .Where(item => item.Uuid == appointment.DoctorUuid.Value)
                .Select(item => new { item.Uuid, item.Name })
                .FirstOrDefaultAsync(cancellationToken);
            if (doctor is not null)
                targets.Add(await BuildEligibilityTargetAsync(
                    "doctor", doctor.Uuid, doctor.Name, patientUuid, cancellationToken));
        }
        if (appointment.MedicalServiceUuid.HasValue)
        {
            var service = await dbContext.MedicalServices.AsNoTracking()
                .Where(item => item.Uuid == appointment.MedicalServiceUuid.Value)
                .Select(item => new { item.Uuid, item.Name })
                .FirstOrDefaultAsync(cancellationToken);
            if (service is not null)
            {
                targets.Add(await BuildEligibilityTargetAsync(
                    "medical-service", service.Uuid, service.Name, patientUuid, cancellationToken));
                serviceUuids.Add(service.Uuid);
            }
        }
        var additionalServices = await (
            from appointmentService in dbContext.AppointmentMedicalServices.AsNoTracking()
            join service in dbContext.MedicalServices.AsNoTracking()
                on appointmentService.MedicalServiceUuid equals service.Uuid
            where appointmentService.AppointmentUuid == appointment.Uuid
            select new { service.Uuid, service.Name })
            .ToListAsync(cancellationToken);
        foreach (var service in additionalServices)
        {
            if (!serviceUuids.Add(service.Uuid))
                continue;
            targets.Add(await BuildEligibilityTargetAsync(
                "medical-service", service.Uuid, service.Name, patientUuid, cancellationToken));
        }
        return targets.ToArray();
    }

    private async Task<object> BuildEligibilityTargetAsync(
        string type,
        Guid targetUuid,
        string targetName,
        Guid patientUuid,
        CancellationToken cancellationToken) =>
        new
        {
            type,
            targetUuid,
            targetName,
            review = await FindPatientReviewAsync(type, targetUuid, patientUuid, cancellationToken),
        };

    private async Task<object?> FindPatientReviewAsync(
        string type,
        Guid targetUuid,
        Guid patientUuid,
        CancellationToken cancellationToken)
    {
        var review = await QueryReviews(type).FirstOrDefaultAsync(item =>
            item.TargetUuid == targetUuid && item.PatientUuid == patientUuid,
            cancellationToken);
        return review is null ? null : ToPatientReview(type, review);
    }

    private async Task<ReviewQuery> SaveReviewAsync(
        string type,
        Guid targetUuid,
        Guid patientUuid,
        int stars,
        string content,
        CancellationToken cancellationToken)
    {
        switch (type)
        {
            case "hospital":
            {
                var review = await dbContext.ReviewHospitals.FirstOrDefaultAsync(item =>
                    item.HospitalUuid == targetUuid && item.PatientUuid == patientUuid,
                    cancellationToken);
                if (review is null)
                {
                    review = new ReviewHospital { Uuid = Guid.NewGuid(), HospitalUuid = targetUuid, PatientUuid = patientUuid, CreatedAt = DateTime.UtcNow };
                    dbContext.ReviewHospitals.Add(review);
                }
                review.Content = content;
                review.NumberOfStar = stars;
                review.Status = BaseStatus.InActive;
                review.IsViewed = false;
                await dbContext.SaveChangesAsync(cancellationToken);
                break;
            }
            case "doctor":
            {
                var review = await dbContext.ReviewDoctors.FirstOrDefaultAsync(item =>
                    item.DoctorUuid == targetUuid && item.PatientUuid == patientUuid,
                    cancellationToken);
                if (review is null)
                {
                    review = new ReviewDoctor { Uuid = Guid.NewGuid(), DoctorUuid = targetUuid, PatientUuid = patientUuid, CreatedAt = DateTime.UtcNow };
                    dbContext.ReviewDoctors.Add(review);
                }
                review.Content = content;
                review.NumberOfStar = stars;
                review.Status = BaseStatus.InActive;
                review.IsViewed = false;
                await dbContext.SaveChangesAsync(cancellationToken);
                break;
            }
            default:
            {
                var review = await dbContext.ReviewMedicalServices.FirstOrDefaultAsync(item =>
                    item.MedicalServiceUuid == targetUuid && item.PatientUuid == patientUuid,
                    cancellationToken);
                if (review is null)
                {
                    review = new ReviewMedicalService { Uuid = Guid.NewGuid(), MedicalServiceUuid = targetUuid, PatientUuid = patientUuid, CreatedAt = DateTime.UtcNow };
                    dbContext.ReviewMedicalServices.Add(review);
                }
                review.Content = content;
                review.NumberOfStar = stars;
                review.Status = BaseStatus.InActive;
                review.IsViewed = false;
                await dbContext.SaveChangesAsync(cancellationToken);
                break;
            }
        }
        return await QueryReviews(type).SingleAsync(
            item => item.TargetUuid == targetUuid && item.PatientUuid == patientUuid,
            cancellationToken);
    }

    private IQueryable<ReviewQuery> QueryReviews(string type) => type switch
    {
        "hospital" =>
            from review in dbContext.ReviewHospitals.AsNoTracking()
            join hospital in dbContext.Hospitals.AsNoTracking() on review.HospitalUuid equals hospital.Uuid
            join patient in dbContext.PatientProfiles.AsNoTracking() on review.PatientUuid equals patient.Uuid into patients
            from patient in patients.DefaultIfEmpty()
            select new ReviewQuery
            {
                Uuid = review.Uuid,
                TargetUuid = hospital.Uuid,
                TargetName = hospital.Name,
                PatientUuid = review.PatientUuid,
                PatientName = patient == null ? "Người bệnh" : patient.Name,
                Content = review.Content,
                NumberOfStar = review.NumberOfStar,
                Status = review.Status,
                IsViewed = review.IsViewed,
                CreatedAt = review.CreatedAt,
            },
        "doctor" =>
            from review in dbContext.ReviewDoctors.AsNoTracking()
            join doctor in dbContext.DoctorProfiles.AsNoTracking() on review.DoctorUuid equals doctor.Uuid
            join patient in dbContext.PatientProfiles.AsNoTracking() on review.PatientUuid equals patient.Uuid into patients
            from patient in patients.DefaultIfEmpty()
            select new ReviewQuery
            {
                Uuid = review.Uuid,
                TargetUuid = doctor.Uuid,
                TargetName = doctor.Name,
                PatientUuid = review.PatientUuid,
                PatientName = patient == null ? "Người bệnh" : patient.Name,
                Content = review.Content,
                NumberOfStar = review.NumberOfStar,
                Status = review.Status,
                IsViewed = review.IsViewed,
                CreatedAt = review.CreatedAt,
            },
        _ =>
            from review in dbContext.ReviewMedicalServices.AsNoTracking()
            join service in dbContext.MedicalServices.AsNoTracking() on review.MedicalServiceUuid equals service.Uuid
            join patient in dbContext.PatientProfiles.AsNoTracking() on review.PatientUuid equals patient.Uuid into patients
            from patient in patients.DefaultIfEmpty()
            select new ReviewQuery
            {
                Uuid = review.Uuid,
                TargetUuid = service.Uuid,
                TargetName = service.Name,
                PatientUuid = review.PatientUuid,
                PatientName = patient == null ? "Người bệnh" : patient.Name,
                Content = review.Content,
                NumberOfStar = review.NumberOfStar,
                Status = review.Status,
                IsViewed = review.IsViewed,
                CreatedAt = review.CreatedAt,
            },
    };

    private async Task<ReviewQuery?> FindReviewAsync(
        string type,
        Guid uuid,
        CancellationToken cancellationToken) =>
        await QueryReviews(type).FirstOrDefaultAsync(item => item.Uuid == uuid, cancellationToken);

    private async Task SetModerationStatusAsync(
        string type,
        Guid uuid,
        string status,
        CancellationToken cancellationToken)
    {
        var accepted = status == "accepted" || status == "hidden";
        var hiddenOrRejected = status == "hidden" || status == "rejected";
        switch (type)
        {
            case "hospital":
            {
                var review = await dbContext.ReviewHospitals.FirstAsync(item => item.Uuid == uuid, cancellationToken);
                review.Status = accepted ? BaseStatus.Active : BaseStatus.InActive;
                review.IsViewed = hiddenOrRejected;
                break;
            }
            case "doctor":
            {
                var review = await dbContext.ReviewDoctors.FirstAsync(item => item.Uuid == uuid, cancellationToken);
                review.Status = accepted ? BaseStatus.Active : BaseStatus.InActive;
                review.IsViewed = hiddenOrRejected;
                break;
            }
            default:
            {
                var review = await dbContext.ReviewMedicalServices.FirstAsync(item => item.Uuid == uuid, cancellationToken);
                review.Status = accepted ? BaseStatus.Active : BaseStatus.InActive;
                review.IsViewed = hiddenOrRejected;
                break;
            }
        }
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<ReviewQuery> WithHospitalFilter(string type, Guid hospitalUuid)
    {
        var query = QueryReviews(type);
        return type switch
        {
            "hospital" => query.Where(item => item.TargetUuid == hospitalUuid),
            "doctor" => query.Where(item => dbContext.DoctorProfiles.Any(doctor =>
                doctor.Uuid == item.TargetUuid && doctor.HospitalUuid == hospitalUuid)),
            _ => query.Where(item => dbContext.HospitalMedicalServices.Any(relation =>
                relation.HospitalUuid == hospitalUuid && relation.MedicalServiceUuid == item.TargetUuid)),
        };
    }

    private IQueryable<ReviewQuery> IsReviewInHospital(
        string type,
        Guid targetUuid,
        Guid hospitalUuid) =>
        WithHospitalFilter(type, hospitalUuid).Where(item => item.TargetUuid == targetUuid);

    private async Task<bool> IsReviewInHospitalAsync(
        string type,
        Guid targetUuid,
        Guid hospitalUuid,
        CancellationToken cancellationToken) =>
        await IsReviewInHospital(type, targetUuid, hospitalUuid).AnyAsync(cancellationToken);

    private static bool IsValidReviewType(string type) =>
        type is "hospital" or "doctor" or "medical-service";

    private static string GetReviewStatus(BaseStatus status, bool isViewed) =>
        (status, isViewed) switch
        {
            (BaseStatus.Active, false) => "accepted",
            (BaseStatus.Active, true) => "hidden",
            (BaseStatus.InActive, true) => "rejected",
            _ => "pending",
        };

    private static double? GetRoundedAverage(IEnumerable<int> stars)
    {
        var values = stars.ToArray();
        return values.Length == 0
            ? null
            : Math.Round(values.Average() * 2, MidpointRounding.AwayFromZero) / 2;
    }

    private static object ToPatientReview(string type, ReviewQuery review) =>
        type switch
        {
            "hospital" => new
            {
                uuid = review.Uuid,
                content = review.Content,
                numberOfStar = review.NumberOfStar,
                patientUuid = review.PatientUuid,
                hospitalUuid = review.TargetUuid,
                status = review.Status,
                isViewed = review.IsViewed,
                createdAt = review.CreatedAt,
            },
            "doctor" => new
            {
                uuid = review.Uuid,
                content = review.Content,
                numberOfStar = review.NumberOfStar,
                patientUuid = review.PatientUuid,
                doctorUuid = review.TargetUuid,
                status = review.Status,
                isViewed = review.IsViewed,
                createdAt = review.CreatedAt,
            },
            _ => new
            {
                uuid = review.Uuid,
                content = review.Content,
                numberOfStar = review.NumberOfStar,
                patientUuid = review.PatientUuid,
                medicalServiceUuid = review.TargetUuid,
                status = review.Status,
                isViewed = review.IsViewed,
                createdAt = review.CreatedAt,
            },
        };

    private sealed class ReviewQuery
    {
        public Guid Uuid { get; init; }
        public Guid TargetUuid { get; init; }
        public string TargetName { get; init; } = string.Empty;
        public Guid? PatientUuid { get; init; }
        public string? PatientName { get; init; }
        public string Content { get; init; } = string.Empty;
        public int NumberOfStar { get; init; }
        public BaseStatus Status { get; init; }
        public bool IsViewed { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
