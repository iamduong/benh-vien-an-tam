import {
  Activity,
  CircleDollarSign,
  FileCheck2,
  Hospital,
  ShieldAlert,
  UsersRound,
} from "lucide-react";

import {
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
import { PermissionManagementScreen } from "@/components/internal/trang-tong/permission-screen";
import { AccountsManagementScreen } from "@/components/internal/trang-tong/system-management/accounts-management-screen";
import {
  DepartmentsManagementScreen,
  HospitalsManagementScreen,
  MedicalServicesManagementScreen,
  MedicinesManagementScreen,
} from "@/components/internal/trang-tong/system-management/catalog-management-screens";
import { ServiceWorkingScreen, TimeWorkingCatalogScreen } from "@/components/internal/trang-tong/working-hours-screens";

export function SystemScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <SystemDashboard />;
    case "co-so-y-te": return <HospitalsManagementScreen />;
    case "chuyen-khoa": return <DepartmentsManagementScreen />;
    case "dich-vu": return <MedicalServicesManagementScreen />;
    case "thuoc": return <MedicinesManagementScreen />;
    case "tai-khoan": return <AccountsManagementScreen />;
    case "bao-cao": return <SystemReportsScreen />;
    case "nhat-ky-he-thong": return <SystemAuditScreen />;
    case "khung-gio-lam-viec": return <TimeWorkingCatalogScreen />;
    case "phan-quyen": return <PermissionManagementScreen />;
    default: return null;
  }
}

function SystemDashboard() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Toàn hệ thống" title="Tổng quan vận hành" description="Theo dõi sức khỏe nền tảng, quy mô mạng lưới và các vấn đề cần xử lý." actions={<PortalAction variant="default">Xuất báo cáo</PortalAction>} />
      <MetricGrid>
        <MetricCard label="Cơ sở hoạt động" value="12" detail="Tăng 2 cơ sở trong quý" trend="up" icon={<Hospital className="size-5" />} />
        <MetricCard label="Tài khoản nhân sự" value="386" detail="97,4% đang hoạt động" icon={<UsersRound className="size-5" />} tone="cyan" />
        <MetricCard label="Lịch hẹn tháng này" value="8.420" detail="Tăng 11,8% so với tháng trước" trend="up" icon={<Activity className="size-5" />} tone="green" />
        <MetricCard label="Cảnh báo hệ thống" value="3" detail="1 cảnh báo cần xử lý ngay" trend="down" icon={<ShieldAlert className="size-5" />} tone="amber" />
      </MetricGrid>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <PortalSection title="Hoạt động theo chi nhánh" description="Tổng lịch hẹn trong 30 ngày gần nhất">
          <ProgressList items={[
            { label: "BV Đa khoa Thành Phố", value: 86, display: "2.845 lịch" },
            { label: "BV Quốc tế An Sinh", value: 68, display: "2.240 lịch", color: "bg-cyan-500" },
            { label: "BV Đa khoa Phương Nam", value: 54, display: "1.780 lịch", color: "bg-emerald-500" },
            { label: "Phòng khám Minh Tâm", value: 31, display: "1.021 lịch", color: "bg-amber-500" },
          ]} />
        </PortalSection>
        <PortalSection title="Tình trạng nền tảng" description="Cập nhật lúc 09:42">
          <div className="divide-y p-5 pt-2">
            {["API đặt lịch", "Dịch vụ xác thực", "Mock API", "Lưu trữ hình ảnh"].map((name, index) => (
              <div key={name} className="flex items-center justify-between py-3 text-sm">
                <span>{name}</span>
                <StatusPill tone={index === 2 ? "amber" : "green"}>{index === 2 ? "Theo dõi" : "Ổn định"}</StatusPill>
              </div>
            ))}
          </div>
        </PortalSection>
      </div>
      <PortalSection title="Thay đổi quản trị gần đây">
        <PortalTable caption="Thay đổi quản trị gần đây" columns={["Thời gian", "Người thực hiện", "Hành động", "Đối tượng", "Kết quả"]} rows={[
          ["09:35 23/09", "Trần Hoàng Nam", "Cập nhật trạng thái", "Phòng khám Minh Tâm", <StatusPill key="1" tone="green">Thành công</StatusPill>],
          ["08:12 23/09", "Lê Ngọc Anh", "Tạo quản trị viên", "BV Phương Nam", <StatusPill key="2" tone="green">Thành công</StatusPill>],
          ["16:48 22/09", "Trần Hoàng Nam", "Cập nhật dịch vụ", "MRI sọ não", <StatusPill key="3" tone="green">Thành công</StatusPill>],
        ]} />
      </PortalSection>
    </div>
  );
}

function SystemReportsScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Phân tích toàn hệ thống" title="Báo cáo hệ thống" description="Số liệu tổng hợp phục vụ vận hành, không hiển thị nội dung lâm sàng chi tiết." actions={<><PortalAction>Chọn kỳ báo cáo</PortalAction><PortalAction variant="default">Tải xuống</PortalAction></>} />
      <MetricGrid>
        <MetricCard label="Tổng lịch hẹn" value="24.680" detail="Quý III/2026" trend="up" icon={<Activity className="size-5" />} />
        <MetricCard label="Tỷ lệ hoàn thành" value="86,4%" detail="Tăng 3,1 điểm phần trăm" trend="up" icon={<FileCheck2 className="size-5" />} tone="green" />
        <MetricCard label="Tỷ lệ hủy" value="5,8%" detail="Giảm 0,7 điểm phần trăm" trend="down" icon={<ShieldAlert className="size-5" />} tone="amber" />
        <MetricCard label="Giá trị dịch vụ" value="8,2 tỷ" detail="Ước tính theo lịch hoàn tất" icon={<CircleDollarSign className="size-5" />} tone="cyan" />
      </MetricGrid>
      <div className="grid gap-6 lg:grid-cols-2">
        <PortalSection title="Lịch hẹn theo trạng thái"><ProgressList items={[
          { label: "Hoàn thành", value: 86, display: "21.324", color: "bg-emerald-500" },
          { label: "Đã xác nhận", value: 48, display: "1.936" },
          { label: "Chờ xác nhận", value: 26, display: "986", color: "bg-amber-500" },
          { label: "Đã hủy", value: 18, display: "1.434", color: "bg-red-400" },
        ]} /></PortalSection>
        <PortalSection title="Công suất theo khu vực"><ProgressList items={[
          { label: "TP. Hồ Chí Minh", value: 91, display: "91%" },
          { label: "Đồng Nai", value: 76, display: "76%", color: "bg-cyan-500" },
          { label: "Bình Dương", value: 68, display: "68%", color: "bg-emerald-500" },
          { label: "Long An", value: 54, display: "54%", color: "bg-amber-500" },
        ]} /></PortalSection>
      </div>
    </div>
  );
}

function SystemAuditScreen() {
  return (
    <div className="space-y-6">
      <PortalPageHeader eyebrow="Kiểm toán và bảo mật" title="Nhật ký hệ thống" description="Theo dõi hành động quản trị, thay đổi trạng thái và truy cập dữ liệu nhạy cảm." actions={<PortalAction variant="default">Xuất nhật ký</PortalAction>} />
      <PortalSection title="Dòng sự kiện" description="Nhật ký chỉ đọc, được lưu theo thời gian hệ thống.">
        <PortalToolbar placeholder="Tìm actor, hành động hoặc tài nguyên" filters={[{ label: "Mức độ", options: ["Thông tin", "Cảnh báo", "Quan trọng"] }, { label: "Khoảng thời gian", options: ["Hôm nay", "7 ngày", "30 ngày"] }]} />
        <PortalTable caption="Nhật ký hệ thống" columns={["Thời gian", "Actor", "Hành động", "Tài nguyên", "Chi nhánh", "Mức độ"]} rows={[
          ["23/09/2026 09:35:12", "Trần Hoàng Nam", "hospital.change_status", "HSP-0003", "Toàn hệ thống", <StatusPill key="1" tone="amber">Cảnh báo</StatusPill>],
          ["23/09/2026 09:02:48", "Lê Ngọc Anh", "account.create_staff", "ACC-0386", "BV Phương Nam", <StatusPill key="2" tone="blue">Thông tin</StatusPill>],
          ["23/09/2026 08:44:03", "Hệ thống", "auth.login_failed", "0908***019", "Không xác định", <StatusPill key="3" tone="red">Quan trọng</StatusPill>],
          ["22/09/2026 17:16:25", "Phạm Minh Tú", "service.update", "SVC-0048", "Toàn hệ thống", <StatusPill key="4" tone="blue">Thông tin</StatusPill>],
        ]} />
      </PortalSection>
    </div>
  );
}
