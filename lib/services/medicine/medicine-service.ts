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

interface AvailableMedicineDetailApiDto {
    medicineUuid: string;
    code: string;
    name: string;
    image: string;
    price: number;
    unit: number;
    unitName: string;
    quantity: number;
    minimumQuantity: number;
    stockStatus: string;
    isInsured: boolean;
    insuranceCap: number;
    description?: string;
}

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
        const response = await httpClient.get<
            AvailableMedicineDetailApiDto | ApiResponse<AvailableMedicineDetailApiDto>
        >(`/AvailableMedicine/${uuid}`);

        const raw =
            "data" in response.data && response.data.data
                ? response.data.data
                : (response.data as AvailableMedicineDetailApiDto);

        return {
            uuid: raw.medicineUuid,
            name: raw.name,
            unit: raw.unitName,
            price: raw.price,
            stock: raw.quantity,
            minStock: raw.minimumQuantity,
            status: mapStockStatus(raw.stockStatus),
            isInsured: raw.isInsured,
            insuranceCap: raw.insuranceCap,
            description: raw.description?.trim() ? raw.description : null,
            imageUrl: raw.image?.trim() ? raw.image : null,
        };
    },
};
