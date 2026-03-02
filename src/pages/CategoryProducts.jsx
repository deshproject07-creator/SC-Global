import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate }      from "react-router-dom";
import {
  getCategoryBySlug,
  getProductsByCategoryPaginated,
}                                      from "../firebase/firestore";
import Navbar                          from "../components/common/Navbar";
import Footer                          from "../components/common/Footer";
import ScrollToTop                     from "../components/common/ScrollToTop";
import ProductModal                    from "../components/products/ProductModal";
import {
  FiSearch, FiArrowLeft,
  FiPackage, FiLoader
}                                      from "react-icons/fi";
import "../styles/custom.css";

const PAGE_SIZE = 9;

const CategoryProducts = () => {
  const { slug }                        = useParams();
  const navigate                        = useNavigate();

  const [category, setCategory]         = useState(null);
  const [products, setProducts]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [search,   setSearch]           = useState("");
  const [loading,  setLoading]          = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [hasMore,  setHasMore]          = useState(false);
  const [lastDoc,  setLastDoc]          = useState(null);
  const [selected, setSelected]         = useState(null); // for modal
  const [notFound, setNotFound]         = useState(false);

  // ── Scroll to top ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // ── Fetch Category + First Page ────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProducts([]);
      setFiltered([]);
      setLastDoc(null);
      setHasMore(false);
      setSearch("");

      try {
        // Get category by slug
        const cat = await getCategoryBySlug(slug);
        if (!cat) { setNotFound(true); setLoading(false); return; }
        setCategory(cat);

        // Get first page of products
        const { products: prods, lastVisible, hasMore: more } =
          await getProductsByCategoryPaginated(cat.id, PAGE_SIZE);

        setProducts(prods);
        setFiltered(prods);
        setLastDoc(lastVisible);
        setHasMore(more);
      } catch {
        console.error("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // ── Search Filter ──────────────────────────
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q)
        )
      );
    }
  }, [search, products]);

  // ── Load More ──────────────────────────────
  const handleLoadMore = async () => {
    if (!lastDoc || !category) return;
    setLoadingMore(true);
    try {
      const { products: more, lastVisible, hasMore: moreAvail } =
        await getProductsByCategoryPaginated(category.id, PAGE_SIZE, lastDoc);

      const combined = [...products, ...more];
      setProducts(combined);
      setFiltered(combined);
      setLastDoc(lastVisible);
      setHasMore(moreAvail);
    } catch {
      console.error("Failed to load more products");
    } finally {
      setLoadingMore(false);
    }
  };

  // ── Not Found ──────────────────────────────
  if (notFound) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight:      "70vh",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexDirection:  "column",
            gap:            "1rem",
            textAlign:      "center",
            padding:        "2rem",
          }}
        >
          <FiPackage size={60} style={{ color: "#dee2e6" }} />
          <h4 style={{ color: "#6c757d" }}>Category Not Found</h4>
          <p style={{ color: "#adb5bd" }}>
            The category you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              background:   "#0d6efd",
              border:       "none",
              borderRadius: "10px",
              color:        "white",
              padding:      "0.65rem 1.75rem",
              fontWeight:   600,
              cursor:       "pointer",
            }}
          >
            View All Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ── Page Hero ── */}
      <section
        style={{
          background:   "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
          padding:      "4rem 0 3rem",
          textAlign:    "center",
          position:     "relative",
          overflow:     "hidden",
        }}
      >
        {/* Background image overlay */}
        {category?.imageUrl && (
          <div
            style={{
              position:           "absolute",
              inset:              0,
              backgroundImage:    `url(${category.imageUrl})`,
              backgroundSize:     "cover",
              backgroundPosition: "center",
              opacity:            0.15,
            }}
          />
        )}

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          {/* Back Button */}
          <button
            onClick={() => navigate("/products")}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "0.4rem",
              background:   "rgba(255,255,255,0.15)",
              border:       "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              color:        "white",
              padding:      "0.4rem 1rem",
              fontSize:     "0.82rem",
              fontWeight:   500,
              cursor:       "pointer",
              marginBottom: "1.25rem",
              transition:   "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.25)"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.15)"
            }
          >
            <FiArrowLeft size={14} /> All Products
          </button>

          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              background: "rgba(255,255,255,0.15)",
              color:      "white",
              fontSize:   "0.78rem",
              fontWeight: 600,
              border:     "1px solid rgba(255,255,255,0.25)",
              display:    "block",
              width:      "fit-content",
              margin:     "0 auto 0.75rem",
            }}
          >
            Product Category
          </span>

          <h1
            style={{
              color:        "white",
              fontWeight:   800,
              fontSize:     "clamp(1.8rem, 4vw, 2.8rem)",
              marginBottom: "0.75rem",
            }}
          >
            {loading ? "Loading..." : category?.name}
          </h1>

          {category?.description && (
            <p
              style={{
                color:      "rgba(255,255,255,0.8)",
                fontSize:   "1rem",
                maxWidth:   500,
                margin:     "0 auto 2rem",
                lineHeight: 1.7,
              }}
            >
              {category.description}
            </p>
          )}

          {/* Search Bar */}
          <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
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
              placeholder={`Search in ${category?.name || "products"}...`}
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

      {/* ── Products Grid ── */}
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

          /* No Products */
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <FiPackage size={52} className="mb-3" style={{ color: "#dee2e6" }} />
              <h5 style={{ color: "#6c757d", fontWeight: 600 }}>
                {search
                  ? `No products match "${search}"`
                  : "No products in this category yet."}
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

          /* Products */
          ) : (
            <>
              {/* Result count */}
              <p className="text-muted small mb-4" style={{ fontWeight: 500 }}>
                Showing{" "}
                <strong style={{ color: "#0d6efd" }}>{filtered.length}</strong>{" "}
                product{filtered.length !== 1 ? "s" : ""}
                {search && ` matching "${search}"`}
              </p>

              <div className="row g-4">
                {filtered.map((prod, i) => (
                  <div
                    key={prod.id}
                    className="col-12 col-sm-6 col-lg-4 animate-slide-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div
                      className="product-card"
                      onClick={() => setSelected(prod)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Image */}
                      <div style={{ overflow: "hidden" }}>
                        <img
                          src={prod.imageUrl || "https://placehold.co/400x220?text=Product"}
                          alt={prod.name}
                          style={{
                            width:      "100%",
                            height:     220,
                            objectFit:  "cover",
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/400x220?text=Product";
                          }}
                        />
                      </div>

                      {/* Body */}
                      <div className="card-body">
                        <h6
                          style={{
                            fontWeight:   700,
                            marginBottom: "0.4rem",
                            color:        "#1a1a2e",
                          }}
                        >
                          {prod.name}
                        </h6>
                        <p
                          className="text-muted small mb-3"
                          style={{
                            lineHeight:        1.6,
                            display:           "-webkit-box",
                            WebkitLineClamp:   2,
                            WebkitBoxOrient:   "vertical",
                            overflow:          "hidden",
                          }}
                        >
                          {prod.description || "Click to view product details."}
                        </p>
                        <span
                          style={{
                            color:      "#0d6efd",
                            fontWeight: 600,
                            fontSize:   "0.82rem",
                          }}
                        >
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !search && (
                <div className="text-center mt-5">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{
                      background:   loadingMore ? "#e9ecef" : "linear-gradient(135deg, #0d6efd, #084298)",
                      border:       "none",
                      borderRadius: "10px",
                      color:        loadingMore ? "#6c757d" : "white",
                      padding:      "0.75rem 2.5rem",
                      fontWeight:   600,
                      fontSize:     "0.95rem",
                      cursor:       loadingMore ? "not-allowed" : "pointer",
                      boxShadow:    loadingMore ? "none" : "0 4px 16px rgba(13,110,253,0.3)",
                      transition:   "all 0.25s ease",
                      display:      "inline-flex",
                      alignItems:   "center",
                      gap:          "0.5rem",
                    }}
                  >
                    {loadingMore ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        Loading...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}

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

export default CategoryProducts;