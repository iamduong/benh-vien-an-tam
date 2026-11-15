using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Model;

public class Appointment 
{
    [Key]
    public Guid Uuid { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public Gender Gender { get; set; } = Gender.Other;
    public string MedicalCode { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public DateTime AppointmentDate { get; set; }
    public Guid? TimeSlot { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public Guid? PatientUuid { get; set; }
    public Guid? HospitalUuid { get; set; }
    public Guid? DoctorUuid { get; set; }
    public Guid? RoomUuid { get; set; }
    public string DoctorNote { get; set; } = string.Empty;
    public int TotalPrice { get; set; }
    public bool IsPaid { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
