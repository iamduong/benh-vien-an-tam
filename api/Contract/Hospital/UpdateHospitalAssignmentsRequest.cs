using System.ComponentModel.DataAnnotations;

namespace api.Contract.Hospital;

public sealed class UpdateHospitalAssignmentsRequest
{
    [Required]
    public List<Guid>? DepartmentUuids { get; init; }

    [Required]
    public List<Guid>? MedicalServiceUuids { get; init; }
}
