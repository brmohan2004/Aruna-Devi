"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectDetail } from "@/app/data/projects";

interface Props {
  project: ProjectDetail;
}

export default function ProjectChallengesOutcomes({ project }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section ref={sectionRef} className="pd-co">
        <div className="pd-co__wrapper">
          {/* Left Column: The Challenges */}
          <div
            className="pd-co__col pd-co__col--left"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-30px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h2 className="pd-co__heading">The Challenges</h2>
            <p className="pd-co__text">{project.challenges}</p>
          </div>

          {/* Right Column: Key Outcomes */}
          <div
            className="pd-co__col pd-co__col--right"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(30px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            <h2 className="pd-co__heading">Key outcomes</h2>
            <ul className="pd-co__list">
              {project.keyOutcomes.map((outcome, i) => (
                <li
                  key={i}
                  className="pd-co__list-item"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.08}s`,
                  }}
                >
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Solutions Section */}
        <div
          className="pd-co__solutions"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(25px)",
            transition:
              "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
          }}
        >
          <h2 className="pd-co__heading">The Solutions</h2>
          <p className="pd-co__text pd-co__text--wide">{project.solutions}</p>
        </div>
      </section>
    </>
  );
}

const styles = `
/* === Challenges & Outcomes Section === */
.pd-co {
  background: #ffffff;
  padding: 60px 0 20px;
}

.pd-co__wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.pd-co__heading {
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 700;
  color: #111;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  line-height: 1.2;
}

.pd-co__text {
  font-size: 15px;
  line-height: 1.75;
  color: #555;
  margin: 0;
}

.pd-co__text--wide {
  max-width: 900px;
}

.pd-co__list {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pd-co__list-item {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
}

.pd-co__list-item::marker {
  color: #333;
}

/* Solutions */
.pd-co__solutions {
  max-width: 100%;
  margin: 0 auto;
  padding: 48px 4% 0;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .pd-co {
    padding: 40px 0 16px;
  }

  .pd-co__wrapper {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 20px;
  }

  .pd-co__solutions {
    padding: 32px 20px 0;
  }

  .pd-co__heading {
    font-size: 22px;
  }

  .pd-co__text,
  .pd-co__list-item {
    font-size: 14px;
  }
}
`;
