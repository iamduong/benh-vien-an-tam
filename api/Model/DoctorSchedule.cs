using System.ComponentModel.DataAnnotations;

namespace api.Model;

/// <summary>
/// Ca trực thực tế của bác sĩ. Khác với DoctorWorking là khung giờ khách được phép đặt lịch.
/// </summary>
public sealed class DoctorSchedule
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid DoctorUuid { get; set; }
    public Guid WorkingHourUuid { get; set; }
    public Guid? RoomUuid { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
