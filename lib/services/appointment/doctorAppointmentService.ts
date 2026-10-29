import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type { ClinicalAppointment, ClinicalCaseDetail } from "@/types/internal-clinical";

export const doctorAppointmentService = {
    async getAppointments(date: string, signal?: AbortSignal): Promise<ClinicalAppointment[]> {
        const res = await httpClient.get<ApiResponse<ClinicalAppointment[]>>("/internal/clinical/appointments", {
            params: { date },
            signal,
        });
        return res.data.data.map(item => ({ ...item, appointmentAt: new Date(item.appointmentAt) }));
    },

    async getAppointmentDetail(uuid: string, signal?: AbortSignal): Promise<ClinicalCaseDetail> {
        const res = await httpClient.get<ApiResponse<ClinicalCaseDetail>>(`/internal/clinical/appointments/${uuid}`, {
            signal,
        });
        const data = res.data.data;
        return { ...data, appointmentAt: new Date(data.appointmentAt) };
    },

    async updateStatus(uuid: string, status: string): Promise<boolean> {
        const res = await httpClient.put<ApiResponse<boolean>>(`/internal/clinical/appointments/${uuid}/status`, { status });
        return res.data.data;
    }
};