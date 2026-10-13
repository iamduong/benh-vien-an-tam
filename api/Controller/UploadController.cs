using api.Contract;
using api.Lib;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("/api/upload")]
public sealed class UploadController(Cloud cloud) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadAsync([FromForm] IFormFile file)
    {
        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(file.Name, stream)
        };

        var uploadResult = cloud.cloudinary.Upload(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new AppException(message: "Upload failed");
        }

        return ApiResponse<UploadResult>.RequestSuccess(uploadResult);
    }
}