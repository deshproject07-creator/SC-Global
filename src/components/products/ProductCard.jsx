import { useState } from "react";
import ProductModal from "./ProductModal";
import "../../styles/custom.css";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="product-card"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        {/* Image */}
        <div style={{ overflow: "hidden" }}>
          <img
            src={product.imageUrl || "https://placehold.co/400x220?text=Product"}
            alt={product.name}
            style={{ width: "100%", height: 200, objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://placehold.co/400x220?text=Product";
            }}
          />
        </div>

        {/* Body */}
        <div className="card-body">
          <h6 className="fw-bold mb-1">{product.name}</h6>
          <p
            className="text-muted small mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description || "Click to view more details."}
          </p>
          <span
            style={{
              fontSize: "0.8rem",
              color: "#0d6efd",
              fontWeight: 600,
            }}
          >
            View Details →
          </span>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;