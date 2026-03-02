import { useState, useEffect } from "react";
import { useNavigate }          from "react-router-dom";
import { getBlogs }             from "../firebase/firestore";
import Navbar                   from "../components/common/Navbar";
import Footer                   from "../components/common/Footer";
import ScrollToTop              from "../components/common/ScrollToTop";
import {
  FiCalendar, FiArrowRight,
  FiFileText, FiSearch
}                               from "react-icons/fi";
import { formatDate, truncateText } from "../utils/helpers";
import "../styles/custom.css";

const Blog = () => {
  const [blogs,    setBlogs]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [visible,  setVisible]  = useState(false);
  const navigate                = useNavigate();

  // ── Scroll to top ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Trigger animation ──────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Fetch published blogs ──────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBlogs(true); // published only
        setBlogs(data);
        setFiltered(data);
      } catch {
        console.error("Failed to load blogs");
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
      setFiltered(blogs);
    } else {
      setFiltered(
        blogs.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            (b.description || "").toLowerCase().includes(q)
        )
      );
    }
  }, [search, blogs]);

  return (
    <>
      <Navbar />

      {/* ── Page Hero ── */}
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
              color:        "white",
              fontWeight:   800,
              fontSize:     "clamp(1.8rem, 4vw, 2.8rem)",
              marginBottom: "0.75rem",
            }}
          >
            Our Blog
          </h1>
          <p
            style={{
              color:      "rgba(255,255,255,0.8)",
              fontSize:   "1rem",
              maxWidth:   480,
              margin:     "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Stay updated with the latest news, insights, and updates
            from SC Global Exports & Imports.
          </p>

          {/* Search Bar */}
          <div
            style={{
              maxWidth:  480,
              margin:    "0 auto",
              position:  "relative",
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
              placeholder="Search blog posts..."
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

      {/* ── Blog Listing ── */}
      <section
        style={{
          padding:   "5rem 0",
          background: "#f8faff",
          minHeight: "60vh",
        }}
      >
        <div className="container">

          {/* Loading Skeleton */}
          {loading ? (
            <div className="row g-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <div
                    style={{
                      borderRadius: 16,
                      overflow:     "hidden",
                      boxShadow:    "0 4px 16px rgba(0,0,0,0.06)",
                      background:   "white",
                    }}
                  >
                    {/* Image skeleton */}
                    <div
                      style={{
                        height:       220,
                        background:   "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation:    "shimmer 1.5s infinite",
                      }}
                    />
                    {/* Content skeleton */}
                    <div style={{ padding: "1.25rem" }}>
                      {[60, 90, 70, 50].map((w, j) => (
                        <div
                          key={j}
                          style={{
                            height:       13,
                            width:        `${w}%`,
                            borderRadius: 6,
                            marginBottom: 10,
                            background:   "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                            backgroundSize: "200% 100%",
                            animation:    "shimmer 1.5s infinite",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          /* Empty State */
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <FiFileText
                size={56}
                className="mb-3"
                style={{ color: "#dee2e6" }}
              />
              <h5 style={{ color: "#6c757d", fontWeight: 600 }}>
                {search
                  ? `No posts found for "${search}"`
                  : "No blog posts published yet."}
              </h5>
              <p className="text-muted small">
                {search
                  ? "Try a different search term."
                  : "Check back soon for updates!"}
              </p>
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

          /* Blog Grid */
          ) : (
            <>
              {/* Result Count */}
              <p
                className="text-muted small mb-4"
                style={{ fontWeight: 500 }}
              >
                Showing{" "}
                <strong style={{ color: "#0d6efd" }}>{filtered.length}</strong>{" "}
                post{filtered.length !== 1 ? "s" : ""}
                {search && ` for "${search}"`}
              </p>

              {/* Featured Post (first post larger) */}
              {!search && filtered.length > 0 && (
                <div
                  className="mb-4"
                  onClick={() => navigate(`/blog/${filtered[0].slug}`)}
                  style={{
                    borderRadius: 16,
                    overflow:     "hidden",
                    background:   "white",
                    boxShadow:    "0 4px 24px rgba(0,0,0,0.07)",
                    cursor:       "pointer",
                    display:      "flex",
                    flexDirection: "column",
                    opacity:      visible ? 1 : 0,
                    transform:    visible ? "translateY(0)" : "translateY(20px)",
                    transition:   "all 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 36px rgba(13,110,253,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)";
                  }}
                >
                  <div className="row g-0">
                    {/* Featured Image */}
                    <div className="col-12 col-md-6">
                      <div style={{ height: "100%", minHeight: 280, overflow: "hidden" }}>
                        <img
                          src={filtered[0].coverImage || "https://placehold.co/600x320?text=Blog"}
                          alt={filtered[0].title}
                          style={{
                            width:      "100%",
                            height:     "100%",
                            objectFit:  "cover",
                            minHeight:  280,
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.04)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/600x320?text=Blog";
                          }}
                        />
                      </div>
                    </div>

                    {/* Featured Content */}
                    <div
                      className="col-12 col-md-6"
                      style={{
                        padding:        "2.5rem",
                        display:        "flex",
                        flexDirection:  "column",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="badge rounded-pill mb-3"
                        style={{
                          background: "#e8f0fe",
                          color:      "#0d6efd",
                          fontSize:   "0.72rem",
                          fontWeight: 600,
                          width:      "fit-content",
                          padding:    "0.35rem 0.85rem",
                        }}
                      >
                        Featured Post
                      </span>
                      <div
                        style={{
                          display:    "flex",
                          alignItems: "center",
                          gap:        "0.4rem",
                          color:      "#adb5bd",
                          fontSize:   "0.78rem",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FiCalendar size={12} />
                        {formatDate(filtered[0].createdAt)}
                      </div>
                      <h3
                        style={{
                          fontWeight:   700,
                          fontSize:     "1.35rem",
                          color:        "#1a1a2e",
                          marginBottom: "0.75rem",
                          lineHeight:   1.35,
                        }}
                      >
                        {filtered[0].title}
                      </h3>
                      <p
                        style={{
                          color:        "#6c757d",
                          lineHeight:   1.7,
                          marginBottom: "1.5rem",
                          fontSize:     "0.92rem",
                        }}
                      >
                        {truncateText(filtered[0].description, 160)}
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
                        Read Full Post <FiArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining Blog Cards */}
              <div className="row g-4">
                {(search ? filtered : filtered.slice(1)).map((blog, i) => (
                  <div
                    key={blog.id}
                    className="col-12 col-md-6 col-lg-4"
                    style={{
                      opacity:    visible ? 1 : 0,
                      transform:  visible ? "translateY(0)" : "translateY(30px)",
                      transition: `all 0.5s ease ${(i + 1) * 0.08}s`,
                    }}
                  >
                    <div
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      style={{
                        borderRadius:  16,
                        overflow:      "hidden",
                        background:    "white",
                        boxShadow:     "0 4px 20px rgba(0,0,0,0.06)",
                        cursor:        "pointer",
                        height:        "100%",
                        display:       "flex",
                        flexDirection: "column",
                        transition:    "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,110,253,0.13)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                      }}
                    >
                      {/* Cover Image */}
                      <div style={{ overflow: "hidden", flexShrink: 0 }}>
                        <img
                          src={blog.coverImage || "https://placehold.co/400x220?text=Blog"}
                          alt={blog.title}
                          style={{
                            width:      "100%",
                            height:     200,
                            objectFit:  "cover",
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/400x220?text=Blog";
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div
                        style={{
                          padding:       "1.25rem",
                          flex:          1,
                          display:       "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Date */}
                        <div
                          style={{
                            display:      "flex",
                            alignItems:   "center",
                            gap:          "0.4rem",
                            color:        "#adb5bd",
                            fontSize:     "0.75rem",
                            marginBottom: "0.6rem",
                          }}
                        >
                          <FiCalendar size={12} />
                          {formatDate(blog.createdAt)}
                        </div>

                        {/* Title */}
                        <h6
                          style={{
                            fontWeight:   700,
                            fontSize:     "1rem",
                            color:        "#1a1a2e",
                            marginBottom: "0.5rem",
                            lineHeight:   1.4,
                          }}
                        >
                          {blog.title}
                        </h6>

                        {/* Description */}
                        <p
                          style={{
                            color:        "#6c757d",
                            fontSize:     "0.85rem",
                            lineHeight:   1.65,
                            marginBottom: "1rem",
                            flex:         1,
                          }}
                        >
                          {truncateText(blog.description, 110)}
                        </p>

                        {/* Read More */}
                        <div
                          style={{
                            display:    "flex",
                            alignItems: "center",
                            gap:        "0.3rem",
                            color:      "#0d6efd",
                            fontWeight: 600,
                            fontSize:   "0.82rem",
                          }}
                        >
                          Read More <FiArrowRight size={13} />
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

export default Blog;