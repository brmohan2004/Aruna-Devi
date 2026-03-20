"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createLead } from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type RoleType = "student" | "professional";

export default function CommunityPopup({ isOpen, onClose }: Props) {
  const [role, setRole] = useState<RoleType>("student");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    skills: "",
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
        type: "community",
        role,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        skills: formData.skills.trim(),
        message: formData.message.trim(),
        status: "new",
      });
      setSubmitStatus("success");
      setFormData({ name: "", phone: "", skills: "", message: "" });
      setRole("student");
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

      <div className="comm-overlay" onClick={onClose}>
        <div
          className="comm-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close X */}
          <button
            className="comm-popup__close-x"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          {/* Header */}
          <div className="comm-popup__header">
            <h2 className="comm-popup__title">
              Ready to start work together?
              <br />
              <span className="comm-popup__title--accent">
                let&apos;s Join Our community
              </span>
            </h2>
            <p className="comm-popup__subtitle">
              Fill the form below and our team will be get back to
              you within 24 hours.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="comm-popup__toggle">
            <button
              type="button"
              className={`comm-popup__toggle-btn ${role === "student" ? "comm-popup__toggle-btn--active" : ""}`}
              onClick={() => setRole("student")}
            >
              Student/Freelancer
            </button>
            <button
              type="button"
              className={`comm-popup__toggle-btn ${role === "professional" ? "comm-popup__toggle-btn--active" : ""}`}
              onClick={() => setRole("professional")}
            >
              Working professional
            </button>
          </div>

          {/* Form */}
          <form className="comm-popup__form" onSubmit={handleSubmit}>
            {/* Row 1: Name + Phone */}
            <div className="comm-popup__row">
              <div className="comm-popup__field">
                <label
                  className="comm-popup__label"
                  htmlFor="comm-name"
                >
                  Your Name
                </label>
                <input
                  id="comm-name"
                  name="name"
                  type="text"
                  className="comm-popup__input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="comm-popup__field">
                <label
                  className="comm-popup__label"
                  htmlFor="comm-phone"
                >
                  Phone number
                </label>
                <input
                  id="comm-phone"
                  name="phone"
                  type="tel"
                  className="comm-popup__input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Known Skills */}
            <div className="comm-popup__row comm-popup__row--half">
              <div className="comm-popup__field">
                <label
                  className="comm-popup__label"
                  htmlFor="comm-skills"
                >
                  Known Skills
                </label>
                <input
                  id="comm-skills"
                  name="skills"
                  type="text"
                  className="comm-popup__input"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 3: Brief Message */}
            <div className="comm-popup__field">
              <label
                className="comm-popup__label"
                htmlFor="comm-message"
              >
                Brief Message
              </label>
              <textarea
                id="comm-message"
                name="message"
                className="comm-popup__textarea"
                rows={4}
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
            <div className="comm-popup__footer">
              <button
                type="button"
                className="comm-popup__btn comm-popup__btn--close"
                onClick={onClose}
                disabled={submitting}
              >
                Close
              </button>
              <div className="comm-popup__submit-wrap">
                <button
                  type="submit"
                  className="comm-popup__btn comm-popup__btn--submit"
                  disabled={submitting}
                  style={{ opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
                <span className="comm-popup__note">
                  *Submit request for joining community
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const popupStyles = `
/* === Overlay === */
.comm-overlay {
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
  animation: commFadeIn 0.3s ease;
}

@keyframes commFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* === Popup Card === */
.comm-popup {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px 28px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: commSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes commSlideUp {
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
.comm-popup__close-x {
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

.comm-popup__close-x:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

/* === Header === */
.comm-popup__header {
  margin-bottom: 16px;
}

.comm-popup__title {
  font-size: clamp(22px, 3vw, 26px);
  font-weight: 700;
  color: #111;
  margin: 0 0 8px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  padding-right: 36px;
}

.comm-popup__title--accent {
  background: linear-gradient(135deg, #6ba3f7 0%, #93c4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.comm-popup__subtitle {
  font-size: 13.5px;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

/* === Role Toggle === */
.comm-popup__toggle {
  display: flex;
  border-radius: 50px;
  overflow: hidden;
  border: 1.5px solid #d0d0d0;
  width: fit-content;
  margin-bottom: 18px;
}

.comm-popup__toggle-btn {
  padding: 10px 24px;
  font-size: 13.5px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  color: #444;
  letter-spacing: 0.01em;
}

.comm-popup__toggle-btn--active {
  background: #111;
  color: #fff;
}

.comm-popup__toggle-btn:not(.comm-popup__toggle-btn--active):hover {
  background: #f5f5f5;
}

/* === Form === */
.comm-popup__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.comm-popup__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.comm-popup__row--half {
  grid-template-columns: 1fr 1fr;
}

.comm-popup__field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.comm-popup__label {
  font-size: 13.5px;
  font-weight: 600;
  color: #111;
  letter-spacing: 0.01em;
}

.comm-popup__input {
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

.comm-popup__input:focus {
  border-color: #6ba3f7;
  box-shadow: 0 0 0 3px rgba(107, 163, 247, 0.12);
}

.comm-popup__textarea {
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

.comm-popup__textarea:focus {
  border-color: #6ba3f7;
  box-shadow: 0 0 0 3px rgba(107, 163, 247, 0.12);
}

/* === Footer Buttons === */
.comm-popup__footer {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 12px;
  margin-top: 4px;
}

.comm-popup__btn {
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

.comm-popup__btn--close {
  background: #fff;
  color: #333;
  border: 1.5px solid #d0d0d0;
}

.comm-popup__btn--close:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.comm-popup__submit-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.comm-popup__btn--submit {
  background: linear-gradient(135deg, #4a9af5 0%, #5eaaff 50%, #72b8ff 100%);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(74, 154, 245, 0.3);
}

.comm-popup__btn--submit:hover {
  background: linear-gradient(135deg, #3a8ae5 0%, #4e9af5 50%, #62a8ff 100%);
  box-shadow: 0 6px 24px rgba(74, 154, 245, 0.45);
  transform: translateY(-2px);
}

.comm-popup__note {
  font-size: 10.5px;
  color: #888;
  letter-spacing: 0.01em;
}

/* === Responsive === */
@media (max-width: 640px) {
  .comm-overlay {
    padding: 12px;
  }

  .comm-popup {
    padding: 24px 20px 22px;
    border-radius: 14px;
    max-height: 92vh;
  }

  .comm-popup__close-x {
    top: 12px;
    right: 14px;
  }

  .comm-popup__close-x svg {
    width: 20px;
    height: 20px;
  }

  .comm-popup__header {
    margin-bottom: 12px;
  }

  .comm-popup__title {
    font-size: 20px;
    margin-bottom: 6px;
    padding-right: 30px;
  }

  .comm-popup__subtitle {
    font-size: 12.5px;
  }

  .comm-popup__toggle {
    margin-bottom: 14px;
  }

  .comm-popup__toggle-btn {
    padding: 8px 18px;
    font-size: 12.5px;
  }

  .comm-popup__form {
    gap: 12px;
  }

  .comm-popup__row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .comm-popup__row--half {
    grid-template-columns: 1fr;
  }

  .comm-popup__field {
    gap: 4px;
  }

  .comm-popup__label {
    font-size: 13px;
  }

  .comm-popup__input {
    padding: 10px 12px;
    font-size: 13.5px;
    border-radius: 8px;
    border-width: 1px;
  }

  .comm-popup__textarea {
    padding: 10px 12px;
    font-size: 13.5px;
    border-radius: 8px;
    min-height: 70px;
    border-width: 1px;
  }

  .comm-popup__footer {
    justify-content: flex-end;
    margin-top: 4px;
    gap: 10px;
  }

  .comm-popup__btn {
    padding: 9px 20px;
    font-size: 13px;
  }

  .comm-popup__note {
    font-size: 9.5px;
  }
}
`;
