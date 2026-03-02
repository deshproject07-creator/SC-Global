import { Link } from "react-router-dom";
import {
  FiGlobe, FiMail, FiPhone, FiMapPin,
  FiArrowRight
} from "react-icons/fi";
import "../../styles/custom.css";

const Footer = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer-section" style={{ paddingTop: "3.5rem" }}>
      <div className="container">
        <div className="row g-4 pb-4">

          {/* ── Brand Column ── */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  width: 38, height: 38,
                  background: "linear-gradient(135deg, #0d6efd, #084298)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <FiGlobe size={20} color="white" />
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                  SC Global
                </div>
                <div style={{ color: "#adb5bd", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                  EXPORTS & IMPORTS
                </div>
              </div>
            </div>
            <p style={{ color: "#adb5bd", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 280 }}>
              Connecting quality products to international markets with
              reliability, integrity, and expertise since over a decade.
            </p>
            {/* Contact Info */}
            <div className="mt-3 d-flex flex-column gap-2">
              {[
                { icon: <FiMail size={13} />,   text: "info@scglobalexports.com" },
                { icon: <FiPhone size={13} />,  text: "+91 00000 00000"          },
                { icon: <FiMapPin size={13} />, text: "India"                    },
              ].map((item, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-2"
                  style={{ color: "#adb5bd", fontSize: "0.82rem" }}
                >
                  <span style={{ color: "#0d6efd" }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-6 col-md-2">
            <h5 style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { label: "Home",         id: "hero"        },
                { label: "Categories",   id: "categories"  },
                { label: "Why Us",       id: "why-us"      },
                { label: "Testimonials", id: "testimonials"},
                { label: "Contact",      id: "contact"     },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="bg-transparent border-0 p-0 d-flex align-items-center gap-1"
                    style={{
                      color: "#adb5bd",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#adb5bd"}
                  >
                    <FiArrowRight size={12} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── What We Export ── */}
          <div className="col-6 col-md-3">
            <h5 style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>What We Export</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                "Agricultural Products",
                "Industrial Goods",
                "Textiles & Garments",
                "Food Products",
                "Raw Materials",
              ].map((item) => (
                <li
                  key={item}
                  className="d-flex align-items-center gap-1"
                  style={{ color: "#adb5bd", fontSize: "0.85rem" }}
                >
                  <FiArrowRight size={12} color="#0d6efd" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── CTA Column ── */}
          <div className="col-12 col-md-3">
            <h5 style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>Start Trading</h5>
            <p style={{ color: "#adb5bd", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Ready to source premium export products? Get a custom quote today.
            </p>
            <button
              className="btn btn-primary btn-sm px-4 mt-1"
              style={{ borderRadius: 8 }}
              onClick={() => scrollTo("contact")}
            >
              Get a Free Quote
            </button>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div
          className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="mb-0" style={{ color: "#6c757d", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} SC Global Exports & Imports. All rights reserved.
          </p>

          {/* Subtle Admin Link */}
          <Link
            to="/admin/login"
            className="footer-admin-link"
            style={{ color: "#6c757d", fontSize: "0.72rem" }}
          >
            Admin
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;