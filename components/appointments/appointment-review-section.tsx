"use client";

import { LoaderCircle, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ErrorState, LoadingState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AsyncState } from "@/lib/http/response";
import {
  ReviewServiceError,
  reviewService,
} from "@/lib/services/review/ReviewService";
import { cn } from "@/lib/utils";
import type {
  ReviewEligibility,
  ReviewEligibilityTarget,
} from "@/types/reviews";

export function AppointmentReviewSection({
  appointmentUuid,
}: {
  appointmentUuid: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AsyncState<ReviewEligibility>>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    reviewService
      .getEligibility(appointmentUuid, controller.signal)
      .then((response) => {
        if (active) setState({ status: "success", data: response.data });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          status: "error",
          message:
            error instanceof ReviewServiceError
              ? error.message
              : "Không thể tải thông tin đánh giá. Vui lòng thử lại.",
        });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [appointmentUuid, attempt]);

  return (
    <section className="mt-6 rounded-2xl border bg-card p-5 sm:p-7">
      <div>
        <p className="text-sm font-semibold text-primary">Chia sẻ trải nghiệm</p>
        <h2 className="mt-1 text-xl font-bold">Đánh giá sau buổi khám</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Đánh giá của bạn giúp người bệnh khác có thêm thông tin khi lựa chọn.
        </p>
      </div>

      {state.status === "loading" || state.status === "idle" ? (
        <div className="mt-5">
          <LoadingState label="Đang tải biểu mẫu đánh giá" />
        </div>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-5">
          <ErrorState
            message={state.message}
            onRetry={() => setAttempt((value) => value + 1)}
          />
        </div>
      ) : null}
      {state.status === "success" ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {state.data.targets.map((target) => (
            <ReviewEditor
              key={`${target.type}:${target.targetUuid}`}
              target={target}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ReviewEditor({ target }: { target: ReviewEligibilityTarget }) {
  const [review, setReview] = useState(target.review);
  const [stars, setStars] = useState(target.review?.numberOfStar ?? 0);
  const [content, setContent] = useState(target.review?.content ?? "");
  const [errors, setErrors] = useState<{
    numberOfStar?: string;
    content?: string;
  }>({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);
  const prefix = `${target.type}-${target.targetUuid}`;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;

    const nextErrors = {
      numberOfStar: stars < 1 || stars > 5 ? "Chọn số sao từ 1 đến 5." : undefined,
      content:
        content.trim().length < 10
          ? "Nội dung đánh giá cần ít nhất 10 ký tự."
          : content.trim().length > 1000
            ? "Nội dung đánh giá tối đa 1000 ký tự."
            : undefined,
    };
    setErrors(nextErrors);
    setFeedback("");
    if (nextErrors.numberOfStar || nextErrors.content) return;

    submitLock.current = true;
    setIsSubmitting(true);
    try {
      const response = await reviewService.save(target.type, target.targetUuid, {
        numberOfStar: stars,
        content: content.trim(),
      });
      setReview(response.data);
      setContent(response.data.content);
      setErrors({});
      setFeedback(response.message);
    } catch (error) {
      if (error instanceof ReviewServiceError) {
        setErrors(error.fieldErrors ?? {});
        setFeedback(error.message);
      } else {
        setFeedback("Không thể lưu đánh giá. Vui lòng thử lại.");
      }
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border bg-background p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {getTargetLabel(target.type)}
      </p>
      <h3 className="mt-1 font-bold">{target.targetName}</h3>
      <div className="mt-5">
        <Label id={`${prefix}-stars-label`}>Mức độ hài lòng</Label>
        <div
          className="mt-2 flex gap-1"
          role="group"
          aria-labelledby={`${prefix}-stars-label`}
        >
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                type="button"
                aria-label={`${value} sao`}
                aria-pressed={stars === value}
                className="rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  setStars(value);
                  setErrors((current) => ({ ...current, numberOfStar: undefined }));
                  setFeedback("");
                }}
              >
                <Star
                  aria-hidden="true"
                  className={cn(
                    "size-7 text-muted-foreground/40 transition-colors",
                    value <= stars && "fill-amber-400 text-amber-500",
                  )}
                />
              </button>
            );
          })}
        </div>
        {errors.numberOfStar ? (
          <p className="mt-1 text-sm text-destructive">{errors.numberOfStar}</p>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor={`${prefix}-content`}>Nội dung đánh giá</Label>
        <Textarea
          id={`${prefix}-content`}
          value={content}
          maxLength={1000}
          aria-invalid={Boolean(errors.content)}
          placeholder="Chia sẻ về quy trình, thời gian chờ hoặc chất lượng tư vấn..."
          onChange={(event) => {
            setContent(event.target.value);
            setErrors((current) => ({ ...current, content: undefined }));
            setFeedback("");
          }}
        />
        <div className="flex justify-between gap-3 text-xs text-muted-foreground">
          <span>{errors.content ?? "Từ 10 đến 1000 ký tự"}</span>
          <span>{content.length}/1000</span>
        </div>
      </div>
      {feedback ? (
        <p
          role={feedback.includes("thành công") ? "status" : "alert"}
          className={cn(
            "mt-4 rounded-lg border px-3 py-2 text-sm",
            feedback.includes("thành công")
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-destructive/30 bg-destructive/5 text-destructive",
          )}
        >
          {feedback}
        </p>
      ) : null}
      <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" />
            Đang lưu...
          </>
        ) : review ? (
          "Cập nhật đánh giá"
        ) : (
          "Gửi đánh giá"
        )}
      </Button>
    </form>
  );
}

function getTargetLabel(type: ReviewEligibilityTarget["type"]) {
  if (type === "hospital") return "Cơ sở y tế";
  if (type === "doctor") return "Bác sĩ";
  return "Dịch vụ y tế";
}
