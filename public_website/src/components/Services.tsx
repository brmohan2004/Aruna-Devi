"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "From 2D Plans to 3D Reality",
    description:
      "Experience your project before construction begins with advanced 3D visualization services.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop",
  },
  {
    title: "Architectural Planning",
    description:
      "Innovative architectural designs that blend functionality with aesthetic appeal, from concept to construction drawings.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Structural Design",
    description:
      "Complete structural engineering for residential, commercial, and industrial buildings ensuring safety and durability.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Services() {
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
      id="services"
      className="bg-black scroll-mt-20"
      style={{ padding: "75px 75px" }}
    >
      <div
        ref={sectionRef}
        className="max-w-[1440px] mx-auto"
      >
        {/* Header */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-400 mb-6 font-medium">
              What We Do
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]">
              <span className="text-white">Clear Planning.</span>
              <br />
              <span className="text-blue-500">Building Designs.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-lg">
              We combine technical expertise with creative vision to deliver
              architectural solutions that are both innovative and practical. Our
              integrated approach ensures seamless coordination between design
              and execution.
            </p>
          </div>
        </div>

        {/* Service Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className={`relative group overflow-hidden rounded-3xl w-full max-w-[600px] h-[230px] cursor-pointer transition-all duration-700 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
                }`}
              style={{
                transitionDelay: isVisible ? `${200 + i * 150}ms` : "0ms",
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500" />

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {service.title}
                </h3>
                <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-5 max-w-md">
                  {service.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium px-5 py-2.5 border border-blue-400/40 rounded-full w-fit group/link hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300"
                >
                  Learn more
                  <ArrowRight
                    size={16}
                    className="group-hover/link:translate-x-1.5 transition-transform duration-300"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
