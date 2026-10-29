import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice, markdownToPlainText } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  Department,
  DoctorProfile,
  Hospital,
  MedicalService,
} from "@/types/models";

export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Link
      href={`/chuyen-khoa/${department.slug}`}
      className="group flex min-w-0 items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md"
    >
      {/* <Image
        src={department.icon}
        alt=""
        width={64}
        height={64}
        className="size-14 shrink-0 rounded-xl"
      /> */}
      <img src={department.icon} alt="" width={64} height={64} className="size-14 shrink-0 rounded-xl" />

      <span className="min-w-0 font-semibold group-hover:text-primary">
        {department.name}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="ml-auto size-4 shrink-0 text-muted-foreground group-hover:text-primary"
      />
    </Link>
  );
}

export function HospitalCard({
  hospital,
  showBookingAction = false,
}: {
  hospital: Hospital;
  showBookingAction?: boolean;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <div className="relative aspect-video bg-muted">
        {/* <Image
          src={hospital.image}
          alt={`Hình minh họa ${hospital.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        /> */}
        <img src={hospital.image} alt={`Hình minh họa ${hospital.name}`} className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-7">{hospital.name}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
          <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
          <span>{hospital.address}</span>
        </p>
        <p className="mt-1 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
          <Clock3 aria-hidden="true" className="mt-1 size-4 shrink-0" />
          <span>{hospital.workingHour}</span>
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <Link
            href={`/co-so-y-te/${hospital.slug}`}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Xem chi tiết
          </Link>
          {showBookingAction ? (
            <Link
              href={`/dat-lich/co-so-y-te?hospital=${hospital.uuid}`}
              className={cn(buttonVariants(), "flex-1")}
            >
              Đặt lịch
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function DoctorCard({
  doctor,
  showBookingAction = false,
}: {
  doctor: DoctorProfile;
  showBookingAction?: boolean;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <div className="relative aspect-video bg-muted">
        {/* <Image
            src={doctor.avatar}
            alt={`Hình minh họa ${doctor.name}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          /> */}

        <img src={doctor.avatar || "https://t4.ftcdn.net/jpg/07/07/89/33/360_F_707893394_5DEhlBjWOmse1nyu0rC9T7ZRvsAFDkYC.jpg"} alt={`Hình minh họa ${doctor.name}`} className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {doctor.departmentDisplay}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-7">{doctor.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {doctor.specialty}
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {doctor.workplace}
        </p>
        <span className="mt-4 text-sm font-semibold">
          {formatPrice(doctor.price)}
        </span>
        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <Link
            href={`/bac-si/${doctor.slug}`}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Xem chi tiết
          </Link>
          {showBookingAction ? (
            <Link
              href={`/dat-lich/bac-si?doctor=${doctor.uuid}`}
              className={cn(buttonVariants(), "flex-1")}
            >
              Đặt lịch
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function MedicalServiceCard({
  service,
  showBookingAction = false,
}: {
  service: MedicalService;
  showBookingAction?: boolean;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md">
      <div className="relative aspect-video bg-muted">
        {/* <Image
          src={service.image}
          alt={`Hình minh họa ${service.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        /> */}
        <img src={service.image} alt={`Hình minh họa ${service.name}`} className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-7">{service.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {markdownToPlainText(service.description)}
        </p>
        <p className="mt-3 text-sm font-semibold">
          {formatPrice(service.price)}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <Link
            href={`/dich-vu/${service.slug}`}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            Xem chi tiết
          </Link>
          {showBookingAction ? (
            <Link
              href={`/dat-lich/dich-vu?service=${service.uuid}`}
              className={cn(buttonVariants(), "flex-1")}
            >
              Đặt lịch
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
