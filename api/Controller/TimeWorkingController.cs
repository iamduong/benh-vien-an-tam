using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Contract.TimeWorking;
using api.Model.Enum;
using api.Service;

namespace api.Controller;

[ApiController]
[Route("api/time-workings")]
public sealed class TimeWorkingController(TimeWorkingService timeWorkingService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetTimeWorkings(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] int? dayOfWeek = null,
        [FromQuery] BaseStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        var result = await timeWorkingService.GetTimeWorkingsAsync(page, pageSize, dayOfWeek, status, cancellationToken);
        return Ok(new { message = "Fetched successfully", data = result.Items, pagination = new { page = result.PageIndex, result.PageSize, totalCount = result.TotalItems, result.TotalPages } });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateTimeWorking(
        CreateTimeWorkingRequest request,
        CancellationToken cancellationToken = default)
    {
        var response = await timeWorkingService.CreateTimeWorkingAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, new { message = "Created successfully", data = response });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateTimeWorking(
        Guid id,
        UpdateTimeWorkingRequest request,
        CancellationToken cancellationToken = default)
    {
        var timeWorking = await timeWorkingService.UpdateTimeWorkingAsync(id, request, cancellationToken);
        if (timeWorking is null)
            return NotFound(new { message = "Time working not found", error = "Resource does not exist" });
        return Ok(new { message = "Updated successfully", data = timeWorking });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTimeWorking(Guid id, CancellationToken cancellationToken = default)
    {
        if (!await timeWorkingService.DeleteTimeWorkingAsync(id, cancellationToken))
            return NotFound(new { message = "Time working not found", error = "Resource does not exist" });
        return NoContent();
    }
}
