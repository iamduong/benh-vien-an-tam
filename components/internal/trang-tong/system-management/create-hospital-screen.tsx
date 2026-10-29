"use client";

import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { PortalPageHeader, PortalSection } from "@/components/internal/portal-ui";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminHospitalService,
  type CreateHospitalRequest,
} from "@/lib/services/hospital/AdminHospitalService";
import { uploadService } from "@/lib/services/upload/UploadService";
import { BaseStatus } from "@/types/models";

const hospitalListPath = "/noi-bo/trang-tong/co-so-y-te";

export function CreateHospitalScreen() {
  return <HospitalFormScreen />;
}

export function HospitalFormScreen({ hospitalUuid }: { hospitalUuid?: string }) {
  const router = useRouter();
  const isEditing = Boolean(hospitalUuid);
  const [form, setForm] = useState<CreateHospitalRequest>({
    name: "",
    address: "",
    slug: "",
    image: "",
    mapUrl: "",
    numberOfRoom: 0,
    description: "",
    detailService: "",
    workingHour: "",
    status: BaseStatus.Active,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!hospitalUuid) return;

    const controller = new AbortController();
    adminHospitalService.getById(hospitalUuid, controller.signal)
      .then((response) => {
        const hospital = response.data ?? response.data;
        if (!hospital) throw new Error("API không trả về dữ liệu cơ sở y tế");

        setForm({
          name: hospital.name ?? "",
          address: hospital.address ?? "",
          slug: hospital.slug ?? "",
          image: hospital.image ?? "",
          mapUrl: hospital.mapUrl ?? "",
          numberOfRoom: hospital.numberOfRoom ?? 0,
          description: hospital.description ?? "",
          detailService: hospital.detailService ?? "",
          workingHour: hospital.workingHour ?? "",
          status: hospital.status,
        });
      })
      .catch((loadError) => {
        if (controller.signal.aborted) return;
        console.error("Không thể tải cơ sở y tế:", loadError);
        setError("Không thể tải thông tin cơ sở y tế.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [hospitalUuid]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function update<K extends keyof CreateHospitalRequest>(
    key: K,
    value: CreateHospitalRequest[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!isEditing && !imageFile) {
      setError("Vui lòng chọn hình ảnh cơ sở y tế.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let imageUri = form.image;
      if (imageFile) {
        setSubmitStatus("Đang tải hình ảnh lên...");
        const uploadResponse = await uploadService.uploadImage(imageFile);
        const uploadResult = uploadResponse.data ?? uploadResponse.data;
        imageUri = uploadResult?.secureUri
          ?? uploadResult?.secureUrl
          ?? uploadResult?.uri
          ?? uploadResult?.url
          ?? "";
      }

      if (!imageUri) throw new Error("API upload không trả về URI hình ảnh.");

      const payload = {
        ...form,
        image: imageUri,
        name: form.name.trim(),
        address: form.address.trim(),
        slug: form.slug.trim(),
      };
      setSubmitStatus(isEditing ? "Đang lưu thay đổi..." : "Đang tạo cơ sở y tế...");
      if (hospitalUuid) await adminHospitalService.update(hospitalUuid, payload);
      else await adminHospitalService.create(payload);
      router.push(hospitalListPath);
    } catch (submitError) {
      console.error(`Không thể ${isEditing ? "cập nhật" : "tạo"} cơ sở y tế:`, submitError);
      setError(`Không thể ${isEditing ? "cập nhật" : "tạo"} cơ sở y tế. Vui lòng kiểm tra thông tin và thử lại.`);
    } finally {
      setIsSubmitting(false);
      setSubmitStatus("");
    }
  }

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một tệp hình ảnh.");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Danh mục toàn hệ thống"
        title={isEditing ? "Sửa cơ sở y tế" : "Thêm cơ sở y tế"}
        description={isEditing ? "Cập nhật thông tin cơ sở y tế trên một trang riêng." : "Tạo cơ sở y tế trên một trang riêng và tải ảnh đại diện trực tiếp từ máy của bạn."}
        actions={(
          <Button type="button" variant="outline" onClick={() => router.push(hospitalListPath)}>
            <ArrowLeft /> Quay lại danh sách
          </Button>
        )}
      />

      <PortalSection title="Thông tin cơ sở y tế" description="Các trường có dấu yêu cầu cần được nhập đầy đủ.">
        <form onSubmit={handleSubmit} className="space-y-6 p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3 sm:col-span-2">
              <Label htmlFor="hospital-image">Ảnh đại diện</Label>
              <label
                htmlFor="hospital-image"
                className="group flex min-h-72 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-slate-50 transition hover:border-primary/60 hover:bg-primary/5"
              >
                {imagePreview || form.image ? (
                  <img src={imagePreview || form.image} alt="Ảnh cơ sở y tế xem trước" className="h-80 w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-3 p-8 text-center text-muted-foreground">
                    <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                      <ImagePlus className="size-7 text-primary" />
                    </span>
                    <span className="font-medium text-foreground">Chọn ảnh từ máy</span>
                    <span className="text-xs">Ảnh chỉ được xem trước; hệ thống sẽ upload khi bạn bấm lưu.</span>
                  </span>
                )}
              </label>
              <Input
                id="hospital-image"
                type="file"
                accept="image/*"
                required={!isEditing}
                onChange={(event) => handleImageChange(event.target.files?.[0])}
              />
              {imageFile ? (
                <p className="text-xs text-muted-foreground">Đã chọn: {imageFile.name}</p>
              ) : null}
            </div>
            <FormField label="Tên cơ sở y tế">
              <Input required minLength={2} maxLength={200} value={form.name} onChange={(event) => update("name", event.target.value)} />
            </FormField>
            <FormField label="slug">
              <Input required minLength={2} maxLength={200} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Chỉ dùng chữ thường, số và dấu gạch ngang" value={form.slug} onChange={(event) => update("slug", event.target.value)} />
            </FormField>
            <FormField label="Địa chỉ" wide>
              <Input required minLength={5} maxLength={500} value={form.address} onChange={(event) => update("address", event.target.value)} />
            </FormField>
            <FormField label="Số phòng">
              <Input required type="number" min={0} value={form.numberOfRoom} onChange={(event) => update("numberOfRoom", Number(event.target.value))} />
            </FormField>
            <FormField label="Trạng thái">
              <select value={form.status} onChange={(event) => update("status", event.target.value as BaseStatus)} className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                <option value={BaseStatus.Active}>Hoạt động</option>
                <option value={BaseStatus.InActive}>Tạm ngưng</option>
              </select>
            </FormField>
            <FormField label="Giờ làm việc" wide>
              <Input value={form.workingHour} onChange={(event) => update("workingHour", event.target.value)} placeholder="Ví dụ: Thứ Hai - Thứ Sáu, 07:00 - 17:00" />
            </FormField>
            <FormField label="URL bản đồ" wide>
              <Input type="url" value={form.mapUrl} onChange={(event) => update("mapUrl", event.target.value)} placeholder="https://..." />
            </FormField>
            <MarkdownEditor label="Mô tả" value={form.description ?? ""} onChange={(value) => update("description", value)} />
            <MarkdownEditor label="Chi tiết dịch vụ" value={form.detailService ?? ""} onChange={(value) => update("detailService", value)} />
          </div>

          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end gap-3 border-t pt-5">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.push(hospitalListPath)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting || (!isEditing && !imageFile)}>
              <Save /> {submitStatus || (isEditing ? "Lưu thay đổi" : "Tạo cơ sở y tế")}
            </Button>
          </div>
        </form>
      </PortalSection>
    </div>
  );
}

function MarkdownEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label>{label} (Markdown)</Label>
      <div className="flex gap-1 border-b pb-2">
        <Button type="button" size="sm" variant={preview ? "ghost" : "secondary"} onClick={() => setPreview(false)}>
          Soạn thảo
        </Button>
        <Button type="button" size="sm" variant={preview ? "secondary" : "ghost"} onClick={() => setPreview(true)}>
          Xem trước
        </Button>
      </div>
      {preview ? (
        <div className="min-h-40 rounded-md border bg-slate-50 p-4 text-sm">
          {value ? <SafeMarkdown content={value} /> : <p className="text-muted-foreground">Chưa có nội dung để xem trước.</p>}
        </div>
      ) : (
        <Textarea
          className="min-h-40 font-mono text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Hỗ trợ **in đậm**, danh sách và đoạn văn Markdown"
        />
      )}
    </div>
  );
}

function FormField({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "space-y-2 sm:col-span-2" : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
