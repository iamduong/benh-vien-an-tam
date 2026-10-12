using System.ComponentModel.DataAnnotations;

namespace api.Model;

public class Permission
{
    [Key]
    public Guid Uuid { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
