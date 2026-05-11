// src/pages/Home.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Github, ExternalLink, Send,
  Mail, MapPin, Linkedin, Twitter,
  Github as GithubIcon, Code2, Layers, Smartphone, Palette,
} from "lucide-react";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import { getProjects, getSkills, addMessage } from "../firebase/firestore";
import { sanitizeForm, validateContactForm, checkRateLimit } from "../utils/sanitize";
import { useReveal } from "../hooks/useScrollReveal";

// ─── YOUR INFO ────────────────────────────────────────────────
const PROFILE = {
  name:      "Gohar Ali",
  role:      "Full Stack Developer",
  bio:       "I craft elegant, fast, and thoughtful digital products — from first concept to live deployment. Clean code, beautiful interfaces, real results.",
  location:  "Pakistan",
  email:     "muhammadgoharali514@gmail.com",
  available: true,
  github:    "https://github.com",
  linkedin:  "https://linkedin.com",
  twitter:   "https://twitter.com",
};

const SERVICES = [
  {
    icon: Code2, num: "01",
    title: "Frontend Development",
    desc:  "Pixel-perfect, responsive UIs with React. Smooth animations, fast load times, accessibility baked in.",
    items: ["React / Next.js", "Tailwind CSS", "TypeScript", "Responsive Design"],
  },
  {
    icon: Layers, num: "02",
    title: "Backend Development",
    desc:  "Robust APIs and server-side logic. From REST to real-time — built to scale reliably.",
    items: ["Node.js / Express", "REST APIs", "Firebase", "PostgreSQL"],
  },
  {
    icon: Smartphone, num: "03",
    title: "Full Stack Apps",
    desc:  "End-to-end applications — database architecture to deployed product, full stack handled.",
    items: ["Full Stack React", "Auth & Security", "CI/CD Pipelines", "Deployment"],
  },
  {
    icon: Palette, num: "04",
    title: "UI/UX Consultation",
    desc:  "Design reviews, accessibility audits, and UX improvements for existing products.",
    items: ["Design Review", "Figma Prototyping", "Accessibility Audit", "Performance"],
  },
];
// ─────────────────────────────────────────────────────────────

export default function Home() {
  const [projects,    setProjects]    = useState([]);
  const [skills,      setSkills]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState("");

  const heroRef     = useReveal();
  const aboutRef    = useReveal();
  const servicesRef = useReveal();
  const contactRef  = useReveal();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      getProjects().catch(() => []),
      getSkills().catch(() => []),
    ])
      .then(([p, s]) => {
        if (!alive) return;
        setProjects(Array.isArray(p) ? p.slice(0, 3) : []);
        setSkills(Array.isArray(s) ? s : []);
      })
      .catch(() => { if (alive) setFetchError("Could not load content."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <PageLayout>

      {/* ════════════════════════════════════════
          HERO — editorial split layout
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

        {/* Ambient warm glow blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.035] blur-[120px] rounded-full"
            style={{ background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-[-100px] w-[500px] h-[500px] opacity-[0.025] blur-[100px] rounded-full"
            style={{ background: "radial-gradient(circle, #d4836a 0%, transparent 70%)" }}
          />
          {/* Thin horizontal rule for editorial feel */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--border)] opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full py-32" ref={heroRef}>
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left — main headline */}
            <div className="lg:col-span-7">
              {/* Availability badge */}
              {PROFILE.available && (
                <div className="reveal-item flex items-center gap-3 mb-10">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold-dim)] bg-[var(--accent-soft)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    <span className="text-[var(--accent)] text-xs font-mono tracking-[0.12em] uppercase">
                      Open to work
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[var(--gold-dim)] to-transparent max-w-[80px]" />
                </div>
              )}

              {/* Display headline — Playfair Display */}
              <h1 className="reveal-item font-display leading-[1.06] tracking-tight mb-8">
                <span className="block text-5xl sm:text-6xl md:text-7xl text-[var(--text)] font-medium">
                  Crafting digital
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl font-medium" style={{ fontStyle: "italic", color: "var(--accent)" }}>
                  experiences
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl text-[var(--text)] font-medium">
                  with intent.
                </span>
              </h1>

              <p className="reveal-item text-[var(--subtle)] text-lg leading-relaxed max-w-lg mb-10 font-light">
                {PROFILE.bio}
              </p>

              <div className="reveal-item flex flex-wrap items-center gap-4">
                <Link to="/projects" className="btn-primary group">
                  View My Work
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--subtle)] text-sm font-medium hover:border-[var(--gold-dim)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-250"
                >
                  Let&apos;s Talk
                </Link>
              </div>
            </div>

            {/* Right — identity card */}
            <div className="reveal-item lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Decorative corner lines */}
                <div className="absolute -top-3 -left-3 w-12 h-12 border-t border-l border-[var(--gold-dim)]" />
                <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b border-r border-[var(--gold-dim)]" />

                <div className="card p-8 space-y-6">
                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center border border-[var(--gold-dim)] shrink-0"
                      style={{ background: "var(--accent-soft)" }}
                    >
                      <span className="font-display font-bold text-xl text-[var(--accent)]" style={{ fontStyle: "italic" }}>
                        {PROFILE.name.split(" ").map(w => w[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-medium text-[var(--text)] text-base">{PROFILE.name}</p>
                      <p className="text-[var(--subtle)] text-xs font-mono tracking-wide mt-0.5">{PROFILE.role}</p>
                    </div>
                  </div>

                  <div className="h-px bg-[var(--border)]" />

                  {/* Info rows */}
                  <div className="space-y-3.5">
                    {[
                      { label: "Location", value: PROFILE.location, icon: MapPin },
                      { label: "Status",   value: PROFILE.available ? "Available for hire" : "Not available", icon: null },
                      { label: "Email",    value: PROFILE.email, icon: Mail },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between gap-2">
                        <span className="text-[var(--subtle)] text-xs font-mono uppercase tracking-wider">{label}</span>
                        <span className="flex items-center gap-1.5 text-[var(--subtle)] text-sm font-light text-right">
                          {Icon && <Icon size={11} className="text-[var(--gold-dim)] shrink-0" />}
                          {label === "Status" && PROFILE.available && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          )}
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-[var(--border)]" />

                  {/* Social */}
                  <div className="flex items-center gap-2">
                    {[
                      { icon: GithubIcon, href: PROFILE.github,   label: "GitHub"   },
                      { icon: Linkedin,   href: PROFILE.linkedin, label: "LinkedIn" },
                      { icon: Twitter,    href: PROFILE.twitter,  label: "Twitter"  },
                    ].map(({ icon: Icon, href, label }) => (
                      <a
                        key={label} href={href} target="_blank"
                        rel="noopener noreferrer" aria-label={label}
                        className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--gold-dim)] hover:bg-[var(--accent-soft)] transition-all duration-200"
                      >
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-28">
        <div ref={aboutRef} className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left label column */}
          <div className="reveal-item lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="gold-line" />
              <span className="text-[var(--accent)] text-xs font-mono tracking-[0.15em] uppercase">About</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[var(--text)] leading-snug">
              Passionate about<br />
              <span style={{ fontStyle: "italic" }}>building things</span><br />
              that matter.
            </h2>
          </div>

          {/* Right content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="reveal-item space-y-5 text-[var(--subtle)] leading-relaxed font-light text-base">
              <p>
                I&apos;m <strong className="text-[var(--text)] font-medium">{PROFILE.name}</strong>, a Full Stack
                Developer based in {PROFILE.location}. I specialize in building modern web applications —
                from architecture and design to deployment and beyond.
              </p>
              <p>
                My focus is on writing clean, maintainable code and crafting interfaces that are both
                beautiful and functional. I believe the best digital products are the ones that feel
                effortless to use.
              </p>
              <p>
                Currently available for freelance projects and full-time opportunities.
              </p>
            </div>

            {/* Info grid */}
            <div className="reveal-item grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Role",     value: "Full Stack Dev" },
                { label: "Location", value: PROFILE.location },
                { label: "Status",   value: "Available ✓"   },
                { label: "Focus",    value: "Web & Apps"     },
                { label: "Email",    value: PROFILE.email    },
                { label: "Style",    value: "Clean & Fast"   },
              ].map(({ label, value }) => (
                <div key={label} className="py-4 px-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold-dim)] transition-colors duration-250">
                  <p className="text-[var(--subtle)] text-xs font-mono uppercase tracking-wider mb-1.5">{label}</p>
                  <p className="text-[var(--text)] text-sm font-light break-words">{value}</p>
                </div>
              ))}
            </div>

            <div className="reveal-item flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary group text-sm py-2.5 px-5">
                My Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--subtle)] text-sm font-medium hover:border-[var(--gold-dim)] hover:text-[var(--accent)] transition-all"
              >
                <Mail size={14} /> Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <div ref={servicesRef}>

          <div className="reveal-item flex items-end justify-between mb-14 border-b border-[var(--border)] pb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="gold-line" />
                <span className="text-[var(--accent)] text-xs font-mono tracking-[0.15em] uppercase">Services</span>
              </div>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-[var(--text)]">
                What I <span style={{ fontStyle: "italic" }}>do</span>
              </h2>
            </div>
            <span className="text-[var(--subtle)] font-mono text-xs hidden sm:block">— 04 services</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="reveal-item card card-gold group p-7 flex flex-col gap-5"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] border border-[var(--gold-dim)] flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors duration-300">
                      <Icon size={20} className="text-[var(--accent)] group-hover:text-[#0f0e0c] transition-colors duration-300" />
                    </div>
                    <span className="font-mono text-xs text-[var(--subtle)] tracking-wider">{svc.num}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-[var(--text)] text-xl mb-2.5 group-hover:text-[var(--accent)] transition-colors duration-200">
                      {svc.title}
                    </h3>
                    <p className="text-[var(--subtle)] text-sm leading-relaxed font-light">{svc.desc}</p>
                  </div>
                  <ul className="space-y-2 mt-auto pt-5 border-t border-[var(--border)]">
                    {svc.items.map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--subtle)]">                        
                        <span className="w-1 h-1 rounded-full bg-[var(--gold-dim)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SKILLS
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <div className="flex items-center gap-3 mb-4">
          <span className="gold-line" />
          <span className="text-[var(--accent)] text-xs font-mono tracking-[0.15em] uppercase">Tech Stack</span>
        </div>
        <h2 className="font-display font-medium text-3xl text-[var(--text)] mb-10">
          Skills <span style={{ fontStyle: "italic" }}>& Tools</span>
        </h2>

        {loading && <SkillSkeleton />}
        {!loading && fetchError && <ErrorMsg msg={fetchError} />}
        {!loading && !fetchError && (
          <div className="flex flex-wrap gap-2.5">
            {skills.length === 0
              ? <p className="text-[var(--subtle)] text-sm font-mono">No skills added yet — add via Admin panel.</p>
              : skills.map((skill, i) => (
                  <div
                    key={skill.id || i}
                    className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--subtle)] text-sm font-light hover:border-[var(--gold-dim)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-200 cursor-default"
                  >
                    {skill.category
                      ? <span className="text-[var(--subtle)] text-xs font-mono mr-2">{skill.category}</span>
                      : null}
                    {skill.name || ""}
                  </div>
                ))
            }
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          PROJECTS
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-14 border-b border-[var(--border)] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="gold-line" />
              <span className="text-[var(--accent)] text-xs font-mono tracking-[0.15em] uppercase">Work</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[var(--text)]">
              Featured <span style={{ fontStyle: "italic" }}>Projects</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:inline-flex items-center gap-2 text-[var(--subtle)] text-sm hover:text-[var(--accent)] transition-colors group"
          >
            All projects
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading && <ProjectSkeleton />}
        {!loading && fetchError && <ErrorMsg msg={fetchError} />}
        {!loading && !fetchError && (
          <div>
            {projects.length === 0
              ? <p className="text-[var(--subtle)] text-sm font-mono">No projects yet — add via Admin panel.</p>
              : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projects.map((project, i) => (
                    <ProjectCard key={project.id || i} project={project} />
                  ))}
                </div>
            }
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 pb-32">
        <div ref={contactRef} className="reveal-item">
          {/* Section header */}
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="gold-line" />
                <span className="text-[var(--accent)] text-xs font-mono tracking-[0.15em] uppercase">Contact</span>
              </div>
              <h2 className="font-display font-medium text-4xl sm:text-5xl text-[var(--text)] leading-tight">
                Let&apos;s build<br />
                <span style={{ fontStyle: "italic", color: "var(--accent)" }}>something</span><br />
                together.
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end gap-6">
              <p className="text-[var(--subtle)] text-base font-light leading-relaxed max-w-md">
                Have a project in mind or want to collaborate? I&apos;m always open to interesting
                conversations and new opportunities.
              </p>
              {/* Contact info row */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Mail,   value: PROFILE.email    },
                  { icon: MapPin, value: PROFILE.location },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} className="flex items-center gap-2.5 text-sm text-[var(--subtle)]">
                    <Icon size={14} className="text-[var(--accent)]" />
                    {value}
                  </div>
                ))}
              </div>
              {/* Socials */}
              <div className="flex gap-3">
                {[
                  { icon: GithubIcon, href: PROFILE.github,   label: "GitHub"   },
                  { icon: Linkedin,   href: PROFILE.linkedin, label: "LinkedIn" },
                  { icon: Twitter,    href: PROFILE.twitter,  label: "Twitter"  },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--gold-dim)] hover:bg-[var(--accent-soft)] transition-all duration-200">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="card p-8 sm:p-12">
            <ContactForm />
          </div>
        </div>
      </section>

    </PageLayout>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="gold-line" />
      <span className="text-[var(--accent)] text-xs font-mono tracking-[0.15em] uppercase">{label}</span>
    </div>
  );
}

function ErrorMsg({ msg }) {
  return <p className="text-red-400 text-sm font-mono py-4">{msg || "Something went wrong."}</p>;
}

function SkillSkeleton() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {[80,110,70,95,60,120,75,90,65,100,80,110].map((w, i) => (
        <div key={i} className="skeleton h-9 rounded-full" style={{ width: w }} />
      ))}
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[0,1,2].map(i => (
        <div key={i} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-7 space-y-4">
          <div className="skeleton h-11 w-11 rounded-xl" />
          <div className="skeleton h-5 w-3/4 rounded-lg" />
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-4/5 rounded-lg" />
          <div className="flex gap-2 pt-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project }) {
  if (!project) return null;
  return (
    <div className="card card-gold group p-7 flex flex-col gap-5 h-full">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] border border-[var(--gold-dim)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
          {project.emoji || "◈"}
        </div>
        <div className="flex gap-1.5">
          {project.github ? (
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold-dim)] transition-all p-1.5">
              <Github size={14} />
            </a>
          ) : null}
          {project.live ? (
            <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live"
              className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--gold-dim)] transition-all p-1.5">
              <ExternalLink size={14} />
            </a>
          ) : null}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-display font-medium text-[var(--text)] text-xl mb-2.5 group-hover:text-[var(--accent)] transition-colors duration-200">
          {project.title || "Untitled"}
        </h3>
        <p className="text-[var(--subtle)] text-sm leading-relaxed font-light line-clamp-3">
          {project.description || ""}
        </p>
      </div>
      {Array.isArray(project.tags) && project.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────
const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

function ContactForm() {
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [errors,  setErrors]  = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validateContactForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!checkRateLimit("contact")) {
      toast.error("Too many submissions. Please try again later.");
      return;
    }
    setLoading(true);
    try {
      await addMessage(sanitizeForm(form));
      setSent(true);
      setForm(EMPTY_FORM);
      toast.success("Message sent!");
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
        <div className="w-16 h-16 rounded-2xl border border-[var(--gold-dim)] bg-[var(--accent-soft)] flex items-center justify-center text-3xl">
          ✦
        </div>
        <div>
          <h3 className="font-display font-medium text-2xl text-[var(--text)] mb-2">Message Sent</h3>
          <p className="text-[var(--subtle)] text-sm font-light max-w-xs">
            Thank you for reaching out. I&apos;ll be in touch within 24 hours.
          </p>
        </div>
        <button type="button" onClick={() => setSent(false)}
          className="text-[var(--accent)] text-sm hover:underline underline-offset-4 font-light">
          Send another →
        </button>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-8">
      {/* Left — heading */}
      <div className="flex flex-col justify-between gap-6">
        <div>
          <h3 className="font-display font-medium text-2xl text-[var(--text)] mb-2">
            Send a message
          </h3>
          <p className="text-[var(--subtle)] text-sm">
            Fill in the form and I&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <div className="hidden sm:block text-[var(--subtle)] font-mono text-xs space-y-1">
          <p>✦ Usually replies within 24h</p>
          <p>✦ Open to all project types</p>
        </div>
      </div>

      {/* Right — form fields */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field id="f-name" label="Name *" error={errors.name}>
            <input id="f-name" type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="John Doe" autoComplete="name"
              className={`input-field ${errors.name ? "border-red-400/60" : ""}`} />
          </Field>
          <Field id="f-email" label="Email *" error={errors.email}>
            <input id="f-email" type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="john@example.com" autoComplete="email"
              className={`input-field ${errors.email ? "border-red-400/60" : ""}`} />
          </Field>
        </div>
        <Field id="f-subject" label="Subject">
          <input id="f-subject" type="text" name="subject" value={form.subject}
            onChange={handleChange} placeholder="Project inquiry"
            className="input-field" />
        </Field>
        <Field id="f-message" label="Message *" error={errors.message}>
          <textarea id="f-message" name="message" value={form.message}
            onChange={handleChange} rows={4}
            placeholder="Tell me about your project..."
            className={`input-field resize-none ${errors.message ? "border-red-400/60" : ""}`} />
        </Field>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading
            ? <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            : <><Send size={14} /> Send Message</>
          }
        </button>
      </form>
    </div>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
      {error ? <p className="text-red-400 text-xs mt-1 font-light">{error}</p> : null}
    </div>
  );
}