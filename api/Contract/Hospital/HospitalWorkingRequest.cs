using System.ComponentModel.DataAnnotations;

namespace api.Contract.Hospital;

public sealed class HospitalWorkingRequest
{
    [Required]
    public Guid WorkingUuid { get; init; }
}
