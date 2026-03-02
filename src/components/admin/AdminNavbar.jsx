import { useLocation } from "react-router-dom";
import { FiGrid, FiBox } from "react-icons/fi";

const pageTitles = {
  "/admin/categories": { title: "Manage Categories", icon: <FiGrid /> },
  "/admin/products":   { title: "Manage Products",   icon: <FiBox />  },
};

const AdminNavbar = () => {
  const location = useLocation();
  const current = pageTitles[location.pathname] || { title: "Admin Panel", icon: null };

  return (
    <div className="admin-topbar">
      <div className="d-flex align-items-center gap-2">
        <span className="text-primary">{current.icon}</span>
        <h5 className="mb-0 fw-600" style={{ color: "#1a1a2e" }}>
          {current.title}
        </h5>
      </div>
      <div className="d-flex align-items-center gap-2">
        <span
          className="badge rounded-pill"
          style={{ background: "#e8f0fe", color: "#0d6efd", fontSize: "0.75rem" }}
        >
          Admin
        </span>
      </div>
    </div>
  );
};

export default AdminNavbar;