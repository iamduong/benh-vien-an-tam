"use client";

import { CalendarDays, Camera, ClipboardList, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const accountItems = [
  { label: "Hồ sơ của tôi", href: "/tai-khoan", icon: UserRound },
  { label: "Lịch hẹn", href: "/tai-khoan/lich-hen", icon: CalendarDays },
  { label: "Đơn thuốc", href: "/tai-khoan/don-thuoc", icon: ClipboardList },
];

type AvatarEditor = {
  preview: string;
  disabled: boolean;
  onChoose: () => void;
};

const AccountAvatarEditorContext = createContext<{
  setAvatarEditor: Dispatch<SetStateAction<AvatarEditor | null>>;
} | null>(null);

export function useAccountAvatarEditor() {
  const context = useContext(AccountAvatarEditorContext);
  if (!context) {
    throw new Error("useAccountAvatarEditor must be used within AccountShell");
  }
  return context;
}

export function AccountShell({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const pathname = usePathname();
  const [avatarEditor, setAvatarEditor] = useState<AvatarEditor | null>(null);

  if (!session) return null;

  return (
    <AccountAvatarEditorContext.Provider value={{ setAvatarEditor }}>
      <div className="container-shell py-8 sm:py-12">
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="self-start border border-t-4 border-t-primary bg-card p-4 lg:sticky lg:top-32 lg:p-5">
            <div className="flex items-center gap-4 border-b pb-4 lg:flex-col lg:text-center">
              <AccountAvatar
                key={avatarEditor?.preview ?? session.patientProfile.avatar}
                avatar={avatarEditor?.preview ?? session.patientProfile.avatar}
                name={session.patientProfile.name}
                disabled={avatarEditor?.disabled}
                onChoose={avatarEditor?.onChoose}
              />
              <div className="min-w-0">
                <p className="truncate font-bold lg:text-lg">
                  {session.patientProfile.name}
                </p>
              <p className="mt-1 text-sm text-muted-foreground">
                  {getMedicalCodeLabel(session.patientProfile.medicalCode)}
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
    </AccountAvatarEditorContext.Provider>
  );
}

function AccountAvatar({
  avatar,
  name,
  disabled,
  onChoose,
}: {
  avatar: string;
  name: string;
  disabled?: boolean;
  onChoose?: () => void;
}) {
  const [hasError, setHasError] = useState(false);
  const source = getAvatarUrl(avatar);

  const avatarContent = (
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground">
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
      {onChoose ? (
        <span className="absolute inset-x-0 bottom-0 flex h-9 items-center justify-center bg-foreground/65 text-background">
          <Camera aria-hidden="true" className="size-4" />
          <span className="sr-only">Chọn ảnh đại diện</span>
        </span>
      ) : null}
    </div>
  );

  return onChoose ? (
    <button
      type="button"
      disabled={disabled}
      aria-label="Chọn ảnh đại diện từ máy"
      className="size-20 shrink-0 rounded-full border-4 border-primary/10 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 lg:size-28"
      onClick={onChoose}
    >
      {avatarContent}
    </button>
  ) : (
    <div className="size-20 shrink-0 rounded-full border-4 border-primary/10 lg:size-28">
      {avatarContent}
    </div>
  );
}

function getAvatarUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.protocol === "blob:"
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

function getMedicalCodeLabel(value: string) {
  const cardCode = value.trim().split("|")[0] ?? "";
  return /^[A-Z]{2}[1-5]\d{12}$/.test(cardCode) ? cardCode.slice(2) : cardCode;
}
