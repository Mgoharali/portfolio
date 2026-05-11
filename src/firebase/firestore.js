// src/firebase/firestore.js
//
// ─── CACHING STRATEGY ────────────────────────────────────────
// Problem: Every page navigation re-fetches from Firebase, burning
// through the free-tier read quota (50,000 reads/day).
//
// Solution: Two-layer cache
//
//   Layer 1 — sessionStorage (persists across route changes in one tab)
//     • Projects, posts, skills are cached for SESSION_TTL ms (10 min)
//     • Cleared when the tab closes
//     • Admin write operations automatically bust the relevant cache
//
//   Layer 2 — in-memory Map (fastest, lives as long as the JS module)
//     • Sub-millisecond reads after first load
//     • Automatically populated on first fetch
//
// Result: Visiting Home → Projects → Blog in the same session = 3 reads
//         instead of potentially 100+. Admin CRUD always bypasses cache.
// ─────────────────────────────────────────────────────────────

import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// ─── Cache config ─────────────────────────────────────────────
const SESSION_TTL = 10 * 60 * 1000; // 10 minutes in ms
const memoryCache  = new Map();       // in-memory layer

function cacheKey(name) { return `portfolio_cache_${name}`; }

/**
 * Read from cache. Returns data if fresh, null if stale/missing.
 * Checks memory first, then sessionStorage.
 */
function readCache(name) {
  // 1. Memory hit
  if (memoryCache.has(name)) return memoryCache.get(name);

  // 2. sessionStorage hit
  try {
    const raw = sessionStorage.getItem(cacheKey(name));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > SESSION_TTL) {
      sessionStorage.removeItem(cacheKey(name));
      return null;
    }
    memoryCache.set(name, data); // promote to memory
    return data;
  } catch {
    return null;
  }
}

/**
 * Write to both memory and sessionStorage.
 */
function writeCache(name, data) {
  memoryCache.set(name, data);
  try {
    sessionStorage.setItem(cacheKey(name), JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // sessionStorage full or blocked — memory cache still works
  }
}

/**
 * Bust a specific cache key (called after admin writes).
 */
function bustCache(name) {
  memoryCache.delete(name);
  try { sessionStorage.removeItem(cacheKey(name)); } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch projects. Returns cached data if available and fresh.
 * @param {boolean} forceRefresh — set true in admin to always get latest
 */
export const getProjects = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = readCache("projects");
    if (cached) return cached;
  }
  const q    = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  writeCache("projects", data);
  return data;
};

export const addProject = async (data) => {
  const result = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  bustCache("projects"); // new project → invalidate cache
  return result;
};

export const updateProject = async (id, data) => {
  const result = await updateDoc(doc(db, "projects", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  bustCache("projects");
  return result;
};

export const deleteProject = async (id) => {
  const result = await deleteDoc(doc(db, "projects", id));
  bustCache("projects");
  return result;
};

// ═══════════════════════════════════════════════════════════════
//  BLOG POSTS
// ═══════════════════════════════════════════════════════════════

export const getPosts = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = readCache("posts");
    if (cached) return cached;
  }
  const q    = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  writeCache("posts", data);
  return data;
};

/**
 * Single post — cache individually by id.
 */
export const getPost = async (id, forceRefresh = false) => {
  const cName = `post_${id}`;
  if (!forceRefresh) {
    const cached = readCache(cName);
    if (cached) return cached;
  }
  const snap = await getDoc(doc(db, "posts", id));
  const data = snap.exists() ? { id: snap.id, ...snap.data() } : null;
  if (data) writeCache(cName, data);
  return data;
};

export const addPost = async (data) => {
  const result = await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  bustCache("posts");
  return result;
};

export const updatePost = async (id, data) => {
  const result = await updateDoc(doc(db, "posts", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  bustCache("posts");
  bustCache(`post_${id}`);
  return result;
};

export const deletePost = async (id) => {
  const result = await deleteDoc(doc(db, "posts", id));
  bustCache("posts");
  bustCache(`post_${id}`);
  return result;
};

// ═══════════════════════════════════════════════════════════════
//  SKILLS
// ═══════════════════════════════════════════════════════════════

export const getSkills = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = readCache("skills");
    if (cached) return cached;
  }
  const snap = await getDocs(collection(db, "skills"));
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  writeCache("skills", data);
  return data;
};

export const addSkill = async (data) => {
  const result = await addDoc(collection(db, "skills"), data);
  bustCache("skills");
  return result;
};

export const deleteSkill = async (id) => {
  const result = await deleteDoc(doc(db, "skills", id));
  bustCache("skills");
  return result;
};

// ═══════════════════════════════════════════════════════════════
//  MESSAGES  — never cached (always fresh for admin inbox)
// ═══════════════════════════════════════════════════════════════

export const addMessage = async (data) => {
  return await addDoc(collection(db, "messages"), {
    ...data,
    createdAt: serverTimestamp(),
    read: false,
  });
};

export const getMessages = async () => {
  // Messages intentionally NOT cached — admin needs real-time accuracy
  const q    = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const markMessageRead = async (id) => {
  return await updateDoc(doc(db, "messages", id), { read: true });
};