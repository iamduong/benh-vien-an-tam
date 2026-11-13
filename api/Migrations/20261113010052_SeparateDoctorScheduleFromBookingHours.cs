using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SeparateDoctorScheduleFromBookingHours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.DropForeignKey(
                name: "FK_DoctorWorkSubmission_DoctorWorking_DoctorWorkingHourUuid",
                table: "DoctorWorkSubmission");

            migrationBuilder.DropIndex(
                name: "IX_DoctorWorking_RoomUuid_WorkingUuid",
                table: "DoctorWorking");

            migrationBuilder.DropColumn(
                name: "RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.RenameColumn(
                name: "DoctorWorkingHourUuid",
                table: "DoctorWorkSubmission",
                newName: "DoctorScheduleUuid");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorWorkSubmission_DoctorWorkingHourUuid",
                table: "DoctorWorkSubmission",
                newName: "IX_DoctorWorkSubmission_DoctorScheduleUuid");

            migrationBuilder.CreateTable(
                name: "DoctorSchedule",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkingHourUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    RoomUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorSchedule", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_DoctorSchedule_DoctorProfile_DoctorUuid",
                        column: x => x.DoctorUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorSchedule_Room_RoomUuid",
                        column: x => x.RoomUuid,
                        principalTable: "Room",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DoctorSchedule_TimeWorking_WorkingHourUuid",
                        column: x => x.WorkingHourUuid,
                        principalTable: "TimeWorking",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedule_DoctorUuid_WorkingHourUuid",
                table: "DoctorSchedule",
                columns: new[] { "DoctorUuid", "WorkingHourUuid" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedule_RoomUuid_WorkingHourUuid",
                table: "DoctorSchedule",
                columns: new[] { "RoomUuid", "WorkingHourUuid" },
                unique: true,
                filter: "\"RoomUuid\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedule_WorkingHourUuid",
                table: "DoctorSchedule",
                column: "WorkingHourUuid");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorWorkSubmission_DoctorSchedule_DoctorScheduleUuid",
                table: "DoctorWorkSubmission",
                column: "DoctorScheduleUuid",
                principalTable: "DoctorSchedule",
                principalColumn: "Uuid",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorWorkSubmission_DoctorSchedule_DoctorScheduleUuid",
                table: "DoctorWorkSubmission");

            migrationBuilder.DropTable(
                name: "DoctorSchedule");

            migrationBuilder.RenameColumn(
                name: "DoctorScheduleUuid",
                table: "DoctorWorkSubmission",
                newName: "DoctorWorkingHourUuid");

            migrationBuilder.RenameIndex(
                name: "IX_DoctorWorkSubmission_DoctorScheduleUuid",
                table: "DoctorWorkSubmission",
                newName: "IX_DoctorWorkSubmission_DoctorWorkingHourUuid");

            migrationBuilder.AddColumn<Guid>(
                name: "RoomUuid",
                table: "DoctorWorking",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorking_RoomUuid_WorkingUuid",
                table: "DoctorWorking",
                columns: new[] { "RoomUuid", "WorkingUuid" },
                unique: true,
                filter: "\"RoomUuid\" IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking",
                column: "RoomUuid",
                principalTable: "Room",
                principalColumn: "Uuid",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorWorkSubmission_DoctorWorking_DoctorWorkingHourUuid",
                table: "DoctorWorkSubmission",
                column: "DoctorWorkingHourUuid",
                principalTable: "DoctorWorking",
                principalColumn: "Uuid",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
