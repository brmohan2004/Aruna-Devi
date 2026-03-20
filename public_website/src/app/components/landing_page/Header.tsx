"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import ConsultingPopup from "./ConsultingPopup";

import { navLinks as INITIAL_NAV_LINKS } from "@/app/data/navigation";

interface HeaderProps {
  onJoinCommunity: () => void;
}

export default function Header({ onJoinCommunity }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [passedProjects, setPassedProjects] = useState(false);
  const [isConsultingOpen, setIsConsultingOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState("Projects");

  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const heroTarget = document.getElementById("hero-projects-text");
      if (heroTarget) {
        const rect = heroTarget.getBoundingClientRect();
        setPassedProjects(rect.top < 80);
      } else {
        setPassedProjects(window.scrollY > window.innerHeight * 0.7);
      }

      // Scroll Spy Logic
      const sections = INITIAL_NAV_LINKS.map(link => {
        const id = link.href.replace("#", "");
        let elementId = id;
        if (id === "featured-projects") elementId = "projects-section";

        return {
          label: link.label,
          element: document.getElementById(elementId)
        };
      });

      const currentSection = sections.find(section => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        // Check if section is currently visible in viewport (with some offset)
        return rect.top <= 120 && rect.bottom >= 120;
      });

      if (currentSection && currentSection.label !== activeLabel) {
        setActiveLabel(currentSection.label);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeLabel]);

  // Update indicator position
  useEffect(() => {
    const activeLink = navRef.current?.querySelector(".site-header__nav-link--active") as HTMLElement;
    if (activeLink) {
      setIndicatorStyle({
        width: `${activeLink.offsetWidth}px`,
        left: `${activeLink.offsetLeft}px`,
        opacity: 1
      });
    } else {
      setIndicatorStyle({ opacity: 0 });
    }
  }, [activeLabel]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <header
        className={`site-header ${scrolled ? "site-header--scrolled" : ""} ${passedProjects ? "site-header--floating" : ""
          }`}
      >
        <div className="site-header__container">
          <div className="site-header__inner">

            <div className="site-header__logo-area">
              {/* Logo */}
              <a href="#" className="site-header__logo">
                <img
                  src="/public_website/logo.png"
                  alt="DE-CODE logo"
                  className="site-header__logo-img"
                />
              </a>
            </div>

            {/* Desktop Nav - Centered perfectly */}
            <nav className="site-header__nav" ref={navRef}>
              {INITIAL_NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`site-header__nav-link ${activeLabel === link.label ? "site-header__nav-link--active" : ""
                    }`}
                >
                  {link.label}
                </a>
              ))}
              <span className="site-header__nav-indicator" style={indicatorStyle} />
            </nav>

            <div className="site-header__actions">
              {/* Get Free Consulting Button - Appears on scroll */}
              {passedProjects && (
                <button
                  onClick={() => setIsConsultingOpen(true)}
                  className="site-header__consult-btn"
                >
                  Get Free Consulting
                </button>
              )}

              {/* Join Community Button */}
              <button
                onClick={onJoinCommunity}
                className={`site-header__btn ${!passedProjects ? "site-header__btn--hero" : ""}`}
              >
                Join Community
              </button>

              {/* Mobile Toggle */}
              <button
                className="site-header__mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`site-header__mobile-menu ${mobileOpen ? "site-header__mobile-menu--open" : ""
            }`}
        >
          <nav className="site-header__mobile-nav">
            {INITIAL_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`site-header__mobile-link ${activeLabel === link.label ? "site-header__mobile-link--active" : ""
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onJoinCommunity();
              }}
              className="site-header__mobile-btn"
            >
              Join Community
            </button>
          </nav>
        </div>
      </header>

      {/* Consulting Popup */}
      <ConsultingPopup
        isOpen={isConsultingOpen}
        onClose={() => setIsConsultingOpen(false)}
      />
    </>
  );
}

const styles = `
/* === Header Section === */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s ease;
  padding: 16px 0;
  background: transparent;
}
.site-header--scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 4px 0;
}
.site-header--scrolled .site-header__inner {
  height: 60px;
}

.site-header--floating {
  max-width: 95%;
  width: 1400px;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 15px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.site-header__container {
  width: 100%;
  padding: 0 20px;
  max-width: 1440px;
  margin: 0 auto;
}
@media (min-width: 1024px) {
  .site-header__container {
    padding: 0 40px; /* Reduced from 70px for floating state */
  }
}

.site-header__inner {
  display: flex;
  align-items: center;
  height: 80px;
  position: relative;
  transition: height 0.3s ease;
}

.site-header__logo-area {
  display: flex;
  align-items: center;
}
.site-header__logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}
.site-header__logo-img {
  width: 58px;
  height: 58px;
  object-fit: contain;
}

.site-header__nav {
  display: none;
}
@media (min-width: 1024px) {
  .site-header__nav {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-left: 70px; /* Reduced spacing from logo */
  }
}
@media (min-width: 1280px) {
  .site-header__nav {
    gap: 40px;
  }
}

.site-header__nav-link {
  font-size: 15.5px;
  white-space: nowrap;
  transition: color 0.3s ease;
  position: relative;
  padding-bottom: 8px; /* Added more space below text */
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.site-header__nav-link:hover {
  color: #111;
}
.site-header__nav-link--active {
  color: #111;
  font-weight: 600;
}
.site-header__nav-indicator {
  display: none;
  position: absolute;
  bottom: 20px;
  height: 2px;
  background-color: #111;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 99px;
}
@media (min-width: 1024px) {
  .site-header__nav-indicator {
    display: block;
  }
}

.site-header__actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.site-header__btn {
  display: none;
  align-items: center;
  padding: 10px 28px;
  border: 1px solid #333;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 500;
  color: #111;
  background-color: transparent;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}
.site-header__btn--hero {
  background-color: #000 !important;
  color: #fff !important;
  border-color: #000 !important;
}
.site-header__btn:hover {
  background-color: #111;
  color: #fff;
}
@media (min-width: 1024px) {
  .site-header__btn {
    display: inline-flex;
  }
}

.site-header__consult-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 500;
  margin-right: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.site-header__mobile-toggle {
  display: inline-flex;
  padding: 8px;
  margin-left: 16px;
  color: #000;
  background: transparent;
  border: none;
  cursor: pointer;
}
@media (min-width: 1024px) {
  .site-header__mobile-toggle {
    display: none;
  }
}

.site-header__mobile-menu {
  display: block;
  overflow: hidden;
  transition: max-height 0.5s ease, border-color 0.5s ease;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  max-height: 0;
  border-top: none;
}
@media (min-width: 1024px) {
  .site-header__mobile-menu {
    display: none;
  }
}
.site-header__mobile-menu--open {
  max-height: 500px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.site-header__mobile-nav {
  padding: 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 1024px) {
  .site-header__mobile-nav {
    padding-left: 60px;
    padding-right: 60px;
  }
}

.site-header__mobile-link {
  font-size: 16px;
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #444;
  font-weight: 500;
}
.site-header__mobile-link:hover {
  color: #111;
}
.site-header__mobile-link--active {
  color: #111;
  font-weight: 600;
}

.site-header__mobile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
  padding: 12px 24px;
  border: 1px solid #333;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 500;
  color: #111;
  background-color: transparent;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}
.site-header__mobile-btn:hover {
  background-color: #111;
  color: #fff;
}
`;
