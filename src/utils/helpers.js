// ── Slug Generator ─────────────────────────────────────────
// "Cashew Nuts" → "cashew-nuts"
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces → hyphens
    .replace(/[^\w-]+/g, "")     // remove special chars
    .replace(/--+/g, "-")        // double hyphens → single
    .replace(/^-+/, "")          // trim leading hyphens
    .replace(/-+$/, "");         // trim trailing hyphens
};

// ── Format Date ────────────────────────────────────────────
// Firestore timestamp → "March 02, 2026"
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });
};

// ── Truncate Text ──────────────────────────────────────────
// "Long text..." → truncated at n chars
export const truncateText = (text, maxLength = 120) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

// ── Format File Size ───────────────────────────────────────
export const formatFileSize = (bytes) => {
  if (bytes < 1024)        return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};