import { useState, useRef, useEffect } from "react";
import { addInquiry } from "../../firebase/firestore";
import { toast } from "react-toastify";
import {
  FiMail, FiPhone, FiUser, FiMessageSquare,
  FiSend, FiMapPin, FiGlobe, FiClock
} from "react-icons/fi";
import "../../styles/custom.css";

const emptyForm = { name: "", email: "", phone: "", message: "" };

const ContactForm = () => {
  const [formData, setFormData]   = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [visible, setVisible]       = useState(false);
  const sectionRef                  = useRef(null);

  // ── Scroll Animation ───────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Handle Submit ──────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await addInquiry(formData);
      setSubmitted(true);
      setFormData(emptyForm);
      toast.success("Your inquiry has been sent! We'll get back to you shortly. 🎉");
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact-section"
      style={{ padding: "5rem 0" }}
    >
      <div className="container">

        {/* ── Section Header ── */}
        <div className="text-center mb-5">
          <span
            className="badge rounded-pill mb-3 px-3 py-2"
            style={{
              background: "#e8f0fe",
              color: "#0d6efd",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            Get In Touch
          </span>
          <h2 className="section-title text-center">Contact Us</h2>
          <p
            className="text-muted mt-3"
            style={{ maxWidth: 480, margin: "0.75rem auto 0" }}
          >
            Interested in our products? Send us an inquiry and our team
            will respond within 24 hours.
          </p>
        </div>

        <div className="row g-4 align-items-start">

          {/* ── Left: Contact Info ── */}
          <div
            className="col-12 col-lg-4"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.6s ease 0.1s",
            }}
          >
            {/* Info Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
                borderRadius: 16,
                padding: "2rem",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              <h5 className="fw-bold mb-4">Get in Touch</h5>

              {[
                {
                  icon: <FiMapPin size={18} />,
                  label: "Address",
                  value: "SC Global Exports & Imports",
                },
                {
                  icon: <FiMail size={18} />,
                  label: "Email",
                  value: "info@scglobalexports.com",
                },
                {
                  icon: <FiPhone size={18} />,
                  label: "Phone",
                  value: "+91 00000 00000",
                },
                {
                  icon: <FiClock size={18} />,
                  label: "Business Hours",
                  value: "Mon – Sat: 9AM – 6PM IST",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="d-flex gap-3 mb-4"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-20px)",
                    transition: `all 0.5s ease ${0.2 + i * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      width: 38, height: 38,
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.7, marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social / Global */}
              <div
                className="d-flex align-items-center gap-2 mt-2 pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
              >
                <FiGlobe size={16} />
                <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>
                  Exporting to 50+ Countries Worldwide
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div
            className="col-12 col-lg-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.6s ease 0.2s",
            }}
          >
            <div className="contact-form-card">

              {/* Success State */}
              {submitted ? (
                <div className="text-center py-5">
                  <div
                    style={{
                      width: 72, height: 72,
                      background: "#e8f0fe",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 1.5rem",
                    }}
                  >
                    <FiSend size={30} color="#0d6efd" />
                  </div>
                  <h5 className="fw-bold mb-2">Inquiry Sent Successfully!</h5>
                  <p className="text-muted mb-4">
                    Thank you for reaching out. Our team will get back
                    to you within 24 business hours.
                  </p>
                  <button
                    className="btn btn-outline-primary px-4"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <h5 className="fw-bold mb-1">Send an Inquiry</h5>
                  <p className="text-muted small mb-4">
                    Fill in the form below and we'll get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">

                      {/* Name */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label fw-500 small">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FiUser size={15} color="#6c757d" />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 ps-1"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-12 col-sm-6">
                        <label className="form-label fw-500 small">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FiMail size={15} color="#6c757d" />
                          </span>
                          <input
                            type="email"
                            className="form-control border-start-0 ps-1"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-12">
                        <label className="form-label fw-500 small">
                          Phone Number
                          <span className="text-muted ms-1" style={{ fontWeight: 400 }}>
                            (optional)
                          </span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FiPhone size={15} color="#6c757d" />
                          </span>
                          <input
                            type="tel"
                            className="form-control border-start-0 ps-1"
                            placeholder="+1 234 567 8900"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="col-12">
                        <label className="form-label fw-500 small">
                          Message <span className="text-danger">*</span>
                        </label>
                        <div className="input-group align-items-start">
                          <span
                            className="input-group-text bg-light border-end-0"
                            style={{ paddingTop: "0.65rem" }}
                          >
                            <FiMessageSquare size={15} color="#6c757d" />
                          </span>
                          <textarea
                            className="form-control border-start-0 ps-1"
                            rows={5}
                            placeholder="Tell us about the products you're interested in, quantity requirements, destination country..."
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary px-5 py-2 d-flex align-items-center gap-2"
                          disabled={submitting}
                          style={{ borderRadius: 10 }}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <FiSend size={16} />
                              Send Inquiry
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;