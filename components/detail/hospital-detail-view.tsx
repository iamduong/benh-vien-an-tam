import {
  CalendarPlus,
  ChevronRight,
  Clock3,
  DoorOpen,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { DetailImage } from "@/components/detail/detail-image";
import { DetailSection } from "@/components/detail/detail-shell";
import { RelatedList } from "@/components/detail/related-list";
import { ReviewList } from "@/components/detail/review-list";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { buttonVariants } from "@/components/ui/button";
import { displayText, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { HospitalDetail } from "@/types/details";

const sections = [
  { id: "gioi-thieu", label: "Giới thiệu" },
  { id: "chuyen-khoa", label: "Chuyên khoa" },
  { id: "dich-vu-y-te", label: "Dịch vụ" },
  { id: "huong-dan", label: "Hướng dẫn đi khám" },
  { id: "vi-tri", label: "Vị trí" },
  { id: "danh-gia", label: "Đánh giá" },
];

export function HospitalDetailView({ detail }: { detail: HospitalDetail }) {
  const { hospital, departments, medicalServices, reviews } = detail;
  const bookingHref = `/dat-lich/co-so-y-te?hospital=${hospital.uuid}`;

  return (
    <article className="pb-20">
      <div className="container-shell pt-6 sm:pt-8">
        <nav
          aria-label="Đường dẫn"
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="shrink-0 hover:text-foreground">
            Trang chủ
          </Link>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
          <Link
            href="/co-so-y-te"
            className="shrink-0 hover:text-foreground"
          >
            Cơ sở y tế
          </Link>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
          <span aria-current="page" className="truncate text-foreground">
            {hospital.name}
          </span>
        </nav>

        <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
          <div className="relative min-h-72 overflow-hidden rounded-2xl border bg-muted sm:min-h-[28rem]">
            <DetailImage
              src={hospital.image}
              fallbackSrc="/images/hospital-campus-placeholder.svg"
              alt={`Không gian ${hospital.name}`}
            />
          </div>

          <section className="flex min-w-0 flex-col rounded-2xl border bg-card p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Cơ sở y tế đang hoạt động
            </p>

            <h1 className="mt-5 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {hospital.name}
            </h1>
            <div className="mt-5 space-y-3">
              <SummaryFact icon={MapPin} value={displayText(hospital.address)} />
              <SummaryFact icon={Clock3} value={displayText(hospital.workingHour)} />
              <SummaryFact
                icon={DoorOpen}
                value={`${hospital.numberOfRoom} phòng theo thông tin cơ sở`}
              />
            </div>

            <div className="mt-auto grid gap-2 pt-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="#gioi-thieu"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full",
                )}
              >
                Xem thông tin
              </a>
              <Link
                href={bookingHref}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                <CalendarPlus aria-hidden="true" />Đặt lịch khám
              </Link>
            </div>
          </section>
        </div>
      </div>

      <nav
        aria-label="Nội dung trang"
        className="sticky top-16 z-30 mt-8 border-y bg-background/95 backdrop-blur-sm"
      >
        <div className="container-shell overflow-x-auto">
          <div className="flex min-w-max gap-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-foreground"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="container-shell mt-8 grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-7">
          <DetailSection id="gioi-thieu" title="Giới thiệu cơ sở">
            {hospital.description.trim() ? (
              <SafeMarkdown content={hospital.description} />
            ) : (
              <p className="text-sm leading-7 text-muted-foreground">
                Thông tin giới thiệu của cơ sở đang được cập nhật.
              </p>
            )}
          </DetailSection>

          <DetailSection
            id="chuyen-khoa"
            title="Chuyên khoa"
            description="Các khoa đang được liên kết và tiếp nhận tại cơ sở."
          >
            <RelatedList
              items={departments.map((department) => ({
                href: `/chuyen-khoa/${department.slug}`,
                title: department.name,
                description: department.description,
              }))}
              emptyMessage="Chuyên khoa đang được cập nhật."
            />
          </DetailSection>

          <DetailSection
            id="dich-vu-y-te"
            title="Dịch vụ đang cung cấp"
          >
            <RelatedList
              items={medicalServices.map((service) => ({
                href: `/dich-vu/${service.slug}`,
                title: service.name,
                description: `${formatPrice(service.price)} · ${displayText(service.workingHour)}`,
              }))}
              emptyMessage="Dịch vụ tại cơ sở đang được cập nhật."
            />
          </DetailSection>

          <DetailSection id="huong-dan" title="Hướng dẫn đi khám">
            {hospital.detailService.trim() ? (
              <SafeMarkdown content={hospital.detailService} />
            ) : (
              <p className="text-sm leading-7 text-muted-foreground">
                Vui lòng đặt lịch trước và có mặt sớm khoảng 15 phút để hoàn tất thủ tục tiếp nhận.
              </p>
            )}
          </DetailSection>

          <DetailSection id="vi-tri" title="Vị trí cơ sở">
            {hospital.mapUrl.trim() ? (
              <div className="overflow-hidden rounded-xl border bg-muted">
                <iframe
                  src={hospital.mapUrl}
                  title={`Bản đồ ${hospital.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-80 w-full border-0"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 text-center text-sm text-muted-foreground">
                Bản đồ của cơ sở đang được cập nhật.
              </div>
            )}
            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
              {hospital.address}
            </p>
          </DetailSection>

          <DetailSection id="danh-gia" title="Đánh giá từ người bệnh">
            <ReviewList
              reviews={reviews}
              target={{ type: "hospital", uuid: hospital.uuid }}
            />
          </DetailSection>
        </div>

        <aside className="hidden self-start space-y-4 lg:sticky lg:top-32 lg:block">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-semibold text-primary">
              Đặt lịch tại cơ sở
            </p>
            <h2 className="mt-2 text-lg font-bold">Chủ động thời gian khám</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Chọn ngày, giờ phù hợp và gửi yêu cầu. Lịch mới sẽ ở trạng thái chờ duyệt.
            </p>
            <Link
              href={bookingHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-5 w-full",
              )}
            >
              <CalendarPlus aria-hidden="true" />Đặt lịch khám
            </Link>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm font-semibold">Thông tin nhanh</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {departments.length} chuyên khoa · {medicalServices.length} dịch vụ
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {medicalServices.length
                ? `Chi phí dịch vụ từ ${formatPrice(Math.min(...medicalServices.map((item) => item.price)))}`
                : "Chi phí dịch vụ đang cập nhật"}
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-4 bottom-3 z-40 lg:hidden">
        <Link
          href={bookingHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full border border-primary-foreground/20 shadow-md",
          )}
        >
          <CalendarPlus aria-hidden="true" />Đặt lịch khám
        </Link>
      </div>
    </article>
  );
}

function SummaryFact({
  icon: Icon,
  value,
}: {
  icon: typeof MapPin;
  value: string;
}) {
  return (
    <p className="flex min-w-0 items-start gap-2 text-sm leading-6 text-muted-foreground">
      <Icon aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
      <span className="break-words">{value}</span>
    </p>
  );
}
