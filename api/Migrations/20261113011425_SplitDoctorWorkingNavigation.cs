using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SplitDoctorWorkingNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"),
                column: "Name",
                value: "Giờ làm việc bác sĩ");

            migrationBuilder.InsertData(
                table: "Permission",
                columns: new[] { "Uuid", "Description", "Icon", "Name", "Scope", "Slug" },
                values: new object[] { new Guid("2b534faa-295c-4639-8ae4-5e9aec6c1f8a"), "Khám chữa bệnh", "audit", "Thay đổi giờ làm việc", 1, "thay-doi-gio-lam-viec" });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "Uuid", "Action", "PermissionUuid", "RoleUuid" },
                values: new object[,]
                {
                    { new Guid("6c33bc7c-b8f8-d9a6-559c-b41c45d6ff85"), 1, new Guid("2b534faa-295c-4639-8ae4-5e9aec6c1f8a"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("a807547a-7365-e549-eaa1-8664de3250b7"), 0, new Guid("2b534faa-295c-4639-8ae4-5e9aec6c1f8a"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("b6a39b74-2f38-9ef5-283d-ae9fb2eca56b"), 2, new Guid("2b534faa-295c-4639-8ae4-5e9aec6c1f8a"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("c98058c3-2958-dd09-3949-5a0bd8fd4b17"), 3, new Guid("2b534faa-295c-4639-8ae4-5e9aec6c1f8a"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("6c33bc7c-b8f8-d9a6-559c-b41c45d6ff85"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("a807547a-7365-e549-eaa1-8664de3250b7"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("b6a39b74-2f38-9ef5-283d-ae9fb2eca56b"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("c98058c3-2958-dd09-3949-5a0bd8fd4b17"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("2b534faa-295c-4639-8ae4-5e9aec6c1f8a"));

            migrationBuilder.UpdateData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"),
                column: "Name",
                value: "Giờ làm việc");
        }
    }
}
