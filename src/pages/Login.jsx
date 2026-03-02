import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../firebase/auth";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import "../styles/admin.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await loginAdmin(email, password);
      toast.success("Welcome back, Admin! 👋");
      navigate("/admin/categories");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* Logo / Brand */}
        <div className="text-center mb-4">
          <div
            style={{
              width: 60, height: 60,
              background: "linear-gradient(135deg, #0d6efd, #084298)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <FiLogIn size={26} color="white" />
          </div>
          <h4 className="fw-700 mb-1" style={{ color: "#1a1a2e" }}>Admin Panel</h4>
          <p className="text-muted small">SC Global Exports & Imports</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-500 small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FiMail color="#6c757d" />
              </span>
              <input
                type="email"
                className="form-control border-start-0 ps-0"
                placeholder="admin@scglobal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-500 small text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <FiLock color="#6c757d" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn className="me-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Back to site */}
        <div className="text-center mt-3">
          <a href="/" className="text-muted small" style={{ textDecoration: "none" }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;