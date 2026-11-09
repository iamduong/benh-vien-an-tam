namespace api.Contract.Review;

public sealed class ManagedReviewResponse
{
    public Guid Uuid { get; init; }
    public string Type { get; init; } = string.Empty;
    public Guid TargetUuid { get; init; }
    public string TargetName { get; init; } = string.Empty;
    public Guid? PatientUuid { get; init; }
    public string PatientName { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public int NumberOfStar { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
