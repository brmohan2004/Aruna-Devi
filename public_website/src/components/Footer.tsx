"use client";

import { useEffect, useRef, useState } from "react";
import { Instagram, Linkedin, Youtube, Twitter, Mail } from "lucide-react";

const footerLinks = {
  community: {
    title: "Community",
    links: [
      { label: "Student Community", href: "#" },
      { label: "Working Professional Community", href: "#" },
      { label: "Career", href: "#" },
    ],
  },
  quickActions: {
    title: "Quick Actions",
    links: [
      { label: "Projects", href: "#services" },
      { label: "Services", href: "#services" },
      { label: "Featured Projects", href: "#featured-projects" },
      { label: "Team", href: "#team" },
      { label: "About", href: "#about" },
      { label: "Reviews", href: "#reviews" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Blogs & News", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
  contact: {
    title: "Contact",
    links: [
      { label: "Phone", href: "#" },
      { label: "Email", href: "#" },
      { label: "Offices", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-white text-black">
      {/* Top Footer */}
      <div
        ref={footerRef}
        className="max-w-[1440px] mx-auto py-16 lg:py-20 px-6 md:px-12 lg:px-20"
      >
        <div
          className={`grid grid-cols-2 md:grid-cols-5 gap-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <span className="text-xs font-bold text-white leading-tight text-center">
                ARUNA
                <br />
                DEVI
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mt-3 max-w-[160px]">
              Structural & Architectural Design Excellence
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section, si) => (
            <div
              key={section.title}
              className={`transition-all duration-700 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{
                transitionDelay: isVisible ? `${200 + si * 100}ms` : "0ms",
              }}
            >
              <h4 className="font-bold text-base mb-5 text-black">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Follow Us */}
        <div
          className={`mt-14 pt-10 border-t border-gray-200 transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <h4 className="font-bold text-base text-black">Follow Us</h4>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative overflow-hidden">
        {/* Blueprint Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" />

        {/* Content */}
        <div
          className="relative z-10 text-center py-14 lg:py-20 px-6 md:px-12 lg:px-20"
        >
          <p className="text-gray-400 text-xs font-medium tracking-widest uppercase mb-2">
            Built By
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black tracking-wider mb-6">
            QYNTA TECH
          </h2>
          <a
            href="#"
            className="inline-flex items-center px-8 py-3.5 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Request for development
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        className="bg-black text-center py-4 px-6 md:px-12 lg:px-20"
      >
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} Aruna Devi Infra Projects Pvt. Ltd. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
