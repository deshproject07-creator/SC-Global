import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate }  from "react-router-dom";
import { getCategories }               from "../../firebase/firestore";
import { FiMenu, FiX, FiChevronDown, FiGlobe, FiArrowUpRight } from "react-icons/fi";
import logo from "../../assets/images/company_images/SC-Global.jpeg";

const Navbar = () => {
  const [scrolled,     setScrolled]     = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [categories,   setCategories]   = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                     = useRef(null);
  const navigate                        = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [sidebarOpen]);

  const navLinks = [
    { label: "Home",    to: "/"        },
    { label: "About",   to: "/about"   },
    { label: "Gallery", to: "/gallery" },
    { label: "Blog",    to: "/blog"    },
    { label: "Contact", to: "/#contact"},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        .navbar-root {
          font-family: 'Playfair Display', serif;
        }

        .nav-link-item {
          position:        relative;
          padding:         0.6rem 1.1rem;
          border-radius:   10px;
          font-weight:     600;
          font-size:       1.05rem;
          text-decoration: none;
          transition:      all 0.25s ease;
          letter-spacing:  0.5px;
          white-space:     nowrap;
          font-family:     'Playfair Display', serif;
        }

        .nav-link-item::after {
          content:       '';
          position:      absolute;
          bottom:        6px;
          left:          50%;
          transform:     translateX(-50%) scaleX(0);
          width:         20px;
          height:        2.5px;
          background:    white;
          border-radius: 2px;
          transition:    transform 0.25s ease;
        }

        .nav-link-item.scrolled-link::after {
          background: #0d6efd;
        }

        .nav-link-item:hover::after,
        .nav-link-item.active-link::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-link-item.scrolled-link {
          color: #1a1a2e !important;
        }

        .nav-link-item.scrolled-link:hover,
        .nav-link-item.scrolled-link.active-link {
          color:      #0d6efd !important;
          background: rgba(13,110,253,0.07);
        }

        .nav-link-item.transparent-link {
          color: rgba(255,255,255,0.92) !important;
        }

        .nav-link-item.transparent-link:hover,
        .nav-link-item.transparent-link.active-link {
          color:      white !important;
          background: rgba(255,255,255,0.12);
        }

        .dropdown-item-link {
          display:         flex;
          align-items:     center;
          padding:         0.7rem 1.1rem;
          color:           #3a3a5c;
          font-size:       0.95rem;
          text-decoration: none;
          font-family:     'Playfair Display', serif;
          font-weight:     500;
          border-bottom:   1px solid #f8f9fa;
          transition:      all 0.18s ease;
          gap:             0.5rem;
        }

        .dropdown-item-link:hover {
          background:   #f0f5ff;
          color:        #0d6efd;
          padding-left: 1.4rem;
        }

        .sidebar-nav-link {
          display:         flex;
          align-items:     center;
          padding:         0.9rem 1.5rem;
          color:           #3a3a5c;
          font-family:     'Playfair Display', serif;
          font-weight:     600;
          font-size:       1.05rem;
          text-decoration: none;
          border-left:     3px solid transparent;
          transition:      all 0.2s ease;
          gap:             0.6rem;
        }

        .sidebar-nav-link:hover,
        .sidebar-nav-link.active-link {
          color:            #0d6efd;
          background:       #e8f0fe;
          border-left-color: #0d6efd;
        }
      `}</style>

      {/* ══════════════════════════════════════
          MAIN NAVBAR
      ══════════════════════════════════════ */}
      <nav
        className="navbar-root"
        style={{
          position:       "fixed",
          top:            0,
          left:           0,
          right:          0,
          zIndex:         1000,
          // ── Transparent at top, white when scrolled ──
          background:     scrolled
            ? "rgba(255,255,255,0.97)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow:      scrolled
            ? "0 4px 32px rgba(0,0,0,0.10)"
            : "none",
          transition:     "all 0.4s ease",
        }}
      >
        <div
          className="container"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            height:         scrolled ? 80 : 96,
            transition:     "height 0.35s ease",
          }}
        >
          {/* ── Brand / Logo ── */}
          <Link
            to="/"
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "0.9rem",
              textDecoration: "none",
              flexShrink:     0,
            }}
          >
            <img
              src={logo}
              alt="SC Global"
              style={{
                width:        scrolled ? 58 : 68,
                height:       scrolled ? 58 : 68,
                borderRadius: "14px",
                objectFit:    "cover",
                transition:   "all 0.35s ease",
                boxShadow:    scrolled
                  ? "0 4px 16px rgba(13,110,253,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.3)",
                border:       scrolled
                  ? "2.5px solid #e8f0fe"
                  : "2.5px solid rgba(255,255,255,0.4)",
              }}
            />
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontWeight:    900,
                  fontSize:      scrolled ? "1.25rem" : "1.45rem",
                  // ── Blue when scrolled, white when transparent ──
                  color:         scrolled ? "#0d6efd" : "white",
                  letterSpacing: "0px",
                  fontFamily:    "Playfair Display, serif",
                  transition:    "all 0.35s ease",
                  whiteSpace:    "nowrap",
                  textShadow:    scrolled ? "none" : "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                SC Global Imports & Exports
              </div>
              <div
                style={{
                  fontSize:      "0.68rem",
                  // ── Muted when scrolled, white-ish when transparent ──
                  color:         scrolled ? "#6c757d" : "rgba(255,255,255,0.75)",
                  letterSpacing: "2px",
                  fontWeight:    600,
                  textTransform: "uppercase",
                  fontFamily:    "DM Sans, sans-serif",
                  transition:    "color 0.35s ease",
                }}
              >
                International Trade Partner
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div
            className="d-none d-xl-flex"
            style={{ alignItems: "center", gap: "0.2rem" }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link-item ${scrolled ? "scrolled-link" : "transparent-link"} ${isActive ? "active-link" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* ── Products Dropdown ── */}
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`nav-link-item ${scrolled ? "scrolled-link" : "transparent-link"}`}
                style={{
                  border:      "none",
                  background:  dropdownOpen
                    ? scrolled
                      ? "rgba(13,110,253,0.08)"
                      : "rgba(255,255,255,0.15)"
                    : "transparent",
                  display:     "flex",
                  alignItems:  "center",
                  gap:         "0.3rem",
                  cursor:      "pointer",
                  fontFamily:  "Playfair Display, serif",
                }}
              >
                Products
                <FiChevronDown
                  size={16}
                  style={{
                    transform:  dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.25s ease",
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position:     "absolute",
                    top:          "calc(100% + 10px)",
                    left:         "50%",
                    transform:    "translateX(-50%)",
                    background:   "white",
                    borderRadius: "16px",
                    boxShadow:    "0 16px 48px rgba(0,0,0,0.13)",
                    border:       "1px solid #e9ecef",
                    minWidth:     230,
                    overflow:     "hidden",
                    animation:    "fadeIn 0.18s ease",
                    zIndex:       999,
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
                      padding:        "0.85rem 1.1rem",
                      color:          "#0d6efd",
                      fontWeight:     700,
                      fontSize:       "0.92rem",
                      textDecoration: "none",
                      borderBottom:   "1px solid #f1f3f5",
                      background:     "#f8faff",
                      fontFamily:     "Playfair Display, serif",
                    }}
                  >
                    <FiGlobe size={15} /> All Products
                  </Link>

                  {/* Category Links */}
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products/${cat.slug}`}
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item-link"
                    >
                      <FiArrowUpRight size={13} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── Get a Quote CTA ── */}
            <button
              onClick={() => navigate("/#contact")}
              style={{
                marginLeft:    "0.5rem",
                background:    scrolled
                  ? "linear-gradient(135deg, #0d6efd, #084298)"
                  : "rgba(255,255,255,0.15)",
                border:        scrolled
                  ? "none"
                  : "2px solid rgba(255,255,255,0.6)",
                backdropFilter: scrolled ? "none" : "blur(8px)",
                borderRadius:  "12px",
                color:         "white",
                fontWeight:    700,
                fontSize:      "1rem",
                padding:       "0.65rem 1.6rem",
                cursor:        "pointer",
                fontFamily:    "Playfair Display, serif",
                boxShadow:     scrolled
                  ? "0 4px 16px rgba(13,110,253,0.35)"
                  : "0 4px 16px rgba(0,0,0,0.2)",
                transition:    "all 0.3s ease",
                letterSpacing: "0.2px",
                whiteSpace:    "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform  = "translateY(-2px)";
                e.currentTarget.style.boxShadow  = scrolled
                  ? "0 8px 24px rgba(13,110,253,0.45)"
                  : "0 8px 24px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = scrolled
                  ? "0 4px 16px rgba(13,110,253,0.35)"
                  : "0 4px 16px rgba(0,0,0,0.2)";
              }}
            >
              Get a Quote
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="d-xl-none"
            onClick={() => setSidebarOpen(true)}
            style={{
              background:   scrolled
                ? "rgba(13,110,253,0.08)"
                : "rgba(255,255,255,0.15)",
              border:       scrolled
                ? "none"
                : "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: "12px",
              padding:      "0.6rem",
              cursor:       "pointer",
              // ── Blue when scrolled, white when transparent ──
              color:        scrolled ? "#0d6efd" : "white",
              display:      "flex",
              transition:   "all 0.3s ease",
            }}
          >
            <FiMenu size={28} />
          </button>
        </div>
      </nav>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position:       "fixed",
          inset:          0,
          background:     "rgba(0,0,0,0.5)",
          zIndex:         1100,
          opacity:        sidebarOpen ? 1 : 0,
          pointerEvents:  sidebarOpen ? "all" : "none",
          transition:     "opacity 0.3s ease",
          backdropFilter: sidebarOpen ? "blur(4px)" : "none",
        }}
      />

      {/* ══════════════════════════════════════
          MOBILE SIDEBAR
      ══════════════════════════════════════ */}
      <div
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         300,
          height:        "100vh",
          background:    "white",
          zIndex:        1200,
          transform:     sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition:    "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          display:       "flex",
          flexDirection: "column",
          overflowY:     "auto",
          boxShadow:     "8px 0 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "1.5rem 1.25rem",
            background:     "linear-gradient(135deg, #0d6efd, #084298)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img
              src={logo}
              alt="SC Global"
              style={{
                width:        48,
                height:       48,
                borderRadius: "12px",
                objectFit:    "cover",
                border:       "2px solid rgba(255,255,255,0.3)",
              }}
            />
            <div>
              <div
                style={{
                  color:      "white",
                  fontWeight: 800,
                  fontSize:   "1.05rem",
                  fontFamily: "Playfair Display, serif",
                  lineHeight: 1.1,
                }}
              >
                SC Global
              </div>
              <div
                style={{
                  color:         "rgba(255,255,255,0.7)",
                  fontSize:      "0.62rem",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  fontFamily:    "DM Sans, sans-serif",
                }}
              >
                Imports & Exports
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background:     "rgba(255,255,255,0.18)",
              border:         "none",
              borderRadius:   "50%",
              width:          38,
              height:         38,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav style={{ padding: "1rem 0", flex: 1 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-nav-link${isActive ? " active-link" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Products Section Label */}
          <div
            style={{
              padding:       "0.75rem 1.5rem 0.3rem",
              fontSize:      "0.65rem",
              fontWeight:    700,
              color:         "#adb5bd",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily:    "DM Sans, sans-serif",
              marginTop:     "0.5rem",
            }}
          >
            Products
          </div>

          {/* All Products */}
          <NavLink
            to="/products"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-link${isActive ? " active-link" : ""}`
            }
            style={{
              color:       "#0d6efd",
              fontWeight:  700,
              paddingLeft: "1.75rem",
            }}
          >
            All Products
          </NavLink>

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/products/${cat.slug}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-nav-link${isActive ? " active-link" : ""}`
              }
              style={{
                paddingLeft: "2rem",
                fontSize:    "0.95rem",
                fontWeight:  500,
              }}
            >
              {cat.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding:    "1rem 1.25rem",
            borderTop:  "1px solid #f1f3f5",
            fontSize:   "0.75rem",
            color:      "#adb5bd",
            textAlign:  "center",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          © {new Date().getFullYear()} SC Global Imports & Exports
        </div>
      </div>

      {/* ── NO SPACER — hero starts from top behind transparent navbar ── */}
    </>
  );
};

export default Navbar;