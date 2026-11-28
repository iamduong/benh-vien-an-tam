import { ApiImplementationRequired } from "@/components/internal/portal-ui";
import { PermissionManagementScreen } from "@/components/internal/trang-tong/permission-screen";
import { AccountsManagementScreen } from "@/components/internal/trang-tong/system-management/accounts-management-screen";
import {
  DepartmentsManagementScreen,
  HospitalsManagementScreen,
  MedicalServicesManagementScreen,
  MedicinesManagementScreen,
} from "@/components/internal/trang-tong/system-management/catalog-management-screens";
import { TimeWorkingCatalogScreen } from "@/components/internal/trang-tong/working-hours-screens";

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
    <ApiImplementationRequired
      title="Tổng quan hệ thống"
      description="Chưa có API tổng hợp dữ liệu vận hành toàn hệ thống."
    />
  );
}

function SystemReportsScreen() {
  return (
    <ApiImplementationRequired
      title="Báo cáo hệ thống"
      description="Chưa có API báo cáo và thống kê toàn hệ thống."
    />
  );
}

function SystemAuditScreen() {
  return (
    <ApiImplementationRequired
      title="Nhật ký hệ thống"
      description="Chưa có API cung cấp audit log hệ thống."
    />
  );
}
