using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Contract.Hospital;

public sealed class CreateBranchAppointmentRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string PatientName { get; init; } = string.Empty;

    [Required]
    public Gender Gender { get; init; }

    [Required]
    public DateTime AppointmentDate { get; init; }

    [StringLength(1000)]
    public string Note { get; init; } = string.Empty;

    [Required]
    public AppointmentType Type { get; init; } = AppointmentType.Hospital;
}
