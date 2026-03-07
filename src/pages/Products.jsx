import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { getCategories }       from "../firebase/firestore";
import Navbar                  from "../components/common/Navbar";
import Footer                  from "../components/common/Footer";
import ScrollToTop             from "../components/common/ScrollToTop";
import { FiArrowRight, FiGrid, FiSearch } from "react-icons/fi";
import "../styles/custom.css";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);
  const navigate                    = useNavigate();

  // ── Scroll to top on mount ─────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Fetch Categories ───────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setFiltered(data);
      } catch {
        console.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Search Filter ──────────────────────────
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(categories);
    } else {
      setFiltered(
        categories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(q) ||
            (cat.description || "").toLowerCase().includes(q)
        )
      );
    }
  }, [search, categories]);

  return (
    <>
      <Navbar />

      {/* ── Page Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          padding:    "4rem 0 3rem",
          textAlign:  "center",
          paddingTop: "100px",
        }}
      >
        <div className="container">
          
          <h1
            style={{
              color:        "white",
              fontWeight:   800,
              fontSize:     "clamp(1.8rem, 4vw, 2.8rem)",
              marginBottom: "0.75rem",
            }}
          >
            Our Products
          </h1>
          <p
            style={{
              color:      "rgba(255,255,255,0.8)",
              fontSize:   "1rem",
              maxWidth:   500,
              margin:     "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Explore our wide range of premium export quality product
            categories sourced from across India.
          </p>

          {/* ── Search Bar ── */}
          <div
            style={{
              maxWidth:     480,
              margin:       "0 auto",
              position:     "relative",
            }}
          >
            <FiSearch
              size={18}
              style={{
                position:  "absolute",
                left:      "1rem",
                top:       "50%",
                transform: "translateY(-50%)",
                color:     "#6c757d",
              }}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width:        "100%",
                padding:      "0.85rem 1rem 0.85rem 2.75rem",
                borderRadius: "12px",
                border:       "none",
                fontSize:     "0.95rem",
                boxShadow:    "0 4px 20px rgba(0,0,0,0.12)",
                outline:      "none",
                color:        "#1a1a2e",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section style={{ padding: "5rem 0", background: "#f8faff", minHeight: "60vh" }}>
        <div className="container">

          {/* Loading Skeleton */}
          {loading ? (
            <div className="row g-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div
                    style={{
                      height:       340,
                      borderRadius: 16,
                      background:   "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation:    "shimmer 1.5s infinite",
                    }}
                  />
                </div>
              ))}
            </div>

          /* No Results */
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <FiGrid size={52} className="mb-3" style={{ color: "#dee2e6" }} />
              <h5 style={{ color: "#6c757d", fontWeight: 600 }}>
                {search ? `No results for "${search}"` : "No categories yet."}
              </h5>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    marginTop:    "1rem",
                    background:   "#0d6efd",
                    border:       "none",
                    borderRadius: "8px",
                    color:        "white",
                    padding:      "0.5rem 1.5rem",
                    fontWeight:   600,
                    cursor:       "pointer",
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>

          /* Categories Grid */
          ) : (
            <>
              {/* Result count */}
              <p
                className="text-muted small mb-4"
                style={{ fontWeight: 500 }}
              >
                Showing{" "}
                <strong style={{ color: "#0d6efd" }}>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "category" : "categories"}
                {search && ` for "${search}"`}
              </p>

              <div className="row g-4">
                {filtered.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="col-12 col-sm-6 col-lg-4 animate-slide-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div
                      className="category-card h-100"
                      onClick={() => navigate(`/products/${cat.slug}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Image */}
                      <div
                        style={{
                          overflow:     "hidden",
                          borderRadius: "12px 12px 0 0",
                          position:     "relative",
                        }}
                      >
                        <img
                          src={cat.imageUrl || "https://placehold.co/400x220?text=Category"}
                          alt={cat.name}
                          style={{
                            width:      "100%",
                            height:     220,
                            objectFit:  "cover",
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/400x220?text=Category";
                          }}
                        />
                        {/* Hover overlay */}
                        <div
                          style={{
                            position:   "absolute",
                            inset:      0,
                            background: "rgba(13,110,253,0)",
                            transition: "background 0.3s ease",
                          }}
                          onMouseEnter={(e) =>
                            e.currentTarget.style.background = "rgba(13,110,253,0.08)"
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.style.background = "rgba(13,110,253,0)"
                          }
                        />
                      </div>

                      {/* Body */}
                      <div className="p-4" style={{ flex: 1 }}>
                        <h5
                          style={{
                            fontWeight:   700,
                            marginBottom: "0.5rem",
                            color:        "#1a1a2e",
                            fontSize:     "1.05rem",
                          }}
                        >
                          {cat.name}
                        </h5>
                        <p
                          className="text-muted small mb-4"
                          style={{
                            lineHeight:        1.6,
                            display:           "-webkit-box",
                            WebkitLineClamp:   3,
                            WebkitBoxOrient:   "vertical",
                            overflow:          "hidden",
                          }}
                        >
                          {cat.description || "Click to explore products in this category."}
                        </p>
                        <div
                          style={{
                            display:    "flex",
                            alignItems: "center",
                            gap:        "0.4rem",
                            color:      "#0d6efd",
                            fontWeight: 600,
                            fontSize:   "0.88rem",
                          }}
                        >
                          View Products <FiArrowRight size={15} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
      <ScrollToTop />

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default Products;