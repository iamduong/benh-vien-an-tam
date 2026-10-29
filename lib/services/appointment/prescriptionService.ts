import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { Prescription } from "@/types/internal-clinical";

export const prescriptionService = {
    async getPrescription(appointmentUuid: string, signal?: AbortSignal): Promise<Prescription | null> {
        try {
            const res = await httpClient.get<ApiResponse<Prescription>>(`/internal/clinical/appointments/${appointmentUuid}/prescription`, { signal });
            return res.data.data;
        } catch {
            return null;
        }
    },

    async savePrescription(appointmentUuid: string, note: string, items: Array<{
        medicineUuid: string;
        quantity: number;
        quantityPerDose: number;
        dosesPerDay: number;
        duration: number;
        note: string;
    }>): Promise<Prescription> {
        const res = await httpClient.post<ApiResponse<Prescription>>(`/internal/clinical/appointments/${appointmentUuid}/prescription`, {
            note: note,
            Items: items,
        });
        return res.data.data;
    }
};