using api.Model;
using api.Model.Enum;

namespace api.Data.Seed;

public static class AccountSeed
{
    public static readonly Guid SystemAdminUuid =
        Guid.Parse("b5c30c02-2fcb-4ae5-99db-15debd3ab001");

    public const string SystemAdminPhone = "0900000000";

    public static IReadOnlyList<Account> Accounts { get; } =
    [
        new Account
        {
            Uuid = SystemAdminUuid,
            Phone = SystemAdminPhone,
            Password = "$2a$12$W1mt0UsXqdFWuoc0vT3lUuk1pPbK2HzmYhQCDWmH6bZGMmRvrfhkW",
            RoleUuid = Guid.Parse("ac448f86-bbf0-416f-95d0-8a32008880a8"),
            HospitalUuid = null,
            Status = BaseStatus.Active,
            CreatedAt = new DateTime(2026, 10, 13, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 10, 13, 0, 0, 0, DateTimeKind.Utc),
            DeletedAt = null
        }
    ];
}
