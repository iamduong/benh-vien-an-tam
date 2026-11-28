"use client";

import { Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { INTERNAL_PAGE_SIZE, PortalPageHeader, PortalPagination, PortalSection, PortalTable, StatusPill } from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { warehouseService, type WarehouseProvider } from "@/lib/services/warehouse/WarehouseService";
import { Empty, Field } from "../warehouse-ticket-ui";

const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });
type ProviderDraft = { uuid?: string; name: string; address: string; hotline: string; status: "Active" | "InActive" };
const emptyProvider: ProviderDraft = { name: "", address: "", hotline: "", status: "Active" };

export function ProviderManagementScreen() {
  const [items, setItems] = useState<WarehouseProvider[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("current");
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState<ProviderDraft | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => setItems((await warehouseService.getProviders(true, signal)).data), []);
  useEffect(() => { const controller = new AbortController(); void Promise.resolve().then(() => load(controller.signal)); return () => controller.abort(); }, [load]);

  const filtered = items.filter((item) => {
    const deleted = Boolean(item.deletedAt);
    return (!query.trim() || `${item.name} ${item.address} ${item.hotline}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"))) &&
      (status === "all" || item.status === status) &&
      (visibility === "all" || (visibility === "deleted" ? deleted : !deleted));
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * INTERNAL_PAGE_SIZE, safePage * INTERNAL_PAGE_SIZE);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!draft) return;
    if (draft.uuid) await warehouseService.updateProvider(draft.uuid, draft);
    else await warehouseService.createProvider(draft);
    await load(); setDraft(null); setMessage("Đã lưu thông tin nhà cung cấp.");
  }
  async function toggleDeleted(item: WarehouseProvider) { if (item.deletedAt) await warehouseService.restoreProvider(item.uuid); else await warehouseService.deleteProvider(item.uuid); await load(); }

  const rows = paginated.map((item) => [
    <div key={`${item.uuid}-name`}><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.hotline}</p></div>,
    <span key={`${item.uuid}-address`} className="block max-w-80 whitespace-normal">{item.address}</span>,
    <StatusPill key={`${item.uuid}-status`} tone={item.status === "Active" ? "green" : "amber"}>{item.status === "Active" ? "Hoạt động" : "Tạm ngưng"}</StatusPill>,
    item.deletedAt ? <StatusPill key={`${item.uuid}-record`} tone="red">Đã xóa</StatusPill> : <StatusPill key={`${item.uuid}-record`} tone="green">Hiện hành</StatusPill>,
    dateTime.format(new Date(item.updatedAt)),
    <div key={`${item.uuid}-actions`} className="flex gap-1">{!item.deletedAt ? <Button type="button" size="icon-sm" variant="ghost" onClick={() => setDraft({ uuid: item.uuid, name: item.name, address: item.address, hotline: item.hotline, status: item.status })}><Pencil /></Button> : null}<Button type="button" size="sm" variant={item.deletedAt ? "outline" : "destructive"} onClick={() => void toggleDeleted(item)}>{item.deletedAt ? <><RotateCcw />Khôi phục</> : <><Trash2 />Xóa</>}</Button></div>,
  ]);

  return <div className="space-y-6">
    <PortalPageHeader eyebrow="Đối tác cung ứng" title="Quản lý nhà cung cấp" description="Thêm, sửa, xóa, khôi phục và thay đổi trạng thái nhà cung cấp." actions={<Button onClick={() => setDraft({ ...emptyProvider })}><Plus />Thêm nhà cung cấp</Button>} />
    {message ? <p className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
    {draft ? <PortalSection title={draft.uuid ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}><form onSubmit={(event) => void save(event)} className="grid gap-4 p-5 sm:grid-cols-2"><Field label="Tên nhà cung cấp"><Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></Field><Field label="Hotline"><Input value={draft.hotline} onChange={(event) => setDraft({ ...draft, hotline: event.target.value })} required /></Field><Field label="Địa chỉ" wide><Input value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} required /></Field><Field label="Trạng thái" wide><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as "Active" | "InActive" })} className="h-10 w-full rounded-md border px-3"><option value="Active">Hoạt động</option><option value="InActive">Tạm ngưng</option></select></Field><div className="flex gap-2 sm:col-span-2"><Button type="button" variant="outline" onClick={() => setDraft(null)}>Hủy</Button><Button type="submit">Lưu nhà cung cấp</Button></div></form></PortalSection> : null}
    <PortalSection title="Danh sách nhà cung cấp" description={`${filtered.length} kết quả`}><div className="grid gap-3 border-b bg-[#fbfdfe] p-4 md:grid-cols-3"><label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm tên, địa chỉ, hotline" className="pl-9" /></label><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="h-10 rounded-md border bg-white px-3"><option value="all">Tất cả trạng thái</option><option value="Active">Hoạt động</option><option value="InActive">Tạm ngưng</option></select><select value={visibility} onChange={(event) => { setVisibility(event.target.value); setPage(1); }} className="h-10 rounded-md border bg-white px-3"><option value="current">Hiện hành</option><option value="deleted">Đã xóa</option><option value="all">Tất cả</option></select></div>{rows.length ? <><PortalTable caption="Nhà cung cấp" columns={["Nhà cung cấp", "Địa chỉ", "Trạng thái", "Bản ghi", "Cập nhật", "Thao tác"]} rows={rows} /><PortalPagination page={safePage} totalItems={filtered.length} onPageChange={setPage} /></> : <Empty />}</PortalSection>
  </div>;
}
