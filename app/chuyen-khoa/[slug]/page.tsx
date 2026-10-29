import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { DepartmentDetailView } from "@/components/detail/department-detail-view";
import { markdownToPlainText } from "@/lib/format";
import { departmentService } from "@/lib/services/department/DepartmentService";

type Props = {
  params: Promise<{ slug: string }>;
};

const getDetail = cache(async (slug: string) => {
  const response = await departmentService.getBySlug(slug);
  return response?.data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getDetail(slug);

  if (!detail) return { title: "Không tìm thấy chuyên khoa" };

  return {
    title: detail.department.name,
    description:
      markdownToPlainText(detail.department.description).slice(0, 155) ||
      `Thông tin chuyên khoa ${detail.department.name}.`,
  };
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getDetail(slug);
  if (!detail) notFound();

  return <DepartmentDetailView detail={detail} />;
}
