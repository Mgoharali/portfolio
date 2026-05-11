// src/pages/Projects.jsx
import { useEffect, useState } from "react";
import { Github, ExternalLink, Search } from "lucide-react";
import PageLayout from "../components/layout/PageLayout.jsx";
import { getProjects } from "../firebase/firestore.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getProjects()
      .then(p => { if (alive) { setProjects(Array.isArray(p) ? p : []); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="accent-line"></span>
            <span className="text-[var(--accent)] text-xs font-mono uppercase tracking-widest">Portfolio</span>
          </div>
          <h1 className="font-display font-bold text-5xl text-[var(--text)] mb-4">Projects</h1>
          <p className="text-[var(--subtle)] text-lg max-w-xl">
            A collection of things I've built — from side projects to serious work.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-12">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--muted)] font-mono text-sm">No projects found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div key={project.id} className="card-glow rounded-2xl bg-[var(--surface)] p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-soft)] flex items-center justify-center text-lg">
                    {project.emoji || "⚡"}
                  </div>
                  <div className="flex gap-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="text-[var(--subtle)] hover:text-[var(--text)] transition-colors">
                        <Github size={16} />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                        className="text-[var(--subtle)] hover:text-[var(--accent)] transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[var(--text)] text-lg mb-2">{project.title}</h3>
                  <p className="text-[var(--subtle)] text-sm leading-relaxed">{project.description}</p>
                </div>
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}