using api.Contract;
using api.Data.Template;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("api/icon-templates")]
public sealed class IconTemplateController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() =>
        ApiResponse<IReadOnlyList<string>>.RequestSuccess(
            IconTemplate.Items,
            "Lay danh sach mau bieu tuong thanh cong");
}
