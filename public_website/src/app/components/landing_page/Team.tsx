"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import { listTeamMembers, getFileUrl } from "@/lib/api";
import { IMAGES_BUCKET } from "@/lib/appwrite";
import { Query } from "appwrite";

import type { TeamMember } from "@/app/data/team";
import { FALLBACK_MEMBERS as DATA_MEMBERS } from "@/app/data/team";

/* ────────────────────────────────────────────
   Team Member Card
   ──────────────────────────────────────────── */
function TeamCard({
  member,
  index,
  isVisible,
}: {
  member: TeamMember;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="team-card"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + index * 0.15}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.25 + index * 0.15}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo with blue gradient bottom */}
      <div className="team-card__photo-wrap">
        <img
          src={member.image}
          alt={member.name}
          className="team-card__photo"
          style={{
            transform: isHovered ? "scale(1.04)" : "scale(1)",
          }}
        />
        {/* Blue gradient fade at bottom */}
        <div className="team-card__gradient" />
      </div>

      {/* Name */}
      <h3
        className="team-card__name"
        style={{
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {member.name}
      </h3>
    </div>
  );
}

/* ────────────────────────────────────────────
   Team Section
   ──────────────────────────────────────────── */
export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DATA_MEMBERS);

  // Fetch team members from Appwrite
  useEffect(() => {
    listTeamMembers([Query.equal("status", "active")])
      .then((docs) => {
        if (docs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = docs.map((doc: any) => ({
            name: doc.name ?? "",
            image: doc.photo_id
              ? getFileUrl(IMAGES_BUCKET, doc.photo_id)
              : "/public_website/projects/tech-park-tower.png",
          }));
          setTeamMembers(mapped);
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
      <style dangerouslySetInnerHTML={{ __html: teamStyles }} />

      <section ref={sectionRef} id="team" className="team-section">
        <div className="team-wrapper">
          {/* ─── Header ─── */}
          <div className="team-header">
            <span className="team-header__label">
              <AnimatedText text="Our Team" delayOffset={0} wordDelay={0.04} />
            </span>

            <p className="team-header__description">
              <AnimatedText text="Our team of experienced architects and engineers brings together decades of expertise to" delayOffset={0.1} wordDelay={0.02} />
              <br className="team-header__br" />
              <AnimatedText text="deliver exceptional results for every project." delayOffset={0.3} wordDelay={0.02} />
            </p>
          </div>

          {/* ─── Team Grid (Desktop) ─── */}
          <div className="team-desktop">
            {teamMembers.map((member, i) => (
              <TeamCard
                key={"desktop-" + member.name}
                member={member}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* ─── Team Carousel (Mobile) ─── */}
          <div className="team-mobile">
            <div className="team-track">
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="team-set" aria-hidden={setIndex > 0}>
                  {teamMembers.map((member, i) => (
                    <div key={"mobile-" + member.name + "-" + i} className="team-set-item">
                      <TeamCard
                        member={member}
                        index={i + setIndex * teamMembers.length}
                        isVisible={isVisible}
                      />
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
const teamStyles = `
/* === Section === */
.team-section {
  background: #ffffff;
  color: #111111;
  padding: 40px 0 60px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #f0f0f0;
}

.team-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

/* === Header === */
.team-header {
  text-align: center;
  margin-bottom: 64px;
}

.team-header__label {
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

.team-header__description {
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.team-header__br {
  display: block;
}

/* === Team Desktop Grid === */
.team-desktop {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.team-mobile {
  display: none;
}

/* === Card === */
.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

/* Photo wrapper */
.team-card__photo-wrap {
  position: relative;
  width: 100%;
  max-width: 340px;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  margin-bottom: 20px;
}

.team-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: block;
}

/* Blue gradient fade at the bottom */
.team-card__gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(135, 190, 245, 0.15) 30%,
    rgba(120, 180, 240, 0.4) 60%,
    rgba(100, 170, 235, 0.65) 80%,
    rgba(80, 160, 230, 0.85) 100%
  );
  pointer-events: none;
}

/* Name */
.team-card__name {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  text-align: center;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin: 0;
  transition: transform 0.3s ease, color 0.3s ease;
}

.team-card:hover .team-card__name {
  color: #3b82f6;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .team-section {
    padding: 70px 0 80px;
  }

  .team-desktop {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .team-header__br {
    display: none;
  }

  .team-card__name {
    font-size: 17px;
  }
}

@media (max-width: 640px) {
  .team-section {
    padding: 50px 0 60px;
  }

  .team-desktop {
    display: none;
  }

  .team-mobile {
    display: block;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    overflow: hidden;
    position: relative;
    padding-bottom: 20px;
  }

  /* Fade masks for elegant scrolling edges */
  .team-mobile::before,
  .team-mobile::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    z-index: 10;
    pointer-events: none;
  }
  .team-mobile::before {
    left: 0;
    background: linear-gradient(to right, #ffffff, transparent);
  }
  .team-mobile::after {
    right: 0;
    background: linear-gradient(to left, #ffffff, transparent);
  }

  .team-track {
    display: flex;
    width: max-content;
    animation: teamScroll 20s linear infinite;
  }

  .team-track:hover,
  .team-track:active {
    animation-play-state: paused;
  }

  @keyframes teamScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .team-set {
    display: flex;
    gap: 24px;
    padding-right: 24px;
  }

  .team-set-item {
    width: 250px;
    flex-shrink: 0;
  }

  .team-card {
    width: 100%;
    margin: 0 auto;
  }

  .team-card__photo-wrap {
    max-width: 100%;
  }

  .team-header__description {
    font-size: 14.5px;
  }

  .team-card__name {
    font-size: 18px;
  }
}
`;
