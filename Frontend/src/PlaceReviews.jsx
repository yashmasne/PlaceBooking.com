import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";
import { UserContext } from "./UserContext";
import { useToast } from "./ToastContext";
import { useConfirm } from "./ConfirmContext";

const INITIAL_VISIBLE = 4;
const MIN_LENGTH = 10;
const MAX_LENGTH = 1000;
const ratingLabels = ["", "Terrible", "Poor", "Okay", "Great", "Excellent"];
const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  highest: (a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt),
  lowest: (a, b) => a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt),
};

function Stars({ value, className = "" }) {
  return (
    <span className={`flex items-center gap-0.5 text-amber-500 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (n <= value ? <FaStar key={n} /> : <FaRegStar key={n} />))}
    </span>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "G";
}

export default function PlaceReviews({ place, onSummaryChange }) {
  const { user } = useContext(UserContext);
  const toast = useToast();
  const confirm = useConfirm();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const myReview = user ? reviews.find((review) => review.user === user._id) : null;
  const isOwner = user && place.owner === user._id;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/places/${place._id}/reviews`)
      .then(({ data }) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [place._id]);

  useEffect(() => {
    setRating(myReview?.rating || 0);
    setComment(myReview?.comment || "");
  }, [myReview?._id]);

  async function submitReview(ev) {
    ev.preventDefault();
    if (!rating) {
      toast.error("Please choose a star rating.");
      return;
    }
    if (comment.trim().length < MIN_LENGTH) {
      toast.error(`Please write at least ${MIN_LENGTH} characters about your stay.`);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(`/places/${place._id}/reviews`, {
        rating,
        comment: comment.trim(),
      });
      setReviews((prev) => [data.review, ...prev.filter((review) => review._id !== data.review._id)]);
      onSummaryChange?.({ rating: data.rating, reviewsCount: data.reviewsCount });
      toast.success(myReview ? "Your review has been updated." : "Thanks! Your review is live.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't save your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReview() {
    if (!myReview) return;
    const confirmed = await confirm({
      title: "Delete your review?",
      message: "Your rating and comment will be removed from this stay.",
      confirmLabel: "Delete review",
      danger: true,
    });
    if (!confirmed) return;
    try {
      const { data } = await axios.delete(`/reviews/${myReview._id}`);
      setReviews((prev) => prev.filter((review) => review._id !== myReview._id));
      onSummaryChange?.({ rating: data.rating, reviewsCount: data.reviewsCount });
      toast.info("Your review was deleted.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't delete your review.");
    }
  }

  const sortedReviews = useMemo(() => [...reviews].sort(sorters[sortBy]), [reviews, sortBy]);
  const breakdown = useMemo(
    () => [5, 4, 3, 2, 1].map((stars) => ({ stars, count: reviews.filter((r) => r.rating === stars).length })),
    [reviews]
  );
  const visible = showAll ? sortedReviews : sortedReviews.slice(0, INITIAL_VISIBLE);
  const shownRating = hoverRating || rating;

  return (
    <section id="reviews" className="pt-10 pb-10 border-b border-gray-200 scroll-mt-24">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        <FaStar className="text-amber-500 text-xl" />
        {Number(place.rating).toFixed(2)}
        <span className="text-gray-400 font-normal">·</span>
        {place.reviewsCount} reviews
      </h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {[0, 1].map((n) => (
            <div key={n} className="animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-200" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm mt-3">
          No written reviews yet. Stayed here? Be the first to share your experience.
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-6">
            <div className="w-full max-w-xs space-y-1.5" aria-label="Rating breakdown of written reviews">
              {breakdown.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="w-3 text-right font-medium">{stars}</span>
                  <FaStar className="text-amber-500 shrink-0" />
                  <div className="grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full"
                      style={{ width: `${(count / reviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 text-right tabular-nums">{count}</span>
                </div>
              ))}
            </div>
            {reviews.length > 1 && (
              <label className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
                Sort by
                <select
                  value={sortBy}
                  onChange={(ev) => setSortBy(ev.target.value)}
                  className="text-sm font-medium py-2 px-3 bg-white border border-gray-200 rounded-full text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              </label>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 mt-8">
            {visible.map((review) => (
              <article key={review._id}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-rose-400 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {initials(review.userName)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-tight">
                      {review.userName}
                      {user && review.user === user._id && (
                        <span className="ml-2 text-xs font-medium text-gray-500">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(review.createdAt), "MMMM yyyy")}
                      {review.updatedAt && " · edited"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <Stars value={review.rating} />
                  {review.verifiedStay && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <FaCheckCircle /> Verified stay
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-line break-words">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
          {reviews.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="mt-8 bg-white border border-gray-900 text-gray-900 font-semibold text-sm py-2.5 px-5 rounded-xl hover:bg-gray-50"
            >
              {showAll ? "Show fewer reviews" : `Show all ${reviews.length} written reviews`}
            </button>
          )}
        </>
      )}

      <div className="mt-10 max-w-2xl">
        {!user ? (
          <p className="text-sm text-gray-600">
            <Link to="/login" className="font-semibold text-primary underline">
              Log in
            </Link>{" "}
            to write a review.
          </p>
        ) : isOwner ? (
          <p className="text-sm text-gray-500">You host this listing, so you can't review it.</p>
        ) : (
          <form onSubmit={submitReview} className="bg-gray-50 border border-gray-200/80 rounded-3xl p-5 sm:p-6">
            <h3 className="font-bold text-lg text-gray-900">
              {myReview ? "Update your review" : "Write a review"}
            </h3>
            <div className="flex items-center gap-3 mt-3" onMouseLeave={() => setHoverRating(0)}>
              <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    className="bg-transparent p-0.5 text-2xl text-amber-500 hover:scale-110 transition-transform"
                  >
                    {n <= shownRating ? <FaStar /> : <FaRegStar />}
                  </button>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">{ratingLabels[shownRating]}</span>
            </div>
            <textarea
              value={comment}
              onChange={(ev) => setComment(ev.target.value.slice(0, MAX_LENGTH))}
              placeholder="What did you love? How were the host, cleanliness and location?"
              className="mt-3 bg-white text-sm"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
              <span className="text-xs text-gray-400">
                {comment.trim().length}/{MAX_LENGTH}
              </span>
              <div className="flex items-center gap-3">
                {myReview && (
                  <button
                    type="button"
                    onClick={deleteReview}
                    className="bg-transparent text-sm font-semibold text-gray-600 underline hover:text-gray-900"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white font-semibold text-sm py-2.5 px-6 rounded-xl disabled:opacity-60"
                >
                  {submitting ? "Saving..." : myReview ? "Update review" : "Post review"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
