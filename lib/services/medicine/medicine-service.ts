import { httpClient } from "@/lib/http/client";
import { ApiResponse } from "@/lib/http/response";
import {
    MedicineDetailDto,
    MedicineDto,
    MedicineQueryDto,
    PaginatedResult,
    MedicineUnitDto,
    StockStatusFilter,
    AvailableMedicineApiDto,
} from "@/types/medicine";

const mapStockStatus = (status: string): StockStatusFilter => {
    switch (status) {
        case "Còn hàng":
            return StockStatusFilter.InStock;

        case "Sắp hết":
            return StockStatusFilter.LowStock;

        case "Hết hàng":
            return StockStatusFilter.OutOfStock;

        default:
            return StockStatusFilter.InStock;
    }
};

const mapMedicine = (item: AvailableMedicineApiDto): MedicineDto => ({
    uuid: item.medicineUuid,
    name: item.name,
    unit: item.unitName,
    price: item.price,
    stock: item.quantity,
    minStock: item.minimumQuantity,
    status: mapStockStatus(item.stockStatus),
});

export const MedicineService = {
    getAvailableMedicines: async (
        query: MedicineQueryDto
    ): Promise<PaginatedResult<MedicineDto>> => {
        const response = await httpClient.get("/AvailableMedicine", {
            params: query,
        });

        const data = response.data;

        return {
            items: data.items.map(mapMedicine),
            totalCount: data.totalItems,
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalPages: Math.ceil(data.totalItems / data.pageSize),
        };
    },

    getMedicineUnits: async (): Promise<MedicineUnitDto[]> => {
        const response = await httpClient.get<MedicineUnitDto[]>(
            "/AvailableMedicine/units"
        );

        return response.data;
    },

    getMedicineDetail: async (uuid: string): Promise<MedicineDetailDto> => {
        const response = await httpClient.get<ApiResponse<MedicineDetailDto>>(
            `/AvailableMedicine/${uuid}`
        );

        return response.data.data;
    },
};
