import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type {
  AuthErrorResponse,
  AuthField,
  AuthApiSession,
  AuthLoginResult,
  AuthSession,
  LoginRequest,
  RegisterPatientRequest,
} from "@/types/auth";
import { BaseStatus, Gender, type PatientProfile, type Account } from "@/types/models";

export const AUTH_SESSION_STORAGE_KEY = "BV_ANTAM_SESSION";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Partial<Record<AuthField, string>> = {},
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

function toAuthError(error: unknown) {
  if (error instanceof AuthServiceError) {
    return error;
  }

  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    const response = error.response?.data;
    const errors = response?.errors ?? response?.errors ?? {};
    const fieldErrors = Object.fromEntries(
      Object.entries(errors).map(([field, messages]) => [
        field,
        Array.isArray(messages) ? messages[0] : messages,
      ]),
    ) as Partial<Record<AuthField, string>>;

    return new AuthServiceError(
      response?.message ??
        "Không thể kết nối đến hệ thống. Vui lòng thử lại.",
      fieldErrors,
    );
  }

  return new AuthServiceError("Đã xảy ra lỗi. Vui lòng thử lại.");
}

type ApiEnvelope<T> = {
  data?: T;
};

type RegisterResultResponse = {
  accountUuid: string | null;
  patientProfileUuid: string | null;
  email: string | null;
};

function mapSession(response: AuthApiSession): AuthLoginResult {
  const { account, profile, role } = response;
  const mappedAccount = mapAccount(account);

  if (role) {
    return {
      type: "management",
      session: { ...response, role },
    };
  }

  if (profile.type !== "patient") {
    throw new AuthServiceError(
      "Tài khoản chưa được gán vai trò quản lý hợp lệ.",
    );
  }

  return {
    type: "patient",
    apiSession: response,
    session: {
      account: mappedAccount,
      patientProfile: {
        uuid: profile.uuid,
        accountUuid: profile.accountUuid,
        avatar: profile.avatar,
        name: profile.name,
        gender: mapGender(profile.gender),
        birthdate: new Date(profile.birthdate),
        medicalCode: profile.medicalCode,
        email: profile.email,
      },
    },
  };
}

function mapAccount(account: AuthApiSession["account"]): Omit<Account, "password"> {
  return {
    uuid: account.uuid,
    phone: account.phone,
    roleUuid: account.roleUuid ?? "",
    status: mapBaseStatus(account.status),
    hospitalUuid: account.hospitalUuid,
    createdAt: new Date(account.createdAt),
    updatedAt: new Date(account.updatedAt),
    deletedAt: account.deletedAt ? new Date(account.deletedAt) : new Date(0),
  };
}

function mapBaseStatus(status: string | number): BaseStatus {
  if (status === 0) return BaseStatus.Active;
  if (status === 1) return BaseStatus.InActive;
  return status as BaseStatus;
}

function mapGender(gender: Gender | number): Gender {
  if (gender === 0) return Gender.Other;
  if (gender === 1) return Gender.Male;
  if (gender === 2) return Gender.Female;
  return gender as Gender;
}

function hydrateLoginResult(value: string): AuthLoginResult | null {
  try {
    const session = JSON.parse(value) as AuthApiSession;
    if (!session.account?.uuid || !session.profile?.type) return null;
    if (mapBaseStatus(session.account.status) !== BaseStatus.Active) return null;
    return mapSession(session);
  } catch {
    return null;
  }
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthLoginResult> {
    try {
      const response = await httpClient.post<
        ApiEnvelope<AuthApiSession>
      >("/auth/login", credentials);
      const payload = response.data.data;
      if (!payload) {
        throw new AuthServiceError("Dữ liệu phiên đăng nhập không hợp lệ.");
      }
      const result = mapSession(payload);
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(payload));
      return result;
    } catch (error) {
      throw toAuthError(error);
    }
  }

  async register(request: RegisterPatientRequest): Promise<void> {
    try {
      await httpClient.post<ApiEnvelope<RegisterResultResponse>>(
        "/auth/register",
        request,
      );
    } catch (error) {
      throw toAuthError(error);
    }
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const response = await httpClient.post<ApiEnvelope<AuthApiSession>>(
        "/auth/refresh",
      );
      const payload = response.data.data;
      if (!payload) {
        throw new AuthServiceError("Dữ liệu phiên đăng nhập không hợp lệ.");
      }

      const result = mapSession(payload);
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(payload));
      return result.type === "patient" ? result.session : null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        return null;
      }
      throw toAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post<ApiResponse<null>>("/auth/logout");
    } catch (error) {
      throw toAuthError(error);
    } finally {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
  }

  persistPatientProfile(profile: PatientProfile) {
    const storedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!storedSession) return;
    const result = hydrateLoginResult(storedSession);
    if (
      !result ||
      result.type !== "patient" ||
      result.session.account.uuid !== profile.accountUuid
    ) return;
    const apiSession: AuthApiSession = {
      ...result.apiSession,
      profile: {
        type: "patient",
        uuid: profile.uuid,
        accountUuid: profile.accountUuid,
        avatar: profile.avatar,
        name: profile.name,
        gender: profile.gender,
        birthdate: profile.birthdate.toISOString(),
        medicalCode: profile.medicalCode,
        email: profile.email,
      },
    };
    localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify(apiSession),
    );
  }

  getStoredLoginResult(): AuthLoginResult | null {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return value ? hydrateLoginResult(value) : null;
  }
}

export const authService = new AuthService();
