"use client";

import {
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  PackageCheck,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";

import {
  DetailGrid,
  DetailItem,
  MetricCard,
  MetricGrid,
  PortalAction,
  PortalPageHeader,
  PortalSection,
  PortalTable,
  PortalToolbar,
  ProgressList,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockExportTicketDetails } from "@/data/mocks/export-ticket-details";
import { mockExportTickets } from "@/data/mocks/export-tickets";
import { mockImportTicketDetails } from "@/data/mocks/import-ticket-details";
import { mockImportTickets } from "@/data/mocks/import-tickets";
import { mockMedicineInventories } from "@/data/mocks/medicine-inventories";
import { mockMedicines } from "@/data/mocks/medicines";
import { mockProviders } from "@/data/mocks/providers";
import {
  ExportTicketStatus,
  ImportTicketStatus,
  MedicineUnit,
  ProviderStatus,
  type ExportTicket,
  type ImportTicket,
} from "@/types/models";

export function InventoryScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <WarehouseDashboard />;
    case "ton-kho": return <InventoryScreen />;
    case "nha-cung-cap": return <ProvidersScreen />;
    case "phieu-nhap-xuat": return <StockTicketsScreen />;
    case "dieu-chinh-ton": return <InventoryAdjustmentScreen />;
    case "lich-su": return <InventoryHistoryScreen />;
    case "bao-cao": return <WarehouseReportsScreen />;
    default: return null;
  }
}

type Visibility = "current" | "deleted" | "all";
type Ticket = { kind: "import"; item: ImportTicket } | { kind: "export"; item: ExportTicket };

const numberFormatter = new Intl.NumberFormat("vi-VN");
const moneyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("vi-VN");

const unitLabels: Record<MedicineUnit, string> = {
  [MedicineUnit.Other]: "Khác",
  [MedicineUnit.Tablet]: "Viên",
  [MedicineUnit.Bottle]: "Chai",
  [MedicineUnit.Box]: "Hộp",
  [MedicineUnit.Tube]: "Tuýp",
  [MedicineUnit.Sachet]: "Gói",
};

function isDeleted(item: { deletedAt: Date }) {
  return item.deletedAt.getTime() > 0;
}

function matchesVisibility(item: { deletedAt: Date }, visibility: Visibility) {
  return visibility === "all" || (visibility === "deleted" ? isDeleted(item) : !isDeleted(item));
}

function VisibilityFilter({ value, onChange }: { value: Visibility; onChange: (value: Visibility) => void }) {
  return (
    <label>
      <span className="sr-only">Lọc trạng thái xóa</span>
      <select value={value} onChange={(event) => onChange(event.target.value as Visibility)} className="h-9 rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
        <option value="current">Bản ghi hiện hành</option>
        <option value="deleted">Đã xóa</option>
        <option value="all">Tất cả bản ghi</option>
      </select>
    </label>
  );
}

function RecordState({ item }: { item: { deletedAt: Date } }) {
  return isDeleted(item) ? <StatusPill tone="red">Đã xóa</StatusPill> : <StatusPill tone="green">Hiện hành</StatusPill>;
}

function DeleteAction({ item, label, onToggle }: { item: { deletedAt: Date }; label: string; onToggle: () => void }) {
  const deleted = isDeleted(item);
  return (
    <Button type="button" size="icon-sm" variant={deleted ? "outline" : "destructive"} title={deleted ? "Khôi phục" : "Xóa"} aria-label={`${deleted ? "Khôi phục" : "Xóa"} ${label}`} onClick={onToggle}>
      {deleted ? <RotateCcw /> : <Trash2 />}
    </Button>
  );
}

function EmptyTable() {
  return <div className="p-10 text-center text-sm text-muted-foreground">Không có bản ghi phù hợp với bộ lọc.</div>;
}

function TicketStatus({ status }: { status: ImportTicketStatus | ExportTicketStatus }) {
  if (status === ImportTicketStatus.Confirmed) return <StatusPill tone="green">Đã xác nhận</StatusPill>;
  if (status === ImportTicketStatus.Cancelled) return <StatusPill tone="red">Đã hủy</StatusPill>;
  return <StatusPill tone="amber">Chờ duyệt</StatusPill>;
}

function WarehouseDashboard() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Kho BV Đa khoa Thành Phố" title="Tổng quan kho thuốc" description="Theo dõi tồn kho, cảnh báo dưới ngưỡng và các phiếu cần quản trị viên chi nhánh duyệt." actions={<><PortalAction>Tải danh sách tồn</PortalAction><PortalAction variant="default"><Plus />Tạo phiếu</PortalAction></>} />
      <MetricGrid>
        <MetricCard label="Mặt hàng trong kho" value="428" detail="392 thuốc đang hoạt động" icon={<Boxes className="size-5" />} />
        <MetricCard label="Dưới ngưỡng" value="16" detail="5 mặt hàng đã hết" icon={<AlertTriangle className="size-5" />} tone="red" />
        <MetricCard label="Phiếu chờ duyệt" value="7" detail="5 nhập kho, 2 xuất kho" icon={<ClipboardCheck className="size-5" />} tone="amber" />
        <MetricCard label="Giá trị tồn" value="1,84 tỷ" detail="Tăng 2,4% so với đầu tháng" trend="up" icon={<CircleDollarSign className="size-5" />} tone="green" />
      </MetricGrid>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <PortalSection title="Thuốc cần xử lý sớm" action={<PortalAction>Xem cảnh báo</PortalAction>}>
          <PortalTable caption="Thuốc cần xử lý sớm" columns={["Thuốc", "Tồn", "Tối thiểu", "Dự kiến dùng", "Mức độ"]} rows={[
            ["Natri Clorid 0,9%", "0 chai", "50", "18 chai/ngày", <StatusPill key="1" tone="red">Nghiêm trọng</StatusPill>],
            ["Amlodipine 5mg", "142 viên", "150", "36 viên/ngày", <StatusPill key="2" tone="amber">Cảnh báo</StatusPill>],
            ["Omeprazole 20mg", "226 viên", "250", "42 viên/ngày", <StatusPill key="3" tone="amber">Cảnh báo</StatusPill>],
          ]} />
        </PortalSection>
        <PortalSection title="Nhập xuất tháng 09">
          <ProgressList items={[
            { label: "Nhập kho", value: 78, display: "482,6 triệu", color: "bg-emerald-500" },
            { label: "Xuất kho", value: 62, display: "386,4 triệu" },
            { label: "Điều chỉnh giảm", value: 8, display: "12,2 triệu", color: "bg-red-400" },
          ]} />
        </PortalSection>
      </div>
    </div>
  );
}

function InventoryScreen() {
  const [inventories, setInventories] = useState(() => mockMedicineInventories.map((item) => ({ ...item })));
  const [visibility, setVisibility] = useState<Visibility>("current");
  const visibleInventories = inventories.filter((item) => matchesVisibility(item, visibility));
  const activeInventories = inventories.filter((item) => !isDeleted(item));
  const belowMinimum = activeInventories.filter((item) => item.quantity < item.minimumQuantity).length;
  const deletedCount = inventories.length - activeInventories.length;

  function toggleDeleted(uuid: string) {
    setInventories((current) => current.map((item) => item.uuid === uuid
      ? { ...item, deletedAt: isDeleted(item) ? new Date(0) : new Date(), updatedAt: new Date() }
      : item));
  }

  const rows = visibleInventories.map((inventory) => {
    const medicine = mockMedicines.find((item) => item.uuid === inventory.medicineUuid);
    const stockTone = inventory.quantity === 0 ? "red" : inventory.quantity < inventory.minimumQuantity ? "amber" : "green";
    const stockLabel = inventory.quantity === 0 ? "Hết hàng" : inventory.quantity < inventory.minimumQuantity ? "Dưới ngưỡng" : "Ổn định";
    return [
      <div key={`${inventory.uuid}-medicine`}><p className="font-medium">{medicine?.name ?? "Thuốc không xác định"}</p><p className="mt-1 text-xs text-muted-foreground">{medicine?.description ?? inventory.medicineUuid}</p></div>,
      medicine ? unitLabels[medicine.unit] : "-",
      numberFormatter.format(inventory.quantity),
      numberFormatter.format(inventory.minimumQuantity),
      medicine ? moneyFormatter.format(medicine.price) : "-",
      medicine ? moneyFormatter.format(inventory.quantity * medicine.price) : "-",
      <StatusPill key={`${inventory.uuid}-stock`} tone={stockTone}>{stockLabel}</StatusPill>,
      dateFormatter.format(inventory.updatedAt),
      <RecordState key={`${inventory.uuid}-record-state`} item={inventory} />,
      <DeleteAction key={`${inventory.uuid}-action`} item={inventory} label={medicine?.name ?? inventory.uuid} onToggle={() => toggleDeleted(inventory.uuid)} />,
    ];
  });

  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Tồn theo chi nhánh" title="Tồn kho thuốc" description="Theo dõi số lượng thực tế và ngưỡng tối thiểu của từng thuốc trong kho." actions={<PortalAction>Kiểm kê kho</PortalAction>} />
      <MetricGrid>
        <MetricCard label="Tổng mặt hàng" value={String(inventories.length)} detail={`${activeInventories.length} bản ghi hiện hành`} icon={<Archive className="size-5" />} />
        <MetricCard label="Tổng số lượng" value={numberFormatter.format(activeInventories.reduce((sum, item) => sum + item.quantity, 0))} detail="Tất cả đơn vị quy đổi" icon={<Boxes className="size-5" />} tone="cyan" />
        <MetricCard label="Dưới ngưỡng" value={String(belowMinimum)} detail="Trong các bản ghi hiện hành" icon={<AlertTriangle className="size-5" />} tone="amber" />
        <MetricCard label="Đã xóa" value={String(deletedCount)} detail="Có thể khôi phục bất kỳ lúc nào" icon={<Trash2 className="size-5" />} tone="red" />
      </MetricGrid>
      <PortalSection title="Danh sách tồn kho" description={`${visibleInventories.length} kết quả. Số lượng được cập nhật khi phiếu chuyển sang Confirmed.`}>
        <PortalToolbar placeholder="Tìm tên thuốc" filters={[{ label: "Tất cả đơn vị", options: ["Viên", "Chai", "Hộp", "Tuýp"] }, { label: "Mức tồn", options: ["Ổn định", "Dưới ngưỡng", "Hết hàng"] }]} action={<VisibilityFilter value={visibility} onChange={setVisibility} />} />
        {rows.length ? <PortalTable caption="Danh sách tồn kho thuốc" columns={["Thuốc", "Đơn vị", "Số lượng", "Tối thiểu", "Đơn giá", "Giá trị tồn", "Mức tồn", "Cập nhật", "Bản ghi", "Thao tác"]} rows={rows} /> : <EmptyTable />}
      </PortalSection>
    </div>
  );
}

function ProvidersScreen() {
  const [providers, setProviders] = useState(() => mockProviders.map((item) => ({ ...item })));
  const [visibility, setVisibility] = useState<Visibility>("current");
  const visibleProviders = providers.filter((item) => matchesVisibility(item, visibility));
  const deletedCount = providers.filter(isDeleted).length;
  const activeCount = providers.filter((item) => !isDeleted(item) && item.status === ProviderStatus.Active).length;

  function toggleDeleted(uuid: string) {
    setProviders((current) => current.map((item) => item.uuid === uuid
      ? { ...item, deletedAt: isDeleted(item) ? new Date(0) : new Date(), updatedAt: new Date() }
      : item));
  }

  const rows = visibleProviders.map((provider) => {
    const providerTickets = mockImportTickets.filter((ticket) => ticket.providerUuid === provider.uuid);
    const confirmedTickets = providerTickets.filter((ticket) => ticket.status === ImportTicketStatus.Confirmed).length;
    return [
      <div key={`${provider.uuid}-name`}><p className="font-medium">{provider.name}</p><p className="mt-1 text-xs text-muted-foreground">Tạo ngày {dateFormatter.format(provider.createdAt)}</p></div>,
      <span key={`${provider.uuid}-address`} className="block max-w-72 whitespace-normal leading-5">{provider.address}</span>,
      provider.hotline,
      `${providerTickets.length} phiếu`,
      `${confirmedTickets}/${providerTickets.length}`,
      <StatusPill key={`${provider.uuid}-status`} tone={provider.status === ProviderStatus.Active ? "green" : "amber"}>{provider.status === ProviderStatus.Active ? "Hoạt động" : "Tạm ngưng"}</StatusPill>,
      dateFormatter.format(provider.updatedAt),
      <RecordState key={`${provider.uuid}-record-state`} item={provider} />,
      <DeleteAction key={`${provider.uuid}-action`} item={provider} label={provider.name} onToggle={() => toggleDeleted(provider.uuid)} />,
    ];
  });

  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Đối tác cung ứng" title="Nhà cung cấp" description="Quản lý thông tin liên hệ và trạng thái nhà cung cấp phục vụ nhập kho." actions={<PortalAction variant="default"><Plus />Thêm nhà cung cấp</PortalAction>} />
      <MetricGrid>
        <MetricCard label="Tổng nhà cung cấp" value={String(providers.length)} detail={`${activeCount} đang hoạt động`} icon={<Truck className="size-5" />} />
        <MetricCard label="Phiếu nhập" value={String(mockImportTickets.length)} detail={`${mockImportTickets.filter((item) => item.status === ImportTicketStatus.Confirmed).length} đã xác nhận`} icon={<ArrowDownToLine className="size-5" />} tone="green" />
        <MetricCard label="Tạm ngưng" value={String(providers.filter((item) => !isDeleted(item) && item.status === ProviderStatus.InActive).length)} detail="Không thể chọn cho phiếu mới" icon={<AlertTriangle className="size-5" />} tone="amber" />
        <MetricCard label="Đã xóa" value={String(deletedCount)} detail="Có thể khôi phục bất kỳ lúc nào" icon={<Trash2 className="size-5" />} tone="red" />
      </MetricGrid>
      <PortalSection title="Danh sách nhà cung cấp" description={`${visibleProviders.length} kết quả theo trạng thái xóa`}>
        <PortalToolbar placeholder="Tìm tên, địa chỉ hoặc hotline" filters={[{ label: "Tất cả trạng thái", options: ["Hoạt động", "Tạm ngưng"] }]} action={<VisibilityFilter value={visibility} onChange={setVisibility} />} />
        {rows.length ? <PortalTable caption="Danh sách nhà cung cấp" columns={["Nhà cung cấp", "Địa chỉ", "hotline", "Phiếu nhập", "Đã xác nhận", "Trạng thái", "Cập nhật", "Bản ghi", "Thao tác"]} rows={rows} /> : <EmptyTable />}
      </PortalSection>
    </div>
  );
}

function StockTicketsScreen() {
  const [importTickets, setImportTickets] = useState(() => mockImportTickets.map((item) => ({ ...item })));
  const [exportTickets, setExportTickets] = useState(() => mockExportTickets.map((item) => ({ ...item })));
  const [visibility, setVisibility] = useState<Visibility>("current");
  const tickets: Ticket[] = [
    ...importTickets.map((item): Ticket => ({ kind: "import", item })),
    ...exportTickets.map((item): Ticket => ({ kind: "export", item })),
  ].sort((a, b) => b.item.createdAt.getTime() - a.item.createdAt.getTime());
  const visibleTickets = tickets.filter(({ item }) => matchesVisibility(item, visibility));
  const currentTickets = tickets.filter(({ item }) => !isDeleted(item));
  const deletedCount = tickets.length - currentTickets.length;

  function toggleDeleted(ticket: Ticket) {
    const update = <T extends ImportTicket | ExportTicket>(items: T[]) => items.map((item) => item.uuid === ticket.item.uuid
      ? { ...item, deletedAt: isDeleted(item) ? new Date(0) : new Date(), updatedAt: new Date() }
      : item);
    if (ticket.kind === "import") setImportTickets(update);
    else setExportTickets(update);
  }

  function ticketDetails(ticket: Ticket) {
    return ticket.kind === "import"
      ? mockImportTicketDetails.filter((detail) => detail.importTicketUuid === ticket.item.uuid)
      : mockExportTicketDetails.filter((detail) => detail.exportTicketUuid === ticket.item.uuid);
  }

  const rows = visibleTickets.map((ticket) => {
    const details = ticketDetails(ticket);
    const prefix = ticket.kind === "import" ? "NK" : "XK";
    const code = `${prefix}-${ticket.item.createdAt.toISOString().slice(2, 10).replaceAll("-", "")}-${ticket.item.uuid.slice(-4)}`;
    const provider = ticket.kind === "import" ? mockProviders.find((item) => item.uuid === ticket.item.providerUuid) : null;
    const totalQuantity = details.reduce((sum, detail) => sum + detail.quantity, 0);
    const totalValue = details.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);
    return [
      <div key={`${ticket.item.uuid}-code`}><p className="font-medium">{code}</p><p className="mt-1 text-xs text-muted-foreground">{dateFormatter.format(ticket.item.createdAt)}</p></div>,
      <StatusPill key={`${ticket.item.uuid}-type`} tone={ticket.kind === "import" ? "green" : "blue"}>{ticket.kind === "import" ? "Nhập kho" : "Xuất kho"}</StatusPill>,
      provider?.name ?? "Kho / bộ phận nội viện",
      <div key={`${ticket.item.uuid}-items`}><p>{details.length} mặt hàng · {numberFormatter.format(totalQuantity)} đơn vị</p><p className="mt-1 max-w-72 whitespace-normal text-xs text-muted-foreground">{ticket.item.note}</p></div>,
      moneyFormatter.format(totalValue),
      <TicketStatus key={`${ticket.item.uuid}-status`} status={ticket.item.status} />,
      dateFormatter.format(ticket.item.updatedAt),
      <RecordState key={`${ticket.item.uuid}-record-state`} item={ticket.item} />,
      <DeleteAction key={`${ticket.item.uuid}-action`} item={ticket.item} label={code} onToggle={() => toggleDeleted(ticket)} />,
    ];
  });

  const importValue = mockImportTicketDetails.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);
  const exportValue = mockExportTicketDetails.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);

  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Nghiệp vụ kho" title="Phiếu nhập xuất" description="Tạo và chỉnh sửa phiếu Pending. Việc xác nhận do HOSPITAL_ADMIN thực hiện." actions={<><PortalAction><ArrowUpFromLine />Tạo phiếu xuất</PortalAction><PortalAction variant="default"><ArrowDownToLine />Tạo phiếu nhập</PortalAction></>} />
      <MetricGrid>
        <MetricCard label="Chờ duyệt" value={String(currentTickets.filter(({ item }) => item.status === ImportTicketStatus.Pending).length)} detail="Phiếu hiện hành cần xác nhận" icon={<ClipboardCheck className="size-5" />} tone="amber" />
        <MetricCard label="Đã xác nhận" value={String(currentTickets.filter(({ item }) => item.status === ImportTicketStatus.Confirmed).length)} detail="Đã cập nhật tồn kho" icon={<PackageCheck className="size-5" />} tone="green" />
        <MetricCard label="Giá trị nhập / xuất" value={`${moneyFormatter.format(importValue)} / ${moneyFormatter.format(exportValue)}`} detail={`${importTickets.length} phiếu nhập, ${exportTickets.length} phiếu xuất`} icon={<ArrowDownToLine className="size-5" />} />
        <MetricCard label="Đã xóa" value={String(deletedCount)} detail="Có thể khôi phục bất kỳ lúc nào" icon={<Trash2 className="size-5" />} tone="red" />
      </MetricGrid>
      <PortalSection title="Danh sách phiếu" description={`${visibleTickets.length} kết quả theo trạng thái xóa`}>
        <PortalToolbar placeholder="Tìm mã phiếu hoặc nhà cung cấp" filters={[{ label: "Tất cả loại", options: ["Nhập kho", "Xuất kho"] }, { label: "Trạng thái", options: ["Chờ duyệt", "Đã xác nhận", "Đã hủy"] }]} action={<VisibilityFilter value={visibility} onChange={setVisibility} />} />
        {rows.length ? <PortalTable caption="Danh sách phiếu nhập xuất" columns={["Mã phiếu", "Loại", "Đối tác / bộ phận", "Chi tiết", "Tổng giá trị", "Trạng thái", "Cập nhật", "Bản ghi", "Thao tác"]} rows={rows} /> : <EmptyTable />}
      </PortalSection>
    </div>
  );
}

function InventoryAdjustmentScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Thao tác có kiểm toán" title="Điều chỉnh tồn kho" description="Mọi điều chỉnh bắt buộc có lý do và được ghi vào nhật ký hoạt động." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <PortalSection title="Tạo phiếu điều chỉnh" description="Kiểm tra số lượng thực tế trước khi xác nhận.">
          <form className="space-y-5 p-5">
            <Field label="Thuốc" defaultValue="Amlodipine 5mg" />
            <div className="grid grid-cols-2 gap-4"><Field label="Số lượng hệ thống" defaultValue="142" type="number" /><Field label="Số lượng thực tế" defaultValue="140" type="number" /></div>
            <div className="space-y-2"><Label htmlFor="adjust-reason">Lý do điều chỉnh</Label><Textarea id="adjust-reason" rows={5} placeholder="Mô tả nguyên nhân chênh lệch..." /></div>
            <div className="border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"><strong>Chênh lệch dự kiến: -2 viên.</strong> Thao tác này sẽ được ghi với tài khoản và thời gian hiện tại.</div>
            <PortalAction variant="default"><Save />Ghi nhận điều chỉnh</PortalAction>
          </form>
        </PortalSection>
        <PortalSection title="Điều chỉnh gần đây">
          <PortalTable caption="Điều chỉnh tồn kho gần đây" columns={["Thời gian", "Thuốc", "Trước", "Sau", "Lý do", "Người thực hiện"]} rows={[
            ["23/09 08:56", "Paracetamol 500mg", "2.485", "2.480", "Hư hỏng bao bì", "Lê Văn Tuấn"],
            ["22/09 16:12", "Amoxicillin 500mg", "858", "860", "Kiểm kê thừa", "Ngô Thanh Hà"],
            ["22/09 09:44", "Natri Clorid 0,9%", "4", "0", "Hết hạn sử dụng", "Lê Văn Tuấn"],
          ]} />
        </PortalSection>
      </div>
    </div>
  );
}

function InventoryHistoryScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Sổ biến động" title="Lịch sử kho" description="Tra cứu toàn bộ biến động nhập, xuất và điều chỉnh của từng mặt hàng." actions={<PortalAction>Xuất sổ kho</PortalAction>} />
      <PortalSection title="Dòng biến động">
        <PortalToolbar placeholder="Tìm thuốc hoặc mã phiếu" filters={[{ label: "30 ngày gần nhất", options: ["Hôm nay", "7 ngày", "90 ngày"] }, { label: "Tất cả nghiệp vụ", options: ["Nhập kho", "Xuất kho", "Điều chỉnh"] }]} />
        <PortalTable caption="Lịch sử biến động kho" columns={["Thời gian", "Thuốc", "Nghiệp vụ", "Chứng từ", "Biến động", "Tồn sau"]} rows={[
          ["23/09 09:28", "Paracetamol 500mg", <StatusPill key="1" tone="blue">Xuất kho</StatusPill>, "XK-260923-001", "-120", "2.480"],
          ["23/09 08:56", "Paracetamol 500mg", <StatusPill key="2" tone="amber">Điều chỉnh</StatusPill>, "ADJ-260923-003", "-5", "2.600"],
          ["22/09 16:45", "Amoxicillin 500mg", <StatusPill key="3" tone="green">Nhập kho</StatusPill>, "NK-260922-018", "+500", "860"],
          ["22/09 15:12", "Natri Clorid 0,9%", <StatusPill key="4" tone="blue">Xuất kho</StatusPill>, "XK-260922-010", "-24", "0"],
        ]} />
      </PortalSection>
    </div>
  );
}

function WarehouseReportsScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Phân tích kho" title="Báo cáo nhập xuất tồn" description="Tổng hợp giá trị và tốc độ luân chuyển kho trong phạm vi chi nhánh." actions={<PortalAction variant="default">Tải báo cáo</PortalAction>} />
      <MetricGrid>
        <MetricCard label="Tồn đầu kỳ" value="1,74 tỷ" detail="Ngày 01/09/2026" icon={<Archive className="size-5" />} />
        <MetricCard label="Nhập trong kỳ" value="482,6 triệu" detail="42 phiếu đã xác nhận" trend="up" icon={<ArrowDownToLine className="size-5" />} tone="green" />
        <MetricCard label="Xuất trong kỳ" value="386,4 triệu" detail="44 phiếu đã xác nhận" icon={<ArrowUpFromLine className="size-5" />} tone="cyan" />
        <MetricCard label="Tồn cuối kỳ" value="1,84 tỷ" detail="Chênh lệch +96,2 triệu" icon={<CircleDollarSign className="size-5" />} tone="amber" />
      </MetricGrid>
      <div className="grid gap-6 lg:grid-cols-2">
        <PortalSection title="Giá trị theo nhóm đơn vị"><ProgressList items={[
          { label: "Viên", value: 84, display: "920 triệu" },
          { label: "Chai", value: 62, display: "482 triệu", color: "bg-cyan-500" },
          { label: "Hộp", value: 48, display: "316 triệu", color: "bg-emerald-500" },
          { label: "Tuýp & gói", value: 22, display: "122 triệu", color: "bg-amber-500" },
        ]} /></PortalSection>
        <PortalSection title="Chỉ số kiểm soát">
          <DetailGrid>
            <DetailItem label="Tỷ lệ dưới ngưỡng" value="3,7%" />
            <DetailItem label="Tỷ lệ hết hàng" value="1,2%" />
            <DetailItem label="Phiếu bị hủy" value="2,3%" />
            <DetailItem label="Số ngày tồn bình quân" value="38 ngày" />
            <DetailItem label="Nhà cung cấp hoạt động" value="16" />
            <DetailItem label="Lần điều chỉnh tồn" value="12" />
          </DetailGrid>
        </PortalSection>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  const id = `warehouse-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} defaultValue={defaultValue} /></div>;
}
