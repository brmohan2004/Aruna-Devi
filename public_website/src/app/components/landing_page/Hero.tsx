"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import ConsultingPopup from "./ConsultingPopup";
import { listHeroSlides, getFileUrl } from "@/lib/api";
import { IMAGES_BUCKET, VIDEOS_BUCKET } from "@/lib/appwrite";
import { Query } from "appwrite";

/* Video file extensions */
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".ogg"];
function isVideo(src: string) {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

import type { Slide } from "@/app/data/hero";
import { FALLBACK_HERO_SLIDES as DATA_HERO_SLIDES } from "@/app/data/hero";

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>(DATA_HERO_SLIDES);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isConsultingOpen, setIsConsultingOpen] = useState(false);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [passedProjects, setPassedProjects] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById("hero-projects-text");
      if (target) {
        const rect = target.getBoundingClientRect();
        setPassedProjects(rect.top < 80);
      } else {
        setPassedProjects(window.scrollY > window.innerHeight * 0.7);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch slides from Appwrite
  useEffect(() => {
    listHeroSlides([Query.equal("status", "published")])
      .then((docs) => {
        if (docs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = docs.map((doc: any) => ({
            category: doc.category ?? "Projects",
            title: doc.title ?? "",
            media: doc.media_id
              ? getFileUrl(
                doc.is_video ? VIDEOS_BUCKET : IMAGES_BUCKET,
                doc.media_id
              )
              : "",
          }));
          setSlides(mapped);
          setCurrent(0);
        }
      })
      .catch(() => {
        /* silently keep fallback slides */
      });
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 30;

    if (distance > minSwipeDistance) {
      // Swiped finger to the left -> Show next slide
      next();
    } else if (distance < -minSwipeDistance) {
      // Swiped finger to the right -> Show previous slide
      prev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [playing, next]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section
        id="projects"
        className="hero-sec"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        {/* Background Images */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-sec__slide ${i === current ? "hero-sec__slide--active" : ""}`}
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            {isVideo(slide.media) ? (
              <video
                src={slide.media}
                className="hero-sec__video"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div
                className="hero-sec__img"
                style={{ backgroundImage: `url(${slide.media})` }}
              />
            )}
            {/* Light gradient at bottom only for text readability */}
            <div className="hero-sec__overlay" />
          </div>
        ))}

        {/* === Main Content Layer === */}
        <div className="hero-sec__content">
          {/* ---------- Bottom-Left Content Group ---------- */}
          <div className="hero-sec__left-group">
            {/* Get Free Consulting Button */}
            {!passedProjects && (
              <button
                onClick={() => setIsConsultingOpen(true)}
                className="hero-sec__consult-btn"
              >
                Get Free Consulting
              </button>
            )}

            {/* Category tag */}
            <p className="hero-sec__category">
              <span id="hero-projects-text" className="hero-sec__category-text">
                {slides[current].category}
              </span>
            </p>

            {/* Main Heading */}
            <h1 className="hero-sec__title">
              {slides[current].title}
            </h1>

            {/* Mobile slide indicator */}
            <div className="hero-sec__mobile-indicator">
              <ArrowRight strokeWidth={2.5} size={11} className="hero-sec__mobile-icon" style={{ transform: 'rotate(180deg)' }} />
              <span className="hero-sec__mobile-indicator-text">Slide to Explore Projects</span>
              <ArrowRight strokeWidth={2.5} size={11} className="hero-sec__mobile-icon" />
            </div>

            {/* Carousel Dots */}
            <div className="hero-sec__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`hero-sec__dot ${i === current ? "hero-sec__dot--active" : "hero-sec__dot--inactive"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ---------- Right-Center: Slide to Explore Projects ---------- */}
          <div
            className="hero-sec__right-center"
            onClick={next}
          >
            <div className="hero-sec__right-btn">
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="hero-sec__right-icon"
              />
            </div>
            <span className="hero-sec__right-text">
              Slide to Explore Projects
            </span>
          </div>

          {/* ---------- Bottom-Center: Scroll to Explore ---------- */}
          <div className="hero-sec__bottom-center">
            {/* Mouse / scroll-wheel shape */}
            <div className="hero-sec__mouse">
              <div className="hero-sec__wheel" />
            </div>
            <span className="hero-sec__scroll-text">
              Scroll to Explore
            </span>
          </div>

          {/* ---------- Bottom-Right: Pause / Play ---------- */}
          <div className="hero-sec__bottom-right">
            <button
              onClick={() => setPlaying(!playing)}
              className="hero-sec__play-btn"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause size={16} strokeWidth={2.5} className="hero-sec__play-icon" />
              ) : (
                <Play size={16} strokeWidth={2.5} className="hero-sec__play-icon hero-sec__play-icon--play" />
              )}
            </button>
          </div>
        </div>

        {/* Consulting Popup */}
        <ConsultingPopup
          isOpen={isConsultingOpen}
          onClose={() => setIsConsultingOpen(false)}
        />
      </section>
    </>
  );
}

const styles = `
/* === Hero Section === */
.hero-sec {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.hero-sec__slide {
  position: absolute;
  inset: 0;
  transition: opacity 1s ease;
  opacity: 0;
}
.hero-sec__slide--active {
  opacity: 1;
}

.hero-sec__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-width: 100%;
  min-height: 100%;
}

.hero-sec__img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.hero-sec__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.15) 30%, transparent);
}

.hero-sec__content {
  position: relative;
  z-index: 10;
  height: 100%;
  width: 100%;
}

.hero-sec__left-group {
  position: absolute;
  bottom: 40px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 64px;
}
@media (min-width: 768px) {
  .hero-sec__left-group {
    left: 24px;
    bottom: 48px;
    padding-right: 0;
  }
}
@media (min-width: 1024px) {
  .hero-sec__left-group {
    left: 4%;
    bottom: 70px;
  }
}

.hero-sec__consult-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  border-radius: 24px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  padding: 16px 36px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 40px;
}
.hero-sec__consult-btn:hover {
  background-color: rgba(0, 0, 0, 0.85);
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

.hero-sec__category {
  color: #fff;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 12px;
  font-size: 16px;
}
.hero-sec__category-text {
  border-bottom: 2px solid #fff;
  padding-bottom: 2px;
}

.hero-sec__title {
  font-weight: 700;
  color: #fff;
  line-height: 1.08;
  letter-spacing: -0.02em;
  font-size: clamp(36px, 4.5vw, 64px);
  margin: 0;
}

.hero-sec__mobile-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  letter-spacing: 0.1em;
  margin-top: 20px;
  font-size: 11px;
}
@media (min-width: 768px) {
  .hero-sec__mobile-indicator {
    display: none;
  }
}
.hero-sec__mobile-indicator-text {
  text-transform: uppercase;
}
.hero-sec__mobile-icon {
  opacity: 0.7;
}

.hero-sec__dots {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}
@media (min-width: 768px) {
  .hero-sec__dots {
    margin-top: 24px;
  }
}

.hero-sec__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.4s ease;
  border: none;
  cursor: pointer;
  padding: 0;
}
.hero-sec__dot--active {
  background-color: #fff;
}
.hero-sec__dot--inactive {
  background-color: rgba(255, 255, 255, 0.6);
}
.hero-sec__dot--inactive:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.hero-sec__right-center {
  display: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
@media (min-width: 768px) {
  .hero-sec__right-center {
    display: flex;
  }
}

.hero-sec__right-btn {
  width: 72px;
  height: 36px;
  border-radius: 24px;
  background-color: rgba(229, 231, 235, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.hero-sec__right-center:hover .hero-sec__right-btn {
  background-color: #e5e7eb;
}
.hero-sec__right-icon {
  color: #000;
  transition: transform 0.3s ease;
}
.hero-sec__right-center:hover .hero-sec__right-icon {
  transform: translateX(4px);
}
.hero-sec__right-text {
  color: #000;
  font-weight: 500;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 0.02em;
  margin-top: 12px;
}

.hero-sec__bottom-center {
  display: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 768px) {
  .hero-sec__bottom-center {
    display: flex;
  }
}

.hero-sec__mouse {
  width: 22px;
  height: 38px;
  border-radius: 16px;
  border: 2px solid rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  padding-top: 8px;
}
.hero-sec__wheel {
  width: 4px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  animation: heroScrollPulse 2s ease-in-out infinite;
}
.hero-sec__scroll-text {
  color: #000;
  font-weight: 600;
  white-space: nowrap;
  font-size: 11px;
  letter-spacing: 0.02em;
  margin-top: 8px;
}

.hero-sec__bottom-right {
  position: absolute;
  right: 16px;
  bottom: 40px;
}
@media (min-width: 768px) {
  .hero-sec__bottom-right {
    right: 24px;
    bottom: 48px;
  }
}
@media (min-width: 1024px) {
  .hero-sec__bottom-right {
    right: 4%;
    bottom: 70px;
  }
}

.hero-sec__play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(209, 213, 219, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  padding: 0;
}
.hero-sec__play-btn:hover {
  background-color: #d1d5db;
  transform: scale(1.05);
}
.hero-sec__play-icon {
  color: rgba(0, 0, 0, 0.8);
}
.hero-sec__play-icon--play {
  margin-left: 2px;
}

@keyframes heroScrollPulse {
  0% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;
