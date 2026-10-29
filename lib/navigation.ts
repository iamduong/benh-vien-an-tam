export type NavigationItem = {
  label: string;
  href: string;
};

export const publicNavigation: NavigationItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Cơ sở y tế", href: "/co-so-y-te" },
  { label: "Bác sĩ", href: "/bac-si" },
  { label: "Dịch vụ khám", href: "/dich-vu" },
  { label: "Tìm kiếm", href: "/tim-kiem" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
];

export const patientNavigation: NavigationItem[] = [
  { label: "Tài khoản", href: "/tai-khoan" },
];

const bookingNavigationAliases: Record<string, string> = {
  "/dat-lich/co-so-y-te": "/co-so-y-te",
  "/dat-lich/bac-si": "/bac-si",
  "/dat-lich/dich-vu": "/dich-vu",
};

export function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;

  return Object.entries(bookingNavigationAliases).some(
    ([bookingPath, navigationHref]) =>
      navigationHref === href &&
      (pathname === bookingPath || pathname.startsWith(`${bookingPath}/`)),
  );
}
