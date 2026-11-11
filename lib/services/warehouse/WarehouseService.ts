import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";

export type WarehouseProvider = { uuid: string; name: string; address: string; hotline: string; status: "Active" | "InActive"; createdAt: string; updatedAt: string; deletedAt: string | null };
export type WarehouseMedicine = { uuid: string; name: string; unit: string; price: number };
export type WarehouseDetail = { medicineUuid: string; medicineName: string; unit: string; quantity: number; price: number };
export type WarehouseTicket = { uuid: string; providerUuid?: string; providerName?: string; note: string; status: "Pending" | "Confirmed" | "Cancelled"; createdAt: string; updatedAt: string; details: WarehouseDetail[] };
export type WarehouseInventory = { uuid: string; medicineUuid: string; medicineName: string; unit: string; price: number; quantity: number; minimumQuantity: number; updatedAt: string };
export type WarehouseOptions = { medicines: WarehouseMedicine[]; providers: Array<{ uuid: string; name: string }> };

class WarehouseService {
  private async getData<T>(url: string, signal?: AbortSignal) { return (await httpClient.get<ApiResponse<T>>(url, { signal })).data; }
  getProviders(includeDeleted = true, signal?: AbortSignal) { return this.getData<WarehouseProvider[]>(`/warehouse/providers?includeDeleted=${includeDeleted}`, signal); }
  createProvider(payload: Omit<WarehouseProvider, "uuid" | "createdAt" | "updatedAt" | "deletedAt">) { return httpClient.post<ApiResponse<WarehouseProvider>>("/warehouse/providers", payload).then((response) => response.data); }
  updateProvider(uuid: string, payload: Omit<WarehouseProvider, "uuid" | "createdAt" | "updatedAt" | "deletedAt">) { return httpClient.put<ApiResponse<WarehouseProvider>>(`/warehouse/providers/${uuid}`, payload).then((response) => response.data); }
  deleteProvider(uuid: string) { return httpClient.delete(`/warehouse/providers/${uuid}`); }
  restoreProvider(uuid: string) { return httpClient.post(`/warehouse/providers/${uuid}/restore`); }
  getInventory(signal?: AbortSignal) { return this.getData<WarehouseInventory[]>("/warehouse/inventory", signal); }
  getOptions(signal?: AbortSignal) { return this.getData<WarehouseOptions>("/warehouse/options", signal); }
  getImports(signal?: AbortSignal) { return this.getData<WarehouseTicket[]>("/warehouse/imports", signal); }
  getExports(signal?: AbortSignal) { return this.getData<WarehouseTicket[]>("/warehouse/exports", signal); }
  createImport(payload: { providerUuid: string; note: string; details: Array<{ medicineUuid: string; quantity: number; price: number }> }) { return httpClient.post("/warehouse/imports", payload); }
  updateImport(uuid: string, payload: { providerUuid: string; note: string; details: Array<{ medicineUuid: string; quantity: number; price: number }> }) { return httpClient.put(`/warehouse/imports/${uuid}`, payload); }
  createExport(payload: { note: string; details: Array<{ medicineUuid: string; quantity: number; price: number }> }) { return httpClient.post("/warehouse/exports", payload); }
  updateExport(uuid: string, payload: { note: string; details: Array<{ medicineUuid: string; quantity: number; price: number }> }) { return httpClient.put(`/warehouse/exports/${uuid}`, payload); }
  confirm(kind: "imports" | "exports", uuid: string) { return httpClient.post(`/warehouse/${kind}/${uuid}/confirm`); }
  cancel(kind: "imports" | "exports", uuid: string) { return httpClient.post(`/warehouse/${kind}/${uuid}/cancel`); }
}

export const warehouseService = new WarehouseService();
