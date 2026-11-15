using System.ComponentModel.DataAnnotations;

namespace api.Model;

public sealed class DoctorSchedule
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid DoctorUuid { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
