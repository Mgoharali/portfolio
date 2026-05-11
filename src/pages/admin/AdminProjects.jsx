// src/pages/admin/AdminProjects.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getProjects, addProject, updateProject, deleteProject } from "../../firebase/firestore";

const empty = { title: "", description: "", emoji: "⚡", tags: "", github: "", live: "" };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => getProjects().then(setProjects);
  useEffect(() => { load(); }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    setLoading(true);
    try {
      const data = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      if (editId) {
        await updateProject(editId, data);
        toast.success("Project updated!");
      } else {
        await addProject(data);
        toast.success("Project added!");
      }
      setForm(empty); setEditId(null); setShowForm(false);
      load();
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(", ") : "" });
    setEditId(p.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id); toast.success("Deleted"); load();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-[var(--text)]">Projects</h1>
            <p className="text-[var(--subtle)] text-sm mt-1">{projects.length} projects total</p>
          </div>
          <button
            onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-[var(--bg)]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-[var(--text)] text-lg">
                  {editId ? "Edit Project" : "New Project"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-[var(--subtle)] hover:text-[var(--text)]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: "emoji", label: "Emoji", placeholder: "⚡" },
                  { name: "title", label: "Title *", placeholder: "My Awesome Project" },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
                  </div>
                ))}

                <div>
                  <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                    placeholder="What does this project do?"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors resize-none" />
                </div>

                <div>
                  <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, Firebase, Tailwind"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
                </div>

                {[
                  { name: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
                  { name: "live", label: "Live URL", placeholder: "https://..." },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="block text-[var(--subtle)] text-xs font-mono uppercase tracking-widest mb-2">{label}</label>
                    <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] text-sm focus:outline-none focus:border-[var(--accent-soft)] transition-colors" />
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent/90 transition-all disabled:opacity-50">
                    <Save size={14} /> {loading ? "Saving..." : "Save Project"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-3 rounded-xl bg-[var(--border)]/50 text-[var(--subtle)] hover:text-[var(--text)] transition-colors text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-20 text-[var(--muted)] font-mono text-sm">
              No projects yet. Add your first one!
            </div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border)]/80 transition-colors">
                <span className="text-2xl">{p.emoji || "⚡"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text)] text-sm">{p.title}</p>
                  <p className="text-[var(--subtle)] text-xs mt-0.5 truncate">{p.description}</p>
                  {p.tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(p)}
                    className="w-8 h-8 rounded-lg bg-[var(--border)]/50 flex items-center justify-center text-[var(--subtle)] hover:text-[var(--text)] transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="w-8 h-8 rounded-lg bg-[var(--border)]/50 flex items-center justify-center text-[var(--subtle)] hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
