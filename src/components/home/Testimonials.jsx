import { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import "../../styles/custom.css";

const testimonials = [
  {
  name: "Michael Thompson",
  company: "Thompson Global Foods Inc.",
  country: "🇺🇸 USA",
  rating: 5,
  text: "SC Global delivers exactly what they promise. Our shipments arrived on schedule and the packaging quality was excellent. Their professionalism makes them a reliable supplier for international buyers."
  },
  {
  name: "Rahul Mehta",
  company: "Mehta Agro Traders",
  country: "🇮🇳 India",
  rating: 5,
  text: "We have sourced multiple consignments through SC Global and the experience has been excellent. Their commitment to quality and timely dispatch makes them a trustworthy export partner."
  },
  {
  name: "Sergey Ivanov",
  company: "Volga Import Group",
  country: "🇷🇺 Russia",
  rating: 5,
  text: "SC Global has proven to be a dependable export partner. Their attention to packaging standards and documentation helped us receive shipments without delays. Highly professional team."
  },
  {
  name: "Khalid Al-Mansoori",
  company: "Al Mansoori General Trading LLC",
  country: "🇦🇪 UAE",
  rating: 5,
  text: "Working with SC Global Import Export has been a great experience. Their team maintains excellent communication and the product quality consistently meets our import standards. We look forward to continuing this partnership."
  },
  {
  name: "Priya Sharma",
  company: "Sharma International Foods",
  country: "🇮🇳 India",
  rating: 5,
  text: "SC Global Import Export maintains very high standards in product quality and logistics support. Their team is cooperative and responsive, which makes long-term business relationships easy."
  },
  {
    name: "Lena Müller",
    company: "EuroTrade GmbH",
    country: "🇩🇪 Germany",
    rating: 5,
    text: "SC Global's attention to quality and documentation compliance makes them stand out. Working with them is effortless — they truly know global trade inside out.",
  },
];

const StarRating = ({ rating }) => (
  <div className="d-flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={14}
        fill={i < rating ? "#ffc107" : "none"}
        stroke={i < rating ? "#ffc107" : "#dee2e6"}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("right");
  const autoRef                   = useRef(null);

  const total = testimonials.length;

  const goTo = (index, dir = "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((current - 1 + total) % total, "left");
  const next = () => goTo((current + 1) % total, "right");

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => next(), 5000);
    return () => clearInterval(autoRef.current);
  }, [current]);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => next(), 5000);
  };

  return (
    <section
      id="testimonials"
      style={{
        padding: "5rem 0",
        background: "linear-gradient(135deg, #f8faff 0%, #eef3ff 100%)",
      }}
    >
      <div className="container">

        {/* ── Section Header ── */}
        <div className="text-center mb-5">
          
          <h2 className="section-title text-center">What Our Clients Say</h2>
          <p
            className="text-muted mt-3"
            style={{ maxWidth: 460, margin: "0.75rem auto 0" }}
          >
            Trusted by importers and traders across the globe — here's
            what they say about working with SC Global.
          </p>
        </div>

        {/* ── Testimonial Slider ── */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-7">

            {/* Card */}
            <div
              className="testimonial-card"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? `translateX(${direction === "right" ? "30px" : "-30px"})`
                  : "translateX(0)",
                transition: "all 0.3s ease",
              }}
            >
              <StarRating rating={testimonials[current].rating} />

              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "#3a3a5c",
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                {testimonials[current].text}
              </p>

              <div className="d-flex align-items-center gap-3">
                {/* Avatar */}
                <div
                  style={{
                    width: 48, height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0d6efd, #084298)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: "1.1rem",
                    flexShrink: 0,
                  }}
                >
                  {testimonials[current].name.charAt(0)}
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: "0.95rem", color: "#1a1a2e" }}>
                    {testimonials[current].name}
                  </div>
                  <div className="text-muted small">
                    {testimonials[current].company} · {testimonials[current].country}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="d-flex align-items-center justify-content-between mt-4">

              {/* Dots */}
              <div className="d-flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { goTo(i, i > current ? "right" : "left"); resetAuto(); }}
                    style={{
                      width: i === current ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      border: "none",
                      background: i === current ? "#0d6efd" : "#dee2e6",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="d-flex gap-2">
                <button
                  onClick={() => { prev(); resetAuto(); }}
                  style={{
                    width: 40, height: 40,
                    borderRadius: "50%",
                    border: "2px solid #dee2e6",
                    background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#0d6efd",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0d6efd";
                    e.currentTarget.style.background = "#e8f0fe";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#dee2e6";
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={() => { next(); resetAuto(); }}
                  style={{
                    width: 40, height: 40,
                    borderRadius: "50%",
                    border: "none",
                    background: "#0d6efd",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "white",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#084298"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#0d6efd"}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;