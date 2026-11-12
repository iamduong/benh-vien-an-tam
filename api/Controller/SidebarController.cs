using System.Security.Claims;
using api.Contract;
using api.Contract.Sidebar;
using api.Model.Enum;
using Microsoft.AspNetCore.Mvc;

using api.Service;
namespace api.Controller;

[ApiController]
[Route("api/sidebar")]
public sealed class SidebarController(SidebarService service) : ControllerBase
{
    private SidebarService Service
    {
        get
        {
            service.ControllerContext = ControllerContext;
            return service;
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetSidebar(CancellationToken cancellationToken) => await Service.GetSidebar(cancellationToken);
}
