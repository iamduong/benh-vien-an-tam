"use client";

import { useEffect, useState } from "react";

import {
  MetricCard,
  MetricGrid,
  PortalPageHeader,
  PortalSection,
  StatusPill,
} from "@/components/internal/portal-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  hospitalReviewService,
  type BranchReview,
  type BranchReviewQuery,
  type BranchReviewStatus,
  type BranchReviewSummary,
  type BranchReviewType,
} from "@/lib/services/review/HospitalReviewService";

const emptySummary: BranchReviewSummary = {
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  hidden: 0,
  hospital: null,
  doctors: null,
  medicalServices: null,
};

export function HospitalReviewsScreen() {
  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [filters, setFilters] = useState<BranchReviewQuery>({
    type: "all",
    stars: "all",
    status: "all",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [busyUuid, setBusyUuid] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    hospitalReviewService.getBranchReviews(filters, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setReviews(response.data);
        setSummary(response.summary);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Không thể tải đánh giá của chi nhánh:", error);
        setLoadError("Không thể tải danh sách đánh giá. Vui lòng thử lại.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [filters, reload]);

  async function moderate(review: BranchReview, status: Exclude<BranchReviewStatus, "pending">) {
    setBusyUuid(review.uuid);
    setMessage(null);
    try {
      const response = await hospitalReviewService.moderate(review.type, review.uuid, status);
      setMessage({ text: response.message, error: false });
      setReload((current) => current + 1);
    } catch (error) {
      console.error("Không thể duyệt đánh giá:", error);
      setMessage({ text: "Không thể cập nhật trạng thái đánh giá.", error: true });
    } finally {
      setBusyUuid(null);
    }
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Chất lượng dịch vụ"
        title="Đánh giá người bệnh"
        description="Tìm kiếm, lọc và kiểm duyệt đánh giá bệnh viện, dịch vụ và bác sĩ thuộc chi nhánh hiện tại."
      />
      {message ? (
        <p role={message.error ? "alert" : "status"} className={`border px-4 py-3 text-sm ${message.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </p>
      ) : null}
      <MetricGrid>
        <MetricCard label="Đánh giá bệnh viện" value={formatRating(summary.hospital)} detail={`${summary.total} đánh giá trong chi nhánh`} icon={<span aria-hidden="true">★</span>} tone="amber" />
        <MetricCard label="Đánh giá bác sĩ" value={formatRating(summary.doctors)} detail={`${summary.accepted} đánh giá đã duyệt`} icon={<span aria-hidden="true">★</span>} tone="blue" />
        <MetricCard label="Đánh giá dịch vụ" value={formatRating(summary.medicalServices)} detail={`${summary.pending} đánh giá chờ duyệt`} icon={<span aria-hidden="true">★</span>} tone="cyan" />
        <MetricCard label="Đã ẩn / từ chối" value={String(summary.hidden + summary.rejected)} detail={`${summary.hidden} ẩn · ${summary.rejected} từ chối`} icon={<span aria-hidden="true">!</span>} tone="red" />
      </MetricGrid>
      <PortalSection title="Danh sách đánh giá" description="Chỉ dữ liệu thuộc chi nhánh của tài khoản đang đăng nhập.">
        <div className="grid gap-3 border-b bg-[#fbfdfe] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            aria-label="Tìm đánh giá"
            placeholder="Tìm nội dung, người đánh giá, đối tượng"
            value={filters.search ?? ""}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          />
          <select
            aria-label="Lọc loại đánh giá"
            value={filters.type}
            onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value as BranchReviewType | "all" }))}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">Tất cả đối tượng</option>
            <option value="hospital">Bệnh viện</option>
            <option value="doctor">Bác sĩ</option>
            <option value="medical-service">Dịch vụ khám</option>
          </select>
          <select
            aria-label="Lọc số sao"
            value={filters.stars}
            onChange={(event) => setFilters((current) => ({ ...current, stars: event.target.value === "all" ? "all" : Number(event.target.value) }))}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">Tất cả số sao</option>
            {[5, 4, 3, 2, 1].map((stars) => <option key={stars} value={stars}>{stars} sao</option>)}
          </select>
          <select
            aria-label="Lọc trạng thái duyệt"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as BranchReviewStatus | "all" }))}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="accepted">Đã chấp nhận</option>
            <option value="rejected">Đã từ chối</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </div>
        {loadError ? (
          <div role="alert" className="flex items-center justify-between gap-3 p-5 text-sm text-red-700">
            <span>{loadError}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => setReload((current) => current + 1)}>Thử lại</Button>
          </div>
        ) : loading ? (
          <p className="p-5 text-sm text-muted-foreground">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">Không tìm thấy đánh giá phù hợp.</p>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <article key={`${review.type}-${review.uuid}`} className="space-y-3 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-semibold">{review.patientName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {reviewTypeName(review.type)}: {review.targetName}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone={review.numberOfStar >= 4 ? "green" : "amber"}>{review.numberOfStar} sao</StatusPill>
                    <StatusPill tone={reviewStatusTone(review.status)}>{reviewStatusName(review.status)}</StatusPill>
                    <time className="text-xs text-muted-foreground" dateTime={review.createdAt}>
                      {new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(review.createdAt))}
                    </time>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6">{review.content}</p>
                <div className="flex flex-wrap gap-2">
                  {review.status !== "accepted" ? (
                    <Button type="button" size="sm" disabled={busyUuid === review.uuid} onClick={() => void moderate(review, "accepted")}>Chấp nhận</Button>
                  ) : null}
                  {review.status === "pending" ? (
                    <Button type="button" size="sm" variant="outline" disabled={busyUuid === review.uuid} onClick={() => void moderate(review, "rejected")}>Từ chối</Button>
                  ) : null}
                  {review.status !== "hidden" ? (
                    <Button type="button" size="sm" variant="outline" disabled={busyUuid === review.uuid} onClick={() => void moderate(review, "hidden")}>Ẩn đánh giá</Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalSection>
    </div>
  );
}

function formatRating(rating: number | null) {
  return rating === null ? "—" : `${rating.toLocaleString("vi-VN", { minimumFractionDigits: rating % 1 ? 1 : 0, maximumFractionDigits: 1 })}/5`;
}

function reviewTypeName(type: BranchReviewType) {
  return type === "hospital" ? "Bệnh viện" : type === "doctor" ? "Bác sĩ" : "Dịch vụ khám";
}

function reviewStatusName(status: BranchReviewStatus) {
  return status === "pending" ? "Chờ duyệt" : status === "accepted" ? "Đã chấp nhận" : status === "rejected" ? "Đã từ chối" : "Đã ẩn";
}

function reviewStatusTone(status: BranchReviewStatus) {
  return status === "accepted" ? "green" : status === "pending" ? "amber" : status === "rejected" ? "red" : "neutral";
}
