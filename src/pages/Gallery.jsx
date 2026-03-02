import { useState, useEffect, useCallback } from "react";
import { getGalleryImages }                  from "../firebase/firestore";
import Navbar                                from "../components/common/Navbar";
import Footer                                from "../components/common/Footer";
import ScrollToTop                           from "../components/common/ScrollToTop";
import { FiX, FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import "../styles/custom.css";

const Gallery = () => {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState(null); // index of opened image
  const [visible,  setVisible]  = useState(false);

  // ── Scroll to top ──────────────────────────
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Trigger animation ──────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Fetch Gallery Images ───────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data);
      } catch {
        console.error("Failed to load gallery images");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Lightbox Navigation ────────────────────
  const openLightbox  = (index)  => setLightbox(index);
  const closeLightbox = ()       => setLightbox(null);

  const prevImage = useCallback(() => {
    setLightbox((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightbox((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // ── Keyboard Navigation ────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (lightbox === null) return;
      if (e.key === "Escape")      closeLightbox();
      if (e.key === "ArrowLeft")   prevImage();
      if (e.key === "ArrowRight")  nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, prevImage, nextImage]);

  // ── Lock body scroll when lightbox open ────
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [lightbox]);

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
            Gallery
          </h1>
          <p
            style={{
              color:      "rgba(255,255,255,0.8)",
              fontSize:   "1rem",
              maxWidth:   480,
              margin:     "0 auto",
              lineHeight: 1.7,
            }}
          >
            A glimpse into our warehouse, shipments, and global operations.
          </p>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section
        style={{
          padding:    "5rem 0",
          background: "#f8faff",
          minHeight:  "60vh",
        }}
      >
        <div className="container">

          {/* Loading Skeleton */}
          {loading ? (
            <div className="row g-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div
                    style={{
                      height:       280,
                      borderRadius: 12,
                      background:   "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation:    "shimmer 1.5s infinite",
                    }}
                  />
                </div>
              ))}
            </div>

          /* Empty State */
          ) : images.length === 0 ? (
            <div className="text-center py-5">
              <FiImage size={56} className="mb-3" style={{ color: "#dee2e6" }} />
              <h5 style={{ color: "#6c757d", fontWeight: 600 }}>
                No gallery images yet.
              </h5>
              <p className="text-muted small">
                Check back soon — we're adding photos!
              </p>
            </div>

          /* Image Grid */
          ) : (
            <>
              {/* Count */}
              <p
                className="text-muted small mb-4"
                style={{ fontWeight: 500 }}
              >
                Showing{" "}
                <strong style={{ color: "#0d6efd" }}>{images.length}</strong>{" "}
                {images.length === 1 ? "image" : "images"}
              </p>

              <div className="row g-3">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="col-12 col-sm-6 col-lg-4"
                    style={{
                      opacity:    visible ? 1 : 0,
                      transform:  visible ? "translateY(0)" : "translateY(30px)",
                      transition: `all 0.5s ease ${i * 0.05}s`,
                    }}
                  >
                    <div
                      onClick={() => openLightbox(i)}
                      style={{
                        height:       280,
                        borderRadius: 12,
                        overflow:     "hidden",
                        cursor:       "pointer",
                        position:     "relative",
                        boxShadow:    "0 4px 16px rgba(0,0,0,0.08)",
                        background:   "#e9ecef",
                      }}
                    >
                      {/* Image */}
                      <img
                        src={img.imageUrl}
                        alt={`Gallery ${i + 1}`}
                        style={{
                          width:      "100%",
                          height:     "100%",
                          objectFit:  "cover",
                          transition: "transform 0.45s ease",
                          display:    "block",
                        }}
                        onMouseEnter={(e) =>
                          e.target.style.transform = "scale(1.07)"
                        }
                        onMouseLeave={(e) =>
                          e.target.style.transform = "scale(1)"
                        }
                        onError={(e) => {
                          e.target.src = "https://placehold.co/400x280?text=Image";
                        }}
                      />

                      {/* Hover Overlay */}
                      <div
                        className="gallery-overlay"
                        style={{
                          position:       "absolute",
                          inset:          0,
                          background:     "rgba(13,110,253,0)",
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          transition:     "background 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(13,110,253,0.3)";
                          e.currentTarget.querySelector(".zoom-icon").style.opacity = "1";
                          e.currentTarget.querySelector(".zoom-icon").style.transform = "scale(1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(13,110,253,0)";
                          e.currentTarget.querySelector(".zoom-icon").style.opacity = "0";
                          e.currentTarget.querySelector(".zoom-icon").style.transform = "scale(0.8)";
                        }}
                      >
                        <div
                          className="zoom-icon"
                          style={{
                            width:          44,
                            height:         44,
                            borderRadius:   "50%",
                            background:     "rgba(255,255,255,0.9)",
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            opacity:        0,
                            transform:      "scale(0.8)",
                            transition:     "all 0.3s ease",
                            color:          "#0d6efd",
                            fontSize:       "1.2rem",
                            fontWeight:     700,
                          }}
                        >
                          ⊕
                        </div>
                      </div>

                      {/* Image Number */}
                      <div
                        style={{
                          position:     "absolute",
                          top:          10,
                          right:        10,
                          background:   "rgba(0,0,0,0.45)",
                          borderRadius: 6,
                          padding:      "2px 8px",
                          color:        "rgba(255,255,255,0.85)",
                          fontSize:     "0.72rem",
                          fontWeight:   600,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════ */}
      {lightbox !== null && (
        <div
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(0,0,0,0.92)",
            zIndex:         2000,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            animation:      "fadeIn 0.2s ease",
          }}
          onClick={closeLightbox}
        >

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position:       "absolute",
              top:            "1.25rem",
              right:          "1.25rem",
              background:     "rgba(255,255,255,0.12)",
              border:         "1px solid rgba(255,255,255,0.2)",
              borderRadius:   "50%",
              width:          42,
              height:         42,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
              zIndex:         10,
              transition:     "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.22)"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.12)"
            }
          >
            <FiX size={20} />
          </button>

          {/* Counter */}
          <div
            style={{
              position:   "absolute",
              top:        "1.25rem",
              left:       "50%",
              transform:  "translateX(-50%)",
              color:      "rgba(255,255,255,0.7)",
              fontSize:   "0.85rem",
              fontWeight: 600,
              zIndex:     10,
            }}
          >
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            style={{
              position:       "absolute",
              left:           "1.25rem",
              top:            "50%",
              transform:      "translateY(-50%)",
              background:     "rgba(255,255,255,0.12)",
              border:         "1px solid rgba(255,255,255,0.2)",
              borderRadius:   "50%",
              width:          48,
              height:         48,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
              zIndex:         10,
              transition:     "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.22)"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.12)"
            }
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Image */}
          <img
            key={lightbox}
            src={images[lightbox]?.imageUrl}
            alt={`Gallery ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth:     "88vw",
              maxHeight:    "88vh",
              objectFit:    "contain",
              borderRadius: 12,
              boxShadow:    "0 24px 64px rgba(0,0,0,0.6)",
              animation:    "fadeIn 0.25s ease",
              userSelect:   "none",
            }}
            onError={(e) => {
              e.target.src = "https://placehold.co/800x600?text=Image";
            }}
          />

          {/* Next Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            style={{
              position:       "absolute",
              right:          "1.25rem",
              top:            "50%",
              transform:      "translateY(-50%)",
              background:     "rgba(255,255,255,0.12)",
              border:         "1px solid rgba(255,255,255,0.2)",
              borderRadius:   "50%",
              width:          48,
              height:         48,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
              zIndex:         10,
              transition:     "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.22)"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.12)"
            }
          >
            <FiChevronRight size={24} />
          </button>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div
              style={{
                position:       "absolute",
                bottom:         "1.25rem",
                left:           "50%",
                transform:      "translateX(-50%)",
                display:        "flex",
                gap:            "0.5rem",
                padding:        "0.5rem",
                background:     "rgba(0,0,0,0.4)",
                borderRadius:   12,
                backdropFilter: "blur(8px)",
                maxWidth:       "90vw",
                overflowX:      "auto",
                scrollbarWidth: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={`Thumb ${i + 1}`}
                  onClick={() => setLightbox(i)}
                  style={{
                    width:        i === lightbox ? 52 : 44,
                    height:       i === lightbox ? 52 : 44,
                    objectFit:    "cover",
                    borderRadius: 8,
                    cursor:       "pointer",
                    border:       i === lightbox
                      ? "2px solid #0d6efd"
                      : "2px solid transparent",
                    opacity:    i === lightbox ? 1 : 0.55,
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/52x52?text=IMG";
                  }}
                />
              ))}
            </div>
          )}
        </div>
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

export default Gallery;