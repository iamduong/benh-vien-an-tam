"use client";

import { Check, FileDown, Pencil, Plus, X } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { PortalSection, StatusPill } from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMedicineUnitLabel } from "@/lib/medicine-units";
import type { WarehouseInventory, WarehouseMedicine, WarehouseOptions, WarehouseTicket } from "@/lib/services/warehouse/WarehouseService";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

export type DraftLine = { medicineUuid: string; quantity: number; price: number };

export function TicketForm({ isImport, editing, busy, options, inventory, providerUuid, setProviderUuid, note, setNote, lines, setLines, onAddLine, onCancel, onSubmit }: { isImport: boolean; editing: boolean; busy: boolean; options: WarehouseOptions; inventory: WarehouseInventory[]; providerUuid: string; setProviderUuid: (value: string) => void; note: string; setNote: (value: string) => void; lines: DraftLine[]; setLines: Dispatch<SetStateAction<DraftLine[]>>; onAddLine: () => void; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalValue = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const availableMedicineCount = isImport ? options.medicines.length : options.medicines.filter((medicine) => (inventory.find((item) => item.medicineUuid === medicine.uuid)?.quantity ?? 0) > 0).length;

  return (
    <PortalSection
      title={editing ? `Chỉnh sửa phiếu ${isImport ? "nhập" : "xuất"} đang chờ` : isImport ? "Tạo phiếu nhập hàng" : "Tạo phiếu xuất hàng"}
      description={isImport ? "Phiếu được lưu ở trạng thái chờ xác nhận và chưa làm thay đổi tồn kho." : "Phiếu được lưu ở trạng thái chờ xác nhận và chưa trừ tồn kho."}
    >
      <form onSubmit={onSubmit} className="space-y-6 p-5">
        {isImport ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Field label="Nhà cung cấp *">
              <select required value={providerUuid || options.providers[0]?.uuid || ""} onChange={(event) => setProviderUuid(event.target.value)} className="h-10 w-full rounded-md border px-3 text-sm">
                <option value="" disabled>Chọn nhà cung cấp</option>
                {options.providers.map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}
              </select>
            </Field>
            <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">Trạng thái sau khi lưu: Chờ xác nhận</p>
              <p className="mt-1 text-xs leading-5">Bạn vẫn có thể sửa hoặc hủy phiếu trước khi xác nhận nhập kho.</p>
            </div>
          </div>
        ) : (
          <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Trạng thái sau khi lưu: Chờ xác nhận</p>
            <p className="mt-1 text-xs leading-5">Tồn kho chỉ bị trừ sau khi xác nhận. Trước đó bạn vẫn có thể sửa hoặc hủy phiếu.</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><Label>Danh sách thuốc *</Label><p className="mt-1 text-xs text-muted-foreground">{isImport ? "Nhập số lượng thực nhận và đơn giá nhập cho từng thuốc." : "Nhập số lượng cần xuất; hệ thống hiển thị tồn trước và sau khi xác nhận."}</p></div>
            <Button type="button" size="sm" variant="outline" disabled={busy || lines.length >= availableMedicineCount} onClick={onAddLine}><Plus />Thêm thuốc</Button>
          </div>
          <div className="hidden grid-cols-[minmax(14rem,1fr)_6rem_8rem_8rem_10rem_2.5rem] gap-3 bg-[#f6f9fb] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Tên thuốc</span><span>Đơn vị</span><span>Tồn hiện tại</span><span>Số lượng</span><span>{isImport ? "Giá nhập" : "Đơn giá"}</span><span />
          </div>
          {lines.map((line, index) => (
            <TicketLine key={`${line.medicineUuid}-${index}`} line={line} index={index} lines={lines} medicines={options.medicines} inventory={inventory} isImport={isImport} busy={busy} setLines={setLines} />
          ))}
          {!lines.length ? <p className="border border-dashed p-8 text-center text-sm text-muted-foreground">{!isImport && availableMedicineCount === 0 ? "Kho hiện không có thuốc còn tồn để tạo phiếu xuất." : "Chưa có thuốc trong phiếu. Chọn “Thêm thuốc” để bắt đầu."}</p> : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Field label="Ghi chú phiếu"><Textarea value={note} maxLength={1000} rows={4} placeholder={isImport ? "Ví dụ: số hóa đơn nhà cung cấp, lô hàng, lưu ý khi nhận hàng..." : "Ví dụ: bộ phận nhận, mục đích xuất, người nhận và lưu ý bàn giao..."} onChange={(event) => setNote(event.target.value)} /></Field>
          <div className="space-y-3 border bg-[#fbfdfe] p-4">
            <h3 className="font-semibold text-[#173b57]">Tóm tắt phiếu</h3>
            <SummaryRow label="Số mặt hàng" value={String(lines.length)} />
            <SummaryRow label="Tổng số lượng" value={String(totalQuantity)} />
            <div className="flex justify-between border-t pt-3"><span className="font-medium">Tổng giá trị</span><strong className="text-lg text-primary">{money.format(totalValue)}</strong></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-5">
          <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Đóng</Button>
          <Button type="submit" disabled={busy || !lines.length || (isImport && !(providerUuid || options.providers[0]?.uuid))}>{editing ? <Pencil /> : <Check />}{busy ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Lưu phiếu chờ duyệt"}</Button>
        </div>
      </form>
    </PortalSection>
  );
}

function TicketLine({ line, index, lines, medicines, inventory, isImport, busy, setLines }: { line: DraftLine; index: number; lines: DraftLine[]; medicines: WarehouseMedicine[]; inventory: WarehouseInventory[]; isImport: boolean; busy: boolean; setLines: Dispatch<SetStateAction<DraftLine[]>> }) {
  const medicine = medicines.find((item) => item.uuid === line.medicineUuid);
  const currentStock = inventory.find((item) => item.medicineUuid === line.medicineUuid)?.quantity ?? 0;
  const projectedStock = currentStock + (isImport ? line.quantity : -line.quantity);
  const update = (values: Partial<DraftLine>) => setLines((current) => current.map((item, position) => position === index ? { ...item, ...values } : item));

  return (
    <div className="grid gap-3 border p-3 md:grid-cols-[minmax(14rem,1fr)_6rem_8rem_8rem_10rem_2.5rem] md:items-start">
      <label className="space-y-1.5">
        <span className="text-xs font-medium md:sr-only">Tên thuốc</span>
        <select required aria-label={`Tên thuốc dòng ${index + 1}`} value={line.medicineUuid} onChange={(event) => { const selected = medicines.find((item) => item.uuid === event.target.value); update({ medicineUuid: event.target.value, price: selected?.price ?? line.price }); }} className="h-10 w-full rounded-md border px-3 text-sm">
          {medicines.map((item) => <option key={item.uuid} value={item.uuid} disabled={item.uuid !== line.medicineUuid && (lines.some((candidate) => candidate.medicineUuid === item.uuid) || (!isImport && (inventory.find((stock) => stock.medicineUuid === item.uuid)?.quantity ?? 0) <= 0))}>{item.name}</option>)}
        </select>
        {medicine ? <span className="block text-xs text-muted-foreground">Giá danh mục: {money.format(medicine.price)}</span> : null}
      </label>
      <label className="space-y-1.5"><span className="text-xs font-medium md:sr-only">Đơn vị</span><Input aria-label={`Đơn vị dòng ${index + 1}`} value={medicine ? getMedicineUnitLabel(medicine.unit) : "—"} disabled /></label>
      <div className="space-y-1.5"><span className="text-xs font-medium md:sr-only">Tồn hiện tại</span><div className="flex h-10 items-center rounded-md border bg-muted/40 px-3 text-sm font-semibold">{currentStock}</div><span className={`block text-xs ${projectedStock < 0 ? "text-red-600" : "text-muted-foreground"}`}>Sau xác nhận: {projectedStock}</span></div>
      <label className="space-y-1.5"><span className="text-xs font-medium md:sr-only">Số lượng</span><Input aria-label={`Số lượng dòng ${index + 1}`} type="number" min={1} max={isImport ? undefined : currentStock} step={1} required value={line.quantity} onChange={(event) => update({ quantity: Number(event.target.value) })} /></label>
      <label className="space-y-1.5"><span className="text-xs font-medium md:sr-only">Giá nhập</span><Input aria-label={`Giá nhập dòng ${index + 1}`} type="number" min={0} step={1} required value={line.price} onChange={(event) => update({ price: Number(event.target.value) })} /><span className="block text-xs font-medium text-primary">Thành tiền: {money.format(line.quantity * line.price)}</span></label>
      <Button type="button" size="icon" variant="ghost" aria-label={`Xóa ${medicine?.name ?? "dòng thuốc"}`} disabled={busy} onClick={() => setLines((current) => current.filter((_, position) => position !== index))}><X /></Button>
    </div>
  );
}

export function TicketDetail({ ticket, isImport, onClose, onPrint, onEdit }: { ticket: WarehouseTicket; isImport: boolean; onClose: () => void; onPrint: () => void; onEdit?: () => void }) {
  return (
    <PortalSection title={`Chi tiết ${ticketCode(ticket, isImport)}`} description="Thông tin đối chiếu phiếu và các mặt hàng" action={<div className="flex flex-wrap gap-2">{onEdit ? <Button type="button" size="sm" variant="outline" onClick={onEdit}><Pencil />Chỉnh sửa</Button> : null}<Button type="button" size="sm" variant="outline" onClick={onPrint}><FileDown />In / lưu PDF</Button><Button type="button" size="icon-sm" variant="ghost" aria-label="Đóng chi tiết" onClick={onClose}><X /></Button></div>}>
      <div className="grid gap-4 border-b p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Mã phiếu" value={ticketCode(ticket, isImport)} mono />
        <Detail label={isImport ? "Nhà cung cấp" : "Xuất từ"} value={isImport ? ticket.providerName || "—" : "Kho thuốc bệnh viện"} />
        <Detail label="Ngày tạo" value={dateTime.format(new Date(ticket.createdAt))} />
        <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trạng thái</p><div className="mt-1.5"><TicketStatus status={ticket.status} /></div></div>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[42rem] text-left text-sm"><thead><tr className="border-b bg-[#f6f9fb] text-xs uppercase tracking-wide text-muted-foreground"><th className="px-5 py-3">#</th><th className="px-5 py-3">Tên thuốc</th><th className="px-5 py-3">Đơn vị</th><th className="px-5 py-3 text-right">Số lượng</th><th className="px-5 py-3 text-right">Đơn giá</th><th className="px-5 py-3 text-right">Thành tiền</th></tr></thead><tbody className="divide-y">{ticket.details.map((item, index) => <tr key={`${item.medicineUuid}-${index}`}><td className="px-5 py-3 text-muted-foreground">{index + 1}</td><td className="px-5 py-3 font-medium">{item.medicineName}</td><td className="px-5 py-3">{getMedicineUnitLabel(item.unit)}</td><td className="px-5 py-3 text-right">{item.quantity}</td><td className="px-5 py-3 text-right">{money.format(item.price)}</td><td className="px-5 py-3 text-right font-semibold">{money.format(item.quantity * item.price)}</td></tr>)}</tbody><tfoot><tr className="border-t bg-[#fbfdfe]"><td colSpan={3} className="px-5 py-4 font-semibold">Tổng cộng</td><td className="px-5 py-4 text-right font-semibold">{ticket.details.reduce((sum, item) => sum + item.quantity, 0)}</td><td /><td className="px-5 py-4 text-right text-base font-bold text-primary">{money.format(ticketTotal(ticket))}</td></tr></tfoot></table></div>
      <div className="border-t p-5"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ghi chú</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{ticket.note || "Không có ghi chú."}</p></div>
    </PortalSection>
  );
}

export function SummaryCard({ label, value, detail, tone = "blue" }: { label: string; value: string; detail: string; tone?: "blue" | "amber" | "green" }) {
  const toneClass = tone === "amber" ? "border-amber-200 bg-amber-50" : tone === "green" ? "border-emerald-200 bg-emerald-50" : "border-sky-200 bg-sky-50";
  return <div className={`border p-4 ${toneClass}`}><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-2 text-xl font-bold text-[#173b57]">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

export function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border bg-white px-3 text-sm">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export function ticketTotal(ticket: WarehouseTicket) {
  return ticket.details.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function ticketCode(ticket: WarehouseTicket, isImport: boolean) {
  return `${isImport ? "NH" : "XH"}-${ticket.uuid.slice(0, 8).toUpperCase()}`;
}

export function compareTickets(left: WarehouseTicket, right: WarehouseTicket, sort: string) {
  if (sort === "oldest") return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  if (sort === "total-desc") return ticketTotal(right) - ticketTotal(left);
  if (sort === "total-asc") return ticketTotal(left) - ticketTotal(right);
  if (sort === "medicine") return (left.details[0]?.medicineName ?? "").localeCompare(right.details[0]?.medicineName ?? "", "vi");
  if (sort === "provider") return (left.providerName ?? "").localeCompare(right.providerName ?? "", "vi");
  if (sort === "status") return left.status.localeCompare(right.status);
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

export function printTicket(ticket: WarehouseTicket, isImport: boolean) {
  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) return;
  printWindow.opener = null;
  const code = ticketCode(ticket, isImport);
  const rows = ticket.details.map((item, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(item.medicineName)}</td><td>${escapeHtml(getMedicineUnitLabel(item.unit))}</td><td class="number">${item.quantity}</td><td class="number">${money.format(item.price)}</td><td class="number">${money.format(item.quantity * item.price)}</td></tr>`).join("");
  printWindow.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${code}</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#173b57;margin:0;font-size:13px}header{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid #0a83bd;padding-bottom:16px}h1{font-size:24px;margin:0 0 6px}.muted{color:#64748b}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px 28px;margin:22px 0}.meta div span{display:block;font-size:11px;text-transform:uppercase;color:#64748b;margin-bottom:4px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:9px;text-align:left}th{background:#f1f5f9;font-size:11px;text-transform:uppercase}.number{text-align:right}tfoot td{font-weight:700;background:#f8fafc}.note{margin-top:20px;border:1px solid #cbd5e1;padding:12px;white-space:pre-wrap}.signatures{display:grid;grid-template-columns:1fr 1fr;text-align:center;margin-top:38px;font-weight:700}.signatures small{display:block;margin-top:6px;font-weight:400;color:#64748b}</style></head><body><header><div><p class="muted">BỆNH VIỆN AN TÂM · NGHIỆP VỤ KHO</p><h1>${isImport ? "PHIẾU NHẬP HÀNG" : "PHIẾU XUẤT HÀNG"}</h1><strong>${code}</strong></div><div><p><strong>Trạng thái:</strong> ${ticketStatusLabel(ticket.status)}</p><p class="muted">Ngày lập: ${dateTime.format(new Date(ticket.createdAt))}</p></div></header><section class="meta"><div><span>${isImport ? "Nhà cung cấp" : "Xuất từ"}</span><strong>${escapeHtml(isImport ? ticket.providerName || "—" : "Kho thuốc bệnh viện")}</strong></div><div><span>Số mặt hàng</span><strong>${ticket.details.length}</strong></div></section><table><thead><tr><th>#</th><th>Tên thuốc</th><th>Đơn vị</th><th class="number">Số lượng</th><th class="number">${isImport ? "Giá nhập" : "Đơn giá"}</th><th class="number">Thành tiền</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="3">Tổng cộng</td><td class="number">${ticket.details.reduce((sum, item) => sum + item.quantity, 0)}</td><td></td><td class="number">${money.format(ticketTotal(ticket))}</td></tr></tfoot></table><div class="note"><strong>Ghi chú:</strong><br>${escapeHtml(ticket.note || "Không có ghi chú.")}</div><div class="signatures"><div>Người lập phiếu<small>(Ký và ghi rõ họ tên)</small></div><div>Người xác nhận<small>(Ký và ghi rõ họ tên)</small></div></div><script>window.addEventListener('load',()=>window.print())<\/script></body></html>`);
  printWindow.document.close();
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><strong>{value}</strong></div>;
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className={`mt-1.5 text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

function TicketStatus({ status }: { status: WarehouseTicket["status"] }) {
  return <StatusPill tone={status === "Confirmed" ? "green" : status === "Cancelled" ? "red" : "amber"}>{ticketStatusLabel(status)}</StatusPill>;
}

function ticketStatusLabel(status: WarehouseTicket["status"]) {
  return status === "Confirmed" ? "Đã xác nhận" : status === "Cancelled" ? "Đã hủy" : "Chờ xác nhận";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
