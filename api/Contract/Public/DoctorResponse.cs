namespace api.Contract.Public;

public class DoctorResponse
{
    public Guid Uuid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string DepartmentDisplay { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string Workplace { get; set; } = string.Empty; 
    public string Introduction { get; set; } = string.Empty;
    public string Expertise { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Slug { get; set; } = string.Empty;
    public Guid? HospitalUuid { get; set; }
}
