"use client";

import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  DetailGrid,
  DetailItem,
  PortalPageHeader,
  PortalSection,
  StatusPill,
} from "@/components/internal/portal-ui";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { buttonVariants } from "@/components/ui/button";
import {
  adminHospitalService,
  type AdminHospitalItem,
} from "@/lib/services/hospital/AdminHospitalService";
import { BaseStatus } from "@/types/models";

const hospitalListPath = "/noi-bo/trang-tong/co-so-y-te";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

export function HospitalDetailScreen({ hospitalUuid }: { hospitalUuid: string }) {
  const [hospital, setHospital] = useState<AdminHospitalItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    adminHospitalService.getById(hospitalUuid, controller.signal)
      .then((response) => {
        const item = response.data ?? response.data;
        if (!item) throw new Error("API không trả về dữ liệu cơ sở y tế");
        setHospital(item);
      })
      .catch((loadError) => {
        if (controller.signal.aborted) return;
        console.error("Không thể tải cơ sở y tế:", loadError);
        setError("Không thể tải thông tin cơ sở y tế.");
      });

    return () => controller.abort();
  }, [hospitalUuid]);

  if (error) return <div className="p-8 text-center text-destructive">{error}</div>;
  if (!hospital) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  const editPath = `${hospitalListPath}/${hospital.uuid}/chinh-sua`;
  const isActive = hospital.status === BaseStatus.Active || (hospital.status as unknown) === 0;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Danh mục toàn hệ thống"
        title={hospital.name}
        description="Xem đầy đủ thông tin vận hành và nội dung giới thiệu của cơ sở y tế."
        actions={(
          <div className="flex flex-wrap gap-2">
            <Link href={hospitalListPath} className={buttonVariants({ variant: "outline" })}>
              <ArrowLeft /> Quay lại danh sách
            </Link>
            <Link href={editPath} className={buttonVariants()}>
              <Pencil /> Chỉnh sửa
            </Link>
          </div>
        )}
      />

      <PortalSection title="Thông tin cơ sở y tế" description={`Mã cơ sở: ${hospital.uuid}`}>
        <div className="space-y-6 p-5">
          {hospital.image ? (
            <img src={hospital.image} alt={hospital.name} className="max-h-96 w-full rounded-xl border object-cover" />
          ) : null}
          <DetailGrid>
            <DetailItem label="Tên cơ sở" value={hospital.name} />
            <DetailItem label="slug" value={hospital.slug} />
            <DetailItem label="Địa chỉ" value={hospital.address} />
            <DetailItem label="Số phòng" value={hospital.numberOfRoom} />
            <DetailItem label="Giờ làm việc" value={hospital.workingHour || "Chưa cập nhật"} />
            <DetailItem label="Trạng thái" value={<StatusPill tone={isActive ? "green" : "amber"}>{isActive ? "Hoạt động" : "Tạm ngưng"}</StatusPill>} />
            <DetailItem label="Ngày tạo" value={dateFormatter.format(new Date(hospital.createdAt))} />
            <DetailItem label="Cập nhật" value={dateFormatter.format(new Date(hospital.updatedAt))} />
            <DetailItem
              label="Bản đồ"
              value={hospital.mapUrl ? (
                <a href={hospital.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">
                  Mở bản đồ <ExternalLink className="size-3.5" />
                </a>
              ) : "Chưa cập nhật"}
            />
          </DetailGrid>
        </div>
      </PortalSection>

      <PortalSection title="Mô tả" description="Nội dung giới thiệu cơ sở y tế">
        <div className="p-5">
          {hospital.description ? <SafeMarkdown content={hospital.description} /> : <p className="text-sm text-muted-foreground">Chưa có nội dung.</p>}
        </div>
      </PortalSection>

      <PortalSection title="Chi tiết dịch vụ" description="Thông tin dịch vụ tại cơ sở">
        <div className="p-5">
          {hospital.detailService ? <SafeMarkdown content={hospital.detailService} /> : <p className="text-sm text-muted-foreground">Chưa có nội dung.</p>}
        </div>
      </PortalSection>
    </div>
  );
}
