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
                name: "AuditLog",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLog", x => x.Uuid);
                });

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
                name: "MomoLog",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MomoLog", x => x.Uuid);
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
                name: "ServiceWorking",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    WorkingUuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceWorking", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_ServiceWorking_MedicalService_ServiceUuid",
                        column: x => x.ServiceUuid,
                        principalTable: "MedicalService",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_ServiceWorking_TimeWorking_WorkingUuid",
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
                    Price = table.Column<int>(type: "integer", nullable: false),
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
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DepartmentUuid = table.Column<Guid>(type: "uuid", nullable: true)
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
                name: "DoctorWorking",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    WorkingUuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorWorking", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_DoctorWorking_DoctorProfile_DoctorUuid",
                        column: x => x.DoctorUuid,
                        principalTable: "DoctorProfile",
                        principalColumn: "Uuid");
                    table.ForeignKey(
                        name: "FK_DoctorWorking_TimeWorking_WorkingUuid",
                        column: x => x.WorkingUuid,
                        principalTable: "TimeWorking",
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
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PatientUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    HospitalUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    DoctorUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    MedicalServiceUuid = table.Column<Guid>(type: "uuid", nullable: true),
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
                        name: "FK_Appointment_MedicalService_MedicalServiceUuid",
                        column: x => x.MedicalServiceUuid,
                        principalTable: "MedicalService",
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
                table: "Permission",
                columns: new[] { "Uuid", "Description", "Icon", "Name", "Scope", "Slug" },
                values: new object[,]
                {
                    { new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), "Kho thuốc", "medicine", "Điều chỉnh tồn", 1, "dieu-chinh-ton" },
                    { new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), "Khám chữa bệnh", "dashboard", "Tổng quan bác sĩ", 1, "tong-quan-bac-si" },
                    { new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), "Khám chữa bệnh", "medicine", "Thuốc khả dụng", 1, "thuoc-kha-dung" },
                    { new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), "Kho thuốc", "history", "Lịch sử kho", 1, "lich-su" },
                    { new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), "Tiếp nhận và điều phối", "payment", "Thanh toán & cấp thuốc", 1, "thanh-toan-cap-thuoc" },
                    { new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), "Quản trị hệ thống", "service", "Dịch vụ", 0, "dich-vu" },
                    { new Guid("52edd052-303c-462a-9a27-70bd3c37cbcf"), "Vận hành chi nhánh", "inventory", "Kho thuốc", 1, "kho-thuoc" },
                    { new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), "Quản trị hệ thống", "schedule", "Khung giờ làm việc", 0, "khung-gio-lam-viec" },
                    { new Guid("69f59a3e-4d01-44fa-817a-5ff8e1ba4208"), "Vận hành chi nhánh", "audit", "Nhật ký hoạt động", 1, "nhat-ky-chi-nhanh" },
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
                    { new Guid("8f39ace5-80cf-4f90-9d2d-7ac3e0e4c247"), "Tiếp nhận và điều phối", "room", "Phòng khám", 1, "phong-kham-tiep-nhan" },
                    { new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), "Kho thuốc", "ticket", "Phiếu nhập xuất", 1, "phieu-nhap-xuat" },
                    { new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), "Vận hành chi nhánh", "schedule", "Giờ làm việc bệnh viện", 1, "gio-lam-viec-benh-vien" },
                    { new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), "Khám chữa bệnh", "schedule", "Giờ làm việc", 1, "gio-lam-viec-bac-si" },
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
                    { new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), "Tiếp nhận và điều phối", "appointment", "Lịch hẹn", 1, "lich-hen-tiep-nhan" },
                    { new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), "Vận hành chi nhánh", "department", "Chuyên khoa & dịch vụ", 1, "chuyen-khoa-dich-vu" },
                    { new Guid("ef48a2e3-5f42-44d5-a3b9-68853f2db70d"), "Vận hành chi nhánh", "prescription", "Đơn thuốc", 1, "don-thuoc-chi-nhanh" },
                    { new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), "Tiếp nhận và điều phối", "dashboard", "Tổng quan lễ tân", 1, "tong-quan-tiep-nhan" },
                    { new Guid("fb8ec9b7-1625-4eba-bb6e-14893287cda4"), "Tiếp nhận và điều phối", "review", "Đánh giá", 1, "danh-gia-tiep-nhan" }
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
                table: "Account",
                columns: new[] { "Uuid", "CreatedAt", "DeletedAt", "HospitalUuid", "Password", "Phone", "RoleUuid", "Status", "UpdatedAt" },
                values: new object[] { new Guid("b5c30c02-2fcb-4ae5-99db-15debd3ab001"), new DateTime(2026, 10, 13, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "$2a$12$W1mt0UsXqdFWuoc0vT3lUuk1pPbK2HzmYhQCDWmH6bZGMmRvrfhkW", "0900000000", new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8"), 0, new DateTime(2026, 10, 13, 0, 0, 0, 0, DateTimeKind.Utc) });

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
                    { new Guid("0356dd1d-007e-e49e-abb7-bc6556633d49"), 3, new Guid("fb8ec9b7-1625-4eba-bb6e-14893287cda4"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("06a1f372-3f9c-6811-1adc-10a7b01ac81b"), 1, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("06a56aae-cf9c-3d03-9f85-c0783c80be1c"), 1, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("08e046bd-35f5-d294-05f3-b95afd3ae819"), 0, new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("0aa7499e-1793-8d93-0ce7-b73fca3fc914"), 2, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("0bee497d-c238-1c2c-6377-c6c2038b0825"), 0, new Guid("69f59a3e-4d01-44fa-817a-5ff8e1ba4208"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("0dce1f69-eed9-bb28-c23c-dfbf34f15c99"), 1, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("0e1155f1-0e5a-22d9-8efc-058dfe2d291a"), 3, new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("0e27ce44-9a93-0a3e-6e42-6ab10640dace"), 2, new Guid("869dd7d5-cc15-4651-b565-d001a813bc41"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("1079fafc-f017-5f33-d01c-ce3db6d2ccf6"), 2, new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("1d867270-7d07-da9a-0c8d-aca4d7b6f60a"), 1, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("21fdc1d3-a9ab-40a8-2ec9-f7702c652454"), 3, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("224c9e21-88fb-e110-2953-01cf196a7e04"), 2, new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("22712642-c9ee-a3db-31ed-5bfa907e02cb"), 2, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("22ebb9de-3172-f44d-1c1d-393a6c665859"), 0, new Guid("ef48a2e3-5f42-44d5-a3b9-68853f2db70d"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("25f5992a-cf68-1beb-6750-49bda99e9708"), 0, new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("280ad22f-c00e-8d05-9a6e-7b1ae2f54d4f"), 2, new Guid("d906ec34-3b76-4827-b3c2-9b2dd800c718"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("2c998e5e-d542-1e8d-c4c7-ea60514d2a0e"), 1, new Guid("ef48a2e3-5f42-44d5-a3b9-68853f2db70d"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("2e1b82d4-2aef-cfb2-679a-849e76f67f13"), 0, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("2f65831c-3640-e16f-0272-31388c9b3cf9"), 1, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("2fd82cce-b92d-b2b6-381f-d2938e77c77a"), 2, new Guid("519e14cf-63d5-426d-8e1d-c069dfd4d780"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("3034bb73-d3ad-3022-cb66-aff02f51f7c7"), 2, new Guid("69f59a3e-4d01-44fa-817a-5ff8e1ba4208"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("30395517-5fcb-301f-9b65-78c7b0463899"), 1, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("30fe9ce0-f8a2-83cc-f3ea-7152f189e517"), 0, new Guid("3d8e5193-cfa3-4ecd-9c69-01a3cf875ba2"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("31f34724-f47e-d550-ec0a-88aaee3337ac"), 3, new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("341f06d0-d1eb-329e-52ed-dcbda9bf2215"), 0, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("37940569-c417-f0b0-8dcc-f9a0592e46d3"), 0, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("37f699f2-3aab-5823-06d6-4c60f39e229e"), 3, new Guid("8f39ace5-80cf-4f90-9d2d-7ac3e0e4c247"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("3925d7e0-3656-071f-93ae-78568b306442"), 2, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("39beb71b-149f-0c3b-75f0-108b11090515"), 0, new Guid("c27f7f8a-1397-4c16-9649-b301ada7842f"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("3a321d6e-3502-6c42-1e33-4189d4cc24fe"), 1, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("3b7eef62-c687-72f0-7775-87f5327d7ebe"), 1, new Guid("8f39ace5-80cf-4f90-9d2d-7ac3e0e4c247"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
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
                    { new Guid("525af95b-18d9-c966-8b11-e20b8818b2c5"), 2, new Guid("ef48a2e3-5f42-44d5-a3b9-68853f2db70d"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("53b28e15-a1fb-7535-8681-56207966b63f"), 3, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("546d20ee-a24e-be8d-88fd-43d93651424d"), 3, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("5487237d-1f8d-a5b5-9eb0-5eb144f3cc20"), 2, new Guid("88d3176b-809d-45ab-b229-09e62768f26c"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("54a616d1-9e03-4641-44d3-ac65f1d2e4af"), 2, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
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
                    { new Guid("69af6b0d-06cc-0add-d194-c9e39e91c311"), 0, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("6b0958b3-d33e-59c8-3496-046154074229"), 3, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("6b84d046-3d87-8dca-fd4f-7969edfcfe88"), 3, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("6bb71e13-ffba-0171-3061-dbb518f04a65"), 0, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("6e354071-4ffd-680f-1aa1-1f9a14bc6357"), 2, new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("6e6e09f5-7632-a10b-d0a6-d20a4920f9c2"), 3, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("6f1c70c4-da2a-4dff-13c3-ae37efeae333"), 2, new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("71e847a8-32c5-65e3-7a05-f664042d5e06"), 2, new Guid("e2767a1f-f32c-40dc-86ae-b582f114e453"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("73de654f-504a-94ec-5fb3-40d8ecbb35ef"), 3, new Guid("8549e880-ff4a-469c-8cc7-53e5cc3ab4a8"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("756f56d9-e503-e093-edd3-7e2ca9ea1d2e"), 3, new Guid("0e3bf4e7-3f2c-4499-b39f-e6669e7f4298"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("760a8c7c-a071-f278-109a-413480a628f9"), 3, new Guid("2e1486a8-fa76-47a5-a36a-02df91b7c813"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("7b84e48a-0766-074e-a7c0-481e1c6a2840"), 3, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("7e7c489a-ea1a-db7f-1299-fbe172c1b705"), 1, new Guid("fb8ec9b7-1625-4eba-bb6e-14893287cda4"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("82010e50-b546-5f56-f7de-2a176dd415a2"), 0, new Guid("faf0d27e-c85c-47e2-9aae-4e833372fdaf"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("83f0cf07-1ec2-8618-1c2b-cff0317fecff"), 1, new Guid("b10b0ded-d0f9-4682-baae-5df3c36933b5"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("87093728-fc5f-021c-b3b1-264947313a1a"), 0, new Guid("8f39ace5-80cf-4f90-9d2d-7ac3e0e4c247"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("894b5451-a6ca-a946-f9b7-ef06735ae9fc"), 1, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
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
                    { new Guid("a3f73861-2836-d07f-f6c6-3c196c6b340b"), 1, new Guid("9e2633dc-adb9-4b2c-b01e-e1c3228cf165"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("a672cc9b-f6f7-5b6f-b7ab-39c581c630f8"), 1, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("a7af4758-987c-6ec0-9a61-95b60c2bdd00"), 0, new Guid("ad9a91c6-8a4a-4da2-9aa6-347914360efb"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("a7b44d5e-f859-501d-7a1e-c58da54baeaa"), 3, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("a7dd1130-2a47-ebfe-136b-dcdff09021c0"), 2, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("aabc06ef-c4e0-026c-1421-585e836ae377"), 2, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("aae2f556-79ec-eea0-4bb8-19a9f255b1fc"), 2, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("b0d08679-b53c-3135-06bd-50aa64851a7d"), 1, new Guid("cb86cb65-fda2-45a7-8633-acbd8af9e3b8"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("b1eaab85-c95f-383b-6378-6864f42d7e2a"), 1, new Guid("df01b115-6849-4a46-906b-79339166b797"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("b500ef6d-a5bc-dd9c-c3ea-fd50719f7aae"), 0, new Guid("fb8ec9b7-1625-4eba-bb6e-14893287cda4"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("b6e6cf5d-072d-13e3-18ca-c6f72edbcc30"), 2, new Guid("7e7b7ca9-d117-4d8d-9bea-74f4c707e11e"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("b977f04e-c741-f7a1-a49f-6dfba8a0b406"), 1, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("bb7bdbd3-0429-c078-6e05-e610704ef58a"), 2, new Guid("e8a24ed9-62cc-4188-bd9b-66cec5c6c5d2"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("bbc83b49-4ed6-7152-1986-f2dae8238c3a"), 0, new Guid("eee59a00-8cc0-4f04-a467-d6efb46f7692"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("bccaf1ae-6d2f-6aa3-9c4a-923092acf668"), 3, new Guid("952d3443-6ca0-4001-a67e-5547b2c57f3c"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("be380550-551c-2e4d-bfd3-5eaffca443f9"), 2, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("be5cf44d-58fe-d7f9-eb66-6d9c72b93109"), 2, new Guid("8f39ace5-80cf-4f90-9d2d-7ac3e0e4c247"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("c0dc14b8-d7d1-fea1-6644-4b84d314efec"), 3, new Guid("9a7ed0c1-53bb-4252-8dc5-d76810e583cb"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("c23da37f-dccc-6ef5-2bba-4393d75a3e59"), 1, new Guid("e5bb398e-98f1-4bfb-8afc-efe729ed9532"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("c3ab3bc7-d800-4e88-6430-1b4fe7841fd2"), 3, new Guid("e0bb4c61-9b29-4cbe-b95a-90aaa1703833"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("c575151a-e46c-caa4-a3ec-a26ad5fbaef3"), 3, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("c8534f3d-8f1d-09ca-38fd-f4eb1e958cc9"), 3, new Guid("69f59a3e-4d01-44fa-817a-5ff8e1ba4208"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("c9abd4b5-cb90-a043-49fe-7317a5ab72d2"), 3, new Guid("892e4dbf-a00f-4759-a676-39d5681f8542"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("cc9012c7-16a1-ca03-445f-4f8dcea90489"), 3, new Guid("ef48a2e3-5f42-44d5-a3b9-68853f2db70d"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
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
                    { new Guid("dc5b5b6e-a606-7e56-98ba-5bea9eae90fe"), 2, new Guid("fb8ec9b7-1625-4eba-bb6e-14893287cda4"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("dcf07de8-b7cb-c7c2-71e5-a1a9d8cd7b9d"), 0, new Guid("7328d282-a103-4dda-878f-6bef13cabd64"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("dd913a3d-9a64-147a-4daa-59c51d5f1796"), 0, new Guid("3a8ded95-de99-4ba7-98e6-147328997e06"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("de44205d-318d-0f60-3d17-6590456dd498"), 1, new Guid("5ec6258d-0ba0-40bf-843c-39b90e22a261"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("ded1b71c-d3bc-0247-2dfd-faedf83cec29"), 1, new Guid("69f59a3e-4d01-44fa-817a-5ff8e1ba4208"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
                    { new Guid("dfefaebf-28c1-c630-5178-146db7b6627a"), 0, new Guid("6a64941b-93ae-4e14-a65d-a89a904b2c36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("e07c449d-48a0-7a56-8aaf-9fdd45a98dc3"), 2, new Guid("dfc93bd4-8ba3-40c4-adf9-0f805e23ee26"), new Guid("0811c3b0-f5b6-4572-a136-45b791696ca7") },
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
                    { new Guid("faf994bf-a220-64dd-9918-cb193386991b"), 3, new Guid("ce817bab-056f-4f1f-a31b-22f294eae961"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") },
                    { new Guid("fb353c21-fa45-8e65-5a32-95c181efa800"), 2, new Guid("df8fc1d9-d239-4923-b0a9-613519e8ec36"), new Guid("ac448f86-bbf0-416f-95d0-8a32008880a8") },
                    { new Guid("fbb07902-24a1-66d0-c612-b263c81f2796"), 0, new Guid("abc18357-8581-414d-a48e-5d9e6672a688"), new Guid("bfa1dca7-b976-4c68-a7f4-c3610b3c7a8f") },
                    { new Guid("fc8e67e5-9f48-63d2-8ff1-58539da9d9a2"), 2, new Guid("e8adca19-51ca-4815-809b-20eab76e1d20"), new Guid("ef26813a-7ab9-435c-b5c5-86325dd14946") },
                    { new Guid("ff63c159-04f7-11db-1082-1d6f36058925"), 2, new Guid("0d7511d1-4ed5-478f-ae55-aa0691fb4e7f"), new Guid("5264371e-ea25-47a3-ae34-b10d6a4b5c31") }
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
                name: "IX_Appointment_MedicalServiceUuid",
                table: "Appointment",
                column: "MedicalServiceUuid");

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
                name: "IX_DoctorWorking_DoctorUuid",
                table: "DoctorWorking",
                column: "DoctorUuid");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorWorking_WorkingUuid",
                table: "DoctorWorking",
                column: "WorkingUuid");

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

            migrationBuilder.CreateIndex(
                name: "IX_ServiceWorking_ServiceUuid",
                table: "ServiceWorking",
                column: "ServiceUuid");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceWorking_WorkingUuid",
                table: "ServiceWorking",
                column: "WorkingUuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentMedicalService");

            migrationBuilder.DropTable(
                name: "AuditLog");

            migrationBuilder.DropTable(
                name: "DoctorDepartment");

            migrationBuilder.DropTable(
                name: "DoctorWorking");

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
                name: "MomoLog");

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
                name: "ServiceWorking");

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
                name: "Permission");

            migrationBuilder.DropTable(
                name: "Provider");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "DoctorProfile");

            migrationBuilder.DropTable(
                name: "MedicalService");

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
