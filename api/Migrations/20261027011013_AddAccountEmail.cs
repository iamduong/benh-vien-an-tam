using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Account",
                type: "character varying(254)",
                maxLength: 254,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                """
                UPDATE "Account" AS account
                SET "Email" = profile."Email"
                FROM "PatientProfile" AS profile
                WHERE profile."AccountUuid" = account."Uuid";
                """);

            migrationBuilder.UpdateData(
                table: "Account",
                keyColumn: "Uuid",
                keyValue: new Guid("b5c30c02-2fcb-4ae5-99db-15debd3ab001"),
                column: "Email",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Account");
        }
    }
}
