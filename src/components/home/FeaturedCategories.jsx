import { useState, useEffect, useRef } from "react";
import { getCategories } from "../../firebase/firestore";
import { getProductsByCategory } from "../../firebase/firestore";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiX } from "react-icons/fi";
import ProductCard from "../products/ProductCard";
import Loader from "../common/Loader";
import "../../styles/custom.css";

const FeaturedCategories = () => {
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts]           = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [panelOpen, setPanelOpen]         = useState(false);
  const sliderRef                         = useRef(null);

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

  // ── Intersection Observer for animation ────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".category-card-wrapper").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  // ── Open Category Panel ────────────────────
  const openCategory = async (cat) => {
    setActiveCategory(cat);
    setPanelOpen(true);
    setProductsLoading(true);
    try {
      const data = await getProductsByCategory(cat.id);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // ── Close Panel ────────────────────────────
  const closePanel = () => {
    setPanelOpen(false);
    setTimeout(() => {
      setActiveCategory(null);
      setProducts([]);
    }, 350);
  };

  // ── Slider Controls ────────────────────────
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        id="categories"
        style={{ padding: "5rem 0", background: "#f8faff" }}
      >
        <div className="container">

          {/* ── Section Header ── */}
          <div className="text-center mb-5">
            <span
              className="badge rounded-pill mb-3 px-3 py-2"
              style={{ background: "#e8f0fe", color: "#0d6efd", fontSize: "0.8rem", fontWeight: 600 }}
            >
              Our Product Range
            </span>
            <h2 className="section-title text-center">Featured Categories</h2>
            <p className="text-muted mt-3" style={{ maxWidth: 500, margin: "0.75rem auto 0" }}>
              Browse our wide range of export-quality product categories
              sourced and delivered worldwide.
            </p>
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No categories available yet.</p>
            </div>
          ) : (
            <>
              {/* ── Slider Wrapper ── */}
              <div className="position-relative">

                {/* Left Arrow */}
                {categories.length > 3 && (
                  <button
                    onClick={slideLeft}
                    className="d-none d-md-flex"
                    style={{
                      position: "absolute", left: -20, top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10, width: 42, height: 42,
                      borderRadius: "50%", border: "none",
                      background: "white",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#0d6efd",
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

                {/* Slider */}
                <div
                  ref={sliderRef}
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    paddingBottom: "1rem",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  className="hide-scrollbar"
                >
                  {categories.map((cat, i) => (
                    <div
                      key={cat.id}
                      className="category-card-wrapper"
                      style={{
                        minWidth: 280,
                        maxWidth: 280,
                        scrollSnapAlign: "start",
                        opacity: 0,
                        animationDelay: `${i * 0.08}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div
                        className="category-card"
                        onClick={() => openCategory(cat)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Image */}
                        <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
                          <img
                            src={cat.imageUrl || "https://placehold.co/280x200?text=Category"}
                            alt={cat.name}
                            style={{ width: "100%", height: 200, objectFit: "cover" }}
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
                            className="d-flex align-items-center gap-1"
                            style={{
                              color: "#0d6efd", fontSize: "0.85rem",
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

                {/* Right Arrow */}
                {categories.length > 3 && (
                  <button
                    onClick={slideRight}
                    className="d-none d-md-flex"
                    style={{
                      position: "absolute", right: -20, top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10, width: 42, height: 42,
                      borderRadius: "50%", border: "none",
                      background: "white",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#0d6efd",
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

              {/* Scroll hint dots */}
              <div className="d-flex justify-content-center gap-2 mt-4">
                {categories.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8, height: 8,
                      borderRadius: "50%",
                      background: i === 0 ? "#0d6efd" : "#dee2e6",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCTS SLIDE-IN PANEL
      ══════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        onClick={closePanel}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1040,
          opacity: panelOpen ? 1 : 0,
          pointerEvents: panelOpen ? "all" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0, right: 0,
          width: "100%",
          maxWidth: 720,
          height: "100vh",
          background: "white",
          zIndex: 1050,
          boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {activeCategory && (
          <>
            {/* Panel Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0d6efd, #084298)",
                padding: "1.5rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <h5 className="text-white fw-bold mb-1">{activeCategory.name}</h5>
                <p className="mb-0" style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>
                  {activeCategory.description || "Explore our product range"}
                </p>
              </div>
              <button
                onClick={closePanel}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "50%",
                  width: 38, height: 38,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Panel Body */}
            <div style={{ padding: "1.5rem 2rem", flex: 1 }}>
              {productsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                  <p className="text-muted mt-3 small">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FiArrowRight size={40} className="mb-3 opacity-25" />
                  <p>No products in this category yet.</p>
                </div>
              ) : (
                <>
                  <p className="text-muted small mb-4">
                    <strong style={{ color: "#0d6efd" }}>{products.length}</strong> product
                    {products.length !== 1 ? "s" : ""} found
                  </p>
                  <div className="row g-3 stagger-children">
                    {products.map((prod) => (
                      <div key={prod.id} className="col-12 col-sm-6 animate-slide-up">
                        <ProductCard product={prod} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Hide scrollbar style */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default FeaturedCategories;