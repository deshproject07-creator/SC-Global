import { useEffect } from "react";
import { FiX, FiTag } from "react-icons/fi";
import "../../styles/custom.css";

const ProductModal = ({ product, onClose }) => {

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div
      className="modal show d-block animate-fade-in"
      style={{ background: "rgba(0,0,0,0.55)", zIndex: 1060 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: 540 }}
      >
        <div
          className="modal-content border-0"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            animation: "slideInUp 0.35s ease",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative" }}>
            <img
              src={product.imageUrl || "https://placehold.co/540x280?text=Product"}
              alt={product.name}
              className="modal-product-img"
              style={{ width: "100%", height: 280, objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://placehold.co/540x280?text=Product";
              }}
            />
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 12, right: 12,
                background: "rgba(0,0,0,0.45)",
                border: "none", borderRadius: "50%",
                width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
            >
              <FiX size={16} />
            </button>

            {/* Category Badge */}
            {product.categoryName && (
              <div
                style={{
                  position: "absolute", bottom: 12, left: 12,
                  background: "rgba(13,110,253,0.9)",
                  color: "white", fontSize: "0.75rem",
                  fontWeight: 600, padding: "4px 12px",
                  borderRadius: 20,
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <FiTag size={11} /> {product.categoryName}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-4">
            <h5 className="fw-bold mb-2">{product.name}</h5>
            <p className="text-muted" style={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
              {product.description || "No description available for this product."}
            </p>

            {/* CTA */}
            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-primary flex-fill py-2"
                onClick={scrollToContact}
              >
                Enquire About This Product
              </button>
              <button
                className="btn btn-light px-3"
                onClick={onClose}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;