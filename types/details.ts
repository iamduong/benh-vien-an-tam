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
};

export type DoctorDetail = {
  doctor: DoctorProfile;
  departments: Department[];
  hospital: Hospital;
  reviews: ReviewDoctor[];
};

export type MedicalServiceDetail = {
  medicalService: MedicalService;
  hospitals: Hospital[];
  reviews: ReviewMedicalService[];
};

export type DepartmentDetail = {
  department: Department;
  hospitals: Hospital[];
  doctors: DoctorProfile[];
};
