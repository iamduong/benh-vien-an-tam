"use client";

import Link from "next/link";
import { Headset, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { AccountMenu } from "@/components/layout/account-menu";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/toast/toast-context";
import { AuthServiceError } from "@/lib/services/auth/AuthService";
import { getManagementLanding } from "@/lib/auth/management-landing";
import {
  isNavigationItemActive,
  patientNavigation,
  publicNavigation,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { session, managementSession, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const managementHref = managementSession
    ? getManagementLanding(managementSession)
    : null;
  const isAuthenticated = Boolean(session || managementSession);
  const mobileItems = session
    ? [...publicNavigation, ...patientNavigation]
    : managementHref
      ? [
          ...publicNavigation,
          { label: "Cổng quản lý", href: managementHref },
        ]
      : publicNavigation;

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error(
        "Không thể đăng xuất trên máy chủ",
        error instanceof AuthServiceError
          ? error.message
          : "Phiên đăng nhập trên thiết bị đã được xóa.",
      );
    } finally {
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="hidden bg-[#075d8a] text-white md:block">
        <div className="container-shell flex h-8 items-center justify-between text-xs">
          <p className="flex items-center gap-2 font-medium">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Nền tảng hỗ trợ đặt lịch và quản lý chăm sóc sức khỏe
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <Headset aria-hidden="true" className="size-3.5" />
            Hỗ trợ người bệnh: 1900 2115
          </p>
        </div>
      </div>
      <div className="container-shell flex h-[4.5rem] items-center justify-between gap-6">
        <SiteLogo />
        <nav
          aria-label="Điều hướng chính"
          className="hidden h-full items-center gap-5 xl:flex"
        >
          {publicNavigation.map((item) => {
            const active = isNavigationItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full items-center border-b-2 border-transparent px-1 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary",
                  active && "border-primary font-semibold text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden shrink-0 xl:block">
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : session ? (
            <AccountMenu
              profile={session.patientProfile}
              isLoggingOut={isLoggingOut}
              onLogout={handleLogout}
            />
          ) : managementSession && managementHref ? (
            <Link
              href={managementHref}
              className={cn(buttonVariants(), "h-9 max-w-48 px-4")}
              title={`Vào cổng làm việc - ${managementSession.role.name}`}
            >
              <span className="truncate">{managementSession.role.name}</span>
            </Link>
          ) : (
            <Link
              href="/dang-nhap"
              className={cn(buttonVariants(), "h-9 px-4")}
            >
              Đăng nhập
            </Link>
          )}
        </div>
        <div className="xl:hidden">
          <MobileNavigation
            items={mobileItems}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
