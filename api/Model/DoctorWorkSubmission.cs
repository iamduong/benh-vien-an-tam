using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Model;

public sealed class DoctorWorkSubmission
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid DoctorUuid { get; set; }
    public Guid? DoctorWorkingHourUuid { get; set; }
    public Guid? PreviousWorkingHourUuid { get; set; }
    public Guid? RequestedWorkingHourUuid { get; set; }
    public DoctorWorkSubmissionType Type { get; set; } = DoctorWorkSubmissionType.Change;
    public string Reason { get; set; } = string.Empty;
    public DoctorWorkSubmissionStatus Status { get; set; } = DoctorWorkSubmissionStatus.Pending;
    public string ReviewNote { get; set; } = string.Empty;
    public Guid? ReviewedByAccountUuid { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
