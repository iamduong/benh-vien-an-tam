import { httpClient } from "@/lib/http/client";

export type BranchReviewStatus = "pending" | "accepted" | "rejected" | "hidden";
export type BranchReviewType = "hospital" | "doctor" | "medical-service";

export type BranchReview = {
  uuid: string;
  type: BranchReviewType;
  targetUuid: string;
  targetName: string;
  patientUuid: string | null;
  patientName: string;
  content: string;
  numberOfStar: number;
  status: BranchReviewStatus;
  createdAt: string;
};

export type BranchReviewSummary = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  hidden: number;
  hospital: number | null;
  doctors: number | null;
  medicalServices: number | null;
};

export type BranchReviewQuery = {
  type?: BranchReviewType | "all";
  stars?: number | "all";
  status?: BranchReviewStatus | "all";
  search?: string;
};

class HospitalReviewService {
  async getBranchReviews(query: BranchReviewQuery, signal?: AbortSignal) {
    const response = await httpClient.get<{
      message: string;
      data: BranchReview[];
      summary: BranchReviewSummary;
    }>("/hospital-reviews", {
      params: {
        type: query.type,
        stars: query.stars === "all" ? undefined : query.stars,
        status: query.status,
        search: query.search,
      },
      signal,
    });
    return response.data;
  }

  async moderate(
    type: BranchReviewType,
    uuid: string,
    status: Exclude<BranchReviewStatus, "pending">,
  ) {
    const response = await httpClient.put<{ message: string }>(
      `/hospital-reviews/${type}/${encodeURIComponent(uuid)}/moderation`,
      { status },
    );
    return response.data;
  }
}

export const hospitalReviewService = new HospitalReviewService();
