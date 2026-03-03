import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";

import welcomeImg from "../../assets/images/main_imgs/portmain_a.jpg";
import cashewImg  from "../../assets/images/cashew_images/cashew_a.jpg";
import riceImg    from "../../assets/images/rice_images/rice_a.jpg";
import silverImg  from "../../assets/images/silver_images/silver_b.jpg";

const slides = [
  {
    id:       1,
    image:    welcomeImg,
    title:    "Welcome To SC Global Imports & Exports",
    subtitle: "Trusted Global Trading Partner Since Over A Decade",
    cta:      "Explore Products",
  },
  {
    id:       2,
    image:    cashewImg,
    title:    "We Are Here To Export Cashew",
    subtitle: "Premium Quality Cashew Nuts Delivered Worldwide",
    cta:      "Explore Products",
  },
  {
    id:       3,
    image:    riceImg,
    title:    "Premium Quality Rice Export",
    subtitle: "Finest Basmati & Non-Basmati Rice for Global Markets",
    cta:      "Explore Products",
  },
  {
    id:       4,
    image:    silverImg,
    title:    "Pure Silver Products Export",
    subtitle: "Authentic Certified Silver Products Exported Globally",
    cta:      "Explore Products",
  },
];

const HeroBanner = () => {
  const [current,   setCurrent]   = useState(0);
  const [isPaused,  setIsPaused]  = useState(false);
  const [loaded,    setLoaded]    = useState({});  // track which images are loaded
  const autoRef                   = useRef(null);
  const navigate                  = useNavigate();
  const total                     = slides.length;

  // ── Preload ALL images immediately on mount ──
  useEffect(() => {
    slides.forEach((slide, i) => {
      const img = new Image();
      img.src   = slide.image;
      img.onload = () => {
        setLoaded((prev) => ({ ...prev, [i]: true }));
      };
    });
  }, []);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  // ── Auto advance ───────────────────────────
  useEffect(() => {
    if (!isPaused) {
      autoRef.current = setInterval(next, 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [next, isPaused]);

  // ── Keyboard ───────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .hero-root {
          position:   relative;
          height:     90vh;
          min-height: 560px;
          overflow:   hidden;
          background: #0a0f1e;
          font-family: 'Syne', sans-serif;
        }

        /* ── Each slide layer stacked absolutely ── */
        .hero-slide-layer {
          position:    absolute;
          inset:       0;
          transition:  opacity 0.9s ease;
          will-change: opacity;
        }

        .hero-slide-layer.is-active   { opacity: 1; z-index: 2; }
        .hero-slide-layer.is-inactive { opacity: 0; z-index: 1; }

        .hero-slide-bg {
          position:           absolute;
          inset:              0;
          background-size:    cover;
          background-position: center;
          transform:          scale(1.04);
          transition:         transform 6s ease;
        }

        .hero-slide-layer.is-active .hero-slide-bg {
          transform: scale(1);
        }

        .hero-overlay {
          position:   absolute;
          inset:      0;
          background: linear-gradient(
            105deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.38) 55%,
            rgba(0,0,0,0.18) 100%
          );
        }

        /* ── Content animations ── */
        .hero-content {
          position:      relative;
          z-index:       10;
          height:        100%;
          display:       flex;
          align-items:   center;
        }

        .hero-text-wrap {
          max-width: 680px;
        }

        .hero-subtitle-pill {
          display:       inline-flex;
          align-items:   center;
          gap:           0.5rem;
          background:    rgba(13,110,253,0.85);
          backdrop-filter: blur(8px);
          color:         white;
          font-size:     0.82rem;
          font-weight:   600;
          padding:       0.4rem 1.1rem;
          border-radius: 24px;
          margin-bottom: 1.1rem;
          letter-spacing: 0.5px;
          font-family:   'DM Sans', sans-serif;
          border:        1px solid rgba(255,255,255,0.15);
          animation:     heroFadeUp 0.7s ease both;
        }

        .hero-title {
          font-size:    clamp(2rem, 5vw, 3.6rem);
          font-weight:  900;
          color:        white;
          line-height:  1.1;
          margin-bottom: 2rem;
          letter-spacing: -1px;
          text-shadow:  0 4px 24px rgba(0,0,0,0.3);
          animation:    heroFadeUp 0.7s ease 0.1s both;
        }

        .hero-cta-btn {
          display:       inline-flex;
          align-items:   center;
          gap:           0.6rem;
          background:    linear-gradient(135deg, #0d6efd, #084298);
          border:        none;
          border-radius: 14px;
          color:         white;
          font-weight:   700;
          font-size:     1.05rem;
          padding:       0.85rem 2.2rem;
          cursor:        pointer;
          box-shadow:    0 8px 28px rgba(13,110,253,0.45);
          transition:    all 0.28s cubic-bezier(0.34,1.56,0.64,1);
          font-family:   'Syne', sans-serif;
          letter-spacing: 0.2px;
          animation:     heroFadeUp 0.7s ease 0.2s both;
        }

        .hero-cta-btn:hover {
          transform:  translateY(-3px) scale(1.03);
          box-shadow: 0 14px 36px rgba(13,110,253,0.55);
        }

        .hero-arrow-btn {
          position:        absolute;
          top:             50%;
          transform:       translateY(-50%);
          z-index:         10;
          width:           52px;
          height:          52px;
          border-radius:   50%;
          border:          2px solid rgba(255,255,255,0.35);
          background:      rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          color:           white;
          display:         flex;
          align-items:     center;
          justify-content: center;
          cursor:          pointer;
          transition:      all 0.25s ease;
        }

        .hero-arrow-btn:hover {
          background:   rgba(255,255,255,0.28);
          border-color: white;
          transform:    translateY(-50%) scale(1.1);
        }

        .hero-dot-btn {
          border:        none;
          cursor:        pointer;
          border-radius: 4px;
          height:        4px;
          background:    rgba(255,255,255,0.35);
          transition:    all 0.35s ease;
          padding:       0;
        }
        .hero-dot-btn.active {
          background: white;
          width:      32px !important;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        @keyframes heroProgressBar {
          from { width: 0%;   }
          to   { width: 100%; }
        }
      `}</style>

      <section
        className="hero-root"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ── All slide layers rendered, opacity toggled ── */}
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide-layer ${i === current ? "is-active" : "is-inactive"}`}
          >
            <div
              className="hero-slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="hero-overlay" />
          </div>
        ))}

        {/* ── Content ── */}
        <div className="container hero-content">
          <div className="hero-text-wrap">
            <div key={`sub-${current}`} className="hero-subtitle-pill">
              {slides[current].subtitle}
            </div>
            <h1 key={`title-${current}`} className="hero-title">
              {slides[current].title}
            </h1>
            <button
              key={`cta-${current}`}
              className="hero-cta-btn"
              onClick={() => navigate("/products")}
            >
              {slides[current].cta} <FiArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Left Arrow ── */}
        <button className="hero-arrow-btn" style={{ left: "1.5rem" }} onClick={prev}>
          <FiChevronLeft size={24} />
        </button>

        {/* ── Right Arrow ── */}
        <button className="hero-arrow-btn" style={{ right: "1.5rem" }} onClick={next}>
          <FiChevronRight size={24} />
        </button>

        {/* ── Dots + Counter ── */}
        <div
          style={{
            position:       "absolute",
            bottom:         "2rem",
            left:           "50%",
            transform:      "translateX(-50%)",
            zIndex:         10,
            display:        "flex",
            alignItems:     "center",
            gap:            "0.5rem",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot-btn ${i === current ? "active" : ""}`}
              style={{ width: i === current ? 32 : 10, height: 4 }}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div
          style={{
            position:   "absolute",
            bottom:     "2rem",
            right:      "2rem",
            zIndex:     10,
            color:      "rgba(255,255,255,0.65)",
            fontSize:   "0.85rem",
            fontWeight: 700,
            fontFamily: "Syne, sans-serif",
            letterSpacing: "1px",
          }}
        >
          {String(current + 1).padStart(2, "0")} <span style={{ opacity: 0.4 }}>/ {String(total).padStart(2, "0")}</span>
        </div>

        {/* ── Progress bar ── */}
        <div
          style={{
            position:   "absolute",
            bottom:     0, left: 0, right: 0,
            height:     3,
            background: "rgba(255,255,255,0.12)",
            zIndex:     10,
          }}
        >
          <div
            key={`pb-${current}-${isPaused}`}
            style={{
              height:    "100%",
              background: "linear-gradient(90deg, #0d6efd, #60a5fa)",
              animation:  isPaused ? "none" : "heroProgressBar 4s linear forwards",
            }}
          />
        </div>
      </section>
    </>
  );
};

export default HeroBanner;