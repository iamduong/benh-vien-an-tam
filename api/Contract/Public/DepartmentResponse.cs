namespace api.Contract.Public;

public class DepartmentResponse
{
    public Guid Uuid { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
