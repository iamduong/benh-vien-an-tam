import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { BookingSkeleton } from "@/components/booking/booking-skeleton";
import {
  DoctorBookingFlow,
  HospitalBookingFlow,
  MedicalServiceBookingFlow,
} from "@/components/booking/hospital-booking-flow";
import type { BookingType } from "@/types/appointments";

export const metadata: Metadata = {
  title: "Đăng ký khám tại bệnh viện",
  description: "Chọn bệnh viện và thời gian dự kiến đến khám.",
};

const typeMap: Record<string, BookingType> = {
  "co-so-y-te": "hospital",
  "bac-si": "doctor",
  "dich-vu": "medical-service",
};

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{
    hospital?: string | string[];
    doctor?: string | string[];
    service?: string | string[];
  }>;
}) {
  const { type: routeType } = await params;
  const type = typeMap[routeType];
  if (!type) notFound();

  const query = await searchParams;
  const target =
    type === "hospital"
      ? query.hospital
      : type === "doctor"
        ? query.doctor
        : query.service;
  if (typeof target !== "string" || !target.trim()) {
    redirect(
      type === "hospital" ? "/co-so-y-te" : type === "doctor" ? "/bac-si" : "/dich-vu",
    );
  }

  return (
    <Suspense fallback={<BookingSkeleton />}>
      {type === "hospital" ? (
        <HospitalBookingFlow />
      ) : type === "doctor" ? (
        <DoctorBookingFlow />
      ) : (
        <MedicalServiceBookingFlow />
      )}
    </Suspense>
  );
}
