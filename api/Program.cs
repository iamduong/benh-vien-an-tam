
using System.Text;
using System.Text.Json.Serialization;
using api.Lib;
using api.Lib.Setting;
using api.Middleware;
using api.Service;
using api.Service.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
// builder.Services.AddSwaggerGen(options =>
// {
//     options.CustomSchemaIds(type =>
//         type.FullName?.Replace("+", ".") ?? type.Name);
// });

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
builder.Services.AddScoped<IAvailableMedicineService, AvailableMedicineService>();
builder.Services.AddScoped<IDoctorProfileService, DoctorProfileService>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<IDoctorAppointmentService, DoctorAppointmentService>();
builder.Services.AddScoped<IClinicalExaminationService, ClinicalExaminationService>();
builder.Services.AddScoped<IPrescriptionManagementService, PrescriptionManagementService>();

// namduong note
builder.Services.AddScoped<IPublicService, PublicService>();

// PostgreSQL
builder.Services.AddDbContext<DBContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtSetting>()
    ?? throw new InvalidOperationException("Thiếu cấu hình Jwt.");

if (string.IsNullOrWhiteSpace(jwtConfig.SecretKey))
{
    throw new InvalidOperationException("Jwt:SecretKey không được để trống.");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultForbidScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.SaveToken = false;

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtConfig.SecretKey)),

                ValidateIssuer = false,
                ValidateAudience = false,

                ValidateLifetime = true,
                RequireExpirationTime = true,
                ClockSkew = TimeSpan.Zero,

                NameClaimType = "uuid",
                RoleClaimType = "role"
            };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["access_token"];
                return Task.CompletedTask;
            },

            OnTokenValidated = context =>
            {
                var tokenType = context.Principal?
                    .FindFirst("token_type")?
                    .Value;

                if (tokenType != "access")
                {
                    context.Fail(
                        "Token không phải access token.");
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

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
