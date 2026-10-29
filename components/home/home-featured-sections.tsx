"use client";

import { useEffect, useState } from "react";

import {
  DepartmentCard,
  DoctorCard,
  HospitalCard,
  MedicalServiceCard,
} from "@/components/home/featured-cards";
import { FeaturedSection } from "@/components/home/featured-section";
import { FeaturedSectionsSkeleton } from "@/components/home/featured-sections-skeleton";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import type { AsyncState } from "@/lib/http/response";
import { departmentService } from "@/lib/services/department/DepartmentService";
import { doctorService } from "@/lib/services/doctor/DoctorService";
import { hospitalService } from "@/lib/services/hospital/HospitalService";
import { medicalServiceService } from "@/lib/services/medical-service/MedicalServiceService";
import type {
  Department,
  DoctorProfile,
  Hospital,
  MedicalService,
} from "@/types/models";

type HomeData = {
  departments: Department[];
  hospitals: Hospital[];
  doctors: DoctorProfile[];
  medicalServices: MedicalService[];
};

export function HomeFeaturedSections() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AsyncState<HomeData>>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    Promise.all([
      departmentService.getFeaturedDepartments(controller.signal),
      hospitalService.getFeaturedHospital(controller.signal),
      doctorService.getFeaturedDoctor(controller.signal),
      medicalServiceService.getFeatured(controller.signal),
    ])
      .then(([departments, hospitals, doctors, medicalServices]) => {
        if (!cancelled) {
          setState({
            status: "success",
            data: {
              departments: departments.data,
              hospitals: hospitals.data,
              doctors: doctors.data,
              medicalServices: medicalServices.data,
            },
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Không thể tải nội dung nổi bật. Vui lòng thử lại.",
          });
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [attempt]);

  if (state.status === "idle" || state.status === "loading") {
    return <FeaturedSectionsSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div className="container-shell py-12">
        <ErrorState
          message={state.message}
          onRetry={() => {
            setState({ status: "loading" });
            setAttempt((current) => current + 1);
          }}
        />
      </div>
    );
  }

  const { departments, hospitals, doctors, medicalServices } = state.data;

  return (
    <div>
      <FeaturedSection
        eyebrow="Khám theo nhu cầu"
        title="Chuyên khoa thường được quan tâm"
        description="Bắt đầu từ nhu cầu sức khỏe để tìm bác sĩ và cơ sở phù hợp."
        href="/bac-si"
      >
        {departments.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((department) => (
              <DepartmentCard key={department.uuid} department={department} />
            ))}
          </div>
        ) : (
          <EmptyState message="Chưa có chuyên khoa nổi bật." />
        )}
      </FeaturedSection>

      <FeaturedSection
        eyebrow="Mạng lưới chăm sóc"
        title="Cơ sở y tế nổi bật"
        description="Các cơ sở đang hoạt động được sắp xếp từ kết quả của hệ thống."
        href="/co-so-y-te"
        muted
      >
        {hospitals.length ? (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital.uuid} hospital={hospital} showBookingAction />
            ))}
          </div>
        ) : (
          <EmptyState message="Chưa có cơ sở y tế nổi bật." />
        )}
      </FeaturedSection>

      <FeaturedSection
        eyebrow="Đội ngũ chuyên môn"
        title="Bác sĩ nổi bật"
        description="Tham khảo chuyên khoa, nơi làm việc và chi phí khám trước khi chọn."
        href="/bac-si"
      >
        {doctors.length ? (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.uuid} doctor={doctor} showBookingAction />
            ))}
          </div>
        ) : (
          <EmptyState message="Chưa có bác sĩ nổi bật." />
        )}
      </FeaturedSection>

      <FeaturedSection
        eyebrow="Chăm sóc chủ động"
        title="Dịch vụ nổi bật"
        description="Thông tin dịch vụ và mức giá được trình bày rõ ràng để dễ so sánh."
        href="/dich-vu"
        muted
      >
        {medicalServices.length ? (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {medicalServices.map((service) => (
              <MedicalServiceCard key={service.uuid} service={service} showBookingAction />
            ))}
          </div>
        ) : (
          <EmptyState message="Chưa có dịch vụ nổi bật." />
        )}
      </FeaturedSection>
    </div>
  );
}
