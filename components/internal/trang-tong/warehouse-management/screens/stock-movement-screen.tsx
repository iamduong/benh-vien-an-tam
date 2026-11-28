"use client";

import { ArrowDownToLine, ArrowUpFromLine, Eye, FileDown, Pencil, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { INTERNAL_PAGE_SIZE, PortalPageHeader, PortalPagination, PortalSection, PortalTable, StatusPill } from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { warehouseService, type WarehouseInventory, type WarehouseOptions, type WarehouseTicket } from "@/lib/services/warehouse/WarehouseService";
import { compareTickets, Empty, FilterSelect, printTicket, SummaryCard, TicketDetail, TicketForm, ticketCode, ticketTotal, type DraftLine } from "../warehouse-ticket-ui";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

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
    setLines([]);
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
    if (!lines.length) return;
    if (lines.some((line) => !Number.isInteger(line.quantity) || line.quantity < 1 || !Number.isFinite(line.price) || line.price < 0)) {
      setError("Vui lòng nhập số lượng (tối thiểu 1) và đơn giá hợp lệ cho tất cả thuốc.");
      return;
    }
    if (new Set(lines.map((line) => line.medicineUuid)).size !== lines.length) {
      setError("Không được thêm trùng thuốc trong cùng một phiếu.");
      return;
    }
    if (!isImport && lines.some((line) => line.quantity > (inventory.find((stock) => stock.medicineUuid === line.medicineUuid)?.quantity ?? 0))) {
      setError("Số lượng xuất không được vượt quá tồn kho hiện tại.");
      return;
    }
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

  async function cancelTicket(ticket: WarehouseTicket) {
    if (!window.confirm(`Hủy phiếu ${ticketCode(ticket, isImport)}? Thao tác này không thể hoàn tác.`)) return;
    setBusy(true);
    setError("");
    try {
      await warehouseService.cancel(kind, ticket.uuid);
      await load();
      setSelectedTicket(null);
      setMessage("Đã hủy phiếu đang chờ.");
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
      {ticket.status === "Pending" ? <Button type="button" size="icon-sm" variant="ghost" aria-label="Chỉnh sửa phiếu" title="Chỉnh sửa phiếu" disabled={busy} onClick={() => startEdit(ticket)}><Pencil /></Button> : null}
      <Button type="button" size="icon-sm" variant="ghost" aria-label="Xuất file PDF" title="Xuất file PDF" onClick={() => printTicket(ticket, isImport)}><FileDown /></Button>
      {ticket.status === "Pending" ? <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => void cancelTicket(ticket)}>Hủy phiếu</Button> : null}
    </div>,
  ]);

  return <div className="space-y-6">
    <PortalPageHeader eyebrow="Nghiệp vụ kho" title={isImport ? "Nhập hàng" : "Xuất hàng"} description={isImport ? "Tạo và quản lý phiếu nhập thuốc. Phiếu đang chờ có thể xem, chỉnh sửa, xuất PDF hoặc hủy." : "Tạo và quản lý phiếu xuất thuốc. Phiếu đang chờ có thể xem, chỉnh sửa, xuất PDF hoặc hủy."} actions={<Button onClick={startCreate}>{isImport ? <ArrowDownToLine /> : <ArrowUpFromLine />}{isImport ? "Tạo phiếu nhập" : "Tạo phiếu xuất"}</Button>} />
    {message ? <p role="status" className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
    {error ? <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryCard label="Tổng số phiếu" value={String(tickets.length)} detail={`${filteredTickets.length} phiếu phù hợp bộ lọc`} />
      <SummaryCard label="Chờ xác nhận" value={String(pendingCount)} detail="Có thể chỉnh sửa hoặc hủy" tone={pendingCount ? "amber" : "green"} />
      <SummaryCard label="Giá trị đã xác nhận" value={money.format(confirmedValue)} detail="Đã được ghi nhận vào tồn kho" />
    </div>
    {showForm ? <TicketForm key={editingUuid ?? "new"} isImport={isImport} editing={Boolean(editingUuid)} busy={busy} options={options} inventory={inventory} providerUuid={providerUuid} setProviderUuid={setProviderUuid} note={note} setNote={setNote} lines={lines} setLines={setLines} onCancel={resetForm} onSubmit={saveTicket} /> : null}
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

function TicketPill({ status }: { status: WarehouseTicket["status"] }) {
  return <StatusPill tone={status === "Confirmed" ? "green" : status === "Cancelled" ? "red" : "amber"}>{status === "Confirmed" ? "Đã xác nhận" : status === "Cancelled" ? "Đã hủy" : "Chờ xác nhận"}</StatusPill>;
}
