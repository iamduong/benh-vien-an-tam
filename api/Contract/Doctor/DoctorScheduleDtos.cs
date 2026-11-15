using System.ComponentModel.DataAnnotations;

namespace api.Contract.Doctor;

public sealed class CreateDoctorScheduleRequest
{
    [Required]
    public Guid DoctorUuid { get; init; }

    [MinLength(1)]
    public IReadOnlyList<DoctorScheduleSelectionRequest> Selections { get; init; } = [];
}

public sealed class DoctorScheduleSelectionRequest
{
    [Required]
    public Guid WorkingHourUuid { get; init; }

    [Required]
    public Guid RoomUuid { get; init; }
}

public sealed class DoctorScheduleResponse
{
    public Guid DoctorScheduleUuid { get; init; }
    public Guid DoctorUuid { get; init; }
    public string DoctorName { get; init; } = string.Empty;
    public Guid Uuid { get; init; }
    public int DayOfWeek { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public Guid? RoomUuid { get; init; }
    public string? RoomName { get; init; }
}

public sealed class DoctorWorkingHourResponse
{
    public Guid DoctorScheduleUuid { get; init; }
    public Guid Uuid { get; init; }
    public int DayOfWeek { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public Guid? RoomUuid { get; init; }
    public string? RoomName { get; init; }
}
