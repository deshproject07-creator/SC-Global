import { NavLink, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../firebase/auth";
import { toast } from "react-toastify";
import { FiGrid, FiBox, FiLogOut, FiGlobe } from "react-icons/fi";
import "../../styles/admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

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
    <div className="admin-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <FiGlobe className="me-2" />
        SC Global
        <div style={{ fontSize: "0.7rem", opacity: 0.7, fontWeight: 400 }}>
          Admin Panel
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-grow-1 py-3">
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <FiGrid /> Manage Categories
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <FiBox /> Manage Products
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-3 border-top" style={{ borderColor: "rgba(255,255,255,0.15) !important" }}>
        <button
          onClick={handleLogout}
          className="btn w-100 text-white d-flex align-items-center gap-2 justify-content-center"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;