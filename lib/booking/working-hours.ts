export type ParsedWorkingHours = {
  Days: number[];
  StartMinutes: number;
  EndMinutes: number;
};

const weekdays: Record<string, number> = {
  "Chủ Nhật": 0,
  "Thứ Hai": 1,
  "Thứ Ba": 2,
  "Thứ Tư": 3,
  "Thứ Năm": 4,
  "Thứ Sáu": 5,
  "Thứ Bảy": 6,
};

export function parseWorkingHours(value: string): ParsedWorkingHours | null {
  const match = value.match(
    /^(Chủ Nhật|Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy)(?:\s*-\s*(Chủ Nhật|Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy))?\s*,\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/,
  );
  if (!match) return null;

  const startDay = weekdays[match[1]];
  const endDay = weekdays[match[2] || match[1]];
  const startMinutes = parseTime(match[3]);
  const endMinutes = parseTime(match[4]);
  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    return null;
  }

  const days: number[] = [];
  let day = startDay;
  while (true) {
    days.push(day);
    if (day === endDay) break;
    day = (day + 1) % 7;
  }

  return { Days: days, StartMinutes: startMinutes, EndMinutes: endMinutes };
}

export function intersectWorkingHours(
  first: ParsedWorkingHours,
  second: ParsedWorkingHours,
): ParsedWorkingHours | null {
  const days = first.Days.filter((day) => second.Days.includes(day));
  const startMinutes = Math.max(first.StartMinutes, second.StartMinutes);
  const endMinutes = Math.min(first.EndMinutes, second.EndMinutes);
  if (!days.length || startMinutes >= endMinutes) return null;
  return { Days: days, StartMinutes: startMinutes, EndMinutes: endMinutes };
}

export function createSlotTimes(date: string, hours: ParsedWorkingHours) {
  const day = getWeekday(date);
  if (day === null || !hours.Days.includes(day)) return [];

  const times: string[] = [];
  for (let minutes = hours.StartMinutes; minutes < hours.EndMinutes; minutes += 60) {
    times.push(formatMinutes(minutes));
  }
  return times;
}

export function isValidDateString(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const value = new Date(`${date}T12:00:00+07:00`);
  if (Number.isNaN(value.getTime())) return false;
  return getVietnamDateTimeParts(value).date === date;
}

export function toAppointmentIso(date: string, time: string) {
  return `${date}T${time}:00+07:00`;
}

export function getVietnamToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getVietnamDateTimeParts(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

export function formatWorkingTime(hours: ParsedWorkingHours) {
  return `${formatMinutes(hours.StartMinutes)} - ${formatMinutes(hours.EndMinutes)}`;
}

function parseTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }
  return hour * 60 + minute;
}

function formatMinutes(value: number) {
  const hour = Math.floor(value / 60).toString().padStart(2, "0");
  const minute = (value % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function getWeekday(date: string) {
  if (!isValidDateString(date)) return null;
  const value = new Date(`${date}T12:00:00+07:00`);
  return Number.isNaN(value.getTime()) ? null : value.getUTCDay();
}
