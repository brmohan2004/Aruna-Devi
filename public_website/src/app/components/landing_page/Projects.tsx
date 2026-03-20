"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import AnimatedText from "./AnimatedText";
import { projects as FALLBACK_PROJECTS, categories as FALLBACK_CATEGORIES } from "@/app/data/projects";
import type { Category, ProjectDetail } from "@/app/data/projects";
import { listProjects, getFileUrl } from "@/lib/api";
import { IMAGES_BUCKET } from "@/lib/appwrite";
import { Query } from "appwrite";

/* ────────────────────────────────────────────
   Project Card Component
   ──────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: ProjectDetail;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="projects-card"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s`,
        textDecoration: "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="projects-card__image-wrap">
        <div
          className="projects-card__image"
          style={{
            backgroundImage: `url(${project.image})`,
            transform: isHovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Bottom gradient overlay */}
        <div className="projects-card__gradient" />

        {/* Cursor icon – top right */}
        <div
          className="projects-card__icon"
          style={{
            opacity: isHovered ? 1 : 0.7,
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <MousePointerClick size={18} strokeWidth={1.8} />
        </div>

        {/* Text overlay – bottom left */}
        <div className="projects-card__info">
          <h3 className="projects-card__title">{project.title}</h3>
          <p className="projects-card__location">{project.location}</p>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────
   Projects Section
   ──────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [animateCards, setAnimateCards] = useState(true);
  const [projects, setProjects] = useState<ProjectDetail[]>(FALLBACK_PROJECTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  // Fetch projects from Appwrite
  useEffect(() => {
    listProjects([Query.equal("status", "published")])
      .then((docs) => {
        if (docs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: ProjectDetail[] = docs.map((doc: any) => ({
            id: doc.slug ?? doc.$id,
            title: doc.title ?? "",
            location: doc.location ?? "",
            category: (doc.category as Category) ?? "Residential",
            image: doc.thumbnail_id
              ? getFileUrl(IMAGES_BUCKET, doc.thumbnail_id)
              : "/public_website/projects/skyline-residential.png",
            heroMedia: doc.hero_image_id
              ? getFileUrl(IMAGES_BUCKET, doc.hero_image_id)
              : undefined,
            client: doc.client_name ?? "",
            area: doc.area ?? "",
            duration: doc.duration ?? "",
            description: doc.description ?? "",
            challenges: doc.challenges ?? "",
            solutions: doc.solutions ?? "",
            keyOutcomes: Array.isArray(doc.key_outcomes) ? doc.key_outcomes : [],
            gallery: Array.isArray(doc.gallery_ids)
              ? doc.gallery_ids.map((fid: string) => getFileUrl(IMAGES_BUCKET, fid))
              : [],
          }));
          setProjects(mapped);
          // Derive unique categories from data
          const uniqueCats = Array.from(new Set(mapped.map((p) => p.category)));
          setCategories(["All", ...uniqueCats] as Category[]);
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory, projects]
  );

  const handleCategoryChange = (cat: Category) => {
    if (cat === activeCategory) return;
    setAnimateCards(false);
    setActiveCategory(cat);
    // Re-trigger entrance animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimateCards(true);
      });
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: projectsStyles }} />

      <section ref={sectionRef} id="projects-section" className="projects-section">
        <div className="projects-wrapper">
          {/* ─── Header ─── */}
          <div className="projects-header">
            <span className="projects-header__label">
              <AnimatedText text="Our Works" delayOffset={0} wordDelay={0.04} />
            </span>

            <h2 className="projects-header__heading">
              <AnimatedText text="Featured projects" delayOffset={0.1} wordDelay={0.04} />
            </h2>

            <p
              className="projects-header__description"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(25px)",
                transition:
                  "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
              }}
            >
              Explore our portfolio of completed projects spanning residential,
              <br className="projects-header__br" />
              commercial, and villa developments.
            </p>
          </div>

          {/* ─── Filter Tabs ─── */}
          <div
            className="projects-filters"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`projects-filter-btn ${activeCategory === cat ? "projects-filter-btn--active" : ""
                  }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ─── Cards Grid ─── */}
          <div className="projects-grid">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isVisible={isVisible && animateCards}
              />
            ))}
          </div>

          {/* ─── View All Button ─── */}
          <div
            className="projects-cta-wrap"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <a href="#all-projects" className="projects-cta-btn">
              View all projects
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */
const projectsStyles = `
/* === Section === */
.projects-section {
  background: #ffffff;
  color: #111111;
  padding: 40px 0 60px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #f0f0f0;
}

.projects-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

/* === Header === */
.projects-header {
  text-align: center;
  margin-bottom: 44px;
}

.projects-header__label {
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

.projects-header__heading {
  font-size: clamp(34px, 4vw, 50px);
  font-weight: 700;
  color: #111;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

.projects-header__description {
  font-size: 15.5px;
  line-height: 1.7;
  color: #555;
  margin: 0;
}

.projects-header__br {
  display: block;
}

/* === Filter Buttons === */
.projects-filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.projects-filter-btn {
  padding: 11px 30px;
  border-radius: 50px;
  border: 1.5px solid #222;
  background: transparent;
  color: #222;
  font-size: 14.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.01em;
  line-height: 1;
}

.projects-filter-btn:hover {
  background: #f5f5f5;
  border-color: #111;
}

.projects-filter-btn--active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.projects-filter-btn--active:hover {
  background: #222;
  color: #fff;
}

/* === Cards Grid === */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 56px;
}

/* === Card === */
.projects-card {
  cursor: pointer;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
}

.projects-card__image-wrap {
  position: relative;
  width: 100%;
  padding-bottom: 120%;
  overflow: hidden;
  border-radius: 18px;
  background: #f0f0f0;
}

.projects-card__image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.projects-card__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(0, 0, 0, 0.55) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* Cursor icon */
.projects-card__icon {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Info overlay */
.projects-card__info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 22px;
  z-index: 2;
}

.projects-card__title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.projects-card__location {
  font-size: 13.5px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.82);
  margin: 0;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

/* === View All Button === */
.projects-cta-wrap {
  display: flex;
  justify-content: center;
}

.projects-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 38px;
  border-radius: 50px;
  border: 1.5px solid #222;
  background: transparent;
  color: #222;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.projects-cta-btn:hover {
  background: #111;
  color: #fff;
  border-color: #111;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .projects-section {
    padding: 70px 0 80px;
  }

  .projects-wrapper {
    padding: 0 24px;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .projects-header__br {
    display: none;
  }

  .projects-filter-btn {
    padding: 10px 22px;
    font-size: 13.5px;
  }

  .projects-card__title {
    font-size: 17px;
  }
}

@media (max-width: 580px) {
  .projects-section {
    padding: 50px 0 60px;
  }

  .projects-wrapper {
    padding: 0 16px;
  }

  .projects-grid {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .projects-filters {
    gap: 8px;
    margin-bottom: 32px;
  }

  .projects-filter-btn {
    padding: 9px 18px;
    font-size: 13px;
  }

  .projects-header__heading {
    font-size: 30px;
  }

  .projects-card__image-wrap {
    padding-bottom: 130%;
  }

  .projects-card__title {
    font-size: 15px;
  }

  .projects-card__location {
    font-size: 12px;
  }

  .projects-card__info {
    padding: 16px 14px;
  }

  .projects-card__icon {
    width: 32px;
    height: 32px;
    top: 10px;
    right: 10px;
  }

  .projects-card__icon svg {
    width: 14px;
    height: 14px;
  }
}
`;
