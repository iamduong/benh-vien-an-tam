"use client";

import { isAxiosError } from "axios";
import { Building2, Pencil, Save, Stethoscope, WalletCards, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { DetailImage } from "@/components/detail/detail-image";
import { PortalPageHeader, PortalSection } from "@/components/internal/portal-ui";
import { SafeMarkdown } from "@/components/shared/safe-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doctorProfileInternalService } from "@/lib/services/doctor/DoctorProfileService";
import type { DoctorProfileResponse, UpdateDoctorProfilePayload } from "@/types/doctor-profile";

const emptyForm: UpdateDoctorProfilePayload = {
  name: "",
  specialty: "",
  workplace: "",
  introduction: "",
  expertise: "",
};

export default function DoctorProfileScreen() {
  const [profile, setProfile] = useState<DoctorProfileResponse | null>(null);
  const [formData, setFormData] = useState<UpdateDoctorProfilePayload>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        if (!controller.signal.aborted) {
          console.error("Lỗi tải hồ sơ bác sĩ:", error);
          setErrorMessage("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function startEditing() {
    if (profile) setFormData(toFormData(profile));
    setEditing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function cancelEditing() {
    if (profile) setFormData(toFormData(profile));
    setEditing(false);
    setErrorMessage(null);
  }

  function updateField(field: keyof UpdateDoctorProfilePayload, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requiredValues = [formData.name, formData.specialty, formData.workplace, formData.introduction, formData.expertise];
    if (requiredValues.some((value) => !value.trim())) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin hồ sơ nghề nghiệp.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await doctorProfileInternalService.updateMyProfile(formData);
      setProfile((current) => current ? { ...current, ...formData } : current);
      setEditing(false);
      setSuccessMessage("Đã cập nhật hồ sơ nghề nghiệp.");
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ bác sĩ:", error);
      setErrorMessage(
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Không thể lưu hồ sơ. Vui lòng thử lại.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Đang tải thông tin hồ sơ bác sĩ...</div>;
  }

  if (!profile) {
    return <p className="border bg-white p-8 text-center text-sm text-muted-foreground">Không tìm thấy hồ sơ bác sĩ.</p>;
  }

  if (editing) {
    return (
      <form onSubmit={(event) => void saveProfile(event)} className="space-y-6">
        <PortalPageHeader
          eyebrow="Chỉnh sửa hồ sơ"
          title="Cập nhật hồ sơ nghề nghiệp"
          description="Nội dung giới thiệu và chuyên môn hỗ trợ Markdown. Các thông tin phân công do quản lý bệnh viện cập nhật."
          actions={<><Button type="button" variant="outline" disabled={saving} onClick={cancelEditing}><X />Hủy</Button><Button type="submit" disabled={saving}><Save />{saving ? "Đang lưu..." : "Lưu thay đổi"}</Button></>}
        />
        {errorMessage ? <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        <PortalSection title="Thông tin được phép chỉnh sửa" description="Sau khi lưu, nội dung Markdown sẽ được hiển thị ở chế độ xem hồ sơ.">
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <ProfileField label="Họ và tên" htmlFor="doctor-name"><Input id="doctor-name" value={formData.name} onChange={(event) => updateField("name", event.target.value)} required /></ProfileField>
            <ProfileField label="Chuyên môn" htmlFor="doctor-specialty"><Input id="doctor-specialty" value={formData.specialty} onChange={(event) => updateField("specialty", event.target.value)} required /></ProfileField>
            <ProfileField label="Nơi làm việc" htmlFor="doctor-workplace" wide><Input id="doctor-workplace" value={formData.workplace} onChange={(event) => updateField("workplace", event.target.value)} required /></ProfileField>
            <ProfileField label="Giới thiệu (Markdown)" htmlFor="doctor-introduction" wide><Textarea id="doctor-introduction" rows={8} value={formData.introduction} onChange={(event) => updateField("introduction", event.target.value)} required /></ProfileField>
            <ProfileField label="Kinh nghiệm và chuyên môn (Markdown)" htmlFor="doctor-expertise" wide><Textarea id="doctor-expertise" rows={10} value={formData.expertise} onChange={(event) => updateField("expertise", event.target.value)} required /></ProfileField>
          </div>
        </PortalSection>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Hồ sơ công khai"
        title="Hồ sơ nghề nghiệp"
        description="Đây là nội dung người bệnh nhìn thấy khi xem thông tin và đặt lịch với bạn."
        actions={<Button type="button" onClick={startEditing}><Pencil />Chỉnh sửa hồ sơ</Button>}
      />
      {successMessage ? <p role="status" className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p> : null}
      {errorMessage ? <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}

      <section className="grid overflow-hidden border bg-white sm:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="relative min-h-72 bg-muted sm:min-h-80">
          <DetailImage src={profile.avatar} fallbackSrc="/images/doctor-placeholder.svg" alt={`Bác sĩ ${profile.name}`} />
        </div>
        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Hồ sơ bác sĩ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#173b57] sm:text-4xl">{profile.name}</h2>
          <p className="mt-3 text-lg font-medium text-primary">{profile.specialty}</p>
          <p className="mt-2 text-sm text-muted-foreground">{profile.departmentDisplay || "Chưa phân chuyên khoa"}</p>
        </div>
      </section>

      <PortalSection title="Thông tin công tác">
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileFact icon={<Building2 />} label="Cơ sở" value={profile.hospitalName || "Chưa phân công"} />
          <ProfileFact icon={<Stethoscope />} label="Nơi làm việc" value={profile.workplace || "Đang cập nhật"} />
          <ProfileFact icon={<WalletCards />} label="Phí khám" value={`${profile.price.toLocaleString("vi-VN")} đ`} />
          <ProfileFact icon={<Stethoscope />} label="Trạng thái" value={profile.accountStatus === "Active" ? "Đang hoạt động" : "Tạm dừng"} />
        </div>
      </PortalSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortalSection title="Giới thiệu bác sĩ" description="Thông tin tổng quan hiển thị với người bệnh.">
          <div className="p-5 sm:p-6"><SafeMarkdown content={profile.introduction} showImages={false} /></div>
        </PortalSection>
        <PortalSection title="Kinh nghiệm và chuyên môn" description="Lĩnh vực chuyên môn, kinh nghiệm và thế mạnh điều trị.">
          <div className="p-5 sm:p-6"><SafeMarkdown content={profile.expertise} showImages={false} /></div>
        </PortalSection>
      </div>
    </div>
  );
}

function toFormData(profile: DoctorProfileResponse): UpdateDoctorProfilePayload {
  return {
    name: profile.name,
    specialty: profile.specialty,
    workplace: profile.workplace,
    introduction: profile.introduction,
    expertise: profile.expertise,
  };
}

function ProfileField({ label, htmlFor, wide = false, children }: { label: string; htmlFor: string; wide?: boolean; children: React.ReactNode }) {
  return <div className={`space-y-2 ${wide ? "sm:col-span-2" : ""}`}><Label htmlFor={htmlFor}>{label}</Label>{children}</div>;
}

function ProfileFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="border bg-[#f8fbfc] p-4"><span className="text-primary [&>svg]:size-5">{icon}</span><p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-foreground">{value}</p></div>;
}
