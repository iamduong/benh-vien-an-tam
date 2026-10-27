"use client";

import { HospitalFormScreen } from "@/components/internal/trang-tong/system-management/create-hospital-screen";

export function EditHospitalScreen({ hospitalUuid }: { hospitalUuid: string }) {
  return <HospitalFormScreen hospitalUuid={hospitalUuid} />;
}
