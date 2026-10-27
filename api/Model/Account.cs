using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Model;

public class Account 
{
    [Key]
    public Guid Uuid { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Guid? RoleUuid { get; set; }
    public BaseStatus Status { get; set; } = BaseStatus.Active;

    public Guid? HospitalUuid { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
