using System.Security.Claims;
using api.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace api.Lib;

public class RequirePermissionAttribute(string permission): Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        Console.WriteLine("Require permission: ", permission);

        var account = context.HttpContext.User;

        if (account.Identity?.IsAuthenticated != true)
        {
            context.Result = ApiResponse<Object>.Unauthorized();
            return;
        }

        if (!account.HasClaim("permission", permission))
        {
            context.Result = ApiResponse<Object>.Forbidden();
        }
    }
}

public static class CurrentSessionExtension
{
    public static Guid? GetAccountUuid(this ClaimsPrincipal principal)
    {
        return Guid.TryParse(principal.FindFirstValue("uuid"), out var uuid) ? uuid : null;
    }

    public static Guid? GetHospitalUuid(this ClaimsPrincipal principal)
    {
        return Guid.TryParse(principal.FindFirstValue("hospital_uuid"), out var uuid) ? uuid : null;
    }
}