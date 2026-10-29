import { AccessScope, BaseStatus, ROLE_UUIDS, type Role } from "@/types/models";

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const notDeleted = new Date(0);

export const mockRoles: Role[] = [
  [ROLE_UUIDS.SYSTEM_ADMIN, "Quản trị hệ thống", "Quản lý cấu hình và dữ liệu dùng chung.", false],
  [ROLE_UUIDS.HOSPITAL_ADMIN, "Quản trị chi nhánh", "Điều phối hoạt động trong phạm vi chi nhánh.", false],
  [ROLE_UUIDS.DOCTOR, "Bác sĩ", "Khám chữa bệnh và quản lý lịch chuyên môn.", true],
  [ROLE_UUIDS.STAFF, "Tiếp nhận", "Tiếp nhận và điều phối người bệnh.", false],
  [ROLE_UUIDS.WAREHOUSE_MANAGER, "Quản lý kho", "Quản lý thuốc và hoạt động nhập xuất.", false],
  [ROLE_UUIDS.PATIENT, "Người bệnh", "Sử dụng các chức năng dành cho người bệnh.", false],
].map(([Uuid, Name, Description, IsDoctor]) => ({
  uuid: Uuid as string,
  name: Name as string,
  description: Description as string,
  isDoctor: IsDoctor as boolean,
  scope: Uuid === ROLE_UUIDS.SYSTEM_ADMIN ? AccessScope.System : AccessScope.Hospital,
  status: BaseStatus.Active,
  createdAt: createdAt,
  updatedAt: createdAt,
  deletedAt: notDeleted,
}));
