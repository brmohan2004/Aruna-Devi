"use client";

import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────
   Bottom Footer / Credits Section
   ──────────────────────────────────────────── */
export default function BottomFooter() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: bottomFooterStyles }} />

            <section ref={sectionRef} className="btm-footer">
                {/* Background collage images */}
                <div className="btm-footer__bg">
                    <img
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop"
                        alt=""
                        className="btm-footer__bg-img btm-footer__bg-img--1"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop"
                        alt=""
                        className="btm-footer__bg-img btm-footer__bg-img--2"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop"
                        alt=""
                        className="btm-footer__bg-img btm-footer__bg-img--3"
                    />
                </div>

                {/* Dark overlay */}
                <div className="btm-footer__overlay" />

                {/* Content */}
                <div className="btm-footer__content">
                    <span
                        className="btm-footer__build-by"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(15px)",
                            transition:
                                "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        Build By
                    </span>

                    <h2
                        className="btm-footer__brand"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(20px)",
                            transition:
                                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                        }}
                    >
                        QYNTA TECH
                    </h2>

                    <a
                        href="#contact"
                        className="btm-footer__cta"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(15px)",
                            transition:
                                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                        }}
                    >
                        Request for development
                    </a>
                </div>

                {/* Copyright line */}
                <div
                    className="btm-footer__copyright"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                    }}
                >
                    © 2026 Aruna Devi Infra projects. All rights reserved.
                </div>
            </section>
        </>
    );
}

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */
const bottomFooterStyles = `
/* === Section === */
.btm-footer {
  position: relative;
  width: 100%;
  min-height: 220px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* === Background collage === */
.btm-footer__bg {
  position: absolute;
  inset: 0;
  display: flex;
  width: 100%;
  height: 100%;
}

.btm-footer__bg-img {
  flex: 1;
  object-fit: cover;
  object-position: center;
  min-width: 0;
}

/* Dark overlay */
.btm-footer__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

/* === Content === */
.btm-footer__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 20px 32px;
}

.btm-footer__build-by {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.04em;
}

.btm-footer__brand {
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 300;
  color: #ffffff;
  letter-spacing: 0.18em;
  margin: 0;
  line-height: 1.1;
  font-family: 'Geist', 'Courier New', monospace;
  text-transform: uppercase;
}

.btm-footer__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 50px;
  background: linear-gradient(135deg, #6ba3f7 0%, #7db4fb 50%, #93c4ff 100%);
  color: #fff;
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  border: none;
  margin-top: 8px;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(107, 163, 247, 0.3);
}

.btm-footer__cta:hover {
  background: linear-gradient(135deg, #5a94ee 0%, #6da6f9 50%, #83b6ff 100%);
  box-shadow: 0 6px 28px rgba(107, 163, 247, 0.45);
  transform: translateY(-2px);
}

/* Copyright */
.btm-footer__copyright {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 16px 4%;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
}

/* ─── Responsive ─── */
@media (max-width: 640px) {
  .btm-footer__brand {
    letter-spacing: 0.1em;
  }

  .btm-footer__content {
    padding: 36px 16px 24px;
  }

  .btm-footer__copyright {
    text-align: center;
    font-size: 12px;
  }

  .btm-footer__cta {
    padding: 11px 26px;
    font-size: 13px;
  }
}
`;
