import type AxiosMockAdapter from "axios-mock-adapter";

import { mockAccounts } from "@/data/mocks/accounts";
import { mockPatientProfiles } from "@/data/mocks/patient-profiles";
import type {
  AuthSession,
  LoginRequest,
  PublicAccount,
  RegisterPatientRequest,
} from "@/types/auth";
import { BaseStatus, ROLE_UUIDS, type Account } from "@/types/models";

function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, "");
}

function toPublicAccount(account: Account): PublicAccount {
  return {
    uuid: account.uuid,
    phone: account.phone,
    roleUuid: account.roleUuid,
    status: account.status,
    hospitalUuid: account.hospitalUuid,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    deletedAt: account.deletedAt,
  };
}

function parseBody<T>(data: unknown): T {
  return typeof data === "string" ? (JSON.parse(data) as T) : (data as T);
}

export function registerAuthRoutes(mock: AxiosMockAdapter) {
  mock.onPost("/auth/login").reply((config) => {
    const credentials = parseBody<LoginRequest>(config.data);
    const phone = normalizePhone(credentials.phone);
    const account = mockAccounts.find(
      (candidate) => normalizePhone(candidate.phone) === phone,
    );

    if (!account || account.password !== credentials.password) {
      return [401, { message: "Số điện thoại hoặc mật khẩu không đúng." }];
    }

    if (account.status === BaseStatus.InActive) {
      return [403, { message: "Tài khoản đã bị vô hiệu hóa." }];
    }

    if (account.roleUuid !== ROLE_UUIDS.PATIENT) {
      return [403, { message: "Tài khoản không thuộc phạm vi người bệnh." }];
    }

    const profile = mockPatientProfiles.find(
      (candidate) => candidate.accountUuid === account.uuid,
    );

    if (!profile) {
      return [409, { message: "Tài khoản chưa có hồ sơ người bệnh hợp lệ." }];
    }

    const session: AuthSession = {
      account: toPublicAccount(account),
      patientProfile: profile,
    };

    return [200, { data: session, message: "Đăng nhập thành công." }];
  });

  mock.onPost("/auth/register").reply((config) => {
    const request = parseBody<RegisterPatientRequest>(config.data);
    const phone = normalizePhone(request.phone);

    if (
      mockAccounts.some(
        (candidate) => normalizePhone(candidate.phone) === phone,
      )
    ) {
      return [
        409,
        {
          message: "Không thể tạo tài khoản.",
          errors: { phone: "Số điện thoại đã được sử dụng." },
        },
      ];
    }

    const now = new Date();
    const accountUuid = crypto.randomUUID();
    const account: Account = {
      uuid: accountUuid,
      phone: phone,
      password: request.password,
      roleUuid: ROLE_UUIDS.PATIENT,
      status: BaseStatus.Active,
      hospitalUuid: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: new Date(0),
    };
    const profile = {
      uuid: crypto.randomUUID(),
      avatar: "",
      name: request.name.trim(),
      gender: request.gender,
      birthdate: new Date(`${request.birthdate}T00:00:00`),
      medicalCode: `BN${Date.now().toString().slice(-8)}`,
      email: request.email.trim().toLowerCase(),
      accountUuid: accountUuid,
    };

    mockAccounts.push(account);
    mockPatientProfiles.push(profile);

    return [201, { data: null, message: "Đăng ký tài khoản thành công." }];
  });

  mock.onPost("/auth/logout").reply(200, {
    data: null,
    message: "Đăng xuất thành công.",
  });
}
