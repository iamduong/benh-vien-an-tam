import type AxiosMockAdapter from "axios-mock-adapter";

import { mockHospitals } from "@/data/mocks/hospitals";
import { mockAppointments } from "@/data/mocks/appointments";
import { mockRooms } from "@/data/mocks/rooms";
import {
  getPositiveIntegerParam,
  getStringParam,
  matchesKeyword,
} from "@/lib/mocks/query-utils";
import {
  AppointmentStatus,
  RoomStatus,
  type Room,
} from "@/types/models";

type RoomCreatePayload = {
  name?: unknown;
  status?: unknown;
};

type RoomQueryParams = Record<string, unknown> | undefined;

const rooms: Room[] = mockRooms.map((room) => ({
  ...room,
  createdAt: new Date(room.createdAt.getTime()),
  updatedAt: new Date(room.updatedAt.getTime()),
  deletedAt: new Date(room.deletedAt.getTime()),
}));

export function registerRoomRoutes(mock: AxiosMockAdapter) {
  mock.onGet(/^\/hospitals\/[^/]+\/rooms$/).reply((config) => {
    const hospitalUuid = getHospitalUuid(config.url);
    if (!hospitalExists(hospitalUuid)) return notFound("Hospital not found");

    const status = getStringParam(config.params, "status");
    const search = getStringParam(config.params, "search");
    const rawIncludeDeleted = config.params?.includeDeleted;
    if (
      rawIncludeDeleted !== undefined &&
      rawIncludeDeleted !== true &&
      rawIncludeDeleted !== false &&
      rawIncludeDeleted !== "true" &&
      rawIncludeDeleted !== "false"
    ) {
      return [400, { message: "includeDeleted must be true or false." }];
    }
    if (status && !isRoomStatus(status)) {
      return [400, { message: "Room status is invalid." }];
    }
    const includeDeleted = getBooleanParam(config.params, "includeDeleted");
    const page = getPositiveIntegerParam(config.params, "page", 1);
    const pageSize = Math.min(
      getPositiveIntegerParam(config.params, "pageSize", 20),
      100,
    );
    const filtered = rooms
      .filter(
        (room) =>
          room.hospitalUuid === hospitalUuid &&
          (includeDeleted || room.deletedAt.getTime() === 0) &&
          (!status || room.status === status) &&
          matchesKeyword(search, room.name, room.uuid),
      )
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);

    return [
      200,
      {
        message: "Fetched successfully",
        data: items.map(toRoomDto),
        pagination: { page, pageSize, totalCount, totalPages },
      },
    ];
  });

  mock
    .onGet(/^\/hospitals\/[^/]+\/rooms\/[^/]+$/)
    .reply((config) => {
      const [hospitalUuid, roomUuid] = getRoomRouteIds(config.url);
      const room = rooms.find(
        (item) =>
          item.uuid === roomUuid &&
          item.hospitalUuid === hospitalUuid &&
          item.deletedAt.getTime() === 0,
      );

      return room
        ? [200, { message: "Fetched successfully", data: toRoomDto(room) }]
        : notFound("Room not found");
    });

  mock.onPost(/^\/hospitals\/[^/]+\/rooms$/).reply((config) => {
    const hospitalUuid = getHospitalUuid(config.url);
    const hospital = mockHospitals.find(
      (item) => item.uuid === hospitalUuid && item.deletedAt.getTime() === 0,
    );
    if (!hospital) return notFound("Hospital not found");

    const request = parsePayload(config.data);
    if (!isValidRoomPayload(request, true)) {
      return [400, { message: "Room name must contain 1 to 100 characters." }];
    }

    if (getActiveRoomCount(hospitalUuid) >= hospital.numberOfRoom) {
      return capacityConflict();
    }

    const now = new Date();
    const room: Room = {
      uuid: crypto.randomUUID(),
      name: request.name.trim(),
      status: request.status ?? RoomStatus.Available,
      hospitalUuid: hospitalUuid,
      createdAt: now,
      updatedAt: now,
      deletedAt: new Date(0),
    };
    rooms.push(room);

    return [
      201,
      { message: "Created successfully", data: toRoomDto(room) },
    ];
  });

  mock
    .onPut(/^\/hospitals\/[^/]+\/rooms\/[^/]+$/)
    .reply((config) => {
      const [hospitalUuid, roomUuid] = getRoomRouteIds(config.url);
      const room = rooms.find(
        (item) =>
          item.uuid === roomUuid &&
          item.hospitalUuid === hospitalUuid &&
          item.deletedAt.getTime() === 0,
      );

      if (!room) return notFound("Room not found");

      const request = parsePayload(config.data);
      if (!isValidRoomPayload(request, false)) {
        return [400, { message: "Room name must contain 1 to 100 characters." }];
      }

      if (request.status === RoomStatus.Maintenance) {
        const hasActiveAppointments = mockAppointments.some(
          (appointment) =>
            appointment.roomUuid === roomUuid &&
            appointment.hospitalUuid === hospitalUuid &&
            appointment.deletedAt.getTime() === 0 &&
            (appointment.status === AppointmentStatus.Pending ||
              appointment.status === AppointmentStatus.Approved ||
              appointment.status === AppointmentStatus.CheckedIn),
        );
        if (hasActiveAppointments) return appointmentConflict();
      }

      if (typeof request.name === "string") room.name = request.name.trim();
      if (request.status) room.status = request.status;
      room.updatedAt = new Date();

      return [
        200,
        { message: "Updated successfully", data: toRoomDto(room) },
      ];
    });

  mock
    .onDelete(/^\/hospitals\/[^/]+\/rooms\/[^/]+$/)
    .reply((config) => {
      const [hospitalUuid, roomUuid] = getRoomRouteIds(config.url);
      const room = rooms.find(
        (item) =>
          item.uuid === roomUuid &&
          item.hospitalUuid === hospitalUuid &&
          item.deletedAt.getTime() === 0,
      );

      if (!room) return notFound("Room not found");

      const hasActiveAppointments = mockAppointments.some(
        (appointment) =>
          appointment.roomUuid === roomUuid &&
          appointment.hospitalUuid === hospitalUuid &&
          appointment.deletedAt.getTime() === 0 &&
          (appointment.status === AppointmentStatus.Pending ||
            appointment.status === AppointmentStatus.Approved ||
            appointment.status === AppointmentStatus.CheckedIn),
      );
      if (hasActiveAppointments) return appointmentConflict();

      room.deletedAt = new Date();
      room.updatedAt = new Date();
      return [204];
    });

  mock
    .onPost(/^\/hospitals\/[^/]+\/rooms\/[^/]+\/restore$/)
    .reply((config) => {
      const [hospitalUuid, roomUuid] = getRoomRouteIds(config.url);
      const hospital = mockHospitals.find(
        (item) => item.uuid === hospitalUuid && item.deletedAt.getTime() === 0,
      );
      if (!hospital) return notFound("Hospital not found");

      const room = rooms.find(
        (item) =>
          item.uuid === roomUuid &&
          item.hospitalUuid === hospitalUuid &&
          item.deletedAt.getTime() !== 0,
      );
      if (!room) return notFound("Deleted room not found");
      if (getActiveRoomCount(hospitalUuid) >= hospital.numberOfRoom) {
        return capacityConflict();
      }

      room.deletedAt = new Date(0);
      room.updatedAt = new Date();

      return [
        200,
        {
          message: "Room restored successfully",
          data: toRoomDto(room),
        },
      ];
    });
}

function getHospitalUuid(url?: string) {
  return decodeURIComponent(url?.split("/")[2] ?? "");
}

function getRoomRouteIds(url?: string) {
  const parts = url?.split("/") ?? [];
  return [
    decodeURIComponent(parts[2] ?? ""),
    decodeURIComponent(parts[4] ?? ""),
  ];
}

function hospitalExists(uuid: string) {
  return mockHospitals.some(
    (hospital) =>
      hospital.uuid === uuid && hospital.deletedAt.getTime() === 0,
  );
}

function getActiveRoomCount(hospitalUuid: string) {
  return rooms.filter(
    (room) =>
      room.hospitalUuid === hospitalUuid && room.deletedAt.getTime() === 0,
  ).length;
}

function getBooleanParam(params: RoomQueryParams, key: string) {
  const value = params?.[key];
  return value === true || value === "true";
}

function parsePayload(data: unknown): RoomCreatePayload {
  return (typeof data === "string" ? JSON.parse(data) : data) as RoomCreatePayload;
}

function isValidRoomPayload(
  value: RoomCreatePayload,
  requireName: true,
): value is RoomCreatePayload & { name: string; status?: RoomStatus };
function isValidRoomPayload(
  value: RoomCreatePayload,
  requireName: false,
): value is RoomCreatePayload & { name?: string; status?: RoomStatus };
function isValidRoomPayload(
  value: RoomCreatePayload,
  requireName: boolean,
): value is RoomCreatePayload & { name?: string; status?: RoomStatus } {
  if (!value || typeof value !== "object") return false;

  const hasValidName =
    typeof value.name === "string" &&
    value.name.trim().length >= 1 &&
    value.name.trim().length <= 100;
  const hasValidStatus =
    value.status === undefined || isRoomStatus(value.status);

  return (requireName ? hasValidName : value.name === undefined || hasValidName) &&
    hasValidStatus;
}

function isRoomStatus(value: unknown): value is RoomStatus {
  return (
    typeof value === "string" &&
    Object.values(RoomStatus).some((status) => status === value)
  );
}

function toRoomDto(room: Room) {
  return {
    uuid: room.uuid,
    name: room.name,
    status: room.status,
    hospitalUuid: room.hospitalUuid,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
    deletedAt:
      room.deletedAt.getTime() === 0 ? null : room.deletedAt.toISOString(),
  };
}

function notFound(
  message: string,
): [number, { message: string; error: string }] {
  return [404, { message, error: "Resource does not exist" }];
}

function capacityConflict(): [number, { message: string; error: string }] {
  return [
    409,
    {
      message: "Hospital room capacity reached",
      error: "ROOM_CAPACITY_REACHED",
    },
  ];
}

function appointmentConflict(): [number, { message: string; error: string }] {
  return [
    409,
    {
      message: "Room has active appointments",
      error: "ROOM_HAS_ACTIVE_APPOINTMENTS",
    },
  ];
}
