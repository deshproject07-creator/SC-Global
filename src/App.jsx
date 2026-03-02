import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer }                          from "react-toastify";
import { AuthProvider }                            from "./context/AuthContext";
import ProtectedRoute                              from "./components/admin/ProtectedRoute";

// ── Public Pages ───────────────────────────────
import Home            from "./pages/Home";
import About           from "./pages/About";
import Products        from "./pages/Products";
import CategoryProducts from "./pages/CategoryProducts";
import Gallery         from "./pages/Gallery";
import Blog            from "./pages/Blog";
import BlogDetail      from "./pages/BlogDetail";

// ── Admin Pages ────────────────────────────────
import Login           from "./pages/Login";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageProducts  from "./pages/admin/ManageProducts";
import ManageGallery   from "./pages/admin/ManageGallery";
import ManageBlog      from "./pages/admin/ManageBlog";

// ── Styles ─────────────────────────────────────
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/custom.css";
import "./styles/admin.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public Routes ── */}
          <Route path="/"                element={<Home />}             />
          <Route path="/about"           element={<About />}            />
          <Route path="/products"        element={<Products />}         />
          <Route path="/products/:slug"  element={<CategoryProducts />} />
          <Route path="/gallery"         element={<Gallery />}          />
          <Route path="/blog"            element={<Blog />}             />
          <Route path="/blog/:slug"      element={<BlogDetail />}       />

          {/* ── Admin Auth ── */}
          <Route path="/admin/login"     element={<Login />}            />

          {/* ── Protected Admin Routes ── */}
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
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <ManageGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute>
                <ManageBlog />
              </ProtectedRoute>
            }
          />

          {/* ── Redirect /admin → /admin/categories ── */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/categories" replace />}
          />

          {/* ── 404 Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

        {/* ── Toast Notifications ── */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;