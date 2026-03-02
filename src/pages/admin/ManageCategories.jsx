import { useState, useEffect, useRef } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../../firebase/firestore";
import { uploadToCloudinary } from "../../cloudinary/config";
import { toast } from "react-toastify";
import {
  FiPlus, FiEdit2, FiTrash2, FiGrid,
  FiList, FiX, FiSave, FiUpload, FiImage
} from "react-icons/fi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin.css";

const emptyForm = { name: "", description: "", imageUrl: "" };

const ManageCategories = () => {
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [viewMode, setViewMode]         = useState("table");
  const [showModal, setShowModal]       = useState(false);
  const [formData, setFormData]         = useState(emptyForm);
  const [editingId, setEditingId]       = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Image Upload States ────────────────────
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef                    = useRef(null);

  // ── Fetch ──────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ── Open Add Modal ─────────────────────────
  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  // ── Open Edit Modal ────────────────────────
  const openEditModal = (cat) => {
    setFormData({ name: cat.name, description: cat.description, imageUrl: cat.imageUrl });
    setEditingId(cat.id);
    setImageFile(null);
    setImagePreview(cat.imageUrl || "");
    setShowModal(true);
  };

  // ── Close Modal ────────────────────────────
  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  // ── Handle Image File Pick ─────────────────
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Remove Selected Image ──────────────────
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(editingId ? formData.imageUrl : "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save (Add / Edit) ──────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if picked
      if (imageFile) {
        setUploading(true);

        // Simulate progress (Cloudinary doesn't return progress natively)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 85) { clearInterval(progressInterval); return prev; }
            return prev + 10;
          });
        }, 200);

        imageUrl = await uploadToCloudinary(imageFile);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploading(false);
      }

      const payload = { ...formData, imageUrl };

      if (editingId) {
        await updateCategory(editingId, payload);
        toast.success("Category updated successfully! ✅");
      } else {
        await addCategory(payload);
        toast.success("Category added successfully! 🎉");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
      setUploading(false);
      setUploadProgress(0);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete Confirm ─────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to delete category.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">

          {/* ── Header ── */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Categories</h4>
              <p className="text-muted small mb-0">{categories.length} total categories</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")} title="Table View"
              >
                <FiList size={16} />
              </button>
              <button
                className={`view-toggle-btn ${viewMode === "card" ? "active" : ""}`}
                onClick={() => setViewMode("card")} title="Card View"
              >
                <FiGrid size={16} />
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAddModal}>
                <FiPlus /> Add Category
              </button>
            </div>
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FiGrid size={48} className="mb-3 opacity-25" />
              <p>No categories yet. Add your first one!</p>
            </div>
          ) : viewMode === "table" ? (

            /* ── TABLE VIEW ── */
            <div className="admin-table">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={cat.id} className="animate-fade-in">
                      <td className="text-muted small">{i + 1}</td>
                      <td>
                        <img
                          src={cat.imageUrl || "https://placehold.co/52x52?text=No+Img"}
                          alt={cat.name}
                          className="table-img"
                          onError={(e) => { e.target.src = "https://placehold.co/52x52?text=No+Img"; }}
                        />
                      </td>
                      <td className="fw-500">{cat.name}</td>
                      <td className="text-muted small" style={{ maxWidth: 300 }}>
                        <span style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {cat.description || "—"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEditModal(cat)}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          ) : (

            /* ── CARD VIEW ── */
            <div className="row g-3 stagger-children">
              {categories.map((cat) => (
                <div key={cat.id} className="col-12 col-sm-6 col-lg-4 animate-slide-up">
                  <div className="admin-card h-100">
                    <img
                      src={cat.imageUrl || "https://placehold.co/400x180?text=No+Image"}
                      alt={cat.name}
                      style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                      onError={(e) => { e.target.src = "https://placehold.co/400x180?text=No+Image"; }}
                    />
                    <div className="p-3">
                      <h6 className="fw-bold mb-1">{cat.name}</h6>
                      <p className="text-muted small mb-3" style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {cat.description || "No description provided."}
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary flex-fill"
                          onClick={() => openEditModal(cat)}
                        >
                          <FiEdit2 size={13} className="me-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger flex-fill"
                          onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                        >
                          <FiTrash2 size={13} className="me-1" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════ */}
      {showModal && (
        <div
          className="modal show d-block admin-modal"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Category" : "Add New Category"}
                </h5>
                <button className="btn-close" onClick={closeModal} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-500">
                      Category Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Agricultural Products"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-500">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Brief description of this category..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* ── Image Upload ── */}
                  <div className="mb-3">
                    <label className="form-label fw-500">Category Image</label>

                    {/* Preview */}
                    {imagePreview ? (
                      <div className="position-relative mb-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded"
                          style={{ width: "100%", height: 160, objectFit: "cover" }}
                        />
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={removeImage}
                          style={{
                            position: "absolute", top: 8, right: 8,
                            background: "rgba(0,0,0,0.55)",
                            border: "none", borderRadius: "50%",
                            width: 30, height: 30,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", cursor: "pointer",
                          }}
                        >
                          <FiX size={14} />
                        </button>
                        {/* Change Image */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            position: "absolute", bottom: 8, right: 8,
                            background: "rgba(13,110,253,0.85)",
                            border: "none", borderRadius: 8,
                            padding: "4px 10px",
                            color: "white", cursor: "pointer",
                            fontSize: "0.75rem",
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          <FiUpload size={12} /> Change
                        </button>
                      </div>
                    ) : (
                      /* Upload Dropzone */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: "2px dashed #dee2e6",
                          borderRadius: 12,
                          padding: "2rem",
                          textAlign: "center",
                          cursor: "pointer",
                          background: "#f8f9ff",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#0d6efd";
                          e.currentTarget.style.background = "#e8f0fe";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#dee2e6";
                          e.currentTarget.style.background = "#f8f9ff";
                        }}
                      >
                        <FiImage size={32} color="#0d6efd" className="mb-2" />
                        <p className="mb-1 fw-500" style={{ fontSize: "0.9rem" }}>
                          Click to upload image
                        </p>
                        <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                          JPG, PNG, WEBP — Max 5MB
                        </p>
                      </div>
                    )}

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImagePick}
                      style={{ display: "none" }}
                    />

                    {/* Upload Progress Bar */}
                    {uploading && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Uploading to Cloudinary...
                          </span>
                          <span className="text-primary fw-500" style={{ fontSize: "0.75rem" }}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="progress" style={{ height: 6, borderRadius: 4 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${uploadProgress}%`,
                              background: "linear-gradient(90deg, #0d6efd, #084298)",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={closeModal}>
                    <FiX className="me-1" /> Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                    {saving || uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {uploading ? "Uploading..." : "Saving..."}
                      </>
                    ) : (
                      <><FiSave className="me-1" />{editingId ? "Update" : "Add Category"}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ══════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body text-center p-4">
                <div style={{
                  width: 56, height: 56, background: "#fff0f0",
                  borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                }}>
                  <FiTrash2 size={24} color="#dc3545" />
                </div>
                <h6 className="fw-bold mb-2">Delete Category?</h6>
                <p className="text-muted small mb-4">
                  Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>?
                  This action cannot be undone.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-light px-4"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Deleting...</>
                    ) : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCategories;