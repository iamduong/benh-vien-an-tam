"use client";

import { ArrowDownToLine, ArrowUpFromLine, Eye, FileDown, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { INTERNAL_PAGE_SIZE, PortalPageHeader, PortalPagination, PortalSection, PortalTable, StatusPill } from "@/components/internal/portal-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMedicineUnitLabel } from "@/lib/medicine-units";
import { warehouseService, type WarehouseInventory } from "@/lib/services/warehouse/WarehouseService";
import { cn } from "@/lib/utils";
import { Empty, Field, FilterSelect, SummaryCard } from "../warehouse-ticket-ui";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

export function InventoryListScreen() {
  const [items, setItems] = useState<WarehouseInventory[]>([]);
  const [query, setQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<WarehouseInventory | null>(null);
  const [exporting, setExporting] = useState<WarehouseInventory | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => setItems((await warehouseService.getInventory(signal)).data), []);
  useEffect(() => { const controller = new AbortController(); void Promise.resolve().then(() => load(controller.signal)); return () => controller.abort(); }, [load]);

  const filtered = useMemo(() => items
    .filter((item) => (!query.trim() || item.medicineName.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi"))) &&
      (unitFilter === "all" || item.unit === unitFilter) &&
      (stockFilter === "all" || inventoryStockLevel(item) === stockFilter))
    .sort((left, right) => compareInventory(left, right, sort)), [items, query, sort, stockFilter, unitFilter]);
  const unitOptions = Array.from(new Set(items.map((item) => item.unit))).sort((left, right) => getMedicineUnitLabel(left).localeCompare(getMedicineUnitLabel(right), "vi"));
  const totalPages = Math.max(1, Math.ceil(filtered.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * INTERNAL_PAGE_SIZE, safePage * INTERNAL_PAGE_SIZE);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const warningCount = items.filter((item) => inventoryStockLevel(item) !== "healthy").length;

  async function createExport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!exporting || quantity < 1 || quantity > exporting.quantity) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await warehouseService.createExport({ note, details: [{ medicineUuid: exporting.medicineUuid, quantity, price: exporting.price }] });
      await load();
      setExporting(null);
      setQuantity(1);
      setNote("");
      setMessage("Đã tạo phiếu xuất ở trạng thái chờ xác nhận. Tồn kho chưa bị trừ.");
    } catch {
      setError("Không thể tạo phiếu xuất. Vui lòng kiểm tra dữ liệu và thử lại.");
    } finally {
      setBusy(false);
    }
  }

  const rows = paginated.map((item) => [
    <div key={`${item.uuid}-medicine`}><p className="font-semibold text-[#173b57]">{item.medicineName}</p><p className="mt-1 text-xs text-muted-foreground">Cập nhật {dateTime.format(new Date(item.updatedAt))}</p></div>,
    getMedicineUnitLabel(item.unit),
    <span key={`${item.uuid}-quantity`} className="font-semibold">{item.quantity}</span>,
    item.minimumQuantity,
    money.format(item.price),
    <span key={`${item.uuid}-value`} className="font-semibold">{money.format(item.quantity * item.price)}</span>,
    <InventoryPill key={`${item.uuid}-stock`} item={item} />,
    <div key={`${item.uuid}-actions`} className="flex min-w-max gap-1"><Button type="button" size="icon-sm" variant="ghost" title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setSelectedItem(item)}><Eye /></Button><Link href="/noi-bo/trang-tong/nhap-hang" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}><ArrowDownToLine />Nhập hàng</Link><Button type="button" size="sm" variant="outline" disabled={item.quantity <= 0} onClick={() => { setExporting(item); setSelectedItem(null); setQuantity(1); setNote(""); }}><ArrowUpFromLine />Xuất hàng</Button></div>,
  ]);

  return <div className="space-y-6">
    <PortalPageHeader eyebrow="Kho chi nhánh" title="Tồn kho" description="Theo dõi số lượng, giá trị và mức tồn thuốc của bệnh viện đang đăng nhập." actions={<Button type="button" variant="outline" disabled={!filtered.length} onClick={() => printInventoryList(filtered)}><FileDown />In / lưu PDF</Button>} />
    {message ? <p role="status" className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
    {error ? <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Loại thuốc trong kho" value={String(items.length)} detail={`${filtered.length} loại phù hợp bộ lọc`} />
      <SummaryCard label="Tổng số lượng" value={totalQuantity.toLocaleString("vi-VN")} detail="Tổng đơn vị thuốc đang quản lý" />
      <SummaryCard label="Cần chú ý" value={String(warningCount)} detail="Thuốc dưới ngưỡng hoặc đã hết" tone={warningCount ? "amber" : "green"} />
      <SummaryCard label="Giá trị tồn kho" value={money.format(totalValue)} detail="Tính theo đơn giá danh mục" />
    </div>
    {exporting ? <PortalSection title={`Tạo phiếu xuất · ${exporting.medicineName}`} description="Phiếu sẽ ở trạng thái chờ xác nhận và chưa trừ tồn kho."><form onSubmit={(event) => void createExport(event)} className="grid gap-4 p-5 md:grid-cols-3"><Field label="Thuốc"><Input value={exporting.medicineName} disabled /></Field><Field label="Tồn hiện tại"><Input value={`${exporting.quantity} ${getMedicineUnitLabel(exporting.unit)}`} disabled /></Field><Field label="Số lượng xuất *"><Input type="number" min={1} max={exporting.quantity} required value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></Field><div className="space-y-2 md:col-span-3"><Label>Ghi chú phiếu</Label><Textarea value={note} maxLength={1000} rows={3} placeholder="Bộ phận nhận, mục đích xuất, người nhận..." onChange={(event) => setNote(event.target.value)} /></div><div className="flex flex-wrap gap-2 border-t pt-4 md:col-span-3"><Button type="button" variant="outline" disabled={busy} onClick={() => setExporting(null)}>Đóng</Button><Button type="submit" disabled={busy || quantity < 1 || quantity > exporting.quantity}><ArrowUpFromLine />{busy ? "Đang lưu..." : "Lưu phiếu chờ duyệt"}</Button><p className="self-center text-sm text-muted-foreground">Tồn dự kiến sau xác nhận: <strong className="text-foreground">{exporting.quantity - quantity}</strong></p></div></form></PortalSection> : null}
    {selectedItem ? <PortalSection title={selectedItem.medicineName} description="Chi tiết tồn kho tại bệnh viện" action={<Button type="button" size="icon-sm" variant="ghost" aria-label="Đóng chi tiết" onClick={() => setSelectedItem(null)}>×</Button>}><div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4"><InventoryDetail label="Đơn vị" value={getMedicineUnitLabel(selectedItem.unit)} /><InventoryDetail label="Tồn hiện tại" value={selectedItem.quantity.toLocaleString("vi-VN")} /><InventoryDetail label="Ngưỡng tối thiểu" value={selectedItem.minimumQuantity.toLocaleString("vi-VN")} /><InventoryDetail label="Đơn giá" value={money.format(selectedItem.price)} /><InventoryDetail label="Giá trị tồn" value={money.format(selectedItem.quantity * selectedItem.price)} /><InventoryDetail label="Cập nhật gần nhất" value={dateTime.format(new Date(selectedItem.updatedAt))} /><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mức tồn</p><div className="mt-2"><InventoryPill item={selectedItem} /></div></div></div></PortalSection> : null}
    <PortalSection title="Danh sách tồn kho" description={`${filtered.length} / ${items.length} loại thuốc`}>
      <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative xl:col-span-2"><span className="sr-only">Tìm thuốc</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm theo tên thuốc..." className="pl-9" /></label>
        <FilterSelect label="Đơn vị" value={unitFilter} onChange={(value) => { setUnitFilter(value); setPage(1); }} options={[{ value: "all", label: "Tất cả đơn vị" }, ...unitOptions.map((unit) => ({ value: unit, label: getMedicineUnitLabel(unit) }))]} />
        <FilterSelect label="Mức tồn" value={stockFilter} onChange={(value) => { setStockFilter(value); setPage(1); }} options={[{ value: "all", label: "Tất cả mức tồn" }, { value: "healthy", label: "Ổn định" }, { value: "low", label: "Dưới ngưỡng" }, { value: "out", label: "Hết hàng" }]} />
        <FilterSelect label="Sắp xếp" value={sort} onChange={(value) => { setSort(value); setPage(1); }} options={[{ value: "name", label: "Tên thuốc A → Z" }, { value: "quantity-desc", label: "Số lượng cao → thấp" }, { value: "quantity-asc", label: "Số lượng thấp → cao" }, { value: "value-desc", label: "Giá trị cao → thấp" }, { value: "price-desc", label: "Đơn giá cao → thấp" }, { value: "updated", label: "Mới cập nhật" }]} />
      </div>
      {rows.length ? <><PortalTable caption="Tồn kho thuốc" columns={["Thuốc", "Đơn vị", "Số lượng", "Tối thiểu", "Đơn giá", "Giá trị tồn", "Mức tồn", "Thao tác"]} rows={rows} /><PortalPagination page={safePage} totalItems={filtered.length} onPageChange={setPage} /></> : <Empty />}
    </PortalSection>
  </div>;
}

function inventoryStockLevel(item: WarehouseInventory) {
  return item.quantity <= 0 ? "out" : item.quantity < item.minimumQuantity ? "low" : "healthy";
}

function compareInventory(left: WarehouseInventory, right: WarehouseInventory, sort: string) {
  if (sort === "quantity-desc") return right.quantity - left.quantity;
  if (sort === "quantity-asc") return left.quantity - right.quantity;
  if (sort === "value-desc") return right.quantity * right.price - left.quantity * left.price;
  if (sort === "price-desc") return right.price - left.price;
  if (sort === "updated") return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  return left.medicineName.localeCompare(right.medicineName, "vi");
}

function InventoryPill({ item }: { item: WarehouseInventory }) {
  const level = inventoryStockLevel(item);
  return <StatusPill tone={level === "out" ? "red" : level === "low" ? "amber" : "green"}>{level === "out" ? "Hết hàng" : level === "low" ? "Dưới ngưỡng" : "Ổn định"}</StatusPill>;
}

function InventoryDetail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1.5 font-semibold text-[#173b57]">{value}</p></div>;
}

function printInventoryList(items: WarehouseInventory[]) {
  const printWindow = window.open("", "_blank", "width=1100,height=760");
  if (!printWindow) return;
  printWindow.opener = null;
  const generatedAt = dateTime.format(new Date());
  const rows = items.map((item, index) => `<tr><td>${index + 1}</td><td>${escapeInventoryHtml(item.medicineName)}</td><td>${escapeInventoryHtml(getMedicineUnitLabel(item.unit))}</td><td class="number">${item.quantity}</td><td class="number">${item.minimumQuantity}</td><td class="number">${money.format(item.price)}</td><td class="number">${money.format(item.quantity * item.price)}</td><td>${inventoryStockLabel(item)}</td></tr>`).join("");
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  printWindow.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Danh sách tồn kho</title><style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#173b57;margin:0;font-size:11px}header{display:flex;justify-content:space-between;border-bottom:2px solid #0a83bd;padding-bottom:14px;margin-bottom:18px}h1{font-size:22px;margin:0 0 5px}.muted{color:#64748b}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#f1f5f9;text-transform:uppercase;font-size:10px}.number{text-align:right}tfoot td{font-weight:700;background:#f8fafc}</style></head><body><header><div><p class="muted">BỆNH VIỆN AN TÂM · KHO THUỐC</p><h1>DANH SÁCH TỒN KHO</h1><strong>${items.length} loại thuốc</strong></div><div class="muted">Xuất lúc ${generatedAt}</div></header><table><thead><tr><th>#</th><th>Tên thuốc</th><th>Đơn vị</th><th class="number">Số lượng</th><th class="number">Tối thiểu</th><th class="number">Đơn giá</th><th class="number">Giá trị tồn</th><th>Mức tồn</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="3">Tổng cộng</td><td class="number">${totalQuantity}</td><td></td><td></td><td class="number">${money.format(totalValue)}</td><td></td></tr></tfoot></table><script>window.addEventListener('load',()=>window.print())<\/script></body></html>`);
  printWindow.document.close();
}

function inventoryStockLabel(item: WarehouseInventory) {
  const level = inventoryStockLevel(item);
  return level === "out" ? "Hết hàng" : level === "low" ? "Dưới ngưỡng" : "Ổn định";
}

function escapeInventoryHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
