// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Projects", to: "/projects" },
    { label: "Services", to: "/services" },
  { label: "Blog",     to: "/blog" },
  { label: "Contact",  to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const mobileMenuRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // Trap scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? "py-3 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]"
            : "py-5 bg-transparent"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            aria-label="Go to homepage"
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-soft)] flex items-center justify-center group-hover:bg-[var(--accent-soft)] transition-colors">
              <span className="text-[var(--accent)] font-mono text-sm font-bold select-none">&lt;/&gt;</span>
            </div>
            <span className="font-display font-bold text-[var(--text)] text-lg tracking-tight">
              dev<span className="text-[var(--accent)]">.</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ label, to }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none
                    ${active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                    }
                  `}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Right: Theme + Admin ── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft)] hover:opacity-80 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
            >
              Admin
            </Link>
          </div>

          {/* ── Mobile Right: Theme + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--subtle)] hover:text-[var(--text)] hover:border-[var(--border-soft)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw]
          bg-[var(--surface)] border-l border-[var(--border)]
          flex flex-col
          transition-transform duration-300 ease-out
          md:hidden safe-bottom
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <Link to="/" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-soft)] flex items-center justify-center">
              <span className="text-[var(--accent)] font-mono text-xs font-bold">&lt;/&gt;</span>
            </div>
            <span className="font-display font-bold text-[var(--text)]">dev<span className="text-[var(--accent)]">.</span></span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--subtle)] hover:text-[var(--text)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={`
                  flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-[var(--border)]" />

          <Link
            to="/admin"
            className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-soft)] hover:opacity-80 transition-all"
          >
            Admin Panel
          </Link>
        </nav>
      </div>
    </>
  );
}
