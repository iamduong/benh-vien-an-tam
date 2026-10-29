"use client";

import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LogOut,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PatientProfile } from "@/types/models";

export function AccountMenu({
  profile,
  isLoggingOut,
  onLogout,
}: {
  profile: PatientProfile;
  isLoggingOut: boolean;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 max-w-52 gap-2 rounded-md border-primary/20 bg-secondary/60 py-1 pr-2 pl-1"
            aria-label={`Mở menu tài khoản của ${profile.name}`}
          />
        }
      >
        <AccountAvatar
          key={profile.avatar}
          avatar={profile.avatar}
          name={profile.name}
        />
        <span className="max-w-28 truncate font-semibold">{profile.name}</span>
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block truncate font-semibold text-foreground">
            {profile.name}
          </span>
          <span className="mt-0.5 block font-normal">{profile.medicalCode}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link href="/tai-khoan" />}>
          <UserRound aria-hidden="true" />Hồ sơ của tôi
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/tai-khoan/lich-hen" />}>
          <CalendarDays aria-hidden="true" />Lịch hẹn
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/tai-khoan/don-thuoc" />}>
          <ClipboardList aria-hidden="true" />Đơn thuốc
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isLoggingOut}
          className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
          onClick={onLogout}
        >
          <LogOut aria-hidden="true" />
          {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountAvatar({ avatar, name }: { avatar: string; name: string }) {
  const [hasImageError, setHasImageError] = useState(false);
  const avatarUrl = getAvatarUrl(avatar);

  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {avatarUrl && !hasImageError ? (
        <Image
          src={avatarUrl}
          alt={`Ảnh đại diện của ${name}`}
          fill
          unoptimized
          sizes="32px"
          className="object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
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
