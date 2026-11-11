using api.Lib;

namespace api.Service;

public sealed class PatientService(DBContext dBContext)
{
    public async Task GetPatientInfoAsync(Guid patientUuid)
    {
        
    }

    public async Task GetHistoryAppointmentAsync(Guid patientUuid)
    {
        
    }

    public async Task GetHistoryOrderAsync(Guid patientUuid)
    {
        
    }
}