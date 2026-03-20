"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import { projects } from "@/app/data/projects";

interface Props {
  currentProjectId: string;
}

export default function RelatedProjects({ currentProjectId }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Show all projects except the current one
  const otherProjects = projects.filter((p) => p.id !== currentProjectId);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section ref={sectionRef} className="pd-related">
        <div className="pd-related__wrapper">
          {/* Header */}
          <div
            className="pd-related__header"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(25px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h2 className="pd-related__title">Featured projects</h2>
          </div>

          {/* Horizontally scrollable cards */}
          <div
            ref={scrollRef}
            className="pd-related__scroll"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            {otherProjects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="pd-related__card"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s`,
                }}
              >
                <div className="pd-related__card-img-wrap">
                  <div
                    className="pd-related__card-img"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />

                  {/* Gradient */}
                  <div className="pd-related__card-gradient" />

                  {/* Icon */}
                  <div className="pd-related__card-icon">
                    <MousePointerClick size={16} strokeWidth={1.8} />
                  </div>

                  {/* Info */}
                  <div className="pd-related__card-info">
                    <h3 className="pd-related__card-title">{project.title}</h3>
                    <p className="pd-related__card-location">{project.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const styles = `
/* === Related Projects === */
.pd-related {
  background: #ffffff;
  padding: 20px 0 60px;
  border-top: 1px solid #f0f0f0;
}

.pd-related__wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

.pd-related__header {
  text-align: center;
  margin-bottom: 36px;
}

.pd-related__title {
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 700;
  color: #111;
  letter-spacing: -0.02em;
  margin: 0;
}

/* Scroll container */
.pd-related__scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 12px;
  scrollbar-width: none;
}

.pd-related__scroll::-webkit-scrollbar {
  display: none;
}

/* Card */
.pd-related__card {
  flex-shrink: 0;
  width: 240px;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  scroll-snap-align: start;
  transition: transform 0.3s ease;
}

.pd-related__card:hover {
  transform: translateY(-4px);
}

.pd-related__card-img-wrap {
  position: relative;
  width: 100%;
  padding-bottom: 130%;
  overflow: hidden;
  border-radius: 16px;
  background: #f0f0f0;
}

.pd-related__card-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.pd-related__card:hover .pd-related__card-img {
  transform: scale(1.06);
}

.pd-related__card-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.55) 100%);
  pointer-events: none;
  z-index: 1;
}

.pd-related__card-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.pd-related__card:hover .pd-related__card-icon {
  opacity: 1;
  transform: scale(1.1);
}

.pd-related__card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 18px 16px;
  z-index: 2;
}

.pd-related__card-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 3px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.pd-related__card-location {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .pd-related {
    padding: 16px 0 40px;
  }

  .pd-related__wrapper {
    padding: 0 16px;
  }

  .pd-related__card {
    width: 200px;
  }

  .pd-related__scroll {
    gap: 14px;
  }

  .pd-related__card-title {
    font-size: 14px;
  }

  .pd-related__card-location {
    font-size: 11.5px;
  }
}
`;
