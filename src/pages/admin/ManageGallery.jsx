import { useState, useEffect, useRef } from "react";
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryOrder,
} from "../../firebase/firestore";
import { uploadToCloudinary } from "../../cloudinary/config";
import { toast } from "react-toastify";
import {
  FiPlus, FiTrash2, FiImage,
  FiUpload, FiMove, FiX
} from "react-icons/fi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin.css";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  
  // ── Track Mobile State ─────────────────────
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileInputRef = useRef(null);

  // ── Track screen size for responsive grid ──
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Add event listener for real-time adjustments
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Fetch Images ───────────────────────────
  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch {
      toast.error("Failed to load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  // ── Handle File Pick & Upload ──────────────
  const handleFilePick = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate each file against allowed formats and size limits
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    for (const file of files) {
      if (!allowed.includes(file.type)) {
        toast.error(`${file.name}: Only JPG, PNG, WEBP allowed.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Must be less than 5MB.`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const total = files.length;
      for (let i = 0; i < total; i++) {
        // Simulate progress per file for visual feedback
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const base = ((i) / total) * 100;
            const ceiling = ((i + 1) / total) * 100 - 5;
            if (prev >= ceiling) {
              clearInterval(progressInterval);
              return prev;
            }
            return Math.min(prev + 5, ceiling);
          });
        }, 150);

        const url = await uploadToCloudinary(files[i], "sc-global-exports/gallery");
        clearInterval(progressInterval);
        setUploadProgress(Math.round(((i + 1) / total) * 100));

        await addGalleryImage({ imageUrl: url });
      }

      toast.success(
        total === 1
          ? "Image uploaded successfully! 🎉"
          : `${total} images uploaded successfully! 🎉`
      );
      fetchImages();
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Delete ─────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryImage(deleteTarget.id);
      toast.success("Image deleted successfully.");
      setDeleteTarget(null);
      fetchImages();
    } catch {
      toast.error("Failed to delete image.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // ── Drag & Drop Reorder ────────────────────
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOver(index);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOver(null);
      return;
    }

    // Reorder locally first for immediate UI response
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setImages(reordered);
    setDragIndex(null);
    setDragOver(null);

    // Persist new order to Firestore backend
    try {
      await Promise.all(
        reordered.map((img, i) => updateGalleryOrder(img.id, i + 1))
      );
      toast.success("Gallery order updated! ✅");
    } catch {
      toast.error("Failed to save order. Please try again.");
      fetchImages(); // revert on error
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOver(null);
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
              <h4 className="fw-bold mb-0">Gallery</h4>
              <p className="text-muted small mb-0">
                {images.length} image{images.length !== 1 ? "s" : ""} · Drag to reorder
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {/* Upload Button */}
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                // Increase tap target size for mobile interfaces
                style={isMobile ? { padding: "0.75rem 1rem", minHeight: 44 } : {}}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiPlus /> Upload Images
                  </>
                )}
              </button>

              {/* Hidden Multi-file Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFilePick}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* ── Upload Progress ── */}
          {uploading && (
            <div
              className="mb-4 p-3 rounded-3"
              style={{ background: "#e8f0fe", border: "1px solid #bdd3fe" }}
            >
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: "0.85rem", color: "#0d6efd", fontWeight: 600 }}>
                  Uploading to Cloudinary...
                </span>
                <span style={{ fontSize: "0.85rem", color: "#0d6efd", fontWeight: 700 }}>
                  {uploadProgress}%
                </span>
              </div>
              <div className="progress" style={{ height: 8, borderRadius: 4 }}>
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

          {/* ── Drag Info Banner ── */}
          {images.length > 1 && !loading && (
            <div
              className="mb-4 d-flex align-items-center gap-2 p-3 rounded-3"
              style={{
                background: "#f8f9ff",
                border: "1px dashed #bdd3fe",
                color: "#6c757d",
                fontSize: "0.82rem",
              }}
            >
              <FiMove size={16} color="#0d6efd" />
              <span>
                Drag and drop images to reorder them. Changes are saved automatically.
              </span>
            </div>
          )}

          {/* ── Loading ── */}
          {loading ? (
            <div className="row g-3">
              {[...Array(6)].map((_, i) => (
                 // Responsive loading skeletons matching the grid structure
                <div key={i} className={`col-${isMobile ? '6' : '12'} col-sm-6 col-lg-4`}>
                  <div
                    style={{
                      height: isMobile ? 150 : 220, // Shorter skeletons on mobile
                      borderRadius: 12,
                      background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                    }}
                  />
                </div>
              ))}
            </div>

            /* Empty State */
          ) : images.length === 0 ? (
            <div
              className="text-center py-5"
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #dee2e6",
                borderRadius: 16,
                cursor: "pointer",
                background: "#f8f9ff",
                transition: "all 0.2s ease",
                padding: isMobile ? "2rem 1rem" : "3rem", // Adjust padding for mobile
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
              <FiImage size={isMobile ? 40 : 52} className="mb-3" style={{ color: "#0d6efd", opacity: 0.5 }} />
              <h6 style={{ color: "#6c757d", fontWeight: 600 }}>
                No images yet
              </h6>
              <p className="text-muted small mb-3">
                Click here or use the Upload button to add gallery images
              </p>
              <div
                className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3"
                style={{
                  background: "#0d6efd",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <FiUpload size={14} /> Upload Images
              </div>
            </div>

            /* Image Grid */
          ) : (
             // Apply smaller gutters on mobile devices for tighter layouts
            <div className={`row ${isMobile ? 'g-2' : 'g-3'}`}>
              {images.map((img, i) => (
                <div
                  key={img.id}
                  // Force a 2-column layout on extra small screens using col-6
                  className={`col-${isMobile ? '6' : '12'} col-sm-6 col-lg-4`}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    opacity: dragIndex === i ? 0.4 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                      boxShadow: dragOver === i
                        ? "0 0 0 3px #0d6efd, 0 8px 24px rgba(13,110,253,0.2)"
                        : "0 2px 12px rgba(0,0,0,0.08)",
                      transition: "box-shadow 0.2s ease",
                      background: "#e9ecef",
                      cursor: "grab",
                    }}
                  >
                    {/* Image */}
                    <img
                      src={img.imageUrl}
                      alt={`Gallery ${i + 1}`}
                      style={{
                        width: "100%",
                        // Reduce image height slightly on mobile to fit 2 columns nicely
                        height: isMobile ? 150 : 200, 
                        objectFit: "cover",
                        display: "block",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x200?text=Image";
                      }}
                    />

                    {/* Order Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: 6,
                        padding: "2px 8px",
                        color: "white",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      #{i + 1}
                    </div>

                    {/* Drag Handle */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.4)",
                        borderRadius: 6,
                        padding: "4px 8px",
                        color: "rgba(255,255,255,0.85)",
                        // Slightly smaller font and icon on mobile screens
                        fontSize: isMobile ? "0.65rem" : "0.7rem", 
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        // Note: pointerEvents is 'none' so drag starts on the whole container
                        pointerEvents: "none",
                      }}
                    >
                      <FiMove size={isMobile ? 10 : 12} /> Drag
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteTarget(img)}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(220,53,69,0.85)",
                        border: "none",
                        borderRadius: "50%",
                        width: isMobile ? 28 : 32, // Smaller button on mobile
                        height: isMobile ? 28 : 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        // Make sure button has high z-index to be clickable
                        zIndex: 10,
                      }}
                      onMouseEnter={(e) =>
                        e.currentTarget.style.background = "rgba(220,53,69,1)"
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.style.background = "rgba(220,53,69,0.85)"
                      }
                    >
                      <FiTrash2 size={isMobile ? 12 : 14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

                {/* Preview */}
                <img
                  src={deleteTarget.imageUrl}
                  alt="To delete"
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: "1rem",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />

                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "#fff0f0",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.75rem",
                  }}
                >
                  <FiTrash2 size={20} color="#dc3545" />
                </div>

                <h6 className="fw-bold mb-2">Delete Image?</h6>
                <p className="text-muted small mb-4">
                  This image will be permanently removed from the gallery.
                  This action cannot be undone.
                </p>

                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-light px-4"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                     // Ensure buttons are easily tappable on mobile devices
                    style={isMobile ? { minHeight: 44, flex: 1 } : {}}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                     // Ensure buttons are easily tappable on mobile devices
                    style={isMobile ? { minHeight: 44, flex: 1 } : {}}
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

export default ManageGallery;