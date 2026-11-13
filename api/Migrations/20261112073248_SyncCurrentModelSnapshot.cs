using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SyncCurrentModelSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("0dce1f69-eed9-bb28-c23c-dfbf34f15c99"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("341f06d0-d1eb-329e-52ed-dcbda9bf2215"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("546d20ee-a24e-be8d-88fd-43d93651424d"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("54a616d1-9e03-4641-44d3-ac65f1d2e4af"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("69af6b0d-06cc-0add-d194-c9e39e91c311"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("6b0958b3-d33e-59c8-3496-046154074229"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("894b5451-a6ca-a946-f9b7-ef06735ae9fc"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("b977f04e-c741-f7a1-a49f-6dfba8a0b406"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("c575151a-e46c-caa4-a3ec-a26ad5fbaef3"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("dd913a3d-9a64-147a-4daa-59c51d5f1796"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("fc8e67e5-9f48-63d2-8ff1-58539da9d9a2"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("ff63c159-04f7-11db-1082-1d6f36058925"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"));

            migrationBuilder.AlterColumn<Guid>(
                name: "WorkingUuid",
                table: "DoctorWorking",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DoctorUuid",
                table: "DoctorWorking",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RoomUuid",
                table: "DoctorWorking",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DoctorWorkSubmission",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorWorkingHourUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    PreviousWorkingHourUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    RequestedWorkingHourUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ReviewNote = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    ReviewedByAccountUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorWorkSubmission", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_DoctorWorkSubmission_Account_ReviewedByAccountUuid",
                        column: x => x.ReviewedByAccountUuid,
                        principalTable: "Account",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorWorkSubmission_DoctorProfile_DoctorUuid",
                        column: x => x.DoctorUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorWorkSubmission_DoctorWorking_DoctorWorkingHourUuid",
                        column: x => x.DoctorWorkingHourUuid,
                        principalTable: "DoctorWorking",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DoctorWorkSubmission_TimeWorking_PreviousWorkingHourUuid",
                        column: x => x.PreviousWorkingHourUuid,
                        principalTable: "TimeWorking",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorWorkSubmission_TimeWorking_RequestedWorkingHourUuid",
                        column: x => x.RequestedWorkingHourUuid,
                        principalTable: "TimeWorking",
                        principalColumn: "Uuid");
                });

            migrationBuilder.UpdateData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"),
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Nhập hàng", "nhap-hang" });

            migrationBuilder.InsertData(
                table: "Permission",
                columns: new[] { "Uuid", "Description", "Icon", "Name", "Scope", "Slug" },
                values: new object[] { new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), "Kho thuốc", "ticket", "Xuất hàng", 1, "xuat-hang" });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "Uuid", "Action", "PermissionUuid", "RoleUuid" },
                values: new object[,]
                {
                    { new Guid("1c70972e-e680-aeb0-80e0-efe661e79063"), 1, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("88e6a082-db09-429d-b348-a7b06323a40f"), 0, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("b8b04a78-ba6e-4b54-675c-719eee90e89b"), 3, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("fac04d32-d18e-e1c6-a771-67c2087efc08"), 2, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorking_RoomUuid",
                table: "DoctorWorking",
                column: "RoomUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkSubmission_DoctorUuid_Status",
                table: "DoctorWorkSubmission",
                columns: new[] { "DoctorUuid", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkSubmission_DoctorWorkingHourUuid",
                table: "DoctorWorkSubmission",
                column: "DoctorWorkingHourUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkSubmission_PreviousWorkingHourUuid",
                table: "DoctorWorkSubmission",
                column: "PreviousWorkingHourUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkSubmission_RequestedWorkingHourUuid",
                table: "DoctorWorkSubmission",
                column: "RequestedWorkingHourUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkSubmission_ReviewedByAccountUuid",
                table: "DoctorWorkSubmission",
                column: "ReviewedByAccountUuid");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking",
                column: "RoomUuid",
                principalTable: "Room",
                principalColumn: "Uuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.DropTable(
                name: "DoctorWorkSubmission");

            migrationBuilder.DropIndex(
                name: "IX_DoctorWorking_RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("1c70972e-e680-aeb0-80e0-efe661e79063"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("88e6a082-db09-429d-b348-a7b06323a40f"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("b8b04a78-ba6e-4b54-675c-719eee90e89b"));

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumn: "Uuid",
                keyValue: new Guid("fac04d32-d18e-e1c6-a771-67c2087efc08"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"));

            migrationBuilder.DropColumn(
                name: "RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.AlterColumn<Guid>(
                name: "WorkingUuid",
                table: "DoctorWorking",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "DoctorUuid",
                table: "DoctorWorking",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.UpdateData(
                table: "Permission",
                keyColumn: "Uuid",
                keyValue: new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"),
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Phiếu nhập xuất", "phieu-nhap-xuat" });

            migrationBuilder.InsertData(
                table: "Permission",
                columns: new[] { "Uuid", "Description", "Icon", "Name", "Scope", "Slug" },
                values: new object[,]
                {
                    { new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), "Kho thuốc", "medicine", "Điều chỉnh tồn", 1, "dieu-chinh-ton" },
                    { new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), "Kho thuốc", "history", "Lịch sử kho", 1, "lich-su" },
                    { new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), "Tiếp nhận và điều phối", "appointment", "Lịch hẹn", 1, "lich-hen-tiep-nhan" }
                });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "Uuid", "Action", "PermissionUuid", "RoleUuid" },
                values: new object[,]
                {
                    { new Guid("0dce1f69-eed9-bb28-c23c-dfbf34f15c99"), 1, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("341f06d0-d1eb-329e-52ed-dcbda9bf2215"), 0, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("546d20ee-a24e-be8d-88fd-43d93651424d"), 3, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("54a616d1-9e03-4641-44d3-ac65f1d2e4af"), 2, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("69af6b0d-06cc-0add-d194-c9e39e91c311"), 0, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("6b0958b3-d33e-59c8-3496-046154074229"), 3, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("894b5451-a6ca-a946-f9b7-ef06735ae9fc"), 1, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("b977f04e-c741-f7a1-a49f-6dfba8a0b406"), 1, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("c575151a-e46c-caa4-a3ec-a26ad5fbaef3"), 3, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("dd913a3d-9a64-147a-4daa-59c51d5f1796"), 0, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("fc8e67e5-9f48-63d2-8ff1-58539da9d9a2"), 2, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("ff63c159-04f7-11db-1082-1d6f36058925"), 2, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") }
                });
        }
    }
}
