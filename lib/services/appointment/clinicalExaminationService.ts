import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { ClinicalMedicalService, ClinicalMedicalServiceStatus, ClinicalMedicineOption } from "@/types/internal-clinical";

export const clinicalExaminationService = {
    async addService(appointmentUuid: string, medicalServiceUuid: string): Promise<ClinicalMedicalService> {
        const res = await httpClient.post<ApiResponse<ClinicalMedicalService>>(`/internal/clinical/appointments/${appointmentUuid}/medical-services`, {
            medicalServiceUuid: medicalServiceUuid,
        });
        return res.data.data;
    },

    async updateService(appointmentUuid: string, serviceUuid: string, description: string, status: ClinicalMedicalServiceStatus): Promise<ClinicalMedicalService> {
        const res = await httpClient.put<ApiResponse<ClinicalMedicalService>>(`/internal/clinical/appointments/${appointmentUuid}/medical-services/${serviceUuid}`, {
            description: description,
            status: status,
        });
        return res.data.data;
    },

    async saveDiagnosis(appointmentUuid: string, doctorNote: string): Promise<boolean> {
        const res = await httpClient.post<ApiResponse<boolean>>(`/internal/clinical/appointments/${appointmentUuid}/diagnosis`, {
            doctorNote: doctorNote,
        });
        return res.data.data;
    },

    async searchMedicines(keyword: string, signal?: AbortSignal): Promise<ClinicalMedicineOption[]> {
        const res = await httpClient.get<ApiResponse<ClinicalMedicineOption[]>>("/internal/clinical/medicines/search", {
            params: { keyword },
            signal,
        });
        return res.data.data;
    }
};
