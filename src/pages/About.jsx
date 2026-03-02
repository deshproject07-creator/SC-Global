import { useEffect } from "react";
import Navbar    from "../components/common/Navbar";
import Footer    from "../components/common/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import {
  FiAward, FiGlobe, FiShield, FiTruck,
  FiUsers, FiCheckCircle, FiMapPin, FiMail, FiPhone
} from "react-icons/fi";
import welcomeImg from "../assets/images/company_images/SC-Global.jpeg";
import cashewImg  from "../assets/images/cashew_images/cashew_a.jpg";
import riceImg    from "../assets/images/rice_images/rice_a.jpg";
import silverImg  from "../assets/images/silver_images/silver_b.jpg";
import "../styles/custom.css";

const stats = [
  { value: "10+",  label: "Years of Experience", icon: <FiAward size={22} />   },
  { value: "50+",  label: "Countries Reached",   icon: <FiGlobe size={22} />   },
  { value: "200+", label: "Products Exported",   icon: <FiShield size={22} />  },
  { value: "50+",  label: "Happy Clients",        icon: <FiUsers size={22} />   },
];

const values = [
  {
    icon:  <FiShield size={26} />,
    title: "Quality First",
    desc:  "Every product is thoroughly inspected and quality-checked before export to ensure international standards are met.",
  },
  {
    icon:  <FiTruck size={26} />,
    title: "Timely Delivery",
    desc:  "We understand the importance of deadlines in global trade. Our logistics network ensures on-time delivery every time.",
  },
  {
    icon:  <FiGlobe size={26} />,
    title: "Global Reach",
    desc:  "With a strong network across 50+ countries, we connect quality Indian products with international markets seamlessly.",
  },
  {
    icon:  <FiCheckCircle size={26} />,
    title: "Transparency",
    desc:  "We believe in honest, transparent business dealings. Our clients always know what to expect from us.",
  },
  {
    icon:  <FiUsers size={26} />,
    title: "Client Focus",
    desc:  "Our clients are at the heart of everything we do. We tailor our services to meet each client's unique requirements.",
  },
  {
    icon:  <FiAward size={26} />,
    title: "Trusted Brand",
    desc:  "Over a decade of consistent quality and service has built SC Global into a trusted name in international trade.",
  },
];

const products = [
  { img: cashewImg, name: "Cashew Nuts",    desc: "Premium W-180, W-210, W-240, W-320 cashew grades exported worldwide."   },
  { img: riceImg,   name: "Rice",            desc: "Finest Basmati and Non-Basmati rice varieties for global markets."       },
  { img: silverImg, name: "Silver Products", desc: "Pure and certified silver products crafted for international buyers."    },
];

const About = () => {

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════
          PAGE HERO
      ══════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          padding:    "4rem 0 3rem",
          textAlign:  "center",
        }}
      >
        <div className="container">
          <h1
            style={{
              color:      "white",
              fontWeight: 800,
              fontSize:   "clamp(1.8rem, 4vw, 2.8rem)",
              marginBottom: "0.75rem",
            }}
          >
            About SC Global
          </h1>
          <p
            style={{
              color:     "rgba(255,255,255,0.8)",
              fontSize:  "1rem",
              maxWidth:  520,
              margin:    "0 auto",
              lineHeight: 1.7,
            }}
          >
            Your trusted partner in global trade — delivering quality,
            reliability, and excellence since over a decade.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMPANY OVERVIEW
      ══════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: "white" }}>
        <div className="container">
          <div className="row align-items-center g-5">

            {/* Image */}
            <div className="col-12 col-lg-5">
              <div style={{ position: "relative" }}>
                <img
                  src={welcomeImg}
                  alt="SC Global Exports & Imports"
                  style={{
                    width:        "100%",
                    height:       380,
                    objectFit:    "cover",
                    borderRadius: 16,
                    boxShadow:    "0 16px 48px rgba(13,110,253,0.15)",
                  }}
                />
                {/* Floating card */}
                <div
                  style={{
                    position:     "absolute",
                    bottom:       -20,
                    right:        -16,
                    background:   "linear-gradient(135deg, #0d6efd, #084298)",
                    borderRadius: 14,
                    padding:      "1.25rem 1.5rem",
                    boxShadow:    "0 8px 24px rgba(13,110,253,0.35)",
                    textAlign:    "center",
                  }}
                >
                  <div style={{ color: "white", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>
                    10+
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.75rem", marginTop: 4, fontWeight: 500 }}>
                    Years of Trust
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-12 col-lg-7" style={{ paddingBottom: "1rem" }}>
              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  background: "#e8f0fe",
                  color:      "#0d6efd",
                  fontSize:   "0.78rem",
                  fontWeight: 600,
                }}
              >
                Our Story
              </span>
              <h2
                className="section-title"
                style={{ marginBottom: "1.25rem" }}
              >
                SC Global Exports & Imports
              </h2>
              <p style={{ color: "#5a5a7a", lineHeight: 1.8, marginBottom: "1rem" }}>
                SC Global Exports & Imports is a premier export company
                headquartered in Kolhapur, Maharashtra, India. Founded with
                a vision to connect the finest Indian products with
                international markets, we have grown into a trusted name
                in global trade over the past decade.
              </p>
              <p style={{ color: "#5a5a7a", lineHeight: 1.8, marginBottom: "1rem" }}>
                We specialize in exporting premium quality products including
                cashew nuts, rice varieties, and certified silver products
                to buyers across 50+ countries. Our team of experienced
                trade professionals ensures every shipment meets the highest
                international quality standards.
              </p>
              <p style={{ color: "#5a5a7a", lineHeight: 1.8, marginBottom: "2rem" }}>
                Our commitment to quality, transparency, and on-time delivery
                has earned us long-term relationships with clients across
                the UAE, China, Brazil, Nigeria, Germany, and many more
                countries worldwide.
              </p>

              {/* Contact Info */}
              <div className="d-flex flex-column gap-2">
                {[
                  { icon: <FiMapPin size={15} />, text: "Kolhapur, Maharashtra, India" },
                  { icon: <FiMail   size={15} />, text: "info@scglobal.com"            },
                  { icon: <FiPhone  size={15} />, text: "+91 00000 00000"              },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display:    "flex",
                      alignItems: "center",
                      gap:        "0.6rem",
                      color:      "#5a5a7a",
                      fontSize:   "0.9rem",
                    }}
                  >
                    <span style={{ color: "#0d6efd" }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          padding:    "3.5rem 0",
        }}
      >
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={{ color: "rgba(255,255,255,0.75)", marginBottom: "0.5rem" }}>
                  {stat.icon}
                </div>
                <div style={{ color: "white", fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", marginTop: 6 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OUR MISSION & VISION
      ══════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: "#f8faff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-3"
              style={{
                background: "#e8f0fe",
                color:      "#0d6efd",
                fontSize:   "0.78rem",
                fontWeight: 600,
              }}
            >
              What Drives Us
            </span>
            <h2 className="section-title text-center">Mission & Vision</h2>
          </div>

          <div className="row g-4">
            {/* Mission */}
            <div className="col-12 col-md-6">
              <div
                style={{
                  background:   "white",
                  borderRadius: 16,
                  padding:      "2.5rem",
                  height:       "100%",
                  boxShadow:    "0 4px 20px rgba(0,0,0,0.06)",
                  borderTop:    "4px solid #0d6efd",
                }}
              >
                <div
                  style={{
                    width:        52,
                    height:       52,
                    background:   "#e8f0fe",
                    borderRadius: 14,
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    color:        "#0d6efd",
                  }}
                >
                  <FiAward size={26} />
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "#1a1a2e" }}>
                  Our Mission
                </h4>
                <p style={{ color: "#5a5a7a", lineHeight: 1.8, marginBottom: 0 }}>
                  To be the most reliable and trusted export partner for
                  international buyers by consistently delivering premium
                  quality Indian products with transparency, integrity,
                  and on-time delivery. We aim to build lasting relationships
                  that go beyond mere transactions.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="col-12 col-md-6">
              <div
                style={{
                  background:   "white",
                  borderRadius: 16,
                  padding:      "2.5rem",
                  height:       "100%",
                  boxShadow:    "0 4px 20px rgba(0,0,0,0.06)",
                  borderTop:    "4px solid #084298",
                }}
              >
                <div
                  style={{
                    width:        52,
                    height:       52,
                    background:   "#e8f0fe",
                    borderRadius: 14,
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    color:        "#084298",
                  }}
                >
                  <FiGlobe size={26} />
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: "1rem", color: "#1a1a2e" }}>
                  Our Vision
                </h4>
                <p style={{ color: "#5a5a7a", lineHeight: 1.8, marginBottom: 0 }}>
                  To expand our global footprint and become a leading
                  exporter from India, known for exceptional quality and
                  unmatched service. We envision a future where SC Global
                  is synonymous with trust, quality, and excellence in
                  international trade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          OUR VALUES
      ══════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: "white" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-3"
              style={{
                background: "#e8f0fe",
                color:      "#0d6efd",
                fontSize:   "0.78rem",
                fontWeight: 600,
              }}
            >
              Our Core Values
            </span>
            <h2 className="section-title text-center">What We Stand For</h2>
          </div>

          <div className="row g-4">
            {values.map((val, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4">
                <div className="usp-card h-100">
                  <div className="usp-icon">{val.icon}</div>
                  <h6 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{val.title}</h6>
                  <p className="small mb-0" style={{ lineHeight: 1.7, opacity: 0.85 }}>
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHAT WE EXPORT
      ══════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", background: "#f8faff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-3"
              style={{
                background: "#e8f0fe",
                color:      "#0d6efd",
                fontSize:   "0.78rem",
                fontWeight: 600,
              }}
            >
              Our Products
            </span>
            <h2 className="section-title text-center">What We Export</h2>
          </div>

          <div className="row g-4">
            {products.map((prod, i) => (
              <div key={i} className="col-12 col-md-4">
                <div
                  className="category-card"
                  style={{ cursor: "default" }}
                >
                  <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
                    <img
                      src={prod.img}
                      alt={prod.name}
                      style={{
                        width:      "100%",
                        height:     220,
                        objectFit:  "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                    />
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold mb-2">{prod.name}</h6>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                      {prod.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          padding:    "4rem 0",
          textAlign:  "center",
        }}
      >
        <div className="container">
          <h3
            style={{
              color:        "white",
              fontWeight:   700,
              marginBottom: "0.75rem",
            }}
          >
            Ready to Start Trading with SC Global?
          </h3>
          <p
            style={{
              color:        "rgba(255,255,255,0.8)",
              maxWidth:     480,
              margin:       "0 auto 1.75rem",
              lineHeight:   1.7,
            }}
          >
            Get in touch with our team today and let us help you source
            the finest Indian export products for your business.
          </p>
          <a
            href="/#contact"
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "0.5rem",
              background:   "white",
              borderRadius: "10px",
              color:        "#0d6efd",
              fontWeight:   700,
              fontSize:     "0.95rem",
              padding:      "0.75rem 2rem",
              textDecoration: "none",
              boxShadow:    "0 4px 16px rgba(0,0,0,0.15)",
              transition:   "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform  = "translateY(-2px)";
              e.currentTarget.style.boxShadow  = "0 8px 24px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform  = "translateY(0)";
              e.currentTarget.style.boxShadow  = "0 4px 16px rgba(0,0,0,0.15)";
            }}
          >
            Contact Us Today
          </a>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
};

export default About;