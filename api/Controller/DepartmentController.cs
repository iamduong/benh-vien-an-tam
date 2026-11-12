using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Contract.Department;
using api.Model.Enum;
using api.Service;

namespace api.Controller;

[ApiController]
[Route("api/departments")]
public sealed class DepartmentController(DepartmentService departmentService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDepartments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] BaseStatus? status = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var result = await departmentService.GetDepartmentsAsync(page, pageSize, status, search, cancellationToken);
        return Ok(new { message = "Fetched successfully", data = result.Items, pagination = new { page = result.PageIndex, result.PageSize, totalCount = result.TotalItems, result.TotalPages } });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDepartment(Guid id, CancellationToken cancellationToken = default)
    {
        var department = await departmentService.GetActiveDepartmentAsync(id, cancellationToken);
        if (department is null)
            return NotFound(new { message = "Department not found", error = "Resource does not exist" });
        return Ok(new { message = "Fetched successfully", data = department });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateDepartment(
        CreateDepartmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var response = await departmentService.CreateDepartmentAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, new { message = "Created successfully", data = response });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateDepartment(
        Guid id,
        UpdateDepartmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var department = await departmentService.UpdateDepartmentAsync(id, request, cancellationToken);
        if (department is null)
            return NotFound(new { message = "Department not found", error = "Resource does not exist" });
        return Ok(new { message = "Updated successfully", data = department });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteDepartment(Guid id, CancellationToken cancellationToken = default)
    {
        if (!await departmentService.DeleteDepartmentAsync(id, cancellationToken))
            return NotFound(new { message = "Department not found", error = "Resource does not exist" });
        return NoContent();
    }
}
