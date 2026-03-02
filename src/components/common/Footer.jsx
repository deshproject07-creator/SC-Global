import { useState, useEffect } from "react";
import { Link, useNavigate }   from "react-router-dom";
import { getCategories }       from "../../firebase/firestore";
import {
  FiGlobe, FiMail, FiPhone, FiMapPin,
  FiArrowRight, FiFacebook, FiInstagram,
  FiTwitter, FiMessageCircle,
} from "react-icons/fi";
import logo from "../../assets/images/company_images/SC-Global.jpeg";
import "../../styles/custom.css";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const navigate                    = useNavigate();

  // ── Fetch Categories Dynamically ──────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        console.error("Failed to load footer categories");
      }
    };
    fetch();
  }, []);

  const quickLinks = [
    { label: "Home",       to: "/"        },
    { label: "About",      to: "/about"   },
    { label: "Products",   to: "/products"},
    { label: "Gallery",    to: "/gallery" },
    { label: "Blog",       to: "/blog"    },
    { label: "Contact Us", to: "/#contact"},
  ];

  const socialLinks = [
    {
      icon:  <FiFacebook size={18} />,
      label: "Facebook",
      href:  "https://facebook.com",
      color: "#1877f2",
    },
    {
      icon:  <FiInstagram size={18} />,
      label: "Instagram",
      href:  "https://instagram.com",
      color: "#e4405f",
    },
    {
      icon:  <FiTwitter size={18} />,
      label: "Twitter / X",
      href:  "https://twitter.com",
      color: "#1da1f2",
    },
    {
      icon:  <FiMessageCircle size={18} />,
      label: "WhatsApp",
      href:  "https://wa.me/910000000000",
      color: "#25d366",
    },
  ];

  return (
    <footer
      className="footer-section"
      style={{ paddingTop: "4rem" }}
    >
      <div className="container">
        <div className="row g-4 pb-4">

          {/* ══════════════════════════════════
              COLUMN 1 — Brand & Contact
          ══════════════════════════════════ */}
          <div className="col-12 col-md-6 col-lg-3">

            {/* Logo + Brand */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src={logo}
                alt="SC Global"
                style={{
                  width:        44,
                  height:       44,
                  borderRadius: "10px",
                  objectFit:    "cover",
                  border:       "2px solid rgba(255,255,255,0.15)",
                }}
              />
              <div>
                <div
                  style={{
                    color:       "white",
                    fontWeight:  700,
                    fontSize:    "1rem",
                    lineHeight:  1.1,
                  }}
                >
                  SC Global
                </div>
                <div
                  style={{
                    color:         "rgba(255,255,255,0.5)",
                    fontSize:      "0.58rem",
                    letterSpacing: "1.2px",
                    fontWeight:    600,
                    textTransform: "uppercase",
                  }}
                >
                  Exports & Imports
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p
              style={{
                color:      "#adb5bd",
                fontSize:   "0.85rem",
                lineHeight: 1.7,
                marginBottom: "1.25rem",
              }}
            >
              Connecting quality Indian products to
              international markets with trust,
              reliability, and excellence.
            </p>

            {/* Contact Info */}
            <div className="d-flex flex-column gap-2">
              {[
                {
                  icon: <FiMapPin size={14} />,
                  text: "Kolhapur, Maharashtra, India",
                },
                {
                  icon: <FiMail size={14} />,
                  text: "info@scglobal.com",
                  href: "mailto:info@scglobal.com",
                },
                {
                  icon: <FiPhone size={14} />,
                  text: "+91 00000 00000",
                  href: "tel:+910000000000",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="d-flex align-items-start gap-2"
                  style={{ color: "#adb5bd", fontSize: "0.82rem" }}
                >
                  <span
                    style={{
                      color:     "#0d6efd",
                      flexShrink: 0,
                      marginTop:  2,
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        color:          "#adb5bd",
                        textDecoration: "none",
                        transition:     "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.color = "#0d6efd"}
                      onMouseLeave={(e) => e.target.style.color = "#adb5bd"}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════
              COLUMN 2 — Quick Links
          ══════════════════════════════════ */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5
              style={{
                color:        "white",
                fontSize:     "0.92rem",
                fontWeight:   700,
                marginBottom: "1.25rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #0d6efd",
                display:      "inline-block",
              }}
            >
              Quick Links
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color:          "#adb5bd",
                      textDecoration: "none",
                      fontSize:       "0.85rem",
                      display:        "flex",
                      alignItems:     "center",
                      gap:            "0.4rem",
                      transition:     "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color       = "#0d6efd";
                      e.currentTarget.style.paddingLeft = "4px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color       = "#adb5bd";
                      e.currentTarget.style.paddingLeft = "0px";
                    }}
                  >
                    <FiArrowRight size={12} style={{ flexShrink: 0 }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ══════════════════════════════════
              COLUMN 3 — Products (Dynamic)
          ══════════════════════════════════ */}
          <div className="col-6 col-md-3 col-lg-3">
            <h5
              style={{
                color:        "white",
                fontSize:     "0.92rem",
                fontWeight:   700,
                marginBottom: "1.25rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #0d6efd",
                display:      "inline-block",
              }}
            >
              Our Products
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {/* All Products Link */}
              <li>
                <Link
                  to="/products"
                  style={{
                    color:          "#0d6efd",
                    textDecoration: "none",
                    fontSize:       "0.85rem",
                    display:        "flex",
                    alignItems:     "center",
                    gap:            "0.4rem",
                    fontWeight:     600,
                    transition:     "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = "4px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = "0px";
                  }}
                >
                  <FiGlobe size={12} style={{ flexShrink: 0 }} />
                  All Products
                </Link>
              </li>

              {/* Dynamic Categories */}
              {categories.length === 0 ? (
                <li
                  style={{
                    color:    "#6c757d",
                    fontSize: "0.82rem",
                  }}
                >
                  Loading...
                </li>
              ) : (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products/${cat.slug}`}
                      style={{
                        color:          "#adb5bd",
                        textDecoration: "none",
                        fontSize:       "0.85rem",
                        display:        "flex",
                        alignItems:     "center",
                        gap:            "0.4rem",
                        transition:     "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color       = "#0d6efd";
                        e.currentTarget.style.paddingLeft = "4px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color       = "#adb5bd";
                        e.currentTarget.style.paddingLeft = "0px";
                      }}
                    >
                      <FiArrowRight size={12} style={{ flexShrink: 0 }} />
                      {cat.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* ══════════════════════════════════
              COLUMN 4 — Social Media
          ══════════════════════════════════ */}
          <div className="col-12 col-md-6 col-lg-4">
            <h5
              style={{
                color:        "white",
                fontSize:     "0.92rem",
                fontWeight:   700,
                marginBottom: "1.25rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #0d6efd",
                display:      "inline-block",
              }}
            >
              Follow Us
            </h5>

            {/* Social Icons */}
            <div className="d-flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  style={{
                    width:          42,
                    height:         42,
                    borderRadius:   "50%",
                    background:     "rgba(255,255,255,0.08)",
                    border:         "1px solid rgba(255,255,255,0.12)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    color:          "#adb5bd",
                    textDecoration: "none",
                    transition:     "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background  = social.color;
                    e.currentTarget.style.borderColor = social.color;
                    e.currentTarget.style.color       = "white";
                    e.currentTarget.style.transform   = "translateY(-3px)";
                    e.currentTarget.style.boxShadow   = `0 6px 16px ${social.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background  = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color       = "#adb5bd";
                    e.currentTarget.style.transform   = "translateY(0)";
                    e.currentTarget.style.boxShadow   = "none";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Newsletter / CTA */}
            <div
              style={{
                background:   "rgba(13,110,253,0.12)",
                border:       "1px solid rgba(13,110,253,0.25)",
                borderRadius: 12,
                padding:      "1.25rem",
              }}
            >
              <p
                style={{
                  color:        "white",
                  fontWeight:   600,
                  fontSize:     "0.88rem",
                  marginBottom: "0.5rem",
                }}
              >
                Ready to Trade with Us?
              </p>
              <p
                style={{
                  color:        "#adb5bd",
                  fontSize:     "0.8rem",
                  lineHeight:   1.6,
                  marginBottom: "1rem",
                }}
              >
                Get in touch and let us help you source premium
                export products for your business.
              </p>
              <button
                onClick={() => navigate("/#contact")}
                style={{
                  width:        "100%",
                  background:   "linear-gradient(135deg, #0d6efd, #084298)",
                  border:       "none",
                  borderRadius: 8,
                  color:        "white",
                  fontWeight:   600,
                  fontSize:     "0.85rem",
                  padding:      "0.6rem",
                  cursor:       "pointer",
                  transition:   "all 0.25s ease",
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.opacity = "0.88"
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.opacity = "1"
                }
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BOTTOM BAR
        ══════════════════════════════════════ */}
        <div
          className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p
            className="mb-0"
            style={{ color: "#6c757d", fontSize: "0.8rem" }}
          >
            © {new Date().getFullYear()} SC Global Exports & Imports.
            All rights reserved.
          </p>

          <div className="d-flex align-items-center gap-3">
            <span
              style={{
                color:    "#6c757d",
                fontSize: "0.78rem",
              }}
            >
              Made with ❤️ in India
            </span>

            {/* Subtle Admin Link */}
            <Link
              to="/admin/login"
              className="footer-admin-link"
              style={{
                color:    "#6c757d",
                fontSize: "0.72rem",
              }}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;