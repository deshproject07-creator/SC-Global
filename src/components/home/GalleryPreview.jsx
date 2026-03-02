import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getGalleryImages } from "../../firebase/firestore";
import { FiArrowRight, FiImage, FiX } from "react-icons/fi";
import "../../styles/custom.css";

const GalleryPreview = () => {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
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
        const data = await getGalleryImages();
        setImages(data.slice(0, 6)); // show max 6 on homepage
      } catch {
        console.error("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        style={{ padding: "5rem 0", background: "#f8faff" }}
      >
        <div className="container">

          {/* ── Header ── */}
          <div
            className="d-flex align-items-end justify-content-between mb-5 flex-wrap gap-3"
            style={{
              opacity:    visible ? 1 : 0,
              transform:  visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease",
            }}
          >
            <div>
              
              <h2 className="section-title mb-0">Gallery</h2>
            </div>
            <button
              onClick={() => navigate("/gallery")}
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

          {/* ── Loading ── */}
          {loading ? (
            <div className="row g-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div
                    style={{
                      height:       240,
                      borderRadius: 12,
                      background:   "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation:    "shimmer 1.5s infinite",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FiImage size={48} className="mb-3 opacity-25" />
              <p>No gallery images yet.</p>
            </div>
          ) : (
            <div className="row g-3 stagger-children">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="col-12 col-sm-6 col-lg-4"
                  style={{
                    opacity:    visible ? 1 : 0,
                    transform:  visible ? "translateY(0)" : "translateY(30px)",
                    transition: `all 0.5s ease ${i * 0.08}s`,
                  }}
                >
                  <div
                    onClick={() => setLightbox(img)}
                    style={{
                      height:       240,
                      borderRadius: 12,
                      overflow:     "hidden",
                      cursor:       "pointer",
                      position:     "relative",
                      boxShadow:    "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Gallery ${i + 1}`}
                      style={{
                        width:      "100%",
                        height:     "100%",
                        objectFit:  "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
                      onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x240?text=Image";
                      }}
                    />
                    {/* Hover Overlay */}
                    <div
                      style={{
                        position:   "absolute",
                        inset:      0,
                        background: "rgba(13,110,253,0)",
                        transition: "background 0.3s ease",
                        display:    "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(13,110,253,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(13,110,253,0)";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(0,0,0,0.88)",
            zIndex:         2000,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "1rem",
            animation:      "fadeIn 0.2s ease",
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position:       "absolute",
              top:            "1rem",
              right:          "1rem",
              background:     "rgba(255,255,255,0.15)",
              border:         "none",
              borderRadius:   "50%",
              width:          40,
              height:         40,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
            }}
          >
            <FiX size={20} />
          </button>
          <img
            src={lightbox.imageUrl}
            alt="Gallery"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth:     "90vw",
              maxHeight:    "85vh",
              objectFit:    "contain",
              borderRadius: 12,
              boxShadow:    "0 20px 60px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default GalleryPreview;