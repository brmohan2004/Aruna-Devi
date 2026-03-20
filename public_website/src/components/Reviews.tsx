"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Homeowner, Coimbatore",
    rating: 5,
    text: "Aruna Devi Infra Projects transformed our vision into a beautiful reality. Their structural designs are impeccable, and the team was incredibly professional throughout the entire process.",
    avatar: "RK",
  },
  {
    id: 2,
    name: "Priya Venkatesh",
    role: "Business Owner, Chennai",
    rating: 5,
    text: "Outstanding architectural planning for our commercial complex. The 3D visualization helped us understand the project before construction even began. Highly recommend their services!",
    avatar: "PV",
  },
  {
    id: 3,
    name: "Suresh Babu",
    role: "Villa Owner, Kodaikanal",
    rating: 5,
    text: "From the initial consultation to the final handover, the experience was seamless. They truly understand the balance between aesthetics and structural integrity.",
    avatar: "SB",
  },
  {
    id: 4,
    name: "Lakshmi Narayanan",
    role: "Real Estate Developer",
    rating: 5,
    text: "We've partnered with Aruna Devi on multiple projects now. Their consistency in quality and innovation keeps us coming back. A trustworthy partner in every sense.",
    avatar: "LN",
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i >= reviews.length - 2 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? reviews.length - 2 : i - 1));
  };
  const next = () => {
    setCurrentIndex((i) => (i >= reviews.length - 2 ? 0 : i + 1));
  };

  return (
    <section
      id="reviews"
      className="bg-black scroll-mt-20"
      style={{ padding: "75px 0" }}
    >
      <div
        ref={sectionRef}
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20"
      >
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400 mb-4 font-medium">
            Client Work Satisfaction
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            What Our Clients Say
          </h2>
        </div>

        {/* Carousel */}
        <div
          className={`relative overflow-hidden transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: "24px",
              transform: `translateX(calc(-${currentIndex} * (50% + 12px)))`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="shrink-0"
                style={{ width: "calc(50% - 12px)" }}
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-3xl h-72 lg:h-80 w-full p-8 lg:p-10 flex flex-col justify-between border border-white/10 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden">
                  {/* Background Quote Decoration */}
                  <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <Quote size={80} />
                  </div>

                  {/* Top: Stars + Quote */}
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: review.rating }).map((_, si) => (
                        <Star
                          key={si}
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-white/70 text-sm lg:text-base leading-relaxed line-clamp-4">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  {/* Bottom: Author */}
                  <div className="flex items-center gap-4 mt-6">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-500/20">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {review.name}
                      </p>
                      <p className="text-white/50 text-xs">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation + Dots */}
        <div
          className={`flex flex-col items-center gap-6 mt-10 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          {/* Progress Dots */}
          <div className="flex gap-2">
            {reviews.slice(0, reviews.length - 1).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === i
                  ? "w-9 bg-blue-500"
                  : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow Controls */}
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <button
              onClick={prev}
              className="text-white hover:text-blue-400 transition-colors duration-300 p-1"
              aria-label="Previous review"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="w-[1px] h-5 bg-white/20" />
            <button
              onClick={next}
              className="text-white hover:text-blue-400 transition-colors duration-300 p-1"
              aria-label="Next review"
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
