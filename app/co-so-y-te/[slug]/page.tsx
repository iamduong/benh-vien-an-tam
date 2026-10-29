import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { HospitalDetailView } from "@/components/detail/hospital-detail-view";
import { markdownToPlainText } from "@/lib/format";
import { hospitalService } from "@/lib/services/hospital/HospitalService";

type Props = {
  params: Promise<{ slug: string }>;
};

const getDetail = cache(async (slug: string) => {
  const response = await hospitalService.getBySlug(slug);
  return response?.data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getDetail(slug);

  if (!detail) return { title: "Không tìm thấy cơ sở y tế" };

  return {
    title: detail.hospital.name,
    description:
      markdownToPlainText(detail.hospital.description).slice(0, 155) ||
      `Thông tin cơ sở y tế ${detail.hospital.name}.`,
  };
}

export default async function HospitalDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getDetail(slug);
  if (!detail) notFound();

  return <HospitalDetailView detail={detail} />;
}
