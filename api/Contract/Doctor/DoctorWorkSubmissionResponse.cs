using api.Model.Enum;

namespace api.Contract.Doctor;

public class WorkingHourOptionResponse
{
    public Guid Uuid { get; init; }
    public int DayOfWeek { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
}

public sealed class DoctorScheduleResponse : WorkingHourOptionResponse
{
    public Guid DoctorScheduleUuid { get; init; }
    public Guid? RoomUuid { get; init; }
    public string? RoomName { get; init; }
}

public sealed class DoctorWorkSubmissionResponse
{
    public Guid Uuid { get; init; }
    public Guid DoctorUuid { get; init; }
    public string DoctorName { get; init; } = string.Empty;
    public Guid? DoctorScheduleUuid { get; init; }
    public DoctorWorkSubmissionType Type { get; init; }
    public WorkingHourOptionResponse? CurrentWorkingHour { get; init; }
    public WorkingHourOptionResponse? RequestedWorkingHour { get; init; }
    public string Reason { get; init; } = string.Empty;
    public DoctorWorkSubmissionStatus Status { get; init; }
    public string ReviewNote { get; init; } = string.Empty;
    public DateTime? ReviewedAt { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public sealed class DoctorWorkingOverviewResponse
{
    public IReadOnlyList<DoctorScheduleResponse> Schedule { get; init; } = [];
    public IReadOnlyList<WorkingHourOptionResponse> AvailableWorkingHours { get; init; } = [];
    public IReadOnlyList<DoctorWorkSubmissionResponse> Submissions { get; init; } = [];
}
