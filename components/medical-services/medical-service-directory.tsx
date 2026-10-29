"use client";

import {
  ArrowRight,
  CalendarPlus,
  Clock3,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DiscoveryFilters,
  type DiscoveryFilter,
} from "@/components/discovery/discovery-filters";
import { DirectoryHero } from "@/components/discovery/directory-hero";
import { DiscoveryPagination } from "@/components/discovery/discovery-pagination";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, markdownToPlainText } from "@/lib/format";
import type { PaginatedData } from "@/lib/http/response";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";
import { cn } from "@/lib/utils";
import type { Hospital, MedicalService } from "@/types/models";

type DirectoryData = {
  result: PaginatedData<MedicalService>;
  hospitals: Hospital[];
};

type DirectoryState =
  | { status: "idle" }
  | { status: "success"; key: string; data: DirectoryData }
  | { status: "error"; key: string; message: string };

export function MedicalServiceDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();
  const query = searchParams.get("q")?.trim() || "";
  const hospital = searchParams.get("hospital") || "";
  const page = parsePage(searchParams.get("page"));
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${query}:${hospital}:${page}:${attempt}`;
  const [state, setState] = useState<DirectoryState>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const key = requestKey;
    Promise.all([
      medicalServiceService.getAll(
        {
          q: query || undefined,
          hospital: hospital || undefined,
          page,
          pageSize: 4,
        },
        controller.signal,
      ),
      hospitalService.getOptions(controller.signal),
    ])
      .then(([serviceResponse, hospitalResponse]) => {
        if (!active) return;
        setState({
          status: "success",
          key,
          data: {
            result: serviceResponse.data,
            hospitals: hospitalResponse.data,
          },
        });
      })
      .catch(() => {
        if (!active) return;
        setState({
          status: "error",
          key,
          message: "Không thể tải danh sách dịch vụ y tế. Vui lòng thử lại.",
        });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [hospital, page, query, requestKey]);

  const isCurrent = state.status !== "idle" && state.key === requestKey;
  const data = state.status === "success" && isCurrent ? state.data : null;
  const filters = getFilters(data?.hospitals ?? []);

  useEffect(() => {
    if (!data || data.result.Page === page) return;
    const params = new URLSearchParams(currentParams);
    if (data.result.Page === 1) params.delete("page");
    else params.set("page", String(data.result.Page));
    const nextParams = params.toString();
    router.replace(nextParams ? `/dich-vu?${nextParams}` : "/dich-vu", {
      scroll: false,
    });
  }, [currentParams, data, page, router]);

  return (
    <div>
      <DirectoryHero
        eyebrow="Dịch vụ y tế chủ động"
        title="Chọn đúng dịch vụ, chuẩn bị tốt hơn cho buổi khám"
        description="Tra cứu nội dung thực hiện, chi phí dự kiến, thời gian và cơ sở cung cấp trước khi đặt lịch."
        benefits={[
          "Nội dung và chi phí dự kiến rõ ràng",
          "Lọc nhanh theo cơ sở đang cung cấp",
        ]}
        actionLabel="Khám phá dịch vụ"
        actionHref="#service-results"
        image="https://res.cloudinary.com/dzpgchw3n/image/upload/v1790131852/images_eclihy.jpg"
        imageAlt="Minh họa dịch vụ y tế"
      />

      <section id="service-results" className="scroll-mt-20 bg-muted/45 py-9 sm:py-12">
        <div className="container-shell">
          <nav
            aria-label="Đường dẫn"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              Trang chủ
            </Link>
            <ArrowRight aria-hidden="true" className="size-3.5" />
            <span className="font-medium text-foreground">Dịch vụ y tế</span>
          </nav>

          <div className="mt-6 rounded-2xl border bg-card p-3 shadow-sm sm:p-4">
            <form
              key={`${query}:${hospital}`}
              action="/dich-vu"
              method="get"
              role="search"
              className="flex min-w-0 flex-col gap-2 sm:flex-row"
            >
              {hospital ? <input type="hidden" name="hospital" value={hospital} /> : null}
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  name="q"
                  defaultValue={query}
                  aria-label="Tìm dịch vụ y tế"
                  placeholder="Tìm tên hoặc nội dung dịch vụ..."
                  className="h-12 border-0 bg-muted/55 pl-11 shadow-none focus-visible:ring-1"
                />
              </div>
              <button
                type="submit"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-7")}
              >
                <Search aria-hidden="true" />
                Tìm dịch vụ
              </button>
            </form>
          </div>

          <div className="mt-7 grid min-w-0 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="self-start lg:sticky lg:top-24">
              {data ? (
                <DiscoveryFilters
                  key={currentParams}
                  pathname="/dich-vu"
                  currentParams={currentParams}
                  filters={filters}
                />
              ) : (
                <FilterSkeleton />
              )}
            </aside>

            <section aria-live="polite" className="min-w-0">
              {!isCurrent ? <ServiceResultsSkeleton /> : null}
              {state.status === "error" && isCurrent ? (
                <ErrorState
                  message={state.message}
                  onRetry={() => setAttempt((value) => value + 1)}
                />
              ) : null}
              {data ? (
                <>
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Chăm sóc theo nhu cầu
                      </p>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight">
                        Dịch vụ đang cung cấp
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {data.result.TotalItems} dịch vụ
                    </p>
                  </div>

                  {data.result.Items.length ? (
                    <div className="grid items-stretch gap-5 xl:grid-cols-2">
                      {data.result.Items.map((service) => (
                        <ServiceDirectoryCard key={service.uuid} service={service} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      message="Không tìm thấy dịch vụ phù hợp với từ khóa và cơ sở đã chọn."
                      action={
                        <Link
                          href="/dich-vu"
                          className={buttonVariants({ variant: "outline" })}
                        >
                          Xóa tìm kiếm và bộ lọc
                        </Link>
                      }
                    />
                  )}
                  <DiscoveryPagination
                    pathname="/dich-vu"
                    currentParams={currentParams}
                    page={data.result.Page}
                    totalPages={data.result.TotalPages}
                  />
                </>
              ) : null}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceDirectoryCard({ service }: { service: MedicalService }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <Link
        href={`/dich-vu/${service.slug}`}
        className="relative block aspect-[16/7] overflow-hidden bg-muted"
      >
        <Image
          src={service.image}
          alt={`Minh họa ${service.name}`}
          fill
          sizes="(min-width: 1280px) 35vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
          Dịch vụ đang hoạt động
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/dich-vu/${service.slug}`}>
          <h3 className="text-xl font-bold leading-7 group-hover:text-primary">
            {service.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {markdownToPlainText(service.description) || "Thông tin đang được cập nhật."}
        </p>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          {service.workingHour}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-sm text-muted-foreground">Chi phí dự kiến</span>
          <strong className="text-base text-primary">{formatPrice(service.price)}</strong>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link
            href={`/dich-vu/${service.slug}`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Xem chi tiết
          </Link>
          <Link
            href={`/dat-lich/dich-vu?service=${service.uuid}`}
            className={cn(buttonVariants(), "w-full")}
          >
            <CalendarPlus aria-hidden="true" />
            Đặt lịch
          </Link>
        </div>
      </div>
    </article>
  );
}

function getFilters(hospitals: Hospital[]): DiscoveryFilter[] {
  return [
    {
      key: "hospital",
      label: "Cơ sở cung cấp",
      allLabel: "Tất cả cơ sở",
      options: hospitals.map((item) => ({ value: item.uuid, label: item.name })),
    },
  ];
}

function FilterSkeleton() {
  return (
    <div className="hidden h-48 animate-pulse rounded-xl bg-muted lg:block" aria-label="Đang tải bộ lọc" />
  );
}

function ServiceResultsSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Đang tải danh sách dịch vụ">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[28rem] rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function MedicalServiceDirectorySkeleton() {
  return (
    <div>
      <div className="h-80 animate-pulse bg-secondary/40" />
      <div className="container-shell py-10">
        <ServiceResultsSkeleton />
      </div>
    </div>
  );
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
