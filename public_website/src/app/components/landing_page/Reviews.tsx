"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import { listReviews } from "@/lib/api";
import { Query } from "appwrite";

import type { Review } from "@/app/data/reviews";
import { FALLBACK_REVIEWS as DATA_REVIEWS } from "@/app/data/reviews";

/* ────────────────────────────────────────────
   Reviews Section
   ──────────────────────────────────────────── */
export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(DATA_REVIEWS);

  // Fetch approved reviews from Appwrite
  useEffect(() => {
    listReviews([Query.equal("status", "approved")])
      .then((docs) => {
        if (docs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = docs.map((doc: any) => ({
            id: doc.$id,
            name: doc.reviewer_name ?? "Client",
            image: "/public_website/projects/modern-apartments.png",
            text: doc.review_text ?? "",
          }));
          setReviews(mapped);
        }
      })
      .catch(() => { /* silently keep fallback */ });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: reviewsStyles }} />

      <section ref={sectionRef} id="reviews" className="reviews-section">
        <div className="reviews-wrapper">
          {/* ─── Header ─── */}
          <span className="reviews-header__label">
            <AnimatedText text="Client Work Satisfaction" delayOffset={0} wordDelay={0.04} />
          </span>

          {/* ─── Infinite Carousel Track ─── */}
          <div
            className="reviews-carousel-container"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            <div className="reviews-track">
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="reviews-set" aria-hidden={setIndex > 0}>
                  {reviews.map((review) => (
                    <div key={`review-${setIndex}-${review.id}`} className="review-card">
                      {/* Person image */}
                      <div className="review-card__image-wrap">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="review-card__image"
                        />
                      </div>

                      {/* Text */}
                      <div className="review-card__text-wrap">
                        <p className="review-card__text">{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */
const reviewsStyles = `
/* === Section === */
.reviews-section {
  background: #ffffff;
  color: #111111;
  padding: 40px 0 60px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #f0f0f0;
}

.reviews-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* === Header === */
.reviews-header__label {
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  color: #111;
  letter-spacing: 0.01em;
  margin-bottom: 48px;
  border-bottom: 2px solid #111;
  padding-bottom: 4px;
  line-height: 1;
  text-align: center;
}

/* === Horizontal Scroll Container === */
.reviews-carousel-container {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
  position: relative;
  padding: 20px 0;
}

/* Fade masks for elegant scrolling edges */
.reviews-carousel-container::before,
.reviews-carousel-container::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 10;
  pointer-events: none;
}

.reviews-carousel-container::before {
  left: 0;
  background: linear-gradient(to right, #ffffff, transparent);
}

.reviews-carousel-container::after {
  right: 0;
  background: linear-gradient(to left, #ffffff, transparent);
}

.reviews-track {
  display: flex;
  width: max-content;
  animation: reviewsScroll 35s linear infinite;
}

.reviews-track:hover,
.reviews-track:active {
  animation-play-state: paused;
}

@keyframes reviewsScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.reviews-set {
  display: flex;
  gap: 32px;
  padding-right: 32px;
}

/* === Review Card === */
.review-card {
  width: 500px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 32px;
  background: #c8c8c8;
  border-radius: 20px;
  padding: 32px 36px;
  min-height: 280px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

/* Person image */
.review-card__image-wrap {
  flex: 0 0 160px;
  height: 220px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.review-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom center;
  display: block;
}

/* Text */
.review-card__text-wrap {
  flex: 1;
  display: flex;
  align-items: center;
}

.review-card__text {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  line-height: 1.65;
  text-align: left;
  margin: 0;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .reviews-section {
    padding: 70px 0 80px;
  }
  .review-card {
    width: 440px;
    padding: 24px 28px;
    gap: 24px;
    min-height: 240px;
  }
  .review-card__image-wrap {
    flex: 0 0 140px;
    height: 200px;
  }
  .review-card__text {
    font-size: 14.5px;
  }
}

@media (max-width: 768px) {
  .review-card {
    width: 360px;
    flex-direction: column;
    padding: 24px;
    min-height: auto;
    text-align: center;
  }
  .review-card__image-wrap {
    flex: 0 0 120px;
    height: 170px;
  }
  .review-card__text {
    text-align: center;
  }
  .reviews-carousel-container::before,
  .reviews-carousel-container::after {
    width: 60px;
  }
  .reviews-set {
    gap: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 480px) {
  .reviews-section {
    padding: 50px 0 60px;
  }
  .reviews-header__label {
    font-size: 16px;
    margin-bottom: 32px;
  }
  .review-card {
    width: 300px;
    padding: 24px 20px;
  }
  .review-card__image-wrap {
    width: 120px;
    height: 160px;
  }
  .review-card__text {
    font-size: 14px;
  }
}
`;
