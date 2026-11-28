import { ApiImplementationRequired } from "@/components/internal/portal-ui";
import { HospitalReviewsScreen as HospitalReviewsManagementScreen } from "@/components/internal/trang-tong/hospital-reviews-screen";
import { ReceptionCheckinScreen } from "@/components/internal/trang-tong/reception-checkin-screen";
import { BranchRoomsScreen } from "@/components/internal/trang-tong/branch-screens";

export function ReceptionScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <StaffDashboard />;
    case "lich-hen": return <ReceptionCheckinScreen />;
    case "tiep-nhan": return <ReceptionCheckinScreen />;
    case "phong-kham": return <BranchRoomsScreen />;
    case "thanh-toan-cap-thuoc": return <PaymentDispensingScreen />;
    case "danh-gia": return <StaffReviewsScreen />;
    default: return null;
  }
}

function StaffDashboard() {
  return (
    <ApiImplementationRequired
      title="Tổng quan tiếp nhận"
      description="Chưa có API tổng hợp dashboard, hàng chờ và chỉ số vận hành tiếp nhận."
    />
  );
}

function PaymentDispensingScreen() {
  return (
    <ApiImplementationRequired
      title="Thanh toán và cấp thuốc"
      description="Chưa có API dành cho lễ tân để lấy hàng chờ thanh toán và cấp thuốc."
    />
  );
}

function StaffReviewsScreen() {
  return <HospitalReviewsManagementScreen />;
}
