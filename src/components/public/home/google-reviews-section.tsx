import { Star } from "lucide-react";

const GOOGLE_REVIEWS = [
  {
    name: "Priya Sharma",
    initial: "P",
    color: "bg-blue-600",
    rating: 5,
    content:
      "The consultation was seamless. Got my medical certificate within minutes of ending the call. Highly professional service!",
    time: "2 days ago",
  },
  {
    name: "Rahul Verma",
    initial: "R",
    color: "bg-emerald-600",
    rating: 5,
    content:
      "Doctor was very understanding and provided clear guidance. The video quality was excellent and the process was smooth.",
    time: "5 days ago",
  },
  {
    name: "Ananya Patel",
    initial: "A",
    color: "bg-purple-600",
    rating: 5,
    content:
      "Best online consultation experience. The certificate was accepted by my office without any issues. Thank you!",
    time: "1 week ago",
  },
  {
    name: "Karan Mehta",
    initial: "K",
    color: "bg-orange-600",
    rating: 5,
    content:
      "Quick response time and very helpful doctor. The prescription was delivered digitally immediately. Great service!",
    time: "1 week ago",
  },
  {
    name: "Sneha Gupta",
    initial: "S",
    color: "bg-pink-600",
    rating: 5,
    content:
      "Very convenient for busy professionals. Consulted during my lunch break and got all documents instantly.",
    time: "2 weeks ago",
  },
  {
    name: "Vikram Rao",
    initial: "V",
    color: "bg-cyan-600",
    rating: 5,
    content:
      "Professional doctors and secure platform. Felt comfortable discussing my health issues. Will use again.",
    time: "2 weeks ago",
  },
  {
    name: "Neha Kapoor",
    initial: "N",
    color: "bg-rose-600",
    rating: 5,
    content:
      "Amazing experience! The doctor listened patiently and provided a detailed prescription. Highly recommend.",
    time: "3 weeks ago",
  },
  {
    name: "Arjun Singh",
    initial: "A",
    color: "bg-indigo-600",
    rating: 5,
    content:
      "Easy to use platform and qualified doctors. Got my fitness certificate for sports participation quickly.",
    time: "3 weeks ago",
  },
];

export function GoogleReviewsSection() {
  return (
    <section className="bg-gray-50 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Google Reviews</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            For our time in the limelight, we&apos;ve helped out on over 1,550
            projects to date – take a look at our testimonials below, and know
            you can{" "}
            <a href="#" className="text-blue-600 hover:underline">
              reach out
            </a>{" "}
            with confidence!
          </p>
        </div>

        {/* Google Rating Header */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Google Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">5.0</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">282 reviews</span>
              </div>
            </div>
          </div>
          <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Write A Review
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOOGLE_REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-3 text-sm leading-relaxed text-gray-700 line-clamp-4">
                {review.content}
              </p>

              {/* Read More Link */}
              <button className="mt-2 text-xs text-blue-600 hover:underline">
                Read more
              </button>

              {/* User Info */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${review.color}`}
                >
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-500">{review.time}</p>
                </div>
              </div>

              {/* Posted on Google */}
              <div className="mt-3 flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs text-gray-500">Posted on Google</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}
