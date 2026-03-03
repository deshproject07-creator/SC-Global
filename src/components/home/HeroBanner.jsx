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
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const autoRef = useRef(null);
  const navigate = useNavigate();
  const total = slides.length;

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  // Auto advance
  useEffect(() => {
    if (!isPaused) {
      autoRef.current = setInterval(next, 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [next, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
    
    setIsPaused(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .hero-root {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #0a0f1e;
          font-family: 'Playfair Display', 'DM Sans', 'Syne', sans-serif;
        }

        /* Desktop height - exactly as before */
        .hero-root {
          height: 90vh;
          min-height: 560px;
        }

        /* Mobile - scale proportionally based on viewport width */
        @media (max-width: 768px) {
          .hero-root {
            height: 0;
            padding-bottom: 56.25%; /* 16:9 aspect ratio like desktop */
            min-height: unset;
            max-height: unset;
          }
        }

        /* Slide layers */
        .hero-slide-layer {
          position: absolute;
          inset: 0;
          transition: opacity 0.9s ease;
          will-change: opacity;
        }

        .hero-slide-layer.is-active { 
          opacity: 1; 
          z-index: 2; 
        }
        
        .hero-slide-layer.is-inactive { 
          opacity: 0; 
          z-index: 1; 
        }

        /* Image container - consistent for all devices */
        .hero-image-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Image styling - consistent for all devices */
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.04);
          transition: transform 6s ease;
        }

        .hero-slide-layer.is-active .hero-image {
          transform: scale(1);
        }

        /* Overlay - consistent gradient for all devices */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.38) 55%,
            rgba(0,0,0,0.18) 100%
          );
        }

        /* Content container - positioned exactly the same */
        .hero-content {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 4rem;
        }

        /* Mobile content - scale padding proportionally */
        @media (max-width: 768px) {
          .hero-content {
            padding: 0 min(4rem, 8vw);
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding: 0 min(3rem, 6vw);
          }
        }

        /* Text wrapper - consistent positioning */
        .hero-text-wrap {
          max-width: 680px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .hero-text-wrap {
            max-width: min(680px, 80%);
          }
        }

        /* Subtitle pill - scaled proportionally */
        .hero-subtitle-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(13,110,253,0.85);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.4rem 1.1rem;
          border-radius: 24px;
          margin-bottom: 1.1rem;
          letter-spacing: 0.5px;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid rgba(255,255,255,0.15);
          animation: heroFadeUp 0.7s ease both;
        }

        /* Mobile subtitle - scale font size based on viewport width */
        @media (max-width: 768px) {
          .hero-subtitle-pill {
            font-size: clamp(0.65rem, 1.8vw, 0.82rem);
            padding: clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.8rem, 2vw, 1.1rem);
            margin-bottom: clamp(0.7rem, 2vw, 1.1rem);
            border-radius: min(24px, 3vw);
          }
        }

        /* Title - scaled proportionally */
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.6rem);
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 24px rgba(0,0,0,0.3);
          animation: heroFadeUp 0.7s ease 0.1s both;
        }

        /* Mobile title - scale with viewport */
        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(1.4rem, 4vw, 2rem);
            margin-bottom: clamp(1.2rem, 3vw, 2rem);
            letter-spacing: -0.01em;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: clamp(1.2rem, 3.8vw, 1.4rem);
            margin-bottom: clamp(1rem, 2.5vw, 1.2rem);
          }
        }

        /* CTA Button - scaled proportionally */
        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #0d6efd, #084298);
          border: none;
          border-radius: 14px;
          color: white;
          font-weight: 700;
          font-size: 1.05rem;
          padding: 0.85rem 2.2rem;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(13,110,253,0.45);
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.2px;
          animation: heroFadeUp 0.7s ease 0.2s both;
          white-space: nowrap;
        }

        .hero-cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 36px rgba(13,110,253,0.55);
        }

        /* Mobile button - scale proportionally */
        @media (max-width: 768px) {
          .hero-cta-btn {
            font-size: clamp(0.75rem, 2.2vw, 1.05rem);
            padding: clamp(0.5rem, 1.5vw, 0.85rem) clamp(1.2rem, 4vw, 2.2rem);
            border-radius: min(14px, 2vw);
            gap: clamp(0.3rem, 1vw, 0.6rem);
          }
        }

        @media (max-width: 480px) {
          .hero-cta-btn {
            font-size: clamp(0.7rem, 2vw, 0.75rem);
            padding: clamp(0.4rem, 1.2vw, 0.5rem) clamp(1rem, 3vw, 1.2rem);
          }
        }

        /* Navigation Arrows - hidden on mobile */
        .hero-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .hero-arrow-btn:hover {
          background: rgba(255,255,255,0.28);
          border-color: white;
          transform: translateY(-50%) scale(1.1);
        }

        @media (max-width: 768px) {
          .hero-arrow-btn {
            display: none;
          }
        }

        /* Dots indicator - scaled proportionally */
        .hero-dots-container {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .hero-dots-container {
            bottom: min(2rem, 4vw);
            gap: min(0.5rem, 1.5vw);
          }
        }

        .hero-dot-btn {
          border: none;
          cursor: pointer;
          border-radius: 4px;
          height: 4px;
          background: rgba(255,255,255,0.35);
          transition: all 0.35s ease;
          padding: 0;
        }

        .hero-dot-btn.active {
          background: white;
          width: 32px !important;
        }

        @media (max-width: 768px) {
          .hero-dot-btn {
            height: min(4px, 0.8vw);
          }
          .hero-dot-btn.active {
            width: min(32px, 6vw) !important;
          }
          .hero-dot-btn:not(.active) {
            width: min(10px, 2vw) !important;
          }
        }

        /* Slide counter - scaled proportionally */
        .hero-counter {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          z-index: 10;
          color: rgba(255,255,255,0.65);
          font-size: 0.85rem;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .hero-counter {
            bottom: min(2rem, 4vw);
            right: min(2rem, 4vw);
            font-size: clamp(0.6rem, 1.8vw, 0.85rem);
          }
        }

        /* Progress bar - scaled proportionally */
        .hero-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.12);
          z-index: 10;
        }

        .hero-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0d6efd, #60a5fa);
          animation: heroProgressBar 4s linear forwards;
        }

        @media (max-width: 768px) {
          .hero-progress-bar {
            height: min(3px, 0.6vw);
          }
        }

        @keyframes heroFadeUp {
          from { 
            opacity: 0; 
            transform: translateY(28px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes heroProgressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <section
        className="hero-root"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide-layer ${i === current ? "is-active" : "is-inactive"}`}
          >
            {/* Image - same for all devices */}
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-image"
              loading={i === 0 ? "eager" : "lazy"}
            />
            
            <div className="hero-overlay" />
          </div>
        ))}

        {/* Content - exactly the same structure for all devices */}
        <div className="hero-content">
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

        {/* Navigation Arrows */}
        <button 
          className="hero-arrow-btn" 
          style={{ left: "1.5rem" }} 
          onClick={prev}
          aria-label="Previous slide"
        >
          <FiChevronLeft size={24} />
        </button>

        <button 
          className="hero-arrow-btn" 
          style={{ right: "1.5rem" }} 
          onClick={next}
          aria-label="Next slide"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="hero-dots-container">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot-btn ${i === current ? "active" : ""}`}
              style={{ width: i === current ? 32 : 10 }}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="hero-counter">
          {String(current + 1).padStart(2, "0")} 
          <span style={{ opacity: 0.4 }}> / {String(total).padStart(2, "0")}</span>
        </div>

        {/* Progress Bar */}
        <div className="hero-progress-bar">
          {!isPaused && (
            <div
              key={`pb-${current}`}
              className="hero-progress-fill"
            />
          )}
        </div>
      </section>
    </>
  );
};

export default HeroBanner;