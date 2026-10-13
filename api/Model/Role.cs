using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Model;

public class Role
{
    [Key]
    public Guid Uuid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsDoctor { get; set; }
    public AccessScope Scope { get; set; } = AccessScope.Hospital;
    public BaseStatus Status { get; set; } = BaseStatus.Active;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
