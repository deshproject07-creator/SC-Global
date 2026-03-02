import { useState }              from "react";
import { NavLink, useNavigate }  from "react-router-dom";
import { logoutAdmin }           from "../../firebase/auth";
import { toast }                 from "react-toastify";
import {
  FiGrid, FiBox, FiImage,
  FiFileText, FiLogOut,
  FiGlobe, FiMenu, FiX,
}                                from "react-icons/fi";
import logo                      from "../../assets/images/company_images/SC-Global.jpeg";
import "../../styles/admin.css";

const navItems = [
  {
    to:    "/admin/categories",
    icon:  <FiGrid size={18} />,
    label: "Categories",
  },
  {
    to:    "/admin/products",
    icon:  <FiBox size={18} />,
    label: "Products",
  },
  {
    to:    "/admin/gallery",
    icon:  <FiImage size={18} />,
    label: "Gallery",
  },
  {
    to:    "/admin/blog",
    icon:  <FiFileText size={18} />,
    label: "Blog",
  },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate                  = useNavigate();

  // ── Logout ─────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out successfully.");
      navigate("/");
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════ */}
      <div
        className="admin-sidebar d-none d-lg-flex"
        style={{
          width:      collapsed ? 72 : 260,
          transition: "width 0.3s ease",
          overflow:   "hidden",
        }}
      >
        {/* ── Brand ── */}
        <div
          className="sidebar-brand"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: collapsed ? "center" : "space-between",
            gap:            "0.65rem",
            padding:        "1.25rem 1rem",
          }}
        >
          {/* Logo + Name */}
          <div
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "0.65rem",
              overflow:   "hidden",
            }}
          >
            <img
              src={logo}
              alt="SC Global"
              style={{
                width:        36,
                height:       36,
                borderRadius: "8px",
                objectFit:    "cover",
                flexShrink:   0,
                border:       "2px solid rgba(255,255,255,0.2)",
              }}
            />
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    color:       "white",
                    fontWeight:  700,
                    fontSize:    "0.92rem",
                    lineHeight:  1.1,
                    whiteSpace:  "nowrap",
                  }}
                >
                  SC Global
                </div>
                <div
                  style={{
                    color:         "rgba(255,255,255,0.55)",
                    fontSize:      "0.58rem",
                    letterSpacing: "1px",
                    fontWeight:    600,
                    textTransform: "uppercase",
                    whiteSpace:    "nowrap",
                  }}
                >
                  Admin Panel
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background:     "rgba(255,255,255,0.12)",
              border:         "none",
              borderRadius:   "8px",
              width:          30,
              height:         30,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
              flexShrink:     0,
              transition:     "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.22)"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.background = "rgba(255,255,255,0.12)"
            }
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiMenu size={15} /> : <FiX size={15} />}
          </button>
        </div>

        {/* ── Nav Links ── */}
        <nav
          className="flex-grow-1 py-2"
          style={{ overflowX: "hidden" }}
        >
          {/* Section Label */}
          {!collapsed && (
            <div
              style={{
                padding:       "0.5rem 1.25rem 0.25rem",
                fontSize:      "0.65rem",
                fontWeight:    700,
                color:         "rgba(255,255,255,0.4)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Manage
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : ""}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                padding:        collapsed ? "0.85rem" : "0.85rem 1.25rem",
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
              )}
            </NavLink>
          ))}

          {/* Divider */}
          <div
            style={{
              margin:     "0.75rem 1rem",
              borderTop:  "1px solid rgba(255,255,255,0.1)",
            }}
          />

          {/* View Website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "View Website" : ""}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "0.75rem",
              padding:        collapsed ? "0.85rem" : "0.85rem 1.25rem",
              margin:         "0.15rem 0.75rem",
              borderRadius:   "8px",
              color:          "rgba(255,255,255,0.65)",
              fontWeight:     500,
              fontSize:       "0.88rem",
              textDecoration: "none",
              justifyContent: collapsed ? "center" : "flex-start",
              transition:     "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color      = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color      = "rgba(255,255,255,0.65)";
            }}
          >
            <FiGlobe size={18} style={{ flexShrink: 0 }} />
            {!collapsed && (
              <span style={{ whiteSpace: "nowrap" }}>View Website</span>
            )}
          </a>
        </nav>

        {/* ── Logout ── */}
        <div
          style={{
            padding:     collapsed ? "1rem 0.5rem" : "1rem",
            borderTop:   "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
            style={{
              width:          "100%",
              background:     "rgba(255,255,255,0.08)",
              border:         "1px solid rgba(255,255,255,0.15)",
              borderRadius:   "10px",
              color:          "rgba(255,255,255,0.85)",
              fontWeight:     500,
              fontSize:       "0.88rem",
              padding:        "0.65rem",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "0.6rem",
              transition:     "all 0.2s ease",
              whiteSpace:     "nowrap",
              overflow:       "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = "rgba(220,53,69,0.25)";
              e.currentTarget.style.borderColor  = "rgba(220,53,69,0.4)";
              e.currentTarget.style.color        = "#ff6b7a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor  = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color        = "rgba(255,255,255,0.85)";
            }}
          >
            <FiLogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE TOPBAR SIDEBAR
      ══════════════════════════════════════ */}
      <MobileSidebar
        navItems={navItems}
        handleLogout={handleLogout}
      />
    </>
  );
};

// ── Mobile Sidebar Component ───────────────────
const MobileSidebar = ({ navItems, handleLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="d-lg-none"
        style={{
          position:       "fixed",
          top:            0,
          left:           0,
          right:          0,
          zIndex:         1000,
          background:     "linear-gradient(135deg, #0d6efd, #084298)",
          padding:        "0.75rem 1rem",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          boxShadow:      "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <img
            src={logo}
            alt="SC Global"
            style={{
              width:        34,
              height:       34,
              borderRadius: "8px",
              objectFit:    "cover",
              border:       "2px solid rgba(255,255,255,0.2)",
            }}
          />
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>
              SC Global
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.58rem", letterSpacing: "1px" }}>
              ADMIN PANEL
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{
            background:     "rgba(255,255,255,0.15)",
            border:         "none",
            borderRadius:   "8px",
            width:          36,
            height:         36,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "white",
            cursor:         "pointer",
          }}
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Mobile Spacer */}
      <div className="d-lg-none" style={{ height: 60 }} />

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position:      "fixed",
          inset:         0,
          background:    "rgba(0,0,0,0.5)",
          zIndex:        1100,
          opacity:       open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition:    "opacity 0.3s ease",
        }}
      />

      {/* Slide-in Panel */}
      <div
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         260,
          height:        "100vh",
          background:    "linear-gradient(180deg, #0d6efd 0%, #084298 100%)",
          zIndex:        1200,
          transform:     open ? "translateX(0)" : "translateX(-100%)",
          transition:    "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          display:       "flex",
          flexDirection: "column",
          overflowY:     "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "1.25rem 1rem",
            borderBottom:   "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <img
              src={logo}
              alt="SC Global"
              style={{
                width:        38,
                height:       38,
                borderRadius: "8px",
                objectFit:    "cover",
                border:       "2px solid rgba(255,255,255,0.2)",
              }}
            />
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "0.92rem" }}>
                SC Global
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.58rem", letterSpacing: "1px" }}>
                ADMIN PANEL
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background:     "rgba(255,255,255,0.12)",
              border:         "none",
              borderRadius:   "8px",
              width:          32,
              height:         32,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "white",
              cursor:         "pointer",
            }}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow-1 py-2">
          <div
            style={{
              padding:       "0.5rem 1.25rem 0.25rem",
              fontSize:      "0.65rem",
              fontWeight:    700,
              color:         "rgba(255,255,255,0.4)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Manage
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div
            style={{
              margin:    "0.75rem 1rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "0.75rem",
              padding:        "0.85rem 1.25rem",
              margin:         "0.15rem 0.75rem",
              borderRadius:   "8px",
              color:          "rgba(255,255,255,0.65)",
              fontWeight:     500,
              fontSize:       "0.88rem",
              textDecoration: "none",
              transition:     "all 0.2s ease",
            }}
          >
            <FiGlobe size={18} />
            View Website
          </a>
        </nav>

        {/* Logout */}
        <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={handleLogout}
            style={{
              width:          "100%",
              background:     "rgba(255,255,255,0.08)",
              border:         "1px solid rgba(255,255,255,0.15)",
              borderRadius:   "10px",
              color:          "rgba(255,255,255,0.85)",
              fontWeight:     500,
              fontSize:       "0.88rem",
              padding:        "0.65rem",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "0.6rem",
            }}
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;