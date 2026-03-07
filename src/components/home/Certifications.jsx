import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiAward } from "react-icons/fi";

import aapliSeva   from "../../assets/images/certifications/aapli-seva_logo.jpg";
import msme        from "../../assets/images/certifications/MSME_logo.jpg";
import udyogAadhar from "../../assets/images/certifications/udyog-aadhar_logo.jpg";
import satyamev    from "../../assets/images/certifications/satyamev_jayte_logo.jpg";

const certifications = [
  { id: 1, image: aapliSeva,   label: "Aapli Seva"     },
  { id: 2, image: msme,        label: "MSME"            },
  { id: 3, image: udyogAadhar, label: "Udyog Aadhar"    },
  { id: 4, image: satyamev,    label: "Satyamev Jayate" },
];

// Triple-clone so the infinite loop never shows a gap
const ITEMS        = [...certifications, ...certifications, ...certifications];
const AUTO_INTERVAL = 3000;

// ── Desktop constants ─────────────────────
const D_CARD  = 220; // card width  (px)
const D_GAP   = 28;  // gap between cards (px)
const D_STEP  = D_CARD + D_GAP;

// ── Mobile constants ──────────────────────
// Each card is 26vw wide, gap is 3vw.
// To centre the middle card we offset by:
//   -(index * step) + (viewport/2 - card/2)
// We do this in CSS via a calc trick.
const M_CARD_VW = 26;
const M_GAP_VW  = 3;
const M_STEP_VW = M_CARD_VW + M_GAP_VW; // 29vw per step

const Certifications = () => {
  // currentIndex always points to the "active" position in the ITEMS array
  // Start at certifications.length so we're in the middle clone set
  const [currentIndex, setCurrentIndex]       = useState(certifications.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused]               = useState(false);
  const [visible, setVisible]                 = useState(false);
  const [isMobile, setIsMobile]               = useState(window.innerWidth < 768);
  const touchStartX = useRef(null);
  const sectionRef  = useRef(null);

  // ── Resize detection ──────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Scroll-in animation ───────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Auto-scroll ───────────────────────────
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(goNext, AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [isPaused, currentIndex]);

  // ── Infinite loop: silent jump at boundaries ──
  useEffect(() => {
    const n = certifications.length;
    if (currentIndex >= n * 2) {
      setTimeout(() => { setIsTransitioning(false); setCurrentIndex(n); }, 430);
    }
    if (currentIndex < n) {
      setTimeout(() => { setIsTransitioning(false); setCurrentIndex(n * 2 - 1); }, 430);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isTransitioning) {
      const t = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(t);
    }
  }, [isTransitioning]);

  const goNext = () => setCurrentIndex((i) => i + 1);
  const goPrev = () => setCurrentIndex((i) => i - 1);

  // Touch swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  // Active dot (0-based within certifications[])
  const activeDot =
    ((currentIndex - certifications.length) % certifications.length
      + certifications.length) % certifications.length;

  // ── Desktop translateX ────────────────────
  // We want the card at currentIndex to sit in the MIDDLE of the 3-card viewport.
  // Viewport width = 3*D_CARD + 2*D_GAP
  // Left edge of card[currentIndex] = currentIndex * D_STEP
  // To centre it: shift so that card left = D_STEP (one card + one gap from left)
  const desktopTranslateX = -(currentIndex * D_STEP - D_STEP);

  return (
    <section
      ref={sectionRef}
      style={{ padding: "5rem 0", background: "#f8faff", overflow: "hidden" }}
    >
      <style>{`

        /* ════════════════════════════════════
           SHARED
        ════════════════════════════════════ */
        .cert-track {
          display: flex;
          align-items: center;
          will-change: transform;
        }

        .cert-card {
          flex-shrink: 0;
          background: white;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1.5px solid rgba(13,110,253,0.08);
          box-shadow: 0 2px 12px rgba(13,110,253,0.07);
          cursor: default;
          transition:
            transform    0.45s cubic-bezier(0.4,0,0.2,1),
            opacity      0.45s ease,
            filter       0.45s ease,
            box-shadow   0.45s ease,
            border-color 0.45s ease,
            background   0.45s ease;
        }

        .cert-card-side {
          transform: scale(0.88);
          opacity: 0.42;
          filter: grayscale(35%);
        }

        .cert-card-active {
          transform: scale(1.12);
          opacity: 1;
          filter: none;
          border-color: rgba(13,110,253,0.38);
          box-shadow:
            0 0 0 3px rgba(13,110,253,0.13),
            0 14px 44px rgba(13,110,253,0.24);
          background: linear-gradient(160deg, #ffffff 55%, #eef4ff 100%);
          position: relative;
          z-index: 2;
        }

        .cert-img-wrap {
          border-radius: 12px;
          overflow: hidden;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(13,110,253,0.1);
          transition:
            width        0.45s ease,
            height       0.45s ease,
            box-shadow   0.45s ease,
            border-color 0.45s ease,
            background   0.45s ease;
        }
        .cert-img-wrap img {
          width: 100%; height: 100%;
          object-fit: contain;
        }
        .cert-img-wrap-active {
          border: 2px solid rgba(13,110,253,0.32) !important;
          box-shadow: 0 0 0 6px rgba(13,110,253,0.08) !important;
          background: #e8f0fe !important;
        }

        .cert-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          color: #1a1a2e;
          text-align: center;
          line-height: 1.3;
        }
        .cert-badge {
          background: #e8f0fe;
          color: #0d6efd;
          border-radius: 20px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .cert-arrow-btn {
          border-radius: 50%;
          border: 1.5px solid rgba(13,110,253,0.2);
          background: white;
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
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
          margin-top: 2rem;
        }
        .cert-dot {
          width: 7px; height: 7px;
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

        /* ════════════════════════════════════
           DESKTOP ≥ 769px
           Viewport = exactly 3 cards wide.
           Track slides so active card is always centre.
        ════════════════════════════════════ */
        @media (min-width: 769px) {
          .cert-viewport {
            width: ${3 * D_CARD + 2 * D_GAP}px;   /* 716px */
            overflow: hidden;
            /* allow scale(1.12) to breathe without clipping */
            padding: 24px 0;
            margin: -24px 0;
          }
          .cert-track         { gap: ${D_GAP}px; }
          .cert-card          { width: ${D_CARD}px; padding: 2rem 1.5rem 1.5rem; gap: 1rem; }
          .cert-img-wrap      { width: 110px; height: 110px; }
          .cert-img-wrap img  { padding: 8px; }
          .cert-img-wrap-active { width: 130px !important; height: 130px !important; }
          .cert-label         { font-size: 0.9rem; }
          .cert-badge         { font-size: 0.7rem; padding: 2px 10px; }
          .cert-arrow-btn     { width: 44px; height: 44px; }
        }

        /* ════════════════════════════════════
           MOBILE ≤ 768px
           Viewport full flex-1.
           Cards are ${M_CARD_VW}vw wide, gap ${M_GAP_VW}vw.
           Active card is translated to centre of viewport.
        ════════════════════════════════════ */
        @media (max-width: 768px) {
          .cert-viewport {
            flex: 1;
            overflow: hidden;
            padding: 14px 0;
            margin: -14px 0;
          }
          .cert-track         { gap: ${M_GAP_VW}vw; }
          .cert-card          {
            width: ${M_CARD_VW}vw;
            padding: 1rem 0.5rem;
            gap: 0.6rem;
            border-radius: 12px;
          }
          .cert-img-wrap      { width: 48px; height: 48px; }
          .cert-img-wrap img  { padding: 5px; }
          .cert-img-wrap-active { width: 60px !important; height: 60px !important; }
          .cert-label         { font-size: 0.68rem; }
          .cert-badge         { display: none; }
          .cert-arrow-btn     { width: 36px; height: 36px; }
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "6px" : "16px",
              justifyContent: "center",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Prev */}
            <button className="cert-arrow-btn" onClick={goPrev} aria-label="Previous">
              <FiChevronLeft size={isMobile ? 16 : 20} />
            </button>

            {/* Viewport */}
            <div className="cert-viewport">
              <div
                className="cert-track"
                style={{
                  transform: isMobile
                    // Centre the active card:
                    // offset = -(index * step_vw) + 50vw - (card/2 + gap/2 ... actually half-step)
                    // Simpler: shift track so active card centre = viewport centre
                    // viewport = 100% of flex-1 ≈ (100vw - arrows - gaps)
                    // We approximate viewport as ~(100vw - 80px) for mobile
                    // Centre of viewport = (100vw - 80px)/2
                    // Centre of active card from track start = currentIndex*step + card/2
                    // translateX = viewport_centre - active_card_centre
                    //            = (100vw-80px)/2 - (currentIndex*step_vw + card/2_vw)
                    ? `translateX(calc(
                        (100vw - 80px) / 2
                        - ${currentIndex} * ${M_STEP_VW}vw
                        - ${M_CARD_VW / 2}vw
                      ))`
                    : `translateX(${desktopTranslateX}px)`,
                  transition: isTransitioning
                    ? "transform 0.45s cubic-bezier(0.4,0,0.2,1)"
                    : "none",
                }}
              >
                {ITEMS.map((cert, idx) => {
                  const isCenter = idx === currentIndex;
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

            {/* Next */}
            <button className="cert-arrow-btn" onClick={goNext} aria-label="Next">
              <FiChevronRight size={isMobile ? 16 : 20} />
            </button>
          </div>

          {/* Dots */}
          <div className="cert-dots">
            {certifications.map((_, i) => (
              <div
                key={i}
                className={`cert-dot ${activeDot === i ? "active" : ""}`}
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