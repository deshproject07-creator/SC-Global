import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
import "./styles/admin.css";

import { AuthProvider }       from "./context/AuthContext";
import ProtectedRoute         from "./components/admin/ProtectedRoute";

import Home                   from "./pages/Home";
import Login                  from "./pages/Login";
import ManageCategories       from "./pages/admin/ManageCategories";
import ManageProducts         from "./pages/admin/ManageProducts";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>

        {/* ── Toast Notifications ── */}
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          style={{ zIndex: 99999 }}
        />

        <Routes>

          {/* ── Public ── */}
          <Route path="/"            element={<Home />} />
          <Route path="/admin/login" element={<Login />} />

          {/* ── Protected Admin ── */}
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <ManageCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ManageProducts />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;