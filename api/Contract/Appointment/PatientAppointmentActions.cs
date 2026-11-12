namespace api.Contract.Appointment;

public sealed class ReschedulePatientAppointmentRequest
{
    public Guid AccountUuid { get; init; }
    public DateTime AppointmentAt { get; init; }
}

public sealed class CancelPatientAppointmentRequest
{
    public Guid AccountUuid { get; init; }
}
