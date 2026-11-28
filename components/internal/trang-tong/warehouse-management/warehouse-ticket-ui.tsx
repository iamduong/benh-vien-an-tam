"use client";

import { Check, FileDown, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction } from "react";

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

export function TicketForm({
  isImport,
  editing,
  busy,
  options,
  inventory,
  providerUuid,
  setProviderUuid,
  note,
  setNote,
  lines,
  setLines,
  onCancel,
  onSubmit,
}: {
  isImport: boolean;
  editing: boolean;
  busy: boolean;
  options: WarehouseOptions;
  inventory: WarehouseInventory[];
  providerUuid: string;
  setProviderUuid: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  lines: DraftLine[];
  setLines: Dispatch<SetStateAction<DraftLine[]>>;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMedicineUuid, setSelectedMedicineUuid] = useState("");
  const [selectedMedicineName, setSelectedMedicineName] = useState("");
  const [draftQuantity, setDraftQuantity] = useState("1");
  const [draftPrice, setDraftPrice] = useState("");
  const [pickerError, setPickerError] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const medicineByUuid = useMemo(
    () => new Map(options.medicines.map((item) => [item.uuid, item])),
    [options.medicines],
  );
  const inventoryByUuid = useMemo(
    () => new Map(inventory.map((item) => [item.medicineUuid, item])),
    [inventory],
  );
  const addedMedicineUuids = useMemo(
    () => new Set(lines.map((line) => line.medicineUuid)),
    [lines],
  );

  const selectableMedicines = useMemo(
    () =>
      options.medicines.filter((medicine) => {
        if (addedMedicineUuids.has(medicine.uuid)) return false;
        if (isImport) return true;
        return (inventoryByUuid.get(medicine.uuid)?.quantity ?? 0) > 0;
      }),
    [addedMedicineUuids, inventoryByUuid, isImport, options.medicines],
  );

  const filteredMedicines = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase("vi");
    if (!normalizedSearch) return selectableMedicines;
    return selectableMedicines.filter((medicine) =>
      medicine.name.toLocaleLowerCase("vi").includes(normalizedSearch),
    );
  }, [searchQuery, selectableMedicines]);

  const availableMedicineCount = useMemo(
    () =>
      isImport
        ? options.medicines.length
        : options.medicines.filter((medicine) => (inventoryByUuid.get(medicine.uuid)?.quantity ?? 0) > 0).length,
    [inventoryByUuid, isImport, options.medicines],
  );

  const selectedMedicine = selectedMedicineUuid ? medicineByUuid.get(selectedMedicineUuid) : undefined;
  const selectedMedicineStock = selectedMedicineUuid ? (inventoryByUuid.get(selectedMedicineUuid)?.quantity ?? 0) : 0;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const totalQuantity = lines.reduce((sum, line) => sum + Math.max(0, line.quantity), 0);
  const totalValue = lines.reduce((sum, line) => sum + Math.max(0, line.quantity) * Math.max(0, line.price), 0);

  function handleSelectMedicine(medicine: WarehouseMedicine) {
    setSelectedMedicineUuid(medicine.uuid);
    setSelectedMedicineName(medicine.name);
    setDraftPrice(String(medicine.price));
    if (!draftQuantity.trim()) setDraftQuantity("1");
    setDropdownOpen(false);
    setPickerError("");
  }

  function handleAddMedicine() {
    if (!selectedMedicineUuid) {
      setPickerError("Vui lòng tìm kiếm và chọn thuốc từ danh sách.");
      return;
    }
    if (addedMedicineUuids.has(selectedMedicineUuid)) {
      setPickerError("Thuốc này đã có trong phiếu, không thể thêm trùng.");
      return;
    }
    const parsedQuantity = Number(draftQuantity);
    if (!draftQuantity.trim() || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setPickerError("Số lượng phải là số nguyên lớn hơn hoặc bằng 1.");
      return;
    }
    const parsedPrice = Number(draftPrice);
    if (draftPrice.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setPickerError("Đơn giá phải là số lớn hơn hoặc bằng 0.");
      return;
    }
    if (!isImport) {
      const currentStock = inventoryByUuid.get(selectedMedicineUuid)?.quantity ?? 0;
      if (currentStock <= 0) {
        setPickerError("Thuốc này đã hết tồn kho, không thể xuất.");
        return;
      }
      if (parsedQuantity > currentStock) {
        setPickerError(`Số lượng xuất (${parsedQuantity}) không được vượt quá tồn kho hiện tại (${currentStock}).`);
        return;
      }
    }

    setLines((current) => [
      ...current,
      { medicineUuid: selectedMedicineUuid, quantity: parsedQuantity, price: parsedPrice },
    ]);
    setSearchQuery("");
    setSelectedMedicineUuid("");
    setSelectedMedicineName("");
    setDraftQuantity("1");
    setDraftPrice("");
    setDropdownOpen(false);
    setPickerError("");
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setDropdownOpen(false);
    } else if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  function handlePickerInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddMedicine();
    }
  }

  function updateLine(index: number, values: Partial<DraftLine>) {
    setLines((current) => current.map((item, position) => (position === index ? { ...item, ...values } : item)));
  }

  function removeLine(index: number) {
    setLines((current) => current.filter((_, position) => position !== index));
  }

  return (
    <PortalSection
      title={editing ? `Chỉnh sửa phiếu ${isImport ? "nhập" : "xuất"} đang chờ` : isImport ? "Tạo phiếu nhập hàng" : "Tạo phiếu xuất hàng"}
      description={isImport ? "Phiếu được lưu ở trạng thái chờ xác nhận và chưa làm thay đổi tồn kho." : "Phiếu được lưu ở trạng thái chờ xác nhận và chưa trừ tồn kho."}
    >
      <form onSubmit={onSubmit} className="space-y-6 p-5">
        {isImport ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Field label="Nhà cung cấp *">
              <select
                required
                disabled={busy}
                value={providerUuid || options.providers[0]?.uuid || ""}
                onChange={(event) => setProviderUuid(event.target.value)}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70"
              >
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

        <div className="space-y-4">
          <div>
            <Label>Thêm thuốc vào phiếu *</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {isImport
                ? "Tìm kiếm và chọn thuốc từ danh mục, nhập số lượng và đơn giá nhập rồi nhấn “Thêm thuốc”."
                : "Tìm kiếm và chọn thuốc còn tồn kho, nhập số lượng cần xuất và đơn giá rồi nhấn “Thêm thuốc”."}
            </p>
          </div>

          <div className="space-y-4 rounded-md border bg-[#fbfdfe] p-4">
            <div ref={searchContainerRef} className="relative w-full min-w-0">
              <Label htmlFor="warehouse-medicine-search">Tìm kiếm thuốc</Label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="warehouse-medicine-search"
                  type="text"
                  role="combobox"
                  aria-expanded={dropdownOpen}
                  aria-autocomplete="list"
                  aria-controls="warehouse-medicine-dropdown"
                  disabled={busy}
                  value={searchQuery}
                  placeholder="Nhập tên thuốc để tìm kiếm..."
                  className="pl-9"
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setDropdownOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
              {dropdownOpen && !busy ? (
                <div
                  id="warehouse-medicine-dropdown"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-1 w-full min-w-full max-h-60 overflow-y-auto rounded-md border bg-white p-2 shadow-lg"
                >
                  {filteredMedicines.length ? (
                    <ul className="divide-y">
                      {filteredMedicines.map((medicine) => {
                        const stock = inventoryByUuid.get(medicine.uuid)?.quantity ?? 0;
                        const isSelected = medicine.uuid === selectedMedicineUuid;
                        return (
                          <li key={medicine.uuid}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleSelectMedicine(medicine)}
                              className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-[#f6f9fb] ${isSelected ? "bg-sky-50 text-[#173b57]" : "text-foreground"
                                }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium">{medicine.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Đơn vị: {getMedicineUnitLabel(medicine.unit)} · Tồn kho: {stock}
                                </p>
                              </div>
                              <span className="shrink-0 text-xs font-semibold text-primary">
                                {money.format(medicine.price)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-sm text-muted-foreground">Không tìm thấy thuốc phù hợp</p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_8rem_10rem_auto] md:items-end">
              <div className="space-y-1.5">
                <Label htmlFor="warehouse-selected-medicine">Tên thuốc</Label>
                <Input
                  id="warehouse-selected-medicine"
                  type="text"
                  readOnly
                  value={selectedMedicineName}
                  placeholder="Chọn thuốc từ danh sách tìm kiếm"
                  className="cursor-not-allowed bg-muted/60 text-foreground focus-visible:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="warehouse-draft-quantity">Số lượng</Label>
                <Input
                  id="warehouse-draft-quantity"
                  type="number"
                  min={1}
                  max={isImport || !selectedMedicineUuid ? undefined : selectedMedicineStock}
                  step={1}
                  disabled={busy}
                  value={draftQuantity}
                  onChange={(event) => {
                    setDraftQuantity(event.target.value);
                    if (pickerError) setPickerError("");
                  }}
                  onKeyDown={handlePickerInputKeyDown}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="warehouse-draft-price">{isImport ? "Đơn giá nhập" : "Đơn giá"}</Label>
                <Input
                  id="warehouse-draft-price"
                  type="number"
                  min={0}
                  step={1}
                  disabled={busy}
                  value={draftPrice}
                  placeholder="0"
                  onChange={(event) => {
                    setDraftPrice(event.target.value);
                    if (pickerError) setPickerError("");
                  }}
                  onKeyDown={handlePickerInputKeyDown}
                />
              </div>

              <Button type="button" variant="outline" disabled={busy} onClick={handleAddMedicine}>
                <Plus />
                Thêm thuốc
              </Button>
            </div>

            {selectedMedicine ? (
              <p className="text-xs text-muted-foreground">
                Đã chọn: <strong className="text-[#173b57]">{selectedMedicine.name}</strong> · Đơn vị:{" "}
                <strong>{getMedicineUnitLabel(selectedMedicine.unit)}</strong> · Tồn hiện tại:{" "}
                <strong>{selectedMedicineStock}</strong> · Giá danh mục:{" "}
                <strong>{money.format(selectedMedicine.price)}</strong>
              </p>
            ) : null}

            {pickerError ? (
              <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {pickerError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Danh sách thuốc trong phiếu *</Label>
            <div className="overflow-x-auto rounded-md border bg-white">
              <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-[#f6f9fb] text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="w-14 px-3 py-3 font-semibold">STT</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Tên thuốc</th>
                    <th scope="col" className="w-24 px-3 py-3 font-semibold">Đơn vị</th>
                    <th scope="col" className="w-32 px-3 py-3 font-semibold">Tồn kho</th>
                    <th scope="col" className="w-32 px-3 py-3 font-semibold">Số lượng</th>
                    <th scope="col" className="w-40 px-3 py-3 font-semibold">Đơn giá</th>
                    <th scope="col" className="w-36 px-3 py-3 text-right font-semibold">Thành tiền</th>
                    <th scope="col" className="w-20 px-3 py-3 text-center font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lines.length ? (
                    lines.map((line, index) => {
                      const medicine = medicineByUuid.get(line.medicineUuid);
                      const invItem = inventoryByUuid.get(line.medicineUuid);
                      const medicineName = medicine?.name ?? invItem?.medicineName ?? line.medicineUuid;
                      const unitLabel = medicine
                        ? getMedicineUnitLabel(medicine.unit)
                        : invItem
                          ? getMedicineUnitLabel(invItem.unit)
                          : "—";
                      const currentStock = invItem?.quantity ?? 0;
                      const safeQuantity = Number.isFinite(line.quantity) ? line.quantity : 0;
                      const safePrice = Number.isFinite(line.price) ? line.price : 0;
                      const projectedStock = currentStock + (isImport ? safeQuantity : -safeQuantity);
                      const lineTotal = Math.max(0, safeQuantity) * Math.max(0, safePrice);
                      const exceedsStock = !isImport && safeQuantity > currentStock;

                      return (
                        <tr key={`${line.medicineUuid}-${index}`} className="transition-colors hover:bg-[#f8fbfc]">
                          <td className="px-3 py-3 align-middle text-muted-foreground">{index + 1}</td>
                          <td className="px-3 py-3 align-middle">
                            <p className="font-medium text-[#173b57]">{medicineName}</p>
                            {medicine ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Giá danh mục: {money.format(medicine.price)}
                              </p>
                            ) : null}
                          </td>
                          <td className="px-3 py-3 align-middle">{unitLabel}</td>
                          <td className="px-3 py-3 align-middle">
                            <p className="font-semibold text-[#173b57]">{currentStock}</p>
                            <p className={`mt-0.5 text-xs ${projectedStock < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                              Sau xác nhận: {projectedStock}
                            </p>
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <Input
                              aria-label={`Số lượng dòng ${index + 1}`}
                              type="number"
                              min={1}
                              max={isImport ? undefined : currentStock}
                              step={1}
                              required
                              disabled={busy}
                              value={safeQuantity > 0 ? safeQuantity : ""}
                              aria-invalid={exceedsStock || safeQuantity < 1}
                              onChange={(event) => {
                                const raw = event.target.value;
                                if (raw === "") {
                                  updateLine(index, { quantity: 0 });
                                  return;
                                }
                                const parsed = Number(raw);
                                if (Number.isFinite(parsed)) {
                                  updateLine(index, { quantity: Math.max(0, Math.floor(parsed)) });
                                }
                              }}
                              className="h-9 text-right"
                            />
                            {exceedsStock ? (
                              <p className="mt-1 text-xs text-red-600">Vượt tồn kho ({currentStock})</p>
                            ) : null}
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <Input
                              aria-label={`Đơn giá dòng ${index + 1}`}
                              type="number"
                              min={0}
                              step={1}
                              required
                              disabled={busy}
                              value={safePrice}
                              onChange={(event) => {
                                const raw = event.target.value;
                                if (raw === "") {
                                  updateLine(index, { price: 0 });
                                  return;
                                }
                                const parsed = Number(raw);
                                if (Number.isFinite(parsed)) {
                                  updateLine(index, { price: Math.max(0, parsed) });
                                }
                              }}
                              className="h-9 text-right"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-right align-middle font-semibold text-primary">
                            {money.format(lineTotal)}
                          </td>
                          <td className="px-3 py-3 text-center align-middle">
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Xóa thuốc khỏi phiếu"
                              aria-label={`Xóa ${medicineName}`}
                              disabled={busy}
                              onClick={() => removeLine(index)}
                            >
                              <Trash2 />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        {!isImport && availableMedicineCount === 0
                          ? "Kho hiện không có thuốc còn tồn để tạo phiếu xuất."
                          : "Chưa có thuốc nào trong phiếu."}
                      </td>
                    </tr>
                  )}
                </tbody>
                {lines.length ? (
                  <tfoot>
                    <tr className="border-t bg-[#fbfdfe] text-sm">
                      <td colSpan={4} className="px-3 py-3 font-semibold text-[#173b57]">
                        Tổng cộng ({lines.length} mặt hàng)
                      </td>
                      <td className="px-3 py-3 text-right font-semibold">{totalQuantity}</td>
                      <td />
                      <td className="whitespace-nowrap px-3 py-3 text-right font-bold text-primary">
                        {money.format(totalValue)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Field label="Ghi chú phiếu">
            <Textarea
              disabled={busy}
              value={note}
              maxLength={1000}
              rows={4}
              placeholder={
                isImport
                  ? "Ví dụ: số hóa đơn nhà cung cấp, lô hàng, lưu ý khi nhận hàng..."
                  : "Ví dụ: bộ phận nhận, mục đích xuất, người nhận và lưu ý bàn giao..."
              }
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <div className="space-y-3 border bg-[#fbfdfe] p-4">
            <h3 className="font-semibold text-[#173b57]">Tóm tắt phiếu</h3>
            <SummaryRow label="Số mặt hàng" value={String(lines.length)} />
            <SummaryRow label="Tổng số lượng" value={String(totalQuantity)} />
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Tổng giá trị</span>
              <strong className="text-lg text-primary">{money.format(totalValue)}</strong>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-5">
          <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Đóng</Button>
          <Button
            type="submit"
            disabled={busy || !lines.length || (isImport && !(providerUuid || options.providers[0]?.uuid))}
          >
            {editing ? <Pencil /> : <Check />}
            {busy ? "Đang lưu..." : editing ? "Lưu thay đổi" : isImport ? "Tạo phiếu nhập" : "Lưu phiếu chờ duyệt"}
          </Button>
        </div>
      </form>
    </PortalSection>
  );
}

export function TicketDetail({ ticket, isImport, onClose, onPrint, onEdit }: { ticket: WarehouseTicket; isImport: boolean; onClose: () => void; onPrint: () => void; onEdit?: () => void }) {
  return (
    <PortalSection title={`Chi tiết ${ticketCode(ticket, isImport)}`} description="Thông tin đối chiếu phiếu và các mặt hàng" action={<div className="flex flex-wrap gap-2">{onEdit ? <Button type="button" size="sm" variant="outline" onClick={onEdit}><Pencil />Chỉnh sửa</Button> : null}<Button type="button" size="sm" variant="outline" onClick={onPrint}><FileDown />Xuất PDF</Button><Button type="button" size="icon-sm" variant="ghost" aria-label="Đóng chi tiết" onClick={onClose}><X /></Button></div>}>
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

export function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <div className={`space-y-2 ${wide ? "sm:col-span-2" : ""}`}><Label>{label}</Label>{children}</div>;
}

export function Empty() {
  return <p className="p-10 text-center text-sm text-muted-foreground">Chưa có dữ liệu.</p>;
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
