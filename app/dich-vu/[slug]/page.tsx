import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MedicalServiceDetailView } from "@/components/detail/medical-service-detail-view";
import { markdownToPlainText } from "@/lib/format";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";

type Props = {
  params: Promise<{ slug: string }>;
};

const getDetail = cache(async (slug: string) => {
  const response = await medicalServiceService.getBySlug(slug);
  return response?.data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getDetail(slug);

  if (!detail) return { title: "Không tìm thấy dịch vụ y tế" };

  return {
    title: detail.medicalService.name,
    description: markdownToPlainText(detail.medicalService.description).slice(0, 155),
  };
}

export default async function MedicalServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getDetail(slug);
  if (!detail) notFound();

  return <MedicalServiceDetailView detail={detail} />;
}
