"use client";

import {
  ArrowRight,
  Building2,
  CalendarPlus,
  Clock3,
  DoorOpen,
  MapPin,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DiscoveryPagination } from "@/components/discovery/discovery-pagination";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { departmentService } from "@/lib/services/department/DepartmentService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { cn } from "@/lib/utils";
import type { PaginatedData } from "@/lib/http/response";
import type { Department, Hospital } from "@/types/models";

type DirectoryData = {
  result: PaginatedData<Hospital>;
  departments: Department[];
};

type DirectoryState =
  | { status: "idle" }
  | { status: "success"; key: string; data: DirectoryData }
  | { status: "error"; key: string; message: string };

export function HospitalDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();
  const query = searchParams.get("q")?.trim() || "";
  const department = searchParams.get("department") || "";
  const selectedUuid = searchParams.get("hospital") || "";
  const page = parsePage(searchParams.get("page"));
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${query}:${department}:${page}:${attempt}`;
  const [state, setState] = useState<DirectoryState>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const key = requestKey;
    Promise.all([
      hospitalService.getAll(
        {
          name: query || undefined,
          department: department || undefined,
          page,
          pageSize: 8,
        },
        controller.signal,
      ),
      departmentService.getOptions(controller.signal),
    ])
      .then(([hospitalResponse, departmentResponse]) => {
        if (active) {
          setState({
            status: "success",
            key,
            data: {
              result: hospitalResponse.data,
              departments: departmentResponse.data,
            },
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            status: "error",
            key,
            message: "Không thể tải danh sách cơ sở y tế. Vui lòng thử lại.",
          });
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [department, page, query, requestKey]);

  const isCurrent = state.status !== "idle" && state.key === requestKey;
  const data = state.status === "success" && isCurrent ? state.data : null;
  const hospitals = data?.result.Items ?? [];
  const selectedHospital =
    hospitals.find((item) => item.uuid === selectedUuid) ??
    hospitals[0] ??
    null;

  useEffect(() => {
    if (!data || !selectedHospital || selectedUuid === selectedHospital.uuid) {
      return;
    }
    router.replace(
      getCanonicalSelectionHref(
        currentParams,
        selectedHospital.uuid,
        data.result.Page,
      ),
      { scroll: false },
    );
  }, [currentParams, data, router, selectedHospital, selectedUuid]);

  return (
    <main>
      <div className="container-shell pt-7 sm:pt-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Trang chủ</Link>
          <ArrowRight aria-hidden="true" className="size-3.5" />
          <span className="font-medium text-foreground">Cơ sở y tế</span>
        </nav>

        <div className="mx-auto mt-9 max-w-3xl text-center sm:mt-12">
          <p className="text-sm font-semibold text-primary">Tìm nơi khám phù hợp</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Cơ sở y tế
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Tìm theo tên, chọn khoa cần khám và so sánh thông tin trước khi đặt lịch.
          </p>
        </div>

        <form action="/co-so-y-te" method="get" className="mx-auto mt-7 max-w-3xl">
          {department ? <input type="hidden" name="department" value={department} /> : null}
          <div className="flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-sm sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Tìm kiếm cơ sở y tế theo tên..."
                aria-label="Tên cơ sở y tế"
                className="h-11 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              />
            </div>
            <button type="submit" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>Tìm kiếm</button>
          </div>
        </form>

        <section aria-labelledby="department-heading" className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="department-heading" className="text-xl font-bold">Chọn khoa</h2>
              <p className="mt-1 text-sm text-muted-foreground">Lọc cơ sở có khoa phù hợp với nhu cầu khám.</p>
            </div>
            {query || department ? (
              <Link href="/co-so-y-te" className="text-sm font-semibold text-primary hover:underline">Xóa tìm kiếm và bộ lọc</Link>
            ) : null}
          </div>

          {!isCurrent ? <DepartmentSkeleton /> : null}
          {state.status === "error" && isCurrent ? (
            <div className="mt-5"><ErrorState message={state.message} onRetry={() => setAttempt((value) => value + 1)} /></div>
          ) : null}
          {data ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <DepartmentChip
                label="Tất cả khoa"
                href={getDepartmentHref(currentParams, "")}
                active={!department}
              />
              {data.departments.map((item) => (
                <DepartmentChip
                  key={item.uuid}
                  label={item.name}
                  href={getDepartmentHref(currentParams, item.uuid)}
                  active={department === item.uuid}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <section className="mt-9 border-y bg-muted/45 py-9 sm:py-12" aria-labelledby="hospital-results-heading">
        <div className="container-shell">
          {!isCurrent ? <HospitalDirectorySkeleton /> : null}
          {data ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 id="hospital-results-heading" className="text-xl font-bold">Cơ sở phù hợp</h2>
                <p className="text-sm text-muted-foreground">{data.result.TotalItems} kết quả</p>
              </div>
              {hospitals.length && selectedHospital ? (
                <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
                  <div className="space-y-4">
                    {hospitals.map((hospital) => (
                      <HospitalSelectionCard
                        key={hospital.uuid}
                        hospital={hospital}
                        href={getHospitalHref(currentParams, hospital.uuid)}
                        selected={hospital.uuid === selectedHospital.uuid}
                      />
                    ))}
                  </div>
                  <HospitalPreview hospital={selectedHospital} />
                </div>
              ) : (
                <EmptyState
                  message="Không tìm thấy cơ sở có tên và khoa phù hợp."
                  action={<Link href="/co-so-y-te" className={buttonVariants({ variant: "outline" })}>Xóa tìm kiếm và bộ lọc</Link>}
                />
              )}
              <DiscoveryPagination
                pathname="/co-so-y-te"
                currentParams={currentParams}
                page={data.result.Page}
                totalPages={data.result.TotalPages}
              />
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function DepartmentChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function HospitalSelectionCard({ hospital, href, selected }: { hospital: Hospital; href: string; selected: boolean }) {
  return (
    <article className={cn("overflow-hidden rounded-2xl border bg-card transition-colors", selected ? "border-primary ring-2 ring-primary/15" : "hover:border-primary/35")}>
      <Link href={href} scroll className="grid min-w-0 gap-4 p-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:p-5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:aspect-square">
          <Image src={hospital.image} alt={`Hình minh họa ${hospital.name}`} fill sizes="120px" className="object-cover" />
        </div>
        <div className="min-w-0 self-center">
          <div className="flex items-start justify-between gap-3">
            <h3 className="break-words text-lg font-bold leading-7">{hospital.name}</h3>
            {selected ? <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">Đang chọn</span> : null}
          </div>
          <HospitalFact icon={MapPin} value={hospital.address} />
          <HospitalFact icon={Clock3} value={hospital.workingHour} />
        </div>
      </Link>
      <div className="grid gap-2 border-t px-4 py-3 sm:grid-cols-2 sm:px-5">
        <Link href={`/co-so-y-te/${hospital.slug}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>Xem chi tiết</Link>
        <Link href={`/dat-lich/co-so-y-te?hospital=${hospital.uuid}`} className={cn(buttonVariants(), "w-full")}><CalendarPlus aria-hidden="true" />Đặt lịch khám</Link>
      </div>
    </article>
  );
}

function HospitalPreview({ hospital }: { hospital: Hospital }) {
  return (
    <aside id="hospital-detail" className="scroll-mt-24 self-start overflow-hidden rounded-2xl border bg-card lg:sticky lg:top-24">
      <div className="relative aspect-[16/9] bg-muted">
        <Image src={hospital.image} alt={`Không gian ${hospital.name}`} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Cơ sở đang chọn</p>
        <h2 className="mt-2 text-2xl font-bold leading-8">{hospital.name}</h2>
        <HospitalFact icon={MapPin} value={hospital.address} />
        <HospitalFact icon={Clock3} value={hospital.workingHour} />
        <HospitalFact icon={DoorOpen} value={`${hospital.numberOfRoom} phòng theo thông tin cơ sở`} />
        <div className="mt-5 border-t pt-5 text-sm">
          <SafeMarkdown content={hospital.description} showImages={false} />
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Link href={`/co-so-y-te/${hospital.slug}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>Xem chi tiết</Link>
          <Link href={`/dat-lich/co-so-y-te?hospital=${hospital.uuid}`} className={cn(buttonVariants({ size: "lg" }), "w-full")}><CalendarPlus aria-hidden="true" />Đặt lịch khám</Link>
        </div>
      </div>
    </aside>
  );
}

function HospitalFact({ icon: Icon, value }: { icon: typeof Building2; value: string }) {
  return (
    <p className="mt-2 flex min-w-0 items-start gap-2 text-sm leading-6 text-muted-foreground">
      <Icon aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
      <span className="break-words">{value}</span>
    </p>
  );
}

function DepartmentSkeleton() {
  return <div className="mt-5 flex gap-2 overflow-hidden" aria-label="Đang tải danh sách khoa">{Array.from({ length: 5 }).map((_, index) => <span key={index} className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-muted" />)}</div>;
}

export function HospitalDirectorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 rounded bg-muted" />
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)]">
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-52 rounded-2xl bg-muted" />)}</div>
        <div className="h-[34rem] rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function getDepartmentHref(currentParams: string, department: string) {
  const params = new URLSearchParams(currentParams);
  if (department) params.set("department", department);
  else params.delete("department");
  params.delete("hospital");
  params.delete("page");
  const query = params.toString();
  return query ? `/co-so-y-te?${query}` : "/co-so-y-te";
}

function getHospitalHref(currentParams: string, hospitalUuid: string) {
  const params = new URLSearchParams(currentParams);
  params.set("hospital", hospitalUuid);
  params.delete("page");
  return `/co-so-y-te?${params.toString()}#hospital-detail`;
}

function getCanonicalSelectionHref(
  currentParams: string,
  hospitalUuid: string,
  page: number,
) {
  const params = new URLSearchParams(currentParams);
  params.set("hospital", hospitalUuid);
  if (page === 1) params.delete("page");
  else params.set("page", String(page));
  return `/co-so-y-te?${params.toString()}`;
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
