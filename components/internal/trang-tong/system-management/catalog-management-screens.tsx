"use client";

import {
  Activity,
  Eye,
  Hospital as HospitalIcon,
  PackageSearch,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import {
  DetailGrid,
  DetailItem,
  MetricCard,
  MetricGrid,
  PortalPageHeader,
  PortalSection,
  PortalTable,
  StatusPill,
} from "@/components/internal/portal-ui";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockMedicalServices } from "@/data/mocks/medical-services";
import {
  BaseStatus,
  type Department,
  Hospital,
  type Medicine,
  MedicineUnit,
} from "@/types/models";
import {
  adminDepartmentService,
  type AdminDepartmentItem,
  type DepartmentRequest,
} from "@/lib/services/department/AdminDepartmentService";
import {
  adminHospitalService,
  type AdminHospitalItem,
} from "@/lib/services/hospital/AdminHospitalService";
import {
  adminMedicineService,
  type AdminMedicineItem,
  type MedicineRequest,
} from "@/lib/services/medicine/AdminMedicineService";

type ManagedRecord = {
  uuid: string;
  name: string;
  status: BaseStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type CatalogConfig<T extends ManagedRecord> = {
  eyebrow: string;
  title: string;
  description: string;
  singular: string;
  icon: ReactNode;
  initialItems: T[];
  columns: string[];
  searchText: (item: T) => string;
  renderCells: (item: T) => ReactNode[];
  renderDetail: (item: T) => ReactNode;
  renderForm: (item: T, update: <K extends keyof T>(key: K, value: T[K]) => void) => ReactNode;
  createDraft?: () => T;
  createHref?: string;
  detailHref?: (item: T) => string;
  editHref?: (item: T) => string;
  onCreate?: (item: T) => Promise<T>;
  onSave?: (item: T) => Promise<T>;
  onDelete?: (item:T) => Promise<void>;
  onRestore?: (item:T) => Promise<void>;
  onFormClose?: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN");
const moneyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

function isDeleted(item: ManagedRecord) {
  return item.deletedAt.getTime() > 0;
}

function statusLabel(status: BaseStatus) {
  return status === BaseStatus.Active ? "Hoạt động" : "Tạm ngưng";
}

function RecordStatus({ item }: { item: ManagedRecord }) {
  if (isDeleted(item)) return <StatusPill tone="red">Đã xóa</StatusPill>;
  return <StatusPill tone={item.status === BaseStatus.Active ? "green" : "amber"}>{statusLabel(item.status)}</StatusPill>;
}

function CatalogManagementScreen<T extends ManagedRecord>({ config }: { config: CatalogConfig<T> }) {
  const [items, setItems] = useState<T[]>(() => config.initialItems.map((item) => ({ ...item })));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [visibility, setVisibility] = useState("current");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [draftMode, setDraftMode] = useState<"create" | "edit" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const filteredItems = items.filter((item) => {
    const matchesQuery = !normalizedQuery || config.searchText(item).toLocaleLowerCase("vi").includes(normalizedQuery);
    const matchesStatus = status === "all" || item.status === status;
    const matchesVisibility = visibility === "all" || (visibility === "deleted" ? isDeleted(item) : !isDeleted(item));
    return matchesQuery && matchesStatus && matchesVisibility;
  });
  const detailItem = items.find((item) => item.uuid === detailId) ?? null;
  const activeCount = items.filter((item) => !isDeleted(item) && item.status === BaseStatus.Active).length;
  const deletedCount = items.filter(isDeleted).length;
  const insuredCount = items.filter((item) => "isInsured" in item && item.isInsured).length;

  function updateDraft<K extends keyof T>(key: K, value: T[K]) {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  }

  async function saveDraft() {
    if (!draft || isSubmitting) return;

    setIsSubmitting(true);
    setMutationError(null);

    try {
      const isCreating = draftMode === "create";
      const savedItem = isCreating
        ? config.onCreate
          ? await config.onCreate(draft)
          : { ...draft, createdAt: new Date(), updatedAt: new Date() }
        : config.onSave
          ? await config.onSave(draft)
          : { ...draft, updatedAt: new Date() };

      setItems((current) =>
        isCreating
          ? [savedItem, ...current]
          : current.map((item) =>
              item.uuid === savedItem.uuid ? savedItem : item,
            ),
      );

      setDraft(null);
      setDraftMode(null);
      config.onFormClose?.();
    } catch (error) {
      console.error("Không thể lưu bản ghi:", error);
      setMutationError(
        draftMode === "create"
          ? `Không thể thêm ${config.singular}. Vui lòng thử lại.`
          : "Không thể lưu thay đổi. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteItem(item: T) {
    if (!config.onDelete || isSubmitting) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${item.name}" không?`,
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      // Gọi handleDeleteHospital được truyền từ bên ngoài
      await config.onDelete(item);

      // Cập nhật giao diện sau khi API thành công
      setItems((current) =>
        current.map((candidate) =>
          candidate.uuid === item.uuid
            ? {
                ...candidate,
                deletedAt: new Date(),
                updatedAt: new Date(),
              }
            : candidate,
        ),
      );
    } catch (error) {
      console.error("Xóa thất bại:", error);
      setMutationError(`Không thể xóa ${config.singular}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function restoreItem(item: T) {
    if (!config.onRestore || isSubmitting) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn khôi phục "${item.name}" không?`,
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      await config.onRestore(item);

      setItems((current) => current.map((candidate) =>
        candidate.uuid === item.uuid
          ? { ...candidate, deletedAt: new Date(0), updatedAt: new Date() }
          : candidate,
      ));

    } catch (error) {
      console.error("Khôi phục thất bại:", error);
      setMutationError(`Không thể khôi phục ${config.singular}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const rows = filteredItems.map((item) => [
    ...config.renderCells(item),
    <RecordStatus key={`${item.uuid}-status`} item={item} />,
    <div key={`${item.uuid}-actions`} className="flex items-center justify-end gap-1">
      {config.detailHref ? (
        <Link href={config.detailHref(item)} className={buttonVariants({ variant: "ghost", size: "icon-sm" })} title="Xem chi tiết" aria-label={`Xem chi tiết ${item.name}`}>
          <Eye />
        </Link>
      ) : (
        <Button type="button" variant="ghost" size="icon-sm" title="Xem chi tiết" aria-label={`Xem chi tiết ${item.name}`} onClick={() => setDetailId(item.uuid)}>
          <Eye />
        </Button>
      )}
      {config.editHref ? (
        <Link href={config.editHref(item)} className={buttonVariants({ variant: "ghost", size: "icon-sm" })} title="Chỉnh sửa" aria-label={`Chỉnh sửa ${item.name}`}>
          <Pencil />
        </Link>
      ) : (
        <Button type="button" variant="ghost" size="icon-sm" title="Chỉnh sửa" aria-label={`Chỉnh sửa ${item.name}`} onClick={() => { setMutationError(null); setDraftMode("edit"); setDraft({ ...item }); }}>
          <Pencil />
        </Button>
      )}
      <Button type="button" variant={isDeleted(item) ? "outline" : "destructive"} size="icon-sm" title={isDeleted(item) ? "Khôi phục" : "Xóa"} aria-label={`${isDeleted(item) ? "Khôi phục" : "Xóa"} ${item.name}`} onClick={isDeleted(item) ? () => restoreItem(item) : () => deleteItem(item)}>
        {isDeleted(item) ? <RotateCcw /> : <Trash2 />}
      </Button>
    </div>,
  ]);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        actions={config.createHref ? (
          <Link href={config.createHref} className={buttonVariants()}>
            <Plus />
            Thêm {config.singular}
          </Link>
        ) : config.createDraft ? (
          <Button
            type="button"
            onClick={() => {
              setMutationError(null);
              setDraftMode("create");
              setDraft(config.createDraft?.() ?? null);
            }}
          >
            <Plus />
            Thêm {config.singular}
          </Button>
        ) : undefined}
      />
      <MetricGrid>
        <MetricCard label="Tổng bản ghi" value={String(items.length)} detail={`${items.length - deletedCount} bản ghi hiện hành`} icon={config.icon} />
        <MetricCard label="Đang hoạt động" value={String(activeCount)} detail="Không bao gồm bản ghi đã xóa" icon={<Activity className="size-5" />} tone="green" />
        <MetricCard label="Đã xóa" value={String(deletedCount)} detail="Có thể khôi phục bất kỳ lúc nào" icon={<Trash2 className="size-5" />} tone="red" />
        <MetricCard label={"isInsured" in (items[0] ?? {}) ? "Có bảo hiểm" : "Cập nhật gần đây"} value={"isInsured" in (items[0] ?? {}) ? String(insuredCount) : String(items.filter((item) => item.updatedAt >= new Date("2026-08-14")).length)} detail={"isInsured" in (items[0] ?? {}) ? "Theo cấu hình danh mục" : "Từ 14/08/2026"} icon={<ShieldCheck className="size-5" />} tone="cyan" />
      </MetricGrid>

      <PortalSection title={`Danh sách ${config.title.toLocaleLowerCase("vi")}`} description={`${filteredItems.length} kết quả theo bộ lọc hiện tại`}>
        <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 lg:grid-cols-[minmax(16rem,1fr)_12rem_12rem]">
          <label className="relative">
            <span className="sr-only">Tìm kiếm</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Tìm ${config.title.toLocaleLowerCase("vi")}...`} className="pl-9" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" aria-label="Lọc trạng thái">
            <option value="all">Tất cả trạng thái</option>
            <option value={BaseStatus.Active}>Hoạt động</option>
            <option value={BaseStatus.InActive}>Tạm ngưng</option>
          </select>
          <select value={visibility} onChange={(event) => setVisibility(event.target.value)} className="h-10 rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" aria-label="Lọc trạng thái xóa">
            <option value="current">Bản ghi hiện hành</option>
            <option value="deleted">Đã xóa</option>
            <option value="all">Tất cả bản ghi</option>
          </select>
        </div>
        {rows.length ? (
          <PortalTable caption={`Danh sách ${config.title.toLocaleLowerCase("vi")}`} columns={[...config.columns, "Trạng thái", "Thao tác"]} rows={rows} />
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground">Không có bản ghi phù hợp với bộ lọc.</div>
        )}
      </PortalSection>

      <Dialog open={Boolean(detailItem)} onOpenChange={(open) => { if (!open) setDetailId(null); }}>
        <DialogContent className="max-w-3xl">
          {detailItem ? (
            <>
              <DialogHeader>
                <DialogTitle>{detailItem.name}</DialogTitle>
                <DialogDescription>Chi tiết {config.singular} và trạng thái dữ liệu hiện tại.</DialogDescription>
              </DialogHeader>
              <div className="mt-5 space-y-5">{config.renderDetail(detailItem)}</div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDetailId(null)}>Đóng</Button>
                <Button type="button" onClick={() => { setMutationError(null); setDraftMode("edit"); setDraft({ ...detailItem }); setDetailId(null); }}><Pencil />Chỉnh sửa</Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => { if (!open) { setDraft(null); setDraftMode(null); setMutationError(null); config.onFormClose?.(); } }}>
        <DialogContent className="max-w-4xl">
          {draft ? (
            <form onSubmit={(event) => { event.preventDefault(); void saveDraft(); }}>
              <DialogHeader>
                <DialogTitle>{draftMode === "create" ? "Thêm" : "Chỉnh sửa"} {config.singular}</DialogTitle>
                <DialogDescription>
                  {draftMode === "create"
                    ? `Nhập thông tin để tạo ${config.singular} mới.`
                    : `Cập nhật thông tin ${config.singular}.`}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">{config.renderForm(draft, updateDraft)}</div>
              {mutationError ? <p className="mt-4 text-sm text-destructive">{mutationError}</p> : null}
              <DialogFooter>
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => { setDraft(null); setDraftMode(null); setMutationError(null); config.onFormClose?.(); }}>Hủy</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : draftMode === "create" ? `Thêm ${config.singular}` : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <div className={wide ? "space-y-2 sm:col-span-2" : "space-y-2"}><Label>{label}</Label>{children}</div>;
}

function StatusField({ value, onChange }: { value: BaseStatus; onChange: (value: BaseStatus) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as BaseStatus)} className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
      <option value={BaseStatus.Active}>Hoạt động</option>
      <option value={BaseStatus.InActive}>Tạm ngưng</option>
    </select>
  );
}

function MarkdownField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [preview, setPreview] = useState(false);
  return (
    <Field label={label} wide>
      <div className="flex gap-1 border-b pb-2">
        <Button type="button" size="sm" variant={preview ? "ghost" : "secondary"} onClick={() => setPreview(false)}>Soạn thảo</Button>
        <Button type="button" size="sm" variant={preview ? "secondary" : "ghost"} onClick={() => setPreview(true)}>Xem trước</Button>
      </div>
      {preview ? <div className="min-h-36 rounded-md border bg-slate-50 p-4 text-sm"><SafeMarkdown content={value} /></div> : <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-36 font-mono text-sm" placeholder="Hỗ trợ **in đậm**, danh sách và đoạn văn Markdown" />}
    </Field>
  );
}

function CommonDetail({ item, children }: { item: ManagedRecord; children: ReactNode }) {
  return (
    <>
      <DetailGrid>
        {children}
        <DetailItem label="Trạng thái" value={<RecordStatus item={item} />} />
        <DetailItem label="Ngày tạo" value={dateFormatter.format(item.createdAt)} />
        <DetailItem label="Cập nhật" value={dateFormatter.format(item.updatedAt)} />
        <DetailItem label="deletedAt" value={isDeleted(item) ? dateFormatter.format(item.deletedAt) : "Chưa xóa"} />
      </DetailGrid>
    </>
  );
}

function MarkdownDetail({ title, content }: { title: string; content: string }) {
  return <section className="rounded-lg border p-5"><h3 className="mb-3 font-semibold text-[#173b57]">{title}</h3><SafeMarkdown content={content} /></section>;
}

function mapToHospital(item: AdminHospitalItem): Hospital {
  const status =
    (item.status as unknown) === 0 || item.status === BaseStatus.Active || (item.status as unknown) === "Active"
      ? BaseStatus.Active
      : BaseStatus.InActive;

  return {
    uuid: item.uuid,
    name: item.name ?? "",
    address: item.address ?? "",
    slug: item.slug ?? "",
    image: item.image ?? "",
    lImage: item.image ?? "",
    mapUrl: item.mapUrl ?? "",
    numberOfRoom: item.numberOfRoom ?? 0,
    description: item.description ?? "",
    detailService: item.detailService ?? "",
    workingHour: item.workingHour ?? "",
    status: status,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    deletedAt: item.deletedAt ? new Date(item.deletedAt) : new Date(0),
  };
}

export function HospitalsManagementScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    adminHospitalService
      .getAll(controller.signal)
      .then((res) => {
        if (!active) return;

        const rawList = res.data ?? res.data ?? [];
        setHospitals(rawList.map(mapToHospital));
      })
      .catch((err) => {
        if (!active) return;

        console.error("Lỗi khi tải danh sách cơ sở y tế:", err);
        setError("Không tải được danh sách cơ sở y tế");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function handleDeleteHospital(hospital: Hospital): Promise<void> {
    await adminHospitalService.delete(hospital.uuid);
  }

  async function handleRestoreHospital(hospital: Hospital): Promise<void> {
    await adminHospitalService.restore(hospital.uuid);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
  if (error) return <div className="p-8 text-center text-destructive">{error}</div>;

  return <CatalogManagementScreen config={{
    eyebrow: "Danh mục toàn hệ thống",
    title: "Cơ sở y tế",
    singular: "cơ sở y tế",
    description: "Quản lý đầy đủ thông tin vận hành, nội dung giới thiệu và vòng đời dữ liệu của các cơ sở.",
    icon: <HospitalIcon className="size-5" />,
    initialItems: hospitals,
    columns: ["Cơ sở", "Địa chỉ", "Số phòng", "Giờ làm việc", "Cập nhật"],
    searchText: (item) => `${item.name} ${item.slug} ${item.address}`,
    renderCells: (item) => [
      <div key="name"><div className="font-semibold">{item.name}</div><div className="mt-1 text-xs text-muted-foreground">/{item.slug}</div></div>,
      <span key="address" className="block max-w-72 whitespace-normal">{item.address}</span>,
      item.numberOfRoom,
      item.workingHour,
      dateFormatter.format(item.updatedAt),
    ],
    renderDetail: (item) => <><CommonDetail item={item}><DetailItem label="slug" value={item.slug} /><DetailItem label="Địa chỉ" value={item.address} /><DetailItem label="Số phòng" value={item.numberOfRoom} /><DetailItem label="Giờ làm việc" value={item.workingHour} /><DetailItem label="Ảnh đại diện" value={item.image} /><DetailItem label="Bản đồ" value={<a className="text-primary underline" href={item.mapUrl} target="_blank" rel="noreferrer">Mở Google Maps</a>} /></CommonDetail><MarkdownDetail title="Mô tả" content={item.description} /><MarkdownDetail title="Chi tiết dịch vụ" content={item.detailService} /></>,
    renderForm: () => null,
    createHref: "/noi-bo/trang-tong/co-so-y-te/tao-moi",
    detailHref: (item) => `/noi-bo/trang-tong/co-so-y-te/${item.uuid}`,
    editHref: (item) => `/noi-bo/trang-tong/co-so-y-te/${item.uuid}/chinh-sua`,
    onDelete: handleDeleteHospital,
    onRestore: handleRestoreHospital,
  }} />;
}

function mapToDepartment(item: AdminDepartmentItem): Department {
  return {
    uuid: item.uuid,
    icon: item.icon ?? "",
    slug: item.slug ?? "",
    name: item.name ?? "",
    description: item.description ?? "",
    status: item.status,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    deletedAt: item.deletedAt ? new Date(item.deletedAt) : new Date(0),
  };
}

function mapToDepartmentRequest(item: Department): DepartmentRequest {
  return {
    icon: item.icon,
    slug: item.slug.trim(),
    name: item.name.trim(),
    description: item.description,
    status: item.status,
  };
}

function createEmptyDepartment(): Department {
  const now = new Date();
  return {
    uuid: "",
    icon: "",
    slug: "",
    name: "",
    description: "",
    status: BaseStatus.Active,
    createdAt: now,
    updatedAt: now,
    deletedAt: new Date(0),
  };
}

function IconTemplatePicker({
  templates,
  value,
  onChange,
}: {
  templates: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label="Biểu tượng chuyên khoa" wide>
      <div
        className="grid max-h-72 grid-cols-4 gap-3 overflow-y-auto rounded-md border bg-slate-50 p-3 sm:grid-cols-5 md:grid-cols-8"
        role="radiogroup"
        aria-label="Chọn biểu tượng chuyên khoa"
      >
        {templates.map((template, index) => {
          const selected = template === value;

          return (
            <button
              key={template}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Mẫu biểu tượng ${index + 1}`}
              onClick={() => onChange(template)}
              className={`aspect-square rounded-lg border-2 bg-white p-2 transition hover:border-primary/60 hover:shadow-sm ${
                selected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent"
              }`}
            >
              <img
                src={template}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          );
        })}
      </div>
      {value ? (
        <p className="truncate text-xs text-muted-foreground" title={value}>
          Đã chọn: {value}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Chọn một mẫu biểu tượng để tiếp tục.
        </p>
      )}
    </Field>
  );
}

export function DepartmentsManagementScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [iconTemplates, setIconTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    Promise.all([
      adminDepartmentService.getAll(controller.signal),
      adminDepartmentService.getIconTemplates(controller.signal),
    ])
      .then(([departmentResponse, iconTemplateResponse]) => {
        if (!active) return;
        setDepartments((departmentResponse.data ?? departmentResponse.data ?? []).map(mapToDepartment));
        setIconTemplates(iconTemplateResponse.data ?? iconTemplateResponse.data ?? []);
      })
      .catch((requestError) => {
        if (!active) return;
        console.error("Lỗi khi tải danh sách chuyên khoa:", requestError);
        setError("Không tải được danh sách chuyên khoa");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function saveDepartment(item: Department) {
    const response = await adminDepartmentService.update(item.uuid, mapToDepartmentRequest(item));
    const saved = response.data ?? response.data;
    if (!saved) throw new Error("API không trả về chuyên khoa đã cập nhật");
    return mapToDepartment(saved);
  }

  async function createDepartment(item: Department) {
    const response = await adminDepartmentService.create(mapToDepartmentRequest(item));
    const saved = response.data ?? response.data;
    if (!saved) throw new Error("API không trả về chuyên khoa đã tạo");
    return mapToDepartment(saved);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
  if (error) return <div className="p-8 text-center text-destructive">{error}</div>;

  return <CatalogManagementScreen config={{
    eyebrow: "Danh mục chuyên môn",
    title: "Chuyên khoa",
    singular: "chuyên khoa",
    description: "Quản lý định danh, nội dung mô tả và trạng thái sử dụng của danh mục chuyên khoa gốc.",
    icon: <Stethoscope className="size-5" />,
    initialItems: departments,
    columns: ["Chuyên khoa", "slug", "Mô tả", "Ngày tạo", "Cập nhật"],
    searchText: (item) => `${item.name} ${item.slug} ${item.description}`,
    renderCells: (item) => [item.name, item.slug, <span key="description" className="block max-w-80 truncate">{item.description}</span>, dateFormatter.format(item.createdAt), dateFormatter.format(item.updatedAt)],
    renderDetail: (item) => <><CommonDetail item={item}><DetailItem label="slug" value={item.slug} /><DetailItem label="Biểu tượng" value={item.icon} /></CommonDetail><MarkdownDetail title="Mô tả chuyên khoa" content={item.description} /></>,
    renderForm: (item, update) => <><Field label="Tên chuyên khoa"><Input required value={item.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label="slug"><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={item.slug} onChange={(event) => update("slug", event.target.value)} /></Field><Field label="Trạng thái"><StatusField value={item.status} onChange={(value) => update("status", value)} /></Field><IconTemplatePicker templates={iconTemplates} value={item.icon} onChange={(value) => update("icon", value)} /><MarkdownField label="Mô tả (Markdown)" value={item.description} onChange={(value) => update("description", value)} /></>,
    createDraft: () => ({
      ...createEmptyDepartment(),
      icon: iconTemplates[0] ?? "",
    }),
    onCreate: createDepartment,
    onSave: saveDepartment,
    onDelete: (item) => adminDepartmentService.delete(item.uuid),
    onRestore: (item) => adminDepartmentService.restore(item.uuid),
  }} />;
}

export function MedicalServicesManagementScreen() {
  return <CatalogManagementScreen config={{
    eyebrow: "Danh mục chuyên môn",
    title: "Dịch vụ y tế",
    singular: "dịch vụ y tế",
    description: "Quản lý giá, quyền lợi bảo hiểm, lịch thực hiện và nội dung dịch vụ dùng chung.",
    icon: <Activity className="size-5" />,
    initialItems: mockMedicalServices,
    columns: ["Dịch vụ", "Giá", "Giờ thực hiện", "Bảo hiểm", "Nổi bật", "Cập nhật"],
    searchText: (item) => `${item.name} ${item.slug} ${item.description} ${item.workingHour}`,
    renderCells: (item) => [<div key="name"><div className="font-semibold">{item.name}</div><div className="mt-1 text-xs text-muted-foreground">/{item.slug}</div></div>, moneyFormatter.format(item.price), item.workingHour, item.isInsured ? `${Math.round(item.insuranceCap * 100)}%` : "Không", item.isFeatured ? "Có" : "Không", dateFormatter.format(item.updatedAt)],
    renderDetail: (item) => <><CommonDetail item={item}><DetailItem label="slug" value={item.slug} /><DetailItem label="Giá tham chiếu" value={moneyFormatter.format(item.price)} /><DetailItem label="Giờ thực hiện" value={item.workingHour} /><DetailItem label="Bảo hiểm" value={item.isInsured ? `Có, tối đa ${Math.round(item.insuranceCap * 100)}%` : "Không"} /><DetailItem label="Dịch vụ nổi bật" value={item.isFeatured ? "Có" : "Không"} /><DetailItem label="Hình ảnh" value={item.image} /></CommonDetail><MarkdownDetail title="Mô tả" content={item.description} /><MarkdownDetail title="Chi tiết dịch vụ" content={item.detailService} /></>,
    renderForm: (item, update) => <><Field label="Tên dịch vụ"><Input required value={item.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label="slug"><Input required value={item.slug} onChange={(event) => update("slug", event.target.value)} /></Field><Field label="Giá tham chiếu"><Input required min={0} type="number" value={item.price} onChange={(event) => update("price", Number(event.target.value))} /></Field><Field label="Giờ thực hiện"><Input value={item.workingHour} onChange={(event) => update("workingHour", event.target.value)} /></Field><Field label="Trạng thái"><StatusField value={item.status} onChange={(value) => update("status", value)} /></Field><Field label="Mức chi trả bảo hiểm (0-1)"><Input min={0} max={1} step={0.1} type="number" disabled={!item.isInsured} value={item.insuranceCap} onChange={(event) => update("insuranceCap", Number(event.target.value))} /></Field><Field label="Tùy chọn" wide><div className="flex flex-wrap gap-6 rounded-md border p-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={item.isInsured} onChange={(event) => update("isInsured", event.target.checked)} />Áp dụng bảo hiểm</label><label className="flex items-center gap-2"><input type="checkbox" checked={item.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} />Dịch vụ nổi bật</label></div></Field><MarkdownField label="Mô tả (Markdown)" value={item.description} onChange={(value) => update("description", value)} /><MarkdownField label="Chi tiết dịch vụ (Markdown)" value={item.detailService} onChange={(value) => update("detailService", value)} /></>,
  }} />;
}

const medicineUnitLabels: Record<MedicineUnit, string> = {
  [MedicineUnit.Other]: "Khác",
  [MedicineUnit.Tablet]: "Viên",
  [MedicineUnit.Bottle]: "Chai",
  [MedicineUnit.Box]: "Hộp",
  [MedicineUnit.Tube]: "Tuýp",
  [MedicineUnit.Sachet]: "Gói",
};

function mapToMedicine(item: AdminMedicineItem): Medicine {
  return {
    uuid: item.uuid,
    image: item.image ?? "",
    name: item.name ?? "",
    description: item.description ?? "",
    price: item.price ?? 0,
    unit: item.unit,
    status: item.status,
    isInsured: item.isInsured,
    insuranceCap: item.insuranceCap ?? 0,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    deletedAt: item.deletedAt ? new Date(item.deletedAt) : new Date(0),
  };
}

function mapToMedicineRequest(item: Medicine): MedicineRequest {
  return {
    image: item.image,
    name: item.name.trim(),
    description: item.description,
    price: item.price,
    unit: item.unit,
    status: item.status,
    isInsured: item.isInsured,
    insuranceCap: item.isInsured ? item.insuranceCap : 0,
  };
}

function createEmptyMedicine(): Medicine {
  const now = new Date();
  return {
    uuid: "",
    image: "",
    name: "",
    description: "",
    price: 0,
    unit: MedicineUnit.Other,
    status: BaseStatus.Active,
    isInsured: false,
    insuranceCap: 0,
    createdAt: now,
    updatedAt: now,
    deletedAt: new Date(0),
  };
}

export function MedicinesManagementScreen() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    adminMedicineService.getAll(controller.signal)
      .then((response) => {
        if (!active) return;
        setMedicines((response.data ?? response.data ?? []).map(mapToMedicine));
      })
      .catch((requestError) => {
        if (!active) return;
        console.error("Lỗi khi tải danh mục thuốc:", requestError);
        setError("Không tải được danh mục thuốc");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function saveMedicine(item: Medicine) {
    const response = await adminMedicineService.update(item.uuid, mapToMedicineRequest(item));
    const saved = response.data ?? response.data;
    if (!saved) throw new Error("API không trả về thuốc đã cập nhật");
    return mapToMedicine(saved);
  }

  async function createMedicine(item: Medicine) {
    const response = await adminMedicineService.create(mapToMedicineRequest(item));
    const saved = response.data ?? response.data;
    if (!saved) throw new Error("API không trả về thuốc đã tạo");
    return mapToMedicine(saved);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;
  if (error) return <div className="p-8 text-center text-destructive">{error}</div>;

  return <CatalogManagementScreen config={{
    eyebrow: "Danh mục dược",
    title: "Danh mục thuốc",
    singular: "thuốc",
    description: "Quản lý thuốc gốc từ Medicine model; tồn kho vẫn được theo dõi riêng tại từng chi nhánh.",
    icon: <PackageSearch className="size-5" />,
    initialItems: medicines,
    columns: ["Thuốc", "Mô tả", "Đơn vị", "Đơn giá", "Bảo hiểm", "Cập nhật"],
    searchText: (item) => `${item.name} ${item.description} ${medicineUnitLabels[item.unit]}`,
    renderCells: (item) => [item.name, <span key="description" className="block max-w-72 whitespace-normal">{item.description}</span>, medicineUnitLabels[item.unit], moneyFormatter.format(item.price), item.isInsured ? `${Math.round(item.insuranceCap * 100)}%` : "Không", dateFormatter.format(item.updatedAt)],
    renderDetail: (item) => <><CommonDetail item={item}><DetailItem label="Đơn vị" value={medicineUnitLabels[item.unit]} /><DetailItem label="Đơn giá" value={moneyFormatter.format(item.price)} /><DetailItem label="Bảo hiểm" value={item.isInsured ? `Có, tối đa ${Math.round(item.insuranceCap * 100)}%` : "Không"} /><DetailItem label="Hình ảnh" value={item.image || "Chưa cập nhật"} /></CommonDetail><section className="rounded-lg border p-5"><h3 className="mb-2 font-semibold text-[#173b57]">Mô tả thuốc</h3><p className="text-sm leading-6 text-muted-foreground">{item.description || "Đang cập nhật"}</p></section></>,
    renderForm: (item, update) => <><Field label="Tên thuốc"><Input required value={item.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label="Đơn vị"><select value={item.unit} onChange={(event) => update("unit", event.target.value as MedicineUnit)} className="h-10 w-full rounded-md border bg-white px-3 text-sm">{Object.values(MedicineUnit).map((unit) => <option key={unit} value={unit}>{medicineUnitLabels[unit]}</option>)}</select></Field><Field label="Đơn giá"><Input required min={0} type="number" value={item.price} onChange={(event) => update("price", Number(event.target.value))} /></Field><Field label="Trạng thái"><StatusField value={item.status} onChange={(value) => update("status", value)} /></Field><Field label="Mức chi trả bảo hiểm (0-1)"><Input min={0} max={1} step={0.1} type="number" disabled={!item.isInsured} value={item.insuranceCap} onChange={(event) => update("insuranceCap", Number(event.target.value))} /></Field><Field label="Bảo hiểm"><label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm"><input type="checkbox" checked={item.isInsured} onChange={(event) => update("isInsured", event.target.checked)} />Áp dụng bảo hiểm</label></Field><Field label="URL hình ảnh" wide><Input value={item.image} onChange={(event) => update("image", event.target.value)} /></Field><Field label="Mô tả" wide><Textarea value={item.description} onChange={(event) => update("description", event.target.value)} /></Field></>,
    createDraft: createEmptyMedicine,
    onCreate: createMedicine,
    onSave: saveMedicine,
    onDelete: (item) => adminMedicineService.delete(item.uuid),
    onRestore: (item) => adminMedicineService.restore(item.uuid),
  }} />;
}
