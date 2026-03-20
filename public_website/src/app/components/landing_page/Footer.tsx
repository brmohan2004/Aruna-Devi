"use client";

import { useEffect, useRef, useState } from "react";
import { listSiteSettings } from "@/lib/api";

import { communityLinks, quickActionLinks, resourceLinks, FALLBACK_CONTACT } from "@/app/data/navigation";

/* Map social label → Appwrite site_settings key */
const SOCIAL_KEY_MAP: Record<string, string> = {
    Facebook: "facebook_url",
    Instagram: "instagram_url",
    YouTube: "youtube_url",
    LinkedIn: "linkedin_url",
    X: "twitter_url",
    Discord: "discord_url",
};

/* Social icons as inline SVGs */
const socials = [
    {
        label: "Facebook",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        label: "YouTube",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "X",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: "Discord",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
        ),
    },
];

/* ────────────────────────────────────────────
   Footer Component
   ──────────────────────────────────────────── */
export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [contactInfo, setContactInfo] = useState(FALLBACK_CONTACT);
    const [socialHrefs, setSocialHrefs] = useState<Record<string, string>>({});

    // Fetch contact + social site settings from Appwrite
    useEffect(() => {
        listSiteSettings("contact")
            .then((docs) => {
                if (docs.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const kv: Record<string, string> = {};
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    docs.forEach((d: any) => { if (d.key && d.value) kv[d.key] = d.value; });
                    const items = [];
                    if (kv.phone) items.push({ text: kv.phone, href: `tel:${kv.phone.replace(/\s/g, "")}` });
                    if (kv.email) items.push({ text: kv.email, href: `mailto:${kv.email}` });
                    if (kv.address) items.push({ text: kv.address, href: "#" });
                    if (items.length > 0) setContactInfo(items);
                }
            })
            .catch(() => { /* silently keep fallback */ });

        listSiteSettings("social")
            .then((docs) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const hrefs: Record<string, string> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                docs.forEach((d: any) => { if (d.key && d.value) hrefs[d.key] = d.value; });
                setSocialHrefs(hrefs);
            })
            .catch(() => { /* silently keep fallback */ });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (footerRef.current) observer.observe(footerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: footerStyles }} />

            <footer ref={footerRef} id="footer" className="footer-section">
                <div className="footer-wrapper">
                    {/* ─── Top Row: Logo + 4 Columns ─── */}
                    <div
                        className="footer-top"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(30px)",
                            transition:
                                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        {/* Logo */}
                        <div className="footer-logo">
                            <img src="/public_website/logo.png" alt="DE-CODE Logo" className="footer-logo__img" />
                            <span className="footer-logo__text">DE-CODE</span>
                        </div>

                        {/* Community Column */}
                        <div className="footer-col">
                            <h4 className="footer-col__title">Community</h4>
                            <ul className="footer-col__list">
                                {communityLinks.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="footer-col__link">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Actions Column */}
                        <div className="footer-col">
                            <h4 className="footer-col__title">Quick Actions</h4>
                            <ul className="footer-col__list">
                                {quickActionLinks.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="footer-col__link">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div className="footer-col">
                            <h4 className="footer-col__title">Resources</h4>
                            <ul className="footer-col__list">
                                {resourceLinks.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="footer-col__link">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="footer-col">
                            <h4 className="footer-col__title">Contact</h4>
                            <ul className="footer-col__list">
                                {contactInfo.map((item) => (
                                    <li key={item.text}>
                                        <a href={item.href} className="footer-col__link">
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ─── Follow Us ─── */}
                    <div
                        className="footer-follow"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translateY(0)" : "translateY(20px)",
                            transition:
                                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                        }}
                    >
                        <h4 className="footer-follow__title">Follow Us</h4>
                        <div className="footer-follow__icons">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={socialHrefs[SOCIAL_KEY_MAP[social.label]] || social.href}
                                    className="footer-social-icon"
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */
const footerStyles = `
/* === Section === */
.footer-section {
  background: #ffffff;
  color: #111111;
  padding: 40px 0 60px;
  position: relative;
  border-top: 1px solid #e5e5e5;
}

.footer-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 4%;
}

/* === Top Row === */
.footer-top {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid #e5e5e5;
}

/* Logo */
.footer-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.footer-logo__img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.footer-logo__text {
  font-size: 12px;
  font-weight: 700;
  color: #111;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Columns */
.footer-col {
  flex: 1;
}

.footer-col__title {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin: 0 0 16px;
  border-bottom: 2px solid #111;
  padding-bottom: 4px;
  display: inline-block;
  letter-spacing: 0.01em;
}

.footer-col__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col__link {
  font-size: 14px;
  color: #444;
  text-decoration: none;
  transition: color 0.25s ease;
  line-height: 1.5;
}

.footer-col__link:hover {
  color: #111;
}

/* === Follow Us === */
.footer-follow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  gap: 20px;
}

.footer-follow__title {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin: 0;
  border-bottom: 2px solid #111;
  padding-bottom: 4px;
  display: inline-block;
  letter-spacing: 0.01em;
}

.footer-follow__icons {
  display: flex;
  gap: 24px;
  align-items: center;
}

.footer-social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111;
  transition: all 0.3s ease;
}

.footer-social-icon:hover {
  color: #3b82f6;
  transform: translateY(-3px);
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .footer-section {
    padding: 60px 0 48px;
  }

  .footer-top {
    flex-wrap: wrap;
    gap: 32px;
  }

  .footer-logo {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }

  .footer-col {
    flex: 0 0 calc(50% - 16px);
  }
}

@media (max-width: 580px) {
  .footer-section {
    padding: 48px 0 36px;
  }

  .footer-top {
    flex-direction: column;
    gap: 28px;
  }

  .footer-col {
    flex: none;
    width: 100%;
  }

  .footer-follow__icons {
    gap: 18px;
  }

  .footer-social-icon svg {
    width: 20px;
    height: 20px;
  }
}
`;
