import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiTarget, FiGlobe, FiShield } from "react-icons/fi";
import welcomeImg from "../../assets/images/company_images/SC-Global.jpeg";
import "../../styles/custom.css";

const stats = [
    { icon: <FiTarget size={20} />, value: "2026", label: "Established" },
    { icon: <FiGlobe size={20} />,  value: "Global", label: "Trade Vision" },
    { icon: <FiShield size={20} />, value: "100%", label: "Quality Assured" },
];

const aboutMobileStyles = `
  @media (max-width: 768px) {
    .about-section { padding: 3rem 0 !important; }
    .about-floating-badge { display: none !important; }
    .about-image { height: 240px !important; }
    .about-content { padding-top: 1.5rem !important; }
    .about-stat-value { font-size: 1.1rem !important; }
    .about-stat-label { font-size: 0.65rem !important; }
    .about-dot-grid  { display: none !important; }
  }
`;

const AboutPreview = () => {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const navigate = useNavigate();

    return (
        <>
        <style>{aboutMobileStyles}</style>
        <section
            ref={sectionRef}
            className="about-section"
            style={{ padding: "5rem 0", background: "white" }}
        >
            <div className="container">
                <div className="row align-items-center g-5">

                    {/* ── Left: Image ── */}
                    <div
                        className="col-12 col-lg-5"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateX(0)" : "translateX(-40px)",
                            transition: "all 0.65s ease 0.1s",
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <img
                                src={welcomeImg}
                                alt="SC Global Exports & Imports"
                                className="about-image"
                                style={{
                                    width: "100%",
                                    height: 340,
                                    objectFit: "cover",
                                    borderRadius: 16,
                                    boxShadow: "0 12px 40px rgba(13,110,253,0.15)",
                                }}
                            />

                            {/* Floating Badge — Established 2026 */}
                            <div
                                className="about-floating-badge"
                                style={{
                                    position: "absolute",
                                    bottom: -20,
                                    right: -20,
                                    background: "linear-gradient(135deg, #0d6efd, #084298)",
                                    borderRadius: 14,
                                    padding: "1.25rem 1.5rem",
                                    boxShadow: "0 8px 24px rgba(13,110,253,0.35)",
                                    textAlign: "center",
                                    minWidth: 130,
                                }}
                            >
                                <div style={{ color: "white", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>
                                    2026
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.75rem", marginTop: 4, fontWeight: 500 }}>
                                    Established
                                </div>
                            </div>

                            {/* Decorative dot grid */}
                            <div
                                className="about-dot-grid"
                                style={{
                                    position: "absolute",
                                    top: -16,
                                    left: -16,
                                    width: 80,
                                    height: 80,
                                    background: "radial-gradient(circle, #0d6efd 1.5px, transparent 1.5px)",
                                    backgroundSize: "12px 12px",
                                    opacity: 0.25,
                                    zIndex: -1,
                                }}
                            />
                        </div>
                    </div>

                    {/* ── Right: Content ── */}
                    <div
                        className="col-12 col-lg-7"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateX(0)" : "translateX(40px)",
                            transition: "all 0.65s ease 0.2s",
                            paddingBottom: "1rem",
                        }}
                    >
                        {/* Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                            <div style={{
                                width: 36, height: 4,
                                background: "linear-gradient(90deg, #0d6efd, #60a5fa)",
                                borderRadius: 2,
                            }} />
                            <span style={{
                                fontSize: "0.8rem", fontWeight: 700,
                                color: "#0d6efd", letterSpacing: "1.5px",
                                textTransform: "uppercase", fontFamily: "DM Sans, sans-serif",
                            }}>
                                About SC Global
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>
                            Your Trusted Global Trade Partner
                        </h2>

                        {/* Description */}
                        <p style={{ color: "#5a5a7a", lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "1rem" }}>
                            SC Global Exports & Imports is a fresh and ambitious export
                            company headquartered in Kolhapur, Maharashtra, India.
                            Established in 2026, we are at the beginning of an exciting
                            journey — building a bridge between India's finest products
                            and international markets worldwide.
                        </p>
                        <p style={{ color: "#5a5a7a", lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
                            Though we are in our startup stage, our vision is global.
                            We specialize in exporting premium quality products including
                            cashew nuts, rice, and silver products with a strong focus
                            on quality, transparency, and building long-term relationships
                            with international buyers.
                        </p>

                        {/* Stats Row */}
                        <div
                            className="row g-3 mb-4"
                            style={{ opacity: visible ? 1 : 0, transition: "all 0.6s ease 0.4s" }}
                        >
                            {stats.map((stat, i) => (
                                <div key={i} className="col-4">
                                    <div style={{
                                        textAlign: "center",
                                        padding: "1rem 0.5rem",
                                        background: "#f8faff",
                                        borderRadius: 12,
                                        border: "1px solid #e8f0fe",
                                    }}>
                                        <div style={{ color: "#0d6efd", marginBottom: 4 }}>
                                            {stat.icon}
                                        </div>
                                        <div
                                            className="about-stat-value"
                                            style={{ fontWeight: 800, fontSize: "1.3rem", color: "#1a1a2e", lineHeight: 1 }}
                                        >
                                            {stat.value}
                                        </div>
                                        <div
                                            className="about-stat-label"
                                            style={{ fontSize: "0.72rem", color: "#6c757d", marginTop: 4, fontWeight: 500 }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Read More Button */}
                        <button
                            onClick={() => navigate("/about")}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "linear-gradient(135deg, #0d6efd, #084298)",
                                border: "none",
                                borderRadius: "10px",
                                color: "white",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                padding: "0.7rem 1.75rem",
                                cursor: "pointer",
                                boxShadow: "0 4px 16px rgba(13,110,253,0.3)",
                                transition: "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(13,110,253,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,110,253,0.3)";
                            }}
                        >
                            Read More About Us <FiArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
};

export default AboutPreview;