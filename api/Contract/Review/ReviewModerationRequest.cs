using System.ComponentModel.DataAnnotations;

namespace api.Contract.Review;

public sealed class ReviewModerationRequest
{
    [Required]
    [RegularExpression("^(accepted|rejected|hidden)$")]
    public string Status { get; init; } = string.Empty;
}
