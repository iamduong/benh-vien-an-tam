using System.ComponentModel.DataAnnotations;
using api.Model.Enum;

namespace api.Contract.Patient;

public sealed class UpdateCurrentPatientRequest
{
    [StringLength(2000)]
    public string Avatar { get; init; } = string.Empty;

    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; init; } = string.Empty;

    public Gender Gender { get; init; }
    public DateTime Birthdate { get; init; }

    [Required, EmailAddress, StringLength(254)]
    public string Email { get; init; } = string.Empty;
}
