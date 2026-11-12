using api.Contract.Patient;
using api.Lib;
using api.Model;
using api.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace api.Service;

public sealed class PatientService(DBContext dbContext)
{
    public async Task<PatientProfileView?> GetCurrentAsync(Guid accountUuid, CancellationToken cancellationToken)
    {
        var account = await dbContext.Accounts.AsNoTracking().FirstOrDefaultAsync(item =>
            item.Uuid == accountUuid && item.DeletedAt == null && item.Status == BaseStatus.Active, cancellationToken);
        var profile = await dbContext.PatientProfiles.AsNoTracking().FirstOrDefaultAsync(item =>
            item.AccountUuid == accountUuid, cancellationToken);
        return account is null || profile is null ? null : new PatientProfileView(profile, account.Phone);
    }

    public async Task<PatientUpdateResult> UpdateCurrentAsync(Guid accountUuid, UpdateCurrentPatientRequest request, CancellationToken cancellationToken)
    {
        var account = await dbContext.Accounts.FirstOrDefaultAsync(item =>
            item.Uuid == accountUuid && item.DeletedAt == null && item.Status == BaseStatus.Active, cancellationToken);
        var profile = await dbContext.PatientProfiles.FirstOrDefaultAsync(item =>
            item.AccountUuid == accountUuid, cancellationToken);
        if (account is null || profile is null) return PatientUpdateResult.NotFound();

        var errors = new Dictionary<string, string>();
        var email = request.Email.Trim().ToLowerInvariant();
        if (request.Birthdate.Date >= DateTime.UtcNow.Date)
            errors["birthdate"] = "Ngày sinh phải trước ngày hiện tại.";
        if (await dbContext.PatientProfiles.AsNoTracking().AnyAsync(item =>
            item.Uuid != profile.Uuid && item.Email.ToLower() == email, cancellationToken))
            errors["email"] = "Email đã được sử dụng.";
        if (errors.Count > 0) return PatientUpdateResult.Invalid(errors);

        profile.Avatar = request.Avatar.Trim();
        profile.Name = request.Name.Trim();
        profile.Gender = request.Gender;
        profile.Birthdate = request.Birthdate.ToUniversalTime();
        profile.Email = email;
        account.Email = email;
        account.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return PatientUpdateResult.Success(new PatientProfileView(profile, account.Phone));
    }
}

public sealed record PatientProfileView(PatientProfile Profile, string Phone);

public sealed record PatientUpdateResult(PatientProfileView? View, IReadOnlyDictionary<string, string> Errors, bool WasFound)
{
    public static PatientUpdateResult Success(PatientProfileView view) => new(view, new Dictionary<string, string>(), true);
    public static PatientUpdateResult Invalid(IReadOnlyDictionary<string, string> errors) => new(null, errors, true);
    public static PatientUpdateResult NotFound() => new(null, new Dictionary<string, string>(), false);
}
