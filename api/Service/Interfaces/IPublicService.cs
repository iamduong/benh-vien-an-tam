using api.Contract.Public;

namespace api.Service.Interfaces;

public interface IPublicService
{
    Task<DepartmentResponse[]> GetDepartmentsAsync();
    Task<HospitalResponse[]> GetHospitalsAsync();
    Task<DoctorResponse[]> GetDoctorsAsync();
    Task<HospitalDetailResponse?> GetHospitalAsync(string identifier);
    Task<DoctorDetailResponse?> GetDoctorAsync(string identifier);
    Task<DepartmentDetailResponse?> GetDepartmentAsync(string identifier);
    Task<MedicalServiceDetailResponse?> GetMedicalServiceAsync(string identifier);
    Task<MedicalServicePublicResponse[]> GetMedicalServicesAsync();
    Task<PublicPagedResponse<HospitalResponse>> SearchHospitalsAsync(
        string? keyword, Guid? departmentUuid, int page, int pageSize);
    Task<PublicPagedResponse<DoctorResponse>> SearchDoctorsAsync(
        string? keyword, Guid? hospitalUuid, Guid? departmentUuid, int page, int pageSize);
    Task<PublicPagedResponse<MedicalServicePublicResponse>> SearchMedicalServicesAsync(
        string? keyword, Guid? hospitalUuid, int page, int pageSize);
}
