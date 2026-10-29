"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DoctorCard,
  HospitalCard,
  MedicalServiceCard,
} from "@/components/home/featured-cards";
import {
  DiscoveryFilters,
  type DiscoveryFilter,
} from "@/components/discovery/discovery-filters";
import { DiscoveryPagination } from "@/components/discovery/discovery-pagination";
import { DiscoverySearchForm } from "@/components/discovery/discovery-search-form";
import { DiscoveryPageSkeleton } from "@/components/discovery/discovery-skeleton";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { buttonVariants } from "@/components/ui/button";
import type { AsyncState, PaginatedData } from "@/lib/http/response";
import { departmentService } from "@/lib/services/department/DepartmentService";
import { doctorService } from "@/lib/services/doctor/DoctorService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";
import { cn } from "@/lib/utils";
import type {
  Department,
  DoctorProfile,
  Hospital,
  MedicalService,
} from "@/types/models";

export type ResourceKind = "hospital" | "doctor" | "medical-service";
type Resource = Hospital | DoctorProfile | MedicalService;

type ResourceData = {
  result: PaginatedData<Resource>;
  departments: Department[];
  hospitals: Hospital[];
};

const pageConfigs = {
  hospital: {
    pathname: "/co-so-y-te",
    title: "Cơ sở y tế",
    description: "Tìm cơ sở đang hoạt động theo tên, địa chỉ hoặc chuyên khoa.",
    placeholder: "Nhập tên hoặc địa chỉ cơ sở",
  },
  doctor: {
    pathname: "/bac-si",
    title: "Bác sĩ",
    description: "Tìm bác sĩ theo tên, chuyên môn, nơi làm việc và chuyên khoa.",
    placeholder: "Nhập tên, chuyên môn hoặc nơi làm việc",
  },
  "medical-service": {
    pathname: "/dich-vu",
    title: "Dịch vụ y tế",
    description: "Tra cứu dịch vụ đang hoạt động và cơ sở đang cung cấp.",
    placeholder: "Nhập tên hoặc mô tả dịch vụ",
  },
} satisfies Record<
  ResourceKind,
  { pathname: string; title: string; description: string; placeholder: string }
>;

export function ResourceListPage({ kind }: { kind: ResourceKind }) {
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();
  const query = searchParams.get("q")?.trim() || "";
  const department = searchParams.get("department") || "";
  const hospital = searchParams.get("hospital") || "";
  const page = parsePage(searchParams.get("page"));
  const config = pageConfigs[kind];
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AsyncState<ResourceData>>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    loadResourceData(kind, { query, department, hospital, page }, controller.signal)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Không thể tải danh sách. Vui lòng thử lại.",
          });
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [attempt, department, hospital, kind, page, query]);

  if (state.status === "idle" || state.status === "loading") {
    return <DiscoveryPageSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div className="container-shell py-10 sm:py-14">
        <PageHeading config={config} />
        <div className="mt-8">
          <ErrorState
            message={state.message}
            onRetry={() => {
              setState({ status: "loading" });
              setAttempt((current) => current + 1);
            }}
          />
        </div>
      </div>
    );
  }

  const { result, departments, hospitals } = state.data;
  const filters = getFilters(kind, departments, hospitals);
  const hiddenParams = Object.fromEntries(
    filters.map((filter) => [filter.key, searchParams.get(filter.key) || ""]),
  );

  return (
    <div className="container-shell py-10 sm:py-14">
      <PageHeading config={config} />
      <div className="mt-7 rounded-xl border bg-card p-4">
        <DiscoverySearchForm
          action={config.pathname}
          query={query}
          placeholder={config.placeholder}
          hiddenParams={hiddenParams}
        />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <DiscoveryFilters
          key={currentParams}
          pathname={config.pathname}
          currentParams={currentParams}
          filters={filters}
        />
        <section aria-live="polite" aria-busy="false" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Kết quả phù hợp</h2>
            <p className="text-sm text-muted-foreground">
              {result.TotalItems} kết quả
            </p>
          </div>
          {result.Items.length ? (
            <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.Items.map((item) => renderCard(kind, item))}
            </div>
          ) : (
            <EmptyState
              message="Không tìm thấy kết quả phù hợp với từ khóa và bộ lọc hiện tại."
              action={
                <Link
                  href={config.pathname}
                  className={cn(buttonVariants({ variant: "outline" }), "mt-1")}
                >
                  Xóa tìm kiếm và bộ lọc
                </Link>
              }
            />
          )}
          <DiscoveryPagination
            pathname={config.pathname}
            currentParams={currentParams}
            page={result.Page}
            totalPages={result.TotalPages}
          />
        </section>
      </div>
    </div>
  );
}

function PageHeading({
  config,
}: {
  config: (typeof pageConfigs)[ResourceKind];
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-primary">Tra cứu thông tin</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {config.title}
      </h1>
      <p className="mt-3 leading-7 text-muted-foreground">{config.description}</p>
    </div>
  );
}

async function loadResourceData(
  kind: ResourceKind,
  values: { query: string; department: string; hospital: string; page: number },
  signal: AbortSignal,
): Promise<ResourceData> {
  const pagination = { q: values.query, page: values.page, pageSize: 3 };

  if (kind === "hospital") {
    const [result, departments] = await Promise.all([
      hospitalService.getAll(
        { ...pagination, department: values.department || undefined },
        signal,
      ),
      departmentService.getOptions(signal),
    ]);
    return { result: result.data, departments: departments.data, hospitals: [] };
  }

  if (kind === "doctor") {
    const [result, departments, hospitals] = await Promise.all([
      doctorService.getAll(
        {
          ...pagination,
          department: values.department || undefined,
          hospital: values.hospital || undefined,
        },
        signal,
      ),
      departmentService.getOptions(signal),
      hospitalService.getOptions(signal),
    ]);
    return {
      result: result.data,
      departments: departments.data,
      hospitals: hospitals.data,
    };
  }

  const [result, hospitals] = await Promise.all([
    medicalServiceService.getAll(
      { ...pagination, hospital: values.hospital || undefined },
      signal,
    ),
    hospitalService.getOptions(signal),
  ]);
  return { result: result.data, departments: [], hospitals: hospitals.data };
}

function getFilters(
  kind: ResourceKind,
  departments: Department[],
  hospitals: Hospital[],
): DiscoveryFilter[] {
  const departmentFilter: DiscoveryFilter = {
    key: "department",
    label: "Chuyên khoa",
    allLabel: "Tất cả chuyên khoa",
    options: departments.map((item) => ({ value: item.uuid, label: item.name })),
  };
  const hospitalFilter: DiscoveryFilter = {
    key: "hospital",
    label: "Cơ sở y tế",
    allLabel: "Tất cả cơ sở",
    options: hospitals.map((item) => ({ value: item.uuid, label: item.name })),
  };

  if (kind === "hospital") return [departmentFilter];
  if (kind === "doctor") return [hospitalFilter, departmentFilter];
  return [hospitalFilter];
}

function renderCard(kind: ResourceKind, item: Resource) {
  if (kind === "hospital") {
    const hospital = item as Hospital;
    return (
      <HospitalCard
        key={hospital.uuid}
        hospital={hospital}
        showBookingAction
      />
    );
  }
  if (kind === "doctor") {
    const doctor = item as DoctorProfile;
    return <DoctorCard key={doctor.uuid} doctor={doctor} showBookingAction />;
  }
  const service = item as MedicalService;
  return (
    <MedicalServiceCard
      key={service.uuid}
      service={service}
      showBookingAction
    />
  );
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
