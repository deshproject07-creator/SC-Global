import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../../firebase/firestore";
import { FiArrowRight, FiCalendar, FiFileText } from "react-icons/fi";
import { formatDate, truncateText } from "../../utils/helpers";
import "../../styles/custom.css";

const BlogPreview = () => {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef            = useRef(null);
  const navigate              = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBlogs(true);
        setBlogs(data.slice(0, 3));
      } catch {
        console.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="blog-preview-section"
      style={{ padding: "5rem 0", background: "white" }}
    >
      <div className="container">

        {/* ── Header ── */}
        <div
          className="d-flex align-items-end justify-content-between mb-5 flex-wrap gap-3 blog-preview-header"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          <div>
            <h2 className="section-title mb-0">From Our Blog</h2>
          </div>
          <button
            onClick={() => navigate("/blog")}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "0.4rem",
              background:   "transparent",
              border:       "2px solid #0d6efd",
              borderRadius: "10px",
              color:        "#0d6efd",
              fontWeight:   600,
              fontSize:     "0.85rem",
              padding:      "0.5rem 1.25rem",
              cursor:       "pointer",
              transition:   "all 0.2s ease",
              minHeight:    44,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0d6efd";
              e.currentTarget.style.color      = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color      = "#0d6efd";
            }}
          >
            View All <FiArrowRight size={15} />
          </button>
        </div>

        {/* ── Loading Skeleton ── */}
        {loading ? (
          <div className="row g-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="col-12 col-md-4">
                <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                  <div
                    style={{
                      height:         200,
                      background:     "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation:      "shimmer 1.5s infinite",
                    }}
                  />
                  <div style={{ padding: "1.25rem" }}>
                    {[80, 100, 60].map((w, j) => (
                      <div
                        key={j}
                        style={{
                          height:         14,
                          width:          `${w}%`,
                          borderRadius:   6,
                          background:     "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                          backgroundSize: "200% 100%",
                          animation:      "shimmer 1.5s infinite",
                          marginBottom:   10,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FiFileText size={48} className="mb-3 opacity-25" />
            <p>No blog posts published yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {blogs.map((blog, i) => (
              <div
                key={blog.id}
                className="col-12 col-md-4"
                style={{
                  opacity:    visible ? 1 : 0,
                  transform:  visible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.55s ease ${i * 0.1}s`,
                }}
              >
                <div
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  style={{
                    borderRadius:  16,
                    overflow:      "hidden",
                    boxShadow:     "0 4px 20px rgba(0,0,0,0.07)",
                    background:    "white",
                    cursor:        "pointer",
                    transition:    "all 0.3s ease",
                    height:        "100%",
                    display:       "flex",
                    flexDirection: "column",
                    border:        "1px solid #f1f3f5",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,110,253,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)";
                  }}
                >
                  {/* Cover Image */}
                  <div style={{ overflow: "hidden", flexShrink: 0 }}>
                    <img
                      src={blog.coverImage || "https://placehold.co/400x200?text=Blog"}
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
                        e.target.src = "https://placehold.co/400x200?text=Blog";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display:      "flex",
                        alignItems:   "center",
                        gap:          "0.4rem",
                        color:        "#adb5bd",
                        fontSize:     "0.78rem",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <FiCalendar size={12} />
                      {formatDate(blog.createdAt)}
                    </div>
                    <h6
                      style={{
                        fontWeight:   700,
                        fontSize:     "0.98rem",
                        color:        "#1a1a2e",
                        marginBottom: "0.5rem",
                        lineHeight:   1.4,
                      }}
                    >
                      {blog.title}
                    </h6>
                    <p
                      style={{
                        color:        "#6c757d",
                        fontSize:     "0.85rem",
                        lineHeight:   1.6,
                        marginBottom: "1rem",
                        flex:         1,
                      }}
                    >
                      {truncateText(blog.description, 100)}
                    </p>
                    <div
                      style={{
                        display:    "flex",
                        alignItems: "center",
                        gap:        "0.3rem",
                        color:      "#0d6efd",
                        fontWeight: 600,
                        fontSize:   "0.83rem",
                      }}
                    >
                      Read More <FiArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .blog-preview-section { padding: 3rem 0 !important; }
          .blog-preview-header  { margin-bottom: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default BlogPreview;