import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiAward } from "react-icons/fi";

import aapliSeva   from "../../assets/images/certifications/aapli-seva_logo.jpg";
import msme        from "../../assets/images/certifications/MSME_logo.jpg";
import udyogAadhar from "../../assets/images/certifications/udyog-aadhar_logo.jpg";
import satyamev    from "../../assets/images/certifications/satyamev_jayte_logo.jpg";

const certifications = [
  { id: 1, image: aapliSeva,   label: "Aapli Seva"       },
  { id: 2, image: msme,        label: "MSME"              },
  { id: 3, image: udyogAadhar, label: "Udyog Aadhar"      },
  { id: 4, image: satyamev,    label: "Satyamev Jayate"   },
];

// Duplicate for infinite loop effect
const ITEMS = [...certifications, ...certifications, ...certifications];

const CARD_WIDTH    = 220; // px per card (desktop)
const CARD_GAP      = 24;  // px gap between cards
const VISIBLE_COUNT = 3;   // cards visible at once
const AUTO_INTERVAL = 3000; // ms

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(certifications.length); // start at middle clone
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused]               = useState(false);
  const [visible, setVisible]                 = useState(false);
  const sectionRef  = useRef(null);
  const intervalRef = useRef(null);

  // ── Scroll animation ──────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Auto scroll ───────────────────────────
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      goNext();
    }, AUTO_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, currentIndex]);

  // ── Infinite loop jump (no animation) ─────
  useEffect(() => {
    const total = certifications.length;
    if (currentIndex >= total * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(total);
      }, 400);
    }
    if (currentIndex < total) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(total * 2 - 1);
      }, 400);
    }
  }, [currentIndex]);

  // Re-enable transition after jump
  useEffect(() => {
    if (!isTransitioning) {
      const t = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(t);
    }
  }, [isTransitioning]);

  const goNext = () => setCurrentIndex((i) => i + 1);
  const goPrev = () => setCurrentIndex((i) => i - 1);

  const translateX = -(currentIndex * (CARD_WIDTH + CARD_GAP));

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "5rem 0",
        background: "#f8faff",
        overflow: "hidden",
      }}
    >
      <style>{`
        .cert-track {
          display: flex;
          gap: ${CARD_GAP}px;
          will-change: transform;
        }
        .cert-card {
          flex-shrink: 0;
          width: ${CARD_WIDTH}px;
          background: white;
          border-radius: 16px;
          padding: 2rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 12px rgba(13,110,253,0.07);
          border: 1.5px solid rgba(13,110,253,0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        .cert-card:hover {
          box-shadow: 0 8px 28px rgba(13,110,253,0.13);
        }

        /* ── Side cards: dimmed & slightly smaller ── */
        .cert-card-side {
          transform: scale(0.9);
          opacity: 0.55;
          filter: grayscale(30%);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.4s ease,
                      filter 0.4s ease,
                      box-shadow 0.4s ease;
        }

        /* ── Center card: zoomed in, vivid, glowing ── */
        .cert-card-active {
          transform: scale(1.1);
          opacity: 1;
          filter: none;
          border-color: rgba(13,110,253,0.35);
          box-shadow:
            0 0 0 3px rgba(13,110,253,0.12),
            0 12px 40px rgba(13,110,253,0.22);
          background: linear-gradient(160deg, #ffffff 60%, #eef4ff 100%);
          z-index: 2;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.4s ease,
                      box-shadow 0.4s ease,
                      border-color 0.4s ease;
        }

        /* ── Center image wrap: larger + glowing ring ── */
        .cert-img-wrap-active {
          width: 128px !important;
          height: 128px !important;
          border: 2px solid rgba(13,110,253,0.3) !important;
          box-shadow: 0 0 0 5px rgba(13,110,253,0.08);
          background: #e8f0fe !important;
        }
        .cert-img-wrap {
          width: 110px;
          height: 110px;
          border-radius: 12px;
          overflow: hidden;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(13,110,253,0.1);
        }
        .cert-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 8px;
        }
        .cert-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a1a2e;
          text-align: center;
        }
        .cert-badge {
          font-size: 0.7rem;
          background: #e8f0fe;
          color: #0d6efd;
          border-radius: 20px;
          padding: 2px 10px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .cert-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(13,110,253,0.2);
          background: white;
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .cert-arrow-btn:hover {
          background: #0d6efd;
          color: white;
          border-color: #0d6efd;
          box-shadow: 0 4px 12px rgba(13,110,253,0.25);
        }
        .cert-dots {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .cert-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #adb5bd;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .cert-dot.active {
          background: #0d6efd;
          width: 20px;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .cert-card { width: 72vw; }
          .cert-slider-viewport { max-width: 100% !important; }
        }
      `}</style>

      <div className="container">

        {/* ── Section Header ── */}
        <div
          className="text-center mb-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.6s ease",
          }}
        >
          <div
            className="d-inline-flex align-items-center gap-2 mb-3"
            style={{
              background: "#e8f0fe",
              color: "#0d6efd",
              borderRadius: 20,
              padding: "5px 16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            <FiAward size={14} />
            TRUSTED & CERTIFIED
          </div>
          <h2
            className="section-title mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
          >
            Our Certifications
          </h2>
          <p className="text-muted" style={{ maxWidth: 480, margin: "0 auto" }}>
            Recognised by leading authorities — ensuring quality, compliance,
            and trust across every export.
          </p>
        </div>

        {/* ── Slider ── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.15s",
          }}
        >
          <div
            className="d-flex align-items-center gap-3"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Prev Arrow */}
            <button className="cert-arrow-btn" onClick={goPrev} aria-label="Previous">
              <FiChevronLeft size={20} />
            </button>

            {/* Viewport */}
            <div
              className="cert-slider-viewport"
              style={{
                overflow: "hidden",
                maxWidth: `${VISIBLE_COUNT * (CARD_WIDTH + CARD_GAP) - CARD_GAP}px`,
                margin: "0 auto",
                flex: 1,
              }}
            >
              <div
                className="cert-track"
                style={{
                  transform: `translateX(${translateX}px)`,
                  transition: isTransitioning ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)" : "none",
                  alignItems: "center",
                }}
              >
                {ITEMS.map((cert, idx) => {
                  // The middle card of the 3 visible ones is at currentIndex + 1
                  const isCenter = idx === currentIndex + 1;
                  return (
                    <div
                      key={idx}
                      className={`cert-card ${isCenter ? "cert-card-active" : "cert-card-side"}`}
                    >
                      <div className={`cert-img-wrap ${isCenter ? "cert-img-wrap-active" : ""}`}>
                        <img src={cert.image} alt={cert.label} />
                      </div>
                      <div className="cert-label">{cert.label}</div>
                      <span className="cert-badge">Certified</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Arrow */}
            <button className="cert-arrow-btn" onClick={goNext} aria-label="Next">
              <FiChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}
          <div className="cert-dots">
            {certifications.map((_, i) => (
              <div
                key={i}
                className={`cert-dot ${
                  ((currentIndex - certifications.length) % certifications.length + certifications.length) % certifications.length === i
                    ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(certifications.length + i)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Certifications;