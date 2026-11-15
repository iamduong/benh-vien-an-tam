import type { BaseStatus, Guid } from "@/types/models";

/**
 * Dữ liệu response cho trang Hồ sơ nghề nghiệp (Internal)
 */
export type DoctorProfileResponse = {
    uuid: Guid;
    avatar: string;
    name: string;
    specialty: string;
    workplace: string;
    introduction: string;
    expertise: string;
    hospitalName: string;
    departmentDisplay: string;
    accountStatus: BaseStatus | string;
};

/**
 * Payload gửi lên khi Cập nhật Hồ sơ nghề nghiệp (Internal)
 */
export type UpdateDoctorProfilePayload = {
    avatar: string;
    name: string;
    specialty: string;
    workplace: string;
    introduction: string;
    expertise: string;
};
