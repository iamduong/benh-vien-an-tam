import { EditHospitalScreen } from "@/components/internal/trang-tong/system-management/edit-hospital-screen";

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return <EditHospitalScreen hospitalUuid={uuid} />;
}
