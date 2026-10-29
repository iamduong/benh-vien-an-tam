import type AxiosMockAdapter from "axios-mock-adapter";

import { mockDoctors } from "@/data/mocks/doctors";
import { mockAccounts } from "@/data/mocks/accounts";
import { mockHospitals } from "@/data/mocks/hospitals";
import type {
  DoctorProfileResponse,
  UpdateDoctorProfilePayload,
} from "@/types/doctor-profile";
import type { ApiResponse } from "@/lib/http/response";

// Mock storage for updated doctor profiles
const updatedProfilesMap = new Map<string, Partial<DoctorProfileResponse>>();

// Helper function to get a sample account UUID from authenticated request
// In a real scenario, this would be extracted from the JWT token
function getMockAccountUuid(): string {
  // For demo purposes, return the first doctor's account
  return mockDoctors[0]?.accountUuid || "2a9a4604-aa8a-4f39-84ea-f6cb613884be";
}

// Helper function to build a DoctorProfileResponse
function buildDoctorProfileResponse(
  accountUuid: string
): DoctorProfileResponse | null {
  const doctor = mockDoctors.find((d) => d.accountUuid === accountUuid);
  if (!doctor) {
    return null;
  }

  const hospital = mockHospitals.find((h) => h.uuid === doctor.hospitalUuid);
  const account = mockAccounts.find((a) => a.uuid === accountUuid);

  // Get updated profile data if it exists
  const updatedData = updatedProfilesMap.get(accountUuid) || {};

  return {
    uuid: doctor.uuid,
    name: updatedData.name ?? doctor.name,
    specialty: updatedData.specialty ?? doctor.specialty,
    workplace: updatedData.workplace ?? doctor.workplace,
    introduction: updatedData.introduction ?? doctor.introduction,
    expertise: updatedData.expertise ?? doctor.expertise,
    hospitalName: hospital?.name ?? "Chưa phân công",
    departmentDisplay: updatedData.departmentDisplay ?? doctor.departmentDisplay ?? "Chưa phân công",
    price: doctor.price,
    accountStatus: account?.status ?? "Active",
  };
}

export function registerDoctorProfileRoutes(mock: AxiosMockAdapter) {
  // GET /doctor-profile/me - Get authenticated doctor's profile
  mock.onGet("/doctor-profile/me").reply((config) => {
    const accountUuid = getMockAccountUuid();

    const profileData = buildDoctorProfileResponse(accountUuid);

    if (!profileData) {
      return [
        404,
        {
          data: null,
          message: "Không tìm thấy hồ sơ bác sĩ.",
        } as ApiResponse<null>,
      ];
    }

    return [
      200,
      {
        data: profileData,
        message: "Lấy hồ sơ bác sĩ thành công.",
      } as ApiResponse<DoctorProfileResponse>,
    ];
  });

  // PUT /doctor-profile/me - Update authenticated doctor's profile
  mock.onPut("/doctor-profile/me").reply((config) => {
    const accountUuid = getMockAccountUuid();

    try {
      const payload: UpdateDoctorProfilePayload = JSON.parse(config.data);

      // Validate required fields
      if (!payload.name?.trim()) {
        return [
          400,
          {
            data: null,
            message: "Họ và tên không được để trống.",
          } as ApiResponse<null>,
        ];
      }

      if (!payload.specialty?.trim()) {
        return [
          400,
          {
            data: null,
            message: "Chuyên môn không được để trống.",
          } as ApiResponse<null>,
        ];
      }

      if (!payload.workplace?.trim()) {
        return [
          400,
          {
            data: null,
            message: "Nơi làm việc không được để trống.",
          } as ApiResponse<null>,
        ];
      }

      if (!payload.introduction?.trim()) {
        return [
          400,
          {
            data: null,
            message: "Giới thiệu không được để trống.",
          } as ApiResponse<null>,
        ];
      }

      if (!payload.expertise?.trim()) {
        return [
          400,
          {
            data: null,
            message: "Kinh nghiệm và chuyên môn không được để trống.",
          } as ApiResponse<null>,
        ];
      }

      // Store updated profile
      updatedProfilesMap.set(accountUuid, payload);

      return [
        200,
        {
          data: { message: "Cập nhật hồ sơ bác sĩ thành công." },
          message: "Cập nhật thành công.",
        } as ApiResponse<{ message: string }>,
      ];
    } catch (error) {
      return [
        400,
        {
          data: null,
          message: "Dữ liệu không hợp lệ.",
        } as ApiResponse<null>,
      ];
    }
  });
}
