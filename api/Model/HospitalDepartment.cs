using System.ComponentModel.DataAnnotations;

namespace api.Model;

public class HospitalDepartment
{
    [Key]
    public Guid Uuid { get; set; }
    public Guid? HospitalUuid { get; set; }
    public Guid? DepartmentUuid { get; set; }
}
