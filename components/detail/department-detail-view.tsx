import { Building2, ChevronRight, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DoctorCard, HospitalCard } from "@/components/home/featured-cards";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DepartmentDetail } from "@/types/details";

export function DepartmentDetailView({ detail }: { detail: DepartmentDetail }) {
  const { department, doctors, hospitals } = detail;

  return (
    <article className="pb-20">
      <div className="container-shell pt-6 sm:pt-8">
        <nav
          aria-label="Đường dẫn"
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="shrink-0 hover:text-foreground">Trang chủ</Link>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
          <Link href="/bac-si" className="shrink-0 hover:text-foreground">Chuyên khoa</Link>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
          <span aria-current="page" className="truncate text-foreground">
            {department.name}
          </span>
        </nav>

        <section className="relative mt-6 overflow-hidden rounded-2xl border bg-[linear-gradient(135deg,var(--secondary),var(--background)_65%)] p-6 sm:p-9">
          <div className="absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid items-center gap-7 md:grid-cols-[9rem_minmax(0,1fr)]">
            <div className="flex size-28 items-center justify-center rounded-2xl border bg-background p-5 shadow-sm sm:size-36">
              <Image
                src={department.icon || "/images/departments/internal-medicine.svg"}
                alt=""
                width={112}
                height={112}
                className="size-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Chuyên khoa khám và điều trị
              </p>
              <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {department.name}
              </h1>
              <div className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                {department.description.trim() ? (
                  <SafeMarkdown content={department.description} showImages={false} />
                ) : (
                  <p>Thông tin giới thiệu chuyên khoa đang được cập nhật.</p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/bac-si?department=${department.uuid}`}
                  className={cn(buttonVariants({ size: "lg" }), "min-w-40")}
                >
                  <Stethoscope aria-hidden="true" /> Tìm bác sĩ
                </Link>
                <Link
                  href={`/co-so-y-te?department=${department.uuid}`}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-w-40")}
                >
                  <Building2 aria-hidden="true" /> Tìm cơ sở
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Metric icon={Stethoscope} value={doctors.length} label="bác sĩ đang tiếp nhận" />
          <Metric icon={Building2} value={hospitals.length} label="cơ sở có chuyên khoa" />
        </div>

        <section className="mt-10" aria-labelledby="department-doctors-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Đội ngũ chuyên môn</p>
              <h2 id="department-doctors-title" className="mt-1 text-2xl font-bold">
                Bác sĩ thuộc {department.name}
              </h2>
            </div>
            <Link
              href={`/bac-si?department=${department.uuid}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả bác sĩ
            </Link>
          </div>
          {doctors.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.uuid} doctor={doctor} showBookingAction />
              ))}
            </div>
          ) : (
            <EmptyState message="Danh sách bác sĩ của chuyên khoa đang được cập nhật." />
          )}
        </section>

        <section className="mt-12" aria-labelledby="department-hospitals-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Mạng lưới tiếp nhận</p>
              <h2 id="department-hospitals-title" className="mt-1 text-2xl font-bold">
                Cơ sở có chuyên khoa {department.name}
              </h2>
            </div>
            <Link
              href={`/co-so-y-te?department=${department.uuid}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả cơ sở
            </Link>
          </div>
          {hospitals.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {hospitals.map((hospital) => (
                <HospitalCard key={hospital.uuid} hospital={hospital} showBookingAction />
              ))}
            </div>
          ) : (
            <EmptyState message="Danh sách cơ sở của chuyên khoa đang được cập nhật." />
          )}
        </section>
      </div>
    </article>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Stethoscope;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <p>
        <strong className="block text-2xl font-bold">{value}</strong>
        <span className="text-sm text-muted-foreground">{label}</span>
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="mt-5 rounded-xl border border-dashed bg-muted/30 px-5 py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}
