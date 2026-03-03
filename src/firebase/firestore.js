import { db } from "./config";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where,
  orderBy, serverTimestamp, limit, startAfter,
} from "firebase/firestore";
import { generateSlug } from "../utils/helpers";

// ─────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────

export const getCategories = async () => {
  const snap = await getDocs(
    query(collection(db, "categories"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getCategoryBySlug = async (slug) => {
  const snap = await getDocs(
    query(collection(db, "categories"), where("slug", "==", slug))
  );
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const addCategory = async (data) => {
  const slug = generateSlug(data.name);
  return await addDoc(collection(db, "categories"), {
    ...data,
    slug,
    createdAt: serverTimestamp(),
  });
};

export const updateCategory = async (id, data) => {
  const slug = generateSlug(data.name);
  return await updateDoc(doc(db, "categories", id), { ...data, slug });
};

export const deleteCategory = async (id) => {
  const productsSnap = await getDocs(
    query(collection(db, "products"), where("categoryId", "==", id))
  );
  if (!productsSnap.empty) {
    throw new Error(
      "Cannot delete this category. Please remove or reassign all products first."
    );
  }
  return await deleteDoc(doc(db, "categories", id));
};

// ─────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────

export const getProducts = async () => {
  const snap = await getDocs(
    query(collection(db, "products"), orderBy("createdAt", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProductsByCategory = async (categoryId) => {
  const snap = await getDocs(
    query(collection(db, "products"), where("categoryId", "==", categoryId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Load more pagination for products page
export const getProductsByCategoryPaginated = async (
  categoryId,
  pageSize = 9,
  lastDoc = null
) => {
  let q = query(
    collection(db, "products"),
    where("categoryId", "==", categoryId),
    limit(pageSize)
  );
  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snap = await getDocs(q);
  const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const lastVisible = snap.docs[snap.docs.length - 1] || null;
  const hasMore = snap.docs.length === pageSize;

  return { products, lastVisible, hasMore };
};

export const addProduct = async (data) => {
  const slug = generateSlug(data.name);
  return await addDoc(collection(db, "products"), {
    ...data,
    slug,
    createdAt: serverTimestamp(),
  });
};

export const updateProduct = async (id, data) => {
  const slug = generateSlug(data.name);
  return await updateDoc(doc(db, "products", id), { ...data, slug });
};

export const deleteProduct = async (id) => {
  return await deleteDoc(doc(db, "products", id));
};

// ─────────────────────────────────────────────────────────
// INQUIRIES
// ─────────────────────────────────────────────────────────

export const addInquiry = async (data) => {
  return await addDoc(collection(db, "inquiries"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
};

// ─────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────

export const getGalleryImages = async () => {
  const snap = await getDocs(
    query(collection(db, "gallery"), orderBy("order", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addGalleryImage = async (data) => {
  // Get current max order
  const snap = await getDocs(collection(db, "gallery"));
  const maxOrder = snap.docs.reduce((max, d) => {
    return Math.max(max, d.data().order || 0);
  }, 0);

  return await addDoc(collection(db, "gallery"), {
    ...data,
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
  });
};

export const updateGalleryOrder = async (id, order) => {
  return await updateDoc(doc(db, "gallery", id), { order });
};

export const deleteGalleryImage = async (id) => {
  return await deleteDoc(doc(db, "gallery", id));
};

// ─────────────────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────────────────

export const getBlogs = async (publishedOnly = true) => {
  let q;
  if (publishedOnly) {
    q = query(
      collection(db, "blogs"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getBlogBySlug = async (slug) => {
  const snap = await getDocs(
    query(collection(db, "blogs"), where("slug", "==", slug))
  );
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const addBlog = async (data) => {
  const slug = generateSlug(data.title);
  return await addDoc(collection(db, "blogs"), {
    ...data,
    slug,
    published: false,
    createdAt: serverTimestamp(),
  });
};

export const updateBlog = async (id, data) => {
  const slug = generateSlug(data.title);
  return await updateDoc(doc(db, "blogs", id), { ...data, slug });
};

export const toggleBlogPublish = async (id, published) => {
  return await updateDoc(doc(db, "blogs", id), { published });
};

export const deleteBlog = async (id) => {
  return await deleteDoc(doc(db, "blogs", id));
};