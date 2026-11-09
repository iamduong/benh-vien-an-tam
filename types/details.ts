import type {
  Department,
  DoctorProfile,
  Hospital,
  MedicalService,
  ReviewDoctor,
  ReviewHospital,
  ReviewMedicalService,
} from "@/types/models";

export type HospitalDetail = {
  hospital: Hospital;
  departments: Department[];
  medicalServices: MedicalService[];
  reviews: ReviewHospital[];
  averageRating?: number | null;
  reviewCount?: number;
};

export type DoctorDetail = {
  doctor: DoctorProfile;
  departments: Department[];
  hospital: Hospital;
  reviews: ReviewDoctor[];
  averageRating?: number | null;
  reviewCount?: number;
};

export type MedicalServiceDetail = {
  medicalService: MedicalService;
  hospitals: Hospital[];
  reviews: ReviewMedicalService[];
  averageRating?: number | null;
  reviewCount?: number;
}

export type DepartmentDetail = {
  department: Department;
  hospitals: Hospital[];
  doctors: DoctorProfile[];
};
