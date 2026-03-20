"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Residential", "Commercial", "Villa"];

const projects = [
  {
    name: "Skyline Residential",
    location: "Coimbatore",
    category: "Residential",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Tech Park Tower",
    location: "Coimbatore",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop",
  },
  {
    name: "Bridge Park Avenue",
    location: "Chennai",
    category: "Residential",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Urban Heights",
    location: "Chennai",
    category: "Commercial",
    image:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Lakeview Villa",
    location: "Kodaikanal",
    category: "Villa",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Green Meadows",
    location: "Madurai",
    category: "Villa",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Projects() {
  const [active, setActive] = useState("All");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  const displayedProjects = showAll ? filtered : filtered.slice(0, 3);

  return (
    <section
      id="featured-projects"
      className="bg-black scroll-mt-20"
      style={{ padding: "75px 0" }}
    >
      <div
        ref={sectionRef}
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20"
      >
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400 mb-4 font-medium">
            Our Works
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Futured projects
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Explore our portfolio of completed projects spanning residential,
            commercial, and villa developments.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 mb-14 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActive(cat);
                setShowAll(false);
              }}
              className={`px-7 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${active === cat
                ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                : "bg-transparent text-white/70 border-white/20 hover:border-white/50 hover:text-white hover:bg-white/5"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, i) => (
            <div
              key={`${active}-${i}`}
              className={`group relative overflow-hidden rounded-3xl h-80 lg:h-96 cursor-pointer transition-all duration-600 ${isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
                }`}
              style={{
                transitionDelay: isVisible ? `${300 + i * 120}ms` : "0ms",
              }}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />

              {/* Category Badge */}
              <div className="absolute top-5 left-5 z-20">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium rounded-full border border-white/20">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-7">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  {project.name}
                </h3>
                <p className="text-white/60 text-sm mb-4">{project.location}</p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium px-4 py-2 border border-blue-400/40 rounded-full w-fit group/link hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                >
                  Learn more
                  <ArrowRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform duration-300"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-14 transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {!showAll && filtered.length > 3 && (
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 rounded-full text-sm font-medium text-white hover:bg-white hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              View all projects
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
