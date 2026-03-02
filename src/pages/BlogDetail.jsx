import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogBySlug }          from "../firebase/firestore";
import Navbar                     from "../components/common/Navbar";
import Footer                     from "../components/common/Footer";
import ScrollToTop                from "../components/common/ScrollToTop";
import {
  FiCalendar, FiArrowLeft,
  FiFileText, FiShare2
}                                 from "react-icons/fi";
import { formatDate }             from "../utils/helpers";
import "../styles/custom.css";

const BlogDetail = () => {
  const { slug }               = useParams();
  const navigate               = useNavigate();
  const [blog,     setBlog]    = useState(null);
  const [loading,  setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied,   setCopied]  = useState(false);

  // ── Scroll to top ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // ── Fetch Blog ─────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getBlogBySlug(slug);
        if (!data || !data.published) {
          setNotFound(true);
        } else {
          setBlog(data);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  // ── Share / Copy Link ──────────────────────
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Not Found ──────────────────────────────
  if (!loading && notFound) {
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
          <FiFileText size={60} style={{ color: "#dee2e6" }} />
          <h4 style={{ color: "#6c757d" }}>Blog Post Not Found</h4>
          <p style={{ color: "#adb5bd" }}>
            This post may have been removed or is not published yet.
          </p>
          <button
            onClick={() => navigate("/blog")}
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
            Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ── Loading State ── */}
      {loading ? (
        <div style={{ padding: "5rem 0", background: "#f8faff" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            {/* Hero skeleton */}
            <div
              style={{
                height:       380,
                borderRadius: 16,
                marginBottom: "2rem",
                background:   "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation:    "shimmer 1.5s infinite",
              }}
            />
            {[80, 60, 95, 70, 85].map((w, i) => (
              <div
                key={i}
                style={{
                  height:       16,
                  width:        `${w}%`,
                  borderRadius: 8,
                  marginBottom: 14,
                  background:   "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                  backgroundSize: "200% 100%",
                  animation:    "shimmer 1.5s infinite",
                }}
              />
            ))}
          </div>
        </div>

      ) : blog && (
        <>
          {/* ── Cover Image Hero ── */}
          <div
            style={{
              height:             400,
              background:         "#1a1a2e",
              position:           "relative",
              overflow:           "hidden",
            }}
          >
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "cover",
                  opacity:    0.55,
                }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            {/* Overlay */}
            <div
              style={{
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)",
              }}
            />
            {/* Content */}
            <div
              className="container"
              style={{
                position:       "absolute",
                bottom:         "2.5rem",
                left:           "50%",
                transform:      "translateX(-50%)",
                width:          "100%",
                maxWidth:       760,
                padding:        "0 1rem",
              }}
            >
              {/* Back Button */}
              <button
                onClick={() => navigate("/blog")}
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
                  marginBottom: "1rem",
                  transition:   "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)"
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)"
                }
              >
                <FiArrowLeft size={14} /> Back to Blog
              </button>

              {/* Date */}
              <div
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "0.4rem",
                  color:        "rgba(255,255,255,0.75)",
                  fontSize:     "0.82rem",
                  marginBottom: "0.75rem",
                }}
              >
                <FiCalendar size={13} />
                {formatDate(blog.createdAt)}
              </div>

              {/* Title */}
              <h1
                style={{
                  color:      "white",
                  fontWeight: 800,
                  fontSize:   "clamp(1.5rem, 4vw, 2.2rem)",
                  lineHeight: 1.25,
                  margin:     0,
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {blog.title}
              </h1>
            </div>
          </div>

          {/* ── Blog Content ── */}
          <section
            style={{
              padding:    "4rem 0 5rem",
              background: "#f8faff",
            }}
          >
            <div
              className="container"
              style={{ maxWidth: 760 }}
            >
              <div
                style={{
                  background:   "white",
                  borderRadius: 16,
                  padding:      "2.5rem",
                  boxShadow:    "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Share Button */}
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "flex-end",
                    marginBottom:   "1.5rem",
                  }}
                >
                  <button
                    onClick={handleShare}
                    style={{
                      display:      "inline-flex",
                      alignItems:   "center",
                      gap:          "0.4rem",
                      background:   copied ? "#e8f0fe" : "transparent",
                      border:       "1.5px solid #dee2e6",
                      borderRadius: "8px",
                      color:        copied ? "#0d6efd" : "#6c757d",
                      padding:      "0.4rem 1rem",
                      fontSize:     "0.82rem",
                      fontWeight:   500,
                      cursor:       "pointer",
                      transition:   "all 0.2s ease",
                    }}
                  >
                    <FiShare2 size={14} />
                    {copied ? "Link Copied!" : "Share Post"}
                  </button>
                </div>

                {/* Description / Content */}
                <p
                  style={{
                    color:      "#3a3a5c",
                    lineHeight: 1.9,
                    fontSize:   "1.02rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {blog.description}
                </p>

                {/* Divider */}
                <hr style={{ margin: "2rem 0", borderColor: "#f1f3f5" }} />

                {/* Back to Blog */}
                <button
                  onClick={() => navigate("/blog")}
                  style={{
                    display:      "inline-flex",
                    alignItems:   "center",
                    gap:          "0.5rem",
                    background:   "transparent",
                    border:       "2px solid #0d6efd",
                    borderRadius: "10px",
                    color:        "#0d6efd",
                    fontWeight:   600,
                    fontSize:     "0.88rem",
                    padding:      "0.6rem 1.5rem",
                    cursor:       "pointer",
                    transition:   "all 0.2s ease",
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
                  <FiArrowLeft size={15} /> Back to Blog
                </button>
              </div>
            </div>
          </section>
        </>
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

export default BlogDetail;