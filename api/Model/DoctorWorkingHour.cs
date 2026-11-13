using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model;

[Table("DoctorWorking")]
public sealed class DoctorWorkingHour
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid DoctorUuid { get; set; }

    [Column("WorkingUuid")]
    public Guid WorkingHourUuid { get; set; }

}
