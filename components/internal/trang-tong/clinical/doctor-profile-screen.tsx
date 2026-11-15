"use client";

import { isAxiosError } from "axios";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Camera,
  LoaderCircle,
  Pencil,
  Save,
  ShieldCheck,
  Stethoscope,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { DetailImage } from "@/components/detail/detail-image";
import { PortalPageHeader, PortalSection, StatusPill } from "@/components/internal/portal-ui";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doctorProfileInternalService } from "@/lib/services/doctor/DoctorProfileService";
import { uploadService } from "@/lib/services/upload/UploadService";
import type { DoctorProfileResponse, UpdateDoctorProfilePayload } from "@/types/doctor-profile";

const emptyForm: UpdateDoctorProfilePayload = {
  avatar: "",
  name: "",
  specialty: "",
  workplace: "",
  introduction: "",
  expertise: "",
};
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maximumImageSize = 5 * 1024 * 1024;

export default function DoctorProfileScreen() {
  const [profile, setProfile] = useState<DoctorProfileResponse | null>(null);
  const [formData, setFormData] = useState<UpdateDoctorProfilePayload>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    doctorProfileInternalService.getMyProfile(controller.signal)
      .then((response) => {
        if (!response?.data) return;
        setProfile(response.data);
        setFormData(toFormData(response.data));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setErrorMessage(getError(error, "Không thể tải hồ sơ bác sĩ."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  function startEditing() {
    if (!profile) return;
    setFormData(toFormData(profile));
    clearSelectedImage();
    setEditing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function cancelEditing() {
    if (profile) setFormData(toFormData(profile));
    clearSelectedImage();
    setEditing(false);
    setErrorMessage(null);
    setSaveStatus("");
  }

  function clearSelectedImage() {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
  }

  function updateField(field: keyof UpdateDoctorProfilePayload, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function selectImage(file?: File) {
    if (!file) return;
    if (!acceptedImageTypes.includes(file.type)) {
      setErrorMessage("Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WebP.");
      return;
    }
    if (file.size > maximumImageSize) {
      setErrorMessage("Dung lượng ảnh không được vượt quá 5 MB.");
      return;
    }
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrorMessage(null);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredValues = [formData.name, formData.specialty, formData.workplace, formData.introduction, formData.expertise];
    if (requiredValues.some((value) => !value.trim())) {
      setErrorMessage("Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      let avatar = formData.avatar;
      if (imageFile) {
        setSaveStatus("Đang tải ảnh đại diện...");
        const uploadResponse = await uploadService.uploadImage(imageFile);
        const result = uploadResponse.data;
        avatar = result.secureUri ?? result.secureUrl ?? result.uri ?? result.url ?? "";
        if (!avatar) throw new Error("Dịch vụ upload không trả về địa chỉ ảnh.");
      }

      setSaveStatus("Đang lưu hồ sơ...");
      const response = await doctorProfileInternalService.updateMyProfile({
        ...formData,
        avatar,
        name: formData.name.trim(),
        specialty: formData.specialty.trim(),
        workplace: formData.workplace.trim(),
        introduction: formData.introduction.trim(),
        expertise: formData.expertise.trim(),
      });
      setProfile(response.data);
      setFormData(toFormData(response.data));
      clearSelectedImage();
      setEditing(false);
      setSuccessMessage("Hồ sơ nghề nghiệp đã được cập nhật.");
    } catch (error) {
      setErrorMessage(getError(error, "Không thể lưu hồ sơ. Vui lòng thử lại."));
    } finally {
      setSaving(false);
      setSaveStatus("");
    }
  }

  if (loading) return <LoadingState label="Đang tải hồ sơ nghề nghiệp" />;
  if (!profile) return <ErrorState message={errorMessage ?? "Không tìm thấy hồ sơ bác sĩ."} onRetry={() => { setLoading(true); setAttempt((value) => value + 1); }} />;

  if (editing) {
    return (
      <form onSubmit={(event) => void saveProfile(event)} className="space-y-6">
        <PortalPageHeader
          eyebrow="Hồ sơ nghề nghiệp"
          title="Chỉnh sửa thông tin"
          description="Cập nhật ảnh đại diện và nội dung bệnh nhân sẽ thấy trên trang bác sĩ."
          actions={(
            <>
              <Button type="button" variant="outline" disabled={saving} onClick={cancelEditing}><X />Hủy</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
                {saveStatus || "Lưu thay đổi"}
              </Button>
            </>
          )}
        />

        {errorMessage ? <Message tone="error">{errorMessage}</Message> : null}

        <div className="grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]">
          <PortalSection title="Ảnh đại diện" description="JPG, PNG hoặc WebP · tối đa 5 MB">
            <div className="space-y-4 p-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-64 overflow-hidden rounded-xl border bg-slate-100">
                <DetailImage
                  key={imagePreview || formData.avatar}
                  src={imagePreview || formData.avatar}
                  fallbackSrc="/images/doctor-placeholder.svg"
                  alt={`Ảnh bác sĩ ${formData.name}`}
                  unoptimized={Boolean(imagePreview)}
                />
              </div>
              <label htmlFor="doctor-avatar" className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 text-sm font-medium transition-colors hover:bg-slate-50">
                <Upload className="size-4" />Chọn ảnh từ máy
              </label>
              <Input id="doctor-avatar" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectImage(event.target.files?.[0])} />
              {imageFile ? (
                <div className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-700">
                  <p className="font-semibold">Ảnh mới đã sẵn sàng</p>
                  <p className="mt-1 truncate">{imageFile.name} · {formatFileSize(imageFile.size)}</p>
                </div>
              ) : <p className="text-center text-xs leading-5 text-muted-foreground">Ảnh chỉ được tải lên khi bạn bấm lưu.</p>}
            </div>
          </PortalSection>

          <div className="space-y-6">
            <PortalSection title="Thông tin cơ bản" description="Tên và chuyên môn hiển thị ngay trên thẻ bác sĩ.">
              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <ProfileField label="Họ và tên" htmlFor="doctor-name">
                  <Input id="doctor-name" minLength={2} maxLength={150} value={formData.name} onChange={(event) => updateField("name", event.target.value)} required />
                </ProfileField>
                <ProfileField label="Chuyên môn nổi bật" htmlFor="doctor-specialty">
                  <Input id="doctor-specialty" maxLength={200} value={formData.specialty} onChange={(event) => updateField("specialty", event.target.value)} placeholder="Ví dụ: Tim mạch can thiệp" required />
                </ProfileField>
                <ProfileField label="Nơi công tác" htmlFor="doctor-workplace" wide>
                  <Input id="doctor-workplace" maxLength={300} value={formData.workplace} onChange={(event) => updateField("workplace", event.target.value)} required />
                </ProfileField>
              </div>
            </PortalSection>

            <PortalSection title="Nội dung giới thiệu" description="Viết ngắn gọn, rõ ràng và tập trung vào thông tin chuyên môn.">
              <div className="space-y-5 p-5">
                <ProfileField label="Giới thiệu" htmlFor="doctor-introduction">
                  <Textarea id="doctor-introduction" rows={7} maxLength={4000} value={formData.introduction} onChange={(event) => updateField("introduction", event.target.value)} placeholder="Giới thiệu quá trình công tác và định hướng chăm sóc người bệnh..." required />
                  <CharacterCount value={formData.introduction} maximum={4000} />
                </ProfileField>
                <ProfileField label="Kinh nghiệm và thế mạnh" htmlFor="doctor-expertise">
                  <Textarea id="doctor-expertise" rows={9} maxLength={6000} value={formData.expertise} onChange={(event) => updateField("expertise", event.target.value)} placeholder="Các lĩnh vực điều trị, kỹ thuật chuyên sâu và kinh nghiệm nổi bật..." required />
                  <CharacterCount value={formData.expertise} maximum={6000} />
                </ProfileField>
              </div>
            </PortalSection>

            <PortalSection title="Thông tin do bệnh viện quản lý" description="Liên hệ quản lý chi nhánh nếu cần thay đổi các mục này.">
              <div className="grid gap-px bg-border sm:grid-cols-3">
                <ReadonlyFact label="Cơ sở" value={profile.hospitalName || "Chưa phân công"} />
                <ReadonlyFact label="Chuyên khoa" value={profile.departmentDisplay || "Chưa phân chuyên khoa"} />
              </div>
            </PortalSection>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Khám chữa bệnh"
        title="Hồ sơ nghề nghiệp"
        description="Thông tin công khai được sử dụng trên trang bác sĩ và luồng đặt lịch."
        actions={<Button type="button" onClick={startEditing}><Pencil />Chỉnh sửa</Button>}
      />

      {successMessage ? <Message tone="success">{successMessage}</Message> : null}
      {errorMessage ? <Message tone="error">{errorMessage}</Message> : null}

      <section className="overflow-hidden border bg-white">
        <div className="h-24 bg-[linear-gradient(110deg,#0f4968,#16779a)] sm:h-32" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative -mt-14 size-36 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-slate-100 shadow-sm sm:-mt-16 sm:size-40">
              <DetailImage key={profile.avatar} src={profile.avatar} fallbackSrc="/images/doctor-placeholder.svg" alt={`Bác sĩ ${profile.name}`} />
              <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white"><Camera className="size-4" /></span>
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-[#173b57] sm:text-3xl">{profile.name}</h2>
                {profile.accountStatus === "Active" ? <StatusPill tone="green"><BadgeCheck className="mr-1 size-3.5" />Đang hoạt động</StatusPill> : <StatusPill tone="amber">Tạm dừng</StatusPill>}
              </div>
              <p className="mt-2 font-semibold text-primary">{profile.specialty || "Chưa cập nhật chuyên môn"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{profile.departmentDisplay || "Chưa phân chuyên khoa"}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <ContentSection title="Giới thiệu" fallback="Chưa cập nhật phần giới thiệu." content={profile.introduction} />
          <ContentSection title="Kinh nghiệm và thế mạnh" fallback="Chưa cập nhật kinh nghiệm chuyên môn." content={profile.expertise} />
        </div>

        <aside className="space-y-6">
          <PortalSection title="Thông tin công tác">
            <div className="divide-y">
              <SideFact icon={<Building2 />} label="Cơ sở" value={profile.hospitalName || "Chưa phân công"} />
              <SideFact icon={<Stethoscope />} label="Chuyên khoa" value={profile.departmentDisplay || "Chưa phân chuyên khoa"} />
              <SideFact icon={<BriefcaseBusiness />} label="Nơi công tác" value={profile.workplace || "Chưa cập nhật"} />
            </div>
          </PortalSection>
          <div className="border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4" />Thông tin đã đồng bộ</div>
            <p className="mt-2 leading-6 text-emerald-700">Các thay đổi sau khi lưu sẽ được sử dụng trên hồ sơ công khai của bạn.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function toFormData(profile: DoctorProfileResponse): UpdateDoctorProfilePayload {
  return {
    avatar: profile.avatar,
    name: profile.name,
    specialty: profile.specialty,
    workplace: profile.workplace,
    introduction: profile.introduction,
    expertise: profile.expertise,
  };
}

function ContentSection({ title, content, fallback }: { title: string; content: string; fallback: string }) {
  return (
    <PortalSection title={title}>
      <div className="p-5 text-sm leading-7 sm:p-7">
        {content.trim() ? <SafeMarkdown content={content} showImages={false} /> : <p className="text-muted-foreground">{fallback}</p>}
      </div>
    </PortalSection>
  );
}

function ProfileField({ label, htmlFor, wide = false, children }: { label: string; htmlFor: string; wide?: boolean; children: ReactNode }) {
  return <div className={`space-y-2 ${wide ? "sm:col-span-2" : ""}`}><Label htmlFor={htmlFor}>{label}</Label>{children}</div>;
}

function SideFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex gap-3 p-4"><span className="mt-0.5 text-primary [&>svg]:size-4">{icon}</span><div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-semibold leading-5 text-[#173b57]">{value}</p></div></div>;
}

function ReadonlyFact({ label, value }: { label: string; value: string }) {
  return <div className="bg-slate-50 p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold text-[#173b57]">{value}</p></div>;
}

function CharacterCount({ value, maximum }: { value: string; maximum: number }) {
  return <p className="text-right text-xs text-muted-foreground">{value.length.toLocaleString("vi-VN")} / {maximum.toLocaleString("vi-VN")}</p>;
}

function Message({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return <p role={tone === "error" ? "alert" : "status"} className={`border px-4 py-3 text-sm font-medium ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{children}</p>;
}

function formatFileSize(value: number) { return value < 1024 * 1024 ? `${Math.ceil(value / 1024)} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`; }
function getError(error: unknown, fallback: string) { return isAxiosError(error) && typeof error.response?.data?.message === "string" ? error.response.data.message : error instanceof Error ? error.message : fallback; }
