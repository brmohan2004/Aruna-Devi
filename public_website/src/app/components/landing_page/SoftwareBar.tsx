"use client";

import { useEffect, useState } from "react";
import { listSoftwareItems, getFileUrl } from "@/lib/api";
import { IMAGES_BUCKET } from "@/lib/appwrite";

import type { SoftwareItem } from "@/app/data/software";
import { FALLBACK_SOFTWARE_ITEMS as DATA_SOFTWARE_ITEMS } from "@/app/data/software";

/* ────────────────────────────────────────────
   SoftwareBar Component
   ──────────────────────────────────────────── */
export default function SoftwareBar() {
  const [softwareItems, setSoftwareItems] = useState<SoftwareItem[]>(DATA_SOFTWARE_ITEMS);

  useEffect(() => {
    listSoftwareItems()
      .then((docs) => {
        if (docs.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = docs.map((doc: any) => ({
            id: doc.$id,
            src: doc.logo_id
              ? getFileUrl(IMAGES_BUCKET, doc.logo_id)
              : "/public_website/software/autocad.png",
            alt: doc.name ?? "",
          }));
          setSoftwareItems(mapped);
        }
      })
      .catch(() => { /* silently keep fallback */ });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: softwareBarStyles }} />

      <section className="swbar-section">
        {/* Heading */}
        <h3 className="swbar-heading">
          Engineered with industry leading Software:
        </h3>

        {/* Infinite scroll track */}
        <div className="swbar-mask">
          <div className="swbar-track">
            {/* Four identical sets for seamless infinite loop */}
            {[0, 1, 2, 3].map((setIndex) => (
              <div key={setIndex} className="swbar-set" aria-hidden={setIndex > 0}>
                {softwareItems.map((item) => (
                  <div key={item.id + setIndex} className="swbar-item">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="swbar-item__img"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ────────────────────────────────────────────
   Styles
   ──────────────────────────────────────────── */
const softwareBarStyles = `
/* === Section === */
.swbar-section {
  background: #ffffff;
  padding: 60px 0 20px;
  overflow: hidden;
  border-top: 1px solid #f0f0f0;
}

/* Heading */
.swbar-heading {
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #111;
  letter-spacing: 0.01em;
  margin: 0 0 48px;
  padding: 0 20px;
  line-height: 1.4;
}

/* Edge fade mask */
.swbar-mask {
  position: relative;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

/* Scrolling track */
.swbar-track {
  display: flex;
  width: max-content;
  animation: swbarScroll 22s linear infinite;
}

.swbar-track:hover {
  animation-play-state: paused;
}

@keyframes swbarScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* One complete set of logos */
.swbar-set {
  display: flex;
  align-items: center;
  gap: 64px;
  padding-right: 64px;
}

/* Individual item */
.swbar-item {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.swbar-item:hover {
  transform: translateY(-4px) scale(1.05);
}

/* Logo image */
.swbar-item__img {
  height: 50px;
  width: auto;
  object-fit: contain;
  display: block;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .swbar-section {
    padding: 44px 0 52px;
  }

  .swbar-heading {
    font-size: 15px;
    margin-bottom: 36px;
  }

  .swbar-set {
    gap: 48px;
    padding-right: 48px;
  }

  .swbar-item__img {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .swbar-section {
    padding: 36px 0 40px;
  }

  .swbar-heading {
    font-size: 14px;
    margin-bottom: 28px;
  }

  .swbar-set {
    gap: 36px;
    padding-right: 36px;
  }

  .swbar-item__img {
    height: 32px;
  }
}
`;
