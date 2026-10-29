import type { AuthField, LoginRequest, RegisterPatientRequest } from "@/types/auth";

export type AuthFieldErrors = Partial<Record<AuthField, string>>;

const phonePattern = /^(?:0|\+84)(?:3|5|7|8|9)\d{8}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePhone(phone: string) {
  return phone.replace(/[\s.-]/g, "");
}

export function validateLogin(values: LoginRequest): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!phonePattern.test(normalizePhone(values.phone))) {
    errors.phone = "Nhập số điện thoại Việt Nam hợp lệ.";
  }

  if (!values.password) {
    errors.password = "Nhập mật khẩu.";
  }

  return errors;
}

export function validateRegistration(values: RegisterPatientRequest): AuthFieldErrors {
  const errors = validateLogin(values);

  if (values.password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
  } else if (
    !/[A-Za-z]/.test(values.password) ||
    !/\d/.test(values.password)
  ) {
    errors.password = "Mật khẩu phải có cả chữ và số.";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu nhập lại chưa khớp.";
  }

  if (values.name.trim().length < 2) {
    errors.name = "Nhập họ tên có ít nhất 2 ký tự.";
  }

  if (!values.gender) {
    errors.gender = "Chọn giới tính.";
  }

  const birthdate = new Date(`${values.birthdate}T00:00:00`);
  if (
    Number.isNaN(birthdate.getTime()) ||
    birthdate >= new Date(new Date().setHours(0, 0, 0, 0))
  ) {
    errors.birthdate = "Ngày sinh phải trước ngày hiện tại.";
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Nhập địa chỉ email hợp lệ.";
  }

  return errors;
}
