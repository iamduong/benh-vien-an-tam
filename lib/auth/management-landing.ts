import { AccessScope } from "@/types/models";

type ManagementRoleSession = {
  role: {
    name: string;
    isDoctor: boolean;
    scope: AccessScope;
  };
};

export function getManagementLanding(session: ManagementRoleSession) {
  const roleName = normalizeRoleName(session.role.name);

  if (session.role.isDoctor || includesAny(roleName, "doctor", "bac si")) {
    return "/noi-bo/trang-tong/tong-quan-bac-si";
  }
  if (includesAny(roleName, "warehouse", "inventory", "kho")) {
    return "/noi-bo/trang-tong/tong-quan-kho";
  }
  if (includesAny(roleName, "reception", "staff", "tiep nhan")) {
    return "/noi-bo/trang-tong/tong-quan-tiep-nhan";
  }
  if (
    session.role.scope === AccessScope.System ||
    includesAny(roleName, "system", "he thong")
  ) {
    return "/noi-bo/trang-tong/tong-quan-he-thong";
  }

  return "/noi-bo/trang-tong/tong-quan-chi-nhanh";
}

function normalizeRoleName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLocaleLowerCase("vi-VN");
}

function includesAny(value: string, ...keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}
