import { useState, useEffect, useRef } from "react";
import {
  getBlogs, addBlog, updateBlog,
  deleteBlog, toggleBlogPublish,
}                                       from "../../firebase/firestore";
import { uploadToCloudinary }           from "../../cloudinary/config";
import { toast }                        from "react-toastify";
import {
  FiPlus, FiEdit2, FiTrash2,
  FiEye, FiEyeOff, FiSave,
  FiX, FiImage, FiUpload,
  FiFileText,
}                                       from "react-icons/fi";
import AdminSidebar                     from "../../components/admin/AdminSidebar";
import AdminNavbar                      from "../../components/admin/AdminNavbar";
import { formatDate }                   from "../../utils/helpers";
import "../../styles/admin.css";

const emptyForm = { title: "", description: "", coverImage: "" };

const ManageBlog = () => {
  const [blogs,          setBlogs]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showModal,      setShowModal]      = useState(false);
  const [formData,       setFormData]       = useState(emptyForm);
  const [editingId,      setEditingId]      = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [deleting,       setDeleting]       = useState(false);
  const [togglingId,     setTogglingId]     = useState(null);
  const [imageFile,      setImageFile]      = useState(null);
  const [imagePreview,   setImagePreview]   = useState("");
  const [uploading,      setUploading]      = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef                        = useRef(null);

  // ── Fetch Blogs (all including drafts) ────
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs(false); // false = all blogs
      setBlogs(data);
    } catch {
      toast.error("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  // ── Open Add Modal ─────────────────────────
  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  // ── Open Edit Modal ────────────────────────
  const openEditModal = (blog) => {
    setFormData({
      title:       blog.title,
      description: blog.description,
      coverImage:  blog.coverImage || "",
    });
    setEditingId(blog.id);
    setImageFile(null);
    setImagePreview(blog.coverImage || "");
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

  // ── Handle Image Pick ──────────────────────
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Remove Image ───────────────────────────
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(editingId ? formData.coverImage : "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save (Add / Edit) ──────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Blog description is required.");
      return;
    }
    setSaving(true);
    try {
      let coverImage = formData.coverImage;

      // Upload image if new one picked
      if (imageFile) {
        setUploading(true);
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 85) { clearInterval(progressInterval); return prev; }
            return prev + 10;
          });
        }, 200);
        coverImage = await uploadToCloudinary(imageFile);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploading(false);
      }

      const payload = { ...formData, coverImage };

      if (editingId) {
        await updateBlog(editingId, payload);
        toast.success("Blog post updated successfully! ✅");
      } else {
        await addBlog(payload);
        toast.success("Blog post created as draft! 📝");
      }
      closeModal();
      fetchBlogs();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
      setUploading(false);
      setUploadProgress(0);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Publish ─────────────────────────
  const handleTogglePublish = async (blog) => {
    setTogglingId(blog.id);
    try {
      await toggleBlogPublish(blog.id, !blog.published);
      toast.success(
        blog.published
          ? `"${blog.title}" unpublished.`
          : `"${blog.title}" published! 🎉`
      );
      fetchBlogs();
    } catch {
      toast.error("Failed to update publish status.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete Confirm ─────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      fetchBlogs();
    } catch {
      toast.error("Failed to delete blog post.");
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
              <h4 className="fw-bold mb-0">Blog Posts</h4>
              <p className="text-muted small mb-0">
                {blogs.filter(b => b.published).length} published ·{" "}
                {blogs.filter(b => !b.published).length} drafts
              </p>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <FiPlus /> New Post
            </button>
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="d-flex flex-column gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height:       100,
                    borderRadius: 12,
                    background:   "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation:    "shimmer 1.5s infinite",
                  }}
                />
              ))}
            </div>

          /* Empty State */
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FiFileText size={48} className="mb-3 opacity-25" />
              <p>No blog posts yet. Create your first post!</p>
            </div>

          /* Blog List */
          ) : (
            <div className="d-flex flex-column gap-3">
              {blogs.map((blog, i) => (
                <div
                  key={blog.id}
                  className="admin-card animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="d-flex align-items-center gap-3 p-3 flex-wrap">

                    {/* Cover Image */}
                    <img
                      src={blog.coverImage || "https://placehold.co/80x80?text=Blog"}
                      alt={blog.title}
                      style={{
                        width:        80,
                        height:       80,
                        objectFit:    "cover",
                        borderRadius: 10,
                        flexShrink:   0,
                        border:       "2px solid #e9ecef",
                      }}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/80x80?text=Blog";
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h6 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>
                          {blog.title}
                        </h6>
                        {/* Publish Badge */}
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: blog.published ? "#d1fae5" : "#fff3cd",
                            color:      blog.published ? "#065f46" : "#92400e",
                            fontSize:   "0.7rem",
                            fontWeight: 600,
                            padding:    "0.25rem 0.65rem",
                          }}
                        >
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p
                        className="text-muted small mb-1"
                        style={{
                          display:           "-webkit-box",
                          WebkitLineClamp:   2,
                          WebkitBoxOrient:   "vertical",
                          overflow:          "hidden",
                          lineHeight:        1.5,
                        }}
                      >
                        {blog.description || "No description."}
                      </p>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color:    "#adb5bd",
                        }}
                      >
                        {formatDate(blog.createdAt)}
                        {blog.slug && (
                          <span style={{ marginLeft: 8, opacity: 0.7 }}>
                            · /blog/{blog.slug}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">

                      {/* Publish Toggle */}
                      <button
                        className={`btn btn-sm ${blog.published ? "btn-warning" : "btn-success"}`}
                        onClick={() => handleTogglePublish(blog)}
                        disabled={togglingId === blog.id}
                        title={blog.published ? "Unpublish" : "Publish"}
                        style={{ minWidth: 100 }}
                      >
                        {togglingId === blog.id ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : blog.published ? (
                          <><FiEyeOff size={13} className="me-1" />Unpublish</>
                        ) : (
                          <><FiEye size={13} className="me-1" />Publish</>
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditModal(blog)}
                      >
                        <FiEdit2 size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteTarget(blog)}
                      >
                        <FiTrash2 size={14} />
                      </button>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Blog Post" : "New Blog Post"}
                </h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="row g-4">

                    {/* Left: Form Fields */}
                    <div className="col-12 col-md-6">

                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label fw-500">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. SC Global Expands to New Markets"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label fw-500">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={8}
                          placeholder="Write your blog post content here..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          style={{ resize: "vertical" }}
                        />
                        <div className="text-muted" style={{ fontSize: "0.72rem", marginTop: 4 }}>
                          {formData.description.length} characters
                        </div>
                      </div>
                    </div>

                    {/* Right: Image Upload */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-500">Cover Image</label>

                      {/* Preview */}
                      {imagePreview ? (
                        <div className="position-relative mb-2">
                          <img
                            src={imagePreview}
                            alt="Cover Preview"
                            className="rounded"
                            style={{
                              width:      "100%",
                              height:     220,
                              objectFit:  "cover",
                            }}
                          />
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={removeImage}
                            style={{
                              position:       "absolute",
                              top:            8,
                              right:          8,
                              background:     "rgba(0,0,0,0.55)",
                              border:         "none",
                              borderRadius:   "50%",
                              width:          30,
                              height:         30,
                              display:        "flex",
                              alignItems:     "center",
                              justifyContent: "center",
                              color:          "white",
                              cursor:         "pointer",
                            }}
                          >
                            <FiX size={14} />
                          </button>
                          {/* Change */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              position:       "absolute",
                              bottom:         8,
                              right:          8,
                              background:     "rgba(13,110,253,0.85)",
                              border:         "none",
                              borderRadius:   8,
                              padding:        "4px 10px",
                              color:          "white",
                              cursor:         "pointer",
                              fontSize:       "0.75rem",
                              display:        "flex",
                              alignItems:     "center",
                              gap:            4,
                            }}
                          >
                            <FiUpload size={12} /> Change
                          </button>
                        </div>
                      ) : (
                        /* Dropzone */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border:       "2px dashed #dee2e6",
                            borderRadius: 12,
                            padding:      "3rem 2rem",
                            textAlign:    "center",
                            cursor:       "pointer",
                            background:   "#f8f9ff",
                            transition:   "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#0d6efd";
                            e.currentTarget.style.background  = "#e8f0fe";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#dee2e6";
                            e.currentTarget.style.background  = "#f8f9ff";
                          }}
                        >
                          <FiImage size={36} color="#0d6efd" className="mb-2" />
                          <p className="mb-1 fw-500" style={{ fontSize: "0.9rem" }}>
                            Click to upload cover image
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                            JPG, PNG, WEBP — Max 5MB
                          </p>
                        </div>
                      )}

                      {/* Hidden Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImagePick}
                        style={{ display: "none" }}
                      />

                      {/* Progress Bar */}
                      {uploading && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              Uploading...
                            </span>
                            <span className="text-primary fw-500" style={{ fontSize: "0.75rem" }}>
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: 6, borderRadius: 4 }}>
                            <div
                              className="progress-bar"
                              style={{
                                width:      `${uploadProgress}%`,
                                background: "linear-gradient(90deg,#0d6efd,#084298)",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Draft Notice */}
                      {!editingId && (
                        <div
                          className="mt-3 p-3 rounded-3 d-flex align-items-start gap-2"
                          style={{
                            background: "#fff3cd",
                            border:     "1px solid #ffc107",
                            fontSize:   "0.8rem",
                            color:      "#856404",
                          }}
                        >
                          <FiEyeOff size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                          <span>
                            New posts are saved as <strong>drafts</strong>.
                            You can publish them after creation using the Publish button.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={closeModal}
                  >
                    <FiX className="me-1" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving || uploading}
                  >
                    {saving || uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {uploading ? "Uploading..." : "Saving..."}
                      </>
                    ) : (
                      <><FiSave className="me-1" />{editingId ? "Update Post" : "Save Draft"}</>
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
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-body text-center p-4">
                <div
                  style={{
                    width:          56,
                    height:         56,
                    background:     "#fff0f0",
                    borderRadius:   "50%",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    margin:         "0 auto 1rem",
                  }}
                >
                  <FiTrash2 size={24} color="#dc3545" />
                </div>
                <h6 className="fw-bold mb-2">Delete Blog Post?</h6>
                <p className="text-muted small mb-1">
                  <strong>"{deleteTarget.title}"</strong>
                </p>
                <p className="text-muted small mb-4">
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
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Deleting...
                      </>
                    ) : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ManageBlog;