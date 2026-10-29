"use client";

import { CalendarDays, ClipboardList, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const accountItems = [
  { label: "Hồ sơ của tôi", href: "/tai-khoan", icon: UserRound },
  { label: "Lịch hẹn", href: "/tai-khoan/lich-hen", icon: CalendarDays },
  { label: "Đơn thuốc", href: "/tai-khoan/don-thuoc", icon: ClipboardList },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <div className="container-shell py-8 sm:py-12">
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="self-start border border-t-4 border-t-primary bg-card p-4 lg:sticky lg:top-32 lg:p-5">
          <div className="flex items-center gap-4 border-b pb-4 lg:flex-col lg:text-center">
            <AccountAvatar
              key={session.patientProfile.avatar}
              avatar={session.patientProfile.avatar}
              name={session.patientProfile.name}
            />
            <div className="min-w-0">
              <p className="truncate font-bold lg:text-lg">
                {session.patientProfile.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {session.patientProfile.medicalCode}
              </p>
            </div>
          </div>

          <nav
            aria-label="Điều hướng tài khoản"
            className="mt-4 grid grid-cols-3 gap-1 lg:grid-cols-1"
          >
            {accountItems.map((item) => {
              const active =
                item.href === "/tai-khoan"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-w-0 flex-col items-center justify-center gap-1.5 border-l-3 border-transparent px-2 py-3 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-left lg:text-sm",
                    active && "border-primary bg-secondary font-semibold text-primary",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 self-start">{children}</main>
      </div>
    </div>
  );
}

function AccountAvatar({ avatar, name }: { avatar: string; name: string }) {
  const [hasError, setHasError] = useState(false);
  const source = getAvatarUrl(avatar);

  return (
    <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-primary/10 bg-primary text-xl font-bold text-primary-foreground lg:size-28">
      {source && !hasError ? (
        <Image
          src={source}
          alt={`Ảnh đại diện của ${name}`}
          fill
          unoptimized
          sizes="112px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </div>
  );
}

function getAvatarUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "BN";
  const initials =
    words.length === 1
      ? words[0].slice(0, 2)
      : `${words[0][0]}${words[words.length - 1][0]}`;
  return initials.toLocaleUpperCase("vi-VN");
}
