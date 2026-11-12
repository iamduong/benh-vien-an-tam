using api.Contract;
using api.Contract.Review;
using api.Model;
using api.Model.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/reviews")]
public sealed class ReviewsController(ReviewsService service) : ControllerBase
{
    private ReviewsService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet("eligibility")]
    [Authorize]
    public async Task<IActionResult> GetEligibility(
        [FromQuery] Guid appointmentUuid,
        CancellationToken cancellationToken) => await Service.GetEligibility(appointmentUuid, cancellationToken);
    [HttpPut("{type}/{targetUuid:guid}")]
    [Authorize]
    public async Task<IActionResult> SaveReview(
        string type,
        Guid targetUuid,
        SaveReviewRequest request,
        CancellationToken cancellationToken) => await Service.SaveReview(type, targetUuid, request, cancellationToken);
    [HttpGet("public")]
    public async Task<IActionResult> GetPublicReviews(
        [FromQuery] string type,
        [FromQuery] Guid targetUuid,
        CancellationToken cancellationToken) => await Service.GetPublicReviews(type, targetUuid, cancellationToken);
    [HttpGet("~/api/hospital-reviews")]
    [Authorize]
    public async Task<IActionResult> GetBranchReviews(
        [FromQuery] string? type,
        [FromQuery] int? stars,
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken) => await Service.GetBranchReviews(type, stars, status, search, cancellationToken);
    [HttpPut("~/api/hospital-reviews/{type}/{uuid:guid}/moderation")]
    [Authorize]
    public async Task<IActionResult> ModerateBranchReview(
        string type,
        Guid uuid,
        ReviewModerationRequest request,
        CancellationToken cancellationToken) => await Service.ModerateBranchReview(type, uuid, request, cancellationToken);
}
