// src/components/layout/Navbar.jsx
// Public navbar — NO admin button anywhere.
// Admin is accessed directly via /admin/login URL only.
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Blog",     to: "/blog" },
  { label: "Contact",  to: "/contact" },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const drawerRef    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const fn = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Top bar ─────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? "py-3 bg-[var(--bg)]/90 backdrop-blur-2xl border-b border-[var(--border)]"
            : "py-6 bg-transparent"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" aria-label="Home"
            className="group flex items-center gap-3 shrink-0">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg border border-[var(--gold-dim)]
                group-hover:border-[var(--accent)] transition-colors duration-300" />
              <span className="font-display font-bold text-sm text-[var(--accent)]
                tracking-wider select-none" style={{ fontStyle: "italic" }}>
                GA
              </span>
            </div>
            <span className="font-display font-medium text-[var(--text)] tracking-wide
              text-base hidden sm:block">
              Gohar<span className="text-[var(--accent)]">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => {
              const active = pathname === to;
              return (
                <Link key={to} to={to}
                  aria-current={active ? "page" : undefined}
                  className={`
                    relative px-4 py-2 text-sm font-medium tracking-wide
                    transition-colors duration-200 focus-visible:outline-none
                    ${active
                      ? "text-[var(--accent)]"
                      : "text-[var(--subtle)] hover:text-[var(--text)]"
                    }
                  `}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-px
                      bg-[var(--accent)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop right — theme toggle only */}
          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center
                justify-center text-[var(--subtle)] hover:text-[var(--text)]
                hover:border-[var(--gold-dim)] transition-all"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop ──────────────────────── */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-40 bg-[var(--bg)]/60 backdrop-blur-md
          transition-opacity duration-300 md:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Mobile drawer ────────────────────────── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw]
          bg-[var(--surface)] border-l border-[var(--border)]
          flex flex-col transition-transform duration-300 ease-out md:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5
          border-b border-[var(--border)]">
          <Link to="/" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-[var(--gold-dim)]
              flex items-center justify-center">
              <span className="font-display font-bold text-xs text-[var(--accent)] italic">
                GA
              </span>
            </div>
            <span className="font-display text-[var(--text)] font-medium">
              Gohar<span className="text-[var(--accent)]">.</span>
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
            className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center
              justify-center text-[var(--subtle)] hover:text-[var(--text)] transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Drawer links — public pages only */}
        <nav className="flex-1 px-4 py-8 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to}
                aria-current={active ? "page" : undefined}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl
                  text-sm font-medium tracking-wide transition-all duration-200
                  ${active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }
                `}
              >
                {active && (
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                )}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-[var(--border)]">
          <p className="text-[var(--muted)] text-xs font-mono tracking-wider">
            © {new Date().getFullYear()} Gohar Ali
          </p>
        </div>
      </div>
    </>
  );
}