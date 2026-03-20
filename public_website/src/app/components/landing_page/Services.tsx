"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import AnimatedText from "./AnimatedText";
import { listServices, getFileUrl } from "@/lib/api";
import { IMAGES_BUCKET } from "@/lib/appwrite";
import { Query } from "appwrite";

import type { Service } from "@/app/data/services";
import { FALLBACK_SERVICES as DATA_SERVICES } from "@/app/data/services";

/* ────────────────────────────────────────────
   Service Card Component
   ──────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
  isVisible,
  onViewMore,
}: {
  service: Service;
  index: number;
  isVisible: boolean;
  onViewMore: (service: Service) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="services-card"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0)"
          : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background image */}
      <div
        className="services-card__image"
        style={{
          backgroundImage: `url(${service.image})`,
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        className="services-card__overlay"
        style={{
          opacity: isHovered ? 0.55 : 0.4,
        }}
      />

      {/* Content */}
      <div className="services-card__content">
        <h3 className="services-card__title">{service.title}</h3>
        <p className="services-card__desc">{service.description}</p>

        {/* Learn more button */}
        <button
          className="services-card__cta"
          onClick={(e) => {
            e.stopPropagation();
            onViewMore(service);
          }}
          style={{
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
          }}
        >
          <span>Learn more</span>
          <ArrowRight
            size={16}
            strokeWidth={2}
            style={{
              transform: isHovered ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Service Detail Popup
   ──────────────────────────────────────────── */
function ServicePopup({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="svc-popup-overlay" onClick={onClose}>
      <div
        className="svc-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X button */}
        <button
          className="svc-popup__close-x"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Title */}
        <h2 className="svc-popup__title">{service.title}</h2>

        {/* Description */}
        <p className="svc-popup__desc">{service.extendedDescription}</p>

        {/* Close button */}
        <div className="svc-popup__footer">
          <button className="svc-popup__close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Services Section
   ──────────────────────────────────────────── */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>(DATA_SERVICES);

  // Fetch services from Appwrite
  useEffect(() => {
    listServices([Query.equal("status", "published")])
      .then((docs) => {
        if (docs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = docs.map((doc: any) => ({
            id: doc.$id,
            title: doc.title ?? "",
            description: doc.short_description ?? "",
            extendedDescription: doc.extended_description ?? doc.short_description ?? "",
            image: doc.image_id
              ? getFileUrl(IMAGES_BUCKET, doc.image_id)
              : "/public_website/services/3d-visualization.png",
          }));
          setServices(mapped);
        }
      })
      .catch(() => { /* silently keep fallback */ });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Scoped Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: servicesStyles }} />

      <section
        ref={sectionRef}
        id="services"
        className="services-section"
      >
        <div className="services-wrapper">
          {/* ─── Header ─── */}
          <div className="services-header">
            <div className="services-header__left">
              <span className="services-header__label">
                <AnimatedText text="What We Do" delayOffset={0} wordDelay={0.04} />
              </span>
              <h2 className="services-header__heading">
                <AnimatedText text="Clear Planning." delayOffset={0.1} wordDelay={0.04} />
                <br />
                <AnimatedText text="Building Designs." wordClassName="services-header__heading--accent" delayOffset={0.15} wordDelay={0.04} />
              </h2>
            </div>

            <p
              className="services-header__description"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition:
                  "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              We combine technical expertise with creative vision to deliver
              architectural solutions that are both innovative and practical. Our
              integrated approach ensures seamless coordination between design and
              execution.
            </p>
          </div>

          {/* ─── Cards Grid ─── */}
          <div className="services-grid">
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                isVisible={isVisible}
                onViewMore={setActiveService}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popup Modal ─── */}
      {activeService && (
        <ServicePopup
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */
const servicesStyles = `
/* === Section === */
.services-section {
  background: #ffffff;
  color: #111111;
  padding: 40px 0 60px;
  position: relative;
  overflow: hidden;
}

.services-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

/* === Header === */
.services-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 60px;
  margin-bottom: 64px;
}

.services-header__left {
  flex: 1;
  min-width: 0;
}

.services-header__label {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  color: #111;
  letter-spacing: 0.01em;
  margin-bottom: 20px;
  border-bottom: 2px solid #111;
  padding-bottom: 3px;
  line-height: 1;
}

.services-header__heading {
  font-size: clamp(36px, 4.2vw, 56px);
  font-weight: 700;
  color: #111;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.services-header__heading--accent {
  background: linear-gradient(135deg, #93b8f7 0%, #a8c4f9 40%, #c4d8fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.services-header__description {
  flex: 0 0 420px;
  font-size: 15.5px;
  line-height: 1.75;
  color: #444;
  text-align: justify;
  padding-top: 40px;
}

/* === Cards Grid === */
.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

/* === Card === */
.services-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* The 3rd card spans the first column only, creating the 2+1 layout */
.services-card:nth-child(3) {
  grid-column: 1 / 2;
}

.services-card__image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.services-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.08) 0%,
    rgba(0, 0, 0, 0.55) 100%
  );
  transition: opacity 0.4s ease;
}

.services-card__content {
  position: relative;
  z-index: 2;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.services-card__title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

.services-card__desc {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
  max-width: 400px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.2);
}

.services-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 22px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  width: fit-content;
}

.services-card__cta:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* === Service Popup Overlay === */
.svc-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: svcPopupFadeIn 0.3s ease;
}

@keyframes svcPopupFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* === Popup Card === */
.svc-popup {
  position: relative;
  background: #fff;
  border-radius: 18px;
  padding: 40px 44px 36px;
  max-width: 640px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: svcPopupSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes svcPopupSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Close X */
.svc-popup__close-x {
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #111;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.svc-popup__close-x:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

/* Title */
.svc-popup__title {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 700;
  color: #111;
  margin: 0 0 20px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  padding-right: 40px;
}

/* Description */
.svc-popup__desc {
  font-size: 15px;
  line-height: 1.75;
  color: #444;
  margin: 0;
  text-align: justify;
}

/* Footer with Close button */
.svc-popup__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

.svc-popup__close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 32px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, #6ba3f7 0%, #7db4fb 50%, #93c4ff 100%);
  color: #fff;
  font-size: 14.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(107, 163, 247, 0.3);
  letter-spacing: 0.01em;
}

.svc-popup__close-btn:hover {
  background: linear-gradient(135deg, #5a94ee 0%, #6da6f9 50%, #83b6ff 100%);
  box-shadow: 0 6px 24px rgba(107, 163, 247, 0.45);
  transform: translateY(-2px);
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .services-section {
    padding: 70px 0 80px;
  }

  .services-wrapper {
    padding: 0 24px;
  }

  .services-header {
    flex-direction: column;
    gap: 24px;
    margin-bottom: 48px;
  }

  .services-header__description {
    flex: none;
    padding-top: 0;
    text-align: left;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .services-card:nth-child(3) {
    grid-column: 1;
  }

  .services-card {
    min-height: 260px;
  }

  .services-card__title {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .services-section {
    padding: 50px 0 60px;
  }

  .services-wrapper {
    padding: 0 16px;
  }

  .services-header__heading {
    font-size: 32px;
  }

  .services-card {
    min-height: 240px;
  }

  .services-card__content {
    padding: 24px 20px;
  }

  .services-card__title {
    font-size: 20px;
  }

  .services-card__desc {
    font-size: 13px;
  }

  .svc-popup {
    padding: 32px 24px 28px;
    border-radius: 14px;
  }

  .svc-popup__title {
    font-size: 20px;
  }

  .svc-popup__desc {
    font-size: 14px;
  }

  .svc-popup__close-x {
    top: 16px;
    right: 16px;
  }
}
`;
