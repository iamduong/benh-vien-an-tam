
using System.Text;
using System.Text.Json.Serialization;
using api.Lib;
using api.Lib.Setting;
using api.Middleware;
using api.Service;
using api.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var frontendUrl = builder.Configuration["FrontendUrl"] ?? "http://localhost:3000";
        policy.WithOrigins(frontendUrl, "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Controllers and JSON
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()));

// Swagger and OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// Payment configuration
builder.Services.Configure<SepaySetting>(builder.Configuration.GetSection("Sepay"));
// JWT configuration
builder.Services.Configure<JwtSetting>(builder.Configuration.GetSection("Jwt"));
// Cloud configuration
builder.Services.Configure<CloudSetting>(builder.Configuration.GetSection("Cloud"));

// Common services
builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddScoped<Jwt>();
builder.Services.AddScoped<Sepay>();
builder.Services.AddScoped<Cloud>();

// Existing services from main
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<HospitalService>();
builder.Services.AddScoped<DepartmentService>();
builder.Services.AddScoped<MedicineService>();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<TimeWorkingService>();
builder.Services.AddScoped<PermissionService>();
builder.Services.AddScoped<RoleService>();

// Services from your current work
builder.Services.AddScoped<
    IAvailableMedicineService, AvailableMedicineService>();
builder.Services.AddScoped<
    IDoctorProfileService, DoctorProfileService>();
builder.Services.AddScoped<
    IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<
    IDoctorAppointmentService, DoctorAppointmentService>();
builder.Services.AddScoped<
    IClinicalExaminationService, ClinicalExaminationService>();
builder.Services.AddScoped<
    IPrescriptionManagementService, PrescriptionManagementService>();

// PostgreSQL
builder.Services.AddDbContext<DBContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// API documentation
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
