// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, FileText, Cpu, MessageSquare, ArrowRight, TrendingUp } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import { getProjects, getPosts, getSkills, getMessages } from "../../firebase/firestore.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, posts: 0, skills: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(true), getPosts(true), getSkills(true), getMessages()]).then(
      ([projects, posts, skills, messages]) => {
        setStats({
          projects: projects.length,
          posts: posts.length,
          skills: skills.length,
          messages: messages.length,
          unread: messages.filter(m => !m.read).length,
        });
        setLoading(false);
      }
    );
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, to: "/admin/projects", color: "accent" },
    { label: "Blog Posts", value: stats.posts, icon: FileText, to: "/admin/blog", color: "accent2" },
    { label: "Skills", value: stats.skills, icon: Cpu, to: "/admin/skills", color: "accent" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, to: "/admin/messages", color: "accent2", badge: stats.unread },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl text-[var(--text)] mb-2">Dashboard</h1>
          <p className="text-[var(--subtle)] text-sm">Welcome back. Here's your portfolio overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map(({ label, value, icon: Icon, to, color, badge }) => (
            <Link key={label} to={to} className="card-glow rounded-2xl bg-[var(--surface)] p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center`}>
                  <Icon size={18} className={`text-${color}`} />
                </div>
                {badge > 0 && (
                  <span className="text-xs font-mono bg-accent/20 text-[var(--accent)] px-2 py-0.5 rounded-full">
                    {badge} new
                  </span>
                )}
              </div>
              <p className="font-display font-bold text-3xl text-[var(--text)] mb-1">
                {loading ? "—" : value}
              </p>
              <p className="text-[var(--subtle)] text-sm flex items-center gap-1 group-hover:text-[var(--text)] transition-colors">
                {label} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="font-display font-semibold text-[var(--text)] mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--accent)]" /> Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Add New Project", to: "/admin/projects", desc: "Showcase your latest work" },
              { label: "Write a Blog Post", to: "/admin/blog", desc: "Share your thoughts" },
              { label: "Update Skills", to: "/admin/skills", desc: "Add or remove skills" },
              { label: "View Messages", to: "/admin/messages", desc: `${stats.unread} unread messages` },
            ].map(({ label, to, desc }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--border)]/40 transition-colors group"
              >
                <div>
                  <p className="text-[var(--text)] text-sm font-medium group-hover:text-[var(--accent)] transition-colors">{label}</p>
                  <p className="text-[var(--muted)] text-xs mt-0.5">{desc}</p>
                </div>
                <ArrowRight size={14} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}