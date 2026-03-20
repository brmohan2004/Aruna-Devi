"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createLead } from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultingPopup({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    try {
      await createLead({
        type: "consulting",
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        message: formData.message.trim(),
        status: "new",
      });
      setSubmitStatus("success");
      setFormData({ name: "", phone: "", location: "", message: "" });
      setTimeout(() => {
        setSubmitStatus("idle");
        onClose();
      }, 2000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: popupStyles }} />

      <div className="consult-overlay" onClick={onClose}>
        <div
          className="consult-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close X */}
          <button
            className="consult-popup__close-x"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={26} strokeWidth={2.5} />
          </button>

          {/* Header */}
          <div className="consult-popup__header">
            <h2 className="consult-popup__title">
              Ready to start planning?
              <br />
              <span className="consult-popup__title--accent">
                let&apos;s talk
              </span>
            </h2>
            <p className="consult-popup__subtitle">
              Fill the form below and our team will be get back to you within
              24 hours.
            </p>
          </div>

          {/* Form */}
          <form className="consult-popup__form" onSubmit={handleSubmit}>
            {/* Row 1: Name + Phone */}
            <div className="consult-popup__row">
              <div className="consult-popup__field">
                <label className="consult-popup__label" htmlFor="consult-name">
                  Your Name
                </label>
                <input
                  id="consult-name"
                  name="name"
                  type="text"
                  className="consult-popup__input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="consult-popup__field">
                <label className="consult-popup__label" htmlFor="consult-phone">
                  Phone number
                </label>
                <input
                  id="consult-phone"
                  name="phone"
                  type="tel"
                  className="consult-popup__input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Project Location */}
            <div className="consult-popup__row consult-popup__row--half">
              <div className="consult-popup__field">
                <label
                  className="consult-popup__label"
                  htmlFor="consult-location"
                >
                  Project Location
                </label>
                <input
                  id="consult-location"
                  name="location"
                  type="text"
                  className="consult-popup__input"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3: Brief Message */}
            <div className="consult-popup__field">
              <label
                className="consult-popup__label"
                htmlFor="consult-message"
              >
                Brief Message
              </label>
              <textarea
                id="consult-message"
                name="message"
                className="consult-popup__textarea"
                rows={5}
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* Feedback */}
            {submitStatus === "success" && (
              <p style={{ color: "#16a34a", fontSize: "14px", margin: "0 0 8px", textAlign: "center" }}>
                ✓ Thank you! Our team will get back to you within 24 hours.
              </p>
            )}
            {submitStatus === "error" && (
              <p style={{ color: "#dc2626", fontSize: "14px", margin: "0 0 8px", textAlign: "center" }}>
                Something went wrong. Please try again.
              </p>
            )}

            {/* Footer Buttons */}
            <div className="consult-popup__footer">
              <button
                type="button"
                className="consult-popup__btn consult-popup__btn--close"
                onClick={onClose}
                disabled={submitting}
              >
                Close
              </button>
              <button
                type="submit"
                className="consult-popup__btn consult-popup__btn--submit"
                disabled={submitting}
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const popupStyles = `
/* === Overlay === */
.consult-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: consultFadeIn 0.3s ease;
}

@keyframes consultFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* === Popup Card === */
.consult-popup {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px 28px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: consultSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes consultSlideUp {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Close X */
.consult-popup__close-x {
  position: absolute;
  top: 18px;
  right: 22px;
  background: none;
  border: none;
  cursor: pointer;
  color: #111;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.consult-popup__close-x:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

/* === Header === */
.consult-popup__header {
  margin-bottom: 18px;
}

.consult-popup__title {
  font-size: clamp(22px, 3vw, 26px);
  font-weight: 700;
  color: #111;
  margin: 0 0 8px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  padding-right: 36px;
}

.consult-popup__title--accent {
  background: linear-gradient(135deg, #6ba3f7 0%, #93c4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.consult-popup__subtitle {
  font-size: 13.5px;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

/* === Form === */
.consult-popup__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.consult-popup__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.consult-popup__row--half {
  grid-template-columns: 1fr 1fr;
}

.consult-popup__field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.consult-popup__label {
  font-size: 13.5px;
  font-weight: 600;
  color: #111;
  letter-spacing: 0.01em;
}

.consult-popup__input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #d0d0d0;
  font-size: 14px;
  color: #111;
  background: #fff;
  outline: none;
  transition: all 0.25s ease;
  font-family: inherit;
}

.consult-popup__input:focus {
  border-color: #6ba3f7;
  box-shadow: 0 0 0 3px rgba(107, 163, 247, 0.12);
}

.consult-popup__textarea {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #d0d0d0;
  font-size: 14px;
  color: #111;
  background: #fff;
  outline: none;
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  transition: all 0.25s ease;
}

.consult-popup__textarea:focus {
  border-color: #6ba3f7;
  box-shadow: 0 0 0 3px rgba(107, 163, 247, 0.12);
}

/* === Footer Buttons === */
.consult-popup__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

.consult-popup__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 26px;
  border-radius: 50px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.01em;
}

.consult-popup__btn--close {
  background: #fff;
  color: #333;
  border: 1.5px solid #d0d0d0;
}

.consult-popup__btn--close:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.consult-popup__btn--submit {
  background: linear-gradient(135deg, #4a9af5 0%, #5eaaff 50%, #72b8ff 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(74, 154, 245, 0.3);
}

.consult-popup__btn--submit:hover {
  background: linear-gradient(135deg, #3a8ae5 0%, #4e9af5 50%, #62a8ff 100%);
  box-shadow: 0 6px 24px rgba(74, 154, 245, 0.45);
  transform: translateY(-2px);
}

/* === Responsive === */
@media (max-width: 640px) {
  .consult-overlay {
    padding: 12px;
    align-items: center;
  }

  .consult-popup {
    padding: 24px 20px 22px;
    border-radius: 14px;
    max-height: 92vh;
  }

  .consult-popup__close-x {
    top: 12px;
    right: 14px;
  }

  .consult-popup__close-x svg {
    width: 20px;
    height: 20px;
  }

  .consult-popup__header {
    margin-bottom: 16px;
  }

  .consult-popup__title {
    font-size: 20px;
    margin-bottom: 6px;
    padding-right: 30px;
  }

  .consult-popup__subtitle {
    font-size: 12.5px;
    line-height: 1.5;
  }

  .consult-popup__form {
    gap: 12px;
  }

  .consult-popup__row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .consult-popup__row--half {
    grid-template-columns: 1fr;
  }

  .consult-popup__field {
    gap: 4px;
  }

  .consult-popup__label {
    font-size: 13px;
  }

  .consult-popup__input {
    padding: 10px 12px;
    font-size: 13.5px;
    border-radius: 8px;
    border-width: 1px;
  }

  .consult-popup__textarea {
    padding: 10px 12px;
    font-size: 13.5px;
    border-radius: 8px;
    min-height: 80px;
    border-width: 1px;
  }

  .consult-popup__footer {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 4px;
    gap: 10px;
  }

  .consult-popup__btn {
    padding: 9px 20px;
    font-size: 13px;
  }
}
`;
