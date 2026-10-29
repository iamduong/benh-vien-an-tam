"use client";

import {
  ArrowRight,
  Building2,
  ClipboardList,
  Search,
  UserRoundSearch,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DoctorCard,
  HospitalCard,
  MedicalServiceCard,
} from "@/components/home/featured-cards";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaginatedData } from "@/lib/http/response";
import { doctorService } from "@/lib/services/doctor/DoctorService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";
import { cn } from "@/lib/utils";
import type { DoctorProfile, Hospital, MedicalService } from "@/types/models";

type CombinedSearchData = {
  hospitals: PaginatedData<Hospital>;
  doctors: PaginatedData<DoctorProfile>;
  services: PaginatedData<MedicalService>;
};

type SearchState =
  | { status: "idle" }
  | { status: "success"; key: string; data: CombinedSearchData }
  | { status: "error"; key: string; message: string };

export function CombinedSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const legacyPage = searchParams.get("page");
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${query}:${attempt}`;
  const [state, setState] = useState<SearchState>({ status: "idle" });

  useEffect(() => {
    if (!legacyPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const nextParams = params.toString();
    router.replace(nextParams ? `/tim-kiem?${nextParams}` : "/tim-kiem", {
      scroll: false,
    });
  }, [legacyPage, router, searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const key = requestKey;
    const pagination = { q: query, page: 1, pageSize: 3 };

    Promise.all([
      hospitalService.getAll(pagination, controller.signal),
      doctorService.getAll(pagination, controller.signal),
      medicalServiceService.getAll(pagination, controller.signal),
    ])
      .then(([hospitals, doctors, services]) => {
        if (!active) return;
        setState({
          status: "success",
          key,
          data: {
            hospitals: hospitals.data,
            doctors: doctors.data,
            services: services.data,
          },
        });
      })
      .catch(() => {
        if (!active) return;
        setState({
          status: "error",
          key,
          message: "Không thể tải kết quả tìm kiếm. Vui lòng thử lại.",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [query, requestKey]);

  const isCurrent = state.status !== "idle" && state.key === requestKey;

  if (!isCurrent) {
    return <CombinedSearchSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div>
        <SearchHero query={query} />
        <div className="container-shell py-10 sm:py-14">
          <ErrorState
            message={state.message}
            onRetry={() => {
              setAttempt((current) => current + 1);
            }}
          />
        </div>
      </div>
    );
  }

  const { hospitals, doctors, services } = state.data;
  const totalItems = hospitals.TotalItems + doctors.TotalItems + services.TotalItems;

  return (
    <div>
      <SearchHero query={query} />

      <section className="bg-muted/35 py-10 sm:py-14" aria-live="polite">
        <div className="container-shell">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Kết quả tổng hợp</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {query ? `Kết quả cho “${query}”` : "Các lựa chọn đang hoạt động"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">{totalItems} kết quả</p>
          </div>

          {totalItems ? (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <ResultShortcut
                  href="#co-so-y-te"
                  icon={Building2}
                  label="Cơ sở y tế"
                  count={hospitals.TotalItems}
                />
                <ResultShortcut
                  href="#bac-si"
                  icon={UserRoundSearch}
                  label="Bác sĩ"
                  count={doctors.TotalItems}
                />
                <ResultShortcut
                  href="#dich-vu-y-te"
                  icon={ClipboardList}
                  label="Dịch vụ y tế"
                  count={services.TotalItems}
                />
              </div>

              <div className="mt-10 space-y-12">
                <SearchGroup
                  id="co-so-y-te"
                  icon={Building2}
                  title="Cơ sở y tế"
                  description="Tìm nơi khám theo tên và địa chỉ."
                  href={buildListHref("/co-so-y-te", query)}
                  total={hospitals.TotalItems}
                >
                  {hospitals.Items.map((hospital) => (
                    <HospitalCard
                      key={hospital.uuid}
                      hospital={hospital}
                      showBookingAction
                    />
                  ))}
                </SearchGroup>

                <SearchGroup
                  id="bac-si"
                  icon={UserRoundSearch}
                  title="Bác sĩ"
                  description="Đối chiếu chuyên môn, nơi làm việc và chi phí khám."
                  href={buildListHref("/bac-si", query)}
                  total={doctors.TotalItems}
                >
                  {doctors.Items.map((doctor) => (
                    <DoctorCard
                      key={doctor.uuid}
                      doctor={doctor}
                      showBookingAction
                    />
                  ))}
                </SearchGroup>

                <SearchGroup
                  id="dich-vu-y-te"
                  icon={ClipboardList}
                  title="Dịch vụ y tế"
                  description="Tra cứu nội dung, khung giờ và chi phí dự kiến."
                  href={buildListHref("/dich-vu", query)}
                  total={services.TotalItems}
                >
                  {services.Items.map((service) => (
                    <MedicalServiceCard
                      key={service.uuid}
                      service={service}
                      showBookingAction
                    />
                  ))}
                </SearchGroup>

              </div>
            </>
          ) : (
            <div className="mt-7 rounded-2xl border bg-card p-4 sm:p-6">
              <EmptyState
                message="Không tìm thấy cơ sở, bác sĩ hoặc dịch vụ phù hợp."
                action={
                  query ? (
                    <Link
                      href="/tim-kiem"
                      className={cn(buttonVariants({ variant: "outline" }), "mt-1")}
                    >
                      Xóa từ khóa
                    </Link>
                  ) : undefined
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SearchHero({ query }: { query: string }) {
  return (
    <section className="border-b bg-secondary/40">
      <div className="container-shell py-10 text-center sm:py-14">
        <p className="text-sm font-semibold text-primary">Tìm kiếm tổng hợp</p>
        <h1 className="mx-auto mt-2 max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Tìm lựa chọn chăm sóc phù hợp
        </h1>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-muted-foreground">
          Tìm đồng thời trong cơ sở y tế, bác sĩ và dịch vụ đang hoạt động.
        </p>

        <form
          key={query}
          action="/tim-kiem"
          method="get"
          role="search"
          className="mx-auto mt-6 flex max-w-3xl flex-col gap-2 rounded-2xl border bg-card p-2 text-left shadow-sm sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              name="q"
              defaultValue={query}
              aria-label="Tìm cơ sở, bác sĩ hoặc dịch vụ"
              placeholder="Nhập tên cơ sở, bác sĩ hoặc dịch vụ..."
              className="h-12 border-0 bg-transparent pl-11 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-7">
            <Search aria-hidden="true" />
            Tìm kiếm
          </Button>
        </form>
      </div>
    </section>
  );
}

function ResultShortcut({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: typeof Building2;
  label: string;
  count: number;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition hover:border-primary/40"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0">
        <strong className="block text-sm">{label}</strong>
        <span className="text-xs text-muted-foreground">{count} kết quả</span>
      </span>
      <ArrowRight aria-hidden="true" className="ml-auto size-4 text-muted-foreground" />
    </a>
  );
}

function SearchGroup({
  id,
  icon: Icon,
  title,
  description,
  href,
  total,
  children,
}: {
  id: string;
  icon: typeof Building2;
  title: string;
  description: string;
  href: string;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b pb-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 id={`${id}-title`} className="text-xl font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {description} · {total} kết quả
            </p>
          </div>
        </div>
        <Link href={href} className={buttonVariants({ variant: "link" })}>
          Xem danh sách và bộ lọc
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      {total ? (
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-4">
          <EmptyState
            message={`Không có kết quả trong nhóm ${title.toLocaleLowerCase("vi-VN")}.`}
          />
        </div>
      )}
    </section>
  );
}

export function CombinedSearchSkeleton() {
  return (
    <div
      role="status"
      className="animate-pulse"
      aria-label="Đang tải kết quả tìm kiếm"
    >
      <div className="h-72 bg-secondary/40" />
      <div className="container-shell py-10">
        <div className="h-8 w-72 rounded bg-muted" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-96 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
      <span className="sr-only">Đang tải kết quả tìm kiếm</span>
    </div>
  );
}

function buildListHref(pathname: string, query: string) {
  if (!query) return pathname;
  const params = new URLSearchParams({ q: query });
  return `${pathname}?${params.toString()}`;
}
