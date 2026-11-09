using System.ComponentModel.DataAnnotations;

namespace api.Contract.Review;

public sealed class SaveReviewRequest
{
    [Range(1, 5)]
    public int NumberOfStar { get; init; }

    [Required]
    [StringLength(2000)]
    public string Content { get; init; } = string.Empty;
}
