import { httpClient } from "@/lib/http/client";
import { ApiResponse } from "@/lib/http/response";
import {
    MedicineDetailDto,
    MedicineDto,
    MedicineQueryDto,
    PaginatedResult,
} from "@/types/medicine";

export const MedicineService = {
    getAvailableMedicines: async (
        query: MedicineQueryDto
    ): Promise<PaginatedResult<MedicineDto>> => {
        const response = await httpClient.get<ApiResponse<PaginatedResult<MedicineDto>>>(
            "/api/AvailableMedicine",
            {
                params: {
                    pageIndex: query.pageIndex,
                    pageSize: query.pageSize,
                    search: query.search || undefined,
                    unit: query.unit || undefined,
                    stockStatus: query.stockStatus || undefined,
                },
            }
        );

        const resData = response.data as any;
        if (resData && resData.data) {
            return resData.data;
        }
        return resData || { items: [], pageIndex: 1, pageSize: 5, totalCount: 0, totalPages: 1 };
    },

    getMedicineUnits: async (): Promise<string[]> => {
        const response = await httpClient.get<ApiResponse<string[]>>(
            "/api/AvailableMedicine/units"
        );

        const resData = response.data as any;
        if (resData && resData.data && Array.isArray(resData.data)) {
            return resData.data;
        }
        return Array.isArray(resData) ? resData : [];
    },

    getMedicineDetail: async (uuid: string): Promise<MedicineDetailDto> => {
        const response = await httpClient.get<ApiResponse<MedicineDetailDto>>(
            `/api/AvailableMedicine/${uuid}`
        );

        const resData = response.data as any;
        return resData?.data ?? resData;
    },
};