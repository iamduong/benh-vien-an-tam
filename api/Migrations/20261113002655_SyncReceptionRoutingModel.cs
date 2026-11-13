using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SyncReceptionRoutingModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.DropIndex(
                name: "IX_DoctorWorking_DoctorUuid",
                table: "DoctorWorking");

            migrationBuilder.DropIndex(
                name: "IX_DoctorWorking_RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorking_DoctorUuid_WorkingUuid",
                table: "DoctorWorking",
                columns: new[] { "DoctorUuid", "WorkingUuid" },
                unique: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking");

            migrationBuilder.DropIndex(
                name: "IX_DoctorWorking_DoctorUuid_WorkingUuid",
                table: "DoctorWorking");

            migrationBuilder.DropIndex(
                name: "IX_DoctorWorking_RoomUuid_WorkingUuid",
                table: "DoctorWorking");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorking_DoctorUuid",
                table: "DoctorWorking",
                column: "DoctorUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorking_RoomUuid",
                table: "DoctorWorking",
                column: "RoomUuid");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorWorking_Room_RoomUuid",
                table: "DoctorWorking",
                column: "RoomUuid",
                principalTable: "Room",
                principalColumn: "Uuid");
        }
    }
}
