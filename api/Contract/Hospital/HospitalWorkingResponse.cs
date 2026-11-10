using api.Model.Enum;

namespace api.Contract.Hospital;

public sealed class HospitalWorkingResponse
{
    public Guid Uuid { get; init; }
    public Guid WorkingUuid { get; init; }
    public int DayOfWeek { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public BaseStatus Status { get; init; }
}
