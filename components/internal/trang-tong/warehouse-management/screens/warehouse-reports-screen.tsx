"use client";

import { Archive, ArrowDownToLine, ArrowUpFromLine, CircleDollarSign } from "lucide-react";

import {
  DetailGrid,
  DetailItem,
  MetricCard,
  MetricGrid,
  PortalAction,
  PortalPageHeader,
  PortalSection,
  ProgressList,
} from "@/components/internal/portal-ui";

export function WarehouseReportsScreen() {
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
