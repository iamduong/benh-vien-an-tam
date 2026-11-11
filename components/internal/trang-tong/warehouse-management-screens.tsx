"use client";

import { ArrowDownToLine, ArrowUpFromLine, Check, Eye, FileDown, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { INTERNAL_PAGE_SIZE, PortalPageHeader, PortalPagination, PortalSection, PortalTable, StatusPill } from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { compareTickets, FilterSelect, printTicket, SummaryCard, TicketDetail, TicketForm, ticketCode, ticketTotal, type DraftLine } from "@/components/internal/trang-tong/warehouse-ticket-ui";
import { getMedicineUnitLabel } from "@/lib/medicine-units";
import { warehouseService, type WarehouseInventory, type WarehouseMedicine, type WarehouseOptions, type WarehouseProvider, type WarehouseTicket } from "@/lib/services/warehouse/WarehouseService";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
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

export function StockMovementScreen({ kind }: { kind: "imports" | "exports" }) {
  const isImport = kind === "imports";
  const [tickets, setTickets] = useState<WarehouseTicket[]>([]);
  const [options, setOptions] = useState<WarehouseOptions>({ medicines: [], providers: [] });
  const [inventory, setInventory] = useState<WarehouseInventory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<WarehouseTicket | null>(null);
  const [providerUuid, setProviderUuid] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [medicineFilter, setMedicineFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const load = useCallback(async (signal?: AbortSignal) => { const [ticketResponse, optionResponse, inventoryResponse] = await Promise.all([isImport ? warehouseService.getImports(signal) : warehouseService.getExports(signal), warehouseService.getOptions(signal), warehouseService.getInventory(signal)]); setTickets(ticketResponse.data); setOptions(optionResponse.data); setInventory(inventoryResponse.data); }, [isImport]);
  useEffect(() => { const controller = new AbortController(); void Promise.resolve().then(() => load(controller.signal)); return () => controller.abort(); }, [load]);
  function addLine(medicine?: WarehouseMedicine) { const item = medicine ?? options.medicines.find((candidate) => !lines.some((line) => line.medicineUuid === candidate.uuid) && (isImport || (inventory.find((stock) => stock.medicineUuid === candidate.uuid)?.quantity ?? 0) > 0)); if (item) setLines((current) => [...current, { medicineUuid: item.uuid, quantity: 1, price: item.price }]); }

  const filteredTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return tickets
      .filter((ticket) => {
        const searchable = `${ticket.uuid} ${ticket.providerName ?? ""} ${ticket.note} ${ticket.details.map((item) => item.medicineName).join(" ")}`.toLocaleLowerCase("vi");
        return (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (statusFilter === "all" || ticket.status === statusFilter) &&
          (providerFilter === "all" || ticket.providerUuid === providerFilter) &&
          (medicineFilter === "all" || ticket.details.some((item) => item.medicineUuid === medicineFilter));
      })
      .sort((left, right) => compareTickets(left, right, sort));
  }, [medicineFilter, providerFilter, query, sort, statusFilter, tickets]);
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / INTERNAL_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedTickets = filteredTickets.slice((safePage - 1) * INTERNAL_PAGE_SIZE, safePage * INTERNAL_PAGE_SIZE);
  const pendingCount = tickets.filter((ticket) => ticket.status === "Pending").length;
  const confirmedValue = tickets.filter((ticket) => ticket.status === "Confirmed").reduce((sum, ticket) => sum + ticketTotal(ticket), 0);

  function resetForm() {
    setShowForm(false);
    setEditingUuid(null);
    setProviderUuid("");
    setNote("");
    setLines([]);
  }

  function startCreate() {
    setEditingUuid(null);
    setProviderUuid(options.providers[0]?.uuid ?? "");
    setNote("");
    const firstMedicine = options.medicines.find((medicine) => isImport || (inventory.find((stock) => stock.medicineUuid === medicine.uuid)?.quantity ?? 0) > 0);
    setLines(firstMedicine ? [{ medicineUuid: firstMedicine.uuid, quantity: 1, price: firstMedicine.price }] : []);
    setShowForm(true);
    setError("");
  }

  function startEdit(ticket: WarehouseTicket) {
    if (ticket.status !== "Pending") return;
    setEditingUuid(ticket.uuid);
    setProviderUuid(isImport ? ticket.providerUuid ?? "" : "");
    setNote(ticket.note);
    setLines(ticket.details.map((item) => ({ medicineUuid: item.medicineUuid, quantity: item.quantity, price: item.price })));
    setShowForm(true);
    setSelectedTicket(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length || lines.some((line) => line.quantity < 1 || line.price < 0)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (isImport) {
        const payload = { providerUuid: providerUuid || options.providers[0]?.uuid || "", note, details: lines };
        if (editingUuid) await warehouseService.updateImport(editingUuid, payload);
        else await warehouseService.createImport(payload);
      } else {
        const payload = { note, details: lines };
        if (editingUuid) await warehouseService.updateExport(editingUuid, payload);
        else await warehouseService.createExport(payload);
      }
      await load();
      setMessage(editingUuid ? `Đã cập nhật phiếu ${isImport ? "nhập" : "xuất"} đang chờ xác nhận.` : `Đã tạo phiếu ${isImport ? "nhập" : "xuất"} ở trạng thái chờ xác nhận.`);
      resetForm();
    } catch {
      setError("Không thể lưu phiếu. Vui lòng kiểm tra dữ liệu và thử lại.");
    } finally {
      setBusy(false);
    }
  }

  async function act(ticket: WarehouseTicket, action: "confirm" | "cancel") {
    const prompt = action === "confirm"
      ? `Xác nhận phiếu ${ticketCode(ticket, isImport)}? Tồn kho sẽ được cập nhật và phiếu không thể chỉnh sửa.`
      : `Hủy phiếu ${ticketCode(ticket, isImport)}? Thao tác này không thể hoàn tác.`;
    if (!window.confirm(prompt)) return;
    setBusy(true);
    setError("");
    try {
      await (action === "confirm" ? warehouseService.confirm(kind, ticket.uuid) : warehouseService.cancel(kind, ticket.uuid));
      await load();
      setSelectedTicket(null);
      setMessage(action === "confirm" ? "Đã xác nhận phiếu và cập nhật tồn kho." : "Đã hủy phiếu đang chờ.");
    } catch {
      setError("Không thể xử lý phiếu. Dữ liệu có thể đã được thay đổi, vui lòng tải lại.");
    } finally {
      setBusy(false);
    }
  }

  const rows = paginatedTickets.map((ticket) => [
    <div key={`${ticket.uuid}-code`}><p className="font-mono font-semibold text-[#173b57]">{ticketCode(ticket, isImport)}</p><p className="mt-1 text-xs text-muted-foreground">Tạo {dateTime.format(new Date(ticket.createdAt))}</p></div>,
    isImport ? ticket.providerName || "—" : "Kho thuốc bệnh viện",
    <div key={`${ticket.uuid}-details`} className="max-w-96 whitespace-normal"><p className="font-medium">{ticket.details[0]?.medicineName ?? "Chưa có mặt hàng"}{ticket.details.length > 1 ? ` và ${ticket.details.length - 1} thuốc khác` : ""}</p><p className="mt-1 text-xs text-muted-foreground">{ticket.details.reduce((sum, item) => sum + item.quantity, 0)} đơn vị · {ticket.details.length} mặt hàng</p></div>,
    <span key={`${ticket.uuid}-total`} className="font-semibold">{money.format(ticketTotal(ticket))}</span>,
    <TicketPill key={`${ticket.uuid}-status`} status={ticket.status} />,
    <div key={`${ticket.uuid}-actions`} className="flex min-w-max flex-wrap gap-1">
      <Button type="button" size="icon-sm" variant="ghost" aria-label="Xem chi tiết" title="Xem chi tiết" onClick={() => setSelectedTicket(ticket)}><Eye /></Button>
      <Button type="button" size="icon-sm" variant="ghost" aria-label="In hoặc lưu PDF" title="In hoặc lưu PDF" onClick={() => printTicket(ticket, isImport)}><FileDown /></Button>
      {ticket.status === "Pending" ? <Button type="button" size="icon-sm" variant="ghost" aria-label="Chỉnh sửa phiếu" title="Chỉnh sửa phiếu" disabled={busy} onClick={() => startEdit(ticket)}><Pencil /></Button> : null}
      {ticket.status === "Pending" ? <><Button type="button" size="sm" disabled={busy} onClick={() => void act(ticket, "confirm")}><Check />Xác nhận</Button><Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void act(ticket, "cancel")}>Hủy phiếu</Button></> : null}
    </div>,
  ]);

  return <div className="space-y-6">
    <PortalPageHeader eyebrow="Nghiệp vụ kho" title={isImport ? "Nhập hàng" : "Xuất hàng"} description={isImport ? "Lập, kiểm tra và duyệt phiếu nhập thuốc. Tồn kho chỉ được cộng sau khi phiếu được xác nhận." : "Xuất thuốc khỏi kho; hệ thống kiểm tra tồn trước khi xác nhận."} actions={<Button onClick={startCreate}>{isImport ? <ArrowDownToLine /> : <ArrowUpFromLine />}{isImport ? "Tạo phiếu nhập" : "Tạo phiếu xuất"}</Button>} />
    {message ? <p role="status" className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
    {error ? <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryCard label="Tổng số phiếu" value={String(tickets.length)} detail={`${filteredTickets.length} phiếu phù hợp bộ lọc`} />
      <SummaryCard label="Chờ xác nhận" value={String(pendingCount)} detail="Có thể chỉnh sửa hoặc hủy" tone={pendingCount ? "amber" : "green"} />
      <SummaryCard label="Giá trị đã xác nhận" value={money.format(confirmedValue)} detail="Đã được ghi nhận vào tồn kho" />
    </div>
    {showForm ? <TicketForm isImport={isImport} editing={Boolean(editingUuid)} busy={busy} options={options} inventory={inventory} providerUuid={providerUuid} setProviderUuid={setProviderUuid} note={note} setNote={setNote} lines={lines} setLines={setLines} onAddLine={() => addLine()} onCancel={resetForm} onSubmit={saveTicket} /> : null}
    {selectedTicket ? <TicketDetail ticket={selectedTicket} isImport={isImport} onClose={() => setSelectedTicket(null)} onPrint={() => printTicket(selectedTicket, isImport)} onEdit={selectedTicket.status === "Pending" ? () => startEdit(selectedTicket) : undefined} /> : null}
    <PortalSection title={`Danh sách phiếu ${isImport ? "nhập" : "xuất"}`} description={`${filteredTickets.length} / ${tickets.length} phiếu`}>
      <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="relative xl:col-span-2"><span className="sr-only">Tìm phiếu</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Mã phiếu, tên thuốc, nhà cung cấp..." className="pl-9" /></label>
        <FilterSelect label="Trạng thái" value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} options={[{ value: "all", label: "Tất cả trạng thái" }, { value: "Pending", label: "Chờ xác nhận" }, { value: "Confirmed", label: "Đã xác nhận" }, { value: "Cancelled", label: "Đã hủy" }]} />
        {isImport ? <FilterSelect label="Nhà cung cấp" value={providerFilter} onChange={(value) => { setProviderFilter(value); setPage(1); }} options={[{ value: "all", label: "Tất cả nhà cung cấp" }, ...options.providers.map((item) => ({ value: item.uuid, label: item.name }))]} /> : null}
        <FilterSelect label="Thuốc" value={medicineFilter} onChange={(value) => { setMedicineFilter(value); setPage(1); }} options={[{ value: "all", label: "Tất cả thuốc" }, ...options.medicines.map((item) => ({ value: item.uuid, label: item.name }))]} />
        <FilterSelect label="Sắp xếp" value={sort} onChange={setSort} options={[{ value: "newest", label: "Mới nhất" }, { value: "oldest", label: "Cũ nhất" }, { value: "total-desc", label: "Giá trị cao → thấp" }, { value: "total-asc", label: "Giá trị thấp → cao" }, { value: "medicine", label: "Tên thuốc A → Z" }, ...(isImport ? [{ value: "provider", label: "Nhà cung cấp A → Z" }] : []), { value: "status", label: "Trạng thái" }]} />
      </div>
      {rows.length ? <><PortalTable caption="Phiếu kho" columns={["Mã phiếu", isImport ? "Nhà cung cấp" : "Xuất từ", "Mặt hàng", "Tổng giá trị", "Trạng thái", "Thao tác"]} rows={rows} /><PortalPagination page={safePage} totalItems={filteredTickets.length} onPageChange={setPage} /></> : <Empty />}
    </PortalSection>
  </div>;
}

export function RealInventoryScreen() {
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
    <div key={`${item.uuid}-actions`} className="flex min-w-max gap-1"><Button type="button" size="icon-sm" variant="ghost" title="Xem chi tiết" aria-label="Xem chi tiết" onClick={() => setSelectedItem(item)}><Eye /></Button><Button type="button" size="sm" variant="outline" disabled={item.quantity <= 0} onClick={() => { setExporting(item); setSelectedItem(null); setQuantity(1); setNote(""); }}><ArrowUpFromLine />Xuất hàng</Button></div>,
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

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <div className={`space-y-2 ${wide ? "sm:col-span-2" : ""}`}><Label>{label}</Label>{children}</div>; }
function TicketPill({ status }: { status: WarehouseTicket["status"] }) { return <StatusPill tone={status === "Confirmed" ? "green" : status === "Cancelled" ? "red" : "amber"}>{status === "Confirmed" ? "Đã xác nhận" : status === "Cancelled" ? "Đã hủy" : "Chờ xác nhận"}</StatusPill>; }
function Empty() { return <p className="p-10 text-center text-sm text-muted-foreground">Chưa có dữ liệu.</p>; }
