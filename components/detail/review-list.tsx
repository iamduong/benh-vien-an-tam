"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { formatDate } from "@/lib/format";
import { reviewService } from "@/lib/services/review/ReviewService";
import type { PublicReview, ReviewTargetType } from "@/types/reviews";

export function ReviewList({
  reviews: initialReviews,
  target,
}: {
  reviews: PublicReview[];
  target: { type: ReviewTargetType; uuid: string };
}) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    reviewService
      .getPublic(target.type, target.uuid, controller.signal)
      .then((response) => {
        if (active) setReviews(response.data);
      })
      .catch(() => {
        // Keep the server-rendered reviews when the client refresh cannot complete.
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [target.type, target.uuid]);

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.numberOfStar, 0) /
      reviews.length
    : null;

  if (!reviews.length) {
    return <p className="text-sm text-muted-foreground">Chưa có đánh giá công khai.</p>;
  }

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-600">
        <Star aria-hidden="true" className="size-5 fill-current" />
        {averageRating?.toFixed(1)} trên 5 · {reviews.length} đánh giá
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <article key={review.uuid} className="rounded-xl border p-4">
            <div
              className="flex gap-1 text-amber-500"
              aria-label={`${review.numberOfStar} trên 5 sao`}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  aria-hidden="true"
                  className={cnStar(index < review.numberOfStar)}
                />
              ))}
            </div>
            <p className="mt-3 text-sm leading-6">
              {review.content || "Đang cập nhật"}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Người bệnh · {formatDate(review.createdAt)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function cnStar(active: boolean) {
  return active ? "size-4 fill-current" : "size-4 text-muted";
}
