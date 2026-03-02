import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import "../../styles/custom.css";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      className={`scroll-top-btn ${visible ? "visible" : ""}`}
      onClick={scrollTop}
      title="Back to top"
    >
      <FiArrowUp size={18} />
    </button>
  );
};

export default ScrollToTop;