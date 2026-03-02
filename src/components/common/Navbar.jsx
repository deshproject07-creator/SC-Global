import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCategories } from "../../firebase/firestore";
import { FiMenu, FiX, FiChevronDown, FiGlobe } from "react-icons/fi";
import logo from "../../assets/images/company_images/SC-Global.jpeg";
import "../../styles/custom.css";

const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [categories, setCategories]     = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef(null);
  const navigate                        = useNavigate();

  // ── Scroll Effect ──────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Fetch Categories for Dropdown ──────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        console.error("Failed to load categories");
      }
    };
    fetch();
  }, []);

  // ── Close dropdown on outside click ────────
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── Lock body scroll when sidebar open ─────
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = [
    { label: "Home",       to: "/"         },
    { label: "About",      to: "/about"    },
    { label: "Gallery",    to: "/gallery"  },
    { label: "Blog",       to: "/blog"     },
    { label: "Contact Us", to: "/contact"  },
  ];

  return (
    <>
      {/* ══════════════════════════════════════
          MAIN NAVBAR
      ══════════════════════════════════════ */}
      <nav
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          right:        0,
          zIndex:       1000,
          background:   scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          boxShadow:    scrolled ? "0 2px 20px rgba(0,0,0,0.10)" : "0 1px 8px rgba(0,0,0,0.06)",
          transition:   "all 0.3s ease",
          padding:      "0",
        }}
      >
        <div
          className="container"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            height:         scrolled ? 64 : 72,
            transition:     "height 0.3s ease",
          }}
        >
          {/* ── Brand / Logo ── */}
          <Link
            to="/"
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "0.65rem",
              textDecoration: "none",
              flexShrink:     0,
            }}
          >
            <img
              src={logo}
              alt="SC Global Logo"
              style={{
                width:        scrolled ? 42 : 48,
                height:       scrolled ? 42 : 48,
                borderRadius: "10px",
                objectFit:    "cover",
                transition:   "all 0.3s ease",
                border:       "2px solid #e8f0fe",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight:  800,
                  fontSize:    scrolled ? "0.95rem" : "1rem",
                  color:       "#0d6efd",
                  lineHeight:  1.1,
                  transition:  "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
              >
                SC Global
              </div>
              <div
                style={{
                  fontSize:      "0.6rem",
                  color:         "#6c757d",
                  letterSpacing: "1px",
                  fontWeight:    600,
                  textTransform: "uppercase",
                }}
              >
                Exports & Imports
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div
            className="d-none d-lg-flex"
            style={{ alignItems: "center", gap: "0.25rem" }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  padding:        "0.5rem 0.85rem",
                  borderRadius:   "8px",
                  fontWeight:     500,
                  fontSize:       "0.9rem",
                  color:          isActive ? "#0d6efd" : "#3a3a5c",
                  background:     isActive ? "#e8f0fe" : "transparent",
                  textDecoration: "none",
                  transition:     "all 0.2s ease",
                  whiteSpace:     "nowrap",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.color      = "#0d6efd";
                    e.currentTarget.style.background = "#f0f5ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.color      = "#3a3a5c";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}

            {/* ── Products Dropdown ── */}
            <div
              ref={dropdownRef}
              style={{ position: "relative" }}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "0.3rem",
                  padding:      "0.5rem 0.85rem",
                  borderRadius: "8px",
                  fontWeight:   500,
                  fontSize:     "0.9rem",
                  color:        dropdownOpen ? "#0d6efd" : "#3a3a5c",
                  background:   dropdownOpen ? "#e8f0fe" : "transparent",
                  border:       "none",
                  cursor:       "pointer",
                  transition:   "all 0.2s ease",
                  whiteSpace:   "nowrap",
                }}
              >
                Products
                <FiChevronDown
                  size={15}
                  style={{
                    transform:  dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position:     "absolute",
                    top:          "calc(100% + 8px)",
                    left:         "50%",
                    transform:    "translateX(-50%)",
                    background:   "white",
                    borderRadius: "12px",
                    boxShadow:    "0 8px 32px rgba(0,0,0,0.12)",
                    border:       "1px solid #e9ecef",
                    minWidth:     220,
                    zIndex:       999,
                    overflow:     "hidden",
                    animation:    "fadeIn 0.2s ease",
                  }}
                >
                  {/* All Products */}
                  <Link
                    to="/products"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      gap:            "0.5rem",
                      padding:        "0.75rem 1rem",
                      color:          "#0d6efd",
                      fontWeight:     600,
                      fontSize:       "0.85rem",
                      textDecoration: "none",
                      borderBottom:   "1px solid #f1f3f5",
                      background:     "#f8faff",
                    }}
                  >
                    <FiGlobe size={14} />
                    All Products
                  </Link>

                  {/* Category Links */}
                  {categories.length === 0 ? (
                    <div
                      style={{
                        padding:  "0.75rem 1rem",
                        color:    "#adb5bd",
                        fontSize: "0.82rem",
                      }}
                    >
                      No categories yet
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products/${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display:        "flex",
                          alignItems:     "center",
                          padding:        "0.65rem 1rem",
                          color:          "#3a3a5c",
                          fontSize:       "0.85rem",
                          textDecoration: "none",
                          borderBottom:   "1px solid #f8f9fa",
                          transition:     "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f0f5ff";
                          e.currentTarget.style.color      = "#0d6efd";
                          e.currentTarget.style.paddingLeft = "1.25rem";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background  = "transparent";
                          e.currentTarget.style.color       = "#3a3a5c";
                          e.currentTarget.style.paddingLeft = "1rem";
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="d-lg-none"
            onClick={() => setSidebarOpen(true)}
            style={{
              background:   "transparent",
              border:       "none",
              color:        "#0d6efd",
              cursor:       "pointer",
              padding:      "0.4rem",
              borderRadius: "8px",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
            }}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE SIDEBAR BACKDROP
      ══════════════════════════════════════ */}
      <div
        onClick={closeSidebar}
        style={{
          position:      "fixed",
          inset:         0,
          background:    "rgba(0,0,0,0.45)",
          zIndex:        1100,
          opacity:       sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "all" : "none",
          transition:    "opacity 0.3s ease",
        }}
      />

      {/* ══════════════════════════════════════
          MOBILE SIDEBAR
      ══════════════════════════════════════ */}
      <div
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          width:      280,
          height:     "100vh",
          background: "white",
          zIndex:     1200,
          boxShadow:  "4px 0 24px rgba(0,0,0,0.12)",
          transform:  sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          display:    "flex",
          flexDirection: "column",
          overflowY:  "auto",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            justifyContent: "space-between",
            padding:      "1.25rem 1rem",
            borderBottom: "1px solid #f1f3f5",
            background:   "linear-gradient(135deg, #0d6efd, #084298)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <img
              src={logo}
              alt="SC Global"
              style={{
                width:        40,
                height:       40,
                borderRadius: "8px",
                objectFit:    "cover",
                border:       "2px solid rgba(255,255,255,0.3)",
              }}
            />
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                SC Global
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.6rem", letterSpacing: "1px" }}>
                EXPORTS & IMPORTS
              </div>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            style={{
              background:   "rgba(255,255,255,0.15)",
              border:       "none",
              borderRadius: "50%",
              width:        34,
              height:       34,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              color:        "white",
              cursor:       "pointer",
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav style={{ padding: "1rem 0", flex: 1 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              style={({ isActive }) => ({
                display:        "flex",
                alignItems:     "center",
                padding:        "0.75rem 1.25rem",
                color:          isActive ? "#0d6efd" : "#3a3a5c",
                background:     isActive ? "#e8f0fe" : "transparent",
                fontWeight:     isActive ? 600 : 500,
                fontSize:       "0.95rem",
                textDecoration: "none",
                borderLeft:     isActive ? "3px solid #0d6efd" : "3px solid transparent",
                transition:     "all 0.2s ease",
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Products Section in Sidebar */}
          <div style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                padding:       "0.75rem 1.25rem 0.4rem",
                fontSize:      "0.7rem",
                fontWeight:    700,
                color:         "#adb5bd",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Products
            </div>

            {/* All Products */}
            <NavLink
              to="/products"
              onClick={closeSidebar}
              style={({ isActive }) => ({
                display:        "flex",
                alignItems:     "center",
                padding:        "0.65rem 1.25rem 0.65rem 1.5rem",
                color:          isActive ? "#0d6efd" : "#0d6efd",
                fontWeight:     600,
                fontSize:       "0.88rem",
                textDecoration: "none",
                background:     isActive ? "#e8f0fe" : "transparent",
              })}
            >
              All Products
            </NavLink>

            {/* Category Links */}
            {categories.map((cat) => (
              <NavLink
                key={cat.id}
                to={`/products/${cat.slug}`}
                onClick={closeSidebar}
                style={({ isActive }) => ({
                  display:        "block",
                  padding:        "0.6rem 1.25rem 0.6rem 1.75rem",
                  color:          isActive ? "#0d6efd" : "#6c757d",
                  background:     isActive ? "#e8f0fe" : "transparent",
                  fontWeight:     isActive ? 600 : 400,
                  fontSize:       "0.85rem",
                  textDecoration: "none",
                  borderLeft:     isActive ? "3px solid #0d6efd" : "3px solid transparent",
                  transition:     "all 0.15s ease",
                })}
              >
                {cat.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding:     "1rem 1.25rem",
            borderTop:   "1px solid #f1f3f5",
            fontSize:    "0.75rem",
            color:       "#adb5bd",
            textAlign:   "center",
          }}
        >
          © {new Date().getFullYear()} SC Global Exports & Imports
        </div>
      </div>

      {/* Navbar spacer */}
      <div style={{ height: 72 }} />
    </>
  );
};

export default Navbar;