"use client";

import { useEffect, useRef, useState } from "react";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setCountersStarted(true), 500);
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
      id="about"
      className="bg-black scroll-mt-20"
      style={{ padding: "75px 0" }}
    >
      <div
        ref={sectionRef}
        className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20"
      >
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-blue-400 mb-4 font-medium">
            Our Story
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Building Dreams
          </h2>
        </div>

        {/* Text Content */}
        <div
          className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-6">
            Aruna Devi Infra Projects and Pvt. Ltd. was founded with a simple
            mission: to provide structural and architectural design services that
            combine technical excellence with creative innovation. What started
            as a small design studio has grown into a full-service architectural
            firm serving clients across South India.
          </p>
          <p className="text-white/70 text-base lg:text-lg leading-relaxed">
            Today, we are proud to have completed over 200 projects, ranging
            from luxury villas in Kodaikanal to high-rise commercial complexes
            in Coimbatore. Our commitment to quality, safety, and client
            satisfaction remains at the heart of everything we do.
          </p>
        </div>

        {/* Image Mosaic + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left - 2×2 Image Mosaic */}
          <div
            className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-300 ${isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
              }`}
          >
            <div className="relative overflow-hidden rounded-2xl h-52 lg:h-64 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-2xl h-52 lg:h-64 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-2xl h-52 lg:h-64 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="relative overflow-hidden rounded-2xl h-52 lg:h-64 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=2070&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>

          {/* Right - Stats */}
          <div
            className={`flex flex-col items-center lg:items-start gap-12 transition-all duration-700 delay-500 ${isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12"
              }`}
          >
            <div className="grid grid-cols-2 gap-10 w-full max-w-sm">
              {/* Stat 1 */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <p className="text-5xl lg:text-7xl font-bold text-blue-500 tabular-nums">
                    <AnimatedCounter
                      target={5}
                      started={countersStarted}
                      suffix="+"
                    />
                  </p>
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
                </div>
                <p className="text-white/60 text-sm mt-3 font-medium">
                  Projects Completed
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <p className="text-5xl lg:text-7xl font-bold text-blue-500 tabular-nums">
                    <AnimatedCounter
                      target={100}
                      started={countersStarted}
                      suffix="+"
                    />
                  </p>
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
                </div>
                <p className="text-white/60 text-sm mt-3 font-medium leading-snug">
                  Community Members
                  <br />
                  Across Tamil Nadu
                </p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="#community"
              className="inline-flex items-center px-8 py-3.5 border border-white/30 rounded-full text-sm font-medium text-white hover:bg-white hover:text-black transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              Join Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Animated Counter Component */
function AnimatedCounter({
  target,
  started,
  suffix = "",
}: {
  target: number;
  started: boolean;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    const stepDelay = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDelay);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}
