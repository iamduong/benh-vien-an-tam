using System.ComponentModel.DataAnnotations;

namespace api.Contract.Reception;

public sealed class ReceptionAppointmentResponse
{
    public Guid Uuid { get; init; }
    public string Code { get; init; } = string.Empty;
    public string PatientName { get; init; } = string.Empty;
    public string MedicalCode { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Gender { get; init; } = string.Empty;
    public DateTime AppointmentDate { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public Guid? DoctorUuid { get; init; }
    public string? DoctorName { get; init; }
    public Guid? RoomUuid { get; init; }
    public string? RoomName { get; init; }
    public string Note { get; init; } = string.Empty;
}

public sealed class ReceptionRoomOptionResponse
{
    public Guid Uuid { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public int WaitingCount { get; init; }
    public int SlotLoadCount { get; init; }
    public bool IsDoctorScheduled { get; init; }
    public List<string> ScheduledDoctorNames { get; init; } = [];
    public bool IsRecommended { get; init; }
    public bool CanSelect { get; init; }
    public string? UnavailableReason { get; init; }
}

public sealed class ReceptionRoutingResponse
{
    public ReceptionAppointmentResponse Appointment { get; init; } = new();
    public List<ReceptionRoomOptionResponse> Rooms { get; init; } = [];
    public Guid? RecommendedRoomUuid { get; init; }
    public string Recommendation { get; init; } = string.Empty;
}

public sealed class ReceptionCheckInRequest
{
    [Required]
    public Guid RoomUuid { get; init; }
}
