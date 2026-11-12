using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Contract.Appointment;

public sealed class CreatePatientBookingRequest
{
    [Required, StringLength(100, MinimumLength = 1)]
    public string PatientName { get; init; } = string.Empty;

    public Gender Gender { get; init; }

    [Required, StringLength(50, MinimumLength = 1)]
    public string MedicalCode { get; init; } = string.Empty;

    [StringLength(500)]
    public string Note { get; init; } = string.Empty;

    public DateTime AppointmentAt { get; init; }
    public Guid AccountUuid { get; init; }
    public Guid HospitalUuid { get; init; }
    public Guid? DoctorUuid { get; init; }
    public Guid? MedicalServiceUuid { get; init; }
}
