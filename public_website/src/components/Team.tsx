"use client";

import { useEffect, useRef, useState } from "react";

const teamMembers = [
  {
    name: "Er. NISHANTH.K",
    role: "Structural Engineer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "MOHAN B R",
    role: "Project Lead",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Community Members",
    role: "Our Growing Team",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="team"
      className="bg-black scroll-mt-20"
      style={{ padding: "75px 0" }}
    >
      <div
        ref={sectionRef}
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20"
      >
        {/* Header */}
        <div
          className={`text-center mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400 mb-4 font-medium">
            Our Team
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Meet The Experts
          </h2>
        </div>
        <p
          className={`text-center text-white/70 text-base lg:text-lg leading-relaxed max-w-3xl mx-auto mb-20 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          Our team of experienced architects and engineers brings together
          decades of expertise to deliver exceptional results for every project.
        </p>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className={`flex flex-col items-center group transition-all duration-700 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
                }`}
              style={{
                transitionDelay: isVisible ? `${300 + i * 200}ms` : "0ms",
              }}
            >
              {/* Photo Card */}
              <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden mb-5">
                {/* Person image */}
                <div
                  className="absolute inset-0 bg-cover bg-top transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${member.image})`,
                  }}
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-blue-500/40 transition-all duration-500" />

                {/* Subtle blue glow on hover */}
                <div className="absolute -inset-1 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-2xl transition-all duration-500 -z-10 blur-xl" />
              </div>

              {/* Name & Role */}
              <h3 className="text-lg font-bold text-white text-center uppercase tracking-wide group-hover:text-blue-400 transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-white/50 text-sm mt-1 group-hover:text-white/70 transition-colors duration-300">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
