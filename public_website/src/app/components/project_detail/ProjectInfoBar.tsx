"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectDetail } from "@/app/data/projects";

interface Props {
  project: ProjectDetail;
}

export default function ProjectInfoBar({ project }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Client", value: project.client },
    { label: "Location", value: project.location },
    { label: "Area", value: project.area },
    { label: "Duration", value: project.duration },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div
        ref={barRef}
        className="pd-infobar"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition:
            "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="pd-infobar__inner">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="pd-infobar__item"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(15px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.08}s`,
              }}
            >
              <span className="pd-infobar__label">{stat.label}</span>
              <span className="pd-infobar__value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = `
/* === Info Bar === */
.pd-infobar {
  background: #ffffff;
  padding: 0 4%;
  position: relative;
  z-index: 5;
  margin-top: -60px;
}

.pd-infobar__inner {
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.pd-infobar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 32px;
  border-right: 1px solid #f0f0f0;
  position: relative;
}

.pd-infobar__item:last-child {
  border-right: none;
}

.pd-infobar__label {
  font-size: 13px;
  font-weight: 600;
  color: #888;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}

.pd-infobar__value {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .pd-infobar {
    margin-top: -30px;
    padding: 0 16px;
  }

  .pd-infobar__inner {
    flex-wrap: wrap;
    border-radius: 14px;
  }

  .pd-infobar__item {
    flex: 0 0 50%;
    padding: 20px 22px;
    border-right: none;
  }

  .pd-infobar__item:nth-child(1),
  .pd-infobar__item:nth-child(2) {
    border-bottom: 1px solid #f0f0f0;
  }

  .pd-infobar__item:nth-child(odd) {
    border-right: 1px solid #f0f0f0;
  }

  .pd-infobar__value {
    font-size: 14.5px;
  }
}

@media (max-width: 480px) {
  .pd-infobar__item {
    padding: 16px 18px;
  }

  .pd-infobar__label {
    font-size: 12px;
  }

  .pd-infobar__value {
    font-size: 13.5px;
  }
}
`;
