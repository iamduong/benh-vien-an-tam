import { ApiImplementationRequired } from "@/components/internal/portal-ui";
import { ProviderManagementScreen, RealInventoryScreen, StockMovementScreen } from "@/components/internal/trang-tong/warehouse-management-screens";
import { WarehouseDashboardScreen } from "@/components/internal/trang-tong/warehouse-dashboard-screen";

export function InventoryScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <WarehouseDashboardScreen />;
    case "ton-kho": return <RealInventoryScreen />;
    case "nha-cung-cap": return <ProviderManagementScreen />;
    case "phieu-nhap-xuat":
    case "nhap-hang": return <StockMovementScreen kind="imports" />;
    case "xuat-hang": return <StockMovementScreen kind="exports" />;
    case "bao-cao": return <WarehouseReportsScreen />;
    default: return null;
  }
}

function WarehouseReportsScreen() {
  return (
    <ApiImplementationRequired
      title="Báo cáo nhập xuất tồn"
      description="Chưa có API báo cáo kho theo kỳ và số liệu tồn đầu kỳ, cuối kỳ."
    />
  );
}
