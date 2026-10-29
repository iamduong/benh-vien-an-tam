import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockPatientProfiles } from "@/data/mocks/patient-profiles";
import { validatePatientProfile } from "@/lib/patient/validation";
import { BaseStatus, Gender, ROLE_UUIDS } from "@/types/models";
import type { UpdatePatientProfileRequest } from "@/types/patient";

const allowedUpdateFields = new Set([
  "avatar",
  "name",
  "gender",
  "birthdate",
  "email",
]);

export function registerPatientRoutes(mock: AxiosMockAdapter) {
  mock.onGet("/patients/me").reply((config): [number, unknown] => {
    const current = getCurrentPatient(config.headers);
    return current
      ? [
          200,
          {
            data: { profile: current.profile, phone: current.account.phone },
            message: "Lấy hồ sơ người bệnh thành công.",
          },
        ]
      : unauthorizedResponse();
  });

  mock.onPut("/patients/me").reply((config): [number, unknown] => {
    const current = getCurrentPatient(config.headers);
    if (!current) return unauthorizedResponse();

    const body = parseBody(config.data);
    if (!isUpdateRequest(body)) {
      return [422, { message: "Dữ liệu cập nhật hồ sơ không hợp lệ." }];
    }
    const errors = validatePatientProfile(body);
    if (Object.keys(errors).length) {
      return [
        422,
        { message: "Vui lòng kiểm tra lại thông tin.", errors: errors },
      ];
    }

    current.profile.avatar = body.avatar.trim();
    current.profile.name = body.name.trim();
    current.profile.gender = body.gender;
    current.profile.birthdate = new Date(body.birthdate);
    current.profile.email = body.email.trim().toLowerCase();

    return [
      200,
      {
        data: { profile: current.profile, phone: current.account.phone },
        message: "Cập nhật hồ sơ thành công.",
      },
    ];
  });
}

function getCurrentPatient(headers: unknown) {
  const accountUuid = getHeader(headers, "X-Mock-Account-Uuid");
  const account = mockAccounts.find(
    (item) =>
      item.uuid === accountUuid &&
      item.roleUuid === ROLE_UUIDS.PATIENT &&
      item.status === BaseStatus.Active,
  );
  const profile = mockPatientProfiles.find(
    (item) => item.accountUuid === account?.uuid,
  );
  return account && profile ? { account, profile } : null;
}

function isUpdateRequest(value: unknown): value is UpdatePatientProfileRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some((key) => !allowedUpdateFields.has(key))) return false;
  return (
    Object.keys(body).length === allowedUpdateFields.size &&
    typeof body.avatar === "string" &&
    typeof body.name === "string" &&
    Object.values(Gender).includes(body.gender as Gender) &&
    (typeof body.birthdate === "string" || body.birthdate instanceof Date) &&
    typeof body.email === "string"
  );
}

function parseBody(data: unknown): unknown {
  try {
    return typeof data === "string" ? (JSON.parse(data) as unknown) : data;
  } catch {
    return null;
  }
}

function getHeader(headers: unknown, name: string) {
  if (!headers || typeof headers !== "object") return "";
  const get = (headers as { get?: (key: string) => unknown }).get;
  const value =
    typeof get === "function"
      ? get.call(headers, name)
      : (headers as Record<string, unknown>)[name];
  return typeof value === "string" ? value : "";
}

function unauthorizedResponse(): [number, unknown] {
  return [403, { message: "Phiên đăng nhập không hợp lệ." }];
}
