import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type {
  PaymentApiErrorResponse,
  PaymentEndpointQuery,
  ResultEndpoint,
} from "@/types/payment";

type RawResultEndpoint = Partial<ResultEndpoint> & {
  errorMessage?: string | null;
};

type PaymentResponse = {
  data?: RawResultEndpoint;
};

export class PaymentServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "PaymentServiceError";
  }
}

function readErrorMessage(response?: PaymentApiErrorResponse) {
  return (
    response?.errors?.errorMessage ??
    response?.message
  );
}

function toPaymentError(error: unknown) {
  if (error instanceof PaymentServiceError) return error;

  if (axios.isAxiosError<PaymentApiErrorResponse>(error)) {
    return new PaymentServiceError(
      readErrorMessage(error.response?.data) ??
        "Không thể kiểm tra thông tin thanh toán. Vui lòng thử lại.",
      error.response?.status,
    );
  }

  return new PaymentServiceError(
    "Đã xảy ra lỗi khi kiểm tra giao dịch. Vui lòng thử lại.",
  );
}

function normalizeResult(payload: RawResultEndpoint): ResultEndpoint {
  const result: ResultEndpoint = {
    isValid: payload.isValid ?? false,
    errorMessage: payload.errorMessage ?? null,
    orderUuid: payload.orderUuid ?? "",
    type: payload.type ?? "",
    amount: payload.amount ?? 0,
    content: payload.content ?? "",
    payUrl: payload.payUrl ?? "",
    expiresAt: payload.expiresAt ?? "",
  };

  if (
    !result.isValid ||
    !result.orderUuid ||
    !result.content ||
    !result.payUrl ||
    !result.expiresAt ||
    !Number.isFinite(result.amount)
  ) {
    throw new PaymentServiceError(
      result.errorMessage ?? "Dữ liệu thanh toán không hợp lệ.",
    );
  }

  return result;
}

export class PaymentService {
  async checkEndpoint(query: PaymentEndpointQuery, signal?: AbortSignal) {
    try {
      const response = await httpClient.get<PaymentResponse>(
        "/payment/check-endpoint",
        {
          params: {
            orderId: query.orderId,
            amount: query.amount,
            orderInfo: query.orderInfo,
            type: query.type,
            expiresAt: query.expiresAt,
            signature: query.signature,
          },
          signal,
        },
      );
      const payload = response.data.data ?? response.data.data;

      if (!payload) {
        throw new PaymentServiceError("Dữ liệu thanh toán không hợp lệ.");
      }

      return normalizeResult(payload);
    } catch (error) {
      throw toPaymentError(error);
    }
  }
}

export const paymentService = new PaymentService();
