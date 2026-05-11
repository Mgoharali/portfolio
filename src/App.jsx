// src/App.jsx
import { lazy, Suspense, memo } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'

// ── Public pages: eagerly loaded (small, user always sees these) ──
import Home     from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Blog     from './pages/Blog.jsx'
import Contact  from './pages/Contact.jsx'

// ── Heavy pages: lazily loaded (only downloaded when visited) ──
// BlogPost loads react-markdown + remark-gfm (~45KB gzip) — defer it
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))

// Admin chunk: loads firebase/auth + MD editor (~120KB gzip) only when needed
const AdminLogin    = lazy(() => import('./pages/admin/Login.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'))
const AdminBlog     = lazy(() => import('./pages/admin/AdminBlog.jsx'))
const AdminSkills   = lazy(() => import('./pages/admin/AdminSkills.jsx'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'))

// ── Minimal fallback — no spinner, no layout shift ──────────────
function PageFallback() {
  return (
    <div
      aria-hidden="true"
      style={{ minHeight: '100vh', background: 'var(--bg)' }}
    />
  )
}

// ── Scroll to top on route change ───────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// ── Protected route (memoized — never re-renders unnecessarily) ─
const ProtectedRoute = memo(({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageFallback />
  return user ? children : <Navigate to="/admin/login" replace />
})
ProtectedRoute.displayName = 'ProtectedRoute'

// ── Routes ──────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog"     element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact"  element={<Contact />} />

          {/* Admin — lazy loaded, auth guarded */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"
            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects"
            element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/blog"
            element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
          <Route path="/admin/skills"
            element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/messages"
            element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

// ── Theme-aware Toaster (memoized) ──────────────────────────────
const ThemedToaster = memo(function ThemedToaster() {
  const { isDark } = useTheme()
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: isDark ? 'var(--surface)' : 'var(--surface)',
          color:      'var(--text)',
          border:     '1px solid var(--border)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize:   '0.875rem',
          boxShadow:  'var(--shadow-md)',
        },
      }}
    />
  )
})

// ── Root ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ThemedToaster />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}