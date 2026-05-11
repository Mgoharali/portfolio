// src/components/layout/AdminLayout.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import {
  LayoutDashboard, FolderKanban, FileText,
  Cpu, MessageSquare, LogOut, ExternalLink, Menu, X
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin",           icon: LayoutDashboard },
  { label: "Projects",  to: "/admin/projects",  icon: FolderKanban },
  { label: "Blog Posts",to: "/admin/blog",      icon: FileText },
  { label: "Skills",    to: "/admin/skills",    icon: Cpu },
  { label: "Messages",  to: "/admin/messages",  icon: MessageSquare },
];

function SidebarContent({ pathname, onClose, handleLogout }) {
  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-soft)] flex items-center justify-center">
            <span className="text-[var(--accent)] font-mono text-sm font-bold select-none">&lt;/&gt;</span>
          </div>
          <span className="font-display font-bold text-[var(--text)]">Admin</span>
        </Link>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-[var(--subtle)] hover:text-[var(--text)] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none
                ${active
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--border)]"
                }
              `}
            >
              <Icon size={16} className="shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 pt-2 border-t border-[var(--border)] flex flex-col gap-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-all"
        >
          <ExternalLink size={16} className="shrink-0" />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--subtle)] hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
        >
          <LogOut size={16} className="shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Outside click to close
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/admin/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">

      {/* ── Desktop Sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col border-r border-[var(--border)] bg-[var(--surface)]/60 sticky top-0 h-screen overflow-hidden">
        <SidebarContent pathname={pathname} onClose={null} handleLogout={handleLogout} />
      </aside>

      {/* ── Mobile Sidebar backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden
          ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Mobile Sidebar drawer ── */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64
          bg-[var(--surface)] border-r border-[var(--border)]
          transition-transform duration-300 ease-out
          lg:hidden safe-bottom
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent
          pathname={pathname}
          onClose={() => setSidebarOpen(false)}
          handleLogout={handleLogout}
        />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border)]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
            className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--subtle)] hover:text-[var(--text)] transition-colors"
          >
            <Menu size={18} />
          </button>

          <span className="font-display font-semibold text-[var(--text)] text-sm">Admin Panel</span>

          <ThemeToggle />
        </header>

        {/* Desktop topbar — right-aligned theme toggle */}
        <div className="hidden lg:flex justify-end px-8 pt-6 pb-0">
          <ThemeToggle />
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
