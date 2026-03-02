import { useLocation }  from "react-router-dom";
import {
  FiGrid, FiBox, FiImage,
  FiFileText, FiShield,
}                       from "react-icons/fi";

// ── Page title map ─────────────────────────────
const pageTitles = {
  "/admin/categories": { title: "Manage Categories", icon: <FiGrid size={18} />     },
  "/admin/products":   { title: "Manage Products",   icon: <FiBox size={18} />      },
  "/admin/gallery":    { title: "Manage Gallery",    icon: <FiImage size={18} />    },
  "/admin/blog":       { title: "Manage Blog",       icon: <FiFileText size={18} /> },
};

const AdminNavbar = () => {
  const location = useLocation();
  const current  = pageTitles[location.pathname] || {
    title: "Admin Panel",
    icon:  <FiShield size={18} />,
  };

  return (
    <div
      className="admin-topbar"
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 1.5rem",
        height:         64,
        borderBottom:   "1px solid #f1f3f5",
        background:     "white",
        position:       "sticky",
        top:            0,
        zIndex:         100,
        boxShadow:      "0 1px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Page Title ── */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "0.6rem",
        }}
      >
        <span style={{ color: "#0d6efd" }}>{current.icon}</span>
        <h5
          style={{
            margin:     0,
            fontWeight: 700,
            fontSize:   "1rem",
            color:      "#1a1a2e",
          }}
        >
          {current.title}
        </h5>
      </div>

      {/* ── Right: Admin Badge ── */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "0.75rem",
        }}
      >
        {/* Live indicator */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.4rem",
            fontSize:   "0.75rem",
            color:      "#6c757d",
          }}
        >
          <span
            style={{
              width:      8,
              height:     8,
              borderRadius: "50%",
              background: "#28a745",
              display:    "inline-block",
              animation:  "pulse 2s infinite",
            }}
          />
          Live
        </div>

        {/* Admin Badge */}
        <div
          style={{
            background:   "linear-gradient(135deg, #0d6efd, #084298)",
            borderRadius: "20px",
            padding:      "0.35rem 1rem",
            display:      "flex",
            alignItems:   "center",
            gap:          "0.4rem",
          }}
        >
          <FiShield size={13} color="white" />
          <span
            style={{
              color:      "white",
              fontSize:   "0.78rem",
              fontWeight: 600,
            }}
          >
            Admin
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(1.2);  }
        }
      `}</style>
    </div>
  );
};

export default AdminNavbar;