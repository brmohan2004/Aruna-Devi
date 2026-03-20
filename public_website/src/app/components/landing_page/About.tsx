"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import { getAboutContent } from "@/lib/api";

import type { StatItem } from "@/app/data/about";
import { FALLBACK_STATS as DATA_STATS, FALLBACK_BODY as DATA_BODY } from "@/app/data/about";

/* ────────────────────────────────────────────
   About / Our Story Section
   ──────────────────────────────────────────── */
interface AboutProps {
  onJoinCommunity: () => void;
}

export default function About({ onJoinCommunity }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<StatItem[]>(DATA_STATS);
  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>(DATA_BODY);

  // Fetch About content from Appwrite
  useEffect(() => {
    getAboutContent()
      .then((doc) => {
        if (!doc) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = doc as any;
        if (d.body) {
          setBodyParagraphs([d.body]);
        }
        if (Array.isArray(d.stats) && d.stats.length) {
          try {
            const parsed: StatItem[] = d.stats.map((s: unknown) =>
              typeof s === "string" ? JSON.parse(s) : s
            );
            setStats(parsed);
          } catch { /* keep fallback */ }
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
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: aboutStyles }} />

      <section ref={sectionRef} id="about" className="about-section">
        <div className="about-wrapper">
          {/* ─── Header ─── */}
          <div className="about-header">
            <span className="about-header__label">
              <AnimatedText text="Our Story" delayOffset={0} wordDelay={0.04} />
            </span>

            <h2 className="about-header__heading">
              <AnimatedText text="Building Dreams" delayOffset={0.1} wordDelay={0.04} />
            </h2>

            <div
              className="about-header__text"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(25px)",
                transition:
                  "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
              }}
            >
              {bodyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* ─── Content: Image + Stats ─── */}
          <div className="about-content">
            {/* Left: Image */}
            <div
              className="about-content__image-wrap"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-40px)",
                transition:
                  "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
              }}
            >
              <img
                src="/public_website/projects/commercial-complex.png"
                alt="Aruna Devi Infra Projects – Building Dreams"
                className="about-content__image"
              />
            </div>

            {/* Right: Stats + CTA */}
            <div
              className="about-content__right"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(40px)",
                transition:
                  "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              }}
            >
              {/* Stats row */}
              <div className="about-stats">
                {stats.map((stat, i) => (
                  <div key={i} className="about-stat">
                    <span className="about-stat__value">{stat.value}</span>
                    <span className="about-stat__label">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Join Community Button */}
              <button onClick={onJoinCommunity} className="about-cta-btn">
                Join Community
              </button>
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
const aboutStyles = `
/* === Section === */
.about-section {
  background: #ffffff;
  color: #111111;
  padding: 40px 0 60px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #f0f0f0;
}

.about-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

/* === Header === */
.about-header {
  text-align: center;
  margin-bottom: 56px;
}

.about-header__label {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  color: #111;
  letter-spacing: 0.01em;
  margin-bottom: 16px;
  border-bottom: 2px solid #111;
  padding-bottom: 3px;
  line-height: 1;
}

.about-header__heading {
  font-size: clamp(34px, 4vw, 50px);
  font-weight: 700;
  color: #111;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 24px;
}

.about-header__text {
  max-width: 720px;
  margin: 0 auto;
}

.about-header__text p {
  font-size: 15.5px;
  line-height: 1.75;
  color: #444;
  margin: 0 0 16px;
  text-align: center;
}

.about-header__text p:last-child {
  margin-bottom: 0;
}

/* === Content: Image + Stats Layout === */
.about-content {
  display: flex;
  align-items: center;
  gap: 60px;
}

/* Image */
.about-content__image-wrap {
  flex: 0 0 55%;
  max-width: 55%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.about-content__image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  aspect-ratio: 16 / 10;
}

/* Right side */
.about-content__right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

/* Stats */
.about-stats {
  display: flex;
  gap: 48px;
}

.about-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.about-stat__value {
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 300;
  color: #111;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.about-stat__label {
  font-size: 14px;
  font-weight: 400;
  color: #555;
  line-height: 1.4;
  max-width: 140px;
}

/* CTA Button */
.about-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
  border-radius: 50px;
  background: #111;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.about-cta-btn:hover {
  background: #333;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .about-section {
    padding: 70px 0 80px;
  }

  .about-content {
    flex-direction: column;
    gap: 40px;
  }

  .about-content__image-wrap {
    flex: none;
    max-width: 100%;
    width: 100%;
  }

  .about-content__right {
    align-items: center;
    text-align: center;
  }

  .about-stats {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .about-section {
    padding: 50px 0 60px;
  }

  .about-header__heading {
    font-size: 30px;
  }

  .about-header__text p {
    font-size: 14px;
  }

  .about-stats {
    gap: 32px;
  }

  .about-stat__value {
    font-size: 36px;
  }

  .about-cta-btn {
    padding: 14px 32px;
    font-size: 14px;
  }
}
`;
