import axios from "axios";

import { httpClient } from "@/lib/http/client";
import type { ApiResponse } from "@/lib/http/response";
import type {
  Appointment,
  AppointmentConfirmation,
  AppointmentErrorResponse,
  AppointmentList,
  AppointmentListQuery,
  AppointmentPresentation,
  Availability,
  BookingContext,
  BookingType,
  CreateAppointmentRequest,
  CreateWalkInAppointmentRequest,
  RescheduleAppointmentRequest,
} from "@/types/appointments";

export class AppointmentServiceError extends Error {
  constructor(
    message: string,
    public readonly code = "UNKNOWN",
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AppointmentServiceError";
  }
}

function toAppointmentError(error: unknown) {
  if (axios.isAxiosError<AppointmentErrorResponse>(error)) {
    return new AppointmentServiceError(
      error.response?.data?.message ??
        "Không thể kết nối đến hệ thống. Vui lòng thử lại.",
      error.response?.data?.code,
      error.response?.status,
    );
  }
  return new AppointmentServiceError("Đã xảy ra lỗi. Vui lòng thử lại.");
}

export class AppointmentService {
  async getAll(query: AppointmentListQuery, signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<AppointmentList>>(
        "/appointments",
        { params: query, signal },
      );
      return {
        ...response.data,
        data: {
          ...response.data.data,
          Items: response.data.data.Items.map(hydratePresentation),
        },
      };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async getBookingContext(signal?: AbortSignal) {
    try {
      const response = await httpClient.get<ApiResponse<BookingContext>>(
        "/appointments/booking-context",
        { signal },
      );
      return response.data;
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async getAvailability(
    query: {
      type: BookingType;
      targetUuid: string;
      hospitalUuid: string;
      accountUuid: string;
      date: string;
    },
    signal?: AbortSignal,
  ) {
    try {
      const response = await httpClient.get<ApiResponse<Availability>>(
        "/appointments/availability",
        { params: query, signal },
      );
      return response.data;
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async create(request: CreateAppointmentRequest) {
    try {
      const { type, ...payload } = request;
      const endpoint =
        type === "hospital"
          ? "hospitals"
          : type === "doctor"
            ? "doctors"
            : "medical-services";
      const response = await httpClient.post<ApiResponse<Appointment>>(
        `/appointments/${endpoint}`,
        payload,
      );
      return {
        ...response.data,
        data: hydrateAppointment(response.data.data),
      };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async createWalkIn(request: CreateWalkInAppointmentRequest) {
    try {
      const response = await httpClient.post<ApiResponse<Appointment>>(
        "/appointments/walk-in",
        request,
      );
      return {
        ...response.data,
        data: hydrateAppointment(response.data.data),
      };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async getWalkInAvailability(
    query: {
      type: BookingType;
      targetUuid: string;
      hospitalUuid: string;
      date: string;
    },
    signal?: AbortSignal,
  ) {
    try {
      const response = await httpClient.get<ApiResponse<Availability>>(
        "/appointments/walk-in/availability",
        { params: query, signal },
      );
      return response.data;
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async getConfirmation(
    appointmentUuid: string,
    accountUuid: string,
    signal?: AbortSignal,
  ) {
    try {
      const response = await httpClient.get<
        ApiResponse<AppointmentConfirmation>
      >(`/appointments/${encodeURIComponent(appointmentUuid)}`, {
        params: { accountUuid },
        signal,
      });
      return {
        ...response.data,
        data: {
          ...response.data.data,
          appointment: hydrateAppointment(response.data.data.appointment),
        },
      };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async getDetail(
    appointmentUuid: string,
    accountUuid: string,
    signal?: AbortSignal,
  ) {
    try {
      const response = await httpClient.get<ApiResponse<AppointmentPresentation>>(
        `/appointments/${encodeURIComponent(appointmentUuid)}/detail`,
        { params: { accountUuid }, signal },
      );
      return { ...response.data, data: hydratePresentation(response.data.data) };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async reschedule(
    appointmentUuid: string,
    request: RescheduleAppointmentRequest,
  ) {
    try {
      const response = await httpClient.post<ApiResponse<AppointmentPresentation>>(
        `/appointments/${encodeURIComponent(appointmentUuid)}/reschedule`,
        request,
      );
      return { ...response.data, data: hydratePresentation(response.data.data) };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }

  async cancel(appointmentUuid: string, accountUuid: string) {
    try {
      const response = await httpClient.post<ApiResponse<AppointmentPresentation>>(
        `/appointments/${encodeURIComponent(appointmentUuid)}/cancel`,
        { accountUuid: accountUuid },
      );
      return { ...response.data, data: hydratePresentation(response.data.data) };
    } catch (error) {
      throw toAppointmentError(error);
    }
  }
}

function hydrateAppointment<T extends Appointment>(appointment: T): T {
  return {
    ...appointment,
    appointmentAt: new Date(appointment.appointmentAt),
    createdAt: new Date(appointment.createdAt),
    updatedAt: new Date(appointment.updatedAt),
  };
}

function hydratePresentation<T extends AppointmentPresentation>(item: T): T {
  return {
    ...item,
    appointment: hydrateAppointment(item.appointment),
  };
}

export const appointmentService = new AppointmentService();
