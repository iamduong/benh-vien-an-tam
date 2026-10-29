using System.Text.Json.Serialization;
using api.Model.Enum;

namespace api.Contract.Auth;

public sealed record RegisterResult(
    Guid? AccountUuid,
    Guid? PatientProfileUuid,
    string? Email
);

public sealed record LoginResult(
    AuthSessionResult Session,
    DateTimeOffset IssuedAt,
    DateTimeOffset AccessExpiresAt,
    DateTimeOffset RefreshExpiresAt,
    string AccessToken,
    string RefreshToken
);

public sealed record AuthSessionResult(
    AuthAccountResult Account,
    AuthProfileResult Profile,
    AuthRoleResult? Role
);

public sealed record AuthRoleResult(
    Guid Uuid,
    string Name,
    bool IsDoctor,
    AccessScope Scope
);

public sealed record AuthAccountResult(
    Guid Uuid,
    string Phone,
    Guid? RoleUuid,
    BaseStatus Status,
    Guid? HospitalUuid,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? DeletedAt
);

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(AuthPatientProfileResult), "patient")]
[JsonDerivedType(typeof(AuthDoctorProfileResult), "doctor")]
[JsonDerivedType(typeof(AuthStaffProfileResult), "staff")]
public abstract record AuthProfileResult;

public sealed record AuthStaffProfileResult(
    Guid AccountUuid
) : AuthProfileResult;

public sealed record AuthPatientProfileResult(
    Guid Uuid,
    Guid AccountUuid,
    string Avatar,
    string Name,
    Gender Gender,
    DateTime Birthdate,
    string MedicalCode,
    string Email
) : AuthProfileResult;

public sealed record AuthDoctorProfileResult(
    Guid Uuid,
    Guid AccountUuid,
    string Avatar,
    string Slug,
    string Name,
    int Price,
    string DepartmentDisplay,
    string Introduction,
    string Expertise,
    string Specialty,
    string Workplace,
    bool IsFeatured,
    Guid? HospitalUuid,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? DeletedAt
) : AuthProfileResult;
