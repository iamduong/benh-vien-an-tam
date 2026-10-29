import type {
  ReviewDoctor,
  ReviewHospital,
  ReviewMedicalService,
} from "@/types/models";

export type ReviewTargetType = "hospital" | "doctor" | "medical-service";

export type PatientReview =
  | ReviewHospital
  | ReviewDoctor
  | ReviewMedicalService;

export type PublicReview = Pick<
  PatientReview,
  "uuid" | "content" | "numberOfStar" | "createdAt"
>;

export type ReviewEligibilityTarget = {
  type: ReviewTargetType;
  targetUuid: string;
  targetName: string;
  review: PatientReview | null;
};

export type ReviewEligibility = {
  appointmentUuid: string;
  targets: ReviewEligibilityTarget[];
};

export type SaveReviewRequest = {
  numberOfStar: number;
  content: string;
};

export type ReviewErrorResponse = {
  message?: string;
  errors?: Partial<Record<keyof SaveReviewRequest, string>>;
};
