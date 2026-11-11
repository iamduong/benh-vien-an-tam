"use client";

import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, CircleDollarSign, ClipboardCheck, PackageCheck, Warehouse } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { MetricCard, MetricGrid, PortalPageHeader, PortalSection, PortalTable, ProgressList, StatusPill } from "@/components/internal/portal-ui";
import { buttonVariants } from "@/components/ui/button";
import { getMedicineUnitLabel } from "@/lib/medicine-units";
import { warehouseService, type WarehouseInventory, type WarehouseProvider, type WarehouseTicket } from "@/lib/services/warehouse/WarehouseService";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("vi-VN");
const dateTime = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

type Movement = { kind: "import" | "export"; ticket: WarehouseTicket };

export function WarehouseDashboardScreen() {
  const [inventory, setInventory] = useState<WarehouseInventory[]>([]);
  const [imports, setImports] = useState<WarehouseTicket[]>([]);
  const [exports, setExports] = useState<WarehouseTicket[]>([]);
  const [providers, setProviders] = useState<WarehouseProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    setError("");
    try {
      const [inventoryResponse, importResponse, exportResponse, providerResponse] = await Promise.all([
        warehouseService.getInventory(signal),
        warehouseService.getImports(signal),
        warehouseService.getExports(signal),
        warehouseService.getProviders(false, signal),
      ]);
      setInventory(inventoryResponse.data);
      setImports(importResponse.data);
      setExports(exportResponse.data);
      setProviders(providerResponse.data);
    } catch (requestError) {
      if (signal?.aborted) return;
      console.error("Không thể tải tổng quan kho:", requestError);
      setError("Không tải được dữ liệu tổng quan kho. Vui lòng thử lại.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => load(controller.signal));
    return () => controller.abort();
  }, [load]);

  const movements = useMemo<Movement[]>(() => [
    ...imports.map((ticket): Movement => ({ kind: "import", ticket })),
    ...exports.map((ticket): Movement => ({ kind: "export", ticket })),
  ].sort((left, right) => new Date(right.ticket.createdAt).getTime() - new Date(left.ticket.createdAt).getTime()), [exports, imports]);

  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const outOfStock = inventory.filter((item) => item.quantity <= 0);
  const lowStock = inventory.filter((item) => item.quantity > 0 && item.quantity < item.minimumQuantity);
  const healthyStock = inventory.length - outOfStock.length - lowStock.length;
  const pendingImports = imports.filter((ticket) => ticket.status === "Pending");
  const pendingExports = exports.filter((ticket) => ticket.status === "Pending");
  const pendingMovements = movements.filter(({ ticket }) => ticket.status === "Pending");
  const activeProviders = providers.filter((provider) => provider.status === "Active").length;
  const confirmedImportValue = imports.filter((ticket) => ticket.status === "Confirmed").reduce((sum, ticket) => sum + ticketTotal(ticket), 0);
  const confirmedExportValue = exports.filter((ticket) => ticket.status === "Confirmed").reduce((sum, ticket) => sum + ticketTotal(ticket), 0);

  const alerts = [...outOfStock, ...lowStock]
    .sort((left, right) => stockSeverity(left) - stockSeverity(right) || left.quantity - right.quantity)
    .slice(0, 6);
  const highValueItems = [...inventory].sort((left, right) => right.quantity * right.price - left.quantity * left.price).slice(0, 6);
  const unitProgress = inventoryByUnit(inventory);

  const alertRows = alerts.map((item) => [
    <div key={`${item.uuid}-name`}><p className="font-semibold text-[#173b57]">{item.medicineName}</p><p className="mt-1 text-xs text-muted-foreground">{getMedicineUnitLabel(item.unit)} · {money.format(item.price)}</p></div>,
    <span key={`${item.uuid}-quantity`} className="font-semibold">{number.format(item.quantity)}</span>,
    number.format(item.minimumQuantity),
    number.format(Math.max(item.minimumQuantity - item.quantity, 0)),
    <StatusPill key={`${item.uuid}-status`} tone={item.quantity <= 0 ? "red" : "amber"}>{item.quantity <= 0 ? "Hết hàng" : "Dưới ngưỡng"}</StatusPill>,
  ]);

  const pendingRows = pendingMovements.slice(0, 6).map(({ kind, ticket }) => [
    <div key={`${ticket.uuid}-code`}><p className="font-mono font-semibold">{ticketCode(ticket, kind)}</p><p className="mt-1 text-xs text-muted-foreground">{dateTime.format(new Date(ticket.createdAt))}</p></div>,
    <StatusPill key={`${ticket.uuid}-kind`} tone={kind === "import" ? "green" : "blue"}>{kind === "import" ? "Nhập kho" : "Xuất kho"}</StatusPill>,
    kind === "import" ? ticket.providerName || "—" : "Kho thuốc bệnh viện",
    `${ticket.details.length} mặt hàng · ${number.format(ticket.details.reduce((sum, detail) => sum + detail.quantity, 0))} đơn vị`,
    <span key={`${ticket.uuid}-total`} className="font-semibold">{money.format(ticketTotal(ticket))}</span>,
    <StatusPill key={`${ticket.uuid}-pending`} tone="amber">Chờ xác nhận</StatusPill>,
  ]);

  const recentRows = movements.slice(0, 7).map(({ kind, ticket }) => [
    <div key={`${ticket.uuid}-recent-code`}><p className="font-mono font-semibold">{ticketCode(ticket, kind)}</p><p className="mt-1 text-xs text-muted-foreground">{dateTime.format(new Date(ticket.createdAt))}</p></div>,
    kind === "import" ? "Nhập kho" : "Xuất kho",
    ticket.details[0]?.medicineName ? `${ticket.details[0].medicineName}${ticket.details.length > 1 ? ` và ${ticket.details.length - 1} thuốc khác` : ""}` : "Chưa có mặt hàng",
    money.format(ticketTotal(ticket)),
    <TicketStatus key={`${ticket.uuid}-recent-status`} status={ticket.status} />,
  ]);

  if (loading) return <div className="border bg-white p-10 text-center text-sm text-muted-foreground">Đang tổng hợp dữ liệu kho...</div>;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Điều hành kho thuốc"
        title="Tổng quan kho thuốc"
        description="Theo dõi sức khỏe tồn kho, giá trị thuốc, phiếu chờ xác nhận và các mặt hàng cần xử lý của bệnh viện hiện tại."
        actions={<><Link href="/noi-bo/trang-tong/ton-kho" className={buttonVariants({ variant: "outline" })}><Warehouse />Xem tồn kho</Link><Link href="/noi-bo/trang-tong/nhap-hang" className={buttonVariants()}><ArrowDownToLine />Tạo phiếu nhập</Link></>}
      />
      {error ? <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button type="button" className="font-semibold underline" onClick={() => void load()}>Thử lại</button></div> : null}

      <MetricGrid>
        <MetricCard label="Loại thuốc trong kho" value={number.format(inventory.length)} detail={`${number.format(totalQuantity)} đơn vị thuốc đang quản lý`} icon={<Boxes className="size-5" />} />
        <MetricCard label="Cần bổ sung" value={number.format(lowStock.length + outOfStock.length)} detail={`${outOfStock.length} hết hàng · ${lowStock.length} dưới ngưỡng`} icon={<AlertTriangle className="size-5" />} tone={outOfStock.length ? "red" : "amber"} />
        <MetricCard label="Phiếu chờ xác nhận" value={number.format(pendingMovements.length)} detail={`${pendingImports.length} nhập kho · ${pendingExports.length} xuất kho`} icon={<ClipboardCheck className="size-5" />} tone="amber" />
        <MetricCard label="Giá trị tồn kho" value={compactMoney(totalValue)} detail={`Giá trị chi tiết ${money.format(totalValue)}`} icon={<CircleDollarSign className="size-5" />} tone="green" />
      </MetricGrid>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <PortalSection title="Thuốc cần xử lý sớm" description={`${alerts.length} mặt hàng ưu tiên cao nhất`} action={<Link href="/noi-bo/trang-tong/ton-kho" className={buttonVariants({ variant: "outline", size: "sm" })}>Xem toàn bộ</Link>}>
          {alertRows.length ? <PortalTable caption="Thuốc cần bổ sung" columns={["Thuốc", "Tồn", "Tối thiểu", "Cần bổ sung", "Mức độ"]} rows={alertRows} /> : <DashboardEmpty icon={<PackageCheck />} text="Tất cả mặt hàng đang ở mức tồn ổn định." />}
        </PortalSection>
        <PortalSection title="Sức khỏe tồn kho" description="Tỷ trọng theo số loại thuốc">
          <div className="space-y-5 p-5">
            <HealthBar healthy={healthyStock} low={lowStock.length} out={outOfStock.length} total={inventory.length} />
            <HealthRow label="Ổn định" value={healthyStock} total={inventory.length} tone="bg-emerald-500" />
            <HealthRow label="Dưới ngưỡng" value={lowStock.length} total={inventory.length} tone="bg-amber-400" />
            <HealthRow label="Hết hàng" value={outOfStock.length} total={inventory.length} tone="bg-red-500" />
            <div className="grid grid-cols-2 gap-3 border-t pt-4 text-sm"><div><p className="text-muted-foreground">Nhà cung cấp</p><p className="mt-1 text-xl font-bold text-[#173b57]">{activeProviders}</p></div><div><p className="text-muted-foreground">Tỷ lệ ổn định</p><p className="mt-1 text-xl font-bold text-emerald-700">{percent(healthyStock, inventory.length)}%</p></div></div>
          </div>
        </PortalSection>
      </div>

      <PortalSection title="Phiếu đang chờ xác nhận" description="Xử lý các phiếu này để cập nhật tồn kho" action={<div className="flex gap-2"><Link href="/noi-bo/trang-tong/nhap-hang" className={buttonVariants({ variant: "outline", size: "sm" })}>Phiếu nhập</Link><Link href="/noi-bo/trang-tong/xuat-hang" className={buttonVariants({ variant: "outline", size: "sm" })}>Phiếu xuất</Link></div>}>
        {pendingRows.length ? <PortalTable caption="Phiếu kho chờ xác nhận" columns={["Mã phiếu", "Loại", "Đối tác / nguồn", "Quy mô", "Giá trị", "Trạng thái"]} rows={pendingRows} /> : <DashboardEmpty icon={<ClipboardCheck />} text="Không có phiếu kho nào đang chờ xác nhận." />}
      </PortalSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortalSection title="Cơ cấu giá trị theo đơn vị" description="Phân bổ giá trị thuốc đang tồn">
          {unitProgress.length ? <ProgressList items={unitProgress} /> : <DashboardEmpty icon={<Boxes />} text="Chưa có dữ liệu tồn kho." />}
        </PortalSection>
        <PortalSection title="Thuốc có giá trị tồn cao" description="Các mặt hàng chiếm giá trị lớn trong kho">
          {highValueItems.length ? <div className="divide-y">{highValueItems.map((item, index) => <div key={item.uuid} className="flex items-center gap-3 px-5 py-3.5"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-primary">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.medicineName}</p><p className="mt-1 text-xs text-muted-foreground">{number.format(item.quantity)} {getMedicineUnitLabel(item.unit).toLocaleLowerCase("vi")} · {money.format(item.price)}/đơn vị</p></div><strong className="text-sm text-[#173b57]">{money.format(item.quantity * item.price)}</strong></div>)}</div> : <DashboardEmpty icon={<Boxes />} text="Chưa có dữ liệu tồn kho." />}
        </PortalSection>
      </div>

      <PortalSection title="Hoạt động nhập xuất gần đây" description={`Đã xác nhận: nhập ${money.format(confirmedImportValue)} · xuất ${money.format(confirmedExportValue)}`}>
        {recentRows.length ? <PortalTable caption="Hoạt động kho gần đây" columns={["Mã phiếu", "Nghiệp vụ", "Mặt hàng", "Giá trị", "Trạng thái"]} rows={recentRows} /> : <DashboardEmpty icon={<ArrowUpFromLine />} text="Chưa phát sinh hoạt động nhập xuất." />}
      </PortalSection>
    </div>
  );
}

function ticketTotal(ticket: WarehouseTicket) {
  return ticket.details.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);
}

function ticketCode(ticket: WarehouseTicket, kind: Movement["kind"]) {
  return `${kind === "import" ? "NH" : "XH"}-${ticket.uuid.slice(0, 8).toUpperCase()}`;
}

function stockSeverity(item: WarehouseInventory) {
  if (item.quantity <= 0) return 0;
  return item.minimumQuantity > 0 ? item.quantity / item.minimumQuantity : 1;
}

function percent(value: number, total: number) {
  return total ? Math.round(value / total * 100) : 0;
}

function compactMoney(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ ₫`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu ₫`;
  return money.format(value);
}

function inventoryByUnit(inventory: WarehouseInventory[]) {
  const grouped = new Map<string, number>();
  inventory.forEach((item) => grouped.set(item.unit, (grouped.get(item.unit) ?? 0) + item.quantity * item.price));
  const rows = Array.from(grouped, ([unit, value]) => ({ unit, value })).sort((left, right) => right.value - left.value);
  const maximum = Math.max(...rows.map((item) => item.value), 1);
  const colors = ["bg-primary", "bg-cyan-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500", "bg-slate-500"];
  return rows.map((item, index) => ({ label: getMedicineUnitLabel(item.unit), value: Math.round(item.value / maximum * 100), display: money.format(item.value), color: colors[index % colors.length] }));
}

function TicketStatus({ status }: { status: WarehouseTicket["status"] }) {
  return <StatusPill tone={status === "Confirmed" ? "green" : status === "Cancelled" ? "red" : "amber"}>{status === "Confirmed" ? "Đã xác nhận" : status === "Cancelled" ? "Đã hủy" : "Chờ xác nhận"}</StatusPill>;
}

function HealthBar({ healthy, low, out, total }: { healthy: number; low: number; out: number; total: number }) {
  return <div><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Phân bố mức tồn</span><span>{total} loại thuốc</span></div><div className="flex h-3 overflow-hidden rounded-full bg-muted"><span className="bg-emerald-500" style={{ width: `${percent(healthy, total)}%` }} /><span className="bg-amber-400" style={{ width: `${percent(low, total)}%` }} /><span className="bg-red-500" style={{ width: `${percent(out, total)}%` }} /></div></div>;
}

function HealthRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: string }) {
  return <div className="flex items-center gap-3 text-sm"><span className={`size-2.5 rounded-full ${tone}`} /><span className="flex-1 text-muted-foreground">{label}</span><strong>{value}</strong><span className="w-10 text-right text-xs text-muted-foreground">{percent(value, total)}%</span></div>;
}

function DashboardEmpty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex flex-col items-center justify-center gap-3 p-10 text-center text-sm text-muted-foreground"><span className="flex size-10 items-center justify-center rounded-full bg-muted [&_svg]:size-5">{icon}</span><p>{text}</p></div>;
}
