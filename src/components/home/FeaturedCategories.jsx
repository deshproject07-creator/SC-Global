import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../firebase/firestore";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiGrid } from "react-icons/fi";
import "../../styles/custom.css";

const FeaturedCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const sliderRef = useRef(null);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    // ── Scroll Animation ───────────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // ── Fetch Categories ───────────────────────
    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch {
                console.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // ── Slider Controls ────────────────────────
    const slideLeft = () => {
        sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    };
    const slideRight = () => {
        sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <section
            id="categories"
            ref={sectionRef}
            className="categories-section"
            style={{ padding: "5rem 0", background: "#f8faff" }}
        >
            <div className="container">

                {/* ── Section Header ── */}
                <div
                    className="text-center mb-5"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.5s ease",
                    }}
                >
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "0.6rem", marginBottom: "0.75rem"
                    }}>
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
                            Our Product Range
                        </span>
                        <div style={{
                            width: 36, height: 4,
                            background: "linear-gradient(270deg, #0d6efd, #60a5fa)",
                            borderRadius: 2,
                        }} />
                    </div>
                    <h2 className="section-title text-center">What We Export</h2>
                    <p
                        className="text-muted mt-3"
                        style={{ maxWidth: 500, margin: "0.75rem auto 0" }}
                    >
                        Browse our wide range of export-quality product categories
                        sourced and delivered worldwide.
                    </p>
                </div>

                {/* ── Loading Skeleton ── */}
                {loading ? (
                    <div style={{ display: "flex", gap: "1.25rem", overflow: "hidden" }}>
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    minWidth: 280,
                                    height: 320,
                                    borderRadius: 12,
                                    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 1.5s infinite",
                                }}
                            />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <FiGrid size={48} className="mb-3 opacity-25" />
                        <p>No categories available yet.</p>
                    </div>
                ) : (
                    <div className="position-relative">

                        {/* Left Arrow */}
                        {categories.length > 3 && (
                            <button
                                onClick={slideLeft}
                                className="d-none d-md-flex"
                                style={{
                                    position: "absolute",
                                    left: -20,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    width: 42,
                                    height: 42,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "white",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    color: "#0d6efd",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#0d6efd";
                                    e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "white";
                                    e.currentTarget.style.color = "#0d6efd";
                                }}
                            >
                                <FiChevronLeft size={20} />
                            </button>
                        )}

                        {/* ── Slider ── */}
                        <div
                            ref={sliderRef}
                            className="hide-scrollbar categories-slider"
                            style={{
                                display: "flex",
                                gap: "1.25rem",
                                overflowX: "auto",
                                scrollSnapType: "x mandatory",
                                paddingBottom: "1rem",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                                WebkitOverflowScrolling: "touch",
                            }}
                        >
                            {categories.map((cat, i) => (
                                <div
                                    key={cat.id}
                                    className="category-card-wrap"
                                    style={{
                                        minWidth: 280,
                                        maxWidth: 280,
                                        scrollSnapAlign: "start",
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? "translateY(0)" : "translateY(30px)",
                                        transition: `all 0.5s ease ${i * 0.08}s`,
                                    }}
                                >
                                    <div
                                        className="category-card"
                                        onClick={() => navigate(`/products/${cat.slug}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {/* Image */}
                                        <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
                                            <img
                                                src={cat.imageUrl || "https://placehold.co/280x200?text=Category"}
                                                alt={cat.name}
                                                className="category-card-img"
                                                style={{
                                                    width: "100%",
                                                    height: 200,
                                                    objectFit: "cover",
                                                    transition: "transform 0.4s ease",
                                                }}
                                                onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
                                                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/280x200?text=Category";
                                                }}
                                            />
                                        </div>

                                        {/* Body */}
                                        <div className="p-3">
                                            <h6 className="fw-bold mb-1">{cat.name}</h6>
                                            <p
                                                className="text-muted small mb-3"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {cat.description || "Click to explore products in this category."}
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.3rem",
                                                    color: "#0d6efd",
                                                    fontSize: "0.85rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                View Products <FiArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile swipe hint */}
                        <div
                            className="d-flex d-md-none justify-content-center mt-3"
                            style={{ gap: "0.4rem" }}
                        >
                            {categories.map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width:        i === 0 ? 20 : 6,
                                        height:       6,
                                        borderRadius: 3,
                                        background:   i === 0 ? "#0d6efd" : "#dee2e6",
                                        transition:   "all 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Right Arrow */}
                        {categories.length > 3 && (
                            <button
                                onClick={slideRight}
                                className="d-none d-md-flex"
                                style={{
                                    position: "absolute",
                                    right: -20,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    width: 42,
                                    height: 42,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "white",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    color: "#0d6efd",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#0d6efd";
                                    e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "white";
                                    e.currentTarget.style.color = "#0d6efd";
                                }}
                            >
                                <FiChevronRight size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .categories-section { padding: 3rem 0 !important; }
          .category-card-wrap {
            min-width: 75vw !important;
            max-width: 75vw !important;
          }
          .categories-slider {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            gap: 1rem !important;
          }
          .category-card-img {
            height: 160px !important;
          }
        }
        @media (max-width: 480px) {
          .category-card-wrap {
            min-width: 82vw !important;
            max-width: 82vw !important;
          }
        }
      `}</style>
        </section>
    );
};

export default FeaturedCategories;