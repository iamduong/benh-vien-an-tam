using System.ComponentModel.DataAnnotations;

namespace api.Model;

public sealed class DoctorWorkingHour
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid DoctorScheduleUuid { get; set; }
    public Guid WorkingHourUuid { get; set; }
    public Guid RoomUuid { get; set; }
}
