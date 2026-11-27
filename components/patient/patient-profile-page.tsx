"use client";

import jsQR from "jsqr";
import {
  Camera,
  ImagePlus,
  Keyboard,
  LoaderCircle,
  QrCode,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { useToast } from "@/components/toast/toast-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genderOptions } from "@/lib/auth/options";
import { getVietnamToday } from "@/lib/booking/working-hours";
import type { AsyncState } from "@/lib/http/response";
import {
  type PatientProfileFieldErrors,
  validatePatientProfile,
} from "@/lib/patient/validation";
import {
  PatientServiceError,
  patientService,
} from "@/lib/services/patient/PatientService";
import { uploadService } from "@/lib/services/upload/UploadService";
import { cn } from "@/lib/utils";
import { Gender } from "@/types/models";
import type {
  PatientProfileView,
  UpdatePatientProfileRequest,
} from "@/types/patient";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maximumImageSize = 5 * 1024 * 1024;

export function PatientProfilePage() {
  const { session, syncPatientProfile } = useAuth();
  const accountUuid = session?.account.uuid;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AsyncState<PatientProfileView>>({
    status: "loading",
  });

  useEffect(() => {
    if (!accountUuid) return;
    const controller = new AbortController();
    let active = true;
    patientService
      .getCurrent(controller.signal)
      .then((response) => {
        if (active) setState({ status: "success", data: response.data });
      })
      .catch(() => {
        if (active) {
          setState({
            status: "error",
            message: "Không thể tải hồ sơ người bệnh. Vui lòng thử lại.",
          });
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [accountUuid, attempt]);

  if (!session) return null;

  return (
    <div className="min-w-0">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Khu vực Patient</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Hồ sơ của tôi
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Kiểm tra và cập nhật thông tin cá nhân dùng trong các yêu cầu đặt lịch.
        </p>
      </div>

      {state.status === "loading" || state.status === "idle" ? (
        <div className="mt-8">
          <LoadingState label="Đang tải hồ sơ" />
        </div>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-8">
          <ErrorState
            message={state.message}
            onRetry={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
          />
        </div>
      ) : null}
      {state.status === "success" ? (
        <ProfileEditor
          view={state.data}
          onSaved={(view) => {
            setState({ status: "success", data: view });
            syncPatientProfile(view.profile, session);
          }}
        />
      ) : null}
    </div>
  );
}

function ProfileEditor({
  view,
  onSaved,
}: {
  view: PatientProfileView;
  onSaved: (view: PatientProfileView) => void;
}) {
  const { success, error: showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState(view.profile.avatar);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(view.profile.avatar);
  const [name, setName] = useState(view.profile.name);
  const [gender, setGender] = useState<Gender>(view.profile.gender);
  const [birthdate, setBirthdate] = useState(toDateInput(view.profile.birthdate));
  const [email, setEmail] = useState(view.profile.email);
  const [medicalCode, setMedicalCode] = useState(view.profile.medicalCode);
  const [medicalCodeMode, setMedicalCodeMode] = useState<"manual" | "qr">("manual");
  const [qrOpen, setQrOpen] = useState(false);

  const [errors, setErrors] = useState<PatientProfileFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maximumBirthdate] = useState(() => {
    const today = new Date(`${getVietnamToday()}T00:00:00.000Z`);
    today.setUTCDate(today.getUTCDate() - 1);
    return today.toISOString().slice(0, 10);
  });

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const originalBirthdate = toDateInput(view.profile.birthdate);
  const isDirty =
    Boolean(imageFile) ||
    avatar !== view.profile.avatar ||
    name !== view.profile.name ||
    gender !== view.profile.gender ||
    birthdate !== originalBirthdate ||
    email !== view.profile.email ||
    medicalCode !== view.profile.medicalCode;

  function clearSelectedImage(nextAvatar: string) {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setAvatar(nextAvatar);
    setImagePreview(nextAvatar);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAvatarSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!acceptedImageTypes.includes(file.type)) {
      showError("Định dạng ảnh không hợp lệ", "Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > maximumImageSize) {
      showError("Ảnh quá lớn", "Dung lượng ảnh không được vượt quá 5 MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: undefined }));
  }

  function resetForm() {
    clearSelectedImage(view.profile.avatar);
    setName(view.profile.name);
    setGender(view.profile.gender);
    setBirthdate(originalBirthdate);
    setEmail(view.profile.email);
    setMedicalCode(view.profile.medicalCode);
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const preValidationRequest: UpdatePatientProfileRequest = {
      avatar: imageFile ? "" : avatar,
      name,
      gender,
      birthdate: new Date(`${birthdate}T00:00:00.000Z`),
      email,
      medicalCode,
    };
    const nextErrors = validatePatientProfile(preValidationRequest);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstError = Object.values(nextErrors).find(Boolean);
      showError("Thông tin chưa hợp lệ", firstError || "Vui lòng kiểm tra lại các trường.");
      return;
    }

    setIsSubmitting(true);
    try {
      let resolvedAvatar = avatar;
      if (imageFile) {
        const uploadResponse = await uploadService.uploadImage(imageFile);
        const result = uploadResponse.data;
        resolvedAvatar =
          result.secureUrl ?? result.secureUri ?? result.url ?? result.uri ?? "";
        if (!resolvedAvatar) {
          throw new Error("Dịch vụ upload không trả về địa chỉ ảnh.");
        }
      }

      const request: UpdatePatientProfileRequest = {
        avatar: resolvedAvatar,
        name,
        gender,
        birthdate: new Date(`${birthdate}T00:00:00.000Z`),
        email,
        medicalCode,
      };
      const response = await patientService.updateCurrent(request);
      onSaved(response.data);
      clearSelectedImage(response.data.profile.avatar);
      setName(response.data.profile.name);
      setGender(response.data.profile.gender);
      setBirthdate(toDateInput(response.data.profile.birthdate));
      setEmail(response.data.profile.email);
      setMedicalCode(response.data.profile.medicalCode);
      success("Cập nhật thành công", response.message);
    } catch (error) {
      if (error instanceof PatientServiceError) {
        setErrors(error.fieldErrors);
        showError("Không thể cập nhật hồ sơ", error.message);
      } else if (error instanceof Error) {
        showError("Không thể cập nhật hồ sơ", error.message);
      } else {
        showError("Không thể cập nhật hồ sơ", "Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 min-w-0 rounded-xl border bg-card p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-5 text-primary" />
              <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Số điện thoại đăng nhập không thể thay đổi. Mã y tế có thể nhập trực tiếp hoặc quét từ mã QR.
            </p>
          </div>
          {isDirty ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Có thay đổi chưa lưu
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="min-w-0 space-y-3 sm:col-span-2">
            <Label>Ảnh đại diện</Label>
            <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-card">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={`Ảnh đại diện ${name || "người bệnh"}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" className="size-8 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  id="profile-avatar-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isSubmitting}
                  className="hidden"
                  onChange={handleAvatarSelected}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus aria-hidden="true" />
                    Chọn ảnh từ máy
                  </Button>
                  {imagePreview ? (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isSubmitting}
                      onClick={() => clearSelectedImage("")}
                    >
                      <Trash2 aria-hidden="true" />
                      Xóa ảnh
                    </Button>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ JPG, PNG, WebP tối đa 5 MB. Ảnh sẽ được tải lên khi bạn lưu thay đổi.
                </p>
                {errors.avatar ? (
                  <p className="text-sm text-destructive">{errors.avatar}</p>
                ) : null}
              </div>
            </div>
          </div>

          <ProfileField
            htmlFor="profile-name"
            label="Họ và tên"
            error={errors.name}
            className="sm:col-span-2"
          >
            <Input
              id="profile-name"
              autoComplete="name"
              value={name}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "profile-name-error" : undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </ProfileField>

          <ProfileField htmlFor="profile-gender" label="Giới tính" error={errors.gender}>
            <Select
              items={genderOptions}
              value={gender}
              disabled={isSubmitting}
              onValueChange={(value) => setGender(value as Gender)}
            >
              <SelectTrigger
                id="profile-gender"
                className="w-full"
                aria-invalid={Boolean(errors.gender)}
                aria-describedby={errors.gender ? "profile-gender-error" : undefined}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ProfileField>

          <ProfileField
            htmlFor="profile-birthdate"
            label="Ngày sinh"
            error={errors.birthdate}
          >
            <Input
              id="profile-birthdate"
              type="date"
              autoComplete="bday"
              max={maximumBirthdate}
              value={birthdate}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.birthdate)}
              aria-describedby={errors.birthdate ? "profile-birthdate-error" : undefined}
              onChange={(event) => setBirthdate(event.target.value)}
            />
          </ProfileField>

          <ProfileField
            htmlFor="profile-email"
            label="Email"
            error={errors.email}
            className="sm:col-span-2"
          >
            <Input
              id="profile-email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "profile-email-error" : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
          </ProfileField>

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="profile-medical-code">Mã y tế</Label>
              <div className="inline-flex rounded-md border bg-muted p-0.5 text-xs">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setMedicalCodeMode("manual")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2 py-1 font-medium transition-colors",
                    medicalCodeMode === "manual"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Keyboard aria-hidden="true" className="size-3.5" />
                  Điền trực tiếp
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setMedicalCodeMode("qr");
                    setQrOpen(true);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2 py-1 font-medium transition-colors",
                    medicalCodeMode === "qr"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <QrCode aria-hidden="true" className="size-3.5" />
                  Quét QR
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                id="profile-medical-code"
                value={medicalCode}
                maxLength={50}
                disabled={isSubmitting}
                readOnly={medicalCodeMode === "qr"}
                placeholder={
                  medicalCodeMode === "qr"
                    ? "Bấm Quét QR để lấy mã y tế"
                    : "Nhập mã y tế / số BHYT"
                }
                aria-invalid={Boolean(errors.medicalCode)}
                aria-describedby={
                  errors.medicalCode ? "profile-medical-code-error" : undefined
                }
                onChange={(event) => setMedicalCode(event.target.value)}
              />
              {medicalCodeMode === "qr" ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => setQrOpen(true)}
                >
                  <QrCode aria-hidden="true" />
                  Mở quét QR
                </Button>
              ) : null}
            </div>
            {errors.medicalCode ? (
              <p id="profile-medical-code-error" className="text-sm text-destructive">
                {errors.medicalCode}
              </p>
            ) : null}
          </div>

          <ReadOnlyField id="profile-phone" label="Số điện thoại" value={view.phone} />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!isDirty || isSubmitting}
            onClick={resetForm}
          >
            Hủy thay đổi
          </Button>
          <Button type="submit" size="lg" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>

      <QrScannerDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        onDetected={(decodedValue) => {
          const normalized = decodedValue.trim().slice(0, 50);
          setMedicalCode(normalized);
          setErrors((prev) => ({ ...prev, medicalCode: undefined }));
          setQrOpen(false);
          success("Quét mã QR thành công", `Đã điền mã y tế: ${normalized}`);
        }}
      />
    </>
  );
}

function QrScannerDialog({
  open,
  onOpenChange,
  onDetected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (value: string) => void;
}) {
  const { error: showError } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(
    "Chọn quét bằng camera hoặc tải ảnh chứa mã QR từ máy.",
  );

  const stopCamera = useCallback(() => {
    const video = videoRef.current;
    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => stopCamera());
    }
    return () => stopCamera();
  }, [open, stopCamera]);

  useEffect(() => {
    if (!open || !cameraActive) return;

    let rafId = 0;
    let cancelled = false;

    const scanFrame = () => {
      if (cancelled) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data?.trim()) {
            stopCamera();
            onDetected(code.data);
            return;
          }
        }
      }
      rafId = window.requestAnimationFrame(scanFrame);
    };

    rafId = window.requestAnimationFrame(scanFrame);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, [cameraActive, onDetected, open, stopCamera]);

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      showError("Trình duyệt không hỗ trợ camera", "Vui lòng chọn ảnh QR từ máy.");
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setCameraStatus("Đưa mã QR vào khung hình để hệ thống tự động nhận diện.");
    } catch {
      showError(
        "Không thể mở camera",
        "Vui lòng cấp quyền camera hoặc dùng tùy chọn tải ảnh mã QR.",
      );
    }
  }

  function handleQrImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      URL.revokeObjectURL(objectUrl);

      if (!context) {
        showError("Không thể đọc ảnh QR", "Vui lòng thử lại với ảnh khác.");
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code?.data?.trim()) {
        stopCamera();
        onDetected(code.data);
      } else {
        showError(
          "Không tìm thấy mã QR trong ảnh",
          "Vui lòng chọn ảnh rõ nét hơn hoặc quét bằng camera.",
        );
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      showError("Không thể mở ảnh", "Vui lòng chọn tệp ảnh hợp lệ.");
    };
    image.src = objectUrl;
    event.target.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quét mã QR lấy mã y tế</DialogTitle>
          <DialogDescription>{cameraStatus}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
            <video
              ref={videoRef}
              playsInline
              muted
              className={cn("size-full object-cover", !cameraActive && "hidden")}
            />
            {!cameraActive ? (
              <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
                <QrCode aria-hidden="true" className="size-10" />
                <p className="text-xs">Camera đang tắt. Bấm “Bật camera” hoặc chọn ảnh QR.</p>
              </div>
            ) : null}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <input
            ref={qrFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleQrImageUpload}
          />

          <div className="flex flex-wrap gap-2">
            {cameraActive ? (
              <Button type="button" variant="outline" onClick={stopCamera}>
                Tắt camera
              </Button>
            ) : (
              <Button type="button" onClick={startCamera}>
                <Camera aria-hidden="true" />
                Bật camera
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => qrFileInputRef.current?.click()}
            >
              <Upload aria-hidden="true" />
              Chọn ảnh QR từ máy
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Đóng
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileField({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReadOnlyField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        readOnly
        aria-readonly="true"
        className="bg-muted/60 text-muted-foreground"
      />
    </div>
  );
}

function toDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}
