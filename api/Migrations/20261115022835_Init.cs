using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "Hospital",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: false),
                    MapUrl = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    NumberOfRoom = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DetailService = table.Column<string>(type: "text", nullable: false),
                    WorkingHour = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospital", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "MedicalService",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DetailService = table.Column<string>(type: "text", nullable: false),
                    WorkingHour = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsInsured = table.Column<bool>(type: "boolean", nullable: false),
                    InsuranceCap = table.Column<int>(type: "integer", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalService", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "Medicine",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Unit = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsInsured = table.Column<bool>(type: "boolean", nullable: false),
                    InsuranceCap = table.Column<float>(type: "real", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicine", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Scope = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "Provider",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Hotline = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provider", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsDoctor = table.Column<bool>(type: "boolean", nullable: false),
                    Scope = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "TimeWorking",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeWorking", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "HospitalDepartment",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DepartmentUuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HospitalDepartment", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_HospitalDepartment_Department_DepartmentUuid",
                        column: x => x.DepartmentUuid,
                        principalTable: "Department",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_HospitalDepartment_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "Room",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Room", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_Room_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "HospitalMedicalService",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicalServiceUuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HospitalMedicalService", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_HospitalMedicalService_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_HospitalMedicalService_MedicalService_MedicalServiceUuid",
                        column: x => x.MedicalServiceUuid,
                        principalTable: "MedicalService",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "MedicineInventory",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicineUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    MinimumQuantity = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicineInventory", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_MedicineInventory_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_MedicineInventory_Medicine_MedicineUuid",
                        column: x => x.MedicineUuid,
                        principalTable: "Medicine",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    Password = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    RoleUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_Account_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Account_Role_RoleUuid",
                        column: x => x.RoleUuid,
                        principalTable: "Role",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "RolePermission",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    PermissionUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Action = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermission", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_RolePermission_Permission_PermissionUuid",
                        column: x => x.PermissionUuid,
                        principalTable: "Permission",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_RolePermission_Role_RoleUuid",
                        column: x => x.RoleUuid,
                        principalTable: "Role",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "HospitalWorking",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    WorkingUuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HospitalWorking", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_HospitalWorking_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_HospitalWorking_TimeWorking_WorkingUuid",
                        column: x => x.WorkingUuid,
                        principalTable: "TimeWorking",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "DoctorProfile",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    AccountUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Avatar = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DepartmentDisplay = table.Column<string>(type: "text", nullable: false),
                    Introduction = table.Column<string>(type: "text", nullable: false),
                    Expertise = table.Column<string>(type: "text", nullable: false),
                    Specialty = table.Column<string>(type: "text", nullable: false),
                    Workplace = table.Column<string>(type: "text", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorProfile", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_DoctorProfile_Account_AccountUuid",
                        column: x => x.AccountUuid,
                        principalTable: "Account",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorProfile_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "ExportTicket",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    AccountUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExportTicket", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ExportTicket_Account_AccountUuid",
                        column: x => x.AccountUuid,
                        principalTable: "Account",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ExportTicket_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "ImportTicket",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    AccountUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    ProviderUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportTicket", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ImportTicket_Account_AccountUuid",
                        column: x => x.AccountUuid,
                        principalTable: "Account",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ImportTicket_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ImportTicket_Provider_ProviderUuid",
                        column: x => x.ProviderUuid,
                        principalTable: "Provider",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "PatientProfile",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    AccountUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Avatar = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    Birthdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MedicalCode = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientProfile", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_PatientProfile_Account_AccountUuid",
                        column: x => x.AccountUuid,
                        principalTable: "Account",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "DoctorDepartment",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DepartmentUuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorDepartment", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_DoctorDepartment_Department_DepartmentUuid",
                        column: x => x.DepartmentUuid,
                        principalTable: "Department",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorDepartment_DoctorProfile_DoctorUuid",
                        column: x => x.DoctorUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "DoctorSchedule",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: false),
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
                });

            migrationBuilder.CreateTable(
                name: "ExportTicketDetail",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    ExportTicketUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicineUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExportTicketDetail", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ExportTicketDetail_ExportTicket_ExportTicketUuid",
                        column: x => x.ExportTicketUuid,
                        principalTable: "ExportTicket",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ExportTicketDetail_Medicine_MedicineUuid",
                        column: x => x.MedicineUuid,
                        principalTable: "Medicine",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "ImportTicketDetail",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    ImportTicketUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicineUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportTicketDetail", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ImportTicketDetail_ImportTicket_ImportTicketUuid",
                        column: x => x.ImportTicketUuid,
                        principalTable: "ImportTicket",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ImportTicketDetail_Medicine_MedicineUuid",
                        column: x => x.MedicineUuid,
                        principalTable: "Medicine",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientName = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<int>(type: "integer", nullable: false),
                    MedicalCode = table.Column<string>(type: "text", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: false),
                    AppointmentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeSlot = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PatientUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    RoomUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DoctorNote = table.Column<string>(type: "text", nullable: false),
                    TotalPrice = table.Column<int>(type: "integer", nullable: false),
                    IsPaid = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointment", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_Appointment_DoctorProfile_DoctorUuid",
                        column: x => x.DoctorUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Appointment_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Appointment_PatientProfile_PatientUuid",
                        column: x => x.PatientUuid,
                        principalTable: "PatientProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Appointment_Room_RoomUuid",
                        column: x => x.RoomUuid,
                        principalTable: "Room",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Appointment_TimeWorking_TimeSlot",
                        column: x => x.TimeSlot,
                        principalTable: "TimeWorking",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "ReviewDoctor",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    NumberOfStar = table.Column<int>(type: "integer", nullable: false),
                    PatientUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsViewed = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewDoctor", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ReviewDoctor_DoctorProfile_DoctorUuid",
                        column: x => x.DoctorUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ReviewDoctor_PatientProfile_PatientUuid",
                        column: x => x.PatientUuid,
                        principalTable: "PatientProfile",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "ReviewHospital",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    NumberOfStar = table.Column<int>(type: "integer", nullable: false),
                    PatientUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsViewed = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewHospital", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ReviewHospital_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ReviewHospital_PatientProfile_PatientUuid",
                        column: x => x.PatientUuid,
                        principalTable: "PatientProfile",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "ReviewMedicalService",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    NumberOfStar = table.Column<int>(type: "integer", nullable: false),
                    PatientUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicalServiceUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsViewed = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewMedicalService", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ReviewMedicalService_MedicalService_MedicalServiceUuid",
                        column: x => x.MedicalServiceUuid,
                        principalTable: "MedicalService",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ReviewMedicalService_PatientProfile_PatientUuid",
                        column: x => x.PatientUuid,
                        principalTable: "PatientProfile",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "DoctorWorkingHour",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorScheduleUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkingHourUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    RoomUuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorWorkingHour", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_DoctorWorkingHour_DoctorSchedule_DoctorScheduleUuid",
                        column: x => x.DoctorScheduleUuid,
                        principalTable: "DoctorSchedule",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorWorkingHour_Room_RoomUuid",
                        column: x => x.RoomUuid,
                        principalTable: "Room",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorWorkingHour_TimeWorking_WorkingHourUuid",
                        column: x => x.WorkingHourUuid,
                        principalTable: "TimeWorking",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "AppointmentMedicalService",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    AppointmentUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicalServiceUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentMedicalService", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_AppointmentMedicalService_Appointment_AppointmentUuid",
                        column: x => x.AppointmentUuid,
                        principalTable: "Appointment",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_AppointmentMedicalService_MedicalService_MedicalServiceUuid",
                        column: x => x.MedicalServiceUuid,
                        principalTable: "MedicalService",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "Prescription",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    PatientProfileUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DoctorProfileUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: false),
                    AppointmentUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescription", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_Prescription_Appointment_AppointmentUuid",
                        column: x => x.AppointmentUuid,
                        principalTable: "Appointment",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Prescription_DoctorProfile_DoctorProfileUuid",
                        column: x => x.DoctorProfileUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Prescription_Hospital_HospitalUuid",
                        column: x => x.HospitalUuid,
                        principalTable: "Hospital",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_Prescription_PatientProfile_PatientProfileUuid",
                        column: x => x.PatientProfileUuid,
                        principalTable: "PatientProfile",
                        principalColumn: "Uuid");
                });

            migrationBuilder.CreateTable(
                name: "PrescriptionDetail",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    PrescriptionUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicineUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    QuantityPerDose = table.Column<int>(type: "integer", nullable: false),
                    DosesPerDay = table.Column<int>(type: "integer", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    IsExternal = table.Column<bool>(type: "boolean", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionDetail", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_PrescriptionDetail_Medicine_MedicineUuid",
                        column: x => x.MedicineUuid,
                        principalTable: "Medicine",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_PrescriptionDetail_Prescription_PrescriptionUuid",
                        column: x => x.PrescriptionUuid,
                        principalTable: "Prescription",
                        principalColumn: "Uuid");
                });

            migrationBuilder.InsertData(
                table: "Department",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Description", "Icon", "Name", "Slug", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("044d982b-f38c-4256-8dc8-a8609fea49eb"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chẩn đoán và điều trị bệnh lý thực quản, dạ dày, ruột, gan, mật và tụy.", "/images/departments/internal-medicine.svg", "Tiêu hóa", "tieu-hoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("275f8f9c-a2f3-4367-b4ac-605a38b61a92"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Tầm soát và điều trị bệnh lý tim, mạch máu, tăng huyết áp và rối loạn nhịp.", "/images/departments/cardiology.svg", "Tim mạch", "tim-mach", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3a8d2865-ede9-4224-b8ee-7e90d9235d29"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám, chẩn đoán và theo dõi các bệnh lý nội khoa thường gặp ở người trưởng thành.", "/images/departments/internal-medicine.svg", "Nội tổng quát", "noi-tong-quat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("61e09e13-12ad-4aa5-a7bc-570b6be1e322"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám và điều trị bệnh lý não, tủy sống, dây thần kinh và cơ.", "/images/departments/internal-medicine.svg", "Thần kinh", "than-kinh", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("7ac9a12d-008a-4926-85b0-d089b6b2b6e7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Quản lý đái tháo đường và các rối loạn tuyến giáp, tuyến yên, tuyến thượng thận.", "/images/departments/internal-medicine.svg", "Nội tiết", "noi-tiet", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("9097e2b0-f4a2-4809-8e24-71c4197e8dc7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Điều trị bệnh lý cơ, xương, khớp và tư vấn phục hồi khả năng vận động.", "/images/departments/internal-medicine.svg", "Cơ Xương Khớp", "co-xuong-khop", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("930ebb0c-612f-4226-a777-2df6ed5ac466"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Đánh giá chức năng và xây dựng chương trình vật lý trị liệu, phục hồi vận động.", "/images/departments/cardiology.svg", "Phục hồi chức năng", "phuc-hoi-chuc-nang", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("94959244-65d0-4f43-9c19-f102b54f4b7a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chẩn đoán và điều trị bệnh lý tai, mũi, xoang, họng và vùng đầu cổ.", "/images/departments/pediatrics.svg", "Tai Mũi Họng", "tai-mui-hong", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("abf3d2c7-9fec-4168-9906-a96881580c38"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám, theo dõi và điều trị các bệnh lý đường thở, phổi và màng phổi.", "/images/departments/internal-medicine.svg", "Hô hấp", "ho-hap", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("baba10d4-8362-4be9-b021-14d54bee66bb"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kiểm tra thị lực, chẩn đoán và điều trị các bệnh lý nhãn khoa.", "/images/departments/internal-medicine.svg", "Mắt", "mat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("cb4ef8d3-c441-40a9-8399-e05312ce46cf"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chăm sóc sức khỏe, theo dõi tăng trưởng và điều trị bệnh lý ở trẻ em.", "/images/departments/pediatrics.svg", "Nhi khoa", "nhi-khoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("cd6b83dc-d9d8-4cb6-ab63-624793312d0e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Tầm soát, chẩn đoán và phối hợp điều trị các bệnh lý ung thư.", "/images/departments/internal-medicine.svg", "Ung bướu", "ung-buou", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("d9cd01b6-2f11-4850-b0da-2792defbccf2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám, điều trị và dự phòng các bệnh lý răng miệng, hàm và mặt.", "/images/departments/dermatology.svg", "Răng Hàm Mặt", "rang-ham-mat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("dc0b229d-7b35-4be3-8140-f7f7c24961c6"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Chăm sóc thai kỳ, sức khỏe sinh sản và điều trị các bệnh lý phụ khoa.", "/images/departments/internal-medicine.svg", "Sản phụ khoa", "san-phu-khoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("dd8d50bb-e41f-4fe0-b804-0303166d51a0"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Khám và điều trị các vấn đề về da, tóc, móng và bệnh lây truyền qua da.", "/images/departments/dermatology.svg", "Da liễu", "da-lieu", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Hospital",
                columns: new[] { "Uuid", "Address", "CreatedAt", "DeletedAt", "Description", "DetailService", "Image", "MapUrl", "Name", "NumberOfRoom", "Slug", "Status", "UpdatedAt", "WorkingHour" },
                values: new object[,]
                {
                    { new Guid("26c92e11-d112-426b-b689-fb44e45d7052"), "284 Cống Quỳnh, phường Bến Thành, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Từ Dũ** là bệnh viện chuyên khoa phụ sản tại TP. Hồ Chí Minh, cung cấp dịch vụ chăm sóc thai kỳ, sinh nở, phụ khoa và hỗ trợ sinh sản.\n\n- Khám sản và quản lý thai\n- Khám, điều trị phụ khoa\n- Chăm sóc sơ sinh", "**Khi khám thai hoặc phụ khoa**\n\nNên mang sổ khám thai, kết quả siêu âm, xét nghiệm và danh sách thuốc đang sử dụng. Trường hợp có dấu hiệu cấp cứu sản khoa cần đến khu cấp cứu ngay, không chờ lịch hẹn.", "https://upload.wikimedia.org/wikipedia/commons/6/6c/Tu_Du_Maternity_Hospital_01.jpg", "https://www.google.com/maps?q=Benh+vien+Tu+Du&output=embed", "Bệnh viện Từ Dũ", 85, "benh-vien-tu-du", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Khám theo lịch từ Thứ Hai - Chủ Nhật; cấp cứu sản phụ khoa 24/7" },
                    { new Guid("30eb8e2a-1290-47bf-9cdb-82060c5a896e"), "1 Trần Hưng Đạo, phường Hai Bà Trưng, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Trung ương Quân đội 108** là bệnh viện đa khoa, chuyên khoa sâu tuyến cuối của quân đội và phục vụ người dân.\n\nCác thế mạnh gồm chấn thương chỉnh hình, tim mạch, ung bướu, đột quỵ, ghép mô và tạng.", "**Lưu ý khi đăng ký khám**\n\nNgười bệnh nên xác định khu khám phù hợp, đến trước giờ hẹn và chuẩn bị đầy đủ hồ sơ y tế. Một số kỹ thuật hoặc chuyên gia làm việc theo lịch riêng.", "https://upload.wikimedia.org/wikipedia/commons/e/e8/Benh_vien_Trung_uong_Quan_doi_108.jpg", "https://www.google.com/maps?q=Benh+vien+Trung+uong+Quan+doi+108&output=embed", "Bệnh viện Trung ương Quân đội 108", 110, "benh-vien-trung-uong-quan-doi-108", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 06:30 - 17:00; một số khu khám làm việc Thứ Bảy" },
                    { new Guid("39ae7eb7-27c9-46b2-8897-de60ee8532fd"), "1 Lý Thường Kiệt, phường Tân Sơn Nhất, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Thống Nhất** là bệnh viện đa khoa tuyến cuối tại TP. Hồ Chí Minh, có thế mạnh chăm sóc người cao tuổi và điều trị các bệnh lý nội khoa phối hợp.\n\n- Tim mạch và lão khoa\n- Nội tiết, hô hấp, tiêu hóa\n- Ngoại khoa và phục hồi chức năng", "**Lưu ý**\n\nNgười bệnh có nhiều bệnh nền nên mang đầy đủ đơn thuốc đang dùng và kết quả theo dõi gần nhất. Không tự ngưng thuốc trước buổi khám nếu chưa có hướng dẫn chuyên môn.", "https://upload.wikimedia.org/wikipedia/commons/f/f0/Hinh-anh-benh-vien-thong-nhat.jpg", "https://www.google.com/maps?q=Benh+vien+Thong+Nhat&output=embed", "Bệnh viện Thống Nhất", 95, "benh-vien-thong-nhat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 16:30; cấp cứu 24/7" },
                    { new Guid("510eb5df-e6b3-4476-b8ac-f36989949b2e"), "43 Tràng Thi, phường Cửa Nam, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Phụ sản Trung ương** là cơ sở chuyên khoa đầu ngành về sản khoa, phụ khoa, sơ sinh và hỗ trợ sinh sản.\n\nBệnh viện tiếp nhận khám định kỳ, điều trị chuyên sâu và cấp cứu sản phụ khoa.", "**Hồ sơ nên mang theo**\n\n- Sổ khám thai và phiếu siêu âm\n- Kết quả xét nghiệm gần nhất\n- Thông tin thuốc, bệnh nền và tiền sử dị ứng\n\nLịch khám chuyên gia và khám theo yêu cầu cần được xác nhận trước.", "https://upload.wikimedia.org/wikipedia/commons/e/eb/B%E1%BB%87nh_vi%E1%BB%87n_ph%E1%BB%A5_s%E1%BA%A3n_trung_%C6%B0%C6%A1ng%2C_Tri%E1%BB%87u_Qu%E1%BB%91c_%C4%90%E1%BA%A1t%2C_H%C3%A0_N%E1%BB%99i_004.JPG", "https://www.google.com/maps?q=Benh+vien+Phu+san+Trung+uong&output=embed", "Bệnh viện Phụ sản Trung ương", 70, "benh-vien-phu-san-trung-uong", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 06:30 - 16:30; khám dịch vụ theo lịch cuối tuần" },
                    { new Guid("59ef0150-3a93-4b7b-aa28-778866eede6a"), "16 Lê Lợi, phường Thuận Hóa, TP. Huế", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Trung ương Huế** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối khu vực miền Trung. Cơ sở thực hiện khám, điều trị chuyên sâu và đào tạo y khoa.\n\n- Tim mạch, đột quỵ và hồi sức\n- Ung bướu, huyết học\n- Ngoại khoa và ghép tạng", "**Trước khi đến khám**\n\nNgười bệnh nên kiểm tra đúng cơ sở, khu khám và lịch chuyên gia. Mang theo hồ sơ điều trị cũ để tránh lặp lại xét nghiệm không cần thiết khi bác sĩ có thể sử dụng kết quả còn giá trị.", "https://upload.wikimedia.org/wikipedia/commons/0/04/BV_TW_Hu%E1%BA%BF_2025.jpg", "https://www.google.com/maps?q=Benh+vien+Trung+uong+Hue&output=embed", "Bệnh viện Trung ương Huế", 115, "benh-vien-trung-uong-hue", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 17:00; cấp cứu 24/7" },
                    { new Guid("64fe32c1-af1f-4ed3-b7e9-ae588a14a560"), "78 đường Giải Phóng, phường Kim Liên, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Bạch Mai** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối tại Hà Nội. Bệnh viện tiếp nhận khám, cấp cứu và điều trị nhiều nhóm bệnh lý chuyên sâu.\n\n- Cấp cứu và hồi sức tích cực\n- Tim mạch, hô hấp, thần kinh\n- Xét nghiệm và chẩn đoán hình ảnh", "**Khi đến khám**\n\nNgười bệnh nên mang theo giấy tờ tùy thân, thẻ bảo hiểm y tế, giấy chuyển tuyến (nếu có), đơn thuốc và kết quả xét nghiệm gần nhất. Lịch của từng khoa có thể thay đổi; nên kiểm tra trên kênh chính thức trước khi đến.", "https://bachmai.gov.vn/assets/images/ad1.jpg", "https://www.google.com/maps?q=Benh+vien+Bach+Mai&output=embed", "Bệnh viện Bạch Mai", 120, "benh-vien-bach-mai", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:30 - 16:30; khám theo yêu cầu có lịch cuối tuần" },
                    { new Guid("9e70212a-f0db-49ec-8d70-f83ea9362f6d"), "341 Sư Vạn Hạnh, phường Hòa Hưng, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Nhi Đồng 1** là bệnh viện chuyên khoa nhi, tiếp nhận khám và điều trị trẻ em với nhiều chuyên khoa nội, ngoại và cấp cứu.\n\n- Nhi tổng quát và chuyên khoa\n- Cấp cứu, hồi sức nhi\n- Ngoại nhi và chăm sóc sơ sinh", "**Phụ huynh cần chuẩn bị**\n\n- Giấy khai sinh hoặc giấy tờ của trẻ\n- Thẻ bảo hiểm y tế\n- Sổ khám, đơn thuốc và thông tin dị ứng\n\nKhông tự ý cho trẻ dùng thêm thuốc trước khi được nhân viên y tế đánh giá nếu trẻ có biểu hiện bất thường.", "https://upload.wikimedia.org/wikipedia/commons/c/cb/Benh_vien_nhi_dong_1-ph%C6%B0%E1%BB%9Dng_10%2C_Qu%E1%BA%ADn_10%2C_TPHCM%2C_Vi%E1%BB%87t_Nam_-_panoramio.jpg", "https://www.google.com/maps?q=Benh+vien+Nhi+Dong+1&output=embed", "Bệnh viện Nhi Đồng 1", 80, "benh-vien-nhi-dong-1", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật theo từng khu khám; cấp cứu 24/7" },
                    { new Guid("a79a1b4f-ebb2-4bd8-b227-c8d0b0ab62ae"), "40 Tràng Thi, phường Cửa Nam, Hà Nội", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Hữu nghị Việt Đức** là cơ sở ngoại khoa tuyến cuối, nổi bật với điều trị chấn thương, phẫu thuật tiêu hóa, thần kinh, tim mạch và ghép tạng.\n\n- Khám ngoại khoa chuyên sâu\n- Cấp cứu chấn thương\n- Phẫu thuật và phục hồi sau mổ", "**Chuẩn bị hồ sơ**\n\n- Giấy tờ tùy thân và thẻ bảo hiểm y tế\n- Giấy chuyển tuyến nếu khám đúng tuyến\n- Phim chụp, kết quả xét nghiệm và hồ sơ phẫu thuật cũ\n\nNgười bệnh cần làm theo hướng dẫn phân luồng tại khu tiếp đón.", "https://upload.wikimedia.org/wikipedia/commons/d/d0/B%E1%BB%87nh_vi%E1%BB%87n_Vi%E1%BB%87t_%C4%90%E1%BB%A9c%2C_Tr%C3%A0ng_Thi%2C_H%C3%A0_N%E1%BB%99i_002.JPG", "https://www.google.com/maps?q=Benh+vien+Huu+nghi+Viet+Duc&output=embed", "Bệnh viện Hữu nghị Việt Đức", 90, "benh-vien-huu-nghi-viet-duc", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 16:30; cấp cứu 24/7" },
                    { new Guid("b892126f-bad5-47ed-a714-1e620f12e385"), "201B Nguyễn Chí Thanh, phường Chợ Lớn, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Chợ Rẫy** là bệnh viện đa khoa hạng đặc biệt, tuyến cuối khu vực phía Nam. Bệnh viện tiếp nhận nhiều ca bệnh nặng và cần phối hợp đa chuyên khoa.\n\n- Cấp cứu, hồi sức và chống độc\n- Tim mạch, ung bướu, huyết học\n- Ngoại khoa và ghép tạng", "**Hướng dẫn chung**\n\nNgười bệnh có lịch hẹn nên đến sớm để xác nhận thông tin. Khi khám bảo hiểm y tế, cần mang bản gốc giấy tờ liên quan và giấy chuyển tuyến còn hiệu lực nếu được yêu cầu.", "https://upload.wikimedia.org/wikipedia/commons/a/a7/C%E1%BB%95ng_b%E1%BB%87nh_vi%E1%BB%87n_Ch%E1%BB%A3_R%E1%BA%ABy_2016.jpg", "https://www.google.com/maps?q=Benh+vien+Cho+Ray&output=embed", "Bệnh viện Chợ Rẫy", 130, "benh-vien-cho-ray", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:00 - 16:00; khám dịch vụ có lịch Thứ Bảy" },
                    { new Guid("bbb8ca82-4e3d-4074-9bf7-86f1640ed0c7"), "3 đường 17A, phường An Lạc, TP. Hồ Chí Minh", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Bệnh viện Quốc tế City** là bệnh viện đa khoa tại khu Y tế kỹ thuật cao Hoa Lâm Shangri-La, cung cấp khám ngoại trú, điều trị nội trú và cấp cứu.\n\n- Nội, ngoại và nhi khoa\n- Sản phụ khoa\n- Chẩn đoán hình ảnh và xét nghiệm", "**Đặt lịch khám**\n\nNgười bệnh nên xác nhận bác sĩ, chuyên khoa, chi phí dự kiến và phạm vi bảo lãnh của đơn vị bảo hiểm trước khi đến. Mang theo hồ sơ cũ để bác sĩ có đủ thông tin đánh giá.", "https://commons.wikimedia.org/wiki/Special:FilePath/City%20International%20Hospital%20Vietnam.jpg", "https://www.google.com/maps?q=City+International+Hospital+Vietnam&output=embed", "Bệnh viện Quốc tế City", 65, "benh-vien-quoc-te-city", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy theo lịch chuyên khoa; cấp cứu 24/7" }
                });

            migrationBuilder.InsertData(
                table: "MedicalService",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Description", "DetailService", "Image", "InsuranceCap", "IsFeatured", "IsInsured", "Name", "Price", "Slug", "Status", "UpdatedAt", "WorkingHour" },
                values: new object[,]
                {
                    { new Guid("06d3f5d6-d6ea-44d8-90d1-3ad3993f8a9b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám sức khỏe tổng quát** kết hợp khám lâm sàng và danh mục cận lâm sàng cơ bản để ghi nhận tình trạng sức khỏe tại thời điểm kiểm tra.\n\nDanh mục cụ thể được điều chỉnh theo tuổi, giới, tiền sử và nhu cầu.", "**Chuẩn bị**\n\n- Đặt lịch và xác nhận yêu cầu nhịn ăn\n- Mang giấy tờ, hồ sơ sức khỏe và đơn thuốc\n- Tránh rượu bia và vận động gắng sức trước ngày khám\n\n**Quy trình**\n\n1. Đăng ký và đo chỉ số cơ bản\n2. Lấy mẫu, chẩn đoán hình ảnh theo danh mục\n3. Khám bác sĩ và nhận tư vấn tổng hợp", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", 0, true, false, "Khám sức khỏe tổng quát", 1200000, "kham-suc-khoe-tong-quat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:00 - 11:30" },
                    { new Guid("0abbfe08-a2eb-40ba-9a06-d9007a5c6723"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Nội tổng quát** giúp đánh giá các triệu chứng thường gặp, bệnh nền và tình trạng sức khỏe chung của người trưởng thành.\n\n- Khai thác tiền sử và thuốc đang dùng\n- Khám lâm sàng\n- Tư vấn xét nghiệm hoặc chuyên khoa phù hợp", "**Chuẩn bị**\n\nMang theo hồ sơ khám gần nhất, danh sách thuốc và ghi lại diễn tiến triệu chứng.\n\n**Quy trình**\n\n1. Tiếp nhận và đo dấu hiệu sinh tồn\n2. Khám với bác sĩ\n3. Nhận chỉ định và hướng dẫn theo dõi", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Khám Nội tổng quát", 250000, "kham-noi-tong-quat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:00 - 16:30" },
                    { new Guid("1893e6df-8119-4f49-bdb2-3ad389c6ed62"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Vật lý trị liệu phục hồi vận động** được xây dựng theo tình trạng chức năng, mục tiêu và khả năng đáp ứng của từng người bệnh.", "**Buổi đầu tiên**\n\n1. Đánh giá đau, tầm vận động và sức cơ\n2. Xác định mục tiêu phục hồi\n3. Hướng dẫn bài tập và kỹ thuật phù hợp\n4. Lập lịch đánh giá lại\n\nNên mặc trang phục thuận tiện cho vận động.", "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Vật lý trị liệu phục hồi vận động", 400000, "vat-ly-tri-lieu-phuc-hoi-van-dong", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 17:00" },
                    { new Guid("4006a2d0-abc8-437e-84c2-d8a84fc49dc1"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Mắt tổng quát** kiểm tra thị lực và hỗ trợ phát hiện các vấn đề thường gặp của mắt.", "**Lưu ý**\n\nMang kính đang sử dụng và đơn kính cũ. Một số trường hợp cần nhỏ thuốc giãn đồng tử, vì vậy người khám nên hạn chế tự lái xe sau khi thực hiện nếu thị lực còn mờ.", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Mắt tổng quát", 300000, "kham-mat-tong-quat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 16:30" },
                    { new Guid("47f3f9db-eb80-4861-8281-68fcb39a6e16"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Siêu âm ổ bụng tổng quát** sử dụng sóng âm để khảo sát hình thái một số cơ quan trong ổ bụng theo chỉ định.", "**Chuẩn bị**\n\nNgười thực hiện có thể được yêu cầu nhịn ăn hoặc uống nước tùy mục tiêu khảo sát. Cần xác nhận hướng dẫn cụ thể tại thời điểm đặt lịch.\n\nKết quả phải được bác sĩ diễn giải cùng triệu chứng và xét nghiệm liên quan.", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Siêu âm ổ bụng tổng quát", 350000, "sieu-am-o-bung-tong-quat", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 17:00" },
                    { new Guid("4e941bd7-8a0d-4087-81eb-af8b03424a35"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Nội tiết** hỗ trợ quản lý đái tháo đường, bệnh tuyến giáp và các rối loạn hormone khác.", "**Chuẩn bị**\n\nMang sổ theo dõi đường huyết, kết quả HbA1c hoặc xét nghiệm hormone, đơn thuốc và thông tin chế độ ăn. Không tự ý bỏ thuốc trước khi khám.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Nội tiết", 320000, "kham-noi-tiet", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:30 - 16:30" },
                    { new Guid("589142f2-a8a3-41ee-b3d6-5e25ee778e21"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Thần kinh** hỗ trợ đánh giá đau đầu, chóng mặt, tê yếu, rối loạn vận động, co giật và các triệu chứng thần kinh khác.", "**Chuẩn bị**\n\nMang theo phim chụp não hoặc cột sống, điện não đồ, đơn thuốc và ghi chú thời điểm xuất hiện triệu chứng. Người bệnh có cơn bất thường nên đi cùng người thân nếu có thể.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Thần kinh", 380000, "kham-than-kinh", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Sáu, 07:30 - 16:30" },
                    { new Guid("59bb50a3-4655-42f6-ae97-e95e37e63a1e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Da liễu** đánh giá các vấn đề về da, tóc và móng, kết hợp tiền sử, thăm khám trực tiếp và xét nghiệm khi cần.", "**Trước buổi khám**\n\n- Hạn chế trang điểm hoặc bôi sản phẩm lên vùng cần khám\n- Mang thuốc và mỹ phẩm đang sử dụng\n- Chuẩn bị ảnh chụp diễn tiến tổn thương nếu có", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 0, false, false, "Khám Da liễu", 300000, "kham-da-lieu", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 08:00 - 17:00" },
                    { new Guid("6401edbe-2788-4aa7-8287-0ec81abbbe04"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Hô hấp** dành cho các triệu chứng ho, khó thở, khò khè, đau ngực khi thở hoặc bệnh phổi cần theo dõi.", "**Nên mang theo**\n\n- Phim X-quang hoặc CT ngực\n- Kết quả đo chức năng hô hấp\n- Bình hít và thuốc đang sử dụng\n\nThông báo ngay nếu có khó thở tăng nhanh hoặc đau ngực dữ dội.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Hô hấp", 320000, "kham-ho-hap", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 16:30" },
                    { new Guid("65d34919-ded3-4f69-bb60-2334e4499763"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Sản phụ khoa** hỗ trợ chăm sóc thai kỳ, sức khỏe sinh sản và đánh giá các triệu chứng phụ khoa.", "**Hồ sơ nên mang theo**\n\n- Sổ khám thai hoặc hồ sơ phụ khoa trước đây\n- Kết quả siêu âm, xét nghiệm gần nhất\n- Thông tin chu kỳ và thuốc đang dùng\n\nNội dung khám được điều chỉnh theo tình trạng thực tế.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Khám Sản phụ khoa", 350000, "kham-san-phu-khoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật, 07:00 - 17:00" },
                    { new Guid("7d8af6a5-e1b9-4ee9-b7b8-56d4d9dc602e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Nội soi dạ dày không gây mê** giúp bác sĩ quan sát niêm mạc đường tiêu hóa trên và thực hiện lấy mẫu khi có chỉ định.", "**Chuẩn bị bắt buộc**\n\n- Nhịn ăn và uống theo thời gian cơ sở hướng dẫn\n- Thông báo thuốc chống đông, dị ứng và bệnh nền\n- Mang kết quả nội soi cũ nếu có\n\nChỉ thực hiện sau khi được sàng lọc và giải thích thủ thuật.", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Nội soi dạ dày không gây mê", 750000, "noi-soi-da-day-khong-gay-me", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:00 - 11:30" },
                    { new Guid("9e62b6a7-e98e-4a5d-b565-d779ed380942"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Xét nghiệm công thức máu** cung cấp thông tin về hồng cầu, bạch cầu và tiểu cầu, hỗ trợ đánh giá nhiều tình trạng sức khỏe.", "**Quy trình**\n\n1. Đối chiếu thông tin người bệnh\n2. Lấy mẫu máu tĩnh mạch\n3. Phân tích mẫu và trả kết quả\n\nViệc có cần nhịn ăn hay không phụ thuộc các xét nghiệm thực hiện cùng lúc.", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Xét nghiệm công thức máu", 150000, "xet-nghiem-cong-thuc-mau", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật, 06:30 - 11:30" },
                    { new Guid("a3d977bb-31c3-46e7-ade7-97a36c1db751"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**X-quang ngực thẳng** hỗ trợ khảo sát phổi, tim và các cấu trúc trong lồng ngực theo chỉ định chuyên môn.", "**Lưu ý an toàn**\n\nThông báo cho nhân viên y tế nếu đang hoặc có khả năng mang thai. Tháo vật kim loại tại vùng chụp và làm theo hướng dẫn nín thở để hình ảnh đạt yêu cầu.", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80", 1, false, true, "X-quang ngực thẳng", 220000, "x-quang-nguc-thang", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật, 07:00 - 17:00" },
                    { new Guid("afe98471-45f0-4be9-8d2b-e217c74404c6"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Xét nghiệm đường huyết và HbA1c** hỗ trợ đánh giá mức glucose tại thời điểm lấy mẫu và xu hướng kiểm soát đường huyết trong thời gian gần đây.", "**Lưu ý**\n\nXác nhận yêu cầu nhịn ăn trước khi đến. Thông báo thuốc đang dùng và không tự ý thay đổi liều insulin hoặc thuốc hạ đường huyết nếu chưa được hướng dẫn.", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Xét nghiệm đường huyết và HbA1c", 280000, "xet-nghiem-duong-huyet-hba1c", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật, 06:30 - 11:30" },
                    { new Guid("b5e11c20-fd42-4352-97b5-596352222bd9"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Điện tâm đồ 12 chuyển đạo** ghi lại hoạt động điện của tim, hỗ trợ đánh giá nhịp tim và một số bất thường tim mạch.", "**Trước khi thực hiện**\n\nNghỉ vài phút, tránh vận động gắng sức ngay trước đo và thông báo thuốc tim mạch đang sử dụng. Thủ thuật không xâm lấn và thường hoàn thành trong thời gian ngắn.", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Điện tâm đồ 12 chuyển đạo", 180000, "dien-tam-do-12-chuyen-dao", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật, 07:00 - 17:00" },
                    { new Guid("bf313821-f3a3-41ce-8ebf-db272e78898b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Tai Mũi Họng** đánh giá các triệu chứng ở tai, mũi, xoang, họng, thanh quản và vùng đầu cổ.", "**Quy trình dự kiến**\n\n1. Khai thác triệu chứng và tiền sử\n2. Khám tai, mũi và họng\n3. Nội soi hoặc xét nghiệm khi có chỉ định\n4. Tư vấn điều trị và tái khám", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Tai Mũi Họng", 280000, "kham-tai-mui-hong", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 16:30" },
                    { new Guid("c4b2c06c-4524-4434-8fef-d5175e2c20e9"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Tim mạch** hỗ trợ đánh giá tăng huyết áp, đau ngực, hồi hộp, khó thở và các yếu tố nguy cơ tim mạch.\n\nKết luận được đưa ra dựa trên thăm khám và các chỉ định phù hợp.", "**Nên mang theo**\n\n- Sổ theo dõi huyết áp, nhịp tim\n- Điện tâm đồ hoặc siêu âm tim cũ\n- Danh sách thuốc đang sử dụng\n\nKhông tự ý ngừng thuốc tim mạch trước buổi khám.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Khám Tim mạch", 350000, "kham-tim-mach", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 16:30" },
                    { new Guid("c96496be-2faf-4485-ad5f-5a79f711e90b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Nhi khoa** dành cho trẻ có triệu chứng cấp tính, cần theo dõi bệnh mạn tính hoặc đánh giá tăng trưởng và phát triển.", "**Phụ huynh cần chuẩn bị**\n\n- Sổ khám và sổ tiêm chủng của trẻ\n- Thông tin cân nặng, nhiệt độ và triệu chứng\n- Danh sách thuốc trẻ đã dùng\n\nTrẻ có dấu hiệu nặng cần đến khu cấp cứu thay vì chờ lịch khám.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, true, true, "Khám Nhi khoa", 280000, "kham-nhi-khoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Chủ Nhật, 07:00 - 17:00" },
                    { new Guid("d82ad43a-baa1-4156-9b62-e85eae266106"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Cơ Xương Khớp** đánh giá đau, sưng, cứng khớp, hạn chế vận động và các bệnh lý cơ xương khớp mạn tính.", "**Nên chuẩn bị**\n\n- Phim X-quang, CT hoặc MRI cũ\n- Kết quả xét nghiệm liên quan\n- Danh sách thuốc giảm đau đã sử dụng\n\nMặc trang phục thuận tiện để bác sĩ kiểm tra vận động.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Cơ Xương Khớp", 320000, "kham-co-xuong-khop", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:30 - 16:30" },
                    { new Guid("fc740d36-d7de-48a6-95ac-fc3c7b7df465"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "**Khám Tiêu hóa** đánh giá triệu chứng liên quan thực quản, dạ dày, ruột, gan, mật và tụy.", "**Khi đến khám**\n\nMang kết quả nội soi, siêu âm, xét nghiệm gan và danh sách thuốc gần nhất. Chỉ nhịn ăn khi đã được cơ sở xác nhận có xét nghiệm hoặc thủ thuật yêu cầu chuẩn bị.", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 1, false, true, "Khám Tiêu hóa", 320000, "kham-tieu-hoa", 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thứ Hai - Thứ Bảy, 07:00 - 16:30" }
                });

            migrationBuilder.InsertData(
                table: "Medicine",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Description", "Image", "InsuranceCap", "IsInsured", "Name", "Price", "Status", "Unit", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("036aeccd-f365-42a6-9e04-d068c7164baf"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm đau, hạ sốt; sử dụng đúng liều được hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Paracetamol 500 mg", 1200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("06cea414-bc4a-4536-bfb1-315122590d38"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc chống trầm cảm nhóm SSRI; hiệu quả và tác dụng không mong muốn cần được theo dõi.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Sertraline 50 mg", 4000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("06dd189c-9492-4587-8eff-b3c65439ea3a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Sản phẩm bổ sung vitamin C khi khẩu phần không đáp ứng đủ nhu cầu.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Vitamin C 500 mg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0a687332-e663-43ff-8ab4-359906254dab"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc ức chế bơm proton dùng trong một số bệnh lý liên quan acid dạ dày.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Esomeprazole 40 mg", 5500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0cc4ac88-1c60-48e4-90fd-b7bbb781b74c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị một số dạng đau thần kinh, sử dụng theo đơn và đánh giá đáp ứng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Pregabalin 75 mg", 8500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0e8ce2f7-692f-4070-ac51-e1ecacf6d45d"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm đau kháng viêm không steroid, dùng liều thấp nhất trong thời gian phù hợp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Meloxicam 7.5 mg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("0f7e50a7-d269-41f1-bf84-71882c1e2774"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Corticosteroid dạng khí dung kiểm soát viêm đường thở, dùng theo đơn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Budesonide khí dung 0.5 mg/2 ml", 135000, 0, 3, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("116fc685-f1ec-4dfe-99a0-b0e5faf681dc"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung sắt và acid folic trong các trường hợp được xác định có nhu cầu.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Sắt fumarate + Acid folic", 2800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("1918e16c-2921-4d8e-a84f-7c7983dbe90e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bột bù nước và điện giải; pha đúng lượng nước ghi trên bao bì.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Oresol áp lực thẩm thấu thấp", 4500, 0, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("1fcb3999-4793-4381-bf96-d8d7a11d203c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dung dịch nhuận tràng thẩm thấu, liều dùng được điều chỉnh theo đáp ứng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Lactulose 3.35 g/5 ml - 100 ml", 48000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("21671875-846f-43c1-b817-5753ad9057f2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng kết tập tiểu cầu, sử dụng theo chỉ định tim mạch hoặc thần kinh.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Clopidogrel 75 mg", 5500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("2476615a-8777-4bb1-813d-6e69f3700b2b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hạ đường huyết phóng thích kéo dài; lưu ý nguy cơ hạ đường huyết.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Gliclazide MR 30 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("289aa313-b1ea-49c9-a9d6-056f55a13ab1"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Insulin tác dụng kéo dài; bảo quản và tiêm đúng kỹ thuật được hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Insulin glargine 100 IU/ml - bút 3 ml", 285000, 0, 3, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("35d71696-f7c4-4162-ac93-112b90a300c8"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng histamine hỗ trợ giảm triệu chứng dị ứng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Cetirizine 10 mg", 1200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("395bd57b-bd92-4f6b-bf40-d5932e348eb9"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dung dịch natri clorid đẳng trương dùng trong cơ sở y tế theo chỉ định.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Natri clorid 0.9% - 500 ml", 18000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3a0e5044-b2e3-4f08-8c2d-ae38329bb703"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Gel bôi ngoài da hỗ trợ giảm đau tại chỗ; không bôi lên vết thương hở.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Diclofenac gel 1% - 20 g", 29000, 0, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3b22896a-efbd-4976-b9d0-dc7eedcf1ee2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc nhuận tràng kích thích, chỉ nên dùng ngắn hạn theo hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Bisacodyl 5 mg", 900, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("55d0a06a-9934-4bff-a146-113d6a28ae46"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh nhóm macrolide, sử dụng theo chẩn đoán và đơn thuốc.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Azithromycin 500 mg", 12000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("5a815127-0801-434e-ad98-6e77c930590c"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giãn phế quản dạng hít; cần được hướng dẫn kỹ thuật sử dụng bình hít.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Salbutamol bình hít 100 mcg/liều", 72000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("615f7045-5c22-44ed-b726-2b94d1718921"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dung dịch sát khuẩn dùng ngoài da; tránh dùng khi có chống chỉ định với iod.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Povidone iodine 10% - 90 ml", 24000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("61b33d56-8b3a-4c00-a13e-83979c60c950"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm tạo acid uric trong điều trị dài hạn; không dùng để cắt cơn gút cấp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Allopurinol 300 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("65af0a2b-3fa4-479c-949c-50b241d41e86"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị một số nhiễm khuẩn kỵ khí và ký sinh trùng theo chỉ định.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Metronidazole 250 mg", 900, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("6c23dad5-8938-4a06-af07-21dc9ba17978"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh phối hợp; dùng đủ liệu trình theo đơn và lưu ý tiền sử dị ứng penicillin.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Amoxicillin/Clavulanate 875/125 mg", 14500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("6e8f0bc6-92d7-4482-8533-d140d57e3186"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung kẽm theo độ tuổi, tình trạng dinh dưỡng và hướng dẫn chuyên môn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Kẽm 10 mg", 1500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("6fd78f28-5720-4299-b9f5-039691329d80"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng histamine dùng trong viêm mũi dị ứng và mày đay.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Loratadine 10 mg", 1500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("7f242f9c-380d-4125-917f-5266ea216441"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung vitamin D theo nhu cầu và hướng dẫn của nhân viên y tế.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Vitamin D3 1000 IU", 2200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("82e9b25d-d872-4aef-bc5e-22bf9e23c8b7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh penicillin, chỉ sử dụng khi có chỉ định của bác sĩ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Amoxicillin 500 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("8ab64ed5-dca4-4f0b-9b81-4f8cde3bfe00"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc dạng gói hỗ trợ điều trị triệu chứng tiêu chảy theo hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Diosmectite 3 g", 4000, 0, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("8bb56dd6-9f04-4833-9d68-4f479b308e1e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng histamine có thể gây buồn ngủ; thận trọng khi lái xe.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Chlorpheniramine 4 mg", 500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("92302b4c-4662-44b0-bbcb-ed0159e5b242"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Corticosteroid bôi da mức độ nhẹ; không tự ý bôi kéo dài hoặc trên diện rộng.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Hydrocortisone cream 1% - 15 g", 32000, 0, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("92b6ae12-1264-444f-9c6b-21ad099cd8c2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc long đờm dạng gói; hòa tan hoàn toàn trước khi uống.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Acetylcysteine 200 mg", 2500, 0, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("9479e702-5a84-4690-8fc5-06012f21c751"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc dùng trong một số trường hợp gút; cần tuân thủ chặt chẽ liều kê đơn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Colchicine 1 mg", 3200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("985c68d7-8d12-45c9-b05b-17e392217dc6"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hạ cholesterol nhóm statin, dùng theo đánh giá nguy cơ tim mạch.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Rosuvastatin 10 mg", 4500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("9e5b33fc-15bd-425d-9ad1-8fa05bb266af"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm đau, kháng viêm không steroid; cần lưu ý nguy cơ trên dạ dày.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Ibuprofen 400 mg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a49b2f0a-fce2-42a4-9298-76f193da0b4f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc kháng kết tập tiểu cầu liều thấp; chỉ dùng khi đã được đánh giá nguy cơ chảy máu.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Aspirin 81 mg", 1000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a7ad1d42-9230-407f-b23c-c8e58983166b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Hormone tuyến giáp tổng hợp; thường uống lúc đói và theo dõi xét nghiệm định kỳ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Levothyroxine 50 mcg", 1800, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("b229c4c7-984c-4c42-86f7-5026e6a6923a"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị đái tháo đường type 2, dùng cùng chế độ dinh dưỡng phù hợp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Metformin 500 mg", 900, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c2aaf13f-8c14-4f70-9ec0-757058723f90"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc dùng trong một số đau thần kinh và động kinh; có thể gây chóng mặt, buồn ngủ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Gabapentin 300 mg", 3500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c5b5e8b1-decf-4f59-bbd0-d2d9e72c73e7"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc ức chế tiết acid dạ dày, thường dùng trước bữa ăn theo hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Omeprazole 20 mg", 1300, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c815e301-5461-4417-8f33-8130020d759f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kháng sinh cephalosporin; không tự ý dùng cho nhiễm virus thông thường.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Cefuroxime 500 mg", 15000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c91ae78d-2bd4-4680-9163-69ca0d70da91"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc điều trị tăng huyết áp; cần theo dõi huyết áp và chức năng thận.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Losartan 50 mg", 2200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c99c115e-4faa-4fed-a36a-24a80a9eb8e2"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bổ sung calci và vitamin D; cần lưu ý tổng lượng calci từ thực phẩm và thuốc.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Calcium carbonate 500 mg + Vitamin D3", 3500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("ca281ba6-e73b-491a-b334-861d990a6d97"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hỗ trợ điều trị buồn nôn và rối loạn vận động tiêu hóa theo chỉ định.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Domperidone 10 mg", 1600, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("d6ae74b5-74ec-43d1-853e-19d0fc5a6bbd"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc hạ lipid máu nhóm statin, kết hợp chế độ ăn và theo dõi định kỳ.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Atorvastatin 20 mg", 2500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("e4dc79f2-cfde-4db5-84b2-48688778acbc"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Siro giảm ho khan; không dùng thay thế việc đánh giá nguyên nhân ho kéo dài.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0f, false, "Dextromethorphan siro 15 mg/5 ml - 100 ml", 38000, 0, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f056d891-c813-4f21-aafe-c459714646be"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Kem bôi kháng nấm ngoài da, dùng đủ thời gian được hướng dẫn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Clotrimazole cream 1% - 15 g", 28000, 0, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f85251fb-7e9d-4a1d-8e9d-c623e2752829"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc giảm tiết acid dạ dày; thời gian sử dụng theo chỉ định chuyên môn.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Pantoprazole 40 mg", 3500, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f854d43f-b17f-4882-be04-131dc91c9383"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc tiêu nhầy, hỗ trợ làm loãng đờm trong bệnh lý đường hô hấp.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.5f, true, "Ambroxol 30 mg", 1200, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("fb9e8dc2-196d-491c-bcc2-507d205f3876"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc chẹn beta; không tự ý ngừng đột ngột khi đang điều trị.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Bisoprolol 5 mg", 3000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("fdbbdc1a-4c2a-4617-b26b-0f9272fe3158"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Thuốc chẹn kênh canxi điều trị tăng huyết áp và một số trường hợp đau thắt ngực.", "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", 0.8f, true, "Amlodipine 5 mg", 1000, 0, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Permission",
                columns: new[] { "Uuid", "Description", "Icon", "Name", "Scope", "Slug" },
                values: new object[,]
                {
                    { new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), "Khám chữa bệnh", "dashboard", "Tổng quan bác sĩ", 1, "tong-quan-bac-si" },
                    { new Guid("1458ad5d-6741-426b-98ee-d19f6ab72890"), "Vận hành chi nhánh", "schedule", "Phân ca làm việc bác sĩ", 1, "phan-ca-lam-viec-bac-si" },
                    { new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), "Khám chữa bệnh", "medicine", "Thuốc khả dụng", 1, "thuoc-kha-dung" },
                    { new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), "Tiếp nhận và điều phối", "payment", "Thanh toán & cấp thuốc", 1, "thanh-toan-cap-thuoc" },
                    { new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), "Kho thuốc", "ticket", "Xuất hàng", 1, "xuat-hang" },
                    { new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), "Quản trị hệ thống", "service", "Dịch vụ", 0, "dich-vu" },
                    { new Guid("52edd052-303c-462a-9a27-70bd3c37cbcf"), "Vận hành chi nhánh", "inventory", "Kho thuốc", 1, "kho-thuoc" },
                    { new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), "Quản trị hệ thống", "schedule", "Khung giờ làm việc", 0, "khung-gio-lam-viec" },
                    { new Guid("6a64941b-93ae-4e14-a65d-a89a904b2c36"), "Quản trị hệ thống", "permission", "Vai trò & quyền hạn", 0, "phan-quyen" },
                    { new Guid("6d32f7d6-e898-4bed-914f-2b9cda821a5f"), "Quản trị hệ thống", "medicine", "Danh mục thuốc", 0, "thuoc" },
                    { new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), "Quản trị hệ thống", "department", "Chuyên khoa", 0, "chuyen-khoa" },
                    { new Guid("772f59fb-5ba1-4a7b-b80c-b7a46f9fbbc2"), "Quản trị hệ thống", "hospital", "Cơ sở y tế", 0, "co-so-y-te" },
                    { new Guid("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), "Quản trị hệ thống", "report", "Báo cáo hệ thống", 0, "bao-cao-he-thong" },
                    { new Guid("7fab88c2-fb9c-435c-b218-4fedbbae1a78"), "Vận hành chi nhánh", "appointment", "Lịch hẹn", 1, "lich-hen-chi-nhanh" },
                    { new Guid("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), "Vận hành chi nhánh", "review", "Đánh giá", 1, "danh-gia-chi-nhanh" },
                    { new Guid("869dd7d5-cc15-4651-b565-d001a813bc41"), "Vận hành chi nhánh", "account", "Nhân sự", 1, "nhan-su" },
                    { new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), "Khám chữa bệnh", "appointment", "Lịch khám", 1, "lich-kham" },
                    { new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), "Kho thuốc", "inventory", "Tồn kho", 1, "ton-kho" },
                    { new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), "Kho thuốc", "ticket", "Nhập hàng", 1, "nhap-hang" },
                    { new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), "Vận hành chi nhánh", "schedule", "Giờ làm việc bệnh viện", 1, "gio-lam-viec-benh-vien" },
                    { new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), "Khám chữa bệnh", "schedule", "Giờ làm việc bác sĩ", 1, "gio-lam-viec-bac-si" },
                    { new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), "Khám chữa bệnh", "patient", "Ca khám", 1, "ca-kham" },
                    { new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), "Quản trị hệ thống", "dashboard", "Tổng quan hệ thống", 0, "tong-quan-he-thong" },
                    { new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), "Khám chữa bệnh", "prescription", "Đơn thuốc", 1, "don-thuoc-bac-si" },
                    { new Guid("c27f7f8a-1397-4c16-9649-b301ada7842f"), "Vận hành chi nhánh", "room", "Phòng khám", 1, "phong-kham-chi-nhanh" },
                    { new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), "Khám chữa bệnh", "profile", "Hồ sơ nghề nghiệp", 1, "ho-so-nghe-nghiep" },
                    { new Guid("ce817bab-056f-4f1f-a31b-22f294eae961"), "Kho thuốc", "report", "Báo cáo kho", 1, "bao-cao-kho" },
                    { new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), "Vận hành chi nhánh", "report", "Báo cáo", 1, "bao-cao-chi-nhanh" },
                    { new Guid("df01b115-6849-4a46-906b-79339166b797"), "Kho thuốc", "provider", "Nhà cung cấp", 1, "nha-cung-cap" },
                    { new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), "Quản trị hệ thống", "account", "Tài khoản", 0, "tai-khoan" },
                    { new Guid("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), "Vận hành chi nhánh", "hospital", "Thông tin chi nhánh", 1, "thong-tin-chi-nhanh" },
                    { new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), "Quản trị hệ thống", "audit", "Nhật ký hệ thống", 0, "nhat-ky-he-thong" },
                    { new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), "Vận hành chi nhánh", "dashboard", "Tổng quan chi nhánh", 1, "tong-quan-chi-nhanh" },
                    { new Guid("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), "Tiếp nhận và điều phối", "patient", "Tiếp nhận", 1, "tiep-nhan" },
                    { new Guid("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), "Kho thuốc", "dashboard", "Tổng quan kho thuốc", 1, "tong-quan-kho" },
                    { new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), "Vận hành chi nhánh", "department", "Chuyên khoa & dịch vụ", 1, "chuyen-khoa-dich-vu" },
                    { new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), "Tiếp nhận và điều phối", "dashboard", "Tổng quan lễ tân", 1, "tong-quan-tiep-nhan" }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Description", "IsDoctor", "Name", "Scope", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Quản trị viên hệ thống bệnh viện", false, "Vận hành chi nhánh", 1, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Quản lý kho bệnh viện", false, "Quản lý kho", 1, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Quản lý toàn bộ hệ thống", false, "Quản trị hệ thống", 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Khám, chữa bệnh và kê đơn thuốc", true, "Bác sĩ", 1, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Tiếp nhận khách hàng, hỗ trợ thanh toán hóa đơn", false, "Lễ tân", 1, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "TimeWorking",
                columns: new[] { "Uuid", "CreatedAt", "DayOfWeek", "DeletedAt", "EndTime", "StartTime", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("0ea57126-f2e9-40f5-9d32-357e7f26bf74"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, null, new TimeOnly(17, 0, 0), new TimeOnly(13, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("13ff7285-5624-4cd3-b4d0-6456c97d2577"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 3, null, new TimeOnly(17, 0, 0), new TimeOnly(13, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("2f1ac953-1140-44de-80a1-4c1841dea41f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, new TimeOnly(17, 0, 0), new TimeOnly(13, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("3272b0c4-75a7-4c26-b5e2-1ab56aac7ca4"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5, null, new TimeOnly(11, 30, 0), new TimeOnly(7, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("922dff60-04b2-4758-ae68-5ef4c9443c7f"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, null, new TimeOnly(17, 0, 0), new TimeOnly(13, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a01e0b59-47cd-4c69-aea1-9ff571fe9c9b"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, new TimeOnly(11, 30, 0), new TimeOnly(7, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("bf05d060-321c-4740-8907-de93d1457add"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, null, new TimeOnly(11, 30, 0), new TimeOnly(7, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("d700f392-bd1b-4377-aac7-76a0f04bf22e"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 3, null, new TimeOnly(11, 30, 0), new TimeOnly(7, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("e4aec806-9bfa-4b9f-a09a-078e9a984738"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 6, null, new TimeOnly(11, 30, 0), new TimeOnly(7, 30, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("edcfebdd-0799-49aa-a731-1ea626d8e2c1"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5, null, new TimeOnly(17, 0, 0), new TimeOnly(13, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("f791f367-dded-433c-a460-661d13f1b7f8"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, null, new TimeOnly(11, 30, 0), new TimeOnly(7, 0, 0), 0, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Account",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "Email", "HospitalUuid", "Password", "Phone", "RoleUuid", "Status", "UpdatedAt" },
                values: new object[] { new Guid("b5c30c02-2fcb-4ae5-99db-15debd3ab001"), new DateTime(2026, 10, 13, 0, 0, 0, 0, DateTimeKind.Utc), null, "", null, "$2a$12$W1mt0UsXqdFWuoc0vT3lUuk1pPbK2HzmYhQCDWmH6bZGMmRvrfhkW", "0900000000", new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8"), 0, new DateTime(2026, 10, 13, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "Uuid", "Action", "PermissionUuid", "RoleUuid" },
                values: new object[,]
                {
                    { new Guid("0042ea5c-04ca-881e-c2ae-3e584cdb5b90"), 2, new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("01052834-fc47-2754-06c7-a04688d5da04"), 0, new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("014133d7-9be2-27c5-4a72-bd706c9e12c2"), 1, new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("01a57ff9-e2ac-197f-a186-ddbaa89adef0"), 2, new Guid("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("02c7522b-fb20-9151-7ab4-452a0144b105"), 1, new Guid("ce817bab-056f-4f1f-a31b-22f294eae961"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("06a1f372-3f9c-6811-1adc-10a7b01ac81b"), 1, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("06a56aae-cf9c-3d03-9f85-c0783c80be1c"), 1, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("08e046bd-35f5-d294-05f3-b95afd3ae819"), 0, new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("0aa7499e-1793-8d93-0ce7-b73fca3fc914"), 2, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("0e1155f1-0e5a-22d9-8efc-058dfe2d291a"), 3, new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("0e27ce44-9a93-0a3e-6e42-6ab10640dace"), 2, new Guid("869dd7d5-cc15-4651-b565-d001a813bc41"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("1079fafc-f017-5f33-d01c-ce3db6d2ccf6"), 2, new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("1c70972e-e680-aeb0-80e0-efe661e79063"), 1, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("1d867270-7d07-da9a-0c8d-aca4d7b6f60a"), 1, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("21fdc1d3-a9ab-40a8-2ec9-f7702c652454"), 3, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("224c9e21-88fb-e110-2953-01cf196a7e04"), 2, new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("22712642-c9ee-a3db-31ed-5bfa907e02cb"), 2, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("25f5992a-cf68-1beb-6750-49bda99e9708"), 0, new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("280ad22f-c00e-8d05-9a6e-7b1ae2f54d4f"), 2, new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("2e1b82d4-2aef-cfb2-679a-849e76f67f13"), 0, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("2f65831c-3640-e16f-0272-31388c9b3cf9"), 1, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("2fd82cce-b92d-b2b6-381f-d2938e77c77a"), 2, new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("30395517-5fcb-301f-9b65-78c7b0463899"), 1, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("30fe9ce0-f8a2-83cc-f3ea-7152f189e517"), 0, new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("31f34724-f47e-d550-ec0a-88aaee3337ac"), 3, new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("37940569-c417-f0b0-8dcc-f9a0592e46d3"), 0, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("3925d7e0-3656-071f-93ae-78568b306442"), 2, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("39beb71b-149f-0c3b-75f0-108b11090515"), 0, new Guid("c27f7f8a-1397-4c16-9649-b301ada7842f"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("3a321d6e-3502-6c42-1e33-4189d4cc24fe"), 1, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("3d4dd8f9-5d74-365a-8610-82735f4bac93"), 1, new Guid("6a64941b-93ae-4e14-a65d-a89a904b2c36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("3ed106d8-9817-c6d7-95c8-1b8f0d606874"), 1, new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("405a08ce-7518-480e-6fc3-51674256f11f"), 3, new Guid("772f59fb-5ba1-4a7b-b80c-b7a46f9fbbc2"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("407a38a9-caac-8f10-241b-e1ea7c762785"), 0, new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("425b0128-1eab-9491-a06b-85c9deafafc4"), 1, new Guid("c27f7f8a-1397-4c16-9649-b301ada7842f"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("432201a4-6f2b-69b5-a75a-cb26dca19adb"), 3, new Guid("6d32f7d6-e898-4bed-914f-2b9cda821a5f"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("44d4e25c-525f-382c-5a25-ad16cb8ba55f"), 1, new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("45486682-30d2-2642-2fef-d7d0c657ac4a"), 3, new Guid("6a64941b-93ae-4e14-a65d-a89a904b2c36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("4677d49f-a351-9641-5d3f-c6d072a39d95"), 3, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("47f488e2-7820-5f95-6b84-47a1f146392c"), 2, new Guid("6a64941b-93ae-4e14-a65d-a89a904b2c36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("488f4a1c-a4f0-8ac5-d4b8-2117fac0cd95"), 3, new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("4ad70528-e9b8-06a2-fb73-fb25aec06164"), 0, new Guid("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("4f23ea0e-b0ed-e642-e729-1a84c773936e"), 1, new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("51f6fa9b-cbc8-9129-3e07-8ca94f727fb2"), 0, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("53b28e15-a1fb-7535-8681-56207966b63f"), 3, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("5487237d-1f8d-a5b5-9eb0-5eb144f3cc20"), 2, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("54ce05aa-916a-269b-f747-583ff94d1795"), 0, new Guid("6d32f7d6-e898-4bed-914f-2b9cda821a5f"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("5542b16c-d5f0-435d-37f3-e3f8dfa3e464"), 3, new Guid("869dd7d5-cc15-4651-b565-d001a813bc41"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("55e16076-db7d-b7e9-f0cc-cf99037b2187"), 0, new Guid("ce817bab-056f-4f1f-a31b-22f294eae961"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("5ac90484-1302-593f-6815-10c168c7e2f4"), 3, new Guid("c27f7f8a-1397-4c16-9649-b301ada7842f"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("5b558a48-7008-faab-7e20-7395009a8987"), 0, new Guid("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("5ba10c2d-21c8-df2d-5192-baba62f6636c"), 0, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("5c6b0a8d-835d-0641-fa85-f7f7e7a420ce"), 0, new Guid("772f59fb-5ba1-4a7b-b80c-b7a46f9fbbc2"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("5d27d103-c34a-03cd-48e2-419ac42079b3"), 1, new Guid("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("5da55777-c61c-5021-d180-fd856ccaa4fa"), 0, new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("62ae2e24-976e-34d2-c5e6-b9d840412bf2"), 3, new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("62ed5f51-f709-28e4-a184-3fdd966d50ea"), 1, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("64ed25b6-a750-8660-58a2-9521b64aaa7b"), 0, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("6504f136-1d15-71d6-9993-446496a53d22"), 0, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("665e74ff-d11e-e5ae-0764-81223a678577"), 1, new Guid("7fab88c2-fb9c-435c-b218-4fedbbae1a78"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("678cebf8-ba0f-9623-b434-b562cc627288"), 1, new Guid("6d32f7d6-e898-4bed-914f-2b9cda821a5f"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("69a31445-2690-0183-24b8-890f67771228"), 3, new Guid("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("6b84d046-3d87-8dca-fd4f-7969edfcfe88"), 3, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("6bb71e13-ffba-0171-3061-dbb518f04a65"), 0, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("6cd28dcb-b1f4-9287-c33b-63b52f6a0f2e"), 3, new Guid("1458ad5d-6741-426b-98ee-d19f6ab72890"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("6e354071-4ffd-680f-1aa1-1f9a14bc6357"), 2, new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("6e6e09f5-7632-a10b-d0a6-d20a4920f9c2"), 3, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("6f1c70c4-da2a-4dff-13c3-ae37efeae333"), 2, new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("71e847a8-32c5-65e3-7a05-f664042d5e06"), 2, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("73de654f-504a-94ec-5fb3-40d8ecbb35ef"), 3, new Guid("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("756f56d9-e503-e093-edd3-7e2ca9ea1d2e"), 3, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("760a8c7c-a071-f278-109a-413480a628f9"), 3, new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("7b84e48a-0766-074e-a7c0-481e1c6a2840"), 3, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("82010e50-b546-5f56-f7de-2a176dd415a2"), 0, new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("83f0cf07-1ec2-8618-1c2b-cff0317fecff"), 1, new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("88e6a082-db09-429d-b348-a7b06323a40f"), 0, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("8a9cd76a-5050-b1ae-862c-99091f1a4bda"), 2, new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("8e5f03d8-7108-4a85-af36-d7b48d1f784e"), 0, new Guid("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("8fb21dfd-7a1f-5c0d-1975-d694af738460"), 3, new Guid("7fab88c2-fb9c-435c-b218-4fedbbae1a78"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("907ef9d5-e553-5d57-0545-7c82cc6326bc"), 0, new Guid("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("91bb4d7c-50b1-fdd0-0cf4-61d1176629e3"), 2, new Guid("772f59fb-5ba1-4a7b-b80c-b7a46f9fbbc2"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("927f4806-15f9-619f-ef47-e22e341a7127"), 3, new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("959f580e-f02b-d972-074d-05cff3f2ed85"), 2, new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("97606492-1335-3ad4-915e-69cf57a0dce8"), 1, new Guid("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("97dabfe3-6ea3-1cfa-1070-b6cd55629f36"), 3, new Guid("52edd052-303c-462a-9a27-70bd3c37cbcf"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("9b3566ed-993a-739d-c9d6-4a97ac076dee"), 2, new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("9c791673-6f1d-8094-ca8d-499116d4184f"), 1, new Guid("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("9cf8caf1-ba6e-e53f-8945-6e02321742ae"), 0, new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("9f691606-2606-bc08-7b64-ba5031121fad"), 2, new Guid("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("a0189932-6586-06cf-e74f-0f85e5d3a8a2"), 0, new Guid("7fab88c2-fb9c-435c-b218-4fedbbae1a78"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("a22211f0-f16e-230c-6bfb-aa5a3fb921f9"), 2, new Guid("52edd052-303c-462a-9a27-70bd3c37cbcf"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("a238bb61-2d84-9215-4661-984ee866ec4d"), 1, new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("a23cba51-d7e4-e118-a44d-6aa07a05176f"), 2, new Guid("1458ad5d-6741-426b-98ee-d19f6ab72890"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("a3f73861-2836-d07f-f6c6-3c196c6b340b"), 1, new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("a672cc9b-f6f7-5b6f-b7ab-39c581c630f8"), 1, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("a7af4758-987c-6ec0-9a61-95b60c2bdd00"), 0, new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("a7b44d5e-f859-501d-7a1e-c58da54baeaa"), 3, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("a7dd1130-2a47-ebfe-136b-dcdff09021c0"), 2, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("aabc06ef-c4e0-026c-1421-585e836ae377"), 2, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("aae2f556-79ec-eea0-4bb8-19a9f255b1fc"), 2, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("b0d08679-b53c-3135-06bd-50aa64851a7d"), 1, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("b1eaab85-c95f-383b-6378-6864f42d7e2a"), 1, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("b6e6cf5d-072d-13e3-18ca-c6f72edbcc30"), 2, new Guid("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("b8b04a78-ba6e-4b54-675c-719eee90e89b"), 3, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("baf225f9-7340-27f6-9b58-f37c29f52254"), 1, new Guid("1458ad5d-6741-426b-98ee-d19f6ab72890"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("bb7bdbd3-0429-c078-6e05-e610704ef58a"), 2, new Guid("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("bbc83b49-4ed6-7152-1986-f2dae8238c3a"), 0, new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("bccaf1ae-6d2f-6aa3-9c4a-923092acf668"), 3, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("be380550-551c-2e4d-bfd3-5eaffca443f9"), 2, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("c0dc14b8-d7d1-fea1-6644-4b84d314efec"), 3, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("c23da37f-dccc-6ef5-2bba-4393d75a3e59"), 1, new Guid("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("c3ab3bc7-d800-4e88-6430-1b4fe7841fd2"), 3, new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("c9abd4b5-cb90-a043-49fe-7317a5ab72d2"), 3, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("d02d3f1f-9ab7-ed9c-3241-ca9254b03a17"), 1, new Guid("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("d1696194-bed7-665c-dae4-d3a9199b0b6c"), 0, new Guid("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("d18a2991-3dbd-2ab7-8aae-bd02eb5d9c58"), 3, new Guid("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("d1e00614-af62-b635-6fde-52a663cff1e2"), 0, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("d21a289c-509d-3fcb-2997-9a22ce2147b9"), 1, new Guid("52edd052-303c-462a-9a27-70bd3c37cbcf"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("d249281e-98ba-8d73-eee2-8fdd982b24a8"), 3, new Guid("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("d423cd5c-41d4-0963-c751-e7e9acec7417"), 3, new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("d4a1183e-a0e7-bba5-3824-2362e465a8b4"), 3, new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("d6b5a851-e38f-c5b1-351a-9ff98c3d0994"), 1, new Guid("869dd7d5-cc15-4651-b565-d001a813bc41"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("d7615dc6-a666-0fa5-8994-2a6010e52d01"), 1, new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("d94a001e-a2cd-dfbb-b24b-a8b68a8ef4ae"), 2, new Guid("ce817bab-056f-4f1f-a31b-22f294eae961"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("d9b3455a-a58e-4450-7af9-29a2ced7f908"), 0, new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("daa14692-4bf9-045c-2c7f-754d462cf6f5"), 0, new Guid("869dd7d5-cc15-4651-b565-d001a813bc41"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("db083aba-5cf0-dcc5-cc1c-a959bd7482ff"), 1, new Guid("772f59fb-5ba1-4a7b-b80c-b7a46f9fbbc2"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("dcf07de8-b7cb-c7c2-71e5-a1a9d8cd7b9d"), 0, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("de44205d-318d-0f60-3d17-6590456dd498"), 1, new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("dfefaebf-28c1-c630-5178-146db7b6627a"), 0, new Guid("6a64941b-93ae-4e14-a65d-a89a904b2c36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("e07c449d-48a0-7a56-8aaf-9fdd45a98dc3"), 2, new Guid("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("e139d3f0-ead5-e4b1-7ceb-061a4360f6c6"), 0, new Guid("1458ad5d-6741-426b-98ee-d19f6ab72890"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("e155eb8e-1271-994f-112c-7eba24c20ef0"), 2, new Guid("6d32f7d6-e898-4bed-914f-2b9cda821a5f"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("e3ec3c7a-b91b-db30-1712-8495f7614f2c"), 2, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("e4c231f2-c1fb-99fc-4528-c995f361ef99"), 3, new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("e5f954c3-0bc2-2c61-83fe-04114956574f"), 2, new Guid("c27f7f8a-1397-4c16-9649-b301ada7842f"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("e77a15e9-dc7d-16c9-5b9a-cdf144e3b347"), 2, new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("e84c3cf1-5ad7-81af-2845-b385f7235b4a"), 3, new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("e9947c9d-f165-7d05-8a11-8d0ee1784822"), 0, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("ea72871c-d219-34cc-daf8-d58e320afa52"), 1, new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("eb72c362-2c73-89e3-152c-0fd0cbeae25b"), 1, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("eed0d837-678b-778b-32b9-8932609c79f1"), 2, new Guid("7fab88c2-fb9c-435c-b218-4fedbbae1a78"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("f273694d-38be-327e-ed3d-e8439edd96d4"), 1, new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("f7d1ab93-45ed-0179-ba9e-c7e5c78cc59c"), 3, new Guid("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("f98392a6-86fc-6843-e589-227e97250b0c"), 0, new Guid("52edd052-303c-462a-9a27-70bd3c37cbcf"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("fac04d32-d18e-e1c6-a771-67c2087efc08"), 2, new Guid("4fe03c32-9a96-467f-a591-ff7eb7ae3a8f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("faf994bf-a220-64dd-9918-cb193386991b"), 3, new Guid("ce817bab-056f-4f1f-a31b-22f294eae961"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("fb353c21-fa45-8e65-5a32-95c181efa800"), 2, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("fbb07902-24a1-66d0-c612-b263c81f2796"), 0, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_HospitalUuid",
                table: "Account",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Account_Phone",
                table: "Account",
                column: "Phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Account_RoleUuid",
                table: "Account",
                column: "RoleUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_DoctorUuid",
                table: "Appointment",
                column: "DoctorUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_HospitalUuid",
                table: "Appointment",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_PatientUuid",
                table: "Appointment",
                column: "PatientUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_RoomUuid",
                table: "Appointment",
                column: "RoomUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_TimeSlot",
                table: "Appointment",
                column: "TimeSlot");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentMedicalService_AppointmentUuid",
                table: "AppointmentMedicalService",
                column: "AppointmentUuid");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentMedicalService_MedicalServiceUuid",
                table: "AppointmentMedicalService",
                column: "MedicalServiceUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorDepartment_DepartmentUuid",
                table: "DoctorDepartment",
                column: "DepartmentUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorDepartment_DoctorUuid",
                table: "DoctorDepartment",
                column: "DoctorUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorProfile_AccountUuid",
                table: "DoctorProfile",
                column: "AccountUuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorProfile_HospitalUuid",
                table: "DoctorProfile",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedule_DoctorUuid",
                table: "DoctorSchedule",
                column: "DoctorUuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkingHour_DoctorScheduleUuid_WorkingHourUuid",
                table: "DoctorWorkingHour",
                columns: new[] { "DoctorScheduleUuid", "WorkingHourUuid" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkingHour_RoomUuid_WorkingHourUuid",
                table: "DoctorWorkingHour",
                columns: new[] { "RoomUuid", "WorkingHourUuid" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorkingHour_WorkingHourUuid",
                table: "DoctorWorkingHour",
                column: "WorkingHourUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ExportTicket_AccountUuid",
                table: "ExportTicket",
                column: "AccountUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ExportTicket_HospitalUuid",
                table: "ExportTicket",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ExportTicketDetail_ExportTicketUuid",
                table: "ExportTicketDetail",
                column: "ExportTicketUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ExportTicketDetail_MedicineUuid",
                table: "ExportTicketDetail",
                column: "MedicineUuid");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalDepartment_DepartmentUuid",
                table: "HospitalDepartment",
                column: "DepartmentUuid");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalDepartment_HospitalUuid",
                table: "HospitalDepartment",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalMedicalService_HospitalUuid",
                table: "HospitalMedicalService",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalMedicalService_MedicalServiceUuid",
                table: "HospitalMedicalService",
                column: "MedicalServiceUuid");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalWorking_HospitalUuid",
                table: "HospitalWorking",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_HospitalWorking_WorkingUuid",
                table: "HospitalWorking",
                column: "WorkingUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ImportTicket_AccountUuid",
                table: "ImportTicket",
                column: "AccountUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ImportTicket_HospitalUuid",
                table: "ImportTicket",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ImportTicket_ProviderUuid",
                table: "ImportTicket",
                column: "ProviderUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ImportTicketDetail_ImportTicketUuid",
                table: "ImportTicketDetail",
                column: "ImportTicketUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ImportTicketDetail_MedicineUuid",
                table: "ImportTicketDetail",
                column: "MedicineUuid");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineInventory_HospitalUuid",
                table: "MedicineInventory",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_MedicineInventory_MedicineUuid",
                table: "MedicineInventory",
                column: "MedicineUuid");

            migrationBuilder.CreateIndex(
                name: "IX_PatientProfile_AccountUuid",
                table: "PatientProfile",
                column: "AccountUuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientProfile_Email",
                table: "PatientProfile",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_AppointmentUuid",
                table: "Prescription",
                column: "AppointmentUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_DoctorProfileUuid",
                table: "Prescription",
                column: "DoctorProfileUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_HospitalUuid",
                table: "Prescription",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Prescription_PatientProfileUuid",
                table: "Prescription",
                column: "PatientProfileUuid");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionDetail_MedicineUuid",
                table: "PrescriptionDetail",
                column: "MedicineUuid");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionDetail_PrescriptionUuid",
                table: "PrescriptionDetail",
                column: "PrescriptionUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewDoctor_DoctorUuid",
                table: "ReviewDoctor",
                column: "DoctorUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewDoctor_PatientUuid",
                table: "ReviewDoctor",
                column: "PatientUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewHospital_HospitalUuid",
                table: "ReviewHospital",
                column: "HospitalUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewHospital_PatientUuid",
                table: "ReviewHospital",
                column: "PatientUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewMedicalService_MedicalServiceUuid",
                table: "ReviewMedicalService",
                column: "MedicalServiceUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewMedicalService_PatientUuid",
                table: "ReviewMedicalService",
                column: "PatientUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Role_Name",
                table: "Role",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_PermissionUuid",
                table: "RolePermission",
                column: "PermissionUuid");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_RoleUuid_PermissionUuid_Action",
                table: "RolePermission",
                columns: new[] { "RoleUuid", "PermissionUuid", "Action" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Room_HospitalUuid",
                table: "Room",
                column: "HospitalUuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentMedicalService");

            migrationBuilder.DropTable(
                name: "DoctorDepartment");

            migrationBuilder.DropTable(
                name: "DoctorWorkingHour");

            migrationBuilder.DropTable(
                name: "ExportTicketDetail");

            migrationBuilder.DropTable(
                name: "HospitalDepartment");

            migrationBuilder.DropTable(
                name: "HospitalMedicalService");

            migrationBuilder.DropTable(
                name: "HospitalWorking");

            migrationBuilder.DropTable(
                name: "ImportTicketDetail");

            migrationBuilder.DropTable(
                name: "MedicineInventory");

            migrationBuilder.DropTable(
                name: "PrescriptionDetail");

            migrationBuilder.DropTable(
                name: "ReviewDoctor");

            migrationBuilder.DropTable(
                name: "ReviewHospital");

            migrationBuilder.DropTable(
                name: "ReviewMedicalService");

            migrationBuilder.DropTable(
                name: "RolePermission");

            migrationBuilder.DropTable(
                name: "DoctorSchedule");

            migrationBuilder.DropTable(
                name: "ExportTicket");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "ImportTicket");

            migrationBuilder.DropTable(
                name: "Medicine");

            migrationBuilder.DropTable(
                name: "Prescription");

            migrationBuilder.DropTable(
                name: "MedicalService");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "Provider");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "DoctorProfile");

            migrationBuilder.DropTable(
                name: "PatientProfile");

            migrationBuilder.DropTable(
                name: "Room");

            migrationBuilder.DropTable(
                name: "TimeWorking");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Hospital");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
