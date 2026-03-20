"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { isVideoUrl } from "@/app/data/projects";
import type { ProjectDetail } from "@/app/data/projects";

interface Props {
  project: ProjectDetail;
}

export default function ProjectDetailHero({ project }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const mediaSrc = project.heroMedia || project.image;
  const isVideo = isVideoUrl(mediaSrc);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="pd-hero">
        {/* Background media — video or image */}
        {isVideo ? (
          <video
            className="pd-hero__video"
            src={mediaSrc}
            autoPlay
            loop
            muted
            playsInline
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "scale(1)" : "scale(1.08)",
            }}
          />
        ) : (
          <div
            className="pd-hero__bg"
            style={{
              backgroundImage: `url(${mediaSrc})`,
              transform: isLoaded ? "scale(1)" : "scale(1.08)",
            }}
          />
        )}

        {/* Gradient overlays */}
        <div className="pd-hero__overlay" />
        <div className="pd-hero__overlay-bottom" />

        {/* Back Button */}
        <Link
          href="/#projects-section"
          className="pd-hero__back"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateX(0)" : "translateX(-20px)",
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          <span>Back to Projects</span>
        </Link>

        {/* Content overlay */}
        <div className="pd-hero__content">
          <h1
            className="pd-hero__title"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(30px)",
            }}
          >
            {project.title} in {project.location}
          </h1>
          <p
            className="pd-hero__desc"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.15s",
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="pd-hero__scroll"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          <ChevronDown size={20} strokeWidth={2} />
        </div>
      </section>
    </>
  );
}

const styles = `
/* === Hero Section === */
.pd-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.pd-hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* Video background */
.pd-hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 1s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

/* Top overlay: subtle dark for readability */
.pd-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0.05) 40%,
    transparent 60%
  );
  z-index: 1;
}

/* Bottom overlay: strong gradient for text */
.pd-hero__overlay-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.35) 40%,
    rgba(0, 0, 0, 0.72) 100%
  );
  z-index: 1;
}

/* Back button */
.pd-hero__back {
  position: absolute;
  top: 32px;
  left: 4%;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.01em;
}

.pd-hero__back:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: translateX(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Content */
.pd-hero__content {
  position: relative;
  z-index: 2;
  padding: 0 4% 100px;
  max-width: 800px;
}

.pd-hero__title {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.pd-hero__desc {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  max-width: 620px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scroll indicator */
.pd-hero__scroll {
  position: absolute;
  bottom: 24px;
  right: 4%;
  z-index: 3;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  animation: pdScrollBounce 2s ease-in-out infinite;
}

@keyframes pdScrollBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .pd-hero {
    height: 100vh;
    min-height: 100vh;
  }

  .pd-hero__back {
    top: 24px;
    left: 16px;
    padding: 8px 16px;
    font-size: 12.5px;
  }

  .pd-hero__content {
    padding: 0 20px 90px;
  }

  .pd-hero__desc {
    font-size: 13.5px;
  }

  .pd-hero__scroll {
    display: none;
  }
}
`;
