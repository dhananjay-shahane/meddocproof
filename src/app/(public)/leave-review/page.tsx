"use client";

import { useState } from "react";
import { Star, Send, Loader2, CheckCircle } from "lucide-react";
import { CTASection } from "@/components/public/home/cta-section";

export default function LeaveReviewPage() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    date: "",
    rating: 5,
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ title: "", message: "", date: "", rating: 5 });
      setAgreed(false);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand-light/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Leave a <span className="text-primary">Review</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Tell us more about your experience. Your feedback helps us improve
            our services.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="border-t bg-card px-4 py-16">
        <div className="mx-auto max-w-xl">
          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">Thank You!</h2>
              <p className="mt-2 text-muted-foreground">
                Thank you for your review. It will be published after
                verification.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Write Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium">
                  Star Rating
                </label>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, rating: star })
                      }
                      className="p-0.5"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= form.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium">
                  Give your review a title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g., Great service and quick delivery"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="review-message"
                  className="block text-sm font-medium"
                >
                  What went wrong or what went well?
                </label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Please be honest and helpful.
                </p>
                <textarea
                  id="review-message"
                  required
                  rows={5}
                  placeholder="Share your experience..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium">
                  Date of Experience
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 rounded-lg border p-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border"
                  required
                />
                <span className="text-sm text-muted-foreground">
                  By submitting this review, you confirm it is based on a
                  genuine experience and you have not received any incentive to
                  write it.
                </span>
              </label>

              {status === "error" && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !agreed}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Review
              </button>
            </form>
          )}
        </div>
      </section>

      <CTASection
        title="Need A Verified Medical Certificate?"
        description="Complete a short online consultation and receive a professionally formatted medical certificate issued by a registered doctor."
        buttonPrimary={{
          label: "Apply For Certificate",
          href: "/certificates/apply",
        }}
      />
    </>
  );
}
