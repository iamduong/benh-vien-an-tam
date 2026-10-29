import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { DoctorDetailView } from "@/components/detail/doctor-detail-view";
import { markdownToPlainText } from "@/lib/format";
import { doctorService } from "@/lib/services/doctor/DoctorService";

type Props = {
  params: Promise<{ slug: string }>;
};

const getDetail = cache(async (slug: string) => {
  const response = await doctorService.getBySlug(slug);
  return response?.data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getDetail(slug);

  if (!detail) return { title: "Không tìm thấy bác sĩ" };

  return {
    title: detail.doctor.name,
    description:
      markdownToPlainText(detail.doctor.introduction).slice(0, 155) ||
      `Thông tin bác sĩ ${detail.doctor.name}.`,
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getDetail(slug);
  if (!detail) notFound();

  return <DoctorDetailView detail={detail} />;
}
