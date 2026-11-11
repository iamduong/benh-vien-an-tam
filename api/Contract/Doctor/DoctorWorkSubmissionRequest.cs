using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Contract.Doctor;

public sealed class CreateDoctorWorkSubmissionRequest
{
    public Guid? DoctorWorkingHourUuid { get; init; }
    public Guid? RequestedWorkingHourUuid { get; init; }
    public DoctorWorkSubmissionType Type { get; init; } = DoctorWorkSubmissionType.Change;

    [Required, StringLength(1000, MinimumLength = 5)]
    public string Reason { get; init; } = string.Empty;
}

public sealed class ReviewDoctorWorkSubmissionRequest
{
    public DoctorWorkSubmissionStatus Status { get; init; }

    [StringLength(1000)]
    public string ReviewNote { get; init; } = string.Empty;
}
