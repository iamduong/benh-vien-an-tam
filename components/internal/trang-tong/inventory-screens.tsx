"use client";

import {
  ExportManagementScreen,
  ImportManagementScreen,
  InventoryListScreen,
  ProviderManagementScreen,
  WarehouseDashboardScreen,
  WarehouseReportsScreen,
} from "./warehouse-management";

export function InventoryScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan":
      return <WarehouseDashboardScreen />;
    case "ton-kho":
      return <InventoryListScreen />;
    case "nha-cung-cap":
      return <ProviderManagementScreen />;
    case "phieu-nhap-xuat":
    case "nhap-hang":
      return <ImportManagementScreen />;
    case "xuat-hang":
      return <ExportManagementScreen />;
    case "bao-cao":
      return <WarehouseReportsScreen />;
    default:
      return null;
  }
}
