import { httpClient } from "@/lib/http/client";
import type { ApiResponse, PaginatedData } from "@/lib/http/response";
import { RoomStatus, type Guid, type Room } from "@/types/models";

export type RoomListQuery = {
  page?: number;
  pageSize?: number;
  status?: RoomStatus;
  search?: string;
  includeDeleted?: boolean;
};

export type CreateRoomRequest = {
  name: string;
  status?: RoomStatus;
};

export type UpdateRoomRequest = {
  name: string;
  status?: RoomStatus;
};

type RoomApiDto = {
  uuid: Guid;
  name: string;
  status: RoomStatus;
  hospitalUuid: Guid | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type RoomListApiResponse = {
  message: string;
  data: RoomApiDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type RoomApiResponse = {
  message: string;
  data: RoomApiDto;
};

export class RoomService {
  async getAll(
    hospitalUuid: Guid,
    query: RoomListQuery = {},
    signal?: AbortSignal,
  ): Promise<ApiResponse<PaginatedData<Room>>> {
    const response = await httpClient.get<RoomListApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/rooms`,
      { params: query, signal },
    );

    return {
      message: response.data.message,
      data: {
        Items: response.data.data.map((room) =>
          toRoom(room, hospitalUuid),
        ),
        Page: response.data.pagination.page,
        PageSize: response.data.pagination.pageSize,
        TotalItems: response.data.pagination.totalCount,
        TotalPages: response.data.pagination.totalPages,
      },
    };
  }

  async getByUuid(
    hospitalUuid: Guid,
    roomUuid: Guid,
  ): Promise<ApiResponse<Room>> {
    const response = await httpClient.get<RoomApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/rooms/${encodeURIComponent(roomUuid)}`,
    );

    return {
      message: response.data.message,
      data: toRoom(response.data.data, hospitalUuid),
    };
  }

  async create(
    hospitalUuid: Guid,
    request: CreateRoomRequest,
  ): Promise<ApiResponse<Room>> {
    const response = await httpClient.post<RoomApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/rooms`,
      {
        name: request.name,
        status: request.status,
      },
    );

    return {
      message: response.data.message,
      data: toRoom(response.data.data, hospitalUuid),
    };
  }

  async update(
    hospitalUuid: Guid,
    roomUuid: Guid,
    request: UpdateRoomRequest,
  ): Promise<ApiResponse<Room>> {
    const response = await httpClient.put<RoomApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/rooms/${encodeURIComponent(roomUuid)}`,
      {
        name: request.name,
        status: request.status,
      },
    );

    return {
      message: response.data.message,
      data: toRoom(response.data.data, hospitalUuid),
    };
  }

  async delete(hospitalUuid: Guid, roomUuid: Guid): Promise<void> {
    await httpClient.delete(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/rooms/${encodeURIComponent(roomUuid)}`,
    );
  }

  async restore(
    hospitalUuid: Guid,
    roomUuid: Guid,
  ): Promise<ApiResponse<Room>> {
    const response = await httpClient.post<RoomApiResponse>(
      `/hospitals/${encodeURIComponent(hospitalUuid)}/rooms/${encodeURIComponent(roomUuid)}/restore`,
    );

    return {
      message: response.data.message,
      data: toRoom(response.data.data, hospitalUuid),
    };
  }
}

function toRoom(room: RoomApiDto, hospitalUuid: Guid): Room {
  return {
    uuid: room.uuid,
    name: room.name,
    status: room.status,
    hospitalUuid: room.hospitalUuid ?? hospitalUuid,
    createdAt: new Date(room.createdAt),
    updatedAt: new Date(room.updatedAt),
    deletedAt: room.deletedAt ? new Date(room.deletedAt) : new Date(0),
  };
}

export const roomService = new RoomService();
