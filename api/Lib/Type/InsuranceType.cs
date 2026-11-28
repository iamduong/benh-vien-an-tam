using api.Model.Enum;

namespace api.Lib.Type;

public sealed class IdentityInsurance
{
    public required IdentityMedical Medical { get; set; }
    public required IdentityPatient Patient { get; set; }   
}

public sealed class IdentityMedical
{
    public string RefCode { get; set; } = string.Empty;
    public string InsuranceCardCode { get; set; } = string.Empty;
    public string ValidFrom { get; set; } = string.Empty;
    public string ValidTo { get; set; } = string.Empty;
}

public sealed class IdentityPatient
{
    public string IdentityCardCode { get; set; } = string.Empty; 
    public string Name { get; set; } = string.Empty;
    public Gender Gender { get; set; } = Gender.Other;
    public string BirthDate { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
