"use client";

import { ArrowLeft, CheckCircle2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getManagementLanding } from "@/lib/auth/management-landing";
import { internalAuthService } from "@/lib/services/auth/InternalAuthService";

export function InternalAuthForm({ mode }: { mode: "login" | "forgot-password" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (mode === "forgot-password") {
      window.setTimeout(() => {
        setSubmitted(true);
        setIsSubmitting(false);
      }, 400);
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      const session = await internalAuthService.login(
        String(formData.get("phone") ?? ""),
        String(formData.get("password") ?? ""),
      );
      router.push(getManagementLanding(session));
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Đăng nhập không thành công.");
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto size-11 text-emerald-600" />
        <h2 className="mt-4 text-xl font-bold">Đã tiếp nhận yêu cầu</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi đến bạn.
        </p>
        <Link href="/noi-bo/dang-nhap" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
          <ArrowLeft aria-hidden="true" />
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p> : null}
      <div className="space-y-2">
        {mode === "login" ? (
          <>
            <Label htmlFor="internal-phone">Số điện thoại</Label>
            <Input id="internal-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required pattern="(?:\+84|0)(?:3|5|7|8|9)[0-9]{8}" placeholder="0900000000" className="h-11" />
          </>
        ) : (
          <>
            <Label htmlFor="internal-email">Email công việc</Label>
            <Input id="internal-email" name="email" type="email" autoComplete="email" required placeholder="ten@benhvien.vn" className="h-11" />
          </>
        )}
      </div>

      {mode === "login" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="internal-password">Mật khẩu</Label>
            <Link href="/noi-bo/quen-mat-khau" className="text-xs font-semibold text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input id="internal-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="h-11 pr-11" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
              {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
        {mode === "login" ? "Vào cổng làm việc" : "Gửi hướng dẫn đặt lại"}
      </Button>

      {mode === "forgot-password" ? (
        <Link href="/noi-bo/dang-nhap" className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Quay lại đăng nhập
        </Link>
      ) : null}
    </form>
  );
}
