using System.ComponentModel.DataAnnotations;

namespace api.Model;

public class DoctorDepartment
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid DoctorUuid { get; set; }
    public Guid DepartmentUuid { get; set; }
}
