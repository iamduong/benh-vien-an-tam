namespace api.Contract.Public;

public class MedicalServicePublicResponse
{
    public Guid Uuid { get; set; }
    public string Image { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string DetailService { get; set; } = string.Empty;
    public string WorkingHour { get; set; } = string.Empty;
    public bool IsInsured { get; set; }
    public int InsuranceCap { get; set; }
}

public class PublicReviewResponse
{
    public Guid Uuid { get; set; }
    public string Content { get; set; } = string.Empty;
    public int NumberOfStar { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class HospitalDetailResponse
{
    public HospitalResponse Hospital { get; set; } = new();
    public DepartmentResponse[] Departments { get; set; } = [];
    public MedicalServicePublicResponse[] MedicalServices { get; set; } = [];
    public PublicReviewResponse[] Reviews { get; set; } = [];
}

public class DoctorDetailResponse
{
    public DoctorResponse Doctor { get; set; } = new();
    public DepartmentResponse[] Departments { get; set; } = [];
    public HospitalResponse Hospital { get; set; } = new();
    public PublicReviewResponse[] Reviews { get; set; } = [];
}

public class DepartmentDetailResponse
{
    public DepartmentResponse Department { get; set; } = new();
    public HospitalResponse[] Hospitals { get; set; } = [];
    public DoctorResponse[] Doctors { get; set; } = [];
}

public class MedicalServiceDetailResponse
{
    public MedicalServicePublicResponse MedicalService { get; set; } = new();
    public HospitalResponse[] Hospitals { get; set; } = [];
    public PublicReviewResponse[] Reviews { get; set; } = [];
}
