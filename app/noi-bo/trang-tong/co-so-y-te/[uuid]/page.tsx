import { HospitalDetailScreen } from "@/components/internal/trang-tong/system-management/hospital-detail-screen";

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return <HospitalDetailScreen hospitalUuid={uuid} />;
}
