// src/components/sections/Services.jsx
// ─────────────────────────────────────────────────────────────
// OPTIONAL SECTION — Add to Home.jsx if you want it:
//
//   import Services from "../components/sections/Services";
//   <Services />   ← paste inside <PageLayout> in Home.jsx
// ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    emoji: "🖥️",
    title: "Frontend Development",
    desc:  "Pixel-perfect, responsive UIs using React and modern CSS. Fast load times, smooth animations, and accessibility baked in.",
    items: ["React / Next.js", "Tailwind CSS", "TypeScript", "Responsive Design"],
  },
  {
    emoji: "⚙️",
    title: "Backend Development",
    desc:  "Robust APIs and server-side logic using Node.js. From REST APIs to real-time features, I build backends that scale.",
    items: ["Node.js / Express", "REST APIs", "Firebase", "PostgreSQL"],
  },
  {
    emoji: "📱",
    title: "Full Stack Apps",
    desc:  "End-to-end web applications — from database design to deployed product. I handle the whole stack so you don't have to.",
    items: ["Full Stack React", "Auth & Security", "CI/CD Pipelines", "Cloud Deployment"],
  },
  {
    emoji: "🎨",
    title: "UI/UX Consultation",
    desc:  "Design review and UX improvements for existing products. I help identify usability issues and suggest concrete improvements.",
    items: ["Design Review", "Figma Prototyping", "Accessibility Audit", "Performance Review"],
  },
];

export default function Services() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="accent-line" />
          <span className="text-[var(--accent)] text-xs font-mono uppercase tracking-widest">Services</span>
        </div>
        <h2 className="font-display font-bold text-3xl text-[var(--text)]">What I Do</h2>
        <p className="text-[var(--subtle)] mt-3 max-w-xl">
          I offer end-to-end development services for startups, agencies, and businesses looking to build or improve their digital products.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {SERVICES.map((service) => (
          <div key={service.title} className="card-glow rounded-2xl p-6 flex flex-col gap-4">
            <div className="text-3xl">{service.emoji}</div>
            <div>
              <h3 className="font-display font-semibold text-[var(--text)] text-lg mb-2">{service.title}</h3>
              <p className="text-[var(--subtle)] text-sm leading-relaxed">{service.desc}</p>
            </div>
            <ul className="space-y-2 mt-auto pt-4 border-t border-[var(--border)]">
              {service.items.map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-[var(--subtle)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}