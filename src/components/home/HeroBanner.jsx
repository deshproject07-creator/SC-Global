import { useEffect, useState } from "react";
import { FiArrowRight, FiGlobe, FiPackage, FiTruck } from "react-icons/fi";
import "../../styles/custom.css";

const stats = [
  { icon: <FiGlobe size={22} />,    value: "50+",  label: "Countries Reached"   },
  { icon: <FiPackage size={22} />,  value: "200+", label: "Products Exported"   },
  { icon: <FiTruck size={22} />,    value: "10+",  label: "Years of Experience" },
];

const HeroBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section" id="hero">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center min-vh-75 py-5">

          {/* ── Left Content ── */}
          <div className="col-lg-7">

            {/* Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-pill"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                fontSize: "0.82rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease 0.1s",
              }}
            >
              <FiGlobe size={14} />
              Trusted Global Trade Partner
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease 0.2s",
              }}
            >
              Connecting Quality
              <br />
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                to the World
              </span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.82)",
                maxWidth: 520,
                lineHeight: 1.7,
                marginBottom: "2rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease 0.3s",
              }}
            >
              SC Global Exports & Imports delivers premium quality products
              to international markets with reliability, speed, and integrity.
            </p>

            {/* CTA Buttons */}
            <div
              className="d-flex gap-3 flex-wrap"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.6s ease 0.4s",
              }}
            >
              <button
                className="btn btn-light px-4 py-2 fw-600 d-flex align-items-center gap-2"
                style={{ borderRadius: "10px", color: "#0d6efd" }}
                onClick={() => scrollTo("categories")}
              >
                Explore Products <FiArrowRight />
              </button>
              <button
                className="btn px-4 py-2 fw-500 d-flex align-items-center gap-2"
                style={{
                  borderRadius: "10px",
                  border: "2px solid rgba(255,255,255,0.5)",
                  color: "white",
                  background: "transparent",
                }}
                onClick={() => scrollTo("contact")}
              >
                Get a Quote
              </button>
            </div>
          </div>

          {/* ── Right Floating Card ── */}
          <div
            className="col-lg-5 d-none d-lg-flex justify-content-end"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.7s ease 0.5s",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                width: "100%",
                maxWidth: 340,
              }}
            >
              <p className="text-white small fw-600 mb-3 opacity-75 text-uppercase" style={{ letterSpacing: 1 }}>
                Why Choose Us
              </p>
              {[
                "✅ Premium Quality Assured",
                "✅ On-Time Global Delivery",
                "✅ Competitive Pricing",
                "✅ Dedicated Support Team",
                "✅ Trusted by 50+ Clients",
              ].map((point, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "0.9rem",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(20px)",
                    transition: `all 0.5s ease ${0.6 + i * 0.08}s`,
                  }}
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div
          className="row g-3 pb-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.7s",
          }}
        >
          {stats.map((s, i) => (
            <div key={i} className="col-4">
              <div
                className="d-flex align-items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.8)" }}>{s.icon}</span>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "1.3rem", lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;