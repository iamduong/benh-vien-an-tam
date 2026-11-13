using api.Lib;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace api.Migrations;

[DbContext(typeof(DBContext))]
[Migration("20261112080000_AddDoctorWorkingRoom")]
public sealed class AddDoctorWorkingRoom : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DELETE FROM \"RolePermission\" WHERE \"PermissionUuid\" = 'e8adca19-51ca-4815-809b-20eab76e1d20';");
        migrationBuilder.Sql("DELETE FROM \"Permission\" WHERE \"Uuid\" = 'e8adca19-51ca-4815-809b-20eab76e1d20';");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Cột RoomUuid thuộc migration SyncCurrentModelSnapshot.
    }
}
