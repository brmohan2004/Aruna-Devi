"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ProjectDetail } from "@/app/data/projects";

interface Props {
  project: ProjectDetail;
}

export default function ProjectGallery({ project }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = project.gallery;
  const total = images.length;

  // Show 2 images side by side on desktop (pairs), 1 on mobile
  // We paginate by "slides" — each slide shows 2 images
  const slidesCount = Math.ceil(total / 2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [current, isTransitioning]
  );

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slidesCount]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section ref={sectionRef} className="pd-gallery">
        <div className="pd-gallery__wrapper">
          {/* Header */}
          <div
            className="pd-gallery__header"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(25px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h2 className="pd-gallery__title">Project Gallery</h2>
            <p className="pd-gallery__subtitle">
              We combine technical expertise with creative vision
            </p>
          </div>

          {/* Carousel */}
          <div
            className="pd-gallery__carousel"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            <div
              className="pd-gallery__track"
              style={{
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {Array.from({ length: slidesCount }).map((_, slideIndex) => {
                const img1 = images[slideIndex * 2];
                const img2 = images[slideIndex * 2 + 1];
                return (
                  <div key={slideIndex} className="pd-gallery__slide">
                    <div className="pd-gallery__img-wrap">
                      <img
                        src={img1}
                        alt={`${project.title} gallery ${slideIndex * 2 + 1}`}
                        className="pd-gallery__img"
                        loading="lazy"
                      />
                    </div>
                    {img2 && (
                      <div className="pd-gallery__img-wrap">
                        <img
                          src={img2}
                          alt={`${project.title} gallery ${slideIndex * 2 + 2}`}
                          className="pd-gallery__img"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div
            className="pd-gallery__dots"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.3s",
            }}
          >
            {Array.from({ length: slidesCount }).map((_, i) => (
              <button
                key={i}
                className={`pd-gallery__dot ${current === i ? "pd-gallery__dot--active" : ""}`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const styles = `
/* === Gallery Section === */
.pd-gallery {
  background: #ffffff;
  padding: 60px 0 70px;
}

.pd-gallery__wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

/* Header */
.pd-gallery__header {
  text-align: center;
  margin-bottom: 40px;
}

.pd-gallery__title {
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 700;
  color: #111;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.pd-gallery__subtitle {
  font-size: 15px;
  color: #777;
  margin: 0;
  line-height: 1.6;
}

/* Carousel */
.pd-gallery__carousel {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
}

.pd-gallery__track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.pd-gallery__slide {
  display: flex;
  gap: 20px;
  min-width: 100%;
  flex-shrink: 0;
}

.pd-gallery__img-wrap {
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 4/3;
  background: #f0f0f0;
}

.pd-gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.pd-gallery__img-wrap:hover .pd-gallery__img {
  transform: scale(1.04);
}

/* Dots */
.pd-gallery__dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.pd-gallery__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #d4d4d4;
  cursor: pointer;
  transition: all 0.35s ease;
  padding: 0;
}

.pd-gallery__dot--active {
  background: #111;
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.15);
}

.pd-gallery__dot:hover:not(.pd-gallery__dot--active) {
  background: #999;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .pd-gallery {
    padding: 40px 0 50px;
  }

  .pd-gallery__wrapper {
    padding: 0 16px;
  }

  .pd-gallery__slide {
    gap: 12px;
  }

  .pd-gallery__img-wrap {
    border-radius: 12px;
  }

  .pd-gallery__header {
    margin-bottom: 28px;
  }

  .pd-gallery__dots {
    margin-top: 20px;
    gap: 8px;
  }

  .pd-gallery__dot {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .pd-gallery__slide {
    flex-direction: column;
    gap: 12px;
  }

  .pd-gallery__img-wrap {
    aspect-ratio: 16/10;
  }
}
`;
