"use client";

import { DoctorWorkingScreen } from "@/components/internal/trang-tong/working-hours-screens";
import { DoctorScheduleScreen } from "@/components/internal/trang-tong/clinical/doctor-schedule-screen";
import { DoctorPrescriptionsScreen } from "@/components/internal/trang-tong/clinical/doctor-prescriptions-screen";
import { AvailableMedicineScreen } from "@/components/internal/trang-tong/clinical/available-medicine-screen";
import DoctorProfileScreen from "@/components/internal/trang-tong/clinical/doctor-profile-screen";
import { ApiImplementationRequired } from "../portal-ui";

export function ClinicalScreens({ slug }: { slug: string }) {
  switch (slug) {
    case "tong-quan": return <DoctorDashboard />;
    case "lich-kham": return <DoctorScheduleScreen />;
    case "ca-kham": return null;
    case "don-thuoc": return <DoctorPrescriptionsScreen />;
    case "thuoc-kha-dung": return <AvailableMedicineScreen />;
    case "ho-so-nghe-nghiep": return <DoctorProfileScreen />;
    case "gio-lam-viec-bac-si": return <DoctorWorkingScreen view="schedule" />;
    default: return null;
  }
}

function DoctorDashboard() {
  return (
    <ApiImplementationRequired
      title="Tổng quan bác sĩ"
      description="Chưa có API tổng hợp dashboard và tiến độ làm việc của bác sĩ."
    />
  );
}
