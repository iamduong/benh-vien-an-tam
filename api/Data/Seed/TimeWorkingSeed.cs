using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class TimeWorkingSeed
{
    private static readonly DateTime SeededAt = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static IReadOnlyList<TimeWorking> TimeWorkings { get; } =
    [
        Create("a01e0b59-47cd-4c69-aea1-9ff571fe9c9b", 1, 7, 0, 11, 30),
        Create("2f1ac953-1140-44de-80a1-4c1841dea41f", 1, 13, 0, 17, 0),
        Create("f791f367-dded-433c-a460-661d13f1b7f8", 2, 7, 0, 11, 30),
        Create("922dff60-04b2-4758-ae68-5ef4c9443c7f", 2, 13, 0, 17, 0),
        Create("d700f392-bd1b-4377-aac7-76a0f04bf22e", 3, 7, 0, 11, 30),
        Create("13ff7285-5624-4cd3-b4d0-6456c97d2577", 3, 13, 0, 17, 0),
        Create("bf05d060-321c-4740-8907-de93d1457add", 4, 7, 0, 11, 30),
        Create("0ea57126-f2e9-40f5-9d32-357e7f26bf74", 4, 13, 0, 17, 0),
        Create("3272b0c4-75a7-4c26-b5e2-1ab56aac7ca4", 5, 7, 0, 11, 30),
        Create("edcfebdd-0799-49aa-a731-1ea626d8e2c1", 5, 13, 0, 17, 0),
        Create("e4aec806-9bfa-4b9f-a09a-078e9a984738", 6, 7, 30, 11, 30)
    ];

    private static TimeWorking Create(
        string uuid,
        int dayOfWeek,
        int startHour,
        int startMinute,
        int endHour,
        int endMinute) => new()
    {
        Uuid = Guid.Parse(uuid),
        DayOfWeek = dayOfWeek,
        StartTime = new TimeOnly(startHour, startMinute),
        EndTime = new TimeOnly(endHour, endMinute),
        Status = BaseStatus.Active,
        CreatedAt = SeededAt,
        UpdatedAt = SeededAt,
        DeletedAt = null
    };
}
