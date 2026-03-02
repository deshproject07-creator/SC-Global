import { useEffect, useRef, useState } from "react";
import {
  FiAward, FiGlobe, FiShield, FiTruck, FiUsers, FiCheckCircle
} from "react-icons/fi";
import "../../styles/custom.css";

const usps = [
  {
    icon: <FiAward size={28} />,
    title: "10+ Years of Experience",
    description:
      "Over a decade of expertise in global trade, ensuring seamless export and import operations for our clients worldwide.",
  },
  {
    icon: <FiShield size={28} />,
    title: "100% Quality Assured",
    description:
      "Every product goes through rigorous quality checks before dispatch, guaranteeing only the best reaches our clients.",
  },
  {
    icon: <FiGlobe size={28} />,
    title: "Global Network",
    description:
      "Strong trade relationships across 50+ countries, enabling us to source and deliver products efficiently anywhere.",
  },
  {
    icon: <FiTruck size={28} />,
    title: "On-Time Delivery",
    description:
      "We understand the value of time in global trade. Our logistics network ensures timely delivery every single time.",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Trusted by 50+ Clients",
    description:
      "A growing list of satisfied international buyers who rely on SC Global for consistent quality and reliability.",
  },
  {
    icon: <FiCheckCircle size={28} />,
    title: "Competitive Pricing",
    description:
      "We offer market-best pricing without compromising on quality, giving our clients maximum value for their investment.",
  },
];

const WhyChooseUs = () => {
  const [visible, setVisible] = useState([]);
  const cardRefs              = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [...new Set([...prev, i])]);
            observer.unobserve(ref);
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach((obs) => obs && obs.disconnect());
  }, []);

  return (
    <section
      id="why-us"
      style={{
        padding: "5rem 0",
        background: "white",
      }}
    >
      <div className="container">

        {/* ── Section Header ── */}
        <div className="text-center mb-5">
          <span
            className="badge rounded-pill mb-3 px-3 py-2"
            style={{
              background: "#e8f0fe",
              color: "#0d6efd",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            Our Strengths
          </span>
          <h2 className="section-title text-center">Why Choose Us</h2>
          <p
            className="text-muted mt-3"
            style={{ maxWidth: 500, margin: "0.75rem auto 0" }}
          >
            We combine global expertise with local understanding to deliver
            exceptional trade solutions for our international partners.
          </p>
        </div>

        {/* ── USP Cards Grid ── */}
        <div className="row g-4">
          {usps.map((usp, i) => (
            <div
              key={i}
              className="col-12 col-sm-6 col-lg-4"
              ref={(el) => (cardRefs.current[i] = el)}
            >
              <div
                className="usp-card h-100"
                style={{
                  opacity: visible.includes(i) ? 1 : 0,
                  transform: visible.includes(i)
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition: `all 0.55s ease ${i * 0.08}s`,
                }}
              >
                {/* Icon */}
                <div className="usp-icon">{usp.icon}</div>

                {/* Title */}
                <h6 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
                  {usp.title}
                </h6>

                {/* Description */}
                <p
                  className="mb-0 small"
                  style={{ lineHeight: 1.7, opacity: 0.85 }}
                >
                  {usp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Banner ── */}
        <div
          className="mt-5 text-center p-4 p-md-5 rounded-4"
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)",
            opacity: visible.length === usps.length ? 1 : 0,
            transform: visible.length === usps.length
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s ease 0.5s",
          }}
        >
          <h4 className="text-white fw-bold mb-2">
            Ready to Start Trading with Us?
          </h4>
          <p
            className="mb-4"
            style={{ color: "rgba(255,255,255,0.8)", maxWidth: 480, margin: "0 auto 1.5rem" }}
          >
            Join our growing network of satisfied international buyers.
            Get in touch and let's discuss your requirements.
          </p>
          <button
            className="btn btn-light px-5 py-2 fw-600"
            style={{ borderRadius: 10, color: "#0d6efd" }}
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get a Free Quote
          </button>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;