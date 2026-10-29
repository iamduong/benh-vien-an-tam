using api.Contract;
using api.Contract.Public;
using api.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("/api/public")]
public class PublicController(IPublicService service) : ControllerBase
{
    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartmentsAsync()
    {
        var result = await service.GetDepartmentsAsync();
        
        return ApiResponse<DepartmentResponse[]>.RequestSuccess(result);
    }

    [HttpGet("hospitals")]  
    public async Task<IActionResult> GetHospitalsAsync()
    {
        var result = await service.GetHospitalsAsync();
        
        return ApiResponse<HospitalResponse[]>.RequestSuccess(result);
    }

    [HttpGet("doctors")]
    public async Task<IActionResult> GetDoctorsAsync()
    {
        var result = await service.GetDoctorsAsync();
        return ApiResponse<DoctorResponse[]>.RequestSuccess(result);  
    }

    [HttpGet("medical-services")]
    public async Task<IActionResult> GetMedicalServicesAsync()
    {
        var result = await service.GetMedicalServicesAsync();
        return ApiResponse<MedicalServicePublicResponse[]>.RequestSuccess(result);
    }

    [HttpGet("hospitals/search")]
    public async Task<IActionResult> SearchHospitalsAsync(
        [FromQuery] string? q = null,
        [FromQuery] Guid? department = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 8)
    {
        var result = await service.SearchHospitalsAsync(q, department, page, pageSize);
        return ApiResponse<PublicPagedResponse<HospitalResponse>>.RequestSuccess(result);
    }

    [HttpGet("doctors/search")]
    public async Task<IActionResult> SearchDoctorsAsync(
        [FromQuery] string? q = null,
        [FromQuery] Guid? hospital = null,
        [FromQuery] Guid? department = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 8)
    {
        var result = await service.SearchDoctorsAsync(q, hospital, department, page, pageSize);
        return ApiResponse<PublicPagedResponse<DoctorResponse>>.RequestSuccess(result);
    }

    [HttpGet("medical-services/search")]
    public async Task<IActionResult> SearchMedicalServicesAsync(
        [FromQuery] string? q = null,
        [FromQuery] Guid? hospital = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 8)
    {
        var result = await service.SearchMedicalServicesAsync(q, hospital, page, pageSize);
        return ApiResponse<PublicPagedResponse<MedicalServicePublicResponse>>.RequestSuccess(result);
    }

    [HttpGet("hospitals/{identifier}")]
    public async Task<IActionResult> GetHospitalAsync(string identifier)
    {
        var result = await service.GetHospitalAsync(identifier);
        return result is null
            ? ApiResponse<HospitalDetailResponse>.NotFound("Không tìm thấy cơ sở y tế.")
            : ApiResponse<HospitalDetailResponse>.RequestSuccess(result);
    }

    [HttpGet("doctors/{identifier}")]
    public async Task<IActionResult> GetDoctorAsync(string identifier)
    {
        var result = await service.GetDoctorAsync(identifier);
        return result is null
            ? ApiResponse<DoctorDetailResponse>.NotFound("Không tìm thấy bác sĩ.")
            : ApiResponse<DoctorDetailResponse>.RequestSuccess(result);
    }

    [HttpGet("departments/{identifier}")]
    public async Task<IActionResult> GetDepartmentAsync(string identifier)
    {
        var result = await service.GetDepartmentAsync(identifier);
        return result is null
            ? ApiResponse<DepartmentDetailResponse>.NotFound("Không tìm thấy chuyên khoa.")
            : ApiResponse<DepartmentDetailResponse>.RequestSuccess(result);
    }

    [HttpGet("medical-services/{identifier}")]
    public async Task<IActionResult> GetMedicalServiceAsync(string identifier)
    {
        var result = await service.GetMedicalServiceAsync(identifier);
        return result is null
            ? ApiResponse<MedicalServiceDetailResponse>.NotFound("Không tìm thấy dịch vụ y tế.")
            : ApiResponse<MedicalServiceDetailResponse>.RequestSuccess(result);
    }
}
